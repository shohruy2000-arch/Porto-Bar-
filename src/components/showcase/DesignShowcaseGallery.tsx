'use client';

import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Maximize2,
  Star,
  Check,
  Send,
  Loader2,
  X,
  ChevronRight,
  ExternalLink,
  Monitor,
  Smartphone,
  Award,
  Clock,
  TrendingUp,
  ShieldCheck,
  Palette,
  Zap,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   RESTAURANT CONCEPTS DATA
───────────────────────────────────────────────────────────────*/
const RESTAURANTS = [
  {
    id: 'porto',
    name: 'Porto Bar',
    subtitle: 'Luxury Dark Fine-Dining',
    emblem: '🦪',
    url: 'https://porto-bar.ru/',
    accentColor: '#F59E0B',
    accentGlow: 'rgba(245,158,11,0.18)',
    bgGradient: 'linear-gradient(135deg, #0a0c12 0%, #111827 100%)',
    borderColor: 'rgba(245,158,11,0.35)',
    tagline: 'Тёмная роскошь, устрицы и коктейли. Дизайн в стиле Michelin-звёздных ресторанов Европы — глубокий антрацит, золото, анимированные карточки блюд.',
    cuisine: 'Fine Dining · Bar · Oysters',
    designerFlag: '🇫🇷',
    designerName: 'Jean-Luc Moreau',
    designerLocation: 'Paris, France',
    stats: [
      { label: 'Средний чек', value: '4 200 ₽', icon: '💳' },
      { label: 'Повторные заказы', value: '+67%', icon: '🔄' },
      { label: 'Время доставки', value: '28 мин', icon: '⚡' },
    ],
    features: [
      'Анимированная PWA-карусель блюд',
      'Тёмная тема с золотыми акцентами',
      'Система лояльности с баллами',
      'Живой трекер заказа',
      'Push-уведомления о статусе',
      'Telegram-бот интеграция',
    ],
    badge: 'LIVE PRODUCTION',
    badgeColor: 'bg-amber-500',
  },
  {
    id: 'brunch',
    name: "Brunch's Bistro",
    subtitle: 'Light Nordic Botanical',
    emblem: '🥞',
    url: 'http://194.87.55.134:3005/',
    accentColor: '#C05830',
    accentGlow: 'rgba(192,88,48,0.18)',
    bgGradient: 'linear-gradient(135deg, #1a0e08 0%, #2d1810 100%)',
    borderColor: 'rgba(192,88,48,0.40)',
    tagline: 'Скандинавский бранч-стиль, суфле-панкейки и specialty кофе. Светлая кремовая палитра, терракотовые акценты, воздушная типографика — максимальный аппетитный эффект.',
    cuisine: 'Brunch · Pancakes · Specialty Coffee',
    designerFlag: '🇸🇪',
    designerName: 'Erik Lindström',
    designerLocation: 'Stockholm, Sweden',
    stats: [
      { label: 'Средний чек', value: '1 800 ₽', icon: '💳' },
      { label: 'Повторные заказы', value: '+81%', icon: '🔄' },
      { label: 'Время доставки', value: '22 мин', icon: '⚡' },
    ],
    features: [
      'Светлая Nordic тема (терракот + крем)',
      'Программа лояльности Eco Club',
      'Карточки блюд с аппетитными фото',
      'Категорийная навигация',
      'Система рекомендаций',
      'Telegram-бот интеграция',
    ],
    badge: 'LIVE PRODUCTION',
    badgeColor: 'bg-orange-600',
  },
];

/* ─────────────────────────────────────────────────────────────
   LEAD FORM MODAL
───────────────────────────────────────────────────────────────*/
function LeadModal({
  restaurant,
  onClose,
}: {
  restaurant: (typeof RESTAURANTS)[0];
  onClose: () => void;
}) {
  const [form, setForm] = useState({ name: '', phone: '', restaurantName: '', comment: '', agree: true });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          restaurantName: form.restaurantName,
          comment: form.comment || `Заинтересован стилем: ${restaurant.name} (${restaurant.subtitle})`,
          preferredStyle: `${restaurant.name} — ${restaurant.subtitle}`,
          cuisineType: restaurant.cuisine,
          agree: form.agree,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Ошибка');
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Не удалось отправить. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl p-7 border-2 shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
          borderColor: restaurant.accentColor + '55',
          boxShadow: `0 0 60px ${restaurant.accentGlow}`,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {success ? (
          <div className="text-center py-10 space-y-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto border-2"
              style={{ borderColor: restaurant.accentColor, background: restaurant.accentColor + '20' }}
            >
              <Check className="w-10 h-10" style={{ color: restaurant.accentColor }} />
            </div>
            <h3 className="text-2xl font-black text-white">Заявка принята!</h3>
            <p className="text-slate-300 text-sm max-w-xs mx-auto leading-relaxed">
              Наш арт-директор свяжется с вами в Telegram в течение 15 минут для старта разработки.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-8 py-3 rounded-2xl font-black text-sm text-white"
              style={{ background: restaurant.accentColor }}
            >
              Закрыть
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-2">
              <span
                className="inline-block text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-3 text-white"
                style={{ background: restaurant.accentColor }}
              >
                {restaurant.emblem} Стиль: {restaurant.name}
              </span>
              <h3 className="text-xl font-black text-white leading-snug">
                Заказать дизайн меню как у{' '}
                <span style={{ color: restaurant.accentColor }}>{restaurant.name}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">Срок разработки — 24–48 часов под ключ</p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs">
                {error}
              </div>
            )}

            {[
              { key: 'name', label: 'Ваше имя *', placeholder: 'Алексей', required: true },
              {
                key: 'phone',
                label: 'Телефон или Telegram *',
                placeholder: '+7 (999) 000-00-00 или @username',
                required: true,
              },
              {
                key: 'restaurantName',
                label: 'Название заведения',
                placeholder: 'Моё Кафе, Москва',
                required: false,
              },
            ].map(({ key, label, placeholder, required }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">{label}</label>
                <input
                  type="text"
                  required={required}
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-amber-500/60 placeholder-slate-500 transition-colors"
                  style={{ '--tw-ring-color': restaurant.accentColor } as any}
                />
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Пожелания к концепции
              </label>
              <textarea
                rows={2}
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                placeholder={`Хочу дизайн в стиле ${restaurant.name}...`}
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-amber-500/60 placeholder-slate-500 resize-none"
              />
            </div>

            <label className="flex items-center space-x-2.5 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                className="rounded"
                style={{ accentColor: restaurant.accentColor }}
              />
              <span>Согласен на обработку персональных данных</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2 text-white shadow-xl disabled:opacity-50 transition-all active:scale-[0.98]"
              style={{ background: `linear-gradient(90deg, ${restaurant.accentColor}, ${restaurant.accentColor}cc)` }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Оставить заявку</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PHONE FRAME with IFRAME
───────────────────────────────────────────────────────────────*/
function PhoneFrame({ url, accentColor, accentGlow }: { url: string; accentColor: string; accentGlow: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="relative mx-auto flex-shrink-0"
      style={{
        width: 300,
        height: 620,
        background: '#08090e',
        borderRadius: 46,
        border: `3px solid #242b3d`,
        boxShadow: `0 40px 80px rgba(0,0,0,0.95), 0 0 50px ${accentGlow}, inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
    >
      {/* Side buttons */}
      <div className="absolute -left-[4px] top-20 w-1 h-8 rounded-l-full bg-[#1a1f2e]" />
      <div className="absolute -left-[4px] top-32 w-1 h-14 rounded-l-full bg-[#1a1f2e]" />
      <div className="absolute -left-[4px] top-48 w-1 h-14 rounded-l-full bg-[#1a1f2e]" />
      <div className="absolute -right-[4px] top-28 w-1 h-20 rounded-r-full bg-[#1a1f2e]" />

      {/* Screen bezel */}
      <div className="absolute inset-2 rounded-[38px] overflow-hidden bg-black">
        {/* Dynamic Island */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 rounded-full bg-black z-30 flex items-center justify-between px-3 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse opacity-80" />
          <div className="w-3 h-3 rounded-full bg-[#181d29]" />
        </div>

        {/* Loading skeleton */}
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0d0d] z-20 space-y-3">
            <div
              className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: `${accentColor}40`, borderTopColor: accentColor }}
            />
            <p className="text-xs text-slate-400 font-medium">Загружаем меню...</p>
          </div>
        )}

        {/* Live iframe */}
        <iframe
          src={url}
          className="w-full h-full border-0"
          style={{ borderRadius: 36 }}
          onLoad={() => setLoaded(true)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          loading="lazy"
          title="Restaurant App Preview"
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN GALLERY COMPONENT
───────────────────────────────────────────────────────────────*/
export function DesignShowcaseGallery() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [fullscreenUrl, setFullscreenUrl] = useState<string | null>(null);

  const activeRestaurant = RESTAURANTS.find((r) => r.id === activeId) || null;

  return (
    <section
      id="demo"
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050810 0%, #070b14 60%, #050810 100%)' }}
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, #C05830 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── SECTION HEADER ──────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Живые примеры наших работ</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-white leading-tight">
            Выберите стиль{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              вашего меню
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Два полностью разных дизайна — два разных ресторана с разными концепциями. Оба работают
            в реальных заведениях прямо сейчас. Выберите стиль — мы адаптируем его под вашу кухню,
            меню и бренд за 24–48 часов.
          </p>
        </div>

        {/* ── TWO RESTAURANT CARDS ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 mb-16">
          {RESTAURANTS.map((r) => (
            <div
              key={r.id}
              className="relative rounded-3xl overflow-hidden border-2 flex flex-col transition-all duration-500 group"
              style={{
                background: r.bgGradient,
                borderColor: r.borderColor,
                boxShadow: `0 20px 60px rgba(0,0,0,0.7), 0 0 40px ${r.accentGlow}`,
              }}
            >
              {/* Card Header */}
              <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl leading-none">{r.emblem}</span>
                  <div>
                    <h3 className="text-xl font-black text-white font-serif">{r.name}</h3>
                    <p className="text-xs font-bold mt-0.5" style={{ color: r.accentColor }}>
                      {r.subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider ${r.badgeColor}`}
                  >
                    {r.badge}
                  </span>
                </div>
              </div>

              {/* Phone Frame + Live App */}
              <div
                className="flex items-center justify-center py-8 px-4 relative"
                style={{
                  background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${r.accentGlow}, transparent)`,
                }}
              >
                <PhoneFrame url={r.url} accentColor={r.accentColor} accentGlow={r.accentGlow} />

                {/* Fullscreen button overlay */}
                <button
                  onClick={() => setFullscreenUrl(r.url)}
                  className="absolute bottom-10 right-6 flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-black/60 backdrop-blur-sm border border-white/15 text-white text-xs font-bold hover:bg-black/80 transition-all shadow-lg"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>На весь экран</span>
                </button>
              </div>

              {/* Restaurant Info */}
              <div className="px-6 pb-4 flex-1 space-y-4 border-t border-white/5 pt-5">
                {/* Tagline */}
                <p className="text-sm text-slate-300 leading-relaxed">{r.tagline}</p>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2">
                  {r.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="p-3 rounded-2xl text-center border border-white/5 bg-black/30"
                    >
                      <span className="text-base leading-none block mb-1">{stat.icon}</span>
                      <span className="text-sm font-black text-white block">{stat.value}</span>
                      <span className="text-[10px] text-slate-400 leading-tight">{stat.label}</span>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Что включено:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {r.features.map((feat) => (
                      <div
                        key={feat}
                        className="flex items-center space-x-2 text-xs text-slate-300 p-2 rounded-xl bg-white/4 border border-white/5"
                      >
                        <Check className="w-3.5 h-3.5 shrink-0" style={{ color: r.accentColor }} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Designer */}
                <div className="flex items-center space-x-2.5 text-xs text-slate-400 border-t border-white/5 pt-3">
                  <span className="text-base">{r.designerFlag}</span>
                  <span>
                    Дизайнер:{' '}
                    <span className="text-slate-200 font-semibold">
                      {r.designerName}
                    </span>{' '}
                    · {r.designerLocation}
                  </span>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    onClick={() => setActiveId(r.id)}
                    className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-white flex items-center justify-center space-x-2 shadow-xl transition-all active:scale-[0.98] hover:opacity-90"
                    style={{
                      background: `linear-gradient(90deg, ${r.accentColor}, ${r.accentColor}bb)`,
                      boxShadow: `0 8px 30px ${r.accentGlow}`,
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Хочу такой дизайн</span>
                  </button>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-1.5 px-5 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                    <span>Открыть</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── BOTTOM VALUE STRIP ──────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { icon: <Clock className="w-5 h-5" />, title: '24–48 часов', sub: 'срок разработки' },
            { icon: <Palette className="w-5 h-5" />, title: 'Ваш брендинг', sub: 'цвета, логотип, шрифты' },
            { icon: <Zap className="w-5 h-5" />, title: 'Под ключ', sub: 'без технических навыков' },
            { icon: <ShieldCheck className="w-5 h-5" />, title: 'Поддержка 24/7', sub: 'после запуска' },
          ].map((item) => (
            <div
              key={item.title}
              className="p-4 rounded-2xl bg-white/4 border border-white/8 text-center space-y-1.5"
            >
              <div className="flex justify-center text-amber-400">{item.icon}</div>
              <p className="text-sm font-black text-white">{item.title}</p>
              <p className="text-[11px] text-slate-400">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FULLSCREEN IFRAME MODAL ─────────────────────────── */}
      {fullscreenUrl && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
            <div className="flex items-center space-x-2 text-white text-sm font-bold">
              <Monitor className="w-4 h-4 text-amber-400" />
              <span>Просмотр в полном размере</span>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href={fullscreenUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Открыть в браузере</span>
              </a>
              <button
                onClick={() => setFullscreenUrl(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <iframe
            src={fullscreenUrl}
            className="w-full flex-1 border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            title="Full Restaurant App"
          />
        </div>
      )}

      {/* ── LEAD FORM MODAL ─────────────────────────────────── */}
      {activeRestaurant && (
        <LeadModal restaurant={activeRestaurant} onClose={() => setActiveId(null)} />
      )}
    </section>
  );
}
