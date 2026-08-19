import { Dish, Category, Promotion, Order, OrderStatus, LoyaltyMember, LoyaltyTransaction } from '../types';

export interface MenuRepository {
  getMenuData(): Promise<{ dishes: Dish[]; categories: Category[]; promotions: Promotion[] }>;
  getDishes(): Promise<Dish[]>;
  getVisibleDishes(): Promise<Dish[]>;
  addDish(dish: Omit<Dish, 'id'>): Promise<Dish>;
  updateDish(id: string, dish: Partial<Dish>): Promise<Dish>;
  deleteDish(id: string): Promise<boolean>;
  
  getCategories(): Promise<Category[]>;
  addCategory(category: Omit<Category, 'id'>): Promise<Category>;
  deleteCategory(id: string): Promise<boolean>;

  getPromotions(): Promise<Promotion[]>;
  getVisiblePromotions(): Promise<Promotion[]>;
  addPromotion(promotion: Omit<Promotion, 'id'>): Promise<Promotion>;
  updatePromotion(id: string, promotion: Partial<Promotion>): Promise<Promotion>;
  deletePromotion(id: string): Promise<boolean>;
}

export interface OrderRepository {
  getOrders(): Promise<Order[]>;
  addOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<Order>;
}

export interface LoyaltyRepository {
  getLoyaltyMembers(): Promise<LoyaltyMember[]>;
  getLoyaltyMemberByPhone(phone: string): Promise<LoyaltyMember | null>;
  addLoyaltyMember(member: LoyaltyMember): Promise<LoyaltyMember>;
  updateLoyaltyPoints(
    phone: string,
    amount: number,
    type: 'accrual' | 'deduction',
    comment: string
  ): Promise<LoyaltyMember>;
}
