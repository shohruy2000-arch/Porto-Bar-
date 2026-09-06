'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Star, Plus, Check, Send, Loader2, X, Sparkles,
  ExternalLink, ChevronLeft, ChevronRight, ShoppingBag,
  Bell, Heart, SlidersHorizontal, ArrowRight, Flame,
  Coffee, Utensils, Gift, Percent, Maximize2, Minimize2,
  Smartphone, Monitor, ShoppingCart, Trash2, CheckCircle2,
  Globe, Info, RefreshCw
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   TYPES & HELPERS
───────────────────────────────────────────────────────────────*/
interface DemoDish {
  id: string;
  name: any;
  price: number;
  desc?: string;
  image: string;
  badge?: string;
  category?: string;
  options?: { name: string; price: number }[];
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  options?: string[];
}

const getDishName = (val: any): string => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return val.ru || val.en || val.zh || Object.values(val)[0] || '';
  return String(val);
};

/* ═══════════════════════════════════════════════════════════
   DISH DETAIL MODAL
═══════════════════════════════════════════════════════════ */
function InteractiveDishModal({
  dish,
  accentColor,
  onClose,
  onAdd
}: {
  dish: DemoDish;
  accentColor: string;
  onClose: () => void;
  onAdd: (item: DemoDish, qty: number, opts: string[]) => void;
}) {
  const [qty, setQty] = useState(1);
  const [selectedOpts, setSelectedOpts] = useState<string[]>([]);
  const [added, setAdded] = useState(false);

  const OPTIONS = dish.options || [
    { name: 'Двойная порция', price: 150 },
    { name: 'Фирменный соус', price: 80 },
    { name: 'Экстра топпинг', price: 90 },
  ];

  const toggleOpt = (optName: string) => {
    setSelectedOpts(prev =>
      prev.includes(optName) ? prev.filter(o => o !== optName) : [...prev, optName]
    );
  };

  const extraTotal = selectedOpts.reduce((acc, optName) => {
    const opt = OPTIONS.find(o => o.name === optName);
    return acc + (opt?.price || 0);
  }, 0);

  const totalPrice = (dish.price + extraTotal) * qty;
  const nameStr = getDishName(dish.name);

  const handleConfirm = () => {
    setAdded(true);
    onAdd(dish, qty, selectedOpts);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-[1150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden border-2 shadow-2xl bg-[#0f131d] text-white"
        style={{ borderColor: accentColor + '60', boxShadow: `0 0 50px ${accentColor}30` }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-white/80 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Food Image */}
        <div className="relative h-52 bg-black/40 overflow-hidden">
          <img src={dish.image} alt={nameStr} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f131d] via-transparent to-transparent" />
          {dish.badge && (
            <span
              className="absolute top-4 left-4 px-3 py-1 rounded-lg text-[10px] font-black uppercase text-white shadow-lg"
              style={{ background: accentColor }}
            >
              {dish.badge}
            </span>
          )}
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-black">{nameStr}</h3>
            {dish.desc && <p className="text-xs text-slate-300 mt-1 leading-relaxed">{dish.desc}</p>}
            <p className="text-2xl font-black mt-2" style={{ color: accentColor }}>
              {dish.price} ₽
            </p>
          </div>

          {/* Options */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Дополнительно к блюду:
            </p>
            <div className="space-y-1.5">
              {OPTIONS.map(opt => {
                const active = selectedOpts.includes(opt.name);
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => toggleOpt(opt.name)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      active
                        ? 'bg-white/10 border-amber-400/60 text-white'
                        : 'bg-white/4 border-white/8 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          active ? 'bg-amber-500 border-amber-400' : 'border-white/30'
                        }`}
                      >
                        {active && <Check className="w-3 h-3 text-black stroke-[3]" />}
                      </div>
                      <span>{opt.name}</span>
                    </div>
                    <span className="text-slate-400">+{opt.price} ₽</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Add button */}
          <div className="pt-2 flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/6 border border-white/10 rounded-2xl p-1.5">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center font-black text-sm"
              >
                -
              </button>
              <span className="w-6 text-center text-sm font-black">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center font-black text-sm"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider text-black flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-all"
              style={{ background: accentColor }}
            >
              {added ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>Добавлено в заказ</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-black" />
                  <span>В заказ • {totalPrice} ₽</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   IN-PHONE NOTIFICATIONS OVERLAY
═══════════════════════════════════════════════════════════ */
function InPhoneNotifications({
  accentColor,
  onClose
}: {
  accentColor: string;
  onClose: () => void;
}) {
  const NOTICES = [
    { title: 'Столик №12 подтверждён', time: '5 мин назад', text: 'Ждём вас сегодня к 19:30. Шеф подготовил комплимент.' },
    { title: 'Скидка 15% на первый заказ', time: '1 час назад', text: 'При заказе через QR-меню начисляется 350 бонусных баллов.' },
    { title: 'Шеф рекомендует', time: 'Сегодня', text: 'Попробуйте сезонные новинки от шеф-повара со скидкой 10%.' }
  ];

  return (
    <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md p-4 flex flex-col animate-fadeIn text-white">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" style={{ color: accentColor }} />
          <span className="text-xs font-black">Уведомления заведения</span>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
        {NOTICES.map((n, i) => (
          <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/8 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-black text-white">{n.title}</p>
              <span className="text-[9px] text-slate-400">{n.time}</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed">{n.text}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        className="w-full py-2.5 rounded-xl font-black text-xs uppercase text-black"
        style={{ background: accentColor }}
      >
        Понятно
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   IN-PHONE CART DRAWER
═══════════════════════════════════════════════════════════ */
function InPhoneCartDrawer({
  items,
  accentColor,
  onClose,
  onUpdateQty,
  onClear
}: {
  items: CartItem[];
  accentColor: string;
  onClose: () => void;
  onUpdateQty: (id: string, delta: number) => void;
  onClear: () => void;
}) {
  const [success, setSuccess] = useState(false);
  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  return (
    <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md p-4 flex flex-col animate-fadeIn text-white">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" style={{ color: accentColor }} />
          <span className="text-xs font-black">Ваш заказ ({items.length})</span>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {success ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-3">
          <div className="w-14 h-14 rounded-full flex items-center justify-center border-2"
            style={{ borderColor: accentColor, background: accentColor + '20' }}>
            <Check className="w-7 h-7" style={{ color: accentColor }} />
          </div>
          <h4 className="text-sm font-black">Заказ №PB-312 принят!</h4>
          <p className="text-[10px] text-slate-300 max-w-xs leading-relaxed">
            Чек отправлен на кухню (iiko). Официант принесёт заказ к столику / в номер через ~18 мин.
          </p>
          <button
            onClick={() => {
              onClear();
              onClose();
            }}
            className="mt-2 px-5 py-2 rounded-xl font-black text-xs uppercase text-black"
            style={{ background: accentColor }}
          >
            Закрыть
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-2">
          <ShoppingCart className="w-10 h-10 opacity-30" />
          <p className="text-xs font-medium">Корзина пуста</p>
          <p className="text-[10px] text-slate-500">Добавьте блюда из меню</p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto py-3 space-y-2 scrollbar-none pr-1">
            {items.map(it => (
              <div key={it.id} className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/5 border border-white/8">
                <img src={it.image} alt={it.name} className="w-11 h-11 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-white truncate">{it.name}</p>
                  <p className="text-[10px] font-black" style={{ color: accentColor }}>
                    {it.price * it.quantity} ₽
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 rounded-xl p-1">
                  <button
                    onClick={() => onUpdateQty(it.id, -1)}
                    className="w-5 h-5 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-black"
                  >
                    -
                  </button>
                  <span className="text-[10px] font-black px-1">{it.quantity}</span>
                  <button
                    onClick={() => onUpdateQty(it.id, 1)}
                    className="w-5 h-5 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-black"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Итого к оплате:</span>
              <span className="text-base font-black" style={{ color: accentColor }}>
                {total} ₽
              </span>
            </div>
            <button
              onClick={() => setSuccess(true)}
              className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider text-black flex items-center justify-center gap-1.5 shadow-lg active:scale-98 transition-all"
              style={{ background: accentColor }}
            >
              <span>Оформить заказ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   GENERIC APP VIEW (Phone + Wide screen)
═══════════════════════════════════════════════════════════ */
function RestaurantAppView({
  restaurant,
  dishes,
  categories,
  cartItems,
  onSelectDish,
  onAddToCart,
  onUpdateCartQty,
  onClearCart,
  liveIframeUrl
}: {
  restaurant: any;
  dishes: DemoDish[];
  categories: { id: string; name: string; image: string }[];
  cartItems: CartItem[];
  onSelectDish: (d: DemoDish) => void;
  onAddToCart: (d: DemoDish) => void;
  onUpdateCartQty: (id: string, delta: number) => void;
  onClearCart: () => void;
  liveIframeUrl?: string;
}) {
  const [activeCat, setActiveCat] = useState(categories[0]?.id || 'all');
  const [showNotices, setShowNotices] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [liveMode, setLiveMode] = useState(false);

  const filteredDishes = activeCat === 'all'
    ? dishes
    : dishes.filter(d => d.category === activeCat);

  const cartTotalCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);
  const cartTotalPrice = cartItems.reduce((acc, it) => acc + it.price * it.quantity, 0);

  if (liveMode && liveIframeUrl) {
    return (
      <div className="w-full h-full flex flex-col bg-black text-white relative">
        <div className="bg-[#12151e] px-3 py-2 border-b border-white/10 flex items-center justify-between z-20">
          <span className="text-[10px] font-bold text-amber-400">🌐 Живой сайт: {liveIframeUrl}</span>
          <button
            onClick={() => setLiveMode(false)}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[9px] font-bold"
          >
            📱 Вернуться в PWA
          </button>
        </div>
        <iframe
          src={liveIframeUrl}
          className="w-full flex-1 border-0"
          title="Live Restaurant Website"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col relative overflow-hidden select-none"
      style={{ background: restaurant.bgTheme || '#0d0f14', color: restaurant.textTheme || '#ffffff' }}
    >
      {/* Notifications overlay inside phone */}
      {showNotices && (
        <InPhoneNotifications
          accentColor={restaurant.accentColor}
          onClose={() => setShowNotices(false)}
        />
      )}

      {/* Cart drawer inside phone */}
      {showCart && (
        <InPhoneCartDrawer
          items={cartItems}
          accentColor={restaurant.accentColor}
          onClose={() => setShowCart(false)}
          onUpdateQty={onUpdateCartQty}
          onClear={onClearCart}
        />
      )}

      {/* Top Header */}
      <div className="sticky top-0 z-20 px-4 pt-7 pb-2.5 border-b backdrop-blur-md"
        style={{ background: (restaurant.bgTheme || '#0d0f14') + 'ee', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xl">{restaurant.emblem}</span>
            <div>
              <p className="text-[12px] font-black leading-none">{restaurant.name}</p>
              <p className="text-[9px] text-slate-400 mt-0.5">{restaurant.taglineShort || 'QR Меню & Доставка'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live website button for Chinanews */}
            {liveIframeUrl && (
              <button
                onClick={() => setLiveMode(true)}
                className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-black flex items-center gap-1"
                title="Открыть оригинальный сайт chinanews.moscow"
              >
                <Globe className="w-3 h-3" />
                <span>Live сайт</span>
              </button>
            )}

            {/* Notifications Bell */}
            <button
              onClick={() => setShowNotices(true)}
              className="relative p-1.5 rounded-full bg-white/8 hover:bg-white/15 text-slate-300 transition-all"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-amber-400" />
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setShowCart(true)}
              className="relative p-1.5 rounded-full bg-white/8 hover:bg-white/15 text-slate-300 transition-all"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-[8px] font-black flex items-center justify-center">
                  {cartTotalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <div className="w-full bg-white/6 border border-white/10 text-slate-400 text-[10px] pl-9 pr-4 py-2 rounded-2xl">
            Поиск блюд, напитков, десертов...
          </div>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto scrollbar-none pb-16">
        {/* Banner */}
        <div className="mx-3 mt-3 rounded-2xl overflow-hidden relative h-28 flex items-end p-3 shadow-lg">
          <img
            src={restaurant.heroImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="relative z-10">
            <span
              className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase text-white shadow"
              style={{ background: restaurant.accentColor }}
            >
              {restaurant.heroTag || 'Шеф рекомендует'}
            </span>
            <p className="text-[13px] font-black text-white leading-tight mt-1">
              {restaurant.heroTitle || restaurant.name}
            </p>
          </div>
        </div>

        {/* Categories with real photos */}
        <div className="px-3 mt-3">
          <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1">
            {categories.map(cat => {
              const active = activeCat === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border transition-all shrink-0 ${
                    active
                      ? 'bg-white/15 border-amber-400/80 text-white shadow-md'
                      : 'bg-white/4 border-white/8 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <img src={cat.image} alt={cat.name} className="w-5 h-5 rounded-full object-cover" />
                  <span className="text-[10px] font-bold whitespace-nowrap">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dish Grid */}
        <div className="px-3 mt-3 grid grid-cols-2 gap-2.5">
          {filteredDishes.map(d => (
            <div
              key={d.id}
              onClick={() => onSelectDish(d)}
              className="rounded-2xl overflow-hidden border bg-white/5 border-white/8 hover:border-amber-400/40 transition-all cursor-pointer group flex flex-col"
            >
              <div className="h-24 bg-black/40 relative overflow-hidden">
                <img
                  src={d.image}
                  alt={getDishName(d.name)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {d.badge && (
                  <span
                    className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[7px] font-black text-white uppercase shadow"
                    style={{ background: restaurant.accentColor }}
                  >
                    {d.badge}
                  </span>
                )}
              </div>

              <div className="p-2 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {getDishName(d.name)}
                  </p>
                  {d.desc && (
                    <p className="text-[8px] text-slate-400 line-clamp-1 mt-0.5">{d.desc}</p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] font-black text-white" style={{ color: restaurant.accentColor }}>
                    {d.price} ₽
                  </span>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onAddToCart(d);
                    }}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-black active:scale-90 transition-all shadow-md"
                    style={{ background: restaurant.accentColor }}
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Bottom Cart Bar inside phone */}
      {cartTotalCount > 0 && (
        <div className="absolute bottom-2 left-3 right-3 z-30 animate-fadeIn">
          <button
            onClick={() => setShowCart(true)}
            className="w-full py-2.5 px-4 rounded-2xl text-black font-black text-xs flex items-center justify-between shadow-2xl active:scale-98 transition-all"
            style={{ background: restaurant.accentColor }}
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span>{cartTotalCount} блюда</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{cartTotalPrice} ₽</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   IPHONE FRAME
═══════════════════════════════════════════════════════════ */
function IPhoneFrame({
  children,
  accentGlow,
  isLarge = false
}: {
  children: React.ReactNode;
  accentGlow: string;
  isLarge?: boolean;
}) {
  const width = isLarge ? 340 : 280;
  const height = isLarge ? 680 : 570;

  return (
    <div
      className="relative mx-auto flex-shrink-0 transition-all duration-300"
      style={{
        width,
        height,
        borderRadius: 48,
        background: 'linear-gradient(145deg,#1c2030,#0d1018)',
        border: '3px solid #283144',
        boxShadow: `0 50px 100px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 60px ${accentGlow}`,
      }}
    >
      {/* Side buttons */}
      <div className="absolute -left-[3px] top-16 w-[3px] h-6 rounded-l-full bg-[#1a1f2e]" />
      <div className="absolute -left-[3px] top-24 w-[3px] h-12 rounded-l-full bg-[#1a1f2e]" />
      <div className="absolute -left-[3px] top-[152px] w-[3px] h-12 rounded-l-full bg-[#1a1f2e]" />
      <div className="absolute -right-[3px] top-20 w-[3px] h-16 rounded-r-full bg-[#1a1f2e]" />

      {/* Screen */}
      <div className="absolute inset-[3px] rounded-[44px] overflow-hidden bg-black flex flex-col">
        {/* Dynamic island & Status bar */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-24 h-4.5 rounded-full bg-black flex items-center justify-between px-3 pointer-events-none shadow-md">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#181d29]" />
        </div>
        <div className="w-full h-full overflow-hidden relative">{children}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ALL 6 RESTAURANTS DATA WITH REAL FOOD PHOTOS
═══════════════════════════════════════════════════════════ */
const RESTAURANTS_DATA = [
  {
    id: 'porto',
    name: 'Porto Bar',
    subtitle: 'Luxury Fine Dining & Seafood',
    emblem: '🦪',
    accentColor: '#F59E0B',
    accentGlow: 'rgba(245,158,11,0.25)',
    designer: 'Marco Rossi 🇮🇹',
    location: 'Милан, Италия',
    rating: '4.99',
    cuisine: 'Устрицы · Шампанское · Room Service',
    tagline: 'Тёмная роскошь Michelin-уровня. Живая устричная витрина, тартары из тунца и винный пейринг.',
    taglineShort: 'Room Service & Oysters',
    heroImage: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800&q=80',
    heroTitle: 'Морские деликатесы и премиальный сервис',
    heroTag: 'Шеф рекомендует',
    categories: [
      { id: 'oysters', name: 'Устрицы', image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=200&q=80' },
      { id: 'tartar', name: 'Тартары', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&q=80' },
      { id: 'pasta', name: 'Паста', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=200&q=80' },
      { id: 'wine', name: 'Вина', image: 'https://images.unsplash.com/photo-1569919659476-f0852f6834b7?w=200&q=80' },
    ],
    dishes: [
      { id: 'pb-1', category: 'oysters', name: 'Устрица Фин де Клер №2', price: 680, desc: 'Подаётся со свежим лимоном, соусом миньонет и хрустящим тостом', image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=500&q=80', badge: 'ШЕФ' },
      { id: 'pb-2', category: 'tartar', name: 'Тартар из тунца Bluefin', price: 890, desc: 'Спелое авокадо, цитрусовый понзу, чипсы из тапиоки', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&q=80', badge: 'ХИТ' },
      { id: 'pb-3', category: 'tartar', name: 'Фуа-гра с бриошью', price: 1890, desc: 'Карамелизированный инжир, трюфельный демигляс и морская соль', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80' },
      { id: 'pb-4', category: 'pasta', name: 'Паста Карбонара с гуанчиале', price: 1190, desc: 'Свежая паста фреска, желтки фермерских яиц, сыр пекорино романо', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&q=80' },
      { id: 'pb-5', category: 'wine', name: 'Шампанское Moët & Chandon', price: 1600, desc: 'Брют Империал, 150 мл. Классический французский пейринг к устрицам', image: 'https://images.unsplash.com/photo-1569919659476-f0852f6834b7?w=500&q=80', badge: 'ПРЕМИУМ' },
      { id: 'pb-6', category: 'tartar', name: 'Тартар из мраморной говядины', price: 990, desc: 'Вырезка Prime, каперсы, зернистая горчица, перепелиный желток', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80' },
    ]
  },
  {
    id: 'chinanews',
    name: 'Китайские Новости',
    subtitle: 'Asian Bistro & Dim Sum Bar',
    emblem: '🥢',
    accentColor: '#E63946',
    accentGlow: 'rgba(230,57,70,0.25)',
    designer: 'Wei Zhang 🇨🇳',
    location: 'Шанхай / Москва',
    rating: '4.95',
    cuisine: 'Утка по-пекински · Димсамы · Лапша Вок',
    tagline: 'Аутентичный азиатский концепт ресторана chinanews.moscow. Ручная тянутая лапша, димсамы на пару и утка.',
    taglineShort: 'chinanews.moscow · Азия',
    liveIframeUrl: 'https://chinanews.moscow/',
    heroImage: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&q=80',
    heroTitle: 'Утка по-пекински и ручные димсамы',
    heroTag: 'Легенда кухни',
    categories: [
      { id: 'dimsum', name: 'Димсамы', image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=200&q=80' },
      { id: 'duck', name: 'Утка & Мясо', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=200&q=80' },
      { id: 'noodles', name: 'Лапша Вок', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&q=80' },
      { id: 'tea', name: 'Чай & Напитки', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200&q=80' },
    ],
    dishes: [
      { id: 'cn-1', category: 'duck', name: 'Утка по-пекински (половина)', price: 1980, desc: 'Хрустящая корочка, тонкие блинчики, огурец, лук-порей и сладкий бобовый соус', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&q=80', badge: 'ТОП 1' },
      { id: 'cn-2', category: 'dimsum', name: 'Сяолунбао со свининой и бульоном', price: 620, desc: '4 шт. Паровые шанхайские пельмени с горячим насыщенным бульоном внутри', image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&q=80', badge: 'ХИТ' },
      { id: 'cn-3', category: 'dimsum', name: 'Хрустящие димсамы с креветкой', price: 740, desc: 'Тигровые креветки, побеги бамбука, соус сладкий чили', image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=500&q=80' },
      { id: 'cn-4', category: 'noodles', name: 'Лапша Дань-Дань с говядиной', price: 680, desc: 'Лапша ручной тяги, пряный сычуаньский фарш, кунжутный соус, арахис', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80', badge: 'ОСТРОЕ' },
      { id: 'cn-5', category: 'duck', name: 'Хрустящие баклажаны в соусе', price: 540, desc: 'Карамелизированные баклажаны с томатами черри и кинзой в кисло-сладком соусе', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&q=80' },
      { id: 'cn-6', category: 'tea', name: 'Коллекционный чай Да Хун Пао', price: 490, desc: 'Утёсный улун сильной ферментации с медово-пряными нотами, 600 мл', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&q=80' },
    ]
  },
  {
    id: 'brunch',
    name: "Brunch's Bistro",
    subtitle: 'Nordic Botanical & Pancakes',
    emblem: '🥞',
    accentColor: '#C05830',
    accentGlow: 'rgba(192,88,48,0.25)',
    designer: 'Erik Lindström 🇸🇪',
    location: 'Стокгольм, Швеция',
    rating: '4.84',
    cuisine: 'Бранч · Суфле-панкейки · Specialty Кофе',
    tagline: 'Скандинавская эстетика: кремовые цвета, терракотовые акценты, пышные суфле-панкейки и боулы.',
    taglineShort: 'Nordic Coffee & Brunch',
    heroImage: 'https://images.unsplash.com/photo-1565299543923-37dd37887442?w=800&q=80',
    heroTitle: 'Воздушные японские суфле-панкейки',
    heroTag: 'Signature',
    categories: [
      { id: 'pancakes', name: 'Панкейки', image: 'https://images.unsplash.com/photo-1565299543923-37dd37887442?w=200&q=80' },
      { id: 'breakfast', name: 'Завтраки', image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=200&q=80' },
      { id: 'coffee', name: 'Specialty Кофе', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=200&q=80' },
      { id: 'bowls', name: 'Боулы', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=200&q=80' },
    ],
    dishes: [
      { id: 'bb-1', category: 'pancakes', name: 'Суфле-панкейки с кленовым сиропом', price: 780, desc: '3 нежнейших японских панкейка, взбитые сливки, ягоды малины', image: 'https://images.unsplash.com/photo-1565299543923-37dd37887442?w=500&q=80', badge: 'ХИТ' },
      { id: 'bb-2', category: 'pancakes', name: 'Панкейки Матча с белым шоколадом', price: 820, desc: 'Японский чай матча, ванильный крем, свежая голубика', image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=500&q=80', badge: 'NEW' },
      { id: 'bb-3', category: 'breakfast', name: 'Яйца Бенедикт с лососем', price: 690, desc: 'Бриошь, норвежский лосось су-вид, яйцо пашот, голландский соус', image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=500&q=80' },
      { id: 'bb-4', category: 'breakfast', name: 'Авокадо-тост с рикоттой', price: 520, desc: 'Тартин на закваске, крем из рикотты, вяленые томаты, семена льна', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&q=80' },
      { id: 'bb-5', category: 'coffee', name: 'Флэт Уайт Specialty Эфиопия', price: 290, desc: 'Двойной шот арабики светлой обжарки, шелковистая микропенка', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&q=80', badge: 'ТОП' },
      { id: 'bb-6', category: 'bowls', name: 'Боул Асаи с гранолой', price: 650, desc: 'Органический асаи, кокосовые чипсы, банан, семена чиа', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500&q=80' },
    ]
  },
  {
    id: 'burger',
    name: 'Burger Dark',
    subtitle: 'Craft Burgers & Combos',
    emblem: '🍔',
    accentColor: '#E85C00',
    accentGlow: 'rgba(232,92,0,0.25)',
    designer: 'Jordan Lee 🇺🇸',
    location: 'Нью-Йорк, США',
    rating: '4.91',
    cuisine: 'Бургеры Black Angus · Комбо · Стриты',
    tagline: 'Тёмный стильный интерфейс в духе лучших мировых доставок еды. Промо-баннеры, комбо-наборы и аппетитные фото.',
    taglineShort: 'Craft Burger Delivery',
    heroImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    heroTitle: 'Spicy Burger Combo со скидкой 20%',
    heroTag: 'Limited Offer',
    categories: [
      { id: 'burgers', name: 'Бургеры', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80' },
      { id: 'chicken', name: 'Курица', image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=200&q=80' },
      { id: 'fries', name: 'Фри & Снеки', image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=200&q=80' },
    ],
    dishes: [
      { id: 'bg-1', category: 'burgers', name: 'Classic Cheese Burger', price: 329, desc: 'Котлета Black Angus, двойной чеддер, маринованные огурцы, бургер-соус', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80', badge: 'ХИТ' },
      { id: 'bg-2', category: 'chicken', name: 'Spicy Crispy Chicken', price: 389, desc: 'Острое филе цыпленка в хрустящей панировке, халапеньо, салат айсберг', image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&q=80', badge: 'ОСТРОЕ' },
      { id: 'bg-3', category: 'burgers', name: 'Double Bacon Beef Burger', price: 449, desc: 'Две котлеты из мраморной говядины, хрустящий бекон, копченый соус BBQ', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&q=80', badge: 'MAX' },
      { id: 'bg-4', category: 'fries', name: 'Картофель Фри с пармезаном', price: 189, desc: 'Золотистый картофель, натертый выдержанный пармезан, трюфельное масло', image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&q=80' },
    ]
  },
  {
    id: 'chain',
    name: 'Crispy Chain',
    subtitle: 'Fast Food & Chicken Buckets',
    emblem: '🍗',
    accentColor: '#E4002B',
    accentGlow: 'rgba(228,0,43,0.25)',
    designer: 'Anna Kim 🇰🇷',
    location: 'Сеул / Токио',
    rating: '4.88',
    cuisine: 'Баскеты с курицей · Бургеры · Сеты',
    tagline: 'Светлый сетевой дизайн в стиле гигантов индустрии (KFC). Высокая скорость выбора, яркие бейджи акций и комбо.',
    taglineShort: 'Chicken & Buckets',
    heroImage: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&q=80',
    heroTitle: 'CRISPY. JUICY. IRRESISTIBLE.',
    heroTag: '30% Скидка',
    categories: [
      { id: 'buckets', name: 'Баскеты', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=200&q=80' },
      { id: 'burgers', name: 'Бургеры', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=200&q=80' },
      { id: 'wings', name: 'Крылышки', image: 'https://images.unsplash.com/photo-1527477378372-132766324d26?w=200&q=80' },
    ],
    dishes: [
      { id: 'cf-1', category: 'buckets', name: '8 Pcs Chicken Bucket Combo', price: 1290, desc: '8 кусочков сочной курицы в панировке, 2 больших фри, 2 напитка и соусы', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&q=80', badge: 'BESTSELLER' },
      { id: 'cf-2', category: 'burgers', name: 'Zinger Burger с курицей', price: 590, desc: 'Филе цыпленка в острой панировке, томаты, салат латук, майонезный соус', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&q=80', badge: 'POPULAR' },
      { id: 'cf-3', category: 'wings', name: 'Hot Wings (9 шт)', price: 649, desc: 'Острые хрустящие крылышки по секретному рецепту панировки', image: 'https://images.unsplash.com/photo-1527477378372-132766324d26?w=500&q=80', badge: 'SAVE 15%' },
    ]
  },
  {
    id: 'coffee',
    name: 'Coffee & Pastry',
    subtitle: 'European Coffee House & Cakes',
    emblem: '☕',
    accentColor: '#2D5A3D',
    accentGlow: 'rgba(45,90,61,0.25)',
    designer: 'Sophie Martin 🇫🇷',
    location: 'Лион, Франция',
    rating: '4.93',
    cuisine: 'Авторский кофе · Десерты · Выпечка',
    tagline: 'Изысканный европейский стиль кофейни. Тёплые пастельные тона, авторские десерты и премиальная кофейная карта.',
    taglineShort: 'Specialty Coffee & Cakes',
    heroImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    heroTitle: 'Sweet Moments Start Here',
    heroTag: 'Müil Coffee',
    categories: [
      { id: 'cakes', name: 'Десерты', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80' },
      { id: 'coffee', name: 'Кофе', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80' },
    ],
    dishes: [
      { id: 'cp-1', category: 'cakes', name: 'Фисташковый торт с матча', price: 420, desc: 'Нежнейший фисташковый мусс, бисквит с чаем матча, цельные фисташки', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80', badge: 'ШЕДЕВР' },
      { id: 'cp-2', category: 'cakes', name: 'Шоколадный трюфельный торт', price: 460, desc: 'Бельгийский горький шоколад 72%, пралине из фундука, шоколадный гляссаж', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80', badge: 'ХИТ' },
      { id: 'cp-3', category: 'cakes', name: 'Черничный чизкейк Нью-Йорк', price: 440, desc: 'Запечённый сливочный чизкейк с конфитюром из лесных ягод', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80' },
      { id: 'cp-4', category: 'coffee', name: 'Капучино с латте-артом', price: 290, desc: 'Арабика Колумбия Супремо, плотная сливочная текстура молока', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80' },
    ]
  }
];

/* ═══════════════════════════════════════════════════════════
   LEAD FORM MODAL
═══════════════════════════════════════════════════════════ */
function LeadModal({
  style,
  onClose
}: {
  style: { name: string; accentColor: string; accentGlow: string };
  onClose: () => void;
}) {
  const [form, setForm] = useState({ name: '', phone: '', restaurantName: '', agree: true });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, preferredStyle: style.name })
      });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error || 'Ошибка');
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Не удалось отправить');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1250] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md rounded-3xl p-7 border-2 shadow-2xl bg-[#0d1117] text-white"
        style={{ borderColor: style.accentColor + '55', boxShadow: `0 0 60px ${style.accentGlow}` }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white">
          <X className="w-4 h-4" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto border-2"
              style={{ borderColor: style.accentColor, background: style.accentColor + '20' }}
            >
              <Check className="w-8 h-8" style={{ color: style.accentColor }} />
            </div>
            <h3 className="text-xl font-black">Заявка принята!</h3>
            <p className="text-sm text-slate-300">Наш арт-директор свяжется с вами в Telegram в течение 15 минут.</p>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl font-black text-sm text-black"
              style={{ background: style.accentColor }}
            >
              Закрыть
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <h3 className="text-xl font-black">
                Заказать дизайн как <span style={{ color: style.accentColor }}>{style.name}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">Адаптируем под ваше меню за 24–48 часов</p>
            </div>
            {error && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
                {error}
              </div>
            )}
            {[
              { key: 'name', label: 'Ваше имя *', ph: 'Алексей', req: true },
              { key: 'phone', label: 'Telegram или телефон *', ph: '@username или +7...', req: true },
              { key: 'restaurantName', label: 'Название заведения', ph: 'Кафе Москва', req: false },
            ].map(({ key, label, ph, req }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">{label}</label>
                <input
                  type="text"
                  required={req}
                  value={(form as any)[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={ph}
                  className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 rounded-xl focus:outline-none placeholder-slate-500"
                />
              </div>
            ))}
            <label className="flex items-center gap-2.5 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={e => setForm({ ...form, agree: e.target.checked })}
                style={{ accentColor: style.accentColor }}
              />
              <span>Согласен на обработку персональных данных</span>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 text-black disabled:opacity-50 shadow-xl active:scale-[0.98] transition-all"
              style={{ background: style.accentColor }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /><span>Отправить заявку</span></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN SHOWCASE GALLERY
═══════════════════════════════════════════════════════════ */
export function DesignShowcaseGallery() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenMode, setFullscreenMode] = useState<'mobile' | 'desktop'>('mobile');
  const [selectedDish, setSelectedDish] = useState<DemoDish | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [leadStyle, setLeadStyle] = useState<null | { name: string; accentColor: string; accentGlow: string }>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const active = RESTAURANTS_DATA[activeIdx];

  const prev = () => setActiveIdx(i => (i - 1 + RESTAURANTS_DATA.length) % RESTAURANTS_DATA.length);
  const next = () => setActiveIdx(i => (i + 1) % RESTAURANTS_DATA.length);

  const handleAddToCart = (dish: DemoDish, qty: number = 1, options: string[] = []) => {
    const nameStr = getDishName(dish.name);
    const itemKey = `${dish.id}-${options.sort().join('-')}`;
    setCartItems(prev => {
      const existing = prev.find(i => i.id === itemKey);
      if (existing) {
        return prev.map(i => (i.id === itemKey ? { ...i, quantity: i.quantity + qty } : i));
      }
      return [
        ...prev,
        {
          id: itemKey,
          name: nameStr,
          price: dish.price,
          quantity: qty,
          image: dish.image,
          options
        }
      ];
    });
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(it => (it.id === id ? { ...it, quantity: it.quantity + delta } : it))
        .filter(it => it.quantity > 0)
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Sync tab scroll
  useEffect(() => {
    const el = tabsRef.current?.children[activeIdx] as HTMLElement;
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeIdx]);

  return (
    <section
      id="demo"
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#050810 0%,#070b14 60%,#050810 100%)' }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-0 transition-all duration-700">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-20 transition-all duration-700"
          style={{ background: `radial-gradient(ellipse,${active.accentColor} 0%,transparent 70%)` }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Интерактивные примеры готовых работ от наших дизайнеров</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black font-serif text-white leading-tight">
            Выберите стиль{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              вашего меню
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Каждый дизайн — это полностью рабочее PWA-приложение с реальными фото блюд, работающими уведомлениями 🔔,
            карточками модификаторов и живой корзиной 🛒.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="relative mb-10">
          <div
            ref={tabsRef}
            className="flex gap-2 overflow-x-auto scrollbar-none pb-2 px-1 justify-start lg:justify-center"
          >
            {RESTAURANTS_DATA.map((r, i) => (
              <button
                key={r.id}
                onClick={() => setActiveIdx(i)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 transition-all duration-300 shrink-0 font-bold"
                style={
                  i === activeIdx
                    ? {
                        background: r.accentColor + '20',
                        borderColor: r.accentColor,
                        color: 'white',
                        boxShadow: `0 0 24px ${r.accentGlow}`,
                      }
                    : {
                        background: 'rgba(255,255,255,0.04)',
                        borderColor: 'rgba(255,255,255,0.10)',
                        color: '#94a3b8',
                      }
                }
              >
                <span className="text-lg leading-none">{r.emblem}</span>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-black leading-none">{r.name}</p>
                  <p className="text-[9px] opacity-60 mt-0.5">{r.subtitle}</p>
                </div>
                {i === activeIdx && (
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: r.accentColor }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-center max-w-5xl mx-auto">
          {/* Phone Column */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {/* Prev/Next arrows */}
              <button
                onClick={prev}
                className="absolute -left-10 sm:-left-14 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/8 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center transition-all z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="absolute -right-10 sm:-right-14 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/8 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center transition-all z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <IPhoneFrame accentGlow={active.accentGlow}>
                <RestaurantAppView
                  restaurant={active}
                  dishes={active.dishes}
                  categories={active.categories}
                  cartItems={cartItems}
                  onSelectDish={setSelectedDish}
                  onAddToCart={d => handleAddToCart(d, 1)}
                  onUpdateCartQty={handleUpdateCartQty}
                  onClearCart={handleClearCart}
                  liveIframeUrl={active.liveIframeUrl}
                />
              </IPhoneFrame>
            </div>

            {/* Dots */}
            <div className="flex items-center gap-1.5 mt-5">
              {RESTAURANTS_DATA.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeIdx ? 20 : 6,
                    height: 6,
                    background: i === activeIdx ? active.accentColor : 'rgba(255,255,255,0.2)',
                  }}
                />
              ))}
            </div>

            {/* Fullscreen Button under Phone */}
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={() => setIsFullscreen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-all shadow-lg active:scale-95"
              >
                <Maximize2 className="w-4 h-4 text-amber-400" />
                <span>Открыть на весь экран и потыкать</span>
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div
            className="rounded-3xl p-6 sm:p-7 border-2 space-y-5 transition-all duration-500"
            style={{
              background: 'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))',
              borderColor: active.accentColor + '40',
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${active.accentGlow}`,
            }}
          >
            {/* Designer */}
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>
                Дизайн: <span className="text-slate-200 font-semibold">{active.designer}</span> · {active.location}
              </span>
              {active.liveIframeUrl && (
                <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                  РЕАЛЬНЫЙ РЕСТОРАН
                </span>
              )}
            </div>

            {/* Title */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-serif">{active.name}</h3>
                <p className="text-sm font-bold mt-1" style={{ color: active.accentColor }}>
                  {active.subtitle}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{active.cuisine}</p>
              </div>
              <div
                className="flex items-center gap-1 px-3 py-1.5 rounded-2xl border shrink-0"
                style={{
                  background: active.accentColor + '18',
                  borderColor: active.accentColor + '40',
                  color: active.accentColor,
                }}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-sm font-black">{active.rating}</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{active.tagline}</p>

            {/* Live website link if available */}
            {active.liveIframeUrl && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300">
                  <Globe className="w-4 h-4" />
                  <span>Оригинальный сайт заведения:</span>
                </div>
                <a
                  href={active.liveIframeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-white font-bold underline hover:text-amber-400 transition-colors"
                >
                  <span>chinanews.moscow</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Features */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Включённый функционал дизайна:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {[
                  'Реальные аппетитные фото блюд в высоком разрешении',
                  'Интерактивная корзина с расчётом заказа',
                  'Всплывающие уведомления и спецпредложения 🔔',
                  'Модальное окно модификаторов блюд и порций',
                ].map((f, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs text-slate-200 p-2 rounded-xl bg-black/30 border border-white/5"
                  >
                    <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: active.accentColor }} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() =>
                  setLeadStyle({
                    name: active.name,
                    accentColor: active.accentColor,
                    accentGlow: active.accentGlow,
                  })
                }
                className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xl"
                style={{
                  background: `linear-gradient(90deg,${active.accentColor},${active.accentColor}cc)`,
                  boxShadow: `0 8px 30px ${active.accentGlow}`,
                }}
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>Хочу такой дизайн</span>
              </button>

              <button
                onClick={() => setIsFullscreen(true)}
                className="px-5 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <Maximize2 className="w-4 h-4 text-amber-400" />
                <span>Тест-драйв</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
         FULLSCREEN SIMULATOR
      ═══════════════════════════════════════════════════════════ */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[1100] bg-[#06080e] flex flex-col animate-fadeIn select-none overflow-hidden">
          {/* Top Bar */}
          <header className="px-4 py-3 bg-[#0a0d16] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0 z-30">
            {/* Restaurant Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              {RESTAURANTS_DATA.map((r, i) => (
                <button
                  key={r.id}
                  onClick={() => setActiveIdx(i)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                    i === activeIdx
                      ? 'bg-white/15 text-white border-amber-400/60 shadow-md'
                      : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{r.emblem}</span>
                  <span>{r.name}</span>
                </button>
              ))}
            </div>

            {/* Controls Right */}
            <div className="flex items-center gap-2.5">
              {/* Mode Switcher */}
              <div className="hidden sm:flex items-center p-1 rounded-xl bg-white/6 border border-white/10">
                <button
                  onClick={() => setFullscreenMode('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    fullscreenMode === 'mobile' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Смартфон</span>
                </button>
                <button
                  onClick={() => setFullscreenMode('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    fullscreenMode === 'desktop' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Планшет / Десктоп</span>
                </button>
              </div>

              {/* Lead CTA */}
              <button
                onClick={() => {
                  setLeadStyle({
                    name: active.name,
                    accentColor: active.accentColor,
                    accentGlow: active.accentGlow,
                  });
                }}
                className="px-4 py-2 rounded-xl text-black font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                style={{ background: active.accentColor }}
              >
                Хочу такой дизайн
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all ml-1"
                aria-label="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Interactive Stage */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 flex items-center justify-center relative">
            {fullscreenMode === 'mobile' ? (
              <div className="py-2 animate-fadeIn">
                <IPhoneFrame accentGlow={active.accentGlow} isLarge={true}>
                  <RestaurantAppView
                    restaurant={active}
                    dishes={active.dishes}
                    categories={active.categories}
                    cartItems={cartItems}
                    onSelectDish={setSelectedDish}
                    onAddToCart={d => handleAddToCart(d, 1)}
                    onUpdateCartQty={handleUpdateCartQty}
                    onClearCart={handleClearCart}
                    liveIframeUrl={active.liveIframeUrl}
                  />
                </IPhoneFrame>
              </div>
            ) : (
              /* Wide Screen Desktop / Tablet View */
              <div
                className="w-full max-w-5xl rounded-3xl overflow-hidden border-2 shadow-2xl animate-fadeIn flex flex-col h-[82vh]"
                style={{
                  background: '#0c0f17',
                  borderColor: active.accentColor + '50',
                  boxShadow: `0 0 60px ${active.accentGlow}`,
                }}
              >
                <div className="px-6 py-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{active.emblem}</span>
                    <div>
                      <h2 className="text-xl font-black text-white">{active.name}</h2>
                      <p className="text-xs text-slate-400">{active.subtitle} • {active.cuisine}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{active.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-none p-6">
                  <RestaurantAppView
                    restaurant={active}
                    dishes={active.dishes}
                    categories={active.categories}
                    cartItems={cartItems}
                    onSelectDish={setSelectedDish}
                    onAddToCart={d => handleAddToCart(d, 1)}
                    onUpdateCartQty={handleUpdateCartQty}
                    onClearCart={handleClearCart}
                    liveIframeUrl={active.liveIframeUrl}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dish Detail Modal */}
      {selectedDish && (
        <InteractiveDishModal
          dish={selectedDish}
          accentColor={active.accentColor}
          onClose={() => setSelectedDish(null)}
          onAdd={handleAddToCart}
        />
      )}

      {/* Lead Form Modal */}
      {leadStyle && <LeadModal style={leadStyle} onClose={() => setLeadStyle(null)} />}
    </section>
  );
}
