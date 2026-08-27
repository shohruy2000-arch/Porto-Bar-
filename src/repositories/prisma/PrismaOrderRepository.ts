/**
 * @file src/repositories/prisma/PrismaOrderRepository.ts
 * @description PostgreSQL + Prisma implementation of IOrderRepository with automated 3% platform fee calculation.
 */

import { IOrderRepository } from '../interfaces';
import { Order, OrderStatus, CreateOrderDTO } from '../../types';
import { prisma } from '../../lib/prisma';

export class PrismaOrderRepository implements IOrderRepository {
  private mapToOrder(o: any): Order {
    return {
      id: o.id,
      type: o.type as any,
      phone: o.phone,
      guestName: o.guestName || undefined,
      tableNumber: o.tableNumber || undefined,
      roomNumber: o.roomNumber || undefined,
      deliveryAddress: o.deliveryAddress || undefined,
      totalAmount: Number(o.totalAmount) || 0,
      platformFeeRate: o.platformFeeRate ? Number(o.platformFeeRate) : 0.03,
      platformFeeAmount: o.platformFeeAmount ? Number(o.platformFeeAmount) : 0,
      restaurantEarnings: o.restaurantEarnings ? Number(o.restaurantEarnings) : 0,
      status: (o.status?.toLowerCase() || 'received') as OrderStatus,
      paymentMethod: (o.paymentMethod || 'cash') as any,
      items: (o.items as any) || [],
      iikoOrderId: o.iikoOrderId || undefined,
      iikoSyncError: o.iikoSyncError || undefined,
      createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString()
    };
  }

  public async getOrders(tenantId: string, phoneFilter?: string): Promise<Order[]> {
    try {
      const whereClause: any = { tenantId };
      if (phoneFilter && phoneFilter.trim()) {
        const cleanPhone = phoneFilter.trim().replace(/[^\d+]/g, '');
        whereClause.phone = { contains: cleanPhone };
      }

      const orders = await prisma.order.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' }
      });
      return orders.map((o: any) => this.mapToOrder(o));
    } catch (err) {
      console.error('[PrismaOrderRepository] getOrders error:', err);
      return [];
    }
  }

  public async getOrderById(tenantId: string, id: string): Promise<Order | null> {
    try {
      const order = await prisma.order.findFirst({
        where: { id, tenantId }
      });
      if (!order) return null;
      return this.mapToOrder(order);
    } catch (err) {
      console.error('[PrismaOrderRepository] getOrderById error:', err);
      return null;
    }
  }

  public async createOrder(
    tenantId: string,
    orderData: CreateOrderDTO,
    feeRateOverride?: number
  ): Promise<Order> {
    // 1. Fetch tenant commission rate if not overridden
    let feeRate = feeRateOverride;
    if (feeRate === undefined) {
      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { commissionRate: true }
      });
      feeRate = tenant?.commissionRate ? Number(tenant.commissionRate) : 0.03;
    }

    const totalAmount = Number(orderData.totalAmount) || 0;
    const platformFeeAmount = Math.round(totalAmount * feeRate * 100) / 100;
    const restaurantEarnings = Math.round((totalAmount - platformFeeAmount) * 100) / 100;

    const created = await prisma.order.create({
      data: {
        tenantId,
        type: orderData.type,
        phone: orderData.phone,
        guestName: orderData.guestName || null,
        tableNumber: orderData.tableNumber || null,
        roomNumber: orderData.roomNumber || null,
        deliveryAddress: orderData.deliveryAddress || null,
        totalAmount,
        platformFeeRate: feeRate,
        platformFeeAmount,
        restaurantEarnings,
        status: (orderData.status?.toUpperCase() || 'RECEIVED') as any,
        paymentMethod: orderData.paymentMethod || 'cash',
        items: (orderData.items || []) as any
      }
    });

    return this.mapToOrder(created);
  }

  public async updateOrderStatus(
    tenantId: string,
    id: string,
    status: OrderStatus
  ): Promise<Order | null> {
    try {
      const updated = await prisma.order.update({
        where: { id },
        data: {
          status: status.toUpperCase() as any
        }
      });
      return this.mapToOrder(updated);
    } catch (err) {
      console.error('[PrismaOrderRepository] updateOrderStatus error:', err);
      return null;
    }
  }

  public async updateOrder(
    tenantId: string,
    id: string,
    data: Partial<Order>
  ): Promise<Order | null> {
    try {
      const updateData: any = {};
      if (data.status) updateData.status = data.status.toUpperCase() as any;
      if (data.iikoOrderId !== undefined) updateData.iikoOrderId = data.iikoOrderId;
      if (data.iikoSyncError !== undefined) updateData.iikoSyncError = data.iikoSyncError;

      const updated = await prisma.order.update({
        where: { id },
        data: updateData
      });
      return this.mapToOrder(updated);
    } catch (err) {
      console.error('[PrismaOrderRepository] updateOrder error:', err);
      return null;
    }
  }
}
