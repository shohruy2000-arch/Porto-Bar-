'use client';

import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Plus,
  Star,
  Check,
  ShoppingBag,
  Bell,
  Heart,
  Home,
  Utensils,
  Coffee,
  Gift,
  User,
  Clock,
  Leaf,
} from 'lucide-react';
import { ShowcaseRestaurantData, ShowcaseDish } from '../types';
import { ShowcaseDishDetailModal } from './ShowcaseDishDetailModal';

interface Props {
  data: ShowcaseRestaurantData;
  isCompact?: boolean;
}

export function BrunchBistroMenuView({ data, isCompact = false }: Props) {
  const [activeCategory, setActiveCategory] = useState(data.categories[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDish, setSelectedDish] = useState<ShowcaseDish | null>(null);

  const currentCategoryDishes = (data.allDishes[activeCategory] || []).filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="w-full min-h-screen text-[#fff8f0] font-sans select-none overflow-x-hidden relative"
      style={{ background: data.colors.bg }}
    >
      {/* ── TOP BAR ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between border-b backdrop-blur-xl bg-[#0d0d0d]/85 border-[#c05830]/20">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-[#c05830] to-[#e07a5f] shadow-md">
            <Coffee className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-sm font-black text-white tracking-tight">{data.name}</h1>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                ECO-BRUNCH
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Specialty Coffee & Bakery</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-[#c05830]/15 border border-[#c05830]/30 text-[#f4a261] text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-[#f4a261] text-[#f4a261]" />
            <span>{data.rating}</span>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER ────────────────────────────────────────── */}
      <section className="relative px-4 pt-4 pb-2">
        <div className="relative rounded-3xl overflow-hidden border border-[#c05830]/30 shadow-2xl h-56 sm:h-64 flex flex-col justify-end p-5 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/70 to-transparent">
          <img
            src={data.hero.image}
            alt={data.name}
            className="absolute inset-0 w-full h-full object-cover object-center -z-10 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/60 to-transparent -z-10" />

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#c05830] text-white text-[10px] font-black tracking-wider uppercase mb-2 w-fit shadow-md">
            <Leaf className="w-3.5 h-3.5 fill-white" />
            <span>{data.hero.badge}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white font-serif leading-tight">
            {data.hero.headline}
          </h2>
          <p className="text-xs text-[#a89f91] mt-1 max-w-md line-clamp-2">
            {data.hero.subheadline}
          </p>
        </div>
      </section>

      {/* ── SEARCH ─────────────────────────────────────────────── */}
      <section className="px-4 py-2">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск панкейков, матчи, тостов..."
            className="w-full bg-[#171717] text-white text-xs pl-10 pr-4 py-3 rounded-2xl border border-[#c05830]/20 focus:outline-none focus:border-[#c05830] transition-colors shadow-inner"
          />
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────────────────────── */}
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
                    ? 'bg-gradient-to-r from-[#c05830] to-[#e07a5f] border-[#f4a261] text-white shadow-lg scale-102 font-black'
                    : 'bg-[#171717] border-white/10 text-slate-300 hover:border-[#c05830]/50'
                }`}
              >
                <Coffee className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#f4a261]'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── SIGNATURE DISHES ───────────────────────────────────── */}
      <section className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1.5">
            <span className="text-base">🥞</span>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Любимые бранчи
            </h3>
          </div>
          <span className="text-[11px] font-bold text-[#f4a261] hover:underline cursor-pointer">
            Конструктор to-go →
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {data.signatureDishes.map((dish) => (
            <div
              key={dish.id}
              onClick={() => setSelectedDish(dish)}
              className="bg-[#171717] rounded-2xl overflow-hidden border border-white/10 hover:border-[#c05830] transition-all flex flex-col justify-between cursor-pointer group shadow-md"
            >
              <div className="relative h-28 sm:h-36 w-full bg-black overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {dish.badge && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#c05830] text-white text-[9px] font-black tracking-wider uppercase shadow-md">
                    {dish.badge}
                  </span>
                )}
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#f4a261] transition-colors">
                    {dish.name}
                  </h4>
                  <p className="text-[10px] text-[#a89f91] line-clamp-1 mt-0.5">
                    {dish.tagline || dish.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/5">
                  <span className="text-sm font-black text-[#f4a261]">{dish.price} ₽</span>
                  <button className="w-7 h-7 rounded-full bg-[#c05830] hover:bg-[#e07a5f] text-white flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer">
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BUNDLE ─────────────────────────────────────────────── */}
      {data.bundles && data.bundles.length > 0 && (
        <section className="px-4 py-3">
          {data.bundles.map((bundle) => (
            <div
              key={bundle.id}
              className="rounded-3xl p-5 border border-[#c05830]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl bg-gradient-to-r from-[#21120b] to-[#171717]"
            >
              <div className="space-y-2 flex-1">
                <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#c05830] text-white">
                  {bundle.badge}
                </span>
                <h4 className="text-base font-black text-white font-serif">
                  {bundle.title}
                </h4>
                <ul className="text-xs text-slate-300 space-y-1">
                  {bundle.items.map((it, idx) => (
                    <li key={idx} className="flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5 text-[#f4a261] shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 flex items-center space-x-3">
                  <span className="text-xl font-black text-[#f4a261]">{bundle.price} ₽</span>
                  {bundle.oldPrice && (
                    <span className="text-sm text-slate-500 line-through">
                      {bundle.oldPrice} ₽
                    </span>
                  )}
                </div>
              </div>

              <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                <img src={bundle.image} alt={bundle.title} className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ── PROMO BANNER ───────────────────────────────────────── */}
      {data.promoBanner && (
        <section className="px-4 py-3">
          <div
            className="rounded-3xl p-5 shadow-2xl border border-[#c05830]/50 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden text-white"
            style={{ background: 'linear-gradient(135deg, #3d1c10 0%, #171717 100%)' }}
          >
            <div className="space-y-1 text-center sm:text-left z-10">
              <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#c05830] text-white inline-block">
                {data.promoBanner.discountText}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white font-serif leading-tight">
                {data.promoBanner.title}
              </h3>
              <p className="text-xs text-[#a89f91] max-w-md">
                {data.promoBanner.subtitle}
              </p>
            </div>

            <button className="px-6 py-3 rounded-2xl bg-[#c05830] hover:bg-[#e07a5f] text-white font-black text-xs uppercase tracking-wider shadow-xl active:scale-95 transition-all cursor-pointer shrink-0">
              {data.promoBanner.cta}
            </button>
          </div>
        </section>
      )}

      {/* ── ALL DISHES ─────────────────────────────────────────── */}
      <section className="px-4 py-3 pb-24">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-3">
          Все позиции категории
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {currentCategoryDishes.map((dish) => (
            <div
              key={dish.id}
              onClick={() => setSelectedDish(dish)}
              className="p-3.5 rounded-2xl bg-[#171717] border border-white/10 flex items-center justify-between gap-3 hover:border-[#c05830] transition-all cursor-pointer"
            >
              <div className="space-y-1 flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{dish.name}</h4>
                <p className="text-[10px] text-[#a89f91] line-clamp-1">{dish.desc}</p>
                <div className="flex items-center space-x-2 pt-0.5">
                  <span className="text-xs font-black text-[#f4a261]">{dish.price} ₽</span>
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

      {/* ── BOTTOM DOCK ────────────────────────────────────────── */}
      <nav className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-96 z-40 bg-[#0d0d0d]/95 backdrop-blur-xl border border-[#c05830]/30 rounded-3xl p-2 flex items-center justify-around shadow-2xl">
        <button className="flex flex-col items-center space-y-0.5 text-[#f4a261] cursor-pointer">
          <Home className="w-4 h-4" />
          <span className="text-[9px] font-bold">Главная</span>
        </button>
        <button className="flex flex-col items-center space-y-0.5 text-slate-400 hover:text-white cursor-pointer">
          <Coffee className="w-4 h-4" />
          <span className="text-[9px] font-bold">Напитки</span>
        </button>

        <button className="w-12 h-12 -mt-5 rounded-full bg-gradient-to-tr from-[#c05830] to-[#e07a5f] text-white font-black flex items-center justify-center shadow-xl border-2 border-black active:scale-95 transition-all cursor-pointer">
          <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
        </button>

        <button className="flex flex-col items-center space-y-0.5 text-slate-400 hover:text-white cursor-pointer">
          <Gift className="w-4 h-4" />
          <span className="text-[9px] font-bold">Эко-Клуб</span>
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
        />
      )}
    </div>
  );
}
