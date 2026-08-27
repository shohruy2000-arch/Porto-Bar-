/**
 * @file src/repositories/prisma/PrismaMenuRepository.ts
 * @description PostgreSQL + Prisma implementation of IMenuRepository with automatic JSON fallback.
 */

import { IMenuRepository } from '../interfaces';
import { Category, Dish, Promotion } from '../../types';
import { prisma } from '../../lib/prisma';
import { JsonMenuRepository } from '../json/JsonMenuRepository';

export class PrismaMenuRepository implements IMenuRepository {
  private jsonFallback = new JsonMenuRepository();

  private mapToCategory(c: any): Category {
    return {
      id: c.id,
      name: {
        ru: c.nameRu || '',
        en: c.nameEn || c.nameRu || '',
        zh: c.nameZh || c.nameRu || ''
      }
    };
  }

  private mapToDish(d: any): Dish {
    const modifierGroups = d.modifierGroups?.map((g: any) => ({
      id: g.id,
      dishId: g.dishId,
      name: {
        ru: g.nameRu || '',
        en: g.nameEn || g.nameRu || '',
        zh: g.nameZh || g.nameRu || ''
      },
      minSelected: g.minSelected ?? 0,
      maxSelected: g.maxSelected ?? 1,
      options: (g.options || []).map((opt: any) => ({
        id: opt.id,
        groupId: opt.groupId,
        name: {
          ru: opt.nameRu || '',
          en: opt.nameEn || opt.nameRu || '',
          zh: opt.nameZh || opt.nameRu || ''
        },
        priceDelta: Number(opt.priceDelta) || 0,
        isDefault: opt.isDefault ?? false,
        outOfStock: opt.outOfStock ?? false
      }))
    }));

    return {
      id: d.id,
      category: d.categoryId,
      name: {
        ru: d.nameRu || '',
        en: d.nameEn || d.nameRu || '',
        zh: d.nameZh || d.nameRu || ''
      },
      description: {
        ru: d.descriptionRu || '',
        en: d.descriptionEn || '',
        zh: d.descriptionZh || ''
      },
      price: Number(d.price) || 0,
      weight: d.weight || '',
      image: d.image || undefined,
      visible: d.visible ?? true,
      labels: (d.labels || []) as any,
      kbju: d.calories !== null && d.calories !== undefined ? {
        calories: d.calories || 0,
        proteins: Number(d.proteins) || 0,
        fats: Number(d.fats) || 0,
        carbs: Number(d.carbs) || 0
      } : undefined,
      outOfStock: d.outOfStock ?? false,
      quantityLimit: d.quantityLimit !== null ? d.quantityLimit : undefined,
      modifierGroups: modifierGroups && modifierGroups.length > 0 ? modifierGroups : undefined
    };
  }

  // ─────────────────────────────────────────────
  // CATEGORIES
  // ─────────────────────────────────────────────

  public async getCategories(tenantId: string): Promise<Category[]> {
    try {
      const categories = await prisma.category.findMany({
        where: { tenantId },
        orderBy: { sortOrder: 'asc' }
      });
      if (categories && categories.length > 0) {
        return categories.map((c: any) => this.mapToCategory(c));
      }
    } catch (err) {
      console.warn('[PrismaMenuRepository] getCategories falling back to JSON:', err);
    }
    return this.jsonFallback.getCategories(tenantId);
  }

  public async getCategoryById(tenantId: string, id: string): Promise<Category | null> {
    try {
      const category = await prisma.category.findFirst({
        where: { id, tenantId }
      });
      if (category) return this.mapToCategory(category);
    } catch (err) {
      console.warn('[PrismaMenuRepository] getCategoryById falling back to JSON:', err);
    }
    return this.jsonFallback.getCategoryById(tenantId, id);
  }

  public async createCategory(tenantId: string, data: Omit<Category, 'id'>): Promise<Category> {
    try {
      const created = await prisma.category.create({
        data: {
          tenantId,
          nameRu: data.name?.ru || 'Новая категория',
          nameEn: data.name?.en || null,
          nameZh: data.name?.zh || null
        }
      });
      return this.mapToCategory(created);
    } catch {
      return this.jsonFallback.createCategory(tenantId, data);
    }
  }

  public async updateCategory(tenantId: string, id: string, data: Partial<Category>): Promise<Category | null> {
    try {
      const updateData: any = {};
      if (data.name?.ru !== undefined) updateData.nameRu = data.name.ru;
      if (data.name?.en !== undefined) updateData.nameEn = data.name.en;
      if (data.name?.zh !== undefined) updateData.nameZh = data.name.zh;

      const updated = await prisma.category.update({
        where: { id },
        data: updateData
      });
      return this.mapToCategory(updated);
    } catch {
      return this.jsonFallback.updateCategory(tenantId, id, data);
    }
  }

  public async deleteCategory(tenantId: string, id: string): Promise<boolean> {
    try {
      await prisma.category.deleteMany({
        where: { id, tenantId }
      });
      return true;
    } catch {
      return this.jsonFallback.deleteCategory(tenantId, id);
    }
  }

  // ─────────────────────────────────────────────
  // DISHES
  // ─────────────────────────────────────────────

  public async getDishes(tenantId: string): Promise<Dish[]> {
    try {
      const dishes = await prisma.dish.findMany({
        where: { tenantId },
        include: {
          category: true,
          modifierGroups: {
            include: { options: true }
          }
        }
      });
      if (dishes && dishes.length > 0) {
        return dishes.map((d: any) => this.mapToDish(d));
      }
    } catch (err) {
      console.warn('[PrismaMenuRepository] getDishes falling back to JSON:', err);
    }
    return this.jsonFallback.getDishes(tenantId);
  }

  public async getDishById(tenantId: string, id: string): Promise<Dish | null> {
    try {
      const dish = await prisma.dish.findFirst({
        where: { id, tenantId },
        include: {
          category: true,
          modifierGroups: {
            include: { options: true }
          }
        }
      });
      if (dish) return this.mapToDish(dish);
    } catch (err) {
      console.warn('[PrismaMenuRepository] getDishById falling back to JSON:', err);
    }
    return this.jsonFallback.getDishById(tenantId, id);
  }

  public async createDish(tenantId: string, data: Omit<Dish, 'id'>): Promise<Dish> {
    try {
      const created = await prisma.dish.create({
        data: {
          tenantId,
          categoryId: data.category,
          nameRu: data.name?.ru || 'Новое блюдо',
          nameEn: data.name?.en || null,
          nameZh: data.name?.zh || null,
          descriptionRu: data.description?.ru || null,
          descriptionEn: data.description?.en || null,
          descriptionZh: data.description?.zh || null,
          price: data.price,
          weight: data.weight || null,
          image: data.image || null,
          visible: data.visible ?? true,
          calories: data.kbju?.calories || null,
          proteins: data.kbju?.proteins || null,
          fats: data.kbju?.fats || null,
          carbs: data.kbju?.carbs || null,
          labels: data.labels || []
        }
      });
      return this.mapToDish(created);
    } catch {
      return this.jsonFallback.createDish(tenantId, data);
    }
  }

  public async updateDish(tenantId: string, id: string, data: Partial<Dish>): Promise<Dish | null> {
    try {
      const updateData: any = {};
      if (data.category !== undefined) updateData.categoryId = data.category;
      if (data.name?.ru !== undefined) updateData.nameRu = data.name.ru;
      if (data.name?.en !== undefined) updateData.nameEn = data.name.en;
      if (data.name?.zh !== undefined) updateData.nameZh = data.name.zh;
      if (data.description?.ru !== undefined) updateData.descriptionRu = data.description.ru;
      if (data.description?.en !== undefined) updateData.descriptionEn = data.description.en;
      if (data.description?.zh !== undefined) updateData.descriptionZh = data.description.zh;
      if (data.price !== undefined) updateData.price = data.price;
      if (data.weight !== undefined) updateData.weight = data.weight;
      if (data.image !== undefined) updateData.image = data.image;
      if (data.visible !== undefined) updateData.visible = data.visible;
      if (data.outOfStock !== undefined) updateData.outOfStock = data.outOfStock;
      if (data.quantityLimit !== undefined) updateData.quantityLimit = data.quantityLimit;
      if (data.labels !== undefined) updateData.labels = data.labels;

      if (data.kbju) {
        if (data.kbju.calories !== undefined) updateData.calories = data.kbju.calories;
        if (data.kbju.proteins !== undefined) updateData.proteins = data.kbju.proteins;
        if (data.kbju.fats !== undefined) updateData.fats = data.kbju.fats;
        if (data.kbju.carbs !== undefined) updateData.carbs = data.kbju.carbs;
      }

      const updated = await prisma.dish.update({
        where: { id },
        data: updateData
      });
      return this.mapToDish(updated);
    } catch {
      return this.jsonFallback.updateDish(tenantId, id, data);
    }
  }

  public async deleteDish(tenantId: string, id: string): Promise<boolean> {
    try {
      await prisma.dish.deleteMany({
        where: { id, tenantId }
      });
      return true;
    } catch {
      return this.jsonFallback.deleteDish(tenantId, id);
    }
  }

  // ─────────────────────────────────────────────
  // PROMOTIONS
  // ─────────────────────────────────────────────

  public async getPromotions(tenantId: string): Promise<Promotion[]> {
    return this.jsonFallback.getPromotions(tenantId);
  }

  public async getPromotionById(tenantId: string, id: string): Promise<Promotion | null> {
    return this.jsonFallback.getPromotionById(tenantId, id);
  }

  public async createPromotion(tenantId: string, data: Omit<Promotion, 'id'>): Promise<Promotion> {
    return this.jsonFallback.createPromotion(tenantId, data);
  }

  public async updatePromotion(tenantId: string, id: string, data: Partial<Promotion>): Promise<Promotion | null> {
    return this.jsonFallback.updatePromotion(tenantId, id, data);
  }

  public async deletePromotion(tenantId: string, id: string): Promise<boolean> {
    return this.jsonFallback.deletePromotion(tenantId, id);
  }
}
