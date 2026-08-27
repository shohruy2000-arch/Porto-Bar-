/**
 * @file src/app/api/super-admin/route.ts
 * @description Super Admin Master API for multi-tenant SaaS restaurant operations, API Key management and Profit Monitoring.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTenantRepository } from '../../../lib/serverContext';
import { prisma } from '../../../lib/prisma';
import { RepositoryFactory } from '../../../repositories/RepositoryFactory';
import { generateApiKey } from '../../../lib/apiKeyHelper';

const SUPER_ADMIN_PIN = process.env.SUPER_ADMIN_PIN || 'porto777';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('x-super-admin-auth');
    if (authHeader !== SUPER_ADMIN_PIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantRepo = getTenantRepository();
    const restaurants = await tenantRepo.getAll();

    let totalGmv = 0;
    let totalOrdersMonth = 0;
    let totalPlatformEarnings = 0;
    let totalRestaurantProfit = 0;

    if (RepositoryFactory.getDataSource() === 'prisma') {
      try {
        const orderAgg = await prisma.order.aggregate({
          where: { status: { not: 'CANCELLED' } },
          _sum: {
            totalAmount: true,
            platformFeeAmount: true,
            restaurantEarnings: true
          },
          _count: { id: true }
        });
        totalGmv = Number(orderAgg._sum.totalAmount) || 0;
        totalPlatformEarnings = Number(orderAgg._sum.platformFeeAmount) || 0;
        totalRestaurantProfit = Number(orderAgg._sum.restaurantEarnings) || 0;
        totalOrdersMonth = orderAgg._count.id || 0;
      } catch (aggErr) {
        console.error('Order aggregation error:', aggErr);
      }
    }

    const activeRestaurants = restaurants.filter(r => r.status === 'active').length;
    const monthlyRevenue = restaurants.reduce((sum, r) => sum + (r.monthlyPrice || 0), 0);

    const stats = {
      totalRestaurants: restaurants.length,
      activeRestaurants,
      totalGmv,
      totalPlatformEarnings,
      totalRestaurantProfit,
      totalOrdersMonth,
      monthlyRevenue
    };

    return NextResponse.json({
      stats,
      restaurants
    });
  } catch (err: any) {
    console.error('[SuperAdmin API] GET Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, pin, data } = body;

    // 1. Verify Master PIN for auth
    if (action === 'auth') {
      if (pin === SUPER_ADMIN_PIN) {
        return NextResponse.json({ success: true, token: SUPER_ADMIN_PIN });
      } else {
        return NextResponse.json({ error: 'Неверный PIN-код супер-администратора' }, { status: 403 });
      }
    }

    const authHeader = req.headers.get('x-super-admin-auth');
    if (authHeader !== SUPER_ADMIN_PIN && pin !== SUPER_ADMIN_PIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantRepo = getTenantRepository();

    // 2. CREATE RESTAURANT
    if (action === 'createRestaurant') {
      if (!data.name || !data.slug) {
        return NextResponse.json({ error: 'Название и слаг ресторана обязательны' }, { status: 400 });
      }

      const cleanId = (data.id || data.slug).toLowerCase().replace(/[^a-z0-9-]/g, '-');
      const existing = await tenantRepo.getById(cleanId) || await tenantRepo.getBySlug(data.slug);
      if (existing) {
        return NextResponse.json({ error: 'Ресторан с таким ID или слагом уже существует' }, { status: 400 });
      }

      const newRestaurant = await tenantRepo.create({
        id: cleanId,
        slug: data.slug.toLowerCase().trim(),
        name: data.name.trim(),
        legalName: data.legalName || '',
        inn: data.inn || '',
        ogrn: data.ogrn || '',
        domains: Array.isArray(data.domains) ? data.domains : [data.slug.toLowerCase().trim()],
        theme: data.theme || {
          preset: 'luxury-dark',
          primaryColor: '#d4af37',
          primaryLightColor: '#f5e6a8',
          primaryDarkColor: '#aa8010',
          accentColor: '#f59e0b',
          bgColor: '#060a12',
          bgCardColor: '#0d131f',
          textColor: '#f3f4f6',
          logoUrl: '/images/porto-logo.jpg?v=2',
          faviconUrl: '/images/porto-app-icon-192.png',
          fontFamily: 'var(--font-geist-sans)'
        },
        status: data.status || 'active',
        plan: data.plan || 'business',
        subscriptionExpiresAt: data.subscriptionExpiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        monthlyPrice: Number(data.monthlyPrice) || 6900,
        adminPassword: data.adminPassword || 'admin123',
        contacts: data.contacts || {}
      });

      // Auto-generate initial API key for the new restaurant
      try {
        await prisma.tenantApiKey.create({
          data: {
            tenantId: cleanId,
            name: 'Первичный ключ интеграции',
            key: generateApiKey(),
            permissions: ['orders:read', 'orders:write', 'analytics:read']
          }
        });
      } catch (kErr) {
        console.error('Failed to auto-generate initial API key:', kErr);
      }

      return NextResponse.json({ success: true, restaurant: newRestaurant });
    }

    // 3. UPDATE RESTAURANT
    if (action === 'updateRestaurant') {
      const { id, updatedFields } = data;
      const updated = await tenantRepo.update(id, updatedFields);
      if (!updated) {
        return NextResponse.json({ error: 'Ресторан не найден' }, { status: 404 });
      }
      return NextResponse.json({ success: true, restaurant: updated });
    }

    // 4. TOGGLE STATUS
    if (action === 'toggleStatus') {
      const { id, status } = data;
      const updated = await tenantRepo.update(id, { status });
      if (!updated) {
        return NextResponse.json({ error: 'Ресторан не найден' }, { status: 404 });
      }
      return NextResponse.json({ success: true, restaurant: updated });
    }

    // 5. DELETE RESTAURANT
    if (action === 'deleteRestaurant') {
      const { id } = data;
      const ok = await tenantRepo.delete(id);
      if (!ok) {
        return NextResponse.json({ error: 'Не удалось удалить заведение (основной ресторан защищен)' }, { status: 400 });
      }
      return NextResponse.json({ success: true });
    }

    // 6. LIST API KEYS FOR RESTAURANT
    if (action === 'listApiKeys') {
      const { tenantId } = data;
      const keys = await prisma.tenantApiKey.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json({ success: true, apiKeys: keys });
    }

    // 7. CREATE NEW API KEY
    if (action === 'createApiKey') {
      const { tenantId, name, permissions } = data;
      const newKey = await prisma.tenantApiKey.create({
        data: {
          tenantId,
          name: name || 'API Key',
          key: generateApiKey(),
          permissions: Array.isArray(permissions) ? permissions : ['orders:read', 'orders:write', 'analytics:read']
        }
      });
      return NextResponse.json({ success: true, apiKey: newKey });
    }

    // 8. REVOKE API KEY
    if (action === 'revokeApiKey') {
      const { keyId } = data;
      await prisma.tenantApiKey.delete({
        where: { id: keyId }
      });
      return NextResponse.json({ success: true });
    }

    // 9. GET TENANT LIVE MONITORING
    if (action === 'getTenantMonitoring') {
      const { tenantId } = data;
      const [orderAgg, ordersCount, recentOrders, apiKeys] = await Promise.all([
        prisma.order.aggregate({
          where: { tenantId, status: { not: 'CANCELLED' } },
          _sum: {
            totalAmount: true,
            platformFeeAmount: true,
            restaurantEarnings: true
          }
        }),
        prisma.order.count({ where: { tenantId } }),
        prisma.order.findMany({
          where: { tenantId },
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            orderNumber: true,
            type: true,
            phone: true,
            guestName: true,
            totalAmount: true,
            platformFeeAmount: true,
            restaurantEarnings: true,
            status: true,
            paymentStatus: true,
            createdAt: true
          }
        }),
        prisma.tenantApiKey.findMany({
          where: { tenantId },
          orderBy: { createdAt: 'desc' }
        })
      ]);

      const totalGmv = Number(orderAgg._sum.totalAmount) || 0;
      const platformFee = Number(orderAgg._sum.platformFeeAmount) || 0;
      const restaurantProfit = Number(orderAgg._sum.restaurantEarnings) || 0;

      return NextResponse.json({
        success: true,
        monitoring: {
          totalGmv,
          platformFee,
          restaurantProfit,
          totalOrders: ordersCount,
          recentOrders,
          apiKeys
        }
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('[SuperAdmin API] POST Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
