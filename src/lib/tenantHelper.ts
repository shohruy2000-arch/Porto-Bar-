import { NextRequest } from 'next/server';
import { serverDb } from '../data/serverDb';

export const getTenantIdFromRequest = (req: NextRequest): string => {
  const headerTenant = req.headers.get('x-tenant-id');
  if (headerTenant && headerTenant.trim()) return headerTenant.trim();

  const queryTenant = req.nextUrl?.searchParams?.get('tenant');
  if (queryTenant && queryTenant.trim()) return queryTenant.trim();

  const host = req.headers.get('host') || '';
  const restaurant = serverDb.getRestaurantByDomain(host);
  return restaurant?.id || 'porto-bar';
};
