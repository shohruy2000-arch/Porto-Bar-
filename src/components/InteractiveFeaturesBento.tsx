'use client';

import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';

export function InteractiveFeaturesBento() {
  /* ─────────────────────────────────────────────────────────────
     INTERACTIVE WIDGET STATES
  ───────────────────────────────────────────────────────────────*/
  // 1. PWA Install Simulation
  const [pwaInstalled, setPwaInstalled] = useState(false);

  // 2. Payment Method Simulation
  const [activePayment, setActivePayment] = useState<'sbp' | 'tbank' | 'card'>('sbp');

  // 3. Loyalty Tier Simulation
  const [activeTier, setActiveTier] = useState<'bronze' | 'silver' | 'gold'>('gold');

  // 4. Dish Modifier Simulation
  const [doneness, setDoneness] = useState<'medium-rare' | 'medium' | 'well-done'>('medium');
  const [extraTruffle, setExtraTruffle] = useState(true);
  const [extraPepperSauce, setExtraPepperSauce] = useState(false);

  // 5. Push Notification Simulation
  const [activePush, setActivePush] = useState<'status' | 'promo' | 'bonus'>('status');

  // 6. Stop List Toggle Simulation
  const [inStopList, setInStopList] = useState(false);

  // Dynamic price calculation for modifier card
  const basePrice = 1890;
  const calculatedPrice =
    basePrice +
    (extraTruffle ? 180 : 0) +
    (extraPepperSauce ? 120 : 0);

  return (
    <section id="features" className="py-24 sm:py-32 bg-[#050811] text-slate-100 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-amber-500/10 via-orange-600/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Функционал платформы</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-white leading-tight">
            Что входит в ваше готовое{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
              приложение
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Полноценная e-commerce система ресторанного уровня Dodo Pizza и Яндекс Лавки. Попробуйте интерактивные функции прямо в карточках:
          </p>
        </div>

        {/* ──────────────────────────────────────────────────────────
            BENTO GRID (6 INTERACTIVE LUXURY CARDS)
        ───────────────────────────────────────────────────────────*/}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          
          {/* ══════════════════════════════════════════════════════════
              CARD 1: PWA БЕЗ APP STORE
          ═══════════════════════════════════════════════════════════ */}
          <div className="rounded-3xl bg-[#090d16]/90 border border-white/10 hover:border-amber-500/40 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between shadow-[0_20px_45px_rgba(0,0,0,0.6)] group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Smartphone className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Мгновенная установка
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white font-serif">
                  PWA без App Store и Google Play
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                  Гость открывает меню по QR-коду на столе или ссылке. Никаких проверок модерации, очередей и комиссий Apple 30%.
                </p>
              </div>
            </div>

            {/* Interactive Widget: Phone Install Simulation */}
            <div className="mt-6 pt-5 border-t border-white/5">
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-medium text-slate-400">Демо симуляция:</span>
                  <span className="text-[11px] text-amber-400/90 font-mono">1.8 МБ • Safari / Chrome</span>
                </div>

                <div className="flex items-center justify-between bg-white/[0.04] p-2.5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-sm shadow-md">
                      P
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">Porto Bar & Kitchen</p>
                      <p className="text-[10px] text-slate-400">porto-bar.ru</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setPwaInstalled(!pwaInstalled)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                      pwaInstalled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20'
                    }`}
                  >
                    {pwaInstalled ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>На экране Домой</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3 h-3" />
                        <span>Установить</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-center text-slate-400">
                  {pwaInstalled ? (
                    <span className="text-emerald-400">✓ Иконка добавлена на домашний экран за 1 секунду</span>
                  ) : (
                    <span>Нажмите «Установить», чтобы проверить отклик PWA</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              CARD 2: ОНЛАЙН-ОПЛАТА И СБП (0% КОМИССИИ)
          ═══════════════════════════════════════════════════════════ */}
          <div className="rounded-3xl bg-[#090d16]/90 border border-white/10 hover:border-emerald-500/40 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between shadow-[0_20px_45px_rgba(0,0,0,0.6)] group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <CreditCard className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  0% комиссии сервиса
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white font-serif">
                  Онлайн-оплата, СБП и T-Pay
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                  Прямой эквайринг (ЮKassa, Т-Банк, СБП). Деньги с каждого заказа мгновенно зачисляются на ваш расчетный счет.
                </p>
              </div>
            </div>

            {/* Interactive Widget: Payment Selector */}
            <div className="mt-6 pt-5 border-t border-white/5">
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Сумма чека:</span>
                  <span className="font-serif font-bold text-base text-white">2 850 ₽</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => setActivePayment('sbp')}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex flex-col items-center gap-1 border ${
                      activePayment === 'sbp'
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/10'
                        : 'bg-white/[0.03] border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>СБП (QR)</span>
                  </button>

                  <button
                    onClick={() => setActivePayment('tbank')}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex flex-col items-center gap-1 border ${
                      activePayment === 'tbank'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
                        : 'bg-white/[0.03] border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>T-Pay</span>
                  </button>

                  <button
                    onClick={() => setActivePayment('card')}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex flex-col items-center gap-1 border ${
                      activePayment === 'card'
                        ? 'bg-blue-500/20 border-blue-400 text-blue-300 shadow-md shadow-blue-500/10'
                        : 'bg-white/[0.03] border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Карты РФ</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px]">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span className="truncate">
                    {activePayment === 'sbp' && 'Оплата через СБП 0.7% • Деньги на р/с'}
                    {activePayment === 'tbank' && 'Оплата в 1 тап T-Pay • 0 секунд задержки'}
                    {activePayment === 'card' && 'МИР, Visa, Mastercard • Авточек 54-ФЗ'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              CARD 3: ПРОГРАММА ЛОЯЛЬНОСТИ И КАРТА ГОСТЯ
          ═══════════════════════════════════════════════════════════ */}
          <div className="rounded-3xl bg-[#090d16]/90 border border-white/10 hover:border-amber-500/40 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between shadow-[0_20px_45px_rgba(0,0,0,0.6)] group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <Gift className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  LTV и повторные визиты
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white font-serif">
                  Умная программа лояльности
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                  Автоматический кешбэк баллами, грейды гостей и подарки за первый заказ. Гости не уходят к конкурентам.
                </p>
              </div>
            </div>

            {/* Interactive Widget: Wallet Card Simulation */}
            <div className="mt-6 pt-5 border-t border-white/5">
              <div className="space-y-2.5">
                {/* Tier Switcher */}
                <div className="flex items-center justify-between gap-1 p-1 rounded-xl bg-black/50 border border-white/10">
                  <button
                    onClick={() => setActiveTier('bronze')}
                    className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                      activeTier === 'bronze'
                        ? 'bg-amber-900/60 text-amber-200 border border-amber-700/50'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Bronze 5%
                  </button>
                  <button
                    onClick={() => setActiveTier('silver')}
                    className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                      activeTier === 'silver'
                        ? 'bg-slate-700/80 text-white border border-slate-500/50'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Silver 7%
                  </button>
                  <button
                    onClick={() => setActiveTier('gold')}
                    className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                      activeTier === 'gold'
                        ? 'bg-amber-500/30 text-amber-300 border border-amber-400/60'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Gold 10%
                  </button>
                </div>

                {/* Simulated Digital Card */}
                <motion.div
                  layout
                  className={`p-3.5 rounded-2xl border transition-all duration-300 ${
                    activeTier === 'bronze'
                      ? 'bg-gradient-to-br from-amber-950/70 via-stone-900 to-black border-amber-700/40 text-amber-200'
                      : activeTier === 'silver'
                      ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-black border-slate-500/40 text-slate-100'
                      : 'bg-gradient-to-br from-amber-600/30 via-[#181108] to-black border-amber-400/50 text-amber-100 shadow-[0_8px_25px_rgba(245,158,11,0.15)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[11px] font-bold tracking-wider uppercase">
                        {activeTier.toUpperCase()} GUEST
                      </span>
                    </div>
                    <span className="text-[10px] font-mono opacity-70">ID: 884-219</span>
                  </div>

                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] opacity-70">Бонусный баланс:</p>
                      <p className="text-base font-black font-serif">
                        {activeTier === 'bronze' && '450 бонусов'}
                        {activeTier === 'silver' && '1 890 бонусов'}
                        {activeTier === 'gold' && '4 750 бонусов'}
                      </p>
                    </div>
                    <div className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/40 border border-white/10">
                      Списание 100%
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              CARD 4: МОДИФИКАТОРЫ БЛЮД И КОНСТРУКТОР
          ═══════════════════════════════════════════════════════════ */}
          <div className="rounded-3xl bg-[#090d16]/90 border border-white/10 hover:border-blue-500/40 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between shadow-[0_20px_45px_rgba(0,0,0,0.6)] group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  +18% к среднему чеку
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white font-serif">
                  Умные модификаторы и комбо
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                  Прожарка, выбор молока, добавление соусов, сыра и топпингов с моментальным пересчетом стоимости блюда.
                </p>
              </div>
            </div>

            {/* Interactive Widget: Dish Customizer */}
            <div className="mt-6 pt-5 border-t border-white/5">
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Стейк Рибай Black Angus</span>
                  <span className="text-xs font-serif font-black text-amber-400">
                    {calculatedPrice} ₽
                  </span>
                </div>

                {/* Doneness Pills */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400">Прожарка мяса:</span>
                  <div className="grid grid-cols-3 gap-1">
                    {(['medium-rare', 'medium', 'well-done'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setDoneness(lvl)}
                        className={`py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer border ${
                          doneness === lvl
                            ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                            : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {lvl === 'medium-rare' && 'Medium Rare'}
                        {lvl === 'medium' && 'Medium'}
                        {lvl === 'well-done' && 'Well Done'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Extra toppings */}
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => setExtraTruffle(!extraTruffle)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer border flex items-center justify-between ${
                      extraTruffle
                        ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                        : 'bg-white/[0.02] border-white/5 text-slate-400'
                    }`}
                  >
                    <span>+ Трюфельное масло</span>
                    <span className="opacity-80">+180 ₽</span>
                  </button>

                  <button
                    onClick={() => setExtraPepperSauce(!extraPepperSauce)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer border flex items-center justify-between ${
                      extraPepperSauce
                        ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                        : 'bg-white/[0.02] border-white/5 text-slate-400'
                    }`}
                  >
                    <span>+ Перечный соус</span>
                    <span className="opacity-80">+120 ₽</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              CARD 5: БЕСПЛАТНЫЕ PUSH-УВЕДОМЛЕНИЯ
          ═══════════════════════════════════════════════════════════ */}
          <div className="rounded-3xl bg-[#090d16]/90 border border-white/10 hover:border-pink-500/40 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between shadow-[0_20px_45px_rgba(0,0,0,0.6)] group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform">
                  <Bell className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20">
                  0 ₽ затрат на SMS
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white font-serif">
                  Бесплатные Push-уведомления
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                  Статус кухни, готовность заказа, вечерние акции в часы спада — мгновенно на экран телефона гостя.
                </p>
              </div>
            </div>

            {/* Interactive Widget: Live iOS Push Notification */}
            <div className="mt-6 pt-5 border-t border-white/5">
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                {/* Push preset triggers */}
                <div className="flex items-center justify-between gap-1 text-[10px]">
                  <button
                    onClick={() => setActivePush('status')}
                    className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      activePush === 'status'
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Готовность
                  </button>
                  <button
                    onClick={() => setActivePush('promo')}
                    className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      activePush === 'promo'
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Акция 1+1
                  </button>
                  <button
                    onClick={() => setActivePush('bonus')}
                    className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      activePush === 'bonus'
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Бонусы
                  </button>
                </div>

                {/* Simulated iOS Banner */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePush}
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="p-3 rounded-xl bg-slate-900/90 border border-white/10 shadow-lg flex items-start gap-2.5"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-xs shrink-0 mt-0.5">
                      P
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-slate-200">Porto Bar • Сейчас</span>
                        <span className="text-slate-500">push</span>
                      </div>
                      <p className="text-[11px] text-white font-medium mt-0.5 leading-snug">
                        {activePush === 'status' && '👨‍🍳 Шеф начал готовить ваш заказ #148. Доставка через 25 минут!'}
                        {activePush === 'promo' && '🍕 Счастливые часы! Закажите 2 римские пиццы и получите напиток в подарок.'}
                        {activePush === 'bonus' && '🎁 Вам начислено 350 бонусов за прошлый визит! Спишите их сегодня.'}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              CARD 6: ДАШБОРД И АНАЛИТИКА + СТОП-ЛИСТ
          ═══════════════════════════════════════════════════════════ */}
          <div className="rounded-3xl bg-[#090d16]/90 border border-white/10 hover:border-orange-500/40 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between shadow-[0_20px_45px_rgba(0,0,0,0.6)] group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/20">
                  Контроль 24/7
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white font-serif">
                  Дашборд, аналитика и стоп-лист
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                  Выручка онлайн, популярные позиции, средний чек и управление наличием блюд в один клик без звонков в поддержку.
                </p>
              </div>
            </div>

            {/* Interactive Widget: Live Metrics & Stop-list toggle */}
            <div className="mt-6 pt-5 border-t border-white/5">
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                {/* Metric counters */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="text-[10px] text-slate-400">Выручка за сегодня</p>
                    <p className="text-sm font-black font-serif text-white mt-0.5">184 600 ₽</p>
                    <span className="text-[9px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
                      <TrendingUp className="w-2.5 h-2.5" /> +24% к прошлой неделе
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="text-[10px] text-slate-400">Средний чек / Заказы</p>
                    <p className="text-sm font-black font-serif text-white mt-0.5">3 420 ₽ <span className="text-xs font-normal text-slate-400 font-sans">/ 54</span></p>
                    <span className="text-[9px] text-amber-400 mt-0.5 block">
                      Маржа 100% ваша
                    </span>
                  </div>
                </div>

                {/* Stop list quick toggle */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-slate-200 truncate">Лосось на гриле</p>
                    <p className="text-[10px] text-slate-400">
                      {inStopList ? 'Блюдо скрыто из меню' : 'Доступно к заказу'}
                    </p>
                  </div>

                  <button
                    onClick={() => setInStopList(!inStopList)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer border ${
                      inStopList
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    }`}
                  >
                    {inStopList ? 'В стоп-листе' : 'В наличии'}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom trust banner */}
        <div className="mt-14 sm:mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-[#0d1322] to-amber-500/10 border border-amber-500/20 text-center max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-1">
            <h4 className="text-lg sm:text-xl font-bold font-serif text-white">
              Хотите протестировать эти функции вживую на вашем меню?
            </h4>
            <p className="text-xs sm:text-sm text-slate-400">
              Соберем тестовое PWA-приложение для вашего ресторана за 24 часа без предоплаты.
            </p>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('lead-form');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-sm hover:from-amber-400 hover:to-amber-300 shadow-lg shadow-amber-500/20 transition-all cursor-pointer shrink-0 flex items-center gap-2"
          >
            <span>Получить демо бесплатно</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
