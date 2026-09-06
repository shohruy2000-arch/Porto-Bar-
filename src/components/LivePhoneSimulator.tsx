'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Plus,
  Minus,
  Check,
  CheckCircle2,
  ShoppingBag,
  Sparkles,
  Search,
  SlidersHorizontal,
  Flame,
  ArrowRight,
  RotateCcw,
  Zap,
  CreditCard,
  QrCode,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react';

interface Concept {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  accent: string;
  accentLight: string;
  bgDark: string;
  logoLetter: string;
  dishes: {
    id: string;
    name: string;
    price: number;
    grams: string;
    desc: string;
    badge?: string;
    image: string;
    category: string;
  }[];
}

const CONCEPTS: Concept[] = [
  {
    id: 'porto-bar',
    name: 'Porto Bar & Grill',
    tagline: 'Мясной ресторан & винный погреб',
    cuisine: 'Европейская / Стейкхаус',
    accent: '#f59e0b',
    accentLight: '#fef3c7',
    bgDark: '#060a12',
    logoLetter: 'P',
    dishes: [
      {
        id: 'p1',
        name: 'Стейк Рибай Black Angus',
        price: 1890,
        grams: '350г',
        desc: 'Мраморная говядина зернового откорма с розмарином и соусом демиглас',
        badge: 'ХИТ',
        image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=400&q=80',
        category: 'Горячее'
      },
      {
        id: 'p2',
        name: 'Лосось на гриле со спаржей',
        price: 1450,
        grams: '280г',
        desc: 'Филе мурманского лосося со сливочно-икорным соусом',
        badge: 'ШЕФ',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80',
        category: 'Горячее'
      },
      {
        id: 'p3',
        name: 'Тартар из мраморной говядины',
        price: 890,
        grams: '180г',
        desc: 'С каперсами, перепелиным желтком и хрустящей бриошью',
        badge: 'NEW',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
        category: 'Закуски'
      }
    ]
  },
  {
    id: 'brunch-bistro',
    name: "Brunch's Bistro & Burger",
    tagline: 'Крафтовые сочные бургеры & смокер',
    cuisine: 'Американская / Street Gourmet',
    accent: '#f97316',
    accentLight: '#ffedd5',
    bgDark: '#0b0c10',
    logoLetter: 'B',
    dishes: [
      {
        id: 'b1',
        name: 'Double Truffle Smash Burger',
        price: 790,
        grams: '380г',
        desc: 'Две котлеты prime, трюфельный айоли, карамелизованный лук и чеддер',
        badge: 'ТОП-1',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
        category: 'Бургеры'
      },
      {
        id: 'b2',
        name: 'Ребра BBQ из коптильни',
        price: 1190,
        grams: '450г',
        desc: 'Томленые свиные ребра в глазури Jack Daniel’s с картофелем фри',
        badge: 'СМОКЕР',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
        category: 'Горячее'
      },
      {
        id: 'b3',
        name: 'Криспи Чиз Фри с беконом',
        price: 490,
        grams: '260г',
        desc: 'Хрустящий картофель с сырным соусом чеддер и хрустящим беконом',
        badge: 'СНЭК',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80',
        category: 'Закуски'
      }
    ]
  },
  {
    id: 'sakura-omakase',
    name: 'Sakura Omakase Sushi',
    tagline: 'Японская кухня & raw-бар',
    cuisine: 'Японская / Premium Raw',
    accent: '#ec4899',
    accentLight: '#fce7f3',
    bgDark: '#08080c',
    logoLetter: 'S',
    dishes: [
      {
        id: 's1',
        name: 'Филадельфия Grand с трюфелем',
        price: 1150,
        grams: '310г',
        desc: 'Много лосося, нежный сыр креметте, свежий авокадо и стружка трюфеля',
        badge: 'PREMIUM',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80',
        category: 'Роллы'
      },
      {
        id: 's2',
        name: 'Дракон с угрем унаги',
        price: 990,
        grams: '280г',
        desc: 'Копченый угорь, спайси краб, манговый соус и поджаренный кунжут',
        badge: 'ХИТ',
        image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=400&q=80',
        category: 'Роллы'
      },
      {
        id: 's3',
        name: 'Сашими Тунец & Лосось',
        price: 1390,
        grams: '200г',
        desc: 'Свежайший тунец блюфин и фарерский лосось с настоящим васаби',
        badge: 'RAW BAR',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=400&q=80',
        category: 'Закуски'
      }
    ]
  }
];

export function LivePhoneSimulator() {
  const [activeConceptId, setActiveConceptId] = useState<string>('porto-bar');
  const [cart, setCart] = useState<{ id: string; name: string; price: number; count: number }[]>([
    { id: 'p1', name: 'Стейк Рибай Black Angus', price: 1890, count: 1 }
  ]);
  const [dynamicIslandMessage, setDynamicIslandMessage] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [activeTab, setActiveTab] = useState('Все');

  const currentConcept = CONCEPTS.find((c) => c.id === activeConceptId) || CONCEPTS[0];

  // Dynamic Island auto-dismiss
  useEffect(() => {
    if (dynamicIslandMessage) {
      const timer = setTimeout(() => {
        setDynamicIslandMessage(null);
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [dynamicIslandMessage]);

  const addToCart = (dish: { id: string; name: string; price: number }) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, count: item.count + 1 } : item
        );
      }
      return [...prev, { ...dish, count: 1 }];
    });

    setDynamicIslandMessage(`Добавлено: ${dish.name.slice(0, 18)}...`);
  };

  const removeFromCart = (dishId: string) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === dishId ? { ...item, count: item.count - 1 } : item))
        .filter((item) => item.count > 0)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.count, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.count, 0);

  const resetDemo = () => {
    setCart([{ id: currentConcept.dishes[0].id, name: currentConcept.dishes[0].name, price: currentConcept.dishes[0].price, count: 1 }]);
    setIsOrdered(false);
    setIsCartOpen(false);
  };

  const handleCheckout = () => {
    setIsOrdered(true);
    setTimeout(() => {
      setIsCartOpen(false);
    }, 2400);
  };

  const scrollToBrief = () => {
    const el = document.getElementById('brief-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="simulator"
      className="relative pt-36 pb-28 sm:pt-44 sm:pb-36 scroll-mt-24 bg-[#02050e] text-white overflow-hidden isolate selection:bg-amber-500 selection:text-slate-950"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-amber-500/10 via-rose-500/5 to-blue-500/10 blur-[180px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-widest shadow-inner">
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>Интерактивный тест-драйв</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-white leading-tight">
            Попробуйте приложение прямо сейчас <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              в виртуальном iPhone 16 Pro
            </span>
          </h2>

          <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
            Покликайте меню, добавьте блюдо в корзину и проверьте оплату через СБП. 
            Именно так ваши гости будут заказывать еду в 1 клик прямо с экрана телефона.
          </p>
        </div>

        {/* Cockpit: Left Perks + Center iPhone + Right Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT SIDE: Why guests buy (3 cols) */}
          <div className="lg:col-span-3 space-y-5 order-2 lg:order-1">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Преимущества для гостей
              </span>
              <h3 className="text-xl font-bold text-white">
                Конверсия в заказ на 40% выше
              </h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Zap className="w-4 h-4" />
                  <span>Мгновенный старт</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Не нужно ждать загрузки 200 МБ из App Store или вводить пароли. QR-код сразу открывает меню.
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <CreditCard className="w-4 h-4" />
                  <span>СБП в 2 секунды</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Оплата в 1 касание через приложение любимого банка без ручного ввода данных кредитной карты.
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-pink-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Свой бренд и лояльность</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Никакой рекламы чужих ресторанов. Гость видит только вашу кухню и ваши скидочные баллы.
                </p>
              </div>
            </div>
          </div>

          {/* CENTER: iPhone 16 Pro Mockup (6 cols) */}
          <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
            
            {/* iPhone 16 Pro Titanium Frame */}
            <div className="relative w-[340px] sm:w-[380px] h-[700px] sm:h-[760px] bg-[#12151c] rounded-[52px] p-3.5 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(245,158,11,0.15)] border-4 border-[#2b313f] ring-1 ring-white/20 select-none">
              
              {/* Titanium Side Buttons */}
              <div className="absolute -left-[7px] top-[115px] w-[3px] h-[28px] bg-slate-600 rounded-l-sm" />
              <div className="absolute -left-[7px] top-[160px] w-[3px] h-[50px] bg-slate-600 rounded-l-sm" />
              <div className="absolute -left-[7px] top-[220px] w-[3px] h-[50px] bg-slate-600 rounded-l-sm" />
              <div className="absolute -right-[7px] top-[170px] w-[3px] h-[75px] bg-slate-600 rounded-r-sm" />

              {/* Inner Screen Display */}
              <div
                className="relative w-full h-full rounded-[42px] overflow-hidden flex flex-col justify-between"
                style={{ background: currentConcept.bgDark }}
              >
                
                {/* ── TOP STATUS BAR + DYNAMIC ISLAND ── */}
                <div className="relative z-30 pt-3 px-6 pb-2 flex items-center justify-between text-white text-[11px] font-medium tracking-tight">
                  <span>19:42</span>

                  {/* Interactive Dynamic Island */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 top-2.5 bg-black rounded-full transition-all duration-300 flex items-center justify-center border border-white/10 z-40 ${
                      dynamicIslandMessage
                        ? 'w-[260px] h-[34px] px-3 shadow-lg ring-1 ring-amber-500/50'
                        : 'w-[96px] h-[24px]'
                    }`}
                  >
                    {dynamicIslandMessage ? (
                      <div className="flex items-center justify-between w-full text-[10px] text-white">
                        <div className="flex items-center space-x-1.5 truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="font-semibold truncate">{dynamicIslandMessage}</span>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0 ml-1" />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-[#222]" />
                        <div className="w-2 h-2 rounded-full bg-[#051122]" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-1.5 text-[10px]">
                    <span>5G</span>
                    <div className="w-4 h-2.5 border border-white/80 rounded-sm p-0.5 flex items-center">
                      <div className="w-full h-full bg-white rounded-xs" />
                    </div>
                  </div>
                </div>

                {/* ── APP HEADER & BRANDING ── */}
                <div className="px-4 pt-2 pb-2 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center font-serif font-black text-slate-950 text-sm shadow-md"
                        style={{ background: currentConcept.accent }}
                      >
                        {currentConcept.logoLetter}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">
                          {currentConcept.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate w-36">
                          {currentConcept.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                        ● Открыто
                      </span>
                    </div>
                  </div>

                  {/* Category Pills inside App */}
                  <div className="flex items-center space-x-2 pt-2.5 overflow-x-auto no-scrollbar">
                    {['Все', 'Горячее', 'Закуски', 'Роллы', 'Бургеры'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all shrink-0 ${
                          activeTab === cat
                            ? 'text-slate-950 shadow-sm'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                        style={{
                          background: activeTab === cat ? currentConcept.accent : undefined
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── DISH LIST (Scrollable interactive feed) ── */}
                <div className="flex-1 px-4 py-3 overflow-y-auto space-y-3 no-scrollbar">
                  {currentConcept.dishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="bg-white/5 hover:bg-white/[0.08] border border-white/10 rounded-2xl p-2.5 flex items-center space-x-3 transition-all"
                    >
                      {/* Dish Photo */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-full object-cover"
                        />
                        {dish.badge && (
                          <span
                            className="absolute top-1 left-1 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider text-slate-950 shadow"
                            style={{ background: currentConcept.accent }}
                          >
                            {dish.badge}
                          </span>
                        )}
                      </div>

                      {/* Dish Content */}
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-white truncate leading-tight">
                          {dish.name}
                        </h5>
                        <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                          {dish.desc}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-baseline space-x-1">
                            <span className="text-xs font-black text-white font-serif">
                              {dish.price} ₽
                            </span>
                            <span className="text-[9px] text-slate-500">
                              / {dish.grams}
                            </span>
                          </div>

                          {/* Add to Cart Button */}
                          <button
                            onClick={() => addToCart(dish)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-950 font-black shadow transition-transform active:scale-85 cursor-pointer"
                            style={{ background: currentConcept.accent }}
                            title="Добавить в корзину"
                          >
                            <Plus className="w-4 h-4 stroke-[3]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── FLOATING CART PILL AT BOTTOM OF IPHONE ── */}
                <div className="p-3 bg-gradient-to-t from-black via-black/90 to-transparent relative z-20">
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl flex items-center justify-between text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
                    style={{ background: currentConcept.accent }}
                  >
                    <div className="flex items-center space-x-2">
                      <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                      <span>{cartItemCount} блюд в корзине</span>
                    </div>
                    <div className="flex items-center space-x-1 font-serif">
                      <span>{cartTotal} ₽</span>
                      <ChevronRight className="w-4 h-4 stroke-[3]" />
                    </div>
                  </button>

                  {/* iOS Home Indicator Bar */}
                  <div className="w-32 h-1 bg-white/40 rounded-full mx-auto mt-3" />
                </div>

                {/* ── SLIDE-UP CHECKOUT SHEET INSIDE IPHONE ── */}
                <AnimatePresence>
                  {isCartOpen && (
                    <motion.div
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      className="absolute inset-0 bg-[#060912]/98 backdrop-blur-xl z-50 p-4 flex flex-col justify-between text-white"
                    >
                      {/* Sheet Header */}
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                          <div className="flex items-center space-x-2">
                            <ShoppingBag className="w-4 h-4 text-amber-400" />
                            <h4 className="text-xs font-bold text-white">Оформление заказа</h4>
                          </div>
                          <button
                            onClick={() => setIsCartOpen(false)}
                            className="p-1 rounded-full bg-white/10 text-slate-400 hover:text-white"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Cart Items List */}
                        <div className="py-3 max-h-48 overflow-y-auto space-y-2 no-scrollbar">
                          {cart.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                              <span className="truncate max-w-[170px] text-slate-200">{item.name}</span>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-slate-300"
                                >
                                  -
                                </button>
                                <span className="font-bold">{item.count}</span>
                                <button
                                  onClick={() => addToCart(item)}
                                  className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-slate-300"
                                >
                                  +
                                </button>
                                <span className="font-serif font-bold text-amber-400 ml-1">
                                  {item.price * item.count} ₽
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Delivery Details */}
                        <div className="bg-white/5 rounded-xl p-2.5 space-y-1.5 text-[10px] mt-2">
                          <div className="flex justify-between text-slate-400">
                            <span>Адрес доставки:</span>
                            <span className="text-white font-medium">ул. Тверская, 12, кв. 45</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Время доставки:</span>
                            <span className="text-emerald-400 font-bold">25–35 минут</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Комиссия за заказ:</span>
                            <span className="text-amber-400 font-bold">0 ₽ (0%)</span>
                          </div>
                        </div>
                      </div>

                      {/* Order Action Button / Success Notification */}
                      <div>
                        {isOrdered ? (
                          <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-2xl p-4 text-center space-y-1.5 animate-fadeIn">
                            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                            <h5 className="text-xs font-bold text-white">Заказ #148 успешно оплачен!</h5>
                            <p className="text-[10px] text-slate-300">
                              Деньги поступили на р/с через СБП 0.7%. Кухня уже готовит блюда.
                            </p>
                          </div>
                        ) : (
                          <button
                            onClick={handleCheckout}
                            className="w-full py-3 rounded-xl flex items-center justify-center space-x-2 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl active:scale-95 transition-all cursor-pointer"
                            style={{ background: currentConcept.accent }}
                          >
                            <CreditCard className="w-4 h-4 stroke-[2.5]" />
                            <span>Оплатить {cartTotal} ₽ через СБП</span>
                          </button>
                        )}

                        <div className="w-32 h-1 bg-white/40 rounded-full mx-auto mt-4" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Concept Switcher & Live QR (3 cols) */}
          <div className="lg:col-span-3 space-y-6 order-3">
            
            {/* Concept Selector */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Выберите концепцию
              </span>
              <div className="space-y-2">
                {CONCEPTS.map((concept) => (
                  <button
                    key={concept.id}
                    onClick={() => {
                      setActiveConceptId(concept.id);
                      setCart([{ id: concept.dishes[0].id, name: concept.dishes[0].name, price: concept.dishes[0].price, count: 1 }]);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      activeConceptId === concept.id
                        ? 'bg-slate-800/90 border-amber-500 shadow-md ring-1 ring-amber-500/40 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{concept.name}</p>
                      <p className="text-[10px] text-slate-500">{concept.cuisine}</p>
                    </div>
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ background: concept.accent }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Live QR to test on real phone */}
            <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 border border-amber-500/30 p-5 rounded-2xl space-y-3 text-center">
              <div className="flex items-center justify-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <QrCode className="w-4 h-4" />
                <span>Открыть на своем телефоне</span>
              </div>
              
              {/* QR Code Graphic */}
              <div className="bg-white p-3 rounded-xl w-32 h-32 mx-auto shadow-lg flex items-center justify-center">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://porto-bar.ru/r/porto-bar&color=000000&bgcolor=ffffff"
                  alt="QR Code to test Porto Bar PWA"
                  className="w-full h-full"
                />
              </div>

              <p className="text-[11px] text-slate-400 leading-snug">
                Наведите камеру смартфона, чтобы открыть реальное PWA-меню без установки.
              </p>

              <button
                onClick={resetDemo}
                className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Сбросить симулятор</span>
              </button>
            </div>

            {/* Launch CTA */}
            <button
              onClick={scrollToBrief}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 active:scale-95 transition-all cursor-pointer"
            >
              Хочу такое приложение себе →
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}
