import { MenuRepository, OrderRepository, LoyaltyRepository } from './menuRepository';
import { Dish, Category, Promotion, Order, OrderStatus, LoyaltyMember, LoyaltyTransaction, LoyaltyTier } from '../types';

export class LocalMenuRepository implements MenuRepository, OrderRepository, LoyaltyRepository {
  private async apiCall<T>(url: string, method: 'GET' | 'POST', body?: any): Promise<T> {
    const options: RequestInit = { method };
    if (body) {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(body);
    }
    const res = await fetch(url, options);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'API Request Failed');
    }
    return res.json();
  }

  // DISHES
  async getMenuData(): Promise<{ dishes: Dish[]; categories: Category[]; promotions: Promotion[] }> {
    return this.apiCall<{ dishes: Dish[]; categories: Category[]; promotions: Promotion[] }>('/api/menu', 'GET');
  }

  async getDishes(): Promise<Dish[]> {
    const data = await this.apiCall<{ dishes: Dish[] }>('/api/menu', 'GET');
    return data.dishes;
  }

  async getVisibleDishes(): Promise<Dish[]> {
    const dishes = await this.getDishes();
    return dishes.filter(d => d.visible);
  }

  async addDish(dish: Omit<Dish, 'id'>): Promise<Dish> {
    return this.apiCall<Dish>('/api/menu', 'POST', { action: 'addDish', data: dish });
  }

  async updateDish(id: string, updatedFields: Partial<Dish>): Promise<Dish> {
    return this.apiCall<Dish>('/api/menu', 'POST', { action: 'updateDish', data: { id, ...updatedFields } });
  }

  async deleteDish(id: string): Promise<boolean> {
    await this.apiCall<any>('/api/menu', 'POST', { action: 'deleteDish', data: { id } });
    return true;
  }

  // CATEGORIES
  async getCategories(): Promise<Category[]> {
    const data = await this.apiCall<{ categories: Category[] }>('/api/menu', 'GET');
    return data.categories;
  }

  async addCategory(category: Omit<Category, 'id'>): Promise<Category> {
    return this.apiCall<Category>('/api/menu', 'POST', { action: 'addCategory', data: category });
  }

  async deleteCategory(id: string): Promise<boolean> {
    await this.apiCall<any>('/api/menu', 'POST', { action: 'deleteCategory', data: { id } });
    return true;
  }

  // PROMOTIONS
  async getPromotions(): Promise<Promotion[]> {
    const data = await this.apiCall<{ promotions: Promotion[] }>('/api/menu', 'GET');
    return data.promotions;
  }

  async getVisiblePromotions(): Promise<Promotion[]> {
    const promos = await this.getPromotions();
    return promos.filter(p => p.active);
  }

  async addPromotion(promotion: Omit<Promotion, 'id'>): Promise<Promotion> {
    return this.apiCall<Promotion>('/api/menu', 'POST', { action: 'addPromotion', data: promotion });
  }

  async updatePromotion(id: string, updatedFields: Partial<Promotion>): Promise<Promotion> {
    return this.apiCall<Promotion>('/api/menu', 'POST', { action: 'updatePromotion', data: { id, ...updatedFields } });
  }

  async deletePromotion(id: string): Promise<boolean> {
    await this.apiCall<any>('/api/menu', 'POST', { action: 'deletePromotion', data: { id } });
    return true;
  }

  // ORDERS
  async getOrders(): Promise<Order[]> {
    return this.apiCall<Order[]>('/api/orders', 'GET');
  }

  async addOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    return this.apiCall<Order>('/api/orders', 'POST', { action: 'addOrder', data: order });
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    return this.apiCall<Order>('/api/orders', 'POST', { action: 'updateOrderStatus', data: { id, status } });
  }

  // LOYALTY
  async getLoyaltyMembers(): Promise<LoyaltyMember[]> {
    return this.apiCall<LoyaltyMember[]>('/api/loyalty', 'GET');
  }

  async getLoyaltyMemberByPhone(phone: string): Promise<LoyaltyMember | null> {
    return this.apiCall<LoyaltyMember | null>(`/api/loyalty?phone=${encodeURIComponent(phone)}`, 'GET');
  }

  async addLoyaltyMember(member: LoyaltyMember): Promise<LoyaltyMember> {
    return this.apiCall<LoyaltyMember>('/api/loyalty', 'POST', { action: 'addMember', data: member });
  }

  async updateLoyaltyPoints(
    phone: string,
    amount: number,
    type: 'accrual' | 'deduction',
    comment: string
  ): Promise<LoyaltyMember> {
    return this.apiCall<LoyaltyMember>('/api/loyalty', 'POST', { action: 'updatePoints', data: { phone, amount, type, comment } });
  }
}

export const menuRepository = new LocalMenuRepository();
