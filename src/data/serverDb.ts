import fs from 'fs';
import path from 'path';
import { Dish, Category, Promotion, Order, LoyaltyMember, WaiterCall, PushSubscriptionData, Reservation } from '../types';
import { INITIAL_CATEGORIES, INITIAL_DISHES, INITIAL_PROMOTIONS } from './initialMenu';

const DATA_DIR = path.join(process.cwd(), 'src', 'data', 'db');

const getFilePath = (fileName: string) => path.join(DATA_DIR, fileName);

const ensureDirectoryExists = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

const readFile = <T>(fileName: string, defaultData: T): T => {
  ensureDirectoryExists();
  const filePath = getFilePath(fileName);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    console.error(`Error reading ${fileName}:`, e);
    return defaultData;
  }
};

const writeFile = <T>(fileName: string, data: T): boolean => {
  ensureDirectoryExists();
  const filePath = getFilePath(fileName);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error(`Error writing ${fileName}:`, e);
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

let cacheDishes: Dish[] | null = null;
let cacheCategories: Category[] | null = null;
let cachePromotions: Promotion[] | null = null;
let cacheOrders: Order[] | null = null;
let cacheLoyalty: LoyaltyMember[] | null = null;
let cacheWaiterCalls: WaiterCall[] | null = null;

export const serverDb = {
  getDishes: () => {
    if (!cacheDishes) cacheDishes = readFile<Dish[]>('dishes.json', INITIAL_DISHES);
    return cacheDishes;
  },
  saveDishes: (data: Dish[]) => {
    cacheDishes = data;
    return writeFile('dishes.json', data);
  },

  getCategories: () => {
    if (!cacheCategories) cacheCategories = readFile<Category[]>('categories.json', INITIAL_CATEGORIES);
    return cacheCategories;
  },
  saveCategories: (data: Category[]) => {
    cacheCategories = data;
    return writeFile('categories.json', data);
  },

  getPromotions: () => {
    if (!cachePromotions) cachePromotions = readFile<Promotion[]>('promotions.json', INITIAL_PROMOTIONS);
    return cachePromotions;
  },
  savePromotions: (data: Promotion[]) => {
    cachePromotions = data;
    return writeFile('promotions.json', data);
  },

  getOrders: () => {
    if (!cacheOrders) cacheOrders = readFile<Order[]>('orders.json', []);
    return cacheOrders;
  },
  saveOrders: (data: Order[]) => {
    cacheOrders = data;
    return writeFile('orders.json', data);
  },

  getLoyalty: () => {
    if (!cacheLoyalty) cacheLoyalty = readFile<LoyaltyMember[]>('loyalty.json', INITIAL_LOYALTY);
    return cacheLoyalty;
  },
  saveLoyalty: (data: LoyaltyMember[]) => {
    cacheLoyalty = data;
    return writeFile('loyalty.json', data);
  },

  getWaiterCalls: () => {
    if (!cacheWaiterCalls) cacheWaiterCalls = readFile<WaiterCall[]>('waiter_calls.json', []);
    return cacheWaiterCalls;
  },
  saveWaiterCalls: (data: WaiterCall[]) => {
    cacheWaiterCalls = data;
    return writeFile('waiter_calls.json', data);
  },

  getPushSubscriptions: () => {
    if (!cachePushSubscriptions) cachePushSubscriptions = readFile<PushSubscriptionData[]>('push_subscriptions.json', []);
    return cachePushSubscriptions;
  },
  savePushSubscriptions: (data: PushSubscriptionData[]) => {
    cachePushSubscriptions = data;
    return writeFile('push_subscriptions.json', data);
  },

  getReservations: () => {
    if (!cacheReservations) cacheReservations = readFile<Reservation[]>('reservations.json', []);
    return cacheReservations;
  },
  saveReservations: (data: Reservation[]) => {
    cacheReservations = data;
    return writeFile('reservations.json', data);
  }
};

let cachePushSubscriptions: PushSubscriptionData[] | null = null;
let cacheReservations: Reservation[] | null = null;

