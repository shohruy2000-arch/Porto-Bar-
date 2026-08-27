/**
 * @file src/repositories/json/JsonMenuRepository.ts
 * @description JSON file-based implementation of IMenuRepository with tenant-level caching.
 */

import fs from 'fs';
import path from 'path';
import { IMenuRepository } from '../interfaces';
import { Category, Dish, Promotion } from '../../types';
import { INITIAL_CATEGORIES, INITIAL_DISHES, INITIAL_PROMOTIONS } from '../../data/initialMenu';

export class JsonMenuRepository implements IMenuRepository {
  private readonly dataDir: string;
  private readonly tenantsDir: string;

  // In-memory caches keyed by tenantId
  private dishesCache: Map<string, { data: Dish[]; timestamp: number }> = new Map();
  private categoriesCache: Map<string, { data: Category[]; timestamp: number }> = new Map();
  private promotionsCache: Map<string, { data: Promotion[]; timestamp: number }> = new Map();
  private readonly CACHE_TTL_MS = 60 * 1000;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'src', 'data', 'db');
    this.tenantsDir = path.join(this.dataDir, 'tenants');
  }

  private getFilePath(fileName: string, tenantId?: string): string {
    if (!tenantId || tenantId === 'porto-bar' || tenantId === 'default') {
      return path.join(this.dataDir, fileName);
    }
    const tenantDir = path.join(this.tenantsDir, tenantId);
    if (!fs.existsSync(tenantDir)) {
      fs.mkdirSync(tenantDir, { recursive: true });
    }
    return path.join(tenantDir, fileName);
  }

  private readJsonFile<T>(fileName: string, defaultData: T, tenantId?: string): T {
    const filePath = this.getFilePath(fileName, tenantId);
    if (!fs.existsSync(filePath)) {
      try {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      } catch (err) {
        console.error(`[JsonMenuRepository] Error creating default file ${filePath}:`, err);
      }
      return defaultData;
    }
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as T;
    } catch (err) {
      console.error(`[JsonMenuRepository] Error reading ${filePath}:`, err);
      return defaultData;
    }
  }

  private writeJsonFile<T>(fileName: string, data: T, tenantId?: string): boolean {
    const filePath = this.getFilePath(fileName, tenantId);
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error(`[JsonMenuRepository] Error writing to ${filePath}:`, err);
      return false;
    }
  }

  // ─────────────────────────────────────────────
  // CATEGORIES
  // ─────────────────────────────────────────────

  public async getCategories(tenantId: string): Promise<Category[]> {
    return this.readJsonFile<Category[]>('categories.json', INITIAL_CATEGORIES, tenantId);
  }

  public async getCategoryById(tenantId: string, id: string): Promise<Category | null> {
    const list = await this.getCategories(tenantId);
    return list.find(c => c.id === id) || null;
  }

  public async createCategory(tenantId: string, data: Omit<Category, 'id'>): Promise<Category> {
    const categories = await this.getCategories(tenantId);
    const newCategory: Category = {
      ...data,
      id: `cat-${Date.now()}`
    };
    categories.push(newCategory);
    this.writeJsonFile('categories.json', categories, tenantId);
    this.categoriesCache.set(tenantId || 'default', { data: categories, timestamp: Date.now() });
    return newCategory;
  }

  public async updateCategory(tenantId: string, id: string, data: Partial<Category>): Promise<Category | null> {
    const categories = await this.getCategories(tenantId);
    const idx = categories.findIndex(c => c.id === id);
    if (idx === -1) return null;

    categories[idx] = { ...categories[idx], ...data };
    this.writeJsonFile('categories.json', categories, tenantId);
    this.categoriesCache.set(tenantId || 'default', { data: categories, timestamp: Date.now() });
    return categories[idx];
  }

  public async deleteCategory(tenantId: string, id: string): Promise<boolean> {
    const categories = await this.getCategories(tenantId);
    const filtered = categories.filter(c => c.id !== id);
    if (filtered.length === categories.length) return false;

    this.writeJsonFile('categories.json', filtered, tenantId);
    this.categoriesCache.set(tenantId || 'default', { data: filtered, timestamp: Date.now() });
    return true;
  }

  // ─────────────────────────────────────────────
  // DISHES
  // ─────────────────────────────────────────────

  public async getDishes(tenantId: string): Promise<Dish[]> {
    return this.readJsonFile<Dish[]>('dishes.json', INITIAL_DISHES, tenantId);
  }

  public async getDishById(tenantId: string, id: string): Promise<Dish | null> {
    const dishes = await this.getDishes(tenantId);
    return dishes.find(d => d.id === id) || null;
  }

  public async createDish(tenantId: string, data: Omit<Dish, 'id'>): Promise<Dish> {
    const dishes = await this.getDishes(tenantId);
    const newDish: Dish = {
      ...data,
      id: `dish-${Date.now()}`
    };
    dishes.push(newDish);
    this.writeJsonFile('dishes.json', dishes, tenantId);
    return newDish;
  }

  public async updateDish(tenantId: string, id: string, data: Partial<Dish>): Promise<Dish | null> {
    const dishes = await this.getDishes(tenantId);
    const idx = dishes.findIndex(d => d.id === id);
    if (idx === -1) return null;

    dishes[idx] = { ...dishes[idx], ...data };
    this.writeJsonFile('dishes.json', dishes, tenantId);
    return dishes[idx];
  }

  public async deleteDish(tenantId: string, id: string): Promise<boolean> {
    const dishes = await this.getDishes(tenantId);
    const filtered = dishes.filter(d => d.id !== id);
    if (filtered.length === dishes.length) return false;

    this.writeJsonFile('dishes.json', filtered, tenantId);
    return true;
  }

  // ─────────────────────────────────────────────
  // PROMOTIONS
  // ─────────────────────────────────────────────

  public async getPromotions(tenantId: string): Promise<Promotion[]> {
    return this.readJsonFile<Promotion[]>('promotions.json', INITIAL_PROMOTIONS, tenantId);
  }

  public async getPromotionById(tenantId: string, id: string): Promise<Promotion | null> {
    const promos = await this.getPromotions(tenantId);
    return promos.find(p => p.id === id) || null;
  }

  public async createPromotion(tenantId: string, data: Omit<Promotion, 'id'>): Promise<Promotion> {
    const promos = await this.getPromotions(tenantId);
    const newPromo: Promotion = {
      ...data,
      id: `promo-${Date.now()}`
    };
    promos.push(newPromo);
    this.writeJsonFile('promotions.json', promos, tenantId);
    this.promotionsCache.set(tenantId || 'default', { data: promos, timestamp: Date.now() });
    return newPromo;
  }

  public async updatePromotion(tenantId: string, id: string, data: Partial<Promotion>): Promise<Promotion | null> {
    const promos = await this.getPromotions(tenantId);
    const idx = promos.findIndex(p => p.id === id);
    if (idx === -1) return null;

    promos[idx] = { ...promos[idx], ...data };
    this.writeJsonFile('promotions.json', promos, tenantId);
    this.promotionsCache.set(tenantId || 'default', { data: promos, timestamp: Date.now() });
    return promos[idx];
  }

  public async deletePromotion(tenantId: string, id: string): Promise<boolean> {
    const promos = await this.getPromotions(tenantId);
    const filtered = promos.filter(p => p.id !== id);
    if (filtered.length === promos.length) return false;

    this.writeJsonFile('promotions.json', filtered, tenantId);
    this.promotionsCache.set(tenantId || 'default', { data: filtered, timestamp: Date.now() });
    return true;
  }
}
