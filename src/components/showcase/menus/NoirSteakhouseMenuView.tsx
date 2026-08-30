'use client';

import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Flame,
  Plus,
  Star,
  Sparkles,
  ArrowRight,
  Clock,
  Award,
  ChevronRight,
  Check,
  ShoppingBag,
  Bell,
  Heart,
  Home,
  Utensils,
  Gift,
  User,
} from 'lucide-react';
import { ShowcaseRestaurantData, ShowcaseDish } from '../types';
import { ShowcaseDishDetailModal } from './ShowcaseDishDetailModal';

interface Props {
  data: ShowcaseRestaurantData;
  isCompact?: boolean;
}

export function NoirSteakhouseMenuView({ data, isCompact = false }: Props) {
  const [activeCategory, setActiveCategory] = useState(data.categories[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDish, setSelectedDish] = useState<ShowcaseDish | null>(null);
  const [cartCount, setCartCount] = useState(2);
  const [likedDishes, setLikedDishes] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedDishes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddDish = (dish: ShowcaseDish, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCartCount((c) => c + 1);
  };

  const currentCategoryDishes = (data.allDishes[activeCategory] || []).filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="w-full min-h-screen text-slate-100 font-sans select-none overflow-x-hidden relative"
      style={{ background: data.colors.bg }}
    >
      {/* ── TOP APP BAR ────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between border-b backdrop-blur-xl bg-black/70 border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-amber-600 to-orange-500 shadow-md">
            <Flame className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-sm font-black text-white uppercase tracking-tight">{data.name}</h1>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
                GRILL
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Столик • Зал Prime №4</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 relative cursor-pointer">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          </button>
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{data.rating}</span>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER (Reference #1 Style with Chef & Fire) ──── */}
      <section className="relative px-4 pt-4 pb-2">
        <div className="relative rounded-3xl overflow-hidden border border-orange-500/30 shadow-2xl h-56 sm:h-64 flex flex-col justify-end p-5 bg-gradient-to-t from-black via-black/60 to-transparent">
          <img
            src={data.hero.image}
            alt={data.name}
            className="absolute inset-0 w-full h-full object-cover object-center -z-10 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent -z-10" />

          {/* Badge */}
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/90 text-slate-950 text-[10px] font-black tracking-wider uppercase mb-2 w-fit shadow-md">
            <Flame className="w-3.5 h-3.5 fill-slate-950" />
            <span>{data.hero.badge}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white font-serif leading-tight">
            {data.hero.headline}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-md line-clamp-2">
            {data.hero.subheadline}
          </p>
        </div>
      </section>

      {/* ── SEARCH & FILTER ────────────────────────────────────── */}
      <section className="px-4 py-2">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск стейков, бургеров, соусов..."
            className="w-full bg-[#181818] text-white text-xs pl-10 pr-10 py-3 rounded-2xl border border-white/10 focus:outline-none focus:border-orange-500 transition-colors shadow-inner"
          />
          <button className="absolute right-2.5 p-1.5 rounded-xl bg-orange-500 text-slate-950 cursor-pointer">
            <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </section>

      {/* ── CATEGORIES (Reference #1 Pill Tabs) ─────────────────── */}
      <section className="px-4 py-2">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {data.categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold shrink-0 flex items-center space-x-2 transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 border-orange-400 text-white shadow-lg scale-102'
                    : 'bg-[#181818] border-white/10 text-slate-300 hover:border-slate-500'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-orange-400'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── SIGNATURE DISHES / BESTSELLERS (Reference #1 & #2 Grid) */}
      <section className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1.5">
            <span className="text-base">⭐</span>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Signature Dishes
            </h3>
          </div>
          <span className="text-[11px] font-bold text-orange-400 hover:underline cursor-pointer">
            Смотреть все →
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {data.signatureDishes.map((dish) => (
            <div
              key={dish.id}
              onClick={() => setSelectedDish(dish)}
              className="bg-[#141414] rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all flex flex-col justify-between cursor-pointer group shadow-md"
            >
              <div className="relative h-28 sm:h-36 w-full bg-black overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {dish.badge && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#ccff00] text-black text-[9px] font-black tracking-wider uppercase shadow-md">
                    {dish.badge}
                  </span>
                )}
                <button
                  onClick={(e) => toggleLike(dish.id, e)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:text-red-500 transition-colors"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      likedDishes[dish.id] ? 'fill-red-500 text-red-500' : 'text-white'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-orange-400 transition-colors">
                    {dish.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {dish.tagline || dish.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/5">
                  <span className="text-sm font-black text-white">{dish.price} ₽</span>
                  <button
                    onClick={(e) => handleAddDish(dish, e)}
                    className="w-7 h-7 rounded-full bg-orange-500 hover:bg-orange-400 text-black flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAMILY BUNDLES (Reference #1 2-Column Promo Sets) ──── */}
      {data.bundles && data.bundles.length > 0 && (
        <section className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1.5">
              <span className="text-base">👥</span>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Family & Mega Bundles
              </h3>
            </div>
            <span className="text-[10px] text-orange-400 font-bold">Выгода до 30%</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.bundles.map((bundle) => (
              <div
                key={bundle.id}
                className="rounded-2xl p-4 border border-orange-500/30 flex items-center justify-between gap-3 shadow-lg relative overflow-hidden bg-gradient-to-r from-[#1a110a] to-[#121212]"
              >
                <div className="space-y-1.5 flex-1">
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500 text-black">
                    {bundle.badge}
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-white leading-tight">
                    {bundle.title}
                  </h4>
                  <ul className="text-[10px] text-slate-300 space-y-0.5">
                    {bundle.items.slice(0, 3).map((it, idx) => (
                      <li key={idx} className="flex items-center space-x-1 truncate">
                        <Check className="w-2.5 h-2.5 text-orange-400 shrink-0" />
                        <span className="truncate">{it}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-1 flex items-center space-x-2">
                    <span className="text-base font-black text-orange-400">{bundle.price} ₽</span>
                    {bundle.oldPrice && (
                      <span className="text-xs text-slate-500 line-through">
                        {bundle.oldPrice} ₽
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                  <img src={bundle.image} alt={bundle.title} className="w-full h-full object-cover" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── PROMO CRUNCH FEST BANNER (Reference #1 Orange Promo Card) ── */}
      {data.promoBanner && (
        <section className="px-4 py-3">
          <div
            className="rounded-3xl p-5 shadow-2xl border border-orange-400 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden text-slate-950"
            style={{ background: 'linear-gradient(135deg, #ff5500 0%, #ff8800 100%)' }}
          >
            <div className="space-y-1 text-center sm:text-left z-10">
              <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-black text-white inline-block">
                {data.promoBanner.discountText}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-black font-serif leading-tight">
                {data.promoBanner.title}
              </h3>
              <p className="text-xs text-black/80 font-medium max-w-md">
                {data.promoBanner.subtitle}
              </p>
            </div>

            <button className="px-5 py-2.5 rounded-2xl bg-black hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider shadow-xl active:scale-95 transition-all cursor-pointer shrink-0">
              {data.promoBanner.cta}
            </button>
          </div>
        </section>
      )}

      {/* ── LIVE ORDER TRACKER & CRUNCH REWARDS (Reference #1 Bottom Modules) ── */}
      <section className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Order Tracker */}
        {data.orderTracker && (
          <div className="rounded-2xl p-4 bg-[#141414] border border-white/10 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold text-white">Live Order Tracker</span>
              </div>
              <span className="text-[10px] font-mono text-orange-400 font-bold">
                ETA: {data.orderTracker.eta}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              {data.orderTracker.status}
            </p>
            {/* Step Bar */}
            <div className="grid grid-cols-4 gap-1 pt-1">
              {data.orderTracker.steps.map((step, idx) => (
                <div key={idx} className="space-y-1 text-center">
                  <div
                    className={`h-1.5 rounded-full ${
                      idx <= data.orderTracker!.stepIndex ? 'bg-orange-500' : 'bg-white/10'
                    }`}
                  />
                  <span className="text-[8px] text-slate-400 block truncate">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rewards Block */}
        {data.rewards && (
          <div className="rounded-2xl p-4 bg-[#141414] border border-white/10 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Gift className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-bold text-white">{data.rewards.title}</span>
              </div>
              <span className="text-xs font-black text-yellow-400">
                {data.rewards.points} pts
              </span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-yellow-400 h-full rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (data.rewards.points / data.rewards.nextTier) * 100
                  )}%`,
                }}
              />
            </div>
            <p className="text-[10px] text-slate-400">{data.rewards.tierName}</p>
          </div>
        )}
      </section>

      {/* ── ALL CATEGORY DISHES GRID ───────────────────────────── */}
      <section className="px-4 py-3 pb-24">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-3">
          Все позиции категории
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {currentCategoryDishes.map((dish) => (
            <div
              key={dish.id}
              onClick={() => setSelectedDish(dish)}
              className="p-3 rounded-2xl bg-[#141414] border border-white/10 flex items-center justify-between gap-3 hover:border-orange-500/50 transition-all cursor-pointer"
            >
              <div className="space-y-1 flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{dish.name}</h4>
                <p className="text-[10px] text-slate-400 line-clamp-1">{dish.desc}</p>
                <div className="flex items-center space-x-2 pt-0.5">
                  <span className="text-xs font-black text-orange-400">{dish.price} ₽</span>
                  {dish.weight && (
                    <span className="text-[9px] text-slate-500">{dish.weight}</span>
                  )}
                </div>
              </div>
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-black border border-white/5">
                <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM FLOATING BAR (Reference #1 Style) ────────────── */}
      <nav className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-96 z-40 bg-black/90 backdrop-blur-xl border border-white/15 rounded-3xl p-2 flex items-center justify-around shadow-2xl">
        <button className="flex flex-col items-center space-y-0.5 text-orange-400 cursor-pointer">
          <Home className="w-4 h-4" />
          <span className="text-[9px] font-bold">Главная</span>
        </button>
        <button className="flex flex-col items-center space-y-0.5 text-slate-400 hover:text-white cursor-pointer">
          <Utensils className="w-4 h-4" />
          <span className="text-[9px] font-bold">Меню</span>
        </button>

        {/* Highlighted Middle Order Button */}
        <button className="w-12 h-12 -mt-5 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-slate-950 font-black flex items-center justify-center shadow-xl border-2 border-black active:scale-95 transition-all cursor-pointer">
          <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
        </button>

        <button className="flex flex-col items-center space-y-0.5 text-slate-400 hover:text-white cursor-pointer">
          <Gift className="w-4 h-4" />
          <span className="text-[9px] font-bold">Акции</span>
        </button>
        <button className="flex flex-col items-center space-y-0.5 text-slate-400 hover:text-white cursor-pointer">
          <User className="w-4 h-4" />
          <span className="text-[9px] font-bold">Профиль</span>
        </button>
      </nav>

      {/* Modal Inspector */}
      {selectedDish && (
        <ShowcaseDishDetailModal
          dish={selectedDish}
          restaurant={data}
          onClose={() => setSelectedDish(null)}
          onAddToCart={() => setCartCount((c) => c + 1)}
        />
      )}
    </div>
  );
}
