/**
 * @file src/lib/serverContext.ts
 * @description Server-side execution context utilities for retrieving tenant information and repository instances.
 */

import { NextRequest } from 'next/server';
import { RepositoryFactory } from '../repositories/RepositoryFactory';
import { ITenantRepository, IMenuRepository, IOrderRepository } from '../repositories/interfaces';
import { Tenant } from '../types';

/**
 * Extract tenant identifier from request headers (injected by middleware) or query params
 * @param request - Inbound NextRequest or standard Request
 */
export function getTenantId(request: NextRequest | Request): string {
  // 1. Check header injected by middleware
  const headerTenant = request.headers.get('x-tenant-id');
  if (headerTenant && headerTenant.trim()) {
    return headerTenant.trim().toLowerCase();
  }

  // 2. Check query parameter if NextRequest
  if ('nextUrl' in request && request.nextUrl?.searchParams) {
    const queryTenant = request.nextUrl.searchParams.get('tenant');
    if (queryTenant && queryTenant.trim()) {
      return queryTenant.trim().toLowerCase();
    }
  }

  // 3. Check raw URL search params if standard Request
  try {
    const url = new URL(request.url);
    const queryTenant = url.searchParams.get('tenant');
    if (queryTenant && queryTenant.trim()) {
      return queryTenant.trim().toLowerCase();
    }
  } catch {
    // Ignore URL parse error
  }

  // 4. Default fallback
  return 'porto-bar';
}

/**
 * Helper to fetch the Tenant entity from the tenant repository
 * @param request - Inbound request
 */
export async function getResolvedTenant(request: NextRequest | Request): Promise<Tenant | null> {
  const tenantId = getTenantId(request);
  const tenantRepo = RepositoryFactory.getTenantRepository();
  let tenant = await tenantRepo.getById(tenantId);
  if (!tenant) {
    tenant = await tenantRepo.getBySlug(tenantId);
  }
  if (!tenant) {
    tenant = await tenantRepo.getById('porto-bar');
  }
  return tenant;
}

/**
 * Helper accessors for Repository instances
 */
export function getTenantRepository(): ITenantRepository {
  return RepositoryFactory.getTenantRepository();
}

export function getMenuRepository(): IMenuRepository {
  return RepositoryFactory.getMenuRepository();
}

export function getOrderRepository(): IOrderRepository {
  return RepositoryFactory.getOrderRepository();
}
