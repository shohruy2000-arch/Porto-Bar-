'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
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
  Layers,
  ChevronRight
} from 'lucide-react';

export function InteractiveFeaturesBento() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 380vh scroll track for deep, deliberate step-by-step card arrivals
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 25,
    restDelta: 0.0008,
  });

  /* ─────────────────────────────────────────────────────────────
     INTERACTIVE WIDGET STATES
  ───────────────────────────────────────────────────────────────*/
  const [pwaInstalled, setPwaInstalled] = useState(false);
  const [activePayment, setActivePayment] = useState<'sbp' | 'tbank' | 'card'>('sbp');
  const [activeTier, setActiveTier] = useState<'bronze' | 'silver' | 'gold'>('gold');
  const [doneness, setDoneness] = useState<'medium-rare' | 'medium' | 'well-done'>('medium');
  const [extraTruffle, setExtraTruffle] = useState(true);
  const [extraPepperSauce, setExtraPepperSauce] = useState(false);
  const [activePush, setActivePush] = useState<'status' | 'promo' | 'bonus'>('status');
  const [inStopList, setInStopList] = useState(false);

  // Active card index for mobile deck (0 to 5)
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);

  useEffect(() => {
    return smoothScroll.on('change', (v) => {
      // Map scroll progress to active card (0 to 5) for mobile focus
      if (v < 0.22) setMobileActiveIndex(0);
      else if (v < 0.36) setMobileActiveIndex(1);
      else if (v < 0.50) setMobileActiveIndex(2);
      else if (v < 0.64) setMobileActiveIndex(3);
      else if (v < 0.78) setMobileActiveIndex(4);
      else setMobileActiveIndex(5);
    });
  }, [smoothScroll]);

  const basePrice = 1890;
  const calculatedPrice =
    basePrice +
    (extraTruffle ? 180 : 0) +
    (extraPepperSauce ? 120 : 0);

  /* ─────────────────────────────────────────────────────────────
     SCROLL PROGRESS RANGES FOR CARDS (DESKTOP)
  ───────────────────────────────────────────────────────────────*/
  // Title reveal
  const titleY = useTransform(smoothScroll, [0.02, 0.12], [28, 0]);
  const titleOpacity = useTransform(smoothScroll, [0.02, 0.12], [0, 1]);

  // Card 1: PWA [0.10, 0.22]
  const c1Opacity = useTransform(smoothScroll, [0.10, 0.22], [0, 1]);
  const c1Y = useTransform(smoothScroll, [0.10, 0.22], [60, 0]);
  const c1Scale = useTransform(smoothScroll, [0.10, 0.22], [0.90, 1]);
  const c1RotateX = useTransform(smoothScroll, [0.10, 0.22], [14, 0]);

  // Card 2: Онлайн-оплата [0.22, 0.35]
  const c2Opacity = useTransform(smoothScroll, [0.22, 0.35], [0, 1]);
  const c2Y = useTransform(smoothScroll, [0.22, 0.35], [60, 0]);
  const c2Scale = useTransform(smoothScroll, [0.22, 0.35], [0.90, 1]);
  const c2RotateX = useTransform(smoothScroll, [0.22, 0.35], [14, 0]);

  // Card 3: Программа лояльности [0.35, 0.48]
  const c3Opacity = useTransform(smoothScroll, [0.35, 0.48], [0, 1]);
  const c3Y = useTransform(smoothScroll, [0.35, 0.48], [60, 0]);
  const c3Scale = useTransform(smoothScroll, [0.35, 0.48], [0.90, 1]);
  const c3RotateX = useTransform(smoothScroll, [0.35, 0.48], [14, 0]);

  // Card 4: Модификаторы блюд [0.48, 0.61]
  const c4Opacity = useTransform(smoothScroll, [0.48, 0.61], [0, 1]);
  const c4Y = useTransform(smoothScroll, [0.48, 0.61], [60, 0]);
  const c4Scale = useTransform(smoothScroll, [0.48, 0.61], [0.90, 1]);
  const c4RotateX = useTransform(smoothScroll, [0.48, 0.61], [14, 0]);

  // Card 5: Push-уведомления [0.61, 0.74]
  const c5Opacity = useTransform(smoothScroll, [0.61, 0.74], [0, 1]);
  const c5Y = useTransform(smoothScroll, [0.61, 0.74], [60, 0]);
  const c5Scale = useTransform(smoothScroll, [0.61, 0.74], [0.90, 1]);
  const c5RotateX = useTransform(smoothScroll, [0.61, 0.74], [14, 0]);

  // Card 6: Дашборд и аналитика [0.74, 0.86]
  const c6Opacity = useTransform(smoothScroll, [0.74, 0.86], [0, 1]);
  const c6Y = useTransform(smoothScroll, [0.74, 0.86], [60, 0]);
  const c6Scale = useTransform(smoothScroll, [0.74, 0.86], [0.90, 1]);
  const c6RotateX = useTransform(smoothScroll, [0.74, 0.86], [14, 0]);

  // Bottom CTA [0.86, 0.96]
  const ctaOpacity = useTransform(smoothScroll, [0.86, 0.96], [0, 1]);
  const ctaY = useTransform(smoothScroll, [0.86, 0.96], [30, 0]);

  // Floating background embers data
  const embers = [
    { left: '8%', delay: 0, duration: 9, size: 4 },
    { left: '16%', delay: 2, duration: 11, size: 5 },
    { left: '25%', delay: 4, duration: 8, size: 3 },
    { left: '38%', delay: 1, duration: 13, size: 6 },
    { left: '48%', delay: 5, duration: 10, size: 4 },
    { left: '58%', delay: 3, duration: 12, size: 5 },
    { left: '70%', delay: 0.5, duration: 9, size: 4 },
    { left: '82%', delay: 3.5, duration: 14, size: 6 },
    { left: '92%', delay: 2.2, duration: 10, size: 3 },
    { left: '12%', delay: 6, duration: 11, size: 4 },
    { left: '64%', delay: 4.5, duration: 9, size: 5 },
    { left: '86%', delay: 1.8, duration: 12, size: 4 },
  ];

  /* ─────────────────────────────────────────────────────────────
     FEATURE CARDS DATA FOR MOBILE SLIDER
  ───────────────────────────────────────────────────────────────*/
  const featureList = [
    { id: 'pwa', label: '1. PWA без App Store' },
    { id: 'pay', label: '2. Онлайн-оплата' },
    { id: 'loyalty', label: '3. Лояльность' },
    { id: 'modifiers', label: '4. Модификаторы' },
    { id: 'push', label: '5. Push-уведомления' },
    { id: 'analytics', label: '6. Дашборд' },
  ];

  return (
    <section ref={containerRef} id="features" className="relative h-[340vh] sm:h-[380vh] bg-[#050811] text-slate-100">
      
      {/* ──────────────────────────────────────────────────────────
          LIVING BACKGROUND: DYNAMIC NEBULA & FLOATING GOLD EMBERS
      ───────────────────────────────────────────────────────────*/}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between select-none">
        
        {/* Living Ambient Nebula Pulses */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Amber Gold Aura (Top Left) */}
          <motion.div
            animate={{
              opacity: [0.12, 0.22, 0.15, 0.20],
              scale: [1, 1.12, 1.04, 1.08],
              x: [0, 30, -20, 0],
              y: [0, -20, 25, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-32 -left-32 w-[650px] sm:w-[850px] h-[650px] sm:h-[850px] bg-gradient-to-br from-amber-500/25 via-orange-600/10 to-transparent rounded-full blur-[140px]"
          />

          {/* Deep Indigo/Cyan Tech Aura (Bottom Right) */}
          <motion.div
            animate={{
              opacity: [0.08, 0.18, 0.11, 0.16],
              scale: [1, 1.15, 0.98, 1.05],
              x: [0, -25, 15, 0],
              y: [0, 30, -15, 0],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute -bottom-40 -right-40 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-gradient-to-tl from-cyan-500/20 via-blue-600/10 to-transparent rounded-full blur-[150px]"
          />

          {/* Cyber Dot-Matrix Overlay */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(245, 158, 11, 0.25) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
              maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
            }}
          />

          {/* Floating Luxury Golden Dust Embers */}
          {embers.map((e, idx) => (
            <motion.div
              key={idx}
              initial={{ y: '110vh', opacity: 0 }}
              animate={{
                y: '-20vh',
                opacity: [0, 0.7, 0.9, 0.4, 0],
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
              className="absolute rounded-full bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.85)] pointer-events-none"
            />
          ))}
        </div>

        {/* ──────────────────────────────────────────────────────────
            SECTION CONTENT (PINNED STAGE)
        ───────────────────────────────────────────────────────────*/}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between pt-16 sm:pt-20 pb-6 sm:pb-8">
          
          {/* Header */}
          <motion.div
            style={{ y: titleY, opacity: titleOpacity }}
            className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3 shrink-0"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Функционал платформы</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-white leading-tight">
              Что входит в ваше готовое{' '}
              <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(245,158,11,0.3)]">
                приложение
              </span>
            </h2>

            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto hidden sm:block">
              Листайте страницу — блоки оживают по очереди. Каждый можно протестировать:
            </p>
          </motion.div>

          {/* ──────────────────────────────────────────────────────────
              DESKTOP VIEW: STAGGERED 3D BENTO GRID ARRIVAL
          ───────────────────────────────────────────────────────────*/}
          <div className="hidden md:grid grid-cols-3 gap-5 lg:gap-6 my-auto [perspective:1400px]">
            
            {/* 1. PWA БЕЗ APP STORE */}
            <motion.div
              style={{
                opacity: c1Opacity,
                y: c1Y,
                scale: c1Scale,
                rotateX: c1RotateX,
              }}
              className="rounded-2xl lg:rounded-3xl bg-[#090d16]/90 backdrop-blur-xl border border-white/10 hover:border-amber-500/40 transition-colors duration-300 p-5 lg:p-6 flex flex-col justify-between shadow-[0_20px_45px_rgba(0,0,0,0.7)] group will-change-transform"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    Мгновенная установка
                  </span>
                </div>

                <div>
                  <h3 className="text-base lg:text-lg font-bold text-white font-serif">
                    PWA без App Store
                  </h3>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Открывается по QR-коду на столе. Без очередей модерации и комиссий Apple 30%.
                  </p>
                </div>
              </div>

              {/* PWA Widget */}
              <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between bg-white/[0.04] p-2 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-xs shadow">
                      P
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">Porto Bar</p>
                      <p className="text-[9px] text-slate-400">Safari • 1.8 МБ</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setPwaInstalled(!pwaInstalled)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                      pwaInstalled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                    }`}
                  >
                    {pwaInstalled ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>На экране</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3 h-3" />
                        <span>Установить</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* 2. ОНЛАЙН-ОПЛАТА И СБП */}
            <motion.div
              style={{
                opacity: c2Opacity,
                y: c2Y,
                scale: c2Scale,
                rotateX: c2RotateX,
              }}
              className="rounded-2xl lg:rounded-3xl bg-[#090d16]/90 backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 transition-colors duration-300 p-5 lg:p-6 flex flex-col justify-between shadow-[0_20px_45px_rgba(0,0,0,0.7)] group will-change-transform"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    0% комиссии
                  </span>
                </div>

                <div>
                  <h3 className="text-base lg:text-lg font-bold text-white font-serif">
                    Онлайн-оплата и СБП
                  </h3>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    ЮKassa, Т-Банк, СБП и карты РФ. Средства мгновенно поступают на расчетный счет.
                  </p>
                </div>
              </div>

              {/* Payment Widget */}
              <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => setActivePayment('sbp')}
                    className={`py-1 px-1 rounded-lg text-[9px] font-bold border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                      activePayment === 'sbp'
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-white/[0.02] border-white/5 text-slate-400'
                    }`}
                  >
                    <QrCode className="w-3 h-3" />
                    <span>СБП 0.7%</span>
                  </button>
                  <button
                    onClick={() => setActivePayment('tbank')}
                    className={`py-1 px-1 rounded-lg text-[9px] font-bold border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                      activePayment === 'tbank'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-white/[0.02] border-white/5 text-slate-400'
                    }`}
                  >
                    <Zap className="w-3 h-3" />
                    <span>T-Pay</span>
                  </button>
                  <button
                    onClick={() => setActivePayment('card')}
                    className={`py-1 px-1 rounded-lg text-[9px] font-bold border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                      activePayment === 'card'
                        ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                        : 'bg-white/[0.02] border-white/5 text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-3 h-3" />
                    <span>Карты РФ</span>
                  </button>
                </div>

                <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/25 text-emerald-300 text-[10px] flex items-center gap-1.5">
                  <Check className="w-3 h-3 shrink-0 text-emerald-400" />
                  <span className="truncate">
                    {activePayment === 'sbp' && 'СБП: деньги на р/с без задержек'}
                    {activePayment === 'tbank' && 'T-Pay: оплата в 1 клик'}
                    {activePayment === 'card' && 'Авточек 54-ФЗ подключен'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* 3. ПРОГРАММА ЛОЯЛЬНОСТИ */}
            <motion.div
              style={{
                opacity: c3Opacity,
                y: c3Y,
                scale: c3Scale,
                rotateX: c3RotateX,
              }}
              className="rounded-2xl lg:rounded-3xl bg-[#090d16]/90 backdrop-blur-xl border border-white/10 hover:border-purple-500/40 transition-colors duration-300 p-5 lg:p-6 flex flex-col justify-between shadow-[0_20px_45px_rgba(0,0,0,0.7)] group will-change-transform"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                    <Gift className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    LTV и кешбэк
                  </span>
                </div>

                <div>
                  <h3 className="text-base lg:text-lg font-bold text-white font-serif">
                    Программа лояльности
                  </h3>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Автокешбэк баллами, грейды гостей и подарки за визиты в Apple & Google Wallet.
                  </p>
                </div>
              </div>

              {/* Loyalty Card Widget */}
              <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/50 border border-white/5">
                  {(['bronze', 'silver', 'gold'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTier(t)}
                      className={`flex-1 py-0.5 text-[9px] font-bold rounded transition-all cursor-pointer ${
                        activeTier === t
                          ? 'bg-amber-500/30 text-amber-300 border border-amber-400/50'
                          : 'text-slate-400'
                      }`}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className={`p-2.5 rounded-xl border transition-all ${
                  activeTier === 'gold'
                    ? 'bg-gradient-to-r from-amber-600/30 to-amber-900/40 border-amber-400/50 text-amber-100'
                    : 'bg-slate-800/60 border-slate-700 text-slate-200'
                }`}>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-400" /> {activeTier.toUpperCase()} GUEST
                    </span>
                    <span className="font-mono opacity-80">
                      {activeTier === 'gold' ? '4 750 бонусов' : activeTier === 'silver' ? '1 890 бонусов' : '450 бонусов'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 4. УМНЫЕ МОДИФИКАТОРЫ */}
            <motion.div
              style={{
                opacity: c4Opacity,
                y: c4Y,
                scale: c4Scale,
                rotateX: c4RotateX,
              }}
              className="rounded-2xl lg:rounded-3xl bg-[#090d16]/90 backdrop-blur-xl border border-white/10 hover:border-blue-500/40 transition-colors duration-300 p-5 lg:p-6 flex flex-col justify-between shadow-[0_20px_45px_rgba(0,0,0,0.7)] group will-change-transform"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    +18% к чеку
                  </span>
                </div>

                <div>
                  <h3 className="text-base lg:text-lg font-bold text-white font-serif">
                    Модификаторы и комбо
                  </h3>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Прожарка, выбор соусов и топпингов с моментальным пересчетом стоимости блюда.
                  </p>
                </div>
              </div>

              {/* Modifier Widget */}
              <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-200">Стейк Рибай</span>
                  <span className="font-serif font-black text-amber-400">{calculatedPrice} ₽</span>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => setExtraTruffle(!extraTruffle)}
                    className={`flex-1 py-1 px-1.5 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${
                      extraTruffle
                        ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                        : 'bg-white/[0.02] border-white/5 text-slate-400'
                    }`}
                  >
                    + Трюфель 180₽
                  </button>
                  <button
                    onClick={() => setExtraPepperSauce(!extraPepperSauce)}
                    className={`flex-1 py-1 px-1.5 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${
                      extraPepperSauce
                        ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                        : 'bg-white/[0.02] border-white/5 text-slate-400'
                    }`}
                  >
                    + Соус 120₽
                  </button>
                </div>
              </div>
            </motion.div>

            {/* 5. PUSH-УВЕДОМЛЕНИЯ */}
            <motion.div
              style={{
                opacity: c5Opacity,
                y: c5Y,
                scale: c5Scale,
                rotateX: c5RotateX,
              }}
              className="rounded-2xl lg:rounded-3xl bg-[#090d16]/90 backdrop-blur-xl border border-white/10 hover:border-pink-500/40 transition-colors duration-300 p-5 lg:p-6 flex flex-col justify-between shadow-[0_20px_45px_rgba(0,0,0,0.7)] group will-change-transform"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform">
                    <Bell className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20">
                    0 ₽ за SMS
                  </span>
                </div>

                <div>
                  <h3 className="text-base lg:text-lg font-bold text-white font-serif">
                    Push-уведомления
                  </h3>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Готовность заказа, вечерние акции и поздравления с днем рождения без затрат на SMS.
                  </p>
                </div>
              </div>

              {/* Push Widget */}
              <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                <div className="flex items-center gap-1 text-[9px]">
                  {(['status', 'promo', 'bonus'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setActivePush(p)}
                      className={`flex-1 py-0.5 rounded transition-all cursor-pointer ${
                        activePush === p
                          ? 'bg-pink-500/25 text-pink-300 border border-pink-500/40 font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      {p === 'status' ? 'Статус' : p === 'promo' ? 'Акция' : 'Бонусы'}
                    </button>
                  ))}
                </div>

                <div className="p-2 rounded-lg bg-slate-900/90 border border-white/10 text-[10px] text-white truncate">
                  {activePush === 'status' && '👨‍🍳 Шеф готовит ваш заказ #148 (25 мин)'}
                  {activePush === 'promo' && '🍕 Счастливые часы: напиток в подарок!'}
                  {activePush === 'bonus' && '🎁 Вам начислено 350 бонусов к заказу'}
                </div>
              </div>
            </motion.div>

            {/* 6. ДАШБОРД И АНАЛИТИКА */}
            <motion.div
              style={{
                opacity: c6Opacity,
                y: c6Y,
                scale: c6Scale,
                rotateX: c6RotateX,
              }}
              className="rounded-2xl lg:rounded-3xl bg-[#090d16]/90 backdrop-blur-xl border border-white/10 hover:border-orange-500/40 transition-colors duration-300 p-5 lg:p-6 flex flex-col justify-between shadow-[0_20px_45px_rgba(0,0,0,0.7)] group will-change-transform"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-105 transition-transform">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/20">
                    Контроль 24/7
                  </span>
                </div>

                <div>
                  <h3 className="text-base lg:text-lg font-bold text-white font-serif">
                    Дашборд и стоп-лист
                  </h3>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Выручка онлайн, популярные позиции и отключение блюд в 1 клик с экрана смартфона.
                  </p>
                </div>
              </div>

              {/* Dashboard Widget */}
              <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Сегодня: 184 600 ₽</span>
                  <span className="text-emerald-400 font-bold">+24%</span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-slate-200">Лосось гриль</span>
                  <button
                    onClick={() => setInStopList(!inStopList)}
                    className={`px-2 py-0.5 rounded text-[9px] font-bold border transition-all cursor-pointer ${
                      inStopList
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    }`}
                  >
                    {inStopList ? 'Стоп-лист' : 'В наличии'}
                  </button>
                </div>
              </div>
            </motion.div>

          </div>

          {/* ──────────────────────────────────────────────────────────
              MOBILE VIEW: CINEMATIC CARD-BY-CARD DECK (SWIPE & SCROLL)
          ───────────────────────────────────────────────────────────*/}
          <div className="md:hidden my-auto w-full max-w-sm mx-auto space-y-4">
            
            {/* Step indicators */}
            <div className="flex items-center justify-between px-2 text-xs">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Функция {mobileActiveIndex + 1} из 6
              </span>
              <div className="flex items-center gap-1.5">
                {featureList.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setMobileActiveIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      mobileActiveIndex === i
                        ? 'bg-amber-400 w-6 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                        : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Mobile Active Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileActiveIndex}
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.95 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="rounded-2xl bg-[#090d16]/95 backdrop-blur-2xl border border-amber-500/30 p-5 shadow-[0_20px_45px_rgba(0,0,0,0.8)] min-h-[290px] flex flex-col justify-between"
              >
                {/* 1. PWA */}
                {mobileActiveIndex === 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        Мгновенная установка
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white font-serif">PWA без App Store</h3>
                      <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                        Устанавливается с экрана Safari / Chrome в 1 клик. Занимает меньше 2 МБ, работает без модерации.
                      </p>
                    </div>
                    <div className="flex items-center justify-between bg-white/[0.04] p-3 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center">P</div>
                        <div>
                          <p className="text-xs font-bold text-white">Porto Bar</p>
                          <p className="text-[10px] text-slate-400">Safari PWA</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPwaInstalled(!pwaInstalled)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          pwaInstalled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500 text-slate-950'
                        }`}
                      >
                        {pwaInstalled ? '✓ На экране' : 'Установить'}
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Оплата */}
                {mobileActiveIndex === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        0% комиссии
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white font-serif">Онлайн-оплата и СБП</h3>
                      <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                        Интеграция с ЮKassa, Т-Банком, СБП. Деньги поступают сразу на ваш расчетный счет.
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => setActivePayment('sbp')}
                        className={`py-2 rounded-xl text-[10px] font-bold border ${
                          activePayment === 'sbp' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-white/[0.03] border-white/5 text-slate-400'
                        }`}
                      >
                        СБП (QR)
                      </button>
                      <button
                        onClick={() => setActivePayment('tbank')}
                        className={`py-2 rounded-xl text-[10px] font-bold border ${
                          activePayment === 'tbank' ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-white/[0.03] border-white/5 text-slate-400'
                        }`}
                      >
                        T-Pay
                      </button>
                      <button
                        onClick={() => setActivePayment('card')}
                        className={`py-2 rounded-xl text-[10px] font-bold border ${
                          activePayment === 'card' ? 'bg-blue-500/20 border-blue-400 text-blue-300' : 'bg-white/[0.03] border-white/5 text-slate-400'
                        }`}
                      >
                        Карты РФ
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Лояльность */}
                {mobileActiveIndex === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                        <Gift className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        LTV и кешбэк
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white font-serif">Программа лояльности</h3>
                      <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                        Уровни гостей, автоматический кешбэк баллами и подарки к первому заказу.
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl border ${
                      activeTier === 'gold' ? 'bg-gradient-to-r from-amber-600/30 to-amber-900/40 border-amber-400/50 text-amber-100' : 'bg-slate-800/60 border-slate-700'
                    }`}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold flex items-center gap-1"><Crown className="w-3.5 h-3.5 text-amber-400" /> GOLD VIP</span>
                        <span className="font-mono font-bold">4 750 бонусов</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Модификаторы */}
                {mobileActiveIndex === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                        <SlidersHorizontal className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        +18% к чеку
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white font-serif">Модификаторы блюд</h3>
                      <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                        Выбор прожарки, добавление соусов и топпингов с пересчетом цены на лету.
                      </p>
                    </div>
                    <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/10">
                      <span className="text-xs font-bold text-white">Стейк Рибай Прайм</span>
                      <span className="text-sm font-black font-serif text-amber-400">{calculatedPrice} ₽</span>
                    </div>
                  </div>
                )}

                {/* 5. Push */}
                {mobileActiveIndex === 4 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
                        <Bell className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20">
                        0 ₽ за SMS
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white font-serif">Бесплатные Push</h3>
                      <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                        Статус готовности заказа и персональные вечерние акции прямо на экран.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-white">
                      👨‍🍳 Шеф начал готовить заказ #148. Доставка через 25 минут!
                    </div>
                  </div>
                )}

                {/* 6. Дашборд */}
                {mobileActiveIndex === 5 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/20">
                        Контроль 24/7
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white font-serif">Дашборд и аналитика</h3>
                      <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                        Выручка онлайн, средний чек и стоп-лист блюд в 1 клик с телефона.
                      </p>
                    </div>
                    <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/10">
                      <div>
                        <p className="text-xs font-bold text-white">Выручка сегодня</p>
                        <p className="text-sm font-black text-amber-400">184 600 ₽</p>
                      </div>
                      <button
                        onClick={() => setInStopList(!inStopList)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                          inStopList ? 'bg-rose-500/20 text-rose-300 border-rose-500/50' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        }`}
                      >
                        {inStopList ? 'Стоп-лист' : 'В наличии'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Navigation helpers */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-slate-400">
                  <button
                    disabled={mobileActiveIndex === 0}
                    onClick={() => setMobileActiveIndex((p) => Math.max(0, p - 1))}
                    className="disabled:opacity-30 hover:text-white"
                  >
                    ← Назад
                  </button>
                  <span className="text-slate-500">Свайпайте при скролле</span>
                  <button
                    disabled={mobileActiveIndex === 5}
                    onClick={() => setMobileActiveIndex((p) => Math.min(5, p + 1))}
                    className="disabled:opacity-30 text-amber-400 font-bold hover:text-amber-300"
                  >
                    Далее →
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ──────────────────────────────────────────────────────────
              BOTTOM CTA BANNER (REVEALED IN FINAL SCROLL PHASE)
          ───────────────────────────────────────────────────────────*/}
          <motion.div
            style={{ opacity: ctaOpacity, y: ctaY }}
            className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#0d1322] to-amber-500/15 border border-amber-500/30 text-center max-w-4xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
          >
            <div className="text-left space-y-0.5 sm:space-y-1">
              <h4 className="text-sm sm:text-lg font-bold font-serif text-white">
                Хотите протестировать эти функции на вашем меню?
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Соберем тестовое PWA-приложение для вашего ресторана за 24 часа без предоплаты.
              </p>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById('lead-form');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs sm:text-sm hover:from-amber-400 hover:to-amber-300 shadow-md shadow-amber-500/20 transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2"
            >
              <span>Получить демо бесплатно</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
