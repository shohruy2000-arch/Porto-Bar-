/**
 * @file src/repositories/json/JsonOrderRepository.ts
 * @description JSON file-based implementation of IOrderRepository with fee calculation and caching.
 */

import fs from 'fs';
import path from 'path';
import { IOrderRepository } from '../interfaces';
import { Order, OrderStatus, CreateOrderDTO } from '../../types';

export class JsonOrderRepository implements IOrderRepository {
  private readonly dataDir: string;
  private readonly tenantsDir: string;

  // In-memory cache keyed by tenantId
  private ordersCache: Map<string, { data: Order[]; timestamp: number }> = new Map();
  private readonly CACHE_TTL_MS = 15 * 1000; // 15 seconds TTL for active orders

  constructor() {
    this.dataDir = path.join(process.cwd(), 'src', 'data', 'db');
    this.tenantsDir = path.join(this.dataDir, 'tenants');
  }

  private getFilePath(tenantId?: string): string {
    if (!tenantId || tenantId === 'porto-bar' || tenantId === 'default') {
      return path.join(this.dataDir, 'orders.json');
    }
    const tenantDir = path.join(this.tenantsDir, tenantId);
    if (!fs.existsSync(tenantDir)) {
      fs.mkdirSync(tenantDir, { recursive: true });
    }
    return path.join(tenantDir, 'orders.json');
  }

  private readOrdersFile(tenantId?: string): Order[] {
    const filePath = this.getFilePath(tenantId);
    if (!fs.existsSync(filePath)) {
      try {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
      } catch (err) {
        console.error(`[JsonOrderRepository] Error creating default file ${filePath}:`, err);
      }
      return [];
    }
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as Order[];
    } catch (err) {
      console.error(`[JsonOrderRepository] Error reading ${filePath}:`, err);
      return [];
    }
  }

  private writeOrdersFile(orders: Order[], tenantId?: string): boolean {
    const filePath = this.getFilePath(tenantId);
    try {
      fs.writeFileSync(filePath, JSON.stringify(orders, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error(`[JsonOrderRepository] Error writing to ${filePath}:`, err);
      return false;
    }
  }

  public async getOrders(tenantId: string, phoneFilter?: string): Promise<Order[]> {
    const key = tenantId || 'default';
    let orders: Order[];

    const cached = this.ordersCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      orders = cached.data;
    } else {
      orders = this.readOrdersFile(tenantId);
      this.ordersCache.set(key, { data: orders, timestamp: Date.now() });
    }

    if (phoneFilter && phoneFilter.trim()) {
      const cleanPhone = phoneFilter.trim().replace(/[^\d+]/g, '');
      return orders.filter(o => o.phone.replace(/[^\d+]/g, '') === cleanPhone);
    }

    return orders;
  }

  public async getOrderById(tenantId: string, id: string): Promise<Order | null> {
    const orders = await this.getOrders(tenantId);
    return orders.find(o => o.id === id) || null;
  }

  public async createOrder(
    tenantId: string,
    orderData: CreateOrderDTO,
    feeRateOverride: number = 0.03
  ): Promise<Order> {
    const orders = await this.getOrders(tenantId);

    const totalAmount = Number(orderData.totalAmount) || 0;
    const feeRate = feeRateOverride !== undefined ? feeRateOverride : 0.03;
    const platformFeeAmount = Math.round(totalAmount * feeRate * 100) / 100;
    const restaurantEarnings = Math.round((totalAmount - platformFeeAmount) * 100) / 100;

    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      status: orderData.status || 'received',
      totalAmount,
      platformFeeRate: feeRate,
      platformFeeAmount,
      restaurantEarnings,
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    this.writeOrdersFile(orders, tenantId);
    this.ordersCache.set(tenantId || 'default', { data: orders, timestamp: Date.now() });
    return newOrder;
  }

  public async updateOrderStatus(
    tenantId: string,
    id: string,
    status: OrderStatus
  ): Promise<Order | null> {
    const orders = await this.getOrders(tenantId);
    const idx = orders.findIndex(o => o.id === id);
    if (idx === -1) return null;

    orders[idx].status = status;
    this.writeOrdersFile(orders, tenantId);
    this.ordersCache.set(tenantId || 'default', { data: orders, timestamp: Date.now() });
    return orders[idx];
  }

  public async updateOrder(
    tenantId: string,
    id: string,
    data: Partial<Order>
  ): Promise<Order | null> {
    const orders = await this.getOrders(tenantId);
    const idx = orders.findIndex(o => o.id === id);
    if (idx === -1) return null;

    orders[idx] = { ...orders[idx], ...data };
    this.writeOrdersFile(orders, tenantId);
    this.ordersCache.set(tenantId || 'default', { data: orders, timestamp: Date.now() });
    return orders[idx];
  }
}
