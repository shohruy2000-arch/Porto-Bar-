/**
 * @file src/repositories/interfaces.ts
 * @description Core Repository interfaces for SaaS Multi-Tenant architecture.
 * All operations are asynchronous and scoped to tenantId where applicable.
 */

import {
  Tenant,
  Category,
  Dish,
  Promotion,
  Order,
  OrderStatus,
  CreateOrderDTO
} from '../types';

/**
 * Repository interface for managing Tenants (Restaurants)
 */
export interface ITenantRepository {
  /**
   * Find a tenant by its unique ID
   * @param id - e.g. 'porto-bar', 'steak-wine'
   */
  getById(id: string): Promise<Tenant | null>;

  /**
   * Find a tenant by its URL slug
   * @param slug - e.g. 'porto', 'steak'
   */
  getBySlug(slug: string): Promise<Tenant | null>;

  /**
   * Find a tenant matching a domain or subdomain
   * @param domain - e.g. 'portobar.ru', 'steak.starterapp.ru'
   */
  getByDomain(domain: string): Promise<Tenant | null>;

  /**
   * Get all registered tenants
   */
  getAll(): Promise<Tenant[]>;

  /**
   * Create a new tenant record and initialize starter storage
   * @param data - Tenant initialization parameters
   */
  create(data: Omit<Tenant, 'createdAt'>): Promise<Tenant>;

  /**
   * Update fields on an existing tenant
   * @param id - Tenant ID
   * @param data - Partial fields to update
   */
  update(id: string, data: Partial<Tenant>): Promise<Tenant | null>;

  /**
   * Delete a tenant (with protection for root default tenant)
   * @param id - Tenant ID
   */
  delete(id: string): Promise<boolean>;
}

/**
 * Repository interface for managing Menu (Categories, Dishes, Promotions)
 */
export interface IMenuRepository {
  // Categories
  getCategories(tenantId: string): Promise<Category[]>;
  getCategoryById(tenantId: string, id: string): Promise<Category | null>;
  createCategory(tenantId: string, data: Omit<Category, 'id'>): Promise<Category>;
  updateCategory(tenantId: string, id: string, data: Partial<Category>): Promise<Category | null>;
  deleteCategory(tenantId: string, id: string): Promise<boolean>;

  // Dishes
  getDishes(tenantId: string): Promise<Dish[]>;
  getDishById(tenantId: string, id: string): Promise<Dish | null>;
  createDish(tenantId: string, data: Omit<Dish, 'id'>): Promise<Dish>;
  updateDish(tenantId: string, id: string, data: Partial<Dish>): Promise<Dish | null>;
  deleteDish(tenantId: string, id: string): Promise<boolean>;

  // Promotions
  getPromotions(tenantId: string): Promise<Promotion[]>;
  getPromotionById(tenantId: string, id: string): Promise<Promotion | null>;
  createPromotion(tenantId: string, data: Omit<Promotion, 'id'>): Promise<Promotion>;
  updatePromotion(tenantId: string, id: string, data: Partial<Promotion>): Promise<Promotion | null>;
  deletePromotion(tenantId: string, id: string): Promise<boolean>;
}

/**
 * Repository interface for managing Orders and Billing calculations
 */
export interface IOrderRepository {
  /**
   * Retrieve orders for a specific tenant, optionally filtered by customer phone
   * @param tenantId - Tenant identifier
   * @param phoneFilter - Optional phone number to filter by
   */
  getOrders(tenantId: string, phoneFilter?: string): Promise<Order[]>;

  /**
   * Retrieve a specific order by ID
   * @param tenantId - Tenant identifier
   * @param id - Order ID
   */
  getOrderById(tenantId: string, id: string): Promise<Order | null>;

  /**
   * Create a new order with platform fee and restaurant earnings calculation
   * @param tenantId - Tenant identifier
   * @param orderData - Order payload from client
   * @param feeRateOverride - Optional custom commission rate (default 0.03 = 3%)
   */
  createOrder(tenantId: string, orderData: CreateOrderDTO, feeRateOverride?: number): Promise<Order>;

  /**
   * Update the status of an existing order
   * @param tenantId - Tenant identifier
   * @param id - Order ID
   * @param status - New order lifecycle status
   */
  updateOrderStatus(tenantId: string, id: string, status: OrderStatus): Promise<Order | null>;

  /**
   * Update generic order fields (e.g. iiko sync info)
   * @param tenantId - Tenant identifier
   * @param id - Order ID
   * @param data - Partial order fields
   */
  updateOrder(tenantId: string, id: string, data: Partial<Order>): Promise<Order | null>;
}
