export type Language = 'ru' | 'en' | 'zh';

export interface MultilingualText {
  ru: string;
  en: string;
  zh: string;
}

export type DishLabel = 'new' | 'bestseller' | 'recommended' | 'vegetarian' | 'spicy';

export interface ModifierOption {
  id: string;
  groupId: string;
  name: MultilingualText;
  priceDelta: number; // e.g. +50 for additional cheese or 0
  isDefault?: boolean;
  outOfStock?: boolean;
}

export interface ModifierGroup {
  id: string;
  dishId: string;
  name: MultilingualText; // e.g. { ru: 'Размер', en: 'Size', zh: '规格' }
  minSelected: number;    // 0 = optional, 1 = required
  maxSelected: number;    // 1 = single-choice, >1 = multiple-choice
  options: ModifierOption[];
}

export interface SelectedModifier {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  priceDelta: number;
}

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
  modifierGroups?: ModifierGroup[];
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
  selectedModifiers?: SelectedModifier[];
}

// Ordering Ecosystem (Future-Ready)
export type OrderType = 'room' | 'table' | 'takeaway' | 'delivery';
export type OrderStatus = 'received' | 'preparing' | 'completed' | 'archived' | 'cancelled';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderDetailItem {
  dishId: string;
  quantity: number;
  priceAtOrder: number;
  selectedModifiers?: SelectedModifier[];
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
  paymentMethod: 'cash' | 'terminal' | 'yookassa' | 'sbp';
  paymentStatus?: PaymentStatus;
  paymentId?: string; // YooKassa Payment ID
  status: OrderStatus;
  createdAt: string;
  guestName?: string;
  iikoOrderId?: string;    // iiko order UUID after successful sync
  iikoSyncError?: string;  // error message if iiko sync failed
  idempotencyKey?: string; // unique token to prevent double submissions
  platformFeeRate?: number;       // e.g. 0.03 for 3%
  platformFeeAmount?: number;     // e.g. totalAmount * platformFeeRate
  restaurantEarnings?: number;    // e.g. totalAmount - platformFeeAmount
}

/** DTO for client order creation payload */
export interface CreateOrderDTO {
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
  paymentMethod: 'cash' | 'terminal' | 'yookassa' | 'sbp';
  paymentStatus?: PaymentStatus;
  paymentId?: string;
  status?: OrderStatus;
  guestName?: string;
  idempotencyKey?: string;
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

export type ThemePreset = 'luxury-dark' | 'clean-light' | 'vivid-fast';

export interface TenantTheme {
  preset: ThemePreset;
  primaryColor: string; // e.g. #d4af37 (Gold) or #e11d48 (Ruby)
  primaryLightColor?: string; // e.g. #f3e5ab
  primaryDarkColor?: string; // e.g. #aa8010
  accentColor: string; // e.g. #f59e0b
  bgColor: string; // e.g. #060a12 or #ffffff
  bgCardColor: string; // e.g. #0d131f or #f8fafc
  textColor: string; // e.g. #f3f4f6 or #0f172a
  logoUrl: string;
  logoDarkUrl?: string;
  faviconUrl?: string;
  fontFamily?: string;
  customCss?: string;
}

export interface TenantRestaurant {
  id: string; // e.g. 'porto-bar', 'steak-wine'
  slug: string; // e.g. 'porto', 'steak'
  name: string;
  legalName?: string;
  inn?: string;
  ogrn?: string;
  domains: string[]; // e.g. ['portobar.ru', 'porto.yourdomain.ru']
  theme: TenantTheme;
  status: 'active' | 'trial' | 'suspended';
  plan: 'starter' | 'business' | 'enterprise';
  subscriptionExpiresAt?: string;
  monthlyPrice?: number;
  adminPassword: string;
  createdAt: string;
  contacts?: {
    phone?: string;
    email?: string;
    address?: string;
    vkUrl?: string;
    telegramUrl?: string;
    yandexEdaUrl?: string;
  };
  stats?: {
    totalGmv: number;
    totalOrders: number;
    activeMembers: number;
  };
}

/** Alias for multi-tenant entity */
export type Tenant = TenantRestaurant;

export interface SuperAdminStats {
  totalRestaurants: number;
  activeRestaurants: number;
  totalGmv: number;
  totalOrdersMonth: number;
  monthlyRevenue: number;
}
