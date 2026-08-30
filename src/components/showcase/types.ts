/**
 * @file src/components/showcase/types.ts
 * @description Types for Design Showcase restaurant menus, dishes, categories, and interactive features.
 */

export interface ShowcaseDish {
  id: string;
  name: string;
  tagline?: string;
  price: number;
  oldPrice?: number;
  weight?: string;
  calories?: string;
  image: string;
  desc: string;
  badge?: string;
  badgeColor?: string;
  spicyLevel?: number;
  isBestseller?: boolean;
  isChefSpecial?: boolean;
  options?: {
    title: string;
    choices: { name: string; extraPrice?: number }[];
  }[];
}

export interface ShowcaseCategory {
  id: string;
  name: string;
  iconName: string;
  tagline?: string;
}

export interface ShowcaseComboBundle {
  id: string;
  title: string;
  badge: string;
  items: string[];
  price: number;
  oldPrice?: number;
  image: string;
}

export interface ShowcaseRestaurantData {
  id: string;
  name: string;
  conceptTitle: string;
  cuisine: string;
  tagline: string;
  designer: {
    name: string;
    location: string;
    country: string;
    countryFlag: string;
  };
  rating: number;
  reviewsCount: number;
  avgCheck: string;
  repeatRate: string;
  deliveryTime: string;
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    image: string;
    chefName?: string;
    chefRole?: string;
  };
  features: string[];
  colors: {
    primary: string;
    primaryGlow: string;
    secondary: string;
    bg: string;
    surface: string;
    surfaceElevated: string;
    text: string;
    textMuted: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    accent: string;
  };
  categories: ShowcaseCategory[];
  signatureDishes: ShowcaseDish[];
  bundles?: ShowcaseComboBundle[];
  chefSpecials?: ShowcaseDish[];
  allDishes: Record<string, ShowcaseDish[]>;
  promoBanner?: {
    title: string;
    subtitle: string;
    discountText: string;
    code?: string;
    cta: string;
    image: string;
    bgGradient: string;
  };
  rewards?: {
    title: string;
    points: number;
    nextTier: number;
    tierName: string;
  };
  orderTracker?: {
    status: string;
    eta: string;
    stepIndex: number;
    steps: string[];
  };
}
