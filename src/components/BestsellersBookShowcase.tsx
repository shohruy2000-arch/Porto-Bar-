/**
 * @file src/components/BestsellersBookShowcase.tsx
 * @description Editorial 3D Book & Device Showcase for restaurant designs.
 * Inspired by ThreeUI BestsellersBookShowcase with 3D perspective, fanning pages, interactive drawer & live PWA simulators.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Smartphone, 
  Palette, 
  Eye, 
  Globe, 
  Award, 
  TrendingUp, 
  Check, 
  X, 
  Maximize2,
  BookOpen,
  ArrowRight,
  Flame,
  Coffee,
  Utensils,
  Layers
} from 'lucide-react';

export interface ShowcaseBook {
  id: string;
  volume: string;
  name: string;
  subtitle: string;
  cuisine: string;
  tagline: string;
  styleName: string;
  styleCategory: 'luxury' | 'fire' | 'asian' | 'light' | 'italian' | 'georgian';
  designerName: string;
  designerLocation: string;
  designerFlag: string;
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  bgCardColor: string;
  textColor: string;
  coverImage: string;
  pwaUrl: string;
  stats: {
    avgCheck: string;
    repeatOrders: string;
    launchTime: string;
  };
  palette: string[];
  signatureDishes: string[];
  description: string;
}

export const SHOWCASE_BOOKS: ShowcaseBook[] = [
  {
    id: 'porto-bar',
    volume: 'VOL. I',
    name: 'Porto Bar',
    subtitle: 'Отель Аструс • Москва',
    cuisine: 'Средиземноморская кухня & Устричный бар',
    tagline: 'Устрицы, шампанское и премиальный отельный сервис',
    styleName: 'Luxury Dark & Champagne Gold',
    styleCategory: 'luxury',
    designerName: 'Marco Rossi',
    designerLocation: 'Милан, Италия',
    designerFlag: '🇮🇹',
    primaryColor: '#d4af37',
    accentColor: '#f59e0b',
    bgColor: '#060a12',
    bgCardColor: '#0d131f',
    textColor: '#f3f4f6',
    coverImage: '/images/interior-5.jpg',
    pwaUrl: '/r/porto-bar',
    stats: {
      avgCheck: '2 850 ₽',
      repeatOrders: '+42%',
      launchTime: '48 часов'
    },
    palette: ['#060a12', '#0d131f', '#d4af37', '#f59e0b', '#ffffff'],
    signatureDishes: ['Устрицы Фин де Клер №2', 'Тартар из лосося с авокадо', 'Плато морепродуктов на гриле'],
    description: 'Глубокий бархатный черный фон с золотым тиснением, видео-истории шеф-повара и интеграция Room Service для гостей отеля.'
  },
  {
    id: 'the-bull',
    volume: 'VOL. II',
    name: 'Мясной ресторан «Бык»',
    subtitle: 'Prime Meat & Smoke Bar',
    cuisine: 'Стейки Black Angus, Бургеры & Ребра',
    tagline: 'Честное мраморное мясо на березовых углях',
    styleName: 'Raw Fire & Charcoal Dark',
    styleCategory: 'fire',
    designerName: 'Alex Vance',
    designerLocation: 'Остин, США',
    designerFlag: '🇺🇸',
    primaryColor: '#ef4444',
    accentColor: '#f97316',
    bgColor: '#09090b',
    bgCardColor: '#141416',
    textColor: '#f8fafc',
    coverImage: '/images/veranda-2.jpg',
    pwaUrl: '/r/the-bull',
    stats: {
      avgCheck: '2 450 ₽',
      repeatOrders: '+46%',
      launchTime: '36 часов'
    },
    palette: ['#09090b', '#141416', '#ef4444', '#f97316', '#fbbf24'],
    signatureDishes: ['Рибай Стейк Black Angus Prime', 'Бургер «Черный Бык» с трюфелем', 'Свиные ребра BBQ в вишневой глазури'],
    description: 'Брутальная эстетика открытого огня и коптильни, интерактивный выбор степени прожарки мяса (Rare/Medium/Well) и авторские соусы.'
  },
  {
    id: 'chinanews',
    volume: 'VOL. III',
    name: 'Китайские Новости',
    subtitle: 'Authentic Chinese & Dim Sum',
    cuisine: 'Паровые Дим-самы, Утка по-пекински & Wok',
    tagline: 'Шанхайская кухня, вок и дим-самы ручной лепки',
    styleName: 'Imperial Red & Jade Dragon',
    styleCategory: 'asian',
    designerName: 'Kenji Sato',
    designerLocation: 'Шанхай / Токио',
    designerFlag: '🇨🇳',
    primaryColor: '#dc2626',
    accentColor: '#eab308',
    bgColor: '#0d0908',
    bgCardColor: '#1c1210',
    textColor: '#fef2f2',
    coverImage: '/images/veranda-1.jpg',
    pwaUrl: '/r/chinanews',
    stats: {
      avgCheck: '1 950 ₽',
      repeatOrders: '+58%',
      launchTime: '48 часов'
    },
    palette: ['#0d0908', '#1c1210', '#dc2626', '#eab308', '#10b981'],
    signatureDishes: ['Шанхайские Сяолунбао с бульоном', 'Утка по-пекински с блинчиками', 'Свинина в кисло-сладком Гобаожоу'],
    description: 'Императорский рубиновый лак с золотыми драконами, аутентичные карточки дим-самов с паром и конструктор вок-лапши.'
  },
  {
    id: 'matcha-tokyo',
    volume: 'VOL. IV',
    name: 'Matcha & Bakery Tokyo',
    subtitle: 'Specialty Coffee & Japanese Brunch',
    cuisine: 'Церемониальная матча, Суфле-панкейки & Моти',
    tagline: 'Чистый японский минимализм и спешелти кофе',
    styleName: 'Clean Nordic Light Minimal',
    styleCategory: 'light',
    designerName: 'Elena Lindqvist',
    designerLocation: 'Стокгольм, Швеция',
    designerFlag: '🇸🇪',
    primaryColor: '#059669',
    accentColor: '#10b981',
    bgColor: '#f8fafc',
    bgCardColor: '#ffffff',
    textColor: '#0f172a',
    coverImage: '/images/image_2026-07-01_13-49-49.png',
    pwaUrl: '/r/matcha-tokyo',
    stats: {
      avgCheck: '780 ₽',
      repeatOrders: '+65%',
      launchTime: '24 часа'
    },
    palette: ['#f8fafc', '#ffffff', '#059669', '#10b981', '#0f172a'],
    signatureDishes: ['Церемониальный Матча Латте', 'Воздушные Суфле-Панкейки с ягодами', 'Ассорти Моти Манго-Матча'],
    description: 'Кристально чистый белый фон, изумрудные акценты матчи, выбор альтернативного молока (Oatly/Кокос) и абонементы на кофе.'
  },
  {
    id: 'bella-napoli',
    volume: 'VOL. V',
    name: 'Trattoria «Bella Napoli»',
    subtitle: 'Authentic Italian Pizzeria',
    cuisine: 'Неаполитанская пицца из дровяной печи & Паста',
    tagline: 'Дровяная печь, моцарелла буфала и паста фреска',
    styleName: 'Warm Terracotta & Olive Comfort',
    styleCategory: 'italian',
    designerName: 'Sophie Laurent',
    designerLocation: 'Париж / Неаполь',
    designerFlag: '🇫🇷',
    primaryColor: '#f97316',
    accentColor: '#84cc16',
    bgColor: '#140e0a',
    bgCardColor: '#211712',
    textColor: '#fff7ed',
    coverImage: '/images/interior-5.jpg',
    pwaUrl: '/r/bella-napoli',
    stats: {
      avgCheck: '1 650 ₽',
      repeatOrders: '+48%',
      launchTime: '24 часа'
    },
    palette: ['#140e0a', '#211712', '#f97316', '#84cc16', '#facc15'],
    signatureDishes: ['Пицца Маргарита D.O.P. Буфала', 'Римская Карбонара с гуанчале', 'Тирамису по-венециански'],
    description: 'Теплая терракотовая палитра южной Италии, сырные бортики для пиццы, расчет КБЖУ и выбор итальянских вин.'
  },
  {
    id: 'tbilisi',
    volume: 'VOL. VI',
    name: '«Тбилиси & Вино»',
    subtitle: 'Georgian Feast & Winery',
    cuisine: 'Грузинские хинкали, Хачапури & Шашлык',
    tagline: 'Щедрое грузинское застолье и домашнее вино',
    styleName: 'Cozy Wood & Deep Pomegranate',
    styleCategory: 'georgian',
    designerName: 'George Beridze',
    designerLocation: 'Тбилиси, Грузия',
    designerFlag: '🇬🇪',
    primaryColor: '#e11d48',
    accentColor: '#d97706',
    bgColor: '#170c0e',
    bgCardColor: '#261418',
    textColor: '#fff1f2',
    coverImage: '/images/veranda-1.jpg',
    pwaUrl: '/r/tbilisi',
    stats: {
      avgCheck: '2 200 ₽',
      repeatOrders: '+54%',
      launchTime: '48 часов'
    },
    palette: ['#170c0e', '#261418', '#e11d48', '#d97706', '#fbbf24'],
    signatureDishes: ['Хинкали с телятиной и кинзой', 'Хачапури по-аджарски (Лодочка)', 'Шашлык из свиной шеи на мангале'],
    description: 'Гранатовое вино, дерево и кавказские орнаменты, порционные модификаторы соусов (Ткемали/Сацебели) и банкетные сеты.'
  }
];

export function BestsellersBookShowcase() {
  const [selectedBook, setSelectedBook] = useState<ShowcaseBook>(SHOWCASE_BOOKS[0]);
  const [activeTab, setActiveTab] = useState<'preview' | 'palette' | 'dishes' | 'specs'>('preview');
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="demo" className="py-24 bg-[#0a0705] text-[#eee2ca] relative overflow-hidden select-none">
      {/* Editorial Grain & Ambient Lighting */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 -z-10 transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${selectedBook.primaryColor}30 0%, transparent 60%), radial-gradient(circle at 10% 80%, ${selectedBook.accentColor}20 0%, transparent 45%)`
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Editorial Style) */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#1c1611] border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Международный Дизайн-Продакшн • 6 Готовых Стилей</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-[#eee2ca] leading-tight">
            Примеры готовых работ <br className="hidden sm:inline" />
            <span className="italic font-normal bg-gradient-to-r from-[#d4af37] via-[#f59e0b] to-[#e11d48] bg-clip-text text-transparent">
              наших дизайнеров
            </span>
          </h2>

          <p className="text-[#c5b79e] text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Вы можете посмотреть наши примеры работ. У нас работают ведущие UI/UX дизайнеры и бренд-архитекторы из разных стран (Италия, Япония, Франция, Швеция, США, Грузия), создающие уникальный и полностью разный стиль для каждого заведения.
          </p>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 3D BOOK & FOLIO SHOWCASE GRID (ThreeUI Bestsellers Style) */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SHOWCASE_BOOKS.map((book) => {
            const isSelected = selectedBook.id === book.id;
            const isHovered = hoveredId === book.id;

            return (
              <div
                key={book.id}
                onMouseEnter={() => setHoveredId(book.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => {
                  setSelectedBook(book);
                  setIsInspectorOpen(true);
                }}
                className="group relative cursor-pointer"
              >
                {/* 3D Book Folio Card */}
                <div 
                  className={`relative rounded-3xl p-6 border transition-all duration-500 flex flex-col justify-between min-h-[460px] shadow-2xl backdrop-blur-xl ${
                    isSelected
                      ? 'border-[#d4af37] shadow-[0_20px_60px_rgba(0,0,0,0.9)] scale-[1.02]'
                      : 'border-[#2d2419] hover:border-[#d4af37]/60 hover:-translate-y-2 bg-[#120d0a]/90'
                  }`}
                  style={{
                    backgroundColor: book.styleCategory === 'light' ? '#ffffff' : book.bgCardColor,
                    borderColor: isSelected ? book.primaryColor : undefined
                  }}
                >
                  {/* Top Bar: Volume & Flag */}
                  <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold tracking-widest text-[#d4af37]">
                        {book.volume}
                      </span>
                      <span className="text-sm">{book.designerFlag}</span>
                    </div>

                    <span 
                      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-sm"
                      style={{
                        backgroundColor: `${book.primaryColor}20`,
                        borderColor: `${book.primaryColor}50`,
                        color: book.primaryColor
                      }}
                    >
                      {book.styleCategory.toUpperCase()}
                    </span>
                  </div>

                  {/* Visual Folio / Cover Mockup */}
                  <div className="my-4 space-y-3">
                    <div className="relative h-44 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-inner group/img">
                      <img
                        src={book.coverImage}
                        alt={book.name}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
                        <div>
                          <h3 className="text-xl font-bold font-serif text-white leading-tight">
                            {book.name}
                          </h3>
                          <p className="text-xs text-[#d4af37] font-medium truncate">
                            {book.cuisine}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tagline */}
                    <p className={`text-xs italic leading-relaxed line-clamp-2 ${
                      book.styleCategory === 'light' ? 'text-slate-600' : 'text-[#c5b79e]'
                    }`}>
                      «{book.tagline}»
                    </p>

                    {/* Color Swatches */}
                    <div className="flex items-center space-x-1.5 pt-1">
                      <span className={`text-[9px] uppercase font-bold mr-1 ${
                        book.styleCategory === 'light' ? 'text-slate-500' : 'text-[#8a7b68]'
                      }`}>Палитра:</span>
                      {book.palette.map((c, ci) => (
                        <div 
                          key={ci}
                          className="w-4 h-4 rounded-full border border-black/20 dark:border-white/20 shadow-sm"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-1">
                      <span className={`text-[10px] font-bold ${
                        book.styleCategory === 'light' ? 'text-slate-500' : 'text-[#8a7b68]'
                      }`}>
                        Дизайн: {book.designerName}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBook(book);
                          setIsInspectorOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-[#d4af37] hover:text-black font-bold text-xs flex items-center space-x-1 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Смотреть</span>
                      </button>

                      <Link
                        href={book.pwaUrl}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-xl text-black font-bold shadow-md transition-transform active:scale-95"
                        style={{
                          background: `linear-gradient(to right, ${book.primaryColor}, ${book.accentColor})`
                        }}
                        title="Открыть PWA в новой вкладке"
                      >
                        <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Project Full Banner Callout */}
        <div className="mt-14 bg-[#140e0b] border border-[#2d2419] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="text-xl">{selectedBook.designerFlag}</span>
              <span className="text-xs font-mono text-[#d4af37] font-bold uppercase tracking-wider">
                {selectedBook.volume} • {selectedBook.designerName} ({selectedBook.designerLocation})
              </span>
            </div>
            <h3 className="text-2xl font-black font-serif text-[#eee2ca]">
              {selectedBook.name} — {selectedBook.styleName}
            </h3>
            <p className="text-xs sm:text-sm text-[#c5b79e] max-w-xl leading-relaxed">
              {selectedBook.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => setIsInspectorOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-[#231b14] hover:bg-[#2d2419] border border-[#3d3123] text-[#eee2ca] font-bold px-5 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
            >
              <Smartphone className="w-4 h-4 text-[#d4af37]" />
              <span>Открыть интерактивный тест</span>
            </button>

            <Link
              href={selectedBook.pwaUrl}
              target="_blank"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all"
              style={{
                background: `linear-gradient(to right, ${selectedBook.primaryColor}, ${selectedBook.accentColor})`
              }}
            >
              <span>Открыть сайт на весь экран</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* EDITORIAL INSPECTOR & LIVE SIMULATOR MODAL (ThreeUI Drawer) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isInspectorOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 30 }}
              transition={{ duration: 0.3 }}
              className="relative bg-[#120d0a] border border-[#3d3123] rounded-3xl p-5 sm:p-7 max-w-4xl w-full shadow-2xl my-auto text-[#eee2ca]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#2d2419] pb-4 mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{selectedBook.designerFlag}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-[#d4af37]">{selectedBook.volume}</span>
                      <h3 className="text-lg font-bold font-serif text-white">{selectedBook.name}</h3>
                    </div>
                    <p className="text-xs text-[#c5b79e]">{selectedBook.cuisine} • {selectedBook.designerLocation}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsInspectorOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 2-Column Inspector Layout: Interactive Phone Mockup (Left) + Specs & Dishes (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left: Smartphone Mockup with Live Iframe */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative w-[300px] sm:w-[320px] h-[580px] bg-slate-950 rounded-[44px] p-3 border-4 border-[#3d3123] shadow-2xl shadow-black/80">
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-slate-800 rounded-full z-20" />
                    <div className="w-full h-full rounded-[34px] overflow-hidden bg-black relative">
                      <iframe
                        src={selectedBook.pwaUrl}
                        className="w-full h-full border-0"
                        title={selectedBook.name}
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Editorial Specs & Dishes */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Style & Tagline */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: selectedBook.primaryColor }}
                      />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                        {selectedBook.styleName}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold font-serif text-white">
                      «{selectedBook.tagline}»
                    </h4>
                    <p className="text-xs text-[#c5b79e] leading-relaxed">
                      {selectedBook.description}
                    </p>
                  </div>

                  {/* Signature Dishes List */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center space-x-1.5">
                      <Utensils className="w-3.5 h-3.5" />
                      <span>Фирменные позиции в меню</span>
                    </h5>
                    <div className="space-y-1.5">
                      {selectedBook.signatureDishes.map((dish, di) => (
                        <div 
                          key={di}
                          className="bg-[#1c1611] p-2.5 rounded-xl border border-[#2d2419] text-xs text-gray-200 flex items-center justify-between"
                        >
                          <span className="font-medium">{dish}</span>
                          <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Palette Swatches */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center space-x-1.5">
                      <Palette className="w-3.5 h-3.5" />
                      <span>Цветовая архитектура бренда</span>
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedBook.palette.map((color, ci) => (
                        <div 
                          key={ci} 
                          className="flex items-center space-x-1.5 bg-[#1c1611] px-2.5 py-1.5 rounded-xl border border-[#2d2419]"
                        >
                          <div className="w-4 h-4 rounded-md border border-white/20" style={{ backgroundColor: color }} />
                          <span className="text-[11px] font-mono text-gray-300 uppercase">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-center pt-2">
                    <div className="bg-[#1c1611] p-2.5 rounded-xl border border-[#2d2419]">
                      <span className="text-[10px] text-[#8a7b68] block">Средний чек</span>
                      <span className="text-sm font-black text-white">{selectedBook.stats.avgCheck}</span>
                    </div>
                    <div className="bg-[#1c1611] p-2.5 rounded-xl border border-[#2d2419]">
                      <span className="text-[10px] text-[#8a7b68] block">Повторные</span>
                      <span className="text-sm font-black text-emerald-400">{selectedBook.stats.repeatOrders}</span>
                    </div>
                    <div className="bg-[#1c1611] p-2.5 rounded-xl border border-[#2d2419]">
                      <span className="text-[10px] text-[#8a7b68] block">Срок запуска</span>
                      <span className="text-sm font-black text-[#d4af37]">{selectedBook.stats.launchTime}</span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-[#2d2419]">
                    <Link
                      href={selectedBook.pwaUrl}
                      target="_blank"
                      className="w-full sm:w-1/2 flex items-center justify-center space-x-2 bg-[#231b14] hover:bg-[#2d2419] border border-[#3d3123] text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all"
                    >
                      <Maximize2 className="w-4 h-4 text-[#d4af37]" />
                      <span>Открыть на весь экран</span>
                    </Link>

                    <button
                      onClick={() => {
                        setIsInspectorOpen(false);
                        const formEl = document.getElementById('brief-form');
                        if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full sm:w-1/2 flex items-center justify-center space-x-2 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95"
                      style={{
                        background: `linear-gradient(to right, ${selectedBook.primaryColor}, ${selectedBook.accentColor})`
                      }}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Заказать такой же ресторан</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
