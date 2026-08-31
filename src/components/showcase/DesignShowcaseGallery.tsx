'use client';

import React, { useState, useEffect } from 'react';
import {
  Search, Star, Plus, Check, Send, Loader2, X, Sparkles,
  ExternalLink, ChevronRight, ShoppingBag, Home, UtensilsCrossed,
  QrCode, User, Heart, Maximize2, ArrowRight,
} from 'lucide-react';

/* ─────────────────── TYPES ─────────────────────── */
interface Dish {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image?: string;
  weight?: string;
}

/* ─────────────────── PORTO BAR PHONE ────────────── */
function PortoBarPhone() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [activeTab, setActiveTab] = useState('Устрицы');
  const [loaded, setLoaded] = useState(false);

  const CATEGORIES = ['Устрицы', 'Пицца', 'Паста', 'Напитки', 'Завтраки'];

  useEffect(() => {
    fetch('/api/menu')
      .then((r) => r.json())
      .then((data) => {
        const list: Dish[] = Array.isArray(data)
          ? data
          : data.dishes || data.items || [];
        setDishes(list);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const filtered = dishes
    .filter((d) => {
      const cat = (d.category || '').toLowerCase();
      const tab = activeTab.toLowerCase();
      if (tab === 'устрицы') return cat.includes('устриц') || cat.includes('oyster') || cat.includes('морепрод');
      if (tab === 'пицца') return cat.includes('пицц') || cat.includes('pizza');
      if (tab === 'паста') return cat.includes('паст') || cat.includes('pasta');
      if (tab === 'напитки') return cat.includes('напит') || cat.includes('drink') || cat.includes('коктейл') || cat.includes('вино') || cat.includes('wine') || cat.includes('bar');
      if (tab === 'завтраки') return cat.includes('завтрак') || cat.includes('breakfast') || cat.includes('бранч');
      return true;
    })
    .slice(0, 8);

  return (
    <div className="w-full h-full bg-[#0d0f14] text-white overflow-y-auto overflow-x-hidden scrollbar-none flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0d0f14]/95 backdrop-blur-md px-4 pt-8 pb-2 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <span className="text-slate-900 font-black text-xs">PB</span>
            </div>
            <div>
              <p className="text-[11px] font-black text-white leading-none">Porto Bar</p>
              <p className="text-[9px] text-slate-400">Room 214 · Номер</p>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-500/30">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-bold text-amber-300">4.9</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <div className="w-full bg-white/5 border border-white/8 text-slate-400 text-[10px] pl-9 pr-4 py-2.5 rounded-2xl">
            Поиск устриц, тартаров, паст, вин...
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative mx-3 mt-3 rounded-2xl overflow-hidden h-28 flex items-end p-3"
        style={{ background: 'linear-gradient(135deg, #1a1200 0%, #2d1f00 100%)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/60 to-transparent" />
        <img
          src="https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=600&q=80"
          alt="Oysters"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10">
          <p className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">🦪 Шеф рекомендует</p>
          <p className="text-sm font-black text-white leading-tight">Морские деликатесы<br/>и премиальный сервис</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-3 mt-3">
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap shrink-0 transition-all border ${
                activeTab === cat
                  ? 'bg-amber-500 text-slate-900 border-amber-400 shadow-lg shadow-amber-500/30'
                  : 'bg-white/5 text-slate-300 border-white/8 hover:border-amber-500/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Section Title */}
      <div className="px-3 mt-3 flex items-center justify-between">
        <p className="text-[11px] font-black text-white uppercase tracking-wider">
          🏆 Шедевры кухни
        </p>
        <span className="text-[9px] text-amber-400 font-bold">Винный пейринг →</span>
      </div>

      {/* Dishes Grid */}
      <div className="px-3 mt-2 grid grid-cols-2 gap-2 pb-20">
        {!loaded ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white/5 rounded-2xl h-36 animate-pulse border border-white/5" />
          ))
        ) : filtered.length > 0 ? (
          filtered.map((dish) => (
            <div
              key={dish.id}
              className="bg-[#161920] rounded-2xl overflow-hidden border border-white/6 flex flex-col"
            >
              <div className="relative h-20 bg-white/5">
                {dish.image ? (
                  <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">🍽</div>
                )}
              </div>
              <div className="p-2 flex-1 flex flex-col justify-between">
                <p className="text-[10px] font-bold text-white line-clamp-2 leading-tight">{dish.name}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[11px] font-black text-amber-400">{dish.price} ₽</span>
                  <button className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/30">
                    <Plus className="w-3.5 h-3.5 text-slate-900 stroke-[3]" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Fallback dishes if API returns empty for this category
          [
            { name: 'Устрица Фин де Клер', price: 680, emoji: '🦪' },
            { name: 'Тартар из тунца', price: 890, emoji: '🐟' },
            { name: 'Фуа-гра с бриошью', price: 1890, emoji: '🍞' },
            { name: 'Паста Карбонара', price: 1190, emoji: '🍝' },
          ].map((d, i) => (
            <div key={i} className="bg-[#161920] rounded-2xl overflow-hidden border border-white/6 flex flex-col">
              <div className="relative h-20 bg-white/5 flex items-center justify-center text-3xl">{d.emoji}</div>
              <div className="p-2 flex-1 flex flex-col justify-between">
                <p className="text-[10px] font-bold text-white line-clamp-2 leading-tight">{d.name}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[11px] font-black text-amber-400">{d.price} ₽</span>
                  <button className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/30">
                    <Plus className="w-3.5 h-3.5 text-slate-900 stroke-[3]" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0d0f14]/95 backdrop-blur-xl border-t border-white/6 px-4 py-2 flex items-center justify-around">
        <button className="flex flex-col items-center space-y-0.5 text-amber-400">
          <Home className="w-4 h-4" />
          <span className="text-[8px] font-bold">Главная</span>
        </button>
        <button className="flex flex-col items-center space-y-0.5 text-slate-400">
          <UtensilsCrossed className="w-4 h-4" />
          <span className="text-[8px] font-bold">Меню</span>
        </button>
        <button className="w-10 h-10 -mt-4 rounded-full bg-amber-500 flex items-center justify-center shadow-xl shadow-amber-500/40">
          <ShoppingBag className="w-5 h-5 text-slate-900 stroke-[2.5]" />
        </button>
        <button className="flex flex-col items-center space-y-0.5 text-slate-400">
          <QrCode className="w-4 h-4" />
          <span className="text-[8px] font-bold">Сервис</span>
        </button>
        <button className="flex flex-col items-center space-y-0.5 text-slate-400">
          <User className="w-4 h-4" />
          <span className="text-[8px] font-bold">Профиль</span>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────── BRUNCH BISTRO PHONE ─────────── */
function BrunchBistroPhone() {
  const CATEGORIES = ['Завтраки', 'Панкейки', 'Кофе', 'Боулы', 'Смузи'];
  const [activeTab, setActiveTab] = useState('Панкейки');

  const MENU: Record<string, { name: string; price: number; desc: string; emoji: string; badge?: string }[]> = {
    Завтраки: [
      { name: 'Яйца Бенедикт', price: 690, desc: 'Английский маффин, лосось, голландез', emoji: '🍳' },
      { name: 'Авокадо Тост', price: 520, desc: 'Ржаной хлеб, рикотта, редис', emoji: '🥑' },
      { name: 'Боул Асаи', price: 650, desc: 'Асаи, гранола, маракуйя', emoji: '🫐' },
      { name: 'Гранола с йогуртом', price: 420, desc: 'Домашняя гранола, греческий йогурт', emoji: '🥣' },
    ],
    Панкейки: [
      { name: 'Суфле-Панкейки', price: 780, desc: '3 пухлых японских панкейка с кленовым сиропом', emoji: '🥞', badge: 'ХИТ' },
      { name: 'Панкейки Матча', price: 820, desc: 'Зелёный чай, ваниль, белый шоколад', emoji: '🍵', badge: 'NEW' },
      { name: 'Блины Рикотта', price: 690, desc: 'С лесными ягодами и мёдом', emoji: '🫐' },
      { name: 'Американские', price: 560, desc: 'Классика с кленовым сиропом и беконом', emoji: '🧇' },
    ],
    Кофе: [
      { name: 'Флэт Уайт', price: 290, desc: 'Double shot эспрессо, нежная текстура', emoji: '☕', badge: 'ТОП' },
      { name: 'Матча Латте', price: 350, desc: 'Церемониальный матча, овсяное молоко', emoji: '🍵' },
      { name: 'Колд Брю', price: 380, desc: '18 часов холодного заваривания', emoji: '🧊' },
      { name: 'Капучино', price: 280, desc: 'Арабика Ethiopia Yirgacheffe', emoji: '☕' },
    ],
    Боулы: [
      { name: 'Боул Будды', price: 720, desc: 'Лебеда, авокадо, нут, тахини', emoji: '🥗' },
      { name: 'Poke Salmon', price: 890, desc: 'Норвежский лосось, эдамаме, кунжут', emoji: '🍣' },
      { name: 'Боул Асаи', price: 650, desc: 'Асаи, гранола, манго, кокос', emoji: '🫐' },
      { name: 'Греческий боул', price: 680, desc: 'Киноа, фета, оливки, томаты', emoji: '🫒' },
    ],
    Смузи: [
      { name: 'Green Power', price: 420, desc: 'Шпинат, имбирь, огурец, лайм', emoji: '🥤' },
      { name: 'Berry Blast', price: 390, desc: 'Клубника, малина, банан, кокос', emoji: '🍓' },
      { name: 'Mango Sunrise', price: 410, desc: 'Манго, апельсин, куркума', emoji: '🥭' },
      { name: 'Tropical', price: 400, desc: 'Ананас, кокос, маракуйя', emoji: '🍍' },
    ],
  };

  const items = MENU[activeTab] || MENU['Панкейки'];

  return (
    <div
      className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-none flex flex-col"
      style={{ background: '#FFF8F0', color: '#2D1810' }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-4 pt-8 pb-3 border-b"
        style={{ background: '#FFF8F0', borderColor: '#F0E0D0' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: '#C05830' }}
            >
              <span className="text-white font-black text-xs">BB</span>
            </div>
            <div>
              <p className="text-[11px] font-black leading-none" style={{ color: '#2D1810' }}>
                Brunch's Bistro
              </p>
              <p className="text-[9px]" style={{ color: '#9B7B6A' }}>Eco Loyalty Club · 🌿</p>
            </div>
          </div>
          <div
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full border"
            style={{ background: '#C05830' + '18', borderColor: '#C05830' + '40' }}
          >
            <Star className="w-3 h-3 fill-orange-600 text-orange-600" />
            <span className="text-[10px] font-bold" style={{ color: '#C05830' }}>4.8</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#9B7B6A' }} />
          <div
            className="w-full text-[10px] pl-9 pr-4 py-2.5 rounded-2xl border"
            style={{ background: '#F5E8DC', borderColor: '#E8D0BC', color: '#9B7B6A' }}
          >
            Поиск панкейков, кофе, авокадо...
          </div>
        </div>
      </div>

      {/* Hero */}
      <div
        className="relative mx-3 mt-3 rounded-2xl overflow-hidden h-28 flex items-end p-3"
        style={{ background: 'linear-gradient(135deg, #C05830 0%, #A04020 100%)' }}
      >
        <img
          src="https://images.unsplash.com/photo-1565299543923-37dd37887442?w=600&q=80"
          alt="Pancakes"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10">
          <p className="text-[9px] font-bold text-orange-200 uppercase tracking-wider">🥞 Signature</p>
          <p className="text-sm font-black text-white leading-tight">
            Японские суфле-<br />панкейки от шеф-повара
          </p>
        </div>
        <div
          className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-full text-[9px] font-black text-white"
          style={{ background: '#2D1810' }}
        >
          🌿 ECO CLUB
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-3 mt-3">
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className="px-3 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap shrink-0 transition-all border"
              style={
                activeTab === cat
                  ? { background: '#C05830', color: 'white', borderColor: '#A04020' }
                  : { background: '#F5E8DC', color: '#9B7B6A', borderColor: '#E8D0BC' }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Section title */}
      <div className="px-3 mt-3 flex items-center justify-between">
        <p className="text-[11px] font-black uppercase tracking-wider" style={{ color: '#2D1810' }}>
          ✨ {activeTab}
        </p>
        <span className="text-[9px] font-bold" style={{ color: '#C05830' }}>
          Популярное →
        </span>
      </div>

      {/* Items */}
      <div className="px-3 mt-2 grid grid-cols-2 gap-2 pb-20">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden flex flex-col border"
            style={{ background: 'white', borderColor: '#F0E0D0' }}
          >
            <div
              className="relative h-20 flex items-center justify-center text-3xl"
              style={{ background: '#FDF0E6' }}
            >
              {item.emoji}
              {item.badge && (
                <span
                  className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-[8px] font-black text-white"
                  style={{ background: '#C05830' }}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <div className="p-2 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold line-clamp-1" style={{ color: '#2D1810' }}>
                  {item.name}
                </p>
                <p className="text-[9px] line-clamp-1 mt-0.5" style={{ color: '#9B7B6A' }}>
                  {item.desc}
                </p>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[11px] font-black" style={{ color: '#C05830' }}>
                  {item.price} ₽
                </span>
                <button
                  className="w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                  style={{ background: '#C05830' }}
                >
                  <Plus className="w-3.5 h-3.5 text-white stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t px-4 py-2 flex items-center justify-around"
        style={{ background: 'rgba(255,248,240,0.95)', borderColor: '#F0E0D0' }}
      >
        {[
          { icon: <Home className="w-4 h-4" />, label: 'Главная', active: true },
          { icon: <UtensilsCrossed className="w-4 h-4" />, label: 'Меню', active: false },
        ].map(({ icon, label, active }) => (
          <button
            key={label}
            className="flex flex-col items-center space-y-0.5"
            style={{ color: active ? '#C05830' : '#9B7B6A' }}
          >
            {icon}
            <span className="text-[8px] font-bold">{label}</span>
          </button>
        ))}

        <button
          className="w-10 h-10 -mt-4 rounded-full flex items-center justify-center shadow-xl"
          style={{ background: '#C05830', boxShadow: '0 6px 20px rgba(192,88,48,0.4)' }}
        >
          <ShoppingBag className="w-5 h-5 text-white stroke-[2.5]" />
        </button>

        {[
          { icon: <Heart className="w-4 h-4" />, label: 'Бонусы' },
          { icon: <User className="w-4 h-4" />, label: 'Профиль' },
        ].map(({ icon, label }) => (
          <button key={label} className="flex flex-col items-center space-y-0.5" style={{ color: '#9B7B6A' }}>
            {icon}
            <span className="text-[8px] font-bold">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────── IPHONE FRAME ───────────────── */
function IPhoneFrame({
  children,
  accentColor,
  accentGlow,
}: {
  children: React.ReactNode;
  accentColor: string;
  accentGlow: string;
}) {
  return (
    <div
      className="relative flex-shrink-0 mx-auto"
      style={{
        width: 260,
        height: 540,
        borderRadius: 44,
        background: 'linear-gradient(145deg, #1c2030, #0d1018)',
        border: '2.5px solid #242b3d',
        boxShadow: `
          0 50px 100px rgba(0,0,0,0.9),
          0 0 0 1px rgba(255,255,255,0.04) inset,
          0 0 60px ${accentGlow}
        `,
      }}
    >
      {/* Side buttons */}
      <div className="absolute -left-[3px] top-16 w-[3px] h-6 rounded-l-full bg-[#1a1f2e]" />
      <div className="absolute -left-[3px] top-24 w-[3px] h-12 rounded-l-full bg-[#1a1f2e]" />
      <div className="absolute -left-[3px] top-[152px] w-[3px] h-12 rounded-l-full bg-[#1a1f2e]" />
      <div className="absolute -right-[3px] top-20 w-[3px] h-16 rounded-r-full bg-[#1a1f2e]" />

      {/* Glossy edge highlight */}
      <div
        className="absolute inset-0 rounded-[42px] pointer-events-none"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, transparent 40%)',
        }}
      />

      {/* Screen */}
      <div className="absolute inset-[3px] rounded-[40px] overflow-hidden bg-black">
        {/* Dynamic island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-20 h-4 rounded-full bg-black flex items-center justify-between px-2.5 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse opacity-80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#181d29]" />
        </div>

        {/* App content */}
        <div className="w-full h-full relative overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

/* ─────────────────── LEAD MODAL ─────────────────── */
function LeadModal({
  style,
  onClose,
}: {
  style: { name: string; accentColor: string; accentGlow: string };
  onClose: () => void;
}) {
  const [form, setForm] = useState({ name: '', phone: '', restaurantName: '', comment: '', agree: true });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, preferredStyle: style.name }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Ошибка');
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Не удалось отправить');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md rounded-3xl p-7 border-2 shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
          borderColor: style.accentColor + '55',
          boxShadow: `0 0 60px ${style.accentGlow}`,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
        >
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
            <h3 className="text-xl font-black text-white">Заявка принята!</h3>
            <p className="text-sm text-slate-300">Свяжемся в Telegram в течение 15 минут.</p>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl font-black text-sm text-white"
              style={{ background: style.accentColor }}
            >
              Закрыть
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-white">
                Заказать дизайн как{' '}
                <span style={{ color: style.accentColor }}>{style.name}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Адаптируем стиль под ваш ресторан за 24–48 часов
              </p>
            </div>
            {error && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
                {error}
              </div>
            )}
            {[
              { key: 'name', label: 'Ваше имя *', placeholder: 'Алексей', required: true },
              { key: 'phone', label: 'Telegram или телефон *', placeholder: '@username или +7...', required: true },
              { key: 'restaurantName', label: 'Название заведения', placeholder: 'Кафе Москва', required: false },
            ].map(({ key, label, placeholder, required }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">{label}</label>
                <input
                  type="text"
                  required={required}
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 rounded-xl focus:outline-none placeholder-slate-500"
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                />
              </div>
            ))}
            <label className="flex items-center space-x-2.5 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                style={{ accentColor: style.accentColor }}
              />
              <span>Согласен на обработку персональных данных</span>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2 text-white disabled:opacity-50"
              style={{ background: style.accentColor }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <><Send className="w-4 h-4" /><span>Отправить заявку</span></>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─────────────────── MAIN COMPONENT ─────────────── */
const RESTAURANTS = [
  {
    id: 'porto',
    name: 'Porto Bar',
    subtitle: 'Luxury Fine Dining & Oyster Bar',
    emblem: '🦪',
    accentColor: '#F59E0B',
    accentGlow: 'rgba(245,158,11,0.20)',
    designerFlag: '🇫🇷',
    designerName: 'Marco Rossi',
    designerLocation: 'Милан, Италия',
    rating: '4.99',
    cuisine: 'Устрицы · Шампанское · Отельный Room Service',
    tagline: 'Тёмная роскошь в стиле Michelin. Реальные блюда вашего меню в анимированных карточках с золотыми акцентами.',
    avgCheck: '2 850 ₽',
    repeatRate: '+42%',
    delivery: '25–35 мин',
    features: [
      'Room Service доставка в номер за 20 минут',
      'Живая устричная витрина с калибровкой NPI-NP3',
      'Винная карта с профессиональным пейрингом',
      'Бесконтактная оплата СБП / Картой',
    ],
    phone: 'porto',
  },
  {
    id: 'brunch',
    name: "Brunch's Bistro",
    subtitle: 'Nordic Botanical Café',
    emblem: '🥞',
    accentColor: '#C05830',
    accentGlow: 'rgba(192,88,48,0.20)',
    designerFlag: '🇸🇪',
    designerName: 'Erik Lindström',
    designerLocation: 'Стокгольм, Швеция',
    rating: '4.84',
    cuisine: 'Бранч · Суфле-панкейки · Specialty Coffee',
    tagline: 'Скандинавская лёгкость. Кремовые тона, терракотовые акценты, аппетитные фото блюд — максимум конверсии.',
    avgCheck: '1 780 ₽',
    repeatRate: '+81%',
    delivery: '20–30 мин',
    features: [
      'Eco Loyalty Club с бонусными баллами',
      'Фирменные суфле-панкейки на заказ',
      'Specialty кофе с картой происхождения',
      'Бесконтактная оплата СБП / Картой',
    ],
    phone: 'brunch',
  },
];

export function DesignShowcaseGallery() {
  const [activeId, setActiveId] = useState('porto');
  const [leadStyle, setLeadStyle] = useState<null | { name: string; accentColor: string; accentGlow: string }>(null);

  const active = RESTAURANTS.find((r) => r.id === activeId)!;

  return (
    <section
      id="demo"
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050810 0%, #070b14 60%, #050810 100%)' }}
    >
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 -z-0 transition-all duration-700">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-3xl opacity-20 transition-all duration-700"
          style={{ background: `radial-gradient(ellipse, ${active.accentColor} 0%, transparent 70%)` }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Живые примеры наших готовых работ</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif text-white leading-tight">
            Выберите стиль{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              вашего меню
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Два совершенно разных дизайна — для разных концепций ресторанного бизнеса.
            Каждый работает в реальном заведении прямо сейчас.
          </p>
        </div>

        {/* Restaurant Selector */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {RESTAURANTS.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveId(r.id)}
              className="flex items-center space-x-3 px-5 py-3.5 rounded-2xl border-2 transition-all duration-300 font-bold text-sm"
              style={
                activeId === r.id
                  ? {
                      background: r.accentColor + '18',
                      borderColor: r.accentColor,
                      color: 'white',
                      boxShadow: `0 0 30px ${r.accentGlow}`,
                    }
                  : {
                      background: 'rgba(255,255,255,0.04)',
                      borderColor: 'rgba(255,255,255,0.12)',
                      color: '#94a3b8',
                    }
              }
            >
              <span className="text-xl">{r.emblem}</span>
              <div className="text-left">
                <span className="block text-sm font-black">{r.name}</span>
                <span className="block text-[10px] font-medium opacity-70">{r.subtitle}</span>
              </div>
              {activeId === r.id && (
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: r.accentColor }} />
              )}
            </button>
          ))}
        </div>

        {/* Main Showcase: Phone + Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-center max-w-5xl mx-auto">

          {/* Phone Frame */}
          <div className="flex flex-col items-center">
            <IPhoneFrame accentColor={active.accentColor} accentGlow={active.accentGlow}>
              {activeId === 'porto' ? <PortoBarPhone /> : <BrunchBistroPhone />}
            </IPhoneFrame>

            {/* Live badge under phone */}
            <div className="mt-5 flex items-center space-x-2 text-xs text-slate-400">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Работает в реальном заведении · </span>
              <a
                href={activeId === 'porto' ? 'https://porto-bar.ru/' : 'http://194.87.55.134:3005/'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                <span>Открыть сайт</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Info Card */}
          <div
            className="rounded-3xl p-7 border-2 space-y-5 transition-all duration-500"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
              borderColor: active.accentColor + '40',
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${active.accentGlow}`,
            }}
          >
            {/* Designer credit */}
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span>{active.designerFlag}</span>
              <span>Дизайн: <span className="text-slate-200 font-semibold">{active.designerName}</span> ({active.designerLocation})</span>
            </div>

            {/* Rating */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-3xl font-black text-white font-serif">{active.name}</h3>
                <p className="text-sm font-bold mt-1" style={{ color: active.accentColor }}>
                  {active.subtitle}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{active.cuisine}</p>
              </div>
              <div
                className="flex items-center space-x-1 px-3 py-1.5 rounded-2xl text-sm font-black border"
                style={{ background: active.accentColor + '18', borderColor: active.accentColor + '40', color: active.accentColor }}
              >
                <Star className="w-4 h-4 fill-current" />
                <span>{active.rating}</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{active.tagline}</p>

            {/* Included Features */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Включённый функционал:
              </p>
              <div className="space-y-2">
                {active.features.map((feat, i) => (
                  <div key={i} className="flex items-start space-x-2.5 text-xs text-slate-200">
                    <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: active.accentColor }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Ср. чек', value: active.avgCheck },
                { label: 'Повторные заказы', value: active.repeatRate },
                { label: 'Доставка/сервис', value: active.delivery },
              ].map((s) => (
                <div
                  key={s.label}
                  className="p-3 rounded-2xl text-center border border-white/5 bg-black/30"
                >
                  <p className="text-sm font-black text-white">{s.value}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={() =>
                  setLeadStyle({ name: active.name, accentColor: active.accentColor, accentGlow: active.accentGlow })
                }
                className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-white flex items-center justify-center space-x-2 transition-all active:scale-[0.98] shadow-xl"
                style={{
                  background: `linear-gradient(90deg, ${active.accentColor}, ${active.accentColor}cc)`,
                  boxShadow: `0 8px 30px ${active.accentGlow}`,
                }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Хочу такой же дизайн</span>
              </button>
              <button
                onClick={() =>
                  setLeadStyle({ name: active.name, accentColor: active.accentColor, accentGlow: active.accentGlow })
                }
                className="px-5 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
              >
                <span>Инспектор</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Modal */}
      {leadStyle && (
        <LeadModal style={leadStyle} onClose={() => setLeadStyle(null)} />
      )}
    </section>
  );
}
