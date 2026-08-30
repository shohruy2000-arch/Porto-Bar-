'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Smartphone,
  Maximize2,
  ExternalLink,
  Star,
  Check,
  Zap,
  ShieldCheck,
  Send,
  Loader2,
  X,
  ChevronRight,
  Flame,
  Coffee,
  Wine,
} from 'lucide-react';

import { ShowcaseRestaurantData } from './types';
import { portoBarShowcase } from './data/portoBarShowcase';
import { brunchBistroShowcase } from './data/brunchBistroShowcase';
import { noirSteakhouseShowcase } from './data/noirSteakhouseShowcase';
import { sakuraOmakaseShowcase } from './data/sakuraOmakaseShowcase';
import { bellaMediterraneoShowcase } from './data/bellaMediterraneoShowcase';
import { tbilisiWineShowcase } from './data/tbilisiWineShowcase';

import { PortoBarMenuView } from './menus/PortoBarMenuView';
import { BrunchBistroMenuView } from './menus/BrunchBistroMenuView';
import { NoirSteakhouseMenuView } from './menus/NoirSteakhouseMenuView';
import { SakuraOmakaseMenuView } from './menus/SakuraOmakaseMenuView';
import { BellaMediterraneoMenuView } from './menus/BellaMediterraneoMenuView';
import { TbilisiWineMenuView } from './menus/TbilisiWineMenuView';

const SHOWCASE_LIST: {
  data: ShowcaseRestaurantData;
  emblem: string;
  badge: string;
  viewComponent: React.ComponentType<{ data: ShowcaseRestaurantData; isCompact?: boolean }>;
}[] = [
  {
    data: portoBarShowcase,
    emblem: '👑',
    badge: 'LUXURY FINE DINING',
    viewComponent: PortoBarMenuView,
  },
  {
    data: brunchBistroShowcase,
    emblem: '🥞',
    badge: 'NORDIC BOTANICAL',
    viewComponent: BrunchBistroMenuView,
  },
  {
    data: noirSteakhouseShowcase,
    emblem: '🥩',
    badge: 'SMOKEHOUSE & GRILL',
    viewComponent: NoirSteakhouseMenuView,
  },
  {
    data: sakuraOmakaseShowcase,
    emblem: '🌸',
    badge: 'TOKYO OMAKASE',
    viewComponent: SakuraOmakaseMenuView,
  },
  {
    data: bellaMediterraneoShowcase,
    emblem: '🍕',
    badge: 'ITALIAN TRATTORIA',
    viewComponent: BellaMediterraneoMenuView,
  },
  {
    data: tbilisiWineShowcase,
    emblem: '🍷',
    badge: 'GEORGIAN FEAST',
    viewComponent: TbilisiWineMenuView,
  },
];

export function DesignShowcaseGallery() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'mobile' | 'fullscreen'>('mobile');
  const [fullscreenModalOpen, setFullscreenModalOpen] = useState(false);

  // Lead modal state
  const [isOrderOpen, setIsOrderOpen] = useState(false);
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

  const currentShowcase = SHOWCASE_LIST[selectedIdx];
  const CurrentMenuComponent = currentShowcase.viewComponent;
  const currentData = currentShowcase.data;

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
          cuisineType: currentData.cuisine,
          preferredStyle: `${currentData.name} (${currentData.conceptTitle})`,
          comment: leadForm.comment,
          agree: leadForm.agree,
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Ошибка при отправке заявки');
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

  return (
    <section
      id="demo"
      className="relative py-16 lg:py-24 overflow-hidden select-none"
      style={{
        background: 'linear-gradient(180deg, #050810 0%, #080c16 50%, #050810 100%)',
      }}
    >
      {/* Ambient background glow matching current restaurant theme */}
      <div
        className="pointer-events-none absolute inset-0 -z-0 transition-all duration-700 opacity-60"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 30%, ${currentData.colors.primaryGlow} 0%, transparent 75%)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── SECTION HEADER ────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Международный Дизайн-Продакшн</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-white leading-tight">
            Примеры готовых работ <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
              наших UI/UX дизайнеров
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Посмотрите интерактивные примеры готовых меню. У нас работают ведущие дизайнеры из
            Италии, Швеции, Франции, Японии и Грузии — каждый стиль создаётся индивидуально под ДНК
            вашего ресторанного бренда.
          </p>
        </div>

        {/* ── RESTAURANT TABS (6 Concepts) ──────────────────────── */}
        <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none px-2">
          {SHOWCASE_LIST.map((item, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <button
                key={item.data.id}
                onClick={() => setSelectedIdx(idx)}
                className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer shrink-0 flex items-center space-x-2.5 border-2 ${
                  isSelected
                    ? 'scale-105 shadow-xl text-white'
                    : 'opacity-70 hover:opacity-100 hover:scale-102 hover:border-slate-500 text-slate-300'
                }`}
                style={{
                  backgroundColor: isSelected ? item.data.colors.surface : 'rgba(15,23,42,0.75)',
                  borderColor: isSelected ? item.data.colors.primary : 'rgba(255,255,255,0.12)',
                  boxShadow: isSelected
                    ? `0 0 24px ${item.data.colors.primaryGlow}, 0 6px 20px rgba(0,0,0,0.6)`
                    : 'none',
                }}
              >
                <span className="text-lg leading-none">{item.emblem}</span>
                <div className="text-left">
                  <div className="text-xs font-black tracking-tight whitespace-nowrap">
                    {item.data.name}
                  </div>
                  <div
                    className="text-[9px] font-medium tracking-wider uppercase opacity-80"
                    style={{ color: isSelected ? item.data.colors.primary : '#94a3b8' }}
                  >
                    {item.data.designer.location}
                  </div>
                </div>
                {isSelected && (
                  <span
                    className="w-2 h-2 rounded-full animate-pulse ml-1"
                    style={{ backgroundColor: item.data.colors.primary }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ── SHOWCASE MAIN STAGE: TWO-COLUMN / DEVICE SIMULATOR ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          {/* Left Column: Interactive Phone Device Frame (iPhone 16 Pro) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            {/* Device Container */}
            <div
              className="relative rounded-[48px] p-3 shadow-2xl border-4 flex flex-col items-center transition-all duration-500"
              style={{
                width: '100%',
                maxWidth: 345,
                height: 660,
                backgroundColor: '#05070c',
                borderColor: '#242b3d',
                boxShadow: `0 30px 80px rgba(0,0,0,0.95), 0 0 45px ${currentData.colors.primaryGlow}`,
              }}
            >
              {/* Internal Screen Bezel with Scrollable App */}
              <div className="relative w-full h-full rounded-[38px] overflow-hidden bg-black shadow-inner flex flex-col">
                {/* Dynamic Island Header Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 rounded-full bg-black z-40 flex items-center justify-between px-2.5 shadow-md pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#181d29]" />
                </div>

                {/* Live Interactive React Component for this concept */}
                <div className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-none pt-1">
                  <CurrentMenuComponent data={currentData} isCompact={true} />
                </div>
              </div>
            </div>

            {/* View Fullscreen button under phone */}
            <button
              onClick={() => setFullscreenModalOpen(true)}
              className="mt-4 flex items-center space-x-2 text-xs font-bold text-slate-300 hover:text-white px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer shadow-md"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Развернуть во весь экран</span>
            </button>
          </div>

          {/* Right Column: Restaurant Storytelling, Features & Lead CTA */}
          <div className="lg:col-span-6 space-y-6">
            {/* Meta Card */}
            <div
              className="rounded-3xl p-6 sm:p-7 border-2 shadow-2xl transition-all duration-500 space-y-4"
              style={{
                background: currentData.colors.surface,
                borderColor: currentData.colors.border,
              }}
            >
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{currentShowcase.emblem}</span>
                  <div>
                    <span className="text-xs font-bold text-slate-300">
                      Дизайн: {currentData.designer.name} ({currentData.designer.location})
                    </span>
                    <p className="text-[10px] text-slate-400">
                      {currentData.designer.country} {currentData.designer.countryFlag}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-black border border-emerald-500/30">
                  <Star className="w-3.5 h-3.5 fill-emerald-400" />
                  <span>{currentData.rating}</span>
                </div>
              </div>

              {/* Title & Tagline */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-serif leading-tight">
                  {currentData.name}
                </h3>
                <p className="text-sm font-bold mt-1" style={{ color: currentData.colors.primary }}>
                  {currentData.conceptTitle}
                </p>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed font-light">
                  {currentData.tagline}
                </p>
              </div>

              {/* Key Features Checkmarks */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Включённый функционал:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentData.features.map((feat, fi) => (
                    <div
                      key={fi}
                      className="text-xs text-slate-200 flex items-start space-x-2 p-2 rounded-xl bg-black/30 border border-white/5"
                    >
                      <Check
                        className="w-3.5 h-3.5 shrink-0 mt-0.5"
                        style={{ color: currentData.colors.primary }}
                      />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-2.5 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-[9px] text-slate-400 block">Ср. чек</span>
                  <span className="text-xs font-black text-white">{currentData.avgCheck}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-[9px] text-slate-400 block">Повторные заказы</span>
                  <span className="text-xs font-black text-emerald-400">{currentData.repeatRate}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-[9px] text-slate-400 block">Доставка/сервис</span>
                  <span
                    className="text-xs font-black"
                    style={{ color: currentData.colors.primary }}
                  >
                    {currentData.deliveryTime}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => setIsOrderOpen(true)}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 text-slate-950 shadow-xl active:scale-95 transition-all cursor-pointer"
                  style={{
                    background: `linear-gradient(90deg, ${currentData.colors.primary}, ${currentData.colors.secondary})`,
                  }}
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Хочу такой же дизайн</span>
                </button>

                <button
                  onClick={() => setFullscreenModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-md"
                >
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>Инспектор</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FULLSCREEN INSPECTOR MODAL ──────────────────────────── */}
      {fullscreenModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-2xl animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setFullscreenModalOpen(false);
          }}
        >
          <div
            className="relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border-2 flex flex-col h-[92vh]"
            style={{
              background: currentData.colors.surface,
              borderColor: currentData.colors.border,
            }}
          >
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b shrink-0 flex items-center justify-between bg-black/60 border-white/10">
              <div className="flex items-center space-x-3">
                <span className="text-2xl leading-none">{currentShowcase.emblem}</span>
                <div>
                  <h3 className="text-base font-black text-white">{currentData.name}</h3>
                  <p className="text-[11px] text-slate-400">
                    {currentData.cuisine} • {currentData.designer.name} ({currentData.designer.location})
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setFullscreenModalOpen(false);
                    setIsOrderOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-slate-950 shadow-md cursor-pointer"
                  style={{
                    background: `linear-gradient(90deg, ${currentData.colors.primary}, ${currentData.colors.secondary})`,
                  }}
                >
                  Оставить заявку
                </button>
                <button
                  onClick={() => setFullscreenModalOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto">
              <CurrentMenuComponent data={currentData} isCompact={false} />
            </div>
          </div>
        </div>
      )}

      {/* ── ORDER BRIEF MODAL ───────────────────────────────────── */}
      {isOrderOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOrderOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg rounded-3xl p-6 sm:p-7 border-2 shadow-2xl bg-[#090d16] border-amber-500/40 text-white max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsOrderOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {submitSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500/40">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-2xl font-black font-serif">Заявка принята!</h3>
                <p className="text-sm text-slate-300 max-w-sm mx-auto">
                  Наш арт-директор свяжется с вами в Telegram или по телефону в течение 15 минут для
                  обсуждения концепции и запуска дизайна.
                </p>
                <button
                  onClick={() => setIsOrderOpen(false)}
                  className="mt-4 px-6 py-3 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider"
                >
                  Закрыть
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {currentData.name}
                  </span>
                  <h3 className="text-xl font-black font-serif mt-2">
                    Заявка на индивидуальный дизайн меню
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Срок создания меню — от 24 до 48 часов под ключ
                  </p>
                </div>

                {submitError && (
                  <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs">
                    {submitError}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Ваше имя *
                    </label>
                    <input
                      type="text"
                      required
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      placeholder="Алексей"
                      className="w-full bg-[#141a29] text-white text-xs p-3 rounded-xl border border-white/10 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Телефон или Telegram *
                    </label>
                    <input
                      type="text"
                      required
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      placeholder="+7 (999) 000-00-00 или @username"
                      className="w-full bg-[#141a29] text-white text-xs p-3 rounded-xl border border-white/10 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Название заведения / Город
                    </label>
                    <input
                      type="text"
                      value={leadForm.restaurantName}
                      onChange={(e) =>
                        setLeadForm({ ...leadForm, restaurantName: e.target.value })
                      }
                      placeholder="Porto Bar, Москва"
                      className="w-full bg-[#141a29] text-white text-xs p-3 rounded-xl border border-white/10 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Пожелания к стилю
                    </label>
                    <textarea
                      rows={2}
                      value={leadForm.comment}
                      onChange={(e) => setLeadForm({ ...leadForm, comment: e.target.value })}
                      placeholder={`Хочу дизайн в стиле ${currentData.name}...`}
                      className="w-full bg-[#141a29] text-white text-xs p-3 rounded-xl border border-white/10 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <label className="flex items-center space-x-2 text-[11px] text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={leadForm.agree}
                      onChange={(e) => setLeadForm({ ...leadForm, agree: e.target.checked })}
                      className="rounded accent-amber-500"
                    />
                    <span>Согласен на обработку персональных данных</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-slate-950" />
                      <span>Отправить заявку</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
