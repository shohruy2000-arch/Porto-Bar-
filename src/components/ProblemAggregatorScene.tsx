'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Percent, Users, Database } from 'lucide-react';

export function ProblemAggregatorScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure scroll progress through the 250vh sticky track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Soft spring for buttery smooth, natural scroll response
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    restDelta: 0.001
  });

  /* ─────────────────────────────────────────────────────────────
     1. PARALLAX DEPTHS
  ───────────────────────────────────────────────────────────────*/
  const bgScale = useTransform(smoothProgress, [0, 1], [1.02, 1.07]);
  const bgX = useTransform(smoothProgress, [0, 1], ['0%', '-2%']);
  const bgY = useTransform(smoothProgress, [0, 1], ['0%', '1.5%']);

  const phoneScale = useTransform(smoothProgress, [0.35, 0.9], [0.96, 1.04]);
  const phoneGlowOpacity = useTransform(smoothProgress, [0.3, 0.85], [0.3, 0.85]);
  const vortexRotate = useTransform(smoothProgress, [0, 1], [0, 10]);

  const calloutOpacity = useTransform(smoothProgress, [0.65, 0.85], [0, 1]);
  const calloutScale = useTransform(smoothProgress, [0.65, 0.85], [0.85, 1]);
  const calloutY = useTransform(smoothProgress, [0.65, 0.85], [10, 0]);

  /* ─────────────────────────────────────────────────────────────
     2. HEADLINE & DESCRIPTION (Staggered Entrance)
  ───────────────────────────────────────────────────────────────*/
  const line1Y = useTransform(smoothProgress, [0.04, 0.18], [24, 0]);
  const line1Opacity = useTransform(smoothProgress, [0.04, 0.18], [0, 1]);

  const line2Y = useTransform(smoothProgress, [0.12, 0.26], [24, 0]);
  const line2Opacity = useTransform(smoothProgress, [0.12, 0.26], [0, 1]);

  const line3Y = useTransform(smoothProgress, [0.20, 0.35], [26, 0]);
  const line3Opacity = useTransform(smoothProgress, [0.20, 0.35], [0, 1]);
  const line3Scale = useTransform(smoothProgress, [0.20, 0.35], [0.96, 1]);

  const descY = useTransform(smoothProgress, [0.28, 0.42], [18, 0]);
  const descOpacity = useTransform(smoothProgress, [0.28, 0.42], [0, 0.9]);

  /* ─────────────────────────────────────────────────────────────
     3. THREE GLASS CARDS (Sequential Reveal)
  ───────────────────────────────────────────────────────────────*/
  const card1Opacity = useTransform(smoothProgress, [0.42, 0.54], [0, 1]);
  const card1Y = useTransform(smoothProgress, [0.42, 0.54], [22, 0]);
  const card1Scale = useTransform(smoothProgress, [0.42, 0.54], [0.94, 1]);

  const card2Opacity = useTransform(smoothProgress, [0.52, 0.64], [0, 1]);
  const card2Y = useTransform(smoothProgress, [0.52, 0.64], [22, 0]);
  const card2Scale = useTransform(smoothProgress, [0.52, 0.64], [0.94, 1]);

  const card3Opacity = useTransform(smoothProgress, [0.62, 0.74], [0, 1]);
  const card3Y = useTransform(smoothProgress, [0.62, 0.74], [22, 0]);
  const card3Scale = useTransform(smoothProgress, [0.62, 0.74], [0.94, 1]);

  /* ─────────────────────────────────────────────────────────────
     4. PHYSICAL MONEY STREAM
  ───────────────────────────────────────────────────────────────*/
  const bill1X = useTransform(smoothProgress, [0.15, 0.85], ['0px', '220px']);
  const bill1Y = useTransform(smoothProgress, [0.15, 0.85], ['0px', '-110px']);
  const bill1Rotate = useTransform(smoothProgress, [0.15, 0.85], [-12, 38]);
  const bill1Scale = useTransform(smoothProgress, [0.15, 0.85], [1.0, 0.78]);

  const bill2X = useTransform(smoothProgress, [0.20, 0.90], ['0px', '260px']);
  const bill2Y = useTransform(smoothProgress, [0.20, 0.90], ['0px', '75px']);
  const bill2Rotate = useTransform(smoothProgress, [0.20, 0.90], [18, 72]);
  const bill2Scale = useTransform(smoothProgress, [0.20, 0.90], [0.92, 0.60]);

  const bill3X = useTransform(smoothProgress, [0.25, 0.95], ['0px', '210px']);
  const bill3Y = useTransform(smoothProgress, [0.25, 0.95], ['0px', '-40px']);
  const bill3Rotate = useTransform(smoothProgress, [0.25, 0.95], [-24, 45]);
  const bill3Scale = useTransform(smoothProgress, [0.25, 0.95], [0.85, 0.52]);

  const bill4X = useTransform(smoothProgress, [0.35, 1.0], ['0px', '140px']);
  const bill4Y = useTransform(smoothProgress, [0.35, 1.0], ['0px', '25px']);
  const bill4Rotate = useTransform(smoothProgress, [0.35, 1.0], [45, 110]);
  const bill4Scale = useTransform(smoothProgress, [0.35, 1.0], [0.70, 0.38]);

  const bill5X = useTransform(smoothProgress, [0.45, 1.0], ['0px', '90px']);
  const bill5Y = useTransform(smoothProgress, [0.45, 1.0], ['0px', '-10px']);
  const bill5Opacity = useTransform(smoothProgress, [0.80, 0.98], [1, 0.35]);

  return (
    <section ref={containerRef} className="relative h-[230vh] bg-[#050811] text-white">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center select-none">
        
        {/* DEPTH 1: Background Restaurant Plate */}
        <motion.div
          style={{ scale: bgScale, x: bgX, y: bgY }}
          className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
        >
          <img
            src="/images/restaurant-problem-bg.jpg"
            alt="Ресторанный зал и утечка прибыли"
            className="w-full h-full object-cover object-center brightness-[0.92] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/15 to-black/55 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-[#050811]/70 pointer-events-none" />
        </motion.div>

        {/* DEPTH 2: Dark Vortex Aura & Aggregator Glow */}
        <motion.div
          style={{ scale: phoneScale }}
          className="absolute right-[4%] sm:right-[7%] lg:right-[10%] top-[22%] w-[260px] sm:w-[340px] lg:w-[420px] h-[360px] sm:h-[480px] lg:h-[560px] pointer-events-none z-10 will-change-transform"
        >
          <motion.div
            style={{ opacity: phoneGlowOpacity, rotate: vortexRotate }}
            className="absolute inset-0 rounded-full blur-3xl bg-gradient-to-tr from-orange-500/20 via-amber-600/10 to-transparent pointer-events-none"
          />

          <motion.div
            style={{ opacity: calloutOpacity, scale: calloutScale, y: calloutY }}
            className="absolute -top-6 -left-12 sm:-left-20 flex items-center gap-2 pointer-events-none z-30"
          >
            <div className="flex flex-col items-start">
              <span className="font-serif font-black text-amber-400 text-sm sm:text-base tracking-wider drop-shadow-md">
                25–35%
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest -mt-1">
                комиссия
              </span>
            </div>
            <svg className="w-14 sm:w-20 h-8 stroke-amber-400/70" fill="none" viewBox="0 0 80 32">
              <path d="M 0 16 L 45 16 L 75 30" strokeWidth="1.5" strokeDasharray="3 2" />
              <circle cx="75" cy="30" r="2.5" fill="#f59e0b" />
            </svg>
          </motion.div>
        </motion.div>

        {/* DEPTH 3: Physical Money Stream */}
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          <motion.div
            style={{ x: bill1X, y: bill1Y, rotate: bill1Rotate, scale: bill1Scale }}
            className="absolute left-[45%] sm:left-[48%] top-[65%] sm:top-[68%] w-32 sm:w-44 will-change-transform"
          >
            <motion.div
              animate={{ y: [0, -7, 0], rotate: [0, 2.5, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img
                src="/images/ruble-bill-1.png"
                alt="5000 рублей"
                className="w-full h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)] filter brightness-95 contrast-105"
              />
            </motion.div>
          </motion.div>

          <motion.div
            style={{ x: bill2X, y: bill2Y, rotate: bill2Rotate, scale: bill2Scale }}
            className="absolute left-[42%] sm:left-[45%] top-[10%] sm:top-[14%] w-28 sm:w-36 will-change-transform"
          >
            <motion.div
              animate={{ y: [0, 8, 0], rotate: [0, -3.5, 0] }}
              transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            >
              <img
                src="/images/ruble-bill-1.png"
                alt="5000 рублей в воздухе"
                className="w-full h-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] filter brightness-90 -rotate-12"
              />
            </motion.div>
          </motion.div>

          <motion.div
            style={{ x: bill3X, y: bill3Y, rotate: bill3Rotate, scale: bill3Scale }}
            className="absolute left-[54%] sm:left-[56%] top-[38%] sm:top-[40%] w-24 sm:w-32 will-change-transform"
          >
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [0, 3, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            >
              <img
                src="/images/ruble-bill-1.png"
                alt="Купюра в воронке"
                className="w-full h-auto drop-shadow-[0_12px_20px_rgba(0,0,0,0.8)] filter brightness-85 rotate-45"
              />
            </motion.div>
          </motion.div>

          <motion.div
            style={{ x: bill4X, y: bill4Y, rotate: bill4Rotate, scale: bill4Scale }}
            className="absolute left-[66%] sm:left-[68%] top-[45%] sm:top-[46%] w-20 sm:w-26 will-change-transform"
          >
            <motion.div
              animate={{ y: [0, 5, 0], rotate: [0, -2, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            >
              <img
                src="/images/ruble-bill-1.png"
                alt="Купюра у экрана"
                className="w-full h-auto drop-shadow-[0_8px_15px_rgba(0,0,0,0.7)] filter brightness-75 rotate-90"
              />
            </motion.div>
          </motion.div>

          <motion.div
            style={{ x: bill5X, y: bill5Y, opacity: bill5Opacity }}
            className="absolute left-[78%] top-[52%] w-14 sm:w-18 will-change-transform"
          >
            <motion.div
              animate={{ y: [0, -3, 0], rotate: [0, 4, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 2.1 }}
            >
              <img
                src="/images/ruble-bill-1.png"
                alt="Купюра в портале"
                className="w-full h-auto drop-shadow-md filter brightness-65 rotate-[120deg]"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* DEPTH 4: Headline, Description & 3 Glass Cards */}
        <div className="relative z-30 max-w-7xl w-full mx-auto px-5 sm:px-8 lg:px-12 flex flex-col justify-between h-[85vh] sm:h-[82vh] pointer-events-none">
          
          <div className="max-w-xl lg:max-w-2xl space-y-4 sm:space-y-6 pt-4 sm:pt-6">
            <div className="space-y-1 sm:space-y-2 overflow-hidden">
              <div className="overflow-hidden">
                <motion.h2
                  style={{ y: line1Y, opacity: line1Opacity }}
                  className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white leading-[1.08] will-change-transform"
                >
                  Почему агрегаторы
                </motion.h2>
              </div>

              <div className="overflow-hidden">
                <motion.h2
                  style={{ y: line2Y, opacity: line2Opacity }}
                  className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white leading-[1.08] will-change-transform"
                >
                  съедают вашу
                </motion.h2>
              </div>

              <div className="overflow-hidden">
                <motion.h2
                  style={{ y: line3Y, opacity: line3Opacity, scale: line3Scale }}
                  className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-[1.08] bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_4px_25px_rgba(245,158,11,0.35)] will-change-transform origin-left"
                >
                  чистую прибыль?
                </motion.h2>
              </div>
            </div>

            <motion.p
              style={{ y: descY, opacity: descOpacity }}
              className="text-sm sm:text-base lg:text-lg text-slate-300 font-light leading-relaxed max-w-lg will-change-transform"
            >
              Работая только через Яндекс Еду и Маркет, вы отдаете львиную долю маржи и отдаете своих постоянных гостей.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5 max-w-2xl pb-4 sm:pb-8 pointer-events-auto">
            <motion.div
              style={{ opacity: card1Opacity, y: card1Y, scale: card1Scale }}
              className="p-3.5 sm:p-4 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/10 hover:border-amber-500/40 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.6)] group will-change-transform flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Percent className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-serif font-black text-white leading-tight">
                  25–35%
                </p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  комиссия
                </p>
              </div>
            </motion.div>

            <motion.div
              style={{ opacity: card2Opacity, y: card2Y, scale: card2Scale }}
              className="p-3.5 sm:p-4 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/10 hover:border-amber-500/40 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.6)] group will-change-transform flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-serif font-black text-white leading-tight">
                  Клиенты —
                </p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  не ваши
                </p>
              </div>
            </motion.div>

            <motion.div
              style={{ opacity: card3Opacity, y: card3Y, scale: card3Scale }}
              className="p-3.5 sm:p-4 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/10 hover:border-amber-500/40 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.6)] group will-change-transform flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Database className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-serif font-black text-white leading-tight">
                  Нет данных
                </p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  о гостях
                </p>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}

