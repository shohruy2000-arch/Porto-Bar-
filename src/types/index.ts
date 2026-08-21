export type Language = 'ru' | 'en' | 'zh';

export interface MultilingualText {
  ru: string;
  en: string;
  zh: string;
}

export type DishLabel = 'new' | 'bestseller' | 'recommended' | 'vegetarian' | 'spicy';

export interface Dish {
  id: string;
  name: MultilingualText;
  description: MultilingualText;
  price: number;
  weight: string; // e.g. "250 g", "300 ml"
  image?: string; // base64 or URL
  category: string; // references Category.id
  visible: boolean;
  labels: DishLabel[];
  kbju?: {
    calories: number; // ккал
    proteins: number; // б
    fats: number;     // ж
    carbs: number;    // у
  };
  prepTime?: number; // время приготовления в минутах
  outOfStock?: boolean;
  quantityLimit?: number | null;
  isRecommended?: boolean;
  recommendedOrder?: number;
}

export interface Category {
  id: string;
  name: MultilingualText;
}

export interface Promotion {
  id: string;
  title: MultilingualText;
  description: MultilingualText;
  image?: string;
  active: boolean;
}

export interface OrderItem {
  dish: Dish;
  quantity: number;
}

// Ordering Ecosystem (Future-Ready)
export type OrderType = 'room' | 'table' | 'takeaway' | 'delivery';
export type OrderStatus = 'received' | 'preparing' | 'completed' | 'archived' | 'cancelled';

export interface OrderDetailItem {
  dishId: string;
  quantity: number;
  priceAtOrder: number;
}

export interface Order {
  id: string;
  type: OrderType;
  phone: string;
  roomNumber?: string;
  tableNumber?: string;
  deliveryAddress?: string;
  deliveryLat?: number;
  deliveryLng?: number;
  deliveryApartment?: string;
  deliveryEntrance?: string;
  deliveryFloor?: string;
  deliveryIntercom?: string;
  deliveryComment?: string;
  deliveryDistance?: number;
  items: OrderDetailItem[];
  totalAmount: number;
  paymentMethod: 'cash' | 'terminal';
  status: OrderStatus;
  createdAt: string;
  guestName?: string;
  iikoOrderId?: string;    // iiko order UUID after successful sync
  iikoSyncError?: string;  // error message if iiko sync failed
  idempotencyKey?: string; // unique token to prevent double submissions
}

// Loyalty System (Porto Premium)
export type LoyaltyTier = 'Bronze' | 'Silver' | 'Gold' | 'Porto Premium';

export interface LoyaltyTransaction {
  date: string;
  amount: number;
  type: 'accrual' | 'deduction';
  comment: string;
}

export interface LoyaltyMember {
  phone: string;
  name: string;
  cardNumber: string;
  qrCode: string; // Base64 or SVG representation
  registrationDate: string;
  points: number;
  tier: LoyaltyTier;
  history: LoyaltyTransaction[];
  email?: string;
  vkId?: string;
  telegramId?: string;
  telegramUsername?: string;
}

// Telegram Server-side settings
export interface WaiterRoute {
  name: string;
  chatId: string;
  tables: string; // e.g. "1,2,3"
}

export interface IikoConfig {
  enabled: boolean;
  apiLogin: string;
  organizationId: string;   // UUID — loaded from iiko
  terminalGroupId: string;  // UUID — loaded from iiko
  nomenclatureRevision?: number; // for delta updates
}

export interface TelegramConfig {
  botToken: string;
  chatId: string; // for orders
  waiterChatId?: string; // default fallback for waiter calls
  waiters?: WaiterRoute[];
  geminiApiKey?: string;
  geminiProxyUrl?: string;
  openaiApiKey?: string;
  backstageVideoUrl?: string;
  backstageVideoEnabled?: boolean;
  backstageVideoTitle?: MultilingualText;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  vkAppId?: string;
  botUsername?: string;
  iiko?: IikoConfig;
  vapidPublicKey?: string;
  vapidPrivateKey?: string;
  stories?: Story[];
  workHoursStart?: string;
  workHoursEnd?: string;
  heroVideoUrl?: string;
  heroType?: 'video' | 'slideshow';
  heroSlogan?: MultilingualText;
  statusBannerText?: MultilingualText;
  statusBannerSubtitle?: MultilingualText;
  statusBannerVideoUrl?: string;
  printedMenuImage?: string;
  yandexEdaUrl?: string;
  deliveryRadiusKm?: number;
  restaurantAddress?: string;
  restaurantLat?: number;
  restaurantLng?: number;
  deliveryFee?: number;
}

export interface Story {
  id: string;
  videoUrl?: string;
  imageUrl?: string;
  previewUrl?: string;
  title: MultilingualText;
  subtitle?: MultilingualText;
  badge?: MultilingualText;
  enabled: boolean;
  actionType?: 'category' | 'booking' | 'cart' | 'url' | 'none';
  actionTarget?: string; // category id, dish id, or URL
  actionButtonText?: MultilingualText;
}

export interface PushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

export interface PushSubscriptionData {
  endpoint: string;
  keys: PushSubscriptionKeys;
  phone?: string;
  createdAt?: string;
}

export interface WaiterCall {
  id: string;
  timestamp: string;
  tableNumber: string;
  assignedWaiter: string; // Waiter's name or fallback indicator
  status: 'pending' | 'completed';
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guestsCount: number;
  zone: 'inside' | 'veranda';
  tableNumber?: string;
  wishes?: string;
  createdAt: string;
  idempotencyKey?: string;
}
