'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  CreditCard,
  Gift,
  Crown,
  SlidersHorizontal,
  Bell,
  BarChart3,
  Check,
  QrCode,
  Sparkles,
  Zap,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface FeatureCardData {
  id: string;
  step: string;
  title: string;
  badge: string;
  badgeColor: string;
  desc: string;
  benefit: string;
  icon: React.ElementType;
  accentColor: string;
  accentGlow: string;
}

const FEATURE_CARDS: FeatureCardData[] = [
  {
    id: 'pwa',
    step: '01',
    title: 'PWA без App Store',
    badge: 'Мгновенная установка',
    badgeColor: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
    desc: 'Открывается мгновенно по QR-коду на столе или прямой ссылке. Гость добавляет иконку ресторана на домашний экран смартфона в 1 клик без App Store.',
    benefit: 'Без очередей модерации Apple и без потери 30% комиссии',
    icon: Smartphone,
    accentColor: '#f59e0b',
    accentGlow: 'rgba(245,158,11,0.35)',
  },
  {
    id: 'payments',
    step: '02',
    title: 'Онлайн-оплата и эквайринг СБП (0.7%)',
    badge: 'Деньги сразу на р/с',
    badgeColor: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
    desc: 'Интеграция с ЮKassa, Т-Банком, СБП и картами РФ. Деньги за заказы поступают на ваш расчетный счет день в день без задержек.',
    benefit: 'Экономия до 35% маржи по сравнению с комиссиями агрегаторов',
    icon: CreditCard,
    accentColor: '#10b981',
    accentGlow: 'rgba(16,185,129,0.35)',
  },
  {
    id: 'loyalty',
    step: '03',
    title: 'Умная программа лояльности',
    badge: 'LTV и возвратность',
    badgeColor: 'text-purple-300 bg-purple-500/10 border-purple-500/30',
    desc: 'Накопительный кешбэк баллами, ранги гостей Bronze / Silver / Gold и виртуальные карты в Apple Wallet и Google Wallet.',
    benefit: 'Увеличение частоты повторных заказов гостей до +45%',
    icon: Gift,
    accentColor: '#a855f7',
    accentGlow: 'rgba(168,85,247,0.35)',
  },
  {
    id: 'modifiers',
    step: '04',
    title: 'Модификаторы и комбо-конструктор',
    badge: '+28% к чеку',
    badgeColor: 'text-blue-300 bg-blue-500/10 border-blue-500/30',
    desc: 'Выбор степеней прожарки стейков, авторских соусов, гарниров и комбо-наборов с автоматическим пересчетом стоимости на лету.',
    benefit: 'Гости с удовольствием добирают топпинги, поднимая средний чек',
    icon: SlidersHorizontal,
    accentColor: '#3b82f6',
    accentGlow: 'rgba(59,130,246,0.35)',
  },
  {
    id: 'push',
    step: '05',
    title: 'Таргетированные Push-уведомления',
    badge: '0 ₽ за SMS',
    badgeColor: 'text-pink-300 bg-pink-500/10 border-pink-500/30',
    desc: 'Бесплатные мгновенные пуш-уведомления о статусе готовности заказа курьером, горячие акции в дождь и бонусы ко дню рождения.',
    benefit: '100% доставляемость прямо на экран блокировки гостя',
    icon: Bell,
    accentColor: '#ec4899',
    accentGlow: 'rgba(236,72,153,0.35)',
  },
  {
    id: 'analytics',
    step: '06',
    title: 'Дашборд, аналитика и стоп-лист',
    badge: 'Контроль 24/7',
    badgeColor: 'text-orange-300 bg-orange-500/10 border-orange-500/30',
    desc: 'Управление стоп-листом блюд за 1 секунду прямо со смартфона управляющего. Живая выручка, средний чек и интеграция с iiko / r-keeper.',
    benefit: 'Шеф-повар и управляющий видят всю картину ресторана без задержек',
    icon: BarChart3,
    accentColor: '#f97316',
    accentGlow: 'rgba(249,115,22,0.35)',
  },
];

const EMBERS = [
  { left: '4%', delay: 0, duration: 8.5, size: 4 },
  { left: '9%', delay: 2.5, duration: 11, size: 5 },
  { left: '15%', delay: 4.2, duration: 9.2, size: 3 },
  { left: '22%', delay: 1.1, duration: 13, size: 6 },
  { left: '29%', delay: 5.4, duration: 10, size: 4 },
  { left: '36%', delay: 3.2, duration: 12.5, size: 5 },
  { left: '43%', delay: 0.7, duration: 8.8, size: 3 },
  { left: '51%', delay: 3.9, duration: 14, size: 6 },
  { left: '58%', delay: 2.1, duration: 10.5, size: 4 },
  { left: '65%', delay: 5.8, duration: 11.5, size: 5 },
  { left: '72%', delay: 1.6, duration: 9.6, size: 4 },
  { left: '79%', delay: 4.7, duration: 12, size: 6 },
  { left: '86%', delay: 2.9, duration: 9, size: 3 },
  { left: '93%', delay: 0.3, duration: 13.5, size: 5 },
  { left: '12%', delay: 6.2, duration: 10.8, size: 4 },
  { left: '26%', delay: 3.5, duration: 11.2, size: 5 },
  { left: '39%', delay: 4.9, duration: 8.4, size: 3 },
  { left: '48%', delay: 1.8, duration: 12.8, size: 6 },
  { left: '62%', delay: 5.1, duration: 9.8, size: 4 },
  { left: '75%', delay: 2.4, duration: 13.2, size: 5 },
  { left: '83%', delay: 4.0, duration: 10.2, size: 4 },
  { left: '91%', delay: 6.5, duration: 11.8, size: 6 },
  { left: '18%', delay: 0.9, duration: 9.4, size: 4 },
  { left: '68%', delay: 3.1, duration: 12.2, size: 5 },
];

export function InteractiveFeaturesBento() {
  const [activeCard, setActiveCard] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [pwaInstalled, setPwaInstalled] = useState(false);
  const [activePayment, setActivePayment] = useState<'sbp' | 'tbank' | 'card'>('sbp');
  const [activeTier, setActiveTier] = useState<'bronze' | 'silver' | 'gold'>('gold');
  const [extraTruffle, setExtraTruffle] = useState(true);
  const [extraPepperSauce, setExtraPepperSauce] = useState(false);
  const [activePush, setActivePush] = useState<'status' | 'promo' | 'bonus'>('status');
  const [inStopList, setInStopList] = useState(false);

  // Auto-cycle timer: rotates cards every 3000ms
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % FEATURE_CARDS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const basePrice = 1890;
  const calculatedPrice =
    basePrice +
    (extraTruffle ? 180 : 0) +
    (extraPepperSauce ? 120 : 0);

  const prevCard = () => {
    setActiveCard((prev) => (prev - 1 + FEATURE_CARDS.length) % FEATURE_CARDS.length);
  };

  const nextCard = () => {
    setActiveCard((prev) => (prev + 1) % FEATURE_CARDS.length);
  };

  return (
    <section
      id="features"
      className="relative pt-36 pb-24 sm:pt-44 sm:pb-32 bg-[#040711] text-slate-100 overflow-hidden isolate scroll-mt-28 selection:bg-amber-500 selection:text-slate-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* LIVING ANIMATED BACKGROUND: NEBULA AURA & GOLDEN EMBERS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            opacity: [0.14, 0.24, 0.16, 0.22],
            scale: [1, 1.15, 1.05, 1.10],
            x: [0, 25, -20, 0],
            y: [0, -25, 20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[650px] sm:w-[850px] h-[650px] sm:h-[850px] bg-gradient-to-br from-amber-500/25 via-orange-600/10 to-transparent rounded-full blur-[140px]"
        />

        <motion.div
          animate={{
            opacity: [0.08, 0.18, 0.10, 0.16],
            scale: [1, 1.12, 0.98, 1.06],
            x: [0, -20, 15, 0],
            y: [0, 25, -15, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-40 -right-40 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-gradient-to-tl from-cyan-500/20 via-blue-600/10 to-transparent rounded-full blur-[150px]"
        />

        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(rgba(245, 158, 11, 0.25) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          }}
        />

        {EMBERS.map((e, idx) => (
          <motion.div
            key={idx}
            initial={{ y: '105%', opacity: 0 }}
            animate={{
              y: '-15%',
              opacity: [0, 0.7, 1, 0.5, 0],
              x: [0, (idx % 2 === 0 ? 16 : -16), (idx % 2 === 0 ? -12 : 12), 0],
            }}
            transition={{
              duration: e.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: e.delay,
            }}
            style={{
              left: e.left,
              width: `${e.size}px`,
              height: `${e.size}px`,
            }}
            className="absolute rounded-full bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.9)] pointer-events-none"
          />
        ))}
      </div>

      {/* MAIN CONTENT CONTAINER (VIEWPORT STAGGERED ENTRANCE) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Smooth Viewport Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold uppercase tracking-widest shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Всё включено в платформу GetMenu</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-white leading-[1.12]">
            Что входит в ваше готовое <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_20px_rgba(245,158,11,0.3)]">
              приложение
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Полный стек технологий для ресторанов без сторонних посредников. 
            Плажки меняются автоматически каждые 3 секунды — кликните на любую, чтобы протестировать её работу вживую.
          </p>

          <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono">
              Шаг {activeCard + 1} из {FEATURE_CARDS.length}: <span className="text-amber-300 font-bold">{FEATURE_CARDS[activeCard].title}</span>
            </span>
            <span className="text-[10px] text-slate-500 border-l border-white/10 pl-2 hidden sm:inline">
              {isPaused ? 'Пауза (наведите курсор)' : 'Авторотация 3 сек'}
            </span>
          </div>
        </motion.div>

        {/* DESKTOP 6-CARD GRID */}
        <div className="hidden md:grid grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {FEATURE_CARDS.map((card, idx) => {
            const isActive = activeCard === idx;
            const Icon = card.icon;

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => setActiveCard(idx)}
                className={`relative rounded-3xl p-6 lg:p-7 flex flex-col justify-between transition-all duration-400 cursor-pointer overflow-hidden group ${
                  isActive
                    ? 'bg-[#0c1322]/95 border-2 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.28)] ring-1 ring-amber-400/50 scale-[1.02] z-20'
                    : 'bg-[#080c16]/80 border border-white/10 hover:border-white/25 hover:bg-[#090e1a]/90 opacity-80 hover:opacity-100 z-10'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 shadow-[0_0_15px_#f59e0b]" />
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{
                        background: isActive ? `${card.accentColor}25` : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${isActive ? card.accentColor : 'rgba(255,255,255,0.12)'}`,
                        color: card.accentColor,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Активно
                        </span>
                      )}
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg lg:text-xl font-bold text-white font-serif leading-snug group-hover:text-amber-200 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed font-light">
                      {card.desc}
                    </p>
                  </div>
                </div>

                {/* Micro-Widgets */}
                <div className="mt-5 pt-4 border-t border-white/8">
                  {card.id === 'pwa' && (
                    <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-xs shadow">
                            P
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white leading-tight">Porto Bar</p>
                            <p className="text-[10px] text-slate-400">Safari • 1.8 МБ</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPwaInstalled(!pwaInstalled);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow ${
                            pwaInstalled
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                          }`}
                        >
                          {pwaInstalled ? (
                            <>
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>На экране ✓</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-3 h-3 stroke-[2.5]" />
                              <span>Установить</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {card.id === 'payments' && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePayment('sbp');
                          }}
                          className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                            activePayment === 'sbp'
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow'
                              : 'bg-white/[0.03] border-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>СБП 0.7%</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePayment('tbank');
                          }}
                          className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                            activePayment === 'tbank'
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
                              : 'bg-white/[0.03] border-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Т-Банк</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePayment('card');
                          }}
                          className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                            activePayment === 'card'
                              ? 'bg-blue-500/20 border-blue-400 text-blue-300 shadow'
                              : 'bg-white/[0.03] border-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Карты РФ</span>
                        </button>
                      </div>

                      <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/25 text-emerald-300 text-[11px] flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                        <span className="truncate">
                          {activePayment === 'sbp' && 'СБП: деньги на р/с день в день (0.7%)'}
                          {activePayment === 'tbank' && 'T-Pay: оплата гостем в 1 клик'}
                          {activePayment === 'card' && 'Автоматический фискальный чек 54-ФЗ'}
                        </span>
                      </div>
                    </div>
                  )}

                  {card.id === 'loyalty' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 p-1 rounded-xl bg-black/50 border border-white/5">
                        {(['bronze', 'silver', 'gold'] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTier(t);
                            }}
                            className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                              activeTier === t
                                ? 'bg-amber-500/30 text-amber-300 border border-amber-400/50 shadow'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {t.toUpperCase()}
                          </button>
                        ))}
                      </div>

                      <div
                        className={`p-2.5 rounded-xl border transition-all ${
                          activeTier === 'gold'
                            ? 'bg-gradient-to-r from-amber-600/30 to-amber-900/40 border-amber-400/50 text-amber-100'
                            : 'bg-slate-800/60 border-slate-700 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold flex items-center gap-1.5">
                            <Crown className="w-3.5 h-3.5 text-amber-400" /> {activeTier.toUpperCase()} GUEST
                          </span>
                          <span className="font-mono font-bold text-amber-300">
                            {activeTier === 'gold' ? '4 750 бонусов (10%)' : activeTier === 'silver' ? '1 890 бонусов (7%)' : '450 бонусов (5%)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {card.id === 'modifiers' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200">Стейк Рибай Black Angus</span>
                        <span className="font-serif font-black text-amber-400 text-sm">{calculatedPrice} ₽</span>
                      </div>

                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExtraTruffle(!extraTruffle);
                          }}
                          className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                            extraTruffle
                              ? 'bg-amber-500/20 border-amber-400/50 text-amber-300 shadow'
                              : 'bg-white/[0.03] border-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {extraTruffle ? '✓ Трюфель 180₽' : '+ Трюфель 180₽'}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExtraPepperSauce(!extraPepperSauce);
                          }}
                          className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                            extraPepperSauce
                              ? 'bg-amber-500/20 border-amber-400/50 text-amber-300 shadow'
                              : 'bg-white/[0.03] border-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {extraPepperSauce ? '✓ Перечный соус' : '+ Соус 120₽'}
                        </button>
                      </div>
                    </div>
                  )}

                  {card.id === 'push' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-[10px]">
                        {(['status', 'promo', 'bonus'] as const).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePush(p);
                            }}
                            className={`flex-1 py-1 rounded-lg transition-all cursor-pointer ${
                              activePush === p
                                ? 'bg-pink-500/25 text-pink-300 border border-pink-500/40 font-bold shadow'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {p === 'status' ? 'Статус' : p === 'promo' ? 'Акция' : 'Бонусы'}
                          </button>
                        ))}
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-white truncate">
                        {activePush === 'status' && '👨‍🍳 Шеф готовит ваш заказ #148 (25 мин)'}
                        {activePush === 'promo' && '🌧 За окном дождь? Согреем кофе в подарок!'}
                        {activePush === 'bonus' && '🎁 Вам начислено 500 бонусов ко дню рождения'}
                      </div>
                    </div>
                  )}

                  {card.id === 'analytics' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Выручка за сегодня:</span>
                        <span className="text-emerald-400 font-black font-mono">184 600 ₽ (+24%)</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5">
                        <span className="text-xs text-slate-200">Лосось на гриле</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInStopList(!inStopList);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer shadow ${
                            inStopList
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          }`}
                        >
                          {inStopList ? '⛔ В стоп-листе' : '✓ В наличии'}
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{card.benefit}</span>
                  </p>
                </div>

                {/* 3-Second Animated Progress Bar */}
                {isActive && (
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10 overflow-hidden">
                    <motion.div
                      key={activeCard}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3, ease: 'linear' }}
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-300 shadow-[0_0_10px_#f59e0b]"
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* MOBILE SPOTLIGHT VIEW */}
        <div className="md:hidden space-y-4">
          <div className="relative rounded-3xl p-6 bg-[#0c1322] border-2 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.25)] overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-white/10 overflow-hidden">
              <motion.div
                key={activeCard}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300"
              />
            </div>

            <div className="flex items-center justify-between mb-4 pt-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{
                    background: `${FEATURE_CARDS[activeCard].accentColor}25`,
                    border: `1px solid ${FEATURE_CARDS[activeCard].accentColor}`,
                    color: FEATURE_CARDS[activeCard].accentColor,
                  }}
                >
                  {React.createElement(FEATURE_CARDS[activeCard].icon, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Функция {FEATURE_CARDS[activeCard].step} из 06
                  </span>
                  <p className="text-xs font-bold text-slate-400">{FEATURE_CARDS[activeCard].badge}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={prevCard}
                  className="p-1.5 rounded-xl bg-white/10 text-white hover:bg-white/20"
                  aria-label="Предыдущая функция"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={nextCard}
                  className="p-1.5 rounded-xl bg-white/10 text-white hover:bg-white/20"
                  aria-label="Следующая функция"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-black font-serif text-white mb-2">
              {FEATURE_CARDS[activeCard].title}
            </h3>

            <p className="text-slate-300 text-xs leading-relaxed mb-4">
              {FEATURE_CARDS[activeCard].desc}
            </p>

            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-amber-300 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{FEATURE_CARDS[activeCard].benefit}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1">
            {FEATURE_CARDS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveCard(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeCard === i
                    ? 'w-8 bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]'
                    : 'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Перейти к карточке ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom SLA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 sm:mt-16 max-w-4xl mx-auto rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl"
        >
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                Все 6 модулей подключаются «под ключ» за 48 часов
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Мы берем на себя верстку меню, фото, интеграцию оплат СБП и настройку кухни.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('brief-form');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
          >
            Получить демо-доступ
          </button>
        </motion.div>

      </div>
    </section>
  );
}
