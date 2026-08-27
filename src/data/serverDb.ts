import fs from 'fs';
import path from 'path';
import { Dish, Category, Promotion, Order, LoyaltyMember, WaiterCall, PushSubscriptionData, Reservation, TenantRestaurant, SuperAdminStats } from '../types';
import { INITIAL_CATEGORIES, INITIAL_DISHES, INITIAL_PROMOTIONS } from './initialMenu';

const DATA_DIR = path.join(process.cwd(), 'src', 'data', 'db');
const TENANTS_DIR = path.join(DATA_DIR, 'tenants');

const ensureDirectoryExists = (dir: string = DATA_DIR) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const getFilePath = (fileName: string, tenantId?: string) => {
  if (!tenantId || tenantId === 'porto-bar' || tenantId === 'default') {
    return path.join(DATA_DIR, fileName);
  }
  const tenantDir = path.join(TENANTS_DIR, tenantId);
  ensureDirectoryExists(tenantDir);
  return path.join(tenantDir, fileName);
};

const readFile = <T>(fileName: string, defaultData: T, tenantId?: string): T => {
  ensureDirectoryExists();
  const filePath = getFilePath(fileName, tenantId);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    console.error(`Error reading ${fileName} for tenant ${tenantId || 'default'}:`, e);
    return defaultData;
  }
};

const writeFile = <T>(fileName: string, data: T, tenantId?: string): boolean => {
  ensureDirectoryExists();
  const filePath = getFilePath(fileName, tenantId);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error(`Error writing ${fileName} for tenant ${tenantId || 'default'}:`, e);
    return false;
  }
};

// Seeding Loyalty Members
const INITIAL_LOYALTY: LoyaltyMember[] = [
  {
    phone: '+79998887766',
    name: 'Алексей Иванов',
    cardNumber: 'PB-888-7766',
    qrCode: 'PB-888-7766',
    registrationDate: '01.05.2026',
    points: 550,
    tier: 'Gold',
    history: [
      { date: '01.05.2026 12:00', amount: 300, type: 'accrual', comment: 'Регистрация в клубе PORTO' },
      { date: '15.05.2026 18:30', amount: 250, type: 'accrual', comment: '10% кэшбек за ужин в номере' }
    ]
  },
  {
    phone: '+79995554433',
    name: 'Мария Сидорова',
    cardNumber: 'PB-555-4433',
    qrCode: 'PB-555-4433',
    registrationDate: '12.05.2026',
    points: 120,
    tier: 'Silver',
    history: [
      { date: '12.05.2026 15:45', amount: 100, type: 'accrual', comment: 'Регистрация в клубе PORTO' },
      { date: '20.05.2026 14:20', amount: 20, type: 'accrual', comment: 'Кэшбек за капучино и десерт' }
    ]
  }
];

export const serverDb = {
  // RESTAURANTS (TENANTS)
  getRestaurants: (): TenantRestaurant[] => {
    return readFile<TenantRestaurant[]>('restaurants.json', []);
  },
  saveRestaurants: (data: TenantRestaurant[]) => {
    return writeFile('restaurants.json', data);
  },
  getRestaurantById: (id: string): TenantRestaurant | null => {
    const list = serverDb.getRestaurants();
    return list.find(r => r.id === id || r.slug === id) || null;
  },
  getRestaurantByDomain: (domain: string): TenantRestaurant | null => {
    const list = serverDb.getRestaurants();
    const cleanDomain = domain.toLowerCase().split(':')[0]; // strip port if any
    const found = list.find(r => 
      r.domains.some(d => d.toLowerCase() === cleanDomain) || 
      r.slug.toLowerCase() === cleanDomain ||
      cleanDomain.startsWith(`${r.slug.toLowerCase()}.`)
    );
    return found || list.find(r => r.id === 'porto-bar') || list[0] || null;
  },
  createRestaurant: (data: Omit<TenantRestaurant, 'createdAt'>): TenantRestaurant => {
    const restaurants = serverDb.getRestaurants();
    const newRestaurant: TenantRestaurant = {
      ...data,
      createdAt: new Date().toISOString(),
      stats: {
        totalGmv: 0,
        totalOrders: 0,
        activeMembers: 0
      }
    };
    // Initialize tenant directory & seed initial starter data
    const tenantDir = path.join(TENANTS_DIR, newRestaurant.id);
    ensureDirectoryExists(tenantDir);
    writeFile('dishes.json', INITIAL_DISHES, newRestaurant.id);
    writeFile('categories.json', INITIAL_CATEGORIES, newRestaurant.id);
    writeFile('promotions.json', INITIAL_PROMOTIONS, newRestaurant.id);
    writeFile('orders.json', [], newRestaurant.id);
    writeFile('reservations.json', [], newRestaurant.id);
    writeFile('waiter_calls.json', [], newRestaurant.id);
    writeFile('loyalty.json', [], newRestaurant.id);
    writeFile('push_subscriptions.json', [], newRestaurant.id);

    restaurants.push(newRestaurant);
    serverDb.saveRestaurants(restaurants);
    return newRestaurant;
  },
  updateRestaurant: (id: string, updatedFields: Partial<TenantRestaurant>): TenantRestaurant | null => {
    const restaurants = serverDb.getRestaurants();
    const idx = restaurants.findIndex(r => r.id === id);
    if (idx === -1) return null;
    restaurants[idx] = { ...restaurants[idx], ...updatedFields };
    serverDb.saveRestaurants(restaurants);
    return restaurants[idx];
  },
  deleteRestaurant: (id: string): boolean => {
    if (id === 'porto-bar') return false; // Protect root
    let restaurants = serverDb.getRestaurants();
    restaurants = restaurants.filter(r => r.id !== id);
    serverDb.saveRestaurants(restaurants);
    return true;
  },
  getSuperAdminStats: (): SuperAdminStats => {
    const restaurants = serverDb.getRestaurants();
    const active = restaurants.filter(r => r.status === 'active' || r.status === 'trial');
    let totalGmv = 0;
    let totalOrders = 0;
    let monthlyRevenue = 0;

    restaurants.forEach(r => {
      totalGmv += (r.stats?.totalGmv || 0);
      totalOrders += (r.stats?.totalOrders || 0);
      monthlyRevenue += (r.monthlyPrice || 0);
    });

    return {
      totalRestaurants: restaurants.length,
      activeRestaurants: active.length,
      totalGmv,
      totalOrdersMonth: totalOrders,
      monthlyRevenue
    };
  },

  // DISHES
  getDishes: (tenantId?: string) => {
    return readFile<Dish[]>('dishes.json', INITIAL_DISHES, tenantId);
  },
  saveDishes: (data: Dish[], tenantId?: string) => {
    return writeFile('dishes.json', data, tenantId);
  },

  // CATEGORIES
  getCategories: (tenantId?: string) => {
    return readFile<Category[]>('categories.json', INITIAL_CATEGORIES, tenantId);
  },
  saveCategories: (data: Category[], tenantId?: string) => {
    return writeFile('categories.json', data, tenantId);
  },

  // PROMOTIONS
  getPromotions: (tenantId?: string) => {
    return readFile<Promotion[]>('promotions.json', INITIAL_PROMOTIONS, tenantId);
  },
  savePromotions: (data: Promotion[], tenantId?: string) => {
    return writeFile('promotions.json', data, tenantId);
  },

  // ORDERS
  getOrders: (tenantId?: string) => {
    return readFile<Order[]>('orders.json', [], tenantId);
  },
  saveOrders: (data: Order[], tenantId?: string) => {
    return writeFile('orders.json', data, tenantId);
  },

  // LOYALTY
  getLoyalty: (tenantId?: string) => {
    return readFile<LoyaltyMember[]>('loyalty.json', INITIAL_LOYALTY, tenantId);
  },
  saveLoyalty: (data: LoyaltyMember[], tenantId?: string) => {
    return writeFile('loyalty.json', data, tenantId);
  },

  // WAITER CALLS
  getWaiterCalls: (tenantId?: string) => {
    return readFile<WaiterCall[]>('waiter_calls.json', [], tenantId);
  },
  saveWaiterCalls: (data: WaiterCall[], tenantId?: string) => {
    return writeFile('waiter_calls.json', data, tenantId);
  },

  // PUSH SUBSCRIPTIONS
  getPushSubscriptions: (tenantId?: string) => {
    return readFile<PushSubscriptionData[]>('push_subscriptions.json', [], tenantId);
  },
  savePushSubscriptions: (data: PushSubscriptionData[], tenantId?: string) => {
    return writeFile('push_subscriptions.json', data, tenantId);
  },

  // RESERVATIONS
  getReservations: (tenantId?: string) => {
    return readFile<Reservation[]>('reservations.json', [], tenantId);
  },
  saveReservations: (data: Reservation[], tenantId?: string) => {
    return writeFile('reservations.json', data, tenantId);
  }
};

