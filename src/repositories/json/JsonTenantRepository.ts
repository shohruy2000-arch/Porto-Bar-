/**
 * @file src/repositories/json/JsonTenantRepository.ts
 * @description JSON file-based implementation of ITenantRepository with in-memory caching.
 */

import fs from 'fs';
import path from 'path';
import { ITenantRepository } from '../interfaces';
import { Tenant } from '../../types';
import { INITIAL_CATEGORIES, INITIAL_DISHES, INITIAL_PROMOTIONS } from '../../data/initialMenu';

export class JsonTenantRepository implements ITenantRepository {
  private readonly dataDir: string;
  private readonly restaurantsFile: string;
  private readonly tenantsDir: string;
  private cache: Tenant[] | null = null;
  private lastCacheTime = 0;
  private readonly CACHE_TTL_MS = 60 * 1000; // 1 minute TTL

  constructor() {
    this.dataDir = path.join(process.cwd(), 'src', 'data', 'db');
    this.restaurantsFile = path.join(this.dataDir, 'restaurants.json');
    this.tenantsDir = path.join(this.dataDir, 'tenants');
    this.ensureDirectoryExists(this.dataDir);
    this.ensureDirectoryExists(this.tenantsDir);
  }

  private ensureDirectoryExists(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private invalidateCache(): void {
    this.cache = null;
    this.lastCacheTime = 0;
  }

  private readAllSync(): Tenant[] {
    const now = Date.now();
    if (this.cache && now - this.lastCacheTime < this.CACHE_TTL_MS) {
      return this.cache;
    }

    try {
      if (!fs.existsSync(this.restaurantsFile)) {
        this.cache = [];
        return [];
      }
      const content = fs.readFileSync(this.restaurantsFile, 'utf-8');
      this.cache = JSON.parse(content) as Tenant[];
      this.lastCacheTime = now;
      return this.cache;
    } catch (err) {
      console.error('[JsonTenantRepository] Failed to read restaurants.json:', err);
      return [];
    }
  }

  private writeAllSync(tenants: Tenant[]): boolean {
    try {
      this.ensureDirectoryExists(this.dataDir);
      fs.writeFileSync(this.restaurantsFile, JSON.stringify(tenants, null, 2), 'utf-8');
      this.cache = tenants;
      this.lastCacheTime = Date.now();
      return true;
    } catch (err) {
      console.error('[JsonTenantRepository] Failed to write restaurants.json:', err);
      this.invalidateCache();
      return false;
    }
  }

  public async getById(id: string): Promise<Tenant | null> {
    const tenants = this.readAllSync();
    const cleanId = id.toLowerCase().trim();
    const found = tenants.find(t => t.id.toLowerCase() === cleanId || t.slug.toLowerCase() === cleanId);
    return found || null;
  }

  public async getBySlug(slug: string): Promise<Tenant | null> {
    const tenants = this.readAllSync();
    const cleanSlug = slug.toLowerCase().trim();
    const found = tenants.find(t => t.slug.toLowerCase() === cleanSlug || t.id.toLowerCase() === cleanSlug);
    return found || null;
  }

  public async getByDomain(domain: string): Promise<Tenant | null> {
    const tenants = this.readAllSync();
    const cleanDomain = domain.toLowerCase().split(':')[0].trim();

    // 1. Direct domain match
    const directMatch = tenants.find(t =>
      t.domains && t.domains.some(d => d.toLowerCase() === cleanDomain)
    );
    if (directMatch) return directMatch;

    // 2. Slug match or subdomain match (e.g. steak.starterapp.ru)
    const slugMatch = tenants.find(t =>
      t.slug.toLowerCase() === cleanDomain ||
      cleanDomain.startsWith(`${t.slug.toLowerCase()}.`)
    );
    if (slugMatch) return slugMatch;

    // 3. Fallback to default/root tenant (porto-bar)
    const fallback = tenants.find(t => t.id === 'porto-bar') || tenants[0] || null;
    return fallback;
  }

  public async getAll(): Promise<Tenant[]> {
    return this.readAllSync();
  }

  public async create(data: Omit<Tenant, 'createdAt'>): Promise<Tenant> {
    const tenants = this.readAllSync();
    const newTenant: Tenant = {
      ...data,
      createdAt: new Date().toISOString(),
      stats: {
        totalGmv: 0,
        totalOrders: 0,
        activeMembers: 0
      }
    };

    // Initialize tenant storage directory with initial starter data
    const tenantSpecificDir = path.join(this.tenantsDir, newTenant.id);
    this.ensureDirectoryExists(tenantSpecificDir);

    fs.writeFileSync(path.join(tenantSpecificDir, 'dishes.json'), JSON.stringify(INITIAL_DISHES, null, 2), 'utf-8');
    fs.writeFileSync(path.join(tenantSpecificDir, 'categories.json'), JSON.stringify(INITIAL_CATEGORIES, null, 2), 'utf-8');
    fs.writeFileSync(path.join(tenantSpecificDir, 'promotions.json'), JSON.stringify(INITIAL_PROMOTIONS, null, 2), 'utf-8');
    fs.writeFileSync(path.join(tenantSpecificDir, 'orders.json'), JSON.stringify([], null, 2), 'utf-8');
    fs.writeFileSync(path.join(tenantSpecificDir, 'reservations.json'), JSON.stringify([], null, 2), 'utf-8');
    fs.writeFileSync(path.join(tenantSpecificDir, 'waiter_calls.json'), JSON.stringify([], null, 2), 'utf-8');
    fs.writeFileSync(path.join(tenantSpecificDir, 'loyalty.json'), JSON.stringify([], null, 2), 'utf-8');
    fs.writeFileSync(path.join(tenantSpecificDir, 'push_subscriptions.json'), JSON.stringify([], null, 2), 'utf-8');

    tenants.push(newTenant);
    this.writeAllSync(tenants);
    return newTenant;
  }

  public async update(id: string, data: Partial<Tenant>): Promise<Tenant | null> {
    const tenants = this.readAllSync();
    const idx = tenants.findIndex(t => t.id === id || t.slug === id);
    if (idx === -1) return null;

    tenants[idx] = { ...tenants[idx], ...data };
    this.writeAllSync(tenants);
    return tenants[idx];
  }

  public async delete(id: string): Promise<boolean> {
    if (id === 'porto-bar') {
      // Protect root default tenant from accidental deletion
      return false;
    }
    const tenants = this.readAllSync();
    const filtered = tenants.filter(t => t.id !== id && t.slug !== id);
    if (filtered.length === tenants.length) return false;

    this.writeAllSync(filtered);
    return true;
  }
}
