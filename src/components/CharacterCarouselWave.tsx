/**
 * @file src/components/CharacterCarouselWave.tsx
 * @description Премиальная 3D Wave-карусель ресторанов, инспектор и модальное окно заявки.
 * Архитектура: Senior Full-Stack & UI/UX Production Design.
 * Поддержка:
 * - iPhone 16 Pro симулятор с нативным рендером 375px и scale-трансформацией (0 искажений)
 * - Чистые бейджи стран и дизайнеров без проблем со шрифтами на Windows
 * - Плавные 3D Wave карточки и фильтр-кнопки
 * - Интерактивное модальное окно «Хочу такой же сайт» с автозаполнением стиля
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Check,
  X,
  Palette,
  Utensils,
  Zap,
  QrCode,
  ShieldCheck,
  Send,
  Loader2,
  Star,
  Award,
  Globe,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────── */
/* DATA                                                                */
/* ─────────────────────────────────────────────────────────────────── */

export interface WaveCard {
  id: string;
  badge: string;
  categoryName: string;
  name: string;
  tagline: string;
  cuisine: string;
  designerName: string;
  designerLocation: string;
  countryName: string;
  pwaUrl: string;
  stats: { avgCheck: string; repeat: string; launch: string; rating: string };
  dishes: { name: string; price: string; desc: string }[];
  features: string[];
  colors: {
    primary: string;
    secondary: string;
    bg: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
    glow: string;
  };
  emblem: string;
  image: string;
}

export const CARDS: WaveCard[] = [
  {
    id: 'porto-bar',
    badge: '👑 LUXURY FINE DINING',
    categoryName: 'Luxury Dark & Gold',
    name: 'Porto Bar',
    tagline: 'Устрицы · Шампанское · Отельный сервис',
    cuisine: 'Устричный бар & Средиземноморская кухня',
    designerName: 'Marco Rossi',
    designerLocation: 'Милан, Италия',
    countryName: 'Италия',
    pwaUrl: '/r/porto-bar',
    stats: { avgCheck: '2 850 ₽', repeat: '+42%', launch: '48 часов', rating: '4.98' },
    dishes: [
      { name: 'Устрицы Фин де Клер №2', price: '680 ₽', desc: 'С лимоном и винным соусом' },
      { name: 'Тартар из лосося с авокадо', price: '890 ₽', desc: 'С соусом понзу и чипсами' },
      { name: 'Плато морепродуктов Grand', price: '4 800 ₽', desc: 'Устрицы, лангустины, гребешки' },
    ],
    features: ['Room Service для отелей', 'Устричная витрина с калибром', 'Винная карта с пейрингом', 'Онлайн-оплата СБП / Карты'],
    colors: {
      primary: '#d4af37',
      secondary: '#f59e0b',
      bg: '#060a12',
      surface: '#0d131f',
      text: '#f3f4f6',
      muted: '#9ca3af',
      border: 'rgba(212,175,55,0.45)',
      glow: 'rgba(212,175,55,0.4)',
    },
    emblem: '🦪',
    image: '/images/interior-1.jpg',
  },
  {
    id: 'the-bull',
    badge: '🔥 STEAKHOUSE & BBQ',
    categoryName: 'Raw Fire & Charcoal',
    name: 'Мясной ресторан «Бык»',
    tagline: 'Black Angus Prime · Дрова · Коптильня',
    cuisine: 'Мраморная говядина & Крафтовые бургеры',
    designerName: 'Alex Vance',
    designerLocation: 'Остин, Техас',
    countryName: 'США',
    pwaUrl: '/r/the-bull',
    stats: { avgCheck: '2 450 ₽', repeat: '+46%', launch: '36 часов', rating: '4.95' },
    dishes: [
      { name: 'Рибай Black Angus 300г', price: '2 100 ₽', desc: 'Выбор прожарки: Rare / Medium / Well' },
      { name: 'Бургер «Черный Бык»', price: '790 ₽', desc: 'С трюфельным айоли и чеддером' },
      { name: 'Ребра BBQ в вишневой глазури', price: '1 250 ₽', desc: '12 часов томления в смокере' },
    ],
    features: ['Интерактивный выбор прожарки', 'QR-заказ на стол без официанта', 'Комбо-ланчи со смокера', 'Экспресс самовывоз / Takeaway'],
    colors: {
      primary: '#ef4444',
      secondary: '#f97316',
      bg: '#0c0604',
      surface: '#180b08',
      text: '#fafaf9',
      muted: '#a8a29e',
      border: 'rgba(239,68,68,0.45)',
      glow: 'rgba(239,68,68,0.4)',
    },
    emblem: '🥩',
    image: '/images/veranda-2.jpg',
  },
  {
    id: 'chinanews',
    badge: '🐉 IMPERIAL ASIAN',
    categoryName: 'Imperial Red & Jade',
    name: '«Китайские Новости»',
    tagline: 'Шанхайская кухня · Дим-самы · Вок',
    cuisine: 'Паровые дим-самы & Утка по-пекински',
    designerName: 'Kenji Sato',
    designerLocation: 'Шанхай / Токио',
    countryName: 'Китай',
    pwaUrl: '/r/chinanews',
    stats: { avgCheck: '1 950 ₽', repeat: '+58%', launch: '48 часов', rating: '4.92' },
    dishes: [
      { name: 'Сяолунбао с бульоном', price: '580 ₽', desc: 'Свинина, имбирь, черный уксус' },
      { name: 'Утка по-пекински (1/2)', price: '1 890 ₽', desc: 'С тонкими блинчиками и соусом Хойсин' },
      { name: 'Хрустящая свинина Гобаожоу', price: '720 ₽', desc: 'В кисло-сладком соусе с ананасом' },
    ],
    features: ['Мультиязычность (RU / EN / ZH)', 'Выбор остроты (🌶️ 1-3 уровня)', 'Упаковка для бережной доставки', 'Чайные церемонии'],
    colors: {
      primary: '#dc2626',
      secondary: '#eab308',
      bg: '#0d0908',
      surface: '#1c1210',
      text: '#fef2f2',
      muted: '#d1a8a8',
      border: 'rgba(220,38,38,0.45)',
      glow: 'rgba(220,38,38,0.4)',
    },
    emblem: '🥟',
    image: '/images/veranda-1.jpg',
  },
  {
    id: 'matcha-tokyo',
    badge: '🍵 NORDIC MINIMAL',
    categoryName: 'Clean Botanical Minimal',
    name: 'Matcha & Bakery Tokyo',
    tagline: 'Матча Церемониальная · Суфле-панкейки',
    cuisine: 'Specialty Coffee & Japanese Brunch',
    designerName: 'Elena Lindqvist',
    designerLocation: 'Стокгольм, Швеция',
    countryName: 'Швеция',
    pwaUrl: '/r/matcha-tokyo',
    stats: { avgCheck: '780 ₽', repeat: '+65%', launch: '24 часа', rating: '4.99' },
    dishes: [
      { name: 'Матча Латте Ceremonial', price: '420 ₽', desc: 'Органическая матча из Удзи, овсяное молоко' },
      { name: 'Японские суфле-панкейки', price: '590 ₽', desc: 'Пышные панкейки с маскарпоне' },
      { name: 'Моти Манго-Маракуйя', price: '280 ₽', desc: 'Рисовое тесто, крем маскарпоне' },
    ],
    features: ['Конструктор напитка (молоко/сироп)', 'Быстрый предзаказ to-go кофе', 'Календарь свежей выпечки', 'Эко-бонусы за свой стакан'],
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      bg: '#06130e',
      surface: '#0b1f17',
      text: '#f0fdf4',
      muted: '#86efac',
      border: 'rgba(16,185,129,0.45)',
      glow: 'rgba(16,185,129,0.4)',
    },
    emblem: '🌱',
    image: '/images/image_2026-07-01_13-49-49.png',
  },
  {
    id: 'bella-napoli',
    badge: '🍕 AUTHENTIC ITALIAN',
    categoryName: 'Warm Terracotta & Olive',
    name: 'Trattoria «Bella Napoli»',
    tagline: 'Дровяная печь · Моцарелла буфала',
    cuisine: 'Неаполитанская пицца & Паста фреска',
    designerName: 'Sophie Laurent',
    designerLocation: 'Неаполь / Париж',
    countryName: 'Италия',
    pwaUrl: '/r/bella-napoli',
    stats: { avgCheck: '1 650 ₽', repeat: '+48%', launch: '24 часа', rating: '4.94' },
    dishes: [
      { name: 'Маргарита D.O.P. Буфала', price: '720 ₽', desc: 'Томаты Сан-Марцано, свежий базилик' },
      { name: 'Карбонара с гуанчале', price: '680 ₽', desc: 'Сыр Пекорино Романо, свежий желток' },
      { name: 'Тирамису по-венециански', price: '450 ₽', desc: 'Савоярди, эспрессо, амаретто' },
    ],
    features: ['Выбор сырного бортика для пиццы', 'Добавление топпингов в 1 клик', 'Бронирование столиков на веранде', 'Семейные сеты'],
    colors: {
      primary: '#f97316',
      secondary: '#fbbf24',
      bg: '#140e0a',
      surface: '#211712',
      text: '#fff7ed',
      muted: '#d4a984',
      border: 'rgba(249,115,22,0.45)',
      glow: 'rgba(249,115,22,0.4)',
    },
    emblem: '🫕',
    image: '/images/interior-5.jpg',
  },
  {
    id: 'tbilisi',
    badge: '🍷 GEORGIAN FEAST',
    categoryName: 'Cozy Deep Pomegranate',
    name: '«Тбилиси & Вино»',
    tagline: 'Грузинское застолье · Хинкали · Шашлык',
    cuisine: 'Хинкали, Хачапури & Кавказский мангал',
    designerName: 'George Beridze',
    designerLocation: 'Тбилиси, Грузия',
    countryName: 'Грузия',
    pwaUrl: '/r/tbilisi',
    stats: { avgCheck: '2 200 ₽', repeat: '+54%', launch: '48 часов', rating: '4.97' },
    dishes: [
      { name: 'Хинкали с телятиной (5 шт)', price: '650 ₽', desc: 'С ароматным бульоном и тархуном' },
      { name: 'Хачапури по-аджарски', price: '590 ₽', desc: 'Сулугуни, имеретинский сыр, желток' },
      { name: 'Шашлык из баранины на углях', price: '980 ₽', desc: 'С маринованным луком и ткемали' },
    ],
    features: ['Подсчет хинкали поштучно', 'Карта вин Квеври & Саперави', 'Конструктор застолья', 'Уведомления о готовности мангала'],
    colors: {
      primary: '#e11d48',
      secondary: '#d97706',
      bg: '#170c0e',
      surface: '#261418',
      text: '#fff1f2',
      muted: '#c8949a',
      border: 'rgba(225,29,72,0.45)',
      glow: 'rgba(225,29,72,0.4)',
    },
    emblem: '🥂',
    image: '/images/veranda-1.jpg',
  },
];

const TOTAL = CARDS.length;

/* ─────────────────────────────────────────────────────────────────── */
/* COMPONENT                                                           */
/* ─────────────────────────────────────────────────────────────────── */

export function CharacterCarouselWave() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalCard, setModalCard] = useState<WaveCard | null>(null);
  const [orderModalCard, setOrderModalCard] = useState<WaveCard | null>(null);
  const [inspectorTab, setInspectorTab] = useState<'design' | 'menu' | 'features'>('design');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Order brief modal state
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    restaurantName: '',
    city: '',
    comment: '',
    agree: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const activeIndexRef = useRef(0);
  const modalRef = useRef<WaveCard | null>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => { activeIndexRef.current = activeIndex; }, [activeIndex]);
  useEffect(() => { modalRef.current = modalCard || orderModalCard; }, [modalCard, orderModalCard]);

  const navigate = useCallback((dir: 1 | -1) => {
    setActiveIndex((prev) => {
      const next = (prev + dir + TOTAL) % TOTAL;
      activeIndexRef.current = next;
      return next;
    });
  }, []);

  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      if (modalRef.current) return;
      setActiveIndex((prev) => {
        const next = (prev + 1) % TOTAL;
        activeIndexRef.current = next;
        return next;
      });
    }, 6000);
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [startAutoplay]);

  const pauseAndResumeAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setTimeout(() => startAutoplay(), 9000) as unknown as ReturnType<typeof setInterval>;
  }, [startAutoplay]);

  const handleNav = useCallback((dir: 1 | -1) => {
    navigate(dir);
    pauseAndResumeAutoplay();
  }, [navigate, pauseAndResumeAutoplay]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (modalRef.current) return;
      if (e.key === 'ArrowLeft') handleNav(-1);
      if (e.key === 'ArrowRight') handleNav(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleNav]);

  // Touch Swipe Handlers (No pointer capture, 100% natural and reliable)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 45) {
      handleNav(diff > 0 ? 1 : -1);
    }
  };

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const openOrderModal = (card: WaveCard) => {
    setModalCard(null);
    setOrderModalCard(card);
    setSubmitSuccess(false);
    setSubmitError('');
    setLeadForm(prev => ({
      ...prev,
      comment: `Выбран стиль: ${card.name} (${card.cuisine})`,
    }));
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.agree) {
      setSubmitError('Необходимо дать согласие на обработку данных');
      return;
    }
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadForm.name,
          phone: leadForm.phone,
          restaurantName: leadForm.restaurantName,
          city: leadForm.city || 'Москва',
          cuisineType: orderModalCard?.cuisine || 'Ресторан',
          preferredStyle: orderModalCard?.name || 'Премиум',
          comment: leadForm.comment,
          agree: leadForm.agree,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Ошибка при отправке заявки');
      }

      setSubmitSuccess(true);
      setLeadForm({
        name: '',
        phone: '',
        restaurantName: '',
        city: '',
        comment: '',
        agree: true,
      });
    } catch (err: any) {
      setSubmitError(err?.message || 'Не удалось отправить заявку. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const current = CARDS[activeIndex];

  return (
    <>
      <style>{`
        .wave-card-item {
          transition: transform 420ms cubic-bezier(0.2, 0.9, 0.3, 1),
                      opacity 320ms ease,
                      box-shadow 320ms ease;
          will-change: transform, opacity;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalSlideUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>

      <section
        id="demo"
        className="relative py-16 lg:py-24 overflow-hidden select-none"
        style={{
          background: 'linear-gradient(180deg, #050810 0%, #080c16 50%, #050810 100%)',
        }}
      >
        {/* Dynamic ambient backdrop glow */}
        <div
          className="pointer-events-none absolute inset-0 -z-0 transition-all duration-700 opacity-80"
          style={{
            background: `radial-gradient(ellipse 65% 45% at 50% 36%, ${current.colors.glow} 0%, transparent 75%)`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Section Header ─────────────────────────────────────── */}
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Международный Дизайн-Продакшн</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-white leading-tight">
              Примеры готовых работ <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                наших дизайнеров
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
              Вы можете посмотреть наши примеры работ. У нас работают ведущие UI/UX дизайнеры
              из разных стран (Италия, Япония, Франция, Швеция, США, Грузия),
              создающие полностью уникальный стиль для каждого заведения.
            </p>
          </div>

          {/* ── Quick Category Filter Pills (Prominent & Well-Highlighted) ── */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none px-2">
            {CARDS.map((card, ci) => {
              const isSelected = ci === activeIndex;
              return (
                <button
                  key={card.id}
                  onClick={() => {
                    setActiveIndex(ci);
                    pauseAndResumeAutoplay();
                  }}
                  className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer shrink-0 flex items-center space-x-2 border-2 ${
                    isSelected
                      ? 'scale-105 shadow-xl'
                      : 'opacity-70 hover:opacity-100 hover:scale-102 hover:border-slate-500'
                  }`}
                  style={{
                    backgroundColor: isSelected ? card.colors.surface : 'rgba(15,23,42,0.75)',
                    borderColor: isSelected ? card.colors.primary : 'rgba(255,255,255,0.12)',
                    color: isSelected ? '#ffffff' : '#94a3b8',
                    boxShadow: isSelected
                      ? `0 0 24px ${card.colors.glow}, 0 0 0 2px ${card.colors.primary}55, 0 6px 20px rgba(0,0,0,0.6)`
                      : 'none',
                  }}
                >
                  <span className="text-base leading-none">{card.emblem}</span>
                  <span className="tracking-tight whitespace-nowrap">{card.name}</span>
                  {isSelected && (
                    <span
                      className="w-2 h-2 rounded-full animate-pulse ml-0.5"
                      style={{ backgroundColor: card.colors.primary }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── 3D Wave Carousel Stage ───────────────────────────────── */}
          <div
            className="relative flex items-center justify-center"
            style={{
              perspective: '1350px',
              minHeight: 500,
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Left Arrow Button */}
            <button
              onClick={() => handleNav(-1)}
              aria-label="Предыдущий проект"
              className="absolute left-0 sm:left-4 z-30 w-12 h-12 rounded-2xl bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-white border border-slate-700/80 flex items-center justify-center shadow-2xl backdrop-blur-md active:scale-90 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Right Arrow Button */}
            <button
              onClick={() => handleNav(1)}
              aria-label="Следующий проект"
              className="absolute right-0 sm:right-4 z-30 w-12 h-12 rounded-2xl bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-white border border-slate-700/80 flex items-center justify-center shadow-2xl backdrop-blur-md active:scale-90 transition-all cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Cards Track */}
            <div
              className="relative w-full max-w-4xl flex items-center justify-center"
              style={{ height: 480, transformStyle: 'preserve-3d' }}
            >
              {CARDS.map((card, idx) => {
                let offset = idx - activeIndex;
                if (offset < -Math.floor(TOTAL / 2)) offset += TOTAL;
                if (offset > Math.floor(TOTAL / 2)) offset -= TOTAL;

                const visible = Math.abs(offset) <= 2;
                if (!visible) return null;

                const isCenter = offset === 0;
                const tx = offset * 250;
                const tz = isCenter ? 60 : -Math.abs(offset) * 110;
                const ry = -offset * 18;
                const scale = isCenter ? 1.04 : Math.max(0.78, 1 - Math.abs(offset) * 0.13);
                const opacity = isCenter ? 1 : Math.max(0.38, 1 - Math.abs(offset) * 0.35);
                const zIndex = 20 - Math.abs(offset) * 4;

                return (
                  <div
                    key={card.id}
                    className="wave-card-item absolute rounded-3xl cursor-pointer"
                    style={{
                      width: 325,
                      height: 475,
                      transform: `translate3d(${tx}px, 0, ${tz}px) rotateY(${ry}deg) scale(${scale})`,
                      opacity,
                      zIndex,
                    }}
                    onClick={() => {
                      if (isCenter) setModalCard(card);
                      else { setActiveIndex(idx); pauseAndResumeAutoplay(); }
                    }}
                  >
                    {/* Card Body */}
                    <div
                      className="w-full h-full rounded-3xl p-5 border-2 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                      style={{
                        background: card.colors.bg,
                        borderColor: isCenter ? card.colors.primary : card.colors.border,
                        boxShadow: isCenter
                          ? `0 24px 56px rgba(0,0,0,0.85), 0 0 45px ${card.colors.glow}`
                          : '0 8px 30px rgba(0,0,0,0.6)',
                      }}
                    >
                      {/* Top Accent Stripe */}
                      <div
                        className="absolute top-0 inset-x-0 h-1.5 z-10"
                        style={{
                          background: `linear-gradient(90deg, ${card.colors.primary}, ${card.colors.secondary})`,
                          opacity: isCenter ? 1 : 0.45,
                        }}
                      />

                      {/* Header: Designer Meta */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl leading-none">{card.emblem}</span>
                          <div>
                            <p className="text-[11px] font-black text-white leading-none">
                              {card.designerName}
                            </p>
                            <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                              {card.designerLocation}
                            </p>
                          </div>
                        </div>

                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                          style={{
                            backgroundColor: `${card.colors.primary}22`,
                            borderColor: card.colors.primary,
                            color: card.colors.primary,
                          }}
                        >
                          {card.countryName}
                        </span>
                      </div>

                      {/* Hero Image & Brand Overlay */}
                      <div className="space-y-3 my-1">
                        <div className="relative h-36 w-full rounded-2xl overflow-hidden border border-white/10 shadow-inner group/img">
                          <img
                            src={card.image}
                            alt={card.name}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                          />
                          <div
                            className="absolute inset-0 flex items-end p-3"
                            style={{
                              background: `linear-gradient(to top, ${card.colors.bg}f0 0%, ${card.colors.bg}70 50%, transparent 100%)`,
                            }}
                          >
                            <div>
                              <h3 className="text-lg font-black text-white font-serif leading-tight">
                                {card.name}
                              </h3>
                              <p className="text-[10px] font-medium truncate" style={{ color: card.colors.primary }}>
                                {card.cuisine}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Signature Dishes */}
                        <div className="flex flex-col gap-1">
                          {card.dishes.slice(0, 2).map((dish, di) => (
                            <div
                              key={di}
                              className="text-[10px] text-slate-300 px-2.5 py-1.5 rounded-lg border flex items-center justify-between truncate"
                              style={{
                                background: card.colors.surface,
                                borderColor: card.colors.border,
                              }}
                            >
                              <div className="flex items-center space-x-1.5 truncate">
                                <Check className="w-3 h-3 shrink-0" style={{ color: card.colors.primary }} />
                                <span className="truncate">{dish.name}</span>
                              </div>
                              <span className="font-bold text-white shrink-0 ml-1">{dish.price}</span>
                            </div>
                          ))}
                        </div>

                        {/* Key Stats Row */}
                        <div className="grid grid-cols-3 gap-1.5 text-center">
                          <div
                            className="p-1.5 rounded-xl border"
                            style={{ background: card.colors.surface, borderColor: card.colors.border }}
                          >
                            <span className="text-[8px] text-slate-400 block">Ср. чек</span>
                            <span className="text-xs font-black text-white">{card.stats.avgCheck}</span>
                          </div>
                          <div
                            className="p-1.5 rounded-xl border"
                            style={{ background: card.colors.surface, borderColor: card.colors.border }}
                          >
                            <span className="text-[8px] text-slate-400 block">Повторные</span>
                            <span className="text-xs font-black text-emerald-400">{card.stats.repeat}</span>
                          </div>
                          <div
                            className="p-1.5 rounded-xl border"
                            style={{ background: card.colors.surface, borderColor: card.colors.border }}
                          >
                            <span className="text-[8px] text-slate-400 block">Запуск</span>
                            <span className="text-xs font-black" style={{ color: card.colors.primary }}>
                              {card.stats.launch}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div
                        className="pt-2 border-t flex items-center justify-between gap-2"
                        style={{ borderColor: card.colors.border }}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalCard(card);
                          }}
                          className="flex-1 flex items-center justify-center space-x-1.5 text-white font-bold py-2.5 rounded-xl text-[11px] uppercase tracking-wider transition-all cursor-pointer border hover:opacity-85"
                          style={{
                            background: card.colors.surface,
                            borderColor: card.colors.border,
                          }}
                        >
                          <Smartphone className="w-3.5 h-3.5" style={{ color: card.colors.primary }} />
                          <span>Инспектор & Демо</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openOrderModal(card);
                          }}
                          className="flex items-center justify-center p-2.5 rounded-xl text-slate-950 font-bold shadow-md active:scale-95 transition-all cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, ${card.colors.primary}, ${card.colors.secondary})`,
                          }}
                          title="Оставить заявку на такой же дизайн"
                        >
                          <Sparkles className="w-4 h-4 stroke-[2.5] text-slate-950" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Progress Indicators & Hint ─────────────────────────── */}
          <div className="flex flex-col items-center justify-center space-y-3 mt-6">
            <div className="flex items-center space-x-2">
              {CARDS.map((card, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => { setActiveIndex(dotIdx); pauseAndResumeAutoplay(); }}
                  className="h-2 rounded-full transition-all cursor-pointer"
                  style={{
                    width: dotIdx === activeIndex ? 36 : 8,
                    backgroundColor: dotIdx === activeIndex ? current.colors.primary : '#334155',
                    boxShadow: dotIdx === activeIndex ? `0 0 14px ${current.colors.glow}` : 'none',
                  }}
                  title={card.name}
                />
              ))}
            </div>
            <p className="text-slate-500 text-[11px] font-mono">
              💡 Нажмите на карточку по центру или выберите заведение вверху
            </p>
          </div>

          {/* ── Highlight Banner of Selected Project ────────────────── */}
          <div
            className="mt-8 max-w-4xl mx-auto rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border-2"
            style={{
              background: current.colors.surface,
              borderColor: current.colors.border,
            }}
          >
            <div className="space-y-2 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="text-lg">{current.emblem}</span>
                <span className="text-xs font-bold text-slate-300">
                  Концепт: {current.designerName} ({current.designerLocation})
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                  ★ Рейтинг {current.stats.rating}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-serif">
                {current.name} — {current.tagline}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                {current.cuisine}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={() => setModalCard(current)}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>Дизайн-инспектор</span>
              </button>

              <button
                onClick={() => openOrderModal(current)}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 text-slate-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${current.colors.primary}, ${current.colors.secondary})`,
                }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Хочу такой же</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* PROFESSIONAL DEVICE SIMULATOR & DESIGN INSPECTOR MODAL        */}
      {/* ───────────────────────────────────────────────────────────── */}
      {modalCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6"
          style={{
            background: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(20px)',
            animation: 'modalFadeIn 200ms ease both',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setModalCard(null); }}
        >
          <div
            className="relative w-full max-w-4xl rounded-3xl border-2 flex flex-col max-h-[90vh] overflow-hidden shadow-2xl"
            style={{
              background: '#090d16',
              borderColor: `${modalCard.colors.primary}77`,
              boxShadow: `0 30px 90px rgba(0,0,0,0.95), 0 0 60px ${modalCard.colors.glow}`,
              animation: 'modalSlideUp 240ms cubic-bezier(0.16, 1, 0.3, 1) both',
            }}
          >
            {/* Modal Top Header */}
            <div
              className="flex items-center justify-between px-5 py-3.5 border-b shrink-0 bg-slate-950/60"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl leading-none">{modalCard.emblem}</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base sm:text-lg font-black text-white">{modalCard.name}</h3>
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                      style={{
                        backgroundColor: `${modalCard.colors.primary}20`,
                        borderColor: modalCard.colors.primary,
                        color: modalCard.colors.primary,
                      }}
                    >
                      {modalCard.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span>{modalCard.designerName}</span>
                    <span>•</span>
                    <span>{modalCard.designerLocation}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalCard(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Закрыть окно"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Two-Column Responsive Layout */}
            <div className="flex-1 min-h-0 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6">
              
              {/* Left Column: Pixel-Perfect Scaled iPhone 16 Pro Mockup */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center">
                <div
                  className="relative rounded-[42px] p-2.5 shadow-2xl border-4 flex flex-col items-center"
                  style={{
                    width: 250,
                    height: 480,
                    backgroundColor: '#05070c',
                    borderColor: '#242b3d',
                    boxShadow: `0 20px 50px rgba(0,0,0,0.9), 0 0 35px ${modalCard.colors.glow}`,
                  }}
                >
                  {/* Internal Screen Bezel with overflow hidden */}
                  <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-black shadow-inner">
                    {/* Dynamic Island Header Notch */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full bg-black z-30 flex items-center justify-between px-2 shadow-md">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#181d29]" />
                    </div>

                    {/* True Native 375px Viewport Scaled Down for Zero Distortion */}
                    <div
                      className="origin-top-left pointer-events-auto"
                      style={{
                        width: 375,
                        height: 770,
                        transform: 'scale(0.608)',
                      }}
                    >
                      <iframe
                        src={modalCard.pwaUrl}
                        className="w-[375px] h-[770px] border-0"
                        title={modalCard.name}
                        loading="eager"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 mt-2.5 text-[10px] text-slate-400 font-mono">
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Интерактивный симулятор iPhone</span>
                </div>
              </div>

              {/* Right Column: Complete Design Specs & Feature Inspector */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                
                {/* Meta Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                        Концепция и кухня
                      </span>
                      <p className="text-sm font-bold text-white mt-0.5">
                        {modalCard.cuisine}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                        Клиентский рейтинг
                      </span>
                      <div className="flex items-center space-x-1 text-amber-400 font-black text-sm justify-end mt-0.5">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{modalCard.stats.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tab Selector */}
                  <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-white/5 border border-white/10">
                    <button
                      onClick={() => setInspectorTab('design')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                        inspectorTab === 'design' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span>Палитра UI</span>
                    </button>

                    <button
                      onClick={() => setInspectorTab('menu')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                        inspectorTab === 'menu' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Utensils className="w-3.5 h-3.5" />
                      <span>Меню & Чек</span>
                    </button>

                    <button
                      onClick={() => setInspectorTab('features')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                        inspectorTab === 'features' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Возможности</span>
                    </button>
                  </div>

                  {/* TAB 1: DESIGN PALETTE */}
                  {inspectorTab === 'design' && (
                    <div className="space-y-3 pt-1">
                      <div>
                        <h4 className="text-[11px] font-bold uppercase text-slate-300 mb-2">
                          Фирменная цветовая палитра (нажмите для копирования HEX)
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { name: 'Primary', hex: modalCard.colors.primary },
                            { name: 'Secondary', hex: modalCard.colors.secondary },
                            { name: 'Background', hex: modalCard.colors.bg },
                            { name: 'Surface Card', hex: modalCard.colors.surface },
                          ].map((col, ci) => (
                            <button
                              key={ci}
                              onClick={() => handleCopyColor(col.hex)}
                              className="p-2.5 rounded-2xl border border-white/10 text-left transition-all hover:scale-102 active:scale-95 cursor-pointer relative"
                              style={{ background: modalCard.colors.surface }}
                              title="Нажмите, чтобы скопировать HEX"
                            >
                              <div
                                className="w-full h-7 rounded-xl mb-1.5 border border-white/20 shadow-inner"
                                style={{ background: col.hex }}
                              />
                              <span className="text-[9px] text-slate-400 block font-medium">{col.name}</span>
                              <span className="text-xs font-mono font-bold text-white block truncate">{col.hex}</span>
                              {copiedHex === col.hex && (
                                <span className="text-[9px] text-emerald-400 font-bold absolute top-2 right-2">✓ Скопировано</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-300">Типографика и акциденты</span>
                          <span className="text-amber-400 font-mono text-[11px]">Geist Sans • Editorial Serif</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Индивидуальная кастомизация герба, шрифтовых пар и динамических акцентов под бренд-бук заведения.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: MENU & KEY STATS */}
                  {inspectorTab === 'menu' && (
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[11px] font-bold uppercase text-slate-300">Ключевые позиции меню</h4>
                        <span className="text-xs text-emerald-400 font-bold">Ср. чек: {modalCard.stats.avgCheck}</span>
                      </div>

                      <div className="space-y-1.5">
                        {modalCard.dishes.map((dish, di) => (
                          <div
                            key={di}
                            className="p-2.5 rounded-2xl border border-white/10 flex items-center justify-between"
                            style={{ background: modalCard.colors.surface }}
                          >
                            <div className="truncate mr-3">
                              <p className="text-xs font-bold text-white truncate">{dish.name}</p>
                              <p className="text-[10px] text-slate-400 truncate">{dish.desc}</p>
                            </div>
                            <span className="text-xs font-black text-amber-400 shrink-0">{dish.price}</span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center pt-1">
                        <div className="p-2.5 rounded-2xl border border-white/10 bg-white/5">
                          <span className="text-[9px] text-slate-400 block">Повторные визиты гостей</span>
                          <span className="text-sm font-black text-emerald-400">{modalCard.stats.repeat}</span>
                        </div>
                        <div className="p-2.5 rounded-2xl border border-white/10 bg-white/5">
                          <span className="text-[9px] text-slate-400 block">Срок полного запуска</span>
                          <span className="text-sm font-black text-white">{modalCard.stats.launch}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: FEATURES & QR */}
                  {inspectorTab === 'features' && (
                    <div className="space-y-3 pt-1">
                      <h4 className="text-[11px] font-bold uppercase text-slate-300">Встроенные функции PWA</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {modalCard.features.map((feat, fi) => (
                          <div
                            key={fi}
                            className="p-2.5 rounded-2xl border border-white/10 flex items-start space-x-2"
                            style={{ background: modalCard.colors.surface }}
                          >
                            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: modalCard.colors.primary }} />
                            <span className="text-xs text-slate-200 leading-snug">{feat}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center space-x-3">
                        <QrCode className="w-7 h-7 text-amber-400 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-white">QR-код на столы и полиграфию</p>
                          <p className="text-[10px] text-slate-400">Генерация макетов для печати с фирменным стилем заведения</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom CTA Action Bar */}
                <div
                  className="pt-3 border-t flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                  style={{
                    borderColor: 'rgba(255,255,255,0.08)',
                  }}
                >
                  <Link
                    href={modalCard.pwaUrl}
                    target="_blank"
                    className="flex-1 flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all border border-white/10"
                  >
                    <ExternalLink className="w-4 h-4" style={{ color: modalCard.colors.primary }} />
                    <span>Открыть живой сайт</span>
                  </Link>

                  <button
                    onClick={() => openOrderModal(modalCard)}
                    className="flex-1 flex items-center justify-center space-x-2 text-slate-950 font-black py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xl active:scale-95"
                    style={{
                      background: `linear-gradient(to right, ${modalCard.colors.primary}, ${modalCard.colors.secondary})`,
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Хочу такой же дизайн</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL «ХОЧУ ТАКОЙ ЖЕ ДИЗАЙН» — DIRECT LEAD BRIEF              */}
      {/* ───────────────────────────────────────────────────────────── */}
      {orderModalCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          style={{
            background: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(16px)',
            animation: 'modalFadeIn 200ms ease both',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setOrderModalCard(null); }}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border-2 flex flex-col max-h-[85vh] overflow-hidden shadow-2xl"
            style={{
              background: '#090d16',
              borderColor: orderModalCard.colors.primary,
              boxShadow: `0 25px 70px rgba(0,0,0,0.95), 0 0 45px ${orderModalCard.colors.glow}`,
              animation: 'modalSlideUp 240ms cubic-bezier(0.16, 1, 0.3, 1) both',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b shrink-0"
              style={{ borderColor: orderModalCard.colors.border }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl leading-none">{orderModalCard.emblem}</span>
                <div>
                  <h3 className="text-base font-black text-white">
                    Заявка на дизайн в стиле «{orderModalCard.name}»
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Концепт: {orderModalCard.designerName} ({orderModalCard.designerLocation})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOrderModalCard(null)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body Form */}
            <div className="p-5 overflow-y-auto">
              {submitSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto shadow-lg"
                    style={{ background: `${orderModalCard.colors.primary}25`, color: orderModalCard.colors.primary }}
                  >
                    <Check className="w-7 h-7 stroke-[3]" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-lg font-bold text-white">Заявка принята!</h4>
                    <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                      Мы закрепили за вашим рестораном стиль <b>{orderModalCard.name}</b>. Наш ведущий архитектор свяжется с вами в течение часа с готовым макетом.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOrderModalCard(null)}
                    className="px-6 py-2.5 rounded-xl text-slate-950 font-black text-xs uppercase tracking-wider transition-transform active:scale-95 cursor-pointer shadow-lg"
                    style={{
                      background: `linear-gradient(to right, ${orderModalCard.colors.primary}, ${orderModalCard.colors.secondary})`,
                    }}
                  >
                    Отлично, жду!
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-3.5">
                  {submitError && (
                    <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-medium">
                      {submitError}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      Ваше имя <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Иван Петров"
                      value={leadForm.name}
                      onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                      className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      Телефон для связи <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+7 (999) 000-00-00"
                      value={leadForm.phone}
                      onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                      className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Название ресторана <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Например, Porto Bar"
                        value={leadForm.restaurantName}
                        onChange={e => setLeadForm({ ...leadForm, restaurantName: e.target.value })}
                        className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Город
                      </label>
                      <input
                        type="text"
                        placeholder="Москва"
                        value={leadForm.city}
                        onChange={e => setLeadForm({ ...leadForm, city: e.target.value })}
                        className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      Пожелания или ссылка на меню (опционально)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Укажите сайт или особые пожелания..."
                      value={leadForm.comment}
                      onChange={e => setLeadForm({ ...leadForm, comment: e.target.value })}
                      className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex items-start space-x-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="lead-agree"
                      checked={leadForm.agree}
                      onChange={e => setLeadForm({ ...leadForm, agree: e.target.checked })}
                      className="w-3.5 h-3.5 mt-0.5 rounded text-amber-500 border-slate-600 bg-slate-800 cursor-pointer"
                    />
                    <label htmlFor="lead-agree" className="text-[10px] text-slate-400 leading-tight cursor-pointer">
                      Согласен на обработку персональных данных (152-ФЗ)
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center space-x-2 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-xl active:scale-95 transition-all cursor-pointer disabled:opacity-50 mt-2"
                    style={{
                      background: `linear-gradient(to right, ${orderModalCard.colors.primary}, ${orderModalCard.colors.secondary})`,
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Отправка...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Получить готовый сайт ресторана</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
