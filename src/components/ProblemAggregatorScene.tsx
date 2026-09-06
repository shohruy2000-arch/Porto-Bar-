'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Percent, Users, Database } from 'lucide-react';

export function ProblemAggregatorScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 260vh sticky track for deep, unhurried cinematic pacing
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Balanced spring physics: dignified inertia, smooth deceleration, zero jitter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 26,
    mass: 0.8,
    restDelta: 0.0005,
  });

  /* ─────────────────────────────────────────────────────────────
     1. PARALLAX CAMERA & SCENE DEPTH
  ───────────────────────────────────────────────────────────────*/
  const bgScale = useTransform(smoothProgress, [0, 1], [1.01, 1.07]);
  const bgX = useTransform(smoothProgress, [0, 1], ['0%', '-2%']);
  const bgY = useTransform(smoothProgress, [0, 1], ['0%', '1.5%']);

  // Aggregator phone scale and vortex rotation
  const phoneScale = useTransform(smoothProgress, [0.2, 0.85], [0.97, 1.05]);
  const phoneGlowOpacity = useTransform(smoothProgress, [0.2, 0.85], [0.35, 0.9]);
  const vortexRotate = useTransform(smoothProgress, [0, 1], [0, 16]);

  // Golden pointer callout line («25–35% комиссия») - Desktop only
  const calloutOpacity = useTransform(smoothProgress, [0.6, 0.85], [0, 1]);
  const calloutScale = useTransform(smoothProgress, [0.6, 0.85], [0.85, 1]);
  const calloutY = useTransform(smoothProgress, [0.6, 0.85], [14, 0]);

  /* ─────────────────────────────────────────────────────────────
     2. HEADLINE & DESCRIPTION (Staggered Cinematic Entrance)
  ───────────────────────────────────────────────────────────────*/
  // Safe top padding prevents any navbar overlap (Act 1: 0.02 - 0.35)
  const line1Y = useTransform(smoothProgress, [0.03, 0.16], [32, 0]);
  const line1Opacity = useTransform(smoothProgress, [0.03, 0.16], [0, 1]);

  const line2Y = useTransform(smoothProgress, [0.1, 0.24], [32, 0]);
  const line2Opacity = useTransform(smoothProgress, [0.1, 0.24], [0, 1]);

  const line3Y = useTransform(smoothProgress, [0.18, 0.34], [34, 0]);
  const line3Opacity = useTransform(smoothProgress, [0.18, 0.34], [0, 1]);
  const line3Scale = useTransform(smoothProgress, [0.18, 0.34], [0.94, 1]);

  const descY = useTransform(smoothProgress, [0.26, 0.42], [22, 0]);
  const descOpacity = useTransform(smoothProgress, [0.26, 0.42], [0, 0.95]);

  /* ─────────────────────────────────────────────────────────────
     3. THREE LUXURY OBSIDIAN-GOLD CARDS (Sequential Reveal)
  ───────────────────────────────────────────────────────────────*/
  const card1Opacity = useTransform(smoothProgress, [0.44, 0.58], [0, 1]);
  const card1Y = useTransform(smoothProgress, [0.44, 0.58], [24, 0]);
  const card1Scale = useTransform(smoothProgress, [0.44, 0.58], [0.92, 1]);

  const card2Opacity = useTransform(smoothProgress, [0.54, 0.68], [0, 1]);
  const card2Y = useTransform(smoothProgress, [0.54, 0.68], [24, 0]);
  const card2Scale = useTransform(smoothProgress, [0.54, 0.68], [0.92, 1]);

  const card3Opacity = useTransform(smoothProgress, [0.64, 0.78], [0, 1]);
  const card3Y = useTransform(smoothProgress, [0.64, 0.78], [24, 0]);
  const card3Scale = useTransform(smoothProgress, [0.64, 0.78], [0.92, 1]);

  /* ─────────────────────────────────────────────────────────────
     4. PHYSICAL 3D MONEY STREAM (Emerges on scroll, zero static clones)
  ───────────────────────────────────────────────────────────────*/
  // Banknote 1: Forefront note lifting from the dark wooden table towards the vortex
  const b1Progress = [0.14, 0.68];
  const b1X = useTransform(smoothProgress, b1Progress, ['0px', '260px']);
  const b1Y = useTransform(smoothProgress, b1Progress, ['0px', '-140px']);
  const b1RotateZ = useTransform(smoothProgress, b1Progress, [-8, 48]);
  const b1RotateX = useTransform(smoothProgress, b1Progress, [0, 45]);
  const b1Scale = useTransform(smoothProgress, b1Progress, [1.0, 0.45]);
  const b1Opacity = useTransform(smoothProgress, [0.14, 0.22, 0.6, 0.68], [0, 1, 0.9, 0]);

  // Banknote 2: High soaring note sweeping across upper air currents
  const b2Progress = [0.24, 0.78];
  const b2X = useTransform(smoothProgress, b2Progress, ['0px', '310px']);
  const b2Y = useTransform(smoothProgress, b2Progress, ['0px', '95px']);
  const b2RotateZ = useTransform(smoothProgress, b2Progress, [15, 82]);
  const b2RotateY = useTransform(smoothProgress, b2Progress, [0, -40]);
  const b2Scale = useTransform(smoothProgress, b2Progress, [0.88, 0.38]);
  const b2Opacity = useTransform(smoothProgress, [0.24, 0.32, 0.7, 0.78], [0, 1, 0.85, 0]);

  // Banknote 3: Spiraling note curving along the glossy dark vortex
  const b3Progress = [0.34, 0.88];
  const b3X = useTransform(smoothProgress, b3Progress, ['0px', '240px']);
  const b3Y = useTransform(smoothProgress, b3Progress, ['0px', '-50px']);
  const b3RotateZ = useTransform(smoothProgress, b3Progress, [-20, 58]);
  const b3RotateX = useTransform(smoothProgress, b3Progress, [10, 70]);
  const b3Scale = useTransform(smoothProgress, b3Progress, [0.78, 0.32]);
  const b3Opacity = useTransform(smoothProgress, [0.34, 0.42, 0.8, 0.88], [0, 1, 0.8, 0]);

  // Banknote 4: Deep funnel note accelerating straight into the glowing tablet screen
  const b4Progress = [0.44, 0.94];
  const b4X = useTransform(smoothProgress, b4Progress, ['0px', '160px']);
  const b4Y = useTransform(smoothProgress, b4Progress, ['0px', '30px']);
  const b4RotateZ = useTransform(smoothProgress, b4Progress, [35, 120]);
  const b4Scale = useTransform(smoothProgress, b4Progress, [0.65, 0.22]);
  const b4Opacity = useTransform(smoothProgress, [0.44, 0.52, 0.86, 0.94], [0, 1, 0.7, 0]);

  return (
    <section ref={containerRef} className="relative h-[260vh] bg-[#050811] text-white">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center select-none">
        
        {/* ──────────────────────────────────────────────────────────
            DEPTH 1: ATMOSPHERIC RESTAURANT PLATE
        ───────────────────────────────────────────────────────────*/}
        <motion.div
          style={{ scale: bgScale, x: bgX, y: bgY }}
          className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
        >
          <img
            src="/images/restaurant-problem-bg.jpg"
            alt="Ресторанный зал и утечка прибыли в агрегаторы"
            className="w-full h-full object-cover object-[72%_center] sm:object-center brightness-[0.94] contrast-[1.04]"
          />

          {/* Left-side protective gradient: ensures 100% typography contrast, never clipped */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 sm:via-black/35 to-black/60 pointer-events-none" />
          {/* Vertical top & bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-[#050811]/85 pointer-events-none" />

          {/* Candle Warm Ambient Light (Breathes gently in sync with restaurant candle) */}
          <motion.div
            animate={{
              opacity: [0.35, 0.65, 0.42, 0.6],
              scale: [0.96, 1.08, 0.98, 1.04],
            }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-[44%] sm:left-[47%] top-[68%] sm:top-[72%] w-48 h-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/20 blur-3xl pointer-events-none"
          />
        </motion.div>

        {/* ──────────────────────────────────────────────────────────
            DEPTH 2: AGGREGATOR VORTEX & CALLOUT POINTER
        ───────────────────────────────────────────────────────────*/}
        <motion.div
          style={{ scale: phoneScale }}
          className="absolute right-[2%] sm:right-[6%] lg:right-[9%] top-[18%] sm:top-[22%] w-[270px] sm:w-[350px] lg:w-[440px] h-[380px] sm:h-[500px] lg:h-[580px] pointer-events-none z-10 will-change-transform"
        >
          {/* Living Cyber-Glow of the Aggregator Device */}
          <motion.div
            style={{ opacity: phoneGlowOpacity }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.4, 0.65, 0.4],
            }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full blur-3xl bg-gradient-to-tr from-cyan-500/20 via-amber-500/15 to-orange-600/25 pointer-events-none"
          />

          {/* Swirling energy aura */}
          <motion.div
            style={{ rotate: vortexRotate }}
            className="absolute inset-[-10%] rounded-full border border-amber-500/10 pointer-events-none opacity-40 blur-[1px]"
          />

          {/* Elegant Callout Pointer Line matching reference photo (Hidden on mobile to keep clean) */}
          <motion.div
            style={{ opacity: calloutOpacity, scale: calloutScale, y: calloutY }}
            className="absolute -top-7 -left-20 sm:-left-24 hidden sm:flex items-center gap-2 pointer-events-none z-30"
          >
            <div className="flex flex-col items-start bg-black/75 px-3 py-1.5 rounded-lg border border-amber-400/30 backdrop-blur-md shadow-lg">
              <span className="font-serif font-black text-amber-400 text-sm sm:text-base tracking-wider drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
                25–35%
              </span>
              <span className="text-[10px] font-bold text-amber-200/85 uppercase tracking-widest -mt-0.5">
                комиссия
              </span>
            </div>

            {/* Angled Golden Vector Line with Target Pin */}
            <svg className="w-16 sm:w-24 h-10 stroke-amber-400/85" fill="none" viewBox="0 0 96 40">
              <path d="M 0 18 L 52 18 L 88 34" strokeWidth="1.5" strokeDasharray="3 2" />
              <circle cx="88" cy="34" r="3" fill="#f59e0b" className="animate-pulse" />
            </svg>
          </motion.div>
        </motion.div>

        {/* ──────────────────────────────────────────────────────────
            DEPTH 3: PHYSICAL 3D BANKNOTE STREAM (Zero text overlap)
        ───────────────────────────────────────────────────────────*/}
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden [perspective:1200px]">
          {/* Bill 1: Foreground table liftoff */}
          <motion.div
            style={{
              x: b1X,
              y: b1Y,
              rotateZ: b1RotateZ,
              rotateX: b1RotateX,
              scale: b1Scale,
              opacity: b1Opacity,
            }}
            className="absolute left-[48%] sm:left-[50%] top-[64%] sm:top-[66%] w-32 sm:w-44 will-change-transform"
          >
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img
                src="/images/ruble-bill-1.png"
                alt="5000 рублей на столе"
                className="w-full h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] filter brightness-95 contrast-105"
              />
            </motion.div>
          </motion.div>

          {/* Bill 2: High soaring note */}
          <motion.div
            style={{
              x: b2X,
              y: b2Y,
              rotateZ: b2RotateZ,
              rotateY: b2RotateY,
              scale: b2Scale,
              opacity: b2Opacity,
            }}
            className="absolute left-[46%] sm:left-[49%] top-[12%] sm:top-[16%] w-28 sm:w-36 will-change-transform"
          >
            <motion.div
              animate={{ y: [0, 8, 0], rotate: [0, -3, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
            >
              <img
                src="/images/ruble-bill-1.png"
                alt="5000 рублей в воздухе"
                className="w-full h-auto drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] filter brightness-90 contrast-105"
              />
            </motion.div>
          </motion.div>

          {/* Bill 3: Mid-vortex suction */}
          <motion.div
            style={{
              x: b3X,
              y: b3Y,
              rotateZ: b3RotateZ,
              rotateX: b3RotateX,
              scale: b3Scale,
              opacity: b3Opacity,
            }}
            className="absolute left-[56%] sm:left-[58%] top-[36%] sm:top-[38%] w-24 sm:w-32 will-change-transform"
          >
            <motion.div
              animate={{ y: [0, -5, 0], rotate: [0, 3, 0] }}
              transition={{ duration: 4.0, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
            >
              <img
                src="/images/ruble-bill-1.png"
                alt="Купюра в воронке"
                className="w-full h-auto drop-shadow-[0_12px_22px_rgba(0,0,0,0.85)] filter brightness-85 blur-[0.4px]"
              />
            </motion.div>
          </motion.div>

          {/* Bill 4: Screen portal entry */}
          <motion.div
            style={{
              x: b4X,
              y: b4Y,
              rotateZ: b4RotateZ,
              scale: b4Scale,
              opacity: b4Opacity,
            }}
            className="absolute left-[68%] sm:left-[70%] top-[43%] sm:top-[44%] w-18 sm:w-24 will-change-transform"
          >
            <motion.div
              animate={{ y: [0, 4, 0], rotate: [0, -2, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            >
              <img
                src="/images/ruble-bill-1.png"
                alt="Купюра у экрана"
                className="w-full h-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] filter brightness-75 blur-[0.8px]"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* ──────────────────────────────────────────────────────────
            DEPTH 4: MONUMENTAL TYPOGRAPHY & 3 OBSIDIAN GLASS CARDS
        ───────────────────────────────────────────────────────────*/}
        <div className="relative z-30 max-w-7xl w-full mx-auto px-5 sm:px-8 lg:px-12 flex flex-col justify-between h-[82vh] sm:h-[84vh] pt-20 sm:pt-28 lg:pt-32 pb-6 sm:pb-10 pointer-events-none">
          
          {/* Main Headline Block (Guaranteed clean spacing below navbar) */}
          <div className="max-w-xl lg:max-w-2xl space-y-3 sm:space-y-5">
            <div className="space-y-0.5 sm:space-y-1 overflow-hidden">
              <div className="overflow-hidden">
                <motion.h2
                  style={{ y: line1Y, opacity: line1Opacity }}
                  className="text-2xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white leading-[1.1] will-change-transform"
                >
                  Почему агрегаторы
                </motion.h2>
              </div>

              <div className="overflow-hidden">
                <motion.h2
                  style={{ y: line2Y, opacity: line2Opacity }}
                  className="text-2xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white leading-[1.1] will-change-transform"
                >
                  съедают вашу
                </motion.h2>
              </div>

              <div className="overflow-hidden">
                <motion.h2
                  style={{ y: line3Y, opacity: line3Opacity, scale: line3Scale }}
                  className="text-2xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-[1.1] bg-gradient-to-r from-amber-400 via-[#ffd666] to-amber-500 bg-clip-text text-transparent drop-shadow-[0_4px_25px_rgba(245,158,11,0.4)] will-change-transform origin-left"
                >
                  чистую прибыль?
                </motion.h2>
              </div>
            </div>

            <motion.p
              style={{ y: descY, opacity: descOpacity }}
              className="text-xs sm:text-base lg:text-lg text-slate-300 font-light leading-relaxed max-w-md sm:max-w-lg will-change-transform drop-shadow-md"
            >
              Работая только через Яндекс Еду и Маркет, вы отдаете львиную долю маржи и отдаете своих постоянных гостей.
            </motion.p>
          </div>

          {/* Three Luxury Glassmorphic Cards (Exact Match to Reference Artwork) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-xl lg:max-w-2xl pointer-events-auto">
            
            {/* Card 1: 25-35% комиссия */}
            <motion.div
              style={{ opacity: card1Opacity, y: card1Y, scale: card1Scale }}
              className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#090d16]/90 sm:bg-[#090d16]/80 backdrop-blur-2xl border border-amber-500/30 hover:border-amber-400/50 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.7)] group will-change-transform flex flex-col items-start gap-1.5 sm:gap-2.5"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-amber-400/50 bg-amber-500/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Percent className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs sm:text-base font-serif font-black text-white leading-tight">
                  25–35%
                </p>
                <p className="text-[10px] sm:text-xs text-amber-200/80 font-medium mt-0.5">
                  комиссия
                </p>
              </div>
            </motion.div>

            {/* Card 2: Клиенты — не ваши */}
            <motion.div
              style={{ opacity: card2Opacity, y: card2Y, scale: card2Scale }}
              className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#090d16]/90 sm:bg-[#090d16]/80 backdrop-blur-2xl border border-amber-500/30 hover:border-amber-400/50 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.7)] group will-change-transform flex flex-col items-start gap-1.5 sm:gap-2.5"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-amber-400/50 bg-amber-500/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs sm:text-base font-serif font-black text-white leading-tight">
                  Клиенты —
                </p>
                <p className="text-[10px] sm:text-xs text-amber-200/80 font-medium mt-0.5">
                  не ваши
                </p>
              </div>
            </motion.div>

            {/* Card 3: Нет данных о гостях */}
            <motion.div
              style={{ opacity: card3Opacity, y: card3Y, scale: card3Scale }}
              className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#090d16]/90 sm:bg-[#090d16]/80 backdrop-blur-2xl border border-amber-500/30 hover:border-amber-400/50 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.7)] group will-change-transform flex flex-col items-start gap-1.5 sm:gap-2.5"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-amber-400/50 bg-amber-500/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Database className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs sm:text-base font-serif font-black text-white leading-tight">
                  Нет данных
                </p>
                <p className="text-[10px] sm:text-xs text-amber-200/80 font-medium mt-0.5">
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
