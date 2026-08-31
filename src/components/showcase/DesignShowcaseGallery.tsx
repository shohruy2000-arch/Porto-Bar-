'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Star, Plus, Check, Send, Loader2, X, Sparkles,
  ExternalLink, ChevronLeft, ChevronRight, ShoppingBag,
  Bell, Heart, SlidersHorizontal, ArrowRight, Flame,
  Coffee, Utensils, Gift, Percent,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   1. PORTO BAR — Dark Luxury Fine Dining (real menu from API)
═══════════════════════════════════════════════════════════ */
function PortoBarPhone() {
  const [dishes, setDishes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('Устрицы');
  const TABS = ['Устрицы', 'Пицца', 'Паста', 'Напитки'];
  const FALLBACK = [
    { name: 'Устрица Фин де Клер', price: 680, emoji: '🦪' },
    { name: 'Тартар из тунца', price: 890, emoji: '🐟' },
    { name: 'Фуа-гра с бриошью', price: 1890, emoji: '🍞' },
    { name: 'Паста Карбонара', price: 1190, emoji: '🍝' },
    { name: 'Шампанское Моэт', price: 1600, emoji: '🥂' },
    { name: 'Тартар из говядины', price: 990, emoji: '🥩' },
  ];

  useEffect(() => {
    fetch('/api/menu').then(r => r.json()).then(data => {
      const list = Array.isArray(data) ? data : data.dishes || data.items || [];
      setDishes(list.slice(0, 6));
    }).catch(() => {});
  }, []);

  const display = dishes.length > 0 ? dishes : FALLBACK;

  return (
    <div className="w-full h-full bg-[#0d0f14] text-white overflow-y-auto scrollbar-none flex flex-col">
      <div className="sticky top-0 z-10 bg-[#0d0f14]/95 backdrop-blur px-4 pt-8 pb-3 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
              <span className="text-[10px] font-black text-black">PB</span>
            </div>
            <div>
              <p className="text-[11px] font-black">Porto Bar</p>
              <p className="text-[9px] text-slate-400">Room 214 · Отель</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-500/30">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-bold text-amber-300">4.9</span>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <div className="w-full bg-white/5 border border-white/8 text-slate-500 text-[10px] pl-9 pr-4 py-2.5 rounded-2xl">
            Поиск устриц, тартаров, вин...
          </div>
        </div>
      </div>

      <div className="relative mx-3 mt-3 rounded-2xl overflow-hidden h-24 flex items-end p-3"
        style={{ background: 'linear-gradient(135deg,#1a1200,#2d1f00)' }}>
        <img src="https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&q=70"
          alt="" className="absolute inset-0 w-full h-full object-cover opacity-35" />
        <div className="relative z-10">
          <p className="text-[8px] font-bold text-amber-400 uppercase tracking-wider">🦪 Шеф рекомендует</p>
          <p className="text-[13px] font-black text-white leading-tight">Морские деликатесы<br />и премиальный сервис</p>
        </div>
      </div>

      <div className="px-3 mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap border transition-all ${activeTab === t ? 'bg-amber-500 text-black border-amber-400' : 'bg-white/5 text-slate-300 border-white/8'}`}>
            {t}
          </button>
        ))}
      </div>

      <p className="px-3 mt-3 text-[11px] font-black uppercase tracking-wider">🏆 Шедевры кухни</p>

      <div className="px-3 mt-2 grid grid-cols-2 gap-2 pb-4">
        {display.map((d: any, i) => (
          <div key={i} className="bg-[#161920] rounded-2xl overflow-hidden border border-white/6">
            <div className="h-[72px] bg-white/5 flex items-center justify-center text-2xl relative">
              {d.image ? <img src={d.image} alt={d.name} className="w-full h-full object-cover" /> : <span>{d.emoji || '🍽'}</span>}
            </div>
            <div className="p-2">
              <p className="text-[10px] font-bold line-clamp-1">{d.name}</p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[11px] font-black text-amber-400">{d.price} ₽</span>
                <button className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                  <Plus className="w-3.5 h-3.5 text-black stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   2. BRUNCH BISTRO — Nordic Light Café
═══════════════════════════════════════════════════════════ */
function BrunchBistroPhone() {
  const [activeTab, setActiveTab] = useState('Панкейки');
  const TABS = ['Панкейки', 'Завтраки', 'Кофе', 'Боулы'];
  const MENU: Record<string, any[]> = {
    Панкейки: [
      { name: 'Суфле-Панкейки', price: 780, desc: '3 японских пухлых панкейка', emoji: '🥞', badge: 'ХИТ' },
      { name: 'Панкейки Матча', price: 820, desc: 'Зелёный чай + ваниль', emoji: '🍵', badge: 'NEW' },
      { name: 'Блины Рикотта', price: 690, desc: 'С лесными ягодами', emoji: '🫐' },
      { name: 'Американские', price: 560, desc: 'С кленовым сиропом', emoji: '🧇' },
    ],
    Завтраки: [
      { name: 'Яйца Бенедикт', price: 690, desc: 'Лосось + голландез', emoji: '🍳' },
      { name: 'Авокадо Тост', price: 520, desc: 'Ржаной хлеб + рикотта', emoji: '🥑' },
      { name: 'Боул Асаи', price: 650, desc: 'Гранола, манго, кокос', emoji: '🫐' },
      { name: 'Гранола', price: 420, desc: 'Греческий йогурт', emoji: '🥣' },
    ],
    Кофе: [
      { name: 'Флэт Уайт', price: 290, desc: 'Double shot', emoji: '☕', badge: 'ТОП' },
      { name: 'Матча Латте', price: 350, desc: 'Овсяное молоко', emoji: '🍵' },
      { name: 'Колд Брю', price: 380, desc: '18 часов заваривания', emoji: '🧊' },
      { name: 'Капучино', price: 280, desc: 'Ethiopia Yirgacheffe', emoji: '☕' },
    ],
    Боулы: [
      { name: 'Боул Будды', price: 720, desc: 'Лебеда + нут + тахини', emoji: '🥗' },
      { name: 'Poke Salmon', price: 890, desc: 'Норвежский лосось', emoji: '🍣' },
      { name: 'Боул Асаи', price: 650, desc: 'Асаи + гранола', emoji: '🫐' },
      { name: 'Греческий', price: 680, desc: 'Фета + оливки', emoji: '🫒' },
    ],
  };
  const items = MENU[activeTab] || MENU['Панкейки'];

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-none" style={{ background: '#FFF8F0', color: '#2D1810' }}>
      <div className="sticky top-0 z-10 px-4 pt-8 pb-3 border-b" style={{ background: '#FFF8F0', borderColor: '#F0E0D0' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#C05830' }}>
              <span className="text-[10px] font-black text-white">BB</span>
            </div>
            <div>
              <p className="text-[11px] font-black" style={{ color: '#2D1810' }}>Brunch's Bistro</p>
              <p className="text-[9px]" style={{ color: '#9B7B6A' }}>Eco Loyalty Club 🌿</p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: '#C0583018', border: '1px solid #C0583040' }}>
            <Star className="w-3 h-3 fill-orange-600 text-orange-600" />
            <span className="text-[10px] font-bold" style={{ color: '#C05830' }}>4.8</span>
          </div>
        </div>
        <div className="w-full text-[10px] pl-9 pr-4 py-2.5 rounded-2xl relative" style={{ background: '#F5E8DC', border: '1px solid #E8D0BC', color: '#9B7B6A' }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#9B7B6A' }} />
          Поиск панкейков, кофе...
        </div>
      </div>

      <div className="relative mx-3 mt-3 rounded-2xl overflow-hidden h-24 flex items-end p-3" style={{ background: 'linear-gradient(135deg,#C05830,#A04020)' }}>
        <img src="https://images.unsplash.com/photo-1565299543923-37dd37887442?w=400&q=70" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10">
          <p className="text-[8px] font-bold text-orange-200 uppercase tracking-wider">🥞 Signature</p>
          <p className="text-[13px] font-black text-white leading-tight">Суфле-панкейки от шеф-повара</p>
        </div>
        <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full text-[8px] font-black text-white" style={{ background: '#2D1810' }}>🌿 ECO</div>
      </div>

      <div className="px-3 mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className="px-3 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap border transition-all"
            style={activeTab === t ? { background: '#C05830', color: 'white', borderColor: '#A04020' } : { background: '#F5E8DC', color: '#9B7B6A', borderColor: '#E8D0BC' }}>
            {t}
          </button>
        ))}
      </div>

      <p className="px-3 mt-3 text-[11px] font-black uppercase tracking-wider" style={{ color: '#2D1810' }}>✨ {activeTab}</p>

      <div className="px-3 mt-2 grid grid-cols-2 gap-2 pb-4">
        {items.map((d, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border" style={{ background: 'white', borderColor: '#F0E0D0' }}>
            <div className="h-[72px] flex items-center justify-center text-2xl relative" style={{ background: '#FDF0E6' }}>
              {d.emoji}
              {d.badge && <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-[8px] font-black text-white" style={{ background: '#C05830' }}>{d.badge}</span>}
            </div>
            <div className="p-2">
              <p className="text-[10px] font-bold line-clamp-1" style={{ color: '#2D1810' }}>{d.name}</p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[11px] font-black" style={{ color: '#C05830' }}>{d.price} ₽</span>
                <button className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#C05830' }}>
                  <Plus className="w-3.5 h-3.5 text-white stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   3. BURGER DARK — Fast Food Dark Orange (like Reference 1)
═══════════════════════════════════════════════════════════ */
function BurgerDarkPhone() {
  const [activeTab, setActiveTab] = useState('Бургер');
  const CATS = [
    { label: 'Бургер', emoji: '🍔' },
    { label: 'Пицца', emoji: '🍕' },
    { label: 'Курица', emoji: '🍗' },
    { label: 'Картофель', emoji: '🍟' },
    { label: 'Напитки', emoji: '🥤' },
  ];
  const ITEMS = [
    { name: 'Cheese Burger', price: 329, emoji: '🍔', badge: '' },
    { name: 'Spicy Chicken', price: 389, emoji: '🍗', badge: 'SPICY' },
    { name: 'Double Beef', price: 449, emoji: '🍔', badge: 'NEW' },
    { name: 'BBQ Burger', price: 419, emoji: '🍔', badge: '' },
    { name: 'Crispy Fries', price: 149, emoji: '🍟', badge: '' },
    { name: 'Cola 0.5L', price: 119, emoji: '🥤', badge: '' },
  ];

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-none" style={{ background: '#141008' }}>
      {/* Header */}
      <div className="px-4 pt-8 pb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
            <span className="text-[10px]">☰</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-[11px] font-black text-white">A</div>
        </div>
        <p className="text-[10px] text-slate-400 mt-2">Hi, Alex 👋</p>
        <p className="text-[18px] font-black text-white leading-tight">Good Food</p>
        <p className="text-[18px] font-black leading-tight" style={{ color: '#E85C00' }}>Good Mood!</p>
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-3.5 h-3.5 text-slate-500" />
          <div className="w-full bg-white/6 border border-white/8 text-[10px] text-slate-500 pl-9 pr-10 py-2.5 rounded-2xl">Search your favorite food</div>
          <div className="absolute right-3 w-5 h-5 rounded-md bg-white/10 flex items-center justify-center">
            <SlidersHorizontal className="w-3 h-3 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {CATS.map(c => (
          <button key={c.label} onClick={() => setActiveTab(c.label)}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl shrink-0 border transition-all text-[9px] font-bold"
            style={activeTab === c.label
              ? { background: '#E85C00', color: 'white', borderColor: '#E85C00' }
              : { background: '#1E1710', color: '#9B8B7A', borderColor: '#2A2018' }}>
            <span className="text-base leading-none">{c.emoji}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Promo Banner */}
      <div className="mx-4 mt-3 rounded-2xl p-4 relative overflow-hidden flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg,#1E1008,#2E1A08)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(circle at 70% 50%, #E85C00 0%, transparent 60%)' }} />
        <div className="z-10">
          <p className="text-[9px] text-orange-400 font-bold">🔥 Limited Time Offer</p>
          <p className="text-[13px] font-black text-white leading-tight">Spicy Burger</p>
          <p className="text-[13px] font-black leading-tight" style={{ color: '#E85C00' }}>Combo</p>
          <button className="mt-2 px-3 py-1.5 rounded-xl text-[10px] font-black text-white" style={{ background: '#E85C00' }}>Order Now</button>
        </div>
        <div className="text-right z-10">
          <p className="text-[22px] font-black text-white leading-none">20%</p>
          <p className="text-[12px] font-bold text-slate-300">OFF</p>
          <p className="text-2xl mt-1">🍟🥤</p>
        </div>
      </div>

      {/* Popular Now */}
      <div className="px-4 mt-3 flex items-center justify-between">
        <p className="text-[12px] font-black text-white">Popular Now</p>
        <span className="text-[10px] font-bold" style={{ color: '#E85C00' }}>View All</span>
      </div>

      <div className="px-4 mt-2 grid grid-cols-3 gap-2 pb-4">
        {ITEMS.map((item, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border" style={{ background: '#1E1710', borderColor: '#2A2018' }}>
            <div className="h-[60px] flex items-center justify-center text-xl relative"
              style={{ background: 'linear-gradient(135deg,#2E2010,#1E1008)' }}>
              {item.emoji}
              {item.badge && (
                <span className="absolute top-1 left-1 px-1 py-0.5 rounded text-[7px] font-black text-white" style={{ background: '#E85C00' }}>{item.badge}</span>
              )}
              <button className="absolute bottom-1 right-1 w-4.5 h-4.5 rounded-full flex items-center justify-center" style={{ background: '#E85C00' }}>
                <Heart className="w-2.5 h-2.5 text-white" />
              </button>
            </div>
            <div className="p-1.5">
              <p className="text-[9px] font-bold text-white line-clamp-1">{item.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] font-black text-white">{item.price} ₽</span>
                <button className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#E85C00' }}>
                  <Plus className="w-3 h-3 text-white stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   4. CHAIN FAST FOOD — Light Red Style (like Reference 2)
═══════════════════════════════════════════════════════════ */
function ChainFoodPhone() {
  const [activeTab, setActiveTab] = useState('Все');
  const CATS = [
    { label: 'Все', emoji: '🍗' },
    { label: 'Бургеры', emoji: '🍔' },
    { label: 'Сеты', emoji: '🪣' },
    { label: 'Снеки', emoji: '🍟' },
    { label: 'Напитки', emoji: '🥤' },
    { label: 'Десерты', emoji: '🍦' },
  ];
  const COMBOS = [
    { name: '8 Pcs Chicken Bucket', desc: '2 картофель + 2 соус + 2 напитка', price: 1290, rating: '4.8', reviews: '12.5K+', badge: 'BESTSELLER', badgeColor: '#E4002B' },
    { name: 'Zinger Burger Combo', desc: 'Бургер + картофель + напиток', price: 590, rating: '4.7', reviews: '8.7K+', badge: 'POPULAR', badgeColor: '#FF6B00' },
    { name: '5 Pcs Hot & Crispy', desc: '5 кусочков курицы + соус', price: 849, rating: '4.6', reviews: '6.3K+', badge: 'SAVE 15%', badgeColor: '#16A34A' },
  ];

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-none" style={{ background: '#FDF7F0' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 pt-8 pb-3 border-b bg-white/90 backdrop-blur" style={{ borderColor: '#F0E0D0' }}>
        <div className="flex items-center justify-between mb-1">
          <div className="w-7 h-7 rounded-xl bg-gray-100 flex items-center justify-center text-[10px]">☰</div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-black text-white" style={{ background: '#E4002B' }}>3</span>
            </div>
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-black text-white" style={{ background: '#E4002B' }}>2</span>
            </div>
          </div>
        </div>
        <p className="text-[9px] text-gray-400">Hello, Chicken Lover! 👋</p>
        <p className="text-[16px] font-black leading-none" style={{ color: '#E4002B' }}>CrispyChain</p>
        <p className="text-[9px] text-gray-400">It's finger lickin' good.</p>
      </div>

      {/* Search */}
      <div className="px-4 mt-3">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-3.5 h-3.5 text-gray-400" />
          <div className="w-full bg-white border border-gray-200 text-[10px] text-gray-400 pl-9 pr-10 py-2.5 rounded-2xl shadow-sm">Search for your favorite chicken...</div>
          <SlidersHorizontal className="absolute right-3 w-3.5 h-3.5 text-gray-400" />
        </div>
      </div>

      {/* Hero Banner */}
      <div className="mx-4 mt-3 rounded-2xl overflow-hidden h-28 relative flex items-end p-3"
        style={{ background: 'linear-gradient(135deg,#8B0000,#E4002B)' }}>
        <img src="https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=70"
          alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10">
          <p className="text-[8px] text-red-200 font-bold uppercase tracking-wider">LIMITED TIME</p>
          <p className="text-[15px] font-black text-white leading-tight">CRISPY.<br />JUICY.<br />IRRESISTIBLE.</p>
        </div>
        <button className="absolute bottom-3 right-3 z-10 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-[10px] font-black" style={{ color: '#E4002B' }}>
          Order Now <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Category Icons */}
      <div className="px-4 mt-3 flex gap-3 overflow-x-auto scrollbar-none pb-1">
        {CATS.map(c => (
          <button key={c.label} onClick={() => setActiveTab(c.label)}
            className="flex flex-col items-center gap-1 shrink-0">
            <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-base shadow-sm"
              style={activeTab === c.label
                ? { borderColor: '#E4002B', background: '#E4002B18' }
                : { borderColor: '#E8D8C8', background: 'white' }}>
              {c.emoji}
            </div>
            <span className="text-[8px] font-bold" style={{ color: activeTab === c.label ? '#E4002B' : '#888' }}>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Popular Combos */}
      <div className="px-4 mt-3 flex items-center justify-between">
        <p className="text-[12px] font-black text-gray-900">Popular Combos</p>
        <span className="text-[10px] font-bold flex items-center gap-1" style={{ color: '#E4002B' }}>View All <ArrowRight className="w-3 h-3" /></span>
      </div>

      <div className="px-4 mt-2 grid grid-cols-3 gap-2 pb-4">
        {COMBOS.map((c, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border bg-white shadow-sm" style={{ borderColor: '#F0E0D0' }}>
            <div className="h-[64px] relative flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg,#FDF0E0,#F8E0C8)' }}>
              🍗
              <span className="absolute top-1 left-1 px-1 py-0.5 rounded text-[7px] font-black text-white leading-none" style={{ background: c.badgeColor }}>{c.badge}</span>
              <button className="absolute top-1 right-1"><Heart className="w-3 h-3 text-gray-400" /></button>
            </div>
            <div className="p-1.5">
              <p className="text-[9px] font-bold text-gray-900 line-clamp-2 leading-tight">{c.name}</p>
              <div className="flex items-center gap-0.5 mt-0.5">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                <span className="text-[8px] text-gray-500">{c.rating}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] font-black text-gray-900">{c.price} ₽</span>
                <button className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#E4002B' }}>
                  <Plus className="w-3 h-3 text-white stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Promo Banner */}
      <div className="mx-4 mb-4 rounded-2xl p-3 flex items-center justify-between"
        style={{ background: '#FFF0E8', border: '1px solid #F0D0B8' }}>
        <div>
          <p className="text-[8px] font-bold text-orange-600 uppercase">EXCLUSIVE OFFER</p>
          <p className="text-[11px] font-black text-gray-900 leading-tight">Up to 30% OFF</p>
          <p className="text-[8px] text-gray-500">On selected combos</p>
          <button className="mt-1 flex items-center gap-1 px-2.5 py-1 rounded-xl text-[9px] font-black text-white" style={{ background: '#E4002B' }}>
            Order Now <ArrowRight className="w-2.5 h-2.5" />
          </button>
        </div>
        <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl" style={{ background: '#E4002B18' }}>🍗</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   5. COFFEE SHOP — Elegant Web Style (like Reference 3)
═══════════════════════════════════════════════════════════ */
function CoffeeShopPhone() {
  const DESSERTS = [
    { name: 'Фисташковый', subtitle: 'Pistachio Bliss', desc: 'Rich. Nutty. Irresistible.', emoji: '🍰', bg: '#E8F0E0' },
    { name: 'Шоколадный', subtitle: 'Chocolate Dream', desc: 'Decadent. Smooth. Heavenly.', emoji: '🍫', bg: '#F0E4D0' },
    { name: 'Ягодный', subtitle: 'Berry Delight', desc: 'Fruity. Fresh. Delightful.', emoji: '🫐', bg: '#F0E0EC' },
  ];

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-none" style={{ background: '#F5F0E8' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 pt-8 pb-3 flex items-center justify-between" style={{ background: '#F5F0E8' }}>
        <div className="flex items-center gap-1">
          <Coffee className="w-4 h-4" style={{ color: '#2D5A3D' }} />
          <span className="text-[14px] font-black" style={{ color: '#1A3A2A' }}>Coffee<span style={{ color: '#C8A14B' }}>✦</span></span>
        </div>
        <div className="flex items-center gap-3">
          <Search className="w-4 h-4" style={{ color: '#555' }} />
          <ShoppingBag className="w-4 h-4" style={{ color: '#555' }} />
        </div>
      </div>

      {/* Hero */}
      <div className="px-4 pt-2 grid grid-cols-2 gap-3 items-center">
        <div>
          <p className="text-[9px] font-bold italic" style={{ color: '#C8A14B' }}>Life Happens, Coffee Helps</p>
          <p className="text-[17px] font-black leading-tight mt-1" style={{ color: '#1A2A1A', fontFamily: 'Georgia, serif' }}>
            Sweet Moments Start{' '}
            <span style={{ color: '#C8A14B' }}>Here.</span>
          </p>
          <p className="text-[9px] mt-1.5 leading-relaxed" style={{ color: '#666' }}>
            Indulge in handcrafted coffee and delicious treats.
          </p>
          <button className="mt-3 flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black text-white" style={{ background: '#2D5A3D' }}>
            EXPLORE MORE <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="relative h-28 rounded-2xl overflow-hidden" style={{ background: '#E8DFD0' }}>
          <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&q=70" alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Feature badges */}
      <div className="px-4 mt-4 flex items-center justify-between">
        {[
          { icon: '🌿', text: 'Finest\nIngredients' },
          { icon: '☕', text: 'Perfectly\nBrewed' },
          { icon: '💚', text: 'Made with\nLove' },
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm" style={{ background: '#E0EAD8', border: '1.5px solid #2D5A3D30' }}>{f.icon}</div>
            <p className="text-[8px] font-semibold leading-tight" style={{ color: '#444' }}>{f.text}</p>
          </div>
        ))}
      </div>

      {/* Dessert Cards */}
      <div className="px-4 mt-4">
        <p className="text-[10px] font-black uppercase tracking-wider mb-3" style={{ color: '#1A3A2A' }}>Our Signature ✦</p>
        <div className="space-y-2.5">
          {DESSERTS.map((d, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: d.bg }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl bg-white/60">{d.emoji}</div>
              <div className="flex-1">
                <p className="text-[11px] font-black" style={{ color: '#1A3A2A' }}>{d.name}</p>
                <p className="text-[9px] italic" style={{ color: '#C8A14B' }}>{d.subtitle}</p>
                <p className="text-[8px] mt-0.5" style={{ color: '#666' }}>{d.desc}</p>
              </div>
              <button className="w-7 h-7 rounded-full flex items-center justify-center text-white" style={{ background: '#C8A14B' }}>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Special Coffee */}
      <div className="mx-4 mt-4 mb-4 rounded-2xl overflow-hidden">
        <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=70" alt="" className="w-full h-24 object-cover" />
        <div className="p-3" style={{ background: '#2D5A3D' }}>
          <p className="text-[8px] text-green-300 italic">Our Special</p>
          <p className="text-[13px] font-black text-white" style={{ fontFamily: 'Georgia, serif' }}>Müil Coffee</p>
          <div className="mt-1 space-y-0.5">
            {['100% Arabica Beans', 'Medium Dark Roast', 'Rich Aroma & Smooth Finish'].map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <Check className="w-2.5 h-2.5 text-green-300" />
                <span className="text-[8px] text-green-100">{t}</span>
              </div>
            ))}
          </div>
          <button className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[9px] font-black" style={{ color: '#2D5A3D' }}>
            DISCOVER MORE <ArrowRight className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   6. CAFÉ WARM — Cozy Warm Brown (like Reference 4)
═══════════════════════════════════════════════════════════ */
function CafeWarmPhone() {
  const MENU_ITEMS = [
    { name: 'Cappuccino', price: 290, emoji: '☕' },
    { name: 'Chocolate Cake', price: 380, emoji: '🍰' },
    { name: 'Chicken Sandwich', price: 490, emoji: '🥪' },
    { name: 'Iced Latte', price: 320, emoji: '🧊' },
  ];

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-none" style={{ background: '#F8F2E8' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 pt-8 pb-2 flex items-center justify-between border-b" style={{ background: '#F8F2E8', borderColor: '#E8D8C0' }}>
        <div>
          <p className="text-[8px] text-gray-400 uppercase tracking-widest">CAFÉ</p>
          <p className="text-[10px] text-gray-400" style={{ color: '#8B6B4A' }}>COFFEE & MORE</p>
        </div>
        <button className="px-3 py-1.5 rounded-lg text-[9px] font-black text-white" style={{ background: '#5C3D2E' }}>ORDER ONLINE</button>
      </div>

      {/* Hero */}
      <div className="mx-3 mt-3 rounded-2xl overflow-hidden relative h-36">
        <img src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=70" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ background: 'rgba(92,61,46,0.6)' }}>
          <p className="text-[8px] text-amber-200 italic">Welcome to Our Café</p>
          <p className="text-[15px] font-black text-white leading-tight" style={{ fontFamily: 'Georgia, serif' }}>Good Coffee,<br />Great Moments</p>
          <button className="mt-2 px-4 py-1.5 rounded-lg text-[9px] font-black text-white" style={{ background: '#5C3D2E' }}>VIEW OUR MENU</button>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="px-4 mt-4 text-center">
        <p className="text-[8px] text-amber-700">☕</p>
        <p className="text-[13px] font-black" style={{ color: '#3A2010', fontFamily: 'Georgia, serif' }}>Why Choose Us?</p>
        <p className="text-[8px] text-gray-400 mt-0.5">Quality, comfort, and memorable moments.</p>
      </div>

      <div className="px-4 mt-3 grid grid-cols-3 gap-2">
        {[
          { emoji: '☕', title: 'Quality Coffee', desc: 'Finest beans brewed to perfection' },
          { emoji: '🍰', title: 'Fresh & Delicious', desc: 'Made fresh daily' },
          { emoji: '🌿', title: 'Cozy Atmosphere', desc: 'Warm & welcoming space' },
        ].map((c, i) => (
          <div key={i} className="text-center">
            <div className="w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center text-2xl mb-1" style={{ background: '#EFE0CC' }}>{c.emoji}</div>
            <p className="text-[9px] font-bold" style={{ color: '#3A2010' }}>{c.title}</p>
          </div>
        ))}
      </div>

      {/* Menu Highlights */}
      <div className="px-4 mt-4 text-center">
        <p className="text-[8px] text-amber-700">☕</p>
        <p className="text-[13px] font-black" style={{ color: '#3A2010', fontFamily: 'Georgia, serif' }}>Menu Highlights</p>
      </div>

      <div className="px-4 mt-3 grid grid-cols-2 gap-2.5 pb-4">
        {MENU_ITEMS.map((item, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border" style={{ background: 'white', borderColor: '#E8D8C0' }}>
            <div className="h-16 flex items-center justify-center text-2xl" style={{ background: '#F5EAD8' }}>{item.emoji}</div>
            <div className="p-2 text-center">
              <p className="text-[10px] font-bold" style={{ color: '#3A2010' }}>{item.name}</p>
              <p className="text-[11px] font-black mt-0.5" style={{ color: '#5C3D2E' }}>{item.price} ₽</p>
            </div>
          </div>
        ))}
      </div>

      {/* Visit Us */}
      <div className="mx-4 mb-4 rounded-2xl p-4" style={{ background: '#5C3D2E' }}>
        <p className="text-[11px] font-black text-white" style={{ fontFamily: 'Georgia, serif' }}>Visit Us Today</p>
        <p className="text-[8px] text-amber-200 mt-1 leading-relaxed">Come for the coffee, stay for the good vibes!</p>
        <button className="mt-2 px-4 py-1.5 rounded-lg border border-white/40 text-[9px] font-bold text-white">FIND OUR LOCATION</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   IPHONE FRAME WRAPPER
═══════════════════════════════════════════════════════════ */
function IPhoneFrame({ children, accentGlow }: { children: React.ReactNode; accentGlow: string }) {
  return (
    <div className="relative mx-auto flex-shrink-0"
      style={{
        width: 270, height: 560, borderRadius: 46,
        background: 'linear-gradient(145deg,#1c2030,#0d1018)',
        border: '2.5px solid #242b3d',
        boxShadow: `0 50px 100px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 60px ${accentGlow}`,
      }}>
      {/* Buttons */}
      <div className="absolute -left-[3px] top-16 w-[3px] h-6 rounded-l-full bg-[#1a1f2e]" />
      <div className="absolute -left-[3px] top-24 w-[3px] h-12 rounded-l-full bg-[#1a1f2e]" />
      <div className="absolute -left-[3px] top-[152px] w-[3px] h-12 rounded-l-full bg-[#1a1f2e]" />
      <div className="absolute -right-[3px] top-20 w-[3px] h-16 rounded-r-full bg-[#1a1f2e]" />
      {/* Gloss */}
      <div className="absolute inset-0 rounded-[44px] pointer-events-none" style={{ background: 'linear-gradient(145deg,rgba(255,255,255,0.06) 0%,transparent 40%)' }} />
      {/* Screen */}
      <div className="absolute inset-[3px] rounded-[42px] overflow-hidden bg-black">
        {/* Dynamic island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-20 h-4 rounded-full bg-black flex items-center justify-between px-2.5 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse opacity-80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#181d29]" />
        </div>
        <div className="w-full h-full overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LEAD MODAL
═══════════════════════════════════════════════════════════ */
function LeadModal({ style, onClose }: { style: { name: string; accentColor: string; accentGlow: string }; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', phone: '', restaurantName: '', agree: true });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, preferredStyle: style.name }) });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error || 'Ошибка');
      setSuccess(true);
    } catch (err: any) { setError(err?.message || 'Не удалось отправить'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-md rounded-3xl p-7 border-2 shadow-2xl" style={{ background: '#0d1117', borderColor: style.accentColor + '55', boxShadow: `0 0 60px ${style.accentGlow}` }}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white"><X className="w-4 h-4" /></button>
        {success ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto border-2" style={{ borderColor: style.accentColor, background: style.accentColor + '20' }}>
              <Check className="w-8 h-8" style={{ color: style.accentColor }} />
            </div>
            <h3 className="text-xl font-black text-white">Заявка принята!</h3>
            <p className="text-sm text-slate-300">Свяжемся в Telegram в течение 15 минут.</p>
            <button onClick={onClose} className="px-6 py-3 rounded-2xl font-black text-sm text-white" style={{ background: style.accentColor }}>Закрыть</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-white">Заказать дизайн как <span style={{ color: style.accentColor }}>{style.name}</span></h3>
              <p className="text-xs text-slate-400 mt-1">Адаптируем под ваш ресторан за 24–48 часов</p>
            </div>
            {error && <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">{error}</div>}
            {[
              { key: 'name', label: 'Ваше имя *', ph: 'Алексей', req: true },
              { key: 'phone', label: 'Telegram или телефон *', ph: '@username или +7...', req: true },
              { key: 'restaurantName', label: 'Название заведения', ph: 'Кафе Москва', req: false },
            ].map(({ key, label, ph, req }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">{label}</label>
                <input type="text" required={req} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={ph}
                  className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 rounded-xl focus:outline-none placeholder-slate-500" />
              </div>
            ))}
            <label className="flex items-center gap-2.5 text-xs text-slate-400 cursor-pointer">
              <input type="checkbox" checked={form.agree} onChange={e => setForm({ ...form, agree: e.target.checked })} style={{ accentColor: style.accentColor }} />
              <span>Согласен на обработку персональных данных</span>
            </label>
            <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 text-white disabled:opacity-50"
              style={{ background: style.accentColor }}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /><span>Отправить заявку</span></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RESTAURANT CONFIG
═══════════════════════════════════════════════════════════ */
const RESTAURANTS = [
  {
    id: 'porto', name: 'Porto Bar', subtitle: 'Luxury Fine Dining', emblem: '🦪',
    accentColor: '#F59E0B', accentGlow: 'rgba(245,158,11,0.22)',
    designer: 'Marco Rossi 🇮🇹', location: 'Милан, Италия',
    rating: '4.99', cuisine: 'Устрицы · Шампанское · Room Service',
    tagline: 'Тёмная роскошь в стиле Michelin. Реальные блюда загружаются с вашего сервера. Золотые акценты, анимированные карточки.',
    avgCheck: '2 850 ₽', repeatRate: '+42%', delivery: '25–35 мин',
    features: ['Загрузка блюд из вашей базы данных', 'Система лояльности с баллами', 'Живой трекер заказа', 'Бесконтактная оплата СБП'],
    phone: 'porto',
  },
  {
    id: 'brunch', name: "Brunch's Bistro", subtitle: 'Nordic Botanical', emblem: '🥞',
    accentColor: '#C05830', accentGlow: 'rgba(192,88,48,0.22)',
    designer: 'Erik Lindström 🇸🇪', location: 'Стокгольм, Швеция',
    rating: '4.84', cuisine: 'Бранч · Панкейки · Specialty Coffee',
    tagline: 'Скандинавская лёгкость: кремовые тона, терракот, аппетитные фото. Eco Loyalty Club повышает возврат гостей.',
    avgCheck: '1 780 ₽', repeatRate: '+81%', delivery: '20–30 мин',
    features: ['Eco Loyalty Club с бонусами', 'Суфле-панкейки на заказ', 'Specialty кофе с картой', 'Бесконтактная оплата СБП'],
    phone: 'brunch',
  },
  {
    id: 'burger', name: 'Burger Dark', subtitle: 'Fast Food Dark App', emblem: '🍔',
    accentColor: '#E85C00', accentGlow: 'rgba(232,92,0,0.22)',
    designer: 'Jordan Lee 🇺🇸', location: 'Нью-Йорк, США',
    rating: '4.91', cuisine: 'Бургеры · Комбо · Доставка',
    tagline: 'Агрессивный тёмный дизайн в стиле лучших food-delivery приложений. Максимальная конверсия через промо-баннеры и яркие CTA.',
    avgCheck: '890 ₽', repeatRate: '+73%', delivery: '15–25 мин',
    features: ['Тёмная тема с оранжевыми акцентами', 'Промо-баннер 20% OFF', 'Категории с emoji-иконками', 'Быстрый заказ в 2 клика'],
    phone: 'burger',
  },
  {
    id: 'chain', name: 'Chain Fast Food', subtitle: 'Light Red Style', emblem: '🍗',
    accentColor: '#E4002B', accentGlow: 'rgba(228,0,43,0.22)',
    designer: 'Anna Kim 🇰🇷', location: 'Сеул, Корея',
    rating: '4.88', cuisine: 'Курица · Комбо · Сеты',
    tagline: 'Светлый профессиональный дизайн в стиле мировых сетей. Чёткая иерархия, круглые категории, badges BESTSELLER/POPULAR.',
    avgCheck: '650 ₽', repeatRate: '+68%', delivery: '18–28 мин',
    features: ['Светлая тема, красные акценты', 'Круглые категории с emoji', 'Badges: BESTSELLER / POPULAR', 'Exclusive Offer баннер'],
    phone: 'chain',
  },
  {
    id: 'coffee', name: 'Coffee Shop', subtitle: 'Elegant Web Style', emblem: '☕',
    accentColor: '#2D5A3D', accentGlow: 'rgba(45,90,61,0.22)',
    designer: 'Sophie Martin 🇫🇷', location: 'Лион, Франция',
    rating: '4.93', cuisine: 'Кофе · Десерты · Выпечка',
    tagline: 'Элегантный кремовый стиль в духе европейских кофеен. Serif-типографика, золотые акценты, карточки десертов с поэтичными названиями.',
    avgCheck: '720 ₽', repeatRate: '+85%', delivery: '12–20 мин',
    features: ['Кремовый фон + зелёный + золото', 'Serif-типографика Müil-стиля', 'Карточки с поэтичными описаниями', 'Special Coffee секция'],
    phone: 'coffee',
  },
  {
    id: 'cafe', name: 'Café Warm', subtitle: 'Cozy Warm Brown', emblem: '🥐',
    accentColor: '#5C3D2E', accentGlow: 'rgba(92,61,46,0.22)',
    designer: 'Luca Ferrari 🇮🇹', location: 'Флоренция, Италия',
    rating: '4.87', cuisine: 'Кафе · Выпечка · Обеды',
    tagline: 'Уютный тёплый коричневый стиль для кофеен и кафе. Тёплая атмосфера, "Why Choose Us", сетка меню с ценами.',
    avgCheck: '480 ₽', repeatRate: '+79%', delivery: '10–20 мин',
    features: ['Тёплые коричневые тона', '"Why Choose Us" секция', 'Классическая сетка меню', '"Visit Us Today" CTA блок'],
    phone: 'cafe',
  },
];

function renderPhone(id: string) {
  switch (id) {
    case 'porto': return <PortoBarPhone />;
    case 'brunch': return <BrunchBistroPhone />;
    case 'burger': return <BurgerDarkPhone />;
    case 'chain': return <ChainFoodPhone />;
    case 'coffee': return <CoffeeShopPhone />;
    case 'cafe': return <CafeWarmPhone />;
    default: return null;
  }
}

/* ═══════════════════════════════════════════════════════════
   MAIN GALLERY
═══════════════════════════════════════════════════════════ */
export function DesignShowcaseGallery() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [leadStyle, setLeadStyle] = useState<null | { name: string; accentColor: string; accentGlow: string }>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const active = RESTAURANTS[activeIdx];

  const prev = () => setActiveIdx(i => (i - 1 + RESTAURANTS.length) % RESTAURANTS.length);
  const next = () => setActiveIdx(i => (i + 1) % RESTAURANTS.length);

  // Scroll active tab into view
  useEffect(() => {
    const el = tabsRef.current?.children[activeIdx] as HTMLElement;
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeIdx]);

  return (
    <section id="demo" className="relative py-20 lg:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#050810 0%,#070b14 60%,#050810 100%)' }}>
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-0 transition-all duration-700">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-20 transition-all duration-700"
          style={{ background: `radial-gradient(ellipse,${active.accentColor} 0%,transparent 70%)` }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>6 готовых дизайн-концепций от наших дизайнеров</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black font-serif text-white leading-tight">
            Выберите стиль{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">вашего меню</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Каждый дизайн — отдельная концепция для разного формата заведения.<br className="hidden sm:inline" />
            Адаптируем любой стиль под ваш бренд за 24–48 часов.
          </p>
        </div>

        {/* Tab Carousel */}
        <div className="relative mb-10">
          <div ref={tabsRef} className="flex gap-2 overflow-x-auto scrollbar-none pb-2 px-1 justify-start lg:justify-center">
            {RESTAURANTS.map((r, i) => (
              <button key={r.id} onClick={() => setActiveIdx(i)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 transition-all duration-300 shrink-0 font-bold"
                style={i === activeIdx
                  ? { background: r.accentColor + '20', borderColor: r.accentColor, color: 'white', boxShadow: `0 0 24px ${r.accentGlow}` }
                  : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.10)', color: '#94a3b8' }}>
                <span className="text-lg leading-none">{r.emblem}</span>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-black leading-none">{r.name}</p>
                  <p className="text-[9px] opacity-60 mt-0.5">{r.subtitle}</p>
                </div>
                {i === activeIdx && <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: r.accentColor }} />}
              </button>
            ))}
          </div>
        </div>

        {/* Main Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-center max-w-5xl mx-auto">

          {/* Phone */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {/* Prev/Next arrows */}
              <button onClick={prev} className="absolute -left-10 sm:-left-14 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/8 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center transition-all z-10">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={next} className="absolute -right-10 sm:-right-14 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/8 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center transition-all z-10">
                <ChevronRight className="w-4 h-4" />
              </button>

              <IPhoneFrame accentGlow={active.accentGlow}>
                {renderPhone(active.id)}
              </IPhoneFrame>
            </div>

            {/* Dots */}
            <div className="flex items-center gap-1.5 mt-5">
              {RESTAURANTS.map((_, i) => (
                <button key={i} onClick={() => setActiveIdx(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeIdx ? 20 : 6,
                    height: 6,
                    background: i === activeIdx ? active.accentColor : 'rgba(255,255,255,0.2)',
                  }} />
              ))}
            </div>

            {/* Live indicator */}
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Интерактивный демо · {activeIdx < 2 ? 'данные с сервера' : 'статические данные'}</span>
            </div>
          </div>

          {/* Info Card */}
          <div className="rounded-3xl p-6 sm:p-7 border-2 space-y-5 transition-all duration-500"
            style={{
              background: 'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))',
              borderColor: active.accentColor + '40',
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${active.accentGlow}`,
            }}>
            {/* Designer */}
            <div className="text-xs text-slate-400">
              Дизайн: <span className="text-slate-200 font-semibold">{active.designer}</span> · {active.location}
            </div>

            {/* Title */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-serif">{active.name}</h3>
                <p className="text-sm font-bold mt-1" style={{ color: active.accentColor }}>{active.subtitle}</p>
                <p className="text-xs text-slate-400 mt-0.5">{active.cuisine}</p>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl border shrink-0"
                style={{ background: active.accentColor + '18', borderColor: active.accentColor + '40', color: active.accentColor }}>
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-sm font-black">{active.rating}</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{active.tagline}</p>

            {/* Features */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Включённый функционал:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {active.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-200 p-2 rounded-xl bg-black/30 border border-white/5">
                    <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: active.accentColor }} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Ср. чек', value: active.avgCheck },
                { label: 'Повторные заказы', value: active.repeatRate },
                { label: 'Доставка', value: active.delivery },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-2xl text-center border border-white/5 bg-black/30">
                  <p className="text-sm font-black text-white">{s.value}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex gap-3 pt-1">
              <button onClick={() => setLeadStyle({ name: active.name, accentColor: active.accentColor, accentGlow: active.accentGlow })}
                className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xl"
                style={{ background: `linear-gradient(90deg,${active.accentColor},${active.accentColor}bb)`, boxShadow: `0 8px 30px ${active.accentGlow}` }}>
                <Sparkles className="w-4 h-4" />
                <span>Хочу такой дизайн</span>
              </button>
              <a href={activeIdx === 0 ? 'https://porto-bar.ru/' : activeIdx === 1 ? 'http://194.87.55.134:3005/' : '#'}
                target="_blank" rel="noopener noreferrer"
                className="px-4 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                <span>Demo</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {leadStyle && <LeadModal style={leadStyle} onClose={() => setLeadStyle(null)} />}
    </section>
  );
}
