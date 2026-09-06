'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Palette,
  Rocket,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Zap,
  Layers,
  CreditCard,
  QrCode,
  Smartphone
} from 'lucide-react';

interface StepDetail {
  id: number;
  timeframe: string;
  badge: string;
  title: string;
  subtitle: string;
  clientTask: string;
  getMenuTask: string[];
  deliverable: string;
  metricLabel: string;
  metricValue: string;
  previewType: 'audit' | 'design' | 'integration' | 'profit';
}

const TIMELINE_STEPS: StepDetail[] = [
  {
    id: 1,
    timeframe: '00:00 — 02:00 ч',
    badge: 'Шаг 1 • Старт',
    title: 'Экспресс-аудит и передача меню',
    subtitle: 'Вы просто отправляете PDF или фото текущего меню, остальное берем мы.',
    clientTask: '5 минут: отправить меню в Telegram или прикрепить к брифу на сайте.',
    getMenuTask: [
      'ИИ-парсинг и структурирование всех категорий блюд',
      'Оцифровка цен, граммовок, описаний и КБЖУ',
      'Создание персонального воркспейса ресторана'
    ],
    deliverable: 'Оцифрованная база меню и утвержденная структура приложения',
    metricLabel: 'Ваше участие',
    metricValue: '5 минут',
    previewType: 'audit'
  },
  {
    id: 2,
    timeframe: '02:00 — 24:00 ч',
    badge: 'Шаг 2 • Визуал',
    title: 'Индивидуальный дизайн и PWA',
    subtitle: 'Собираем премиальный дизайн под брендбук и фирменный стиль вашего ресторана.',
    clientTask: 'Оценить интерактивный прототип на своем смартфоне по секретной ссылке.',
    getMenuTask: [
      'Подбор фирменной палитры (темный люкс, светлый минимал или неон)',
      'Интеграция логотипа, иконок и сочных фото блюд',
      'Настройка модификаторов (прожарки, соусы, комбо-наборы)'
    ],
    deliverable: 'Готовый интерактивный PWA-прототип с анимациями Apple-уровня',
    metricLabel: 'Готовность макета',
    metricValue: '24 часа',
    previewType: 'design'
  },
  {
    id: 3,
    timeframe: '24:00 — 48:00 ч',
    badge: 'Шаг 3 • Финансы',
    title: 'Подключение СБП 0.7%, кассы и печать QR',
    subtitle: 'Деньги поступают сразу на ваш расчетный счет без комиссий агрегаторов.',
    clientTask: 'Подписать договор интернет-эквайринга (Т-Банк / ЮKassa / СБП).',
    getMenuTask: [
      'Подключение онлайн-оплаты с комиссией от 0.7% (вместо 30% агрегаторов)',
      'Синхронизация с кассой iiko, r-keeper или Telegram-ботом кухни',
      'Генерация готовых макетов премиум QR-кодов для столов'
    ],
    deliverable: 'Приложение на личном домене (например, porto-bar.ru) и связь с кассой',
    metricLabel: 'Комиссия платформы',
    metricValue: '0%',
    previewType: 'integration'
  },
  {
    id: 4,
    timeframe: '48:00+ навсегда',
    badge: 'Шаг 4 • Результат',
    title: 'Прямые заказы и своя база гостей',
    subtitle: 'Гости возвращаются благодаря кешбэку, а вы экономите сотни тысяч рублей.',
    clientTask: 'Получать чистую выручку и наблюдать за ростом среднего чека в дашборде.',
    getMenuTask: [
      'Бесплатные таргетированные Push-уведомления вместо дорогих SMS',
      'Накопительная система лояльности и виртуальные карты Apple Wallet',
      'Пожизненная техническая поддержка 24/7 и обновления платформы'
    ],
    deliverable: 'Собственная независимая экосистема доставки и повторных продаж',
    metricLabel: 'Рост чистой маржи',
    metricValue: '+30%',
    previewType: 'profit'
  }
];

export function LaunchTimeline() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const current = TIMELINE_STEPS.find((s) => s.id === activeStep) || TIMELINE_STEPS[0];

  const scrollToBrief = () => {
    const el = document.getElementById('brief-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="how-it-works"
      className="relative py-28 sm:py-36 bg-[#030712] text-white overflow-hidden isolate selection:bg-amber-500 selection:text-slate-950"
    >
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-amber-500/10 via-orange-600/5 to-transparent blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-blue-600/5 blur-[140px] pointer-events-none -z-10" />

      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #f59e0b 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest shadow-inner">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Рекордная скорость запуска</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-white leading-tight">
            От меню до первого заказа <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              ровно за 48 часов
            </span>
          </h2>

          <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
            Вам не нужно нанимать программистов, дизайнеров или заполнять таблицы вручную. 
            Команда <span className="text-white font-medium">GetMenu</span> берет 100% рутины, интеграций и дизайна на себя.
          </p>
        </div>

        <div className="relative mb-12">
          <div className="hidden lg:block absolute top-7 left-[8%] right-[8%] h-0.5 bg-slate-800 -z-0">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 transition-all duration-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
              style={{ width: `${((activeStep - 1) / 3) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative z-10">
            {TIMELINE_STEPS.map((step) => {
              const isActive = step.id === activeStep;
              const isPast = step.id < activeStep;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`group relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                    isActive
                      ? 'bg-slate-900/90 border-amber-500/80 shadow-[0_10px_35px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/50'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                        isActive
                          ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/30'
                          : isPast
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isPast ? <CheckCircle2 className="w-4 h-4" /> : `0${step.id}`}
                    </div>

                    <span
                      className={`text-[11px] font-mono font-bold tracking-tight px-2 py-0.5 rounded-md border ${
                        isActive
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-slate-800/50 text-slate-400 border-slate-800'
                      }`}
                    >
                      {step.timeframe}
                    </span>
                  </div>

                  <h3
                    className={`text-sm sm:text-base font-bold transition-colors line-clamp-1 ${
                      isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                    }`}
                  >
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-1 sm:line-clamp-2 font-light">
                    {step.deliverable}
                  </p>

                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800/90 p-6 sm:p-10 shadow-2xl overflow-hidden">
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {current.badge}
                  </span>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Таймлайн: {current.timeframe}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif text-white tracking-tight">
                    {current.title}
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                    {current.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4.5 space-y-2">
                    <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" />
                      <span>От вас требуется:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      {current.clientTask}
                    </p>
                  </div>

                  <div className="bg-slate-950/70 border border-amber-500/30 rounded-2xl p-4.5 space-y-1">
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                      {current.metricLabel}
                    </div>
                    <div className="text-2xl sm:text-3xl font-black font-serif text-amber-400">
                      {current.metricValue}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      Гарантировано договором
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Что выполняет команда GetMenu:</span>
                  </div>
                  <div className="space-y-2.5">
                    {current.getMenuTask.map((task, idx) => (
                      <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-200">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        <span className="leading-snug">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <button
                    onClick={scrollToBrief}
                    className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 text-slate-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Запустить этот этап сейчас</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  <span className="text-xs text-slate-400">
                    Осталось {4 - current.id} шага до запуска
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      deliverable_stage_0{current.id}.json
                    </span>
                  </div>

                  {current.previewType === 'audit' && (
                    <div className="space-y-3 font-sans">
                      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-amber-400" />
                          <div>
                            <p className="text-xs font-bold text-white">Меню_ресторана_2026.pdf</p>
                            <p className="text-[10px] text-slate-400">87 блюд • 9 категорий оцифровано</p>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                          100% распознано
                        </span>
                      </div>

                      <div className="bg-slate-900/60 rounded-xl p-3 space-y-2 border border-slate-800/60 text-xs">
                        <div className="flex justify-between text-slate-400 text-[11px]">
                          <span>Позиция</span>
                          <span>Граммы / Цена</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-t border-slate-800">
                          <span className="text-white font-medium">Стейк Рибай Прайм</span>
                          <span className="text-amber-400 font-bold">350г • 1 890 ₽</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-t border-slate-800">
                          <span className="text-white font-medium">Лосось на углях со спаржей</span>
                          <span className="text-amber-400 font-bold">280г • 1 450 ₽</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-t border-slate-800">
                          <span className="text-white font-medium">Тартар из тунца с авокадо</span>
                          <span className="text-amber-400 font-bold">180г • 890 ₽</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                        <span>Статус аудита:</span>
                        <span className="text-emerald-400 font-bold">Готово к загрузке в PWA</span>
                      </div>
                    </div>
                  )}

                  {current.previewType === 'design' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Палитра и стиль PWA:</span>
                        <span className="text-[10px] text-amber-400 font-mono">Noir Obsidian Gold</span>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        <div className="h-10 rounded-lg bg-[#060a12] border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                          #060a12
                        </div>
                        <div className="h-10 rounded-lg bg-[#111827] border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                          #111827
                        </div>
                        <div className="h-10 rounded-lg bg-[#f59e0b] border border-amber-400 flex items-center justify-center text-[10px] text-black font-mono font-bold">
                          #f59e0b
                        </div>
                        <div className="h-10 rounded-lg bg-[#10b981] border border-emerald-400 flex items-center justify-center text-[10px] text-black font-mono font-bold">
                          #10b981
                        </div>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Smartphone className="w-4 h-4 text-amber-400" />
                            <span className="text-xs font-bold text-white">Safari Web App Ready</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">0.4s загрузка</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-lg p-2.5 border border-slate-800 flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-xs font-serif">
                              PB
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">Porto Bar & Grill</p>
                              <p className="text-[10px] text-slate-400">porto-bar.ru</p>
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                            Установлено
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {current.previewType === 'integration' && (
                    <div className="space-y-3">
                      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold text-white">Интернет-эквайринг</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            СБП 0.7% подключена
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Зачисление средств: <span className="text-white font-semibold">день в день напрямую на ваш р/с</span>
                        </p>
                      </div>

                      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <QrCode className="w-4 h-4 text-amber-400" />
                            <span className="text-xs font-bold text-white">QR-код на столы</span>
                          </div>
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            Макет готов к печати
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Разрешение 300 DPI, премиум акриловый дизайн с вашим логотипом.
                        </p>
                      </div>

                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between text-xs">
                        <span className="text-slate-300">Интеграция с кассой:</span>
                        <span className="text-emerald-400 font-bold">iiko / r-keeper Online</span>
                      </div>
                    </div>
                  )}

                  {current.previewType === 'profit' && (
                    <div className="space-y-3">
                      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">Выручка ресторана</span>
                          <span className="text-xs font-bold text-emerald-400">+28.4%</span>
                        </div>
                        <div className="text-2xl font-black font-serif text-white">
                          1 840 500 ₽ <span className="text-xs font-normal text-slate-400">/ мес</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[82%]" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-slate-900/70 border border-slate-800 p-2.5 rounded-xl">
                          <p className="text-[10px] text-slate-400">Сэкономлено на комиссиях</p>
                          <p className="text-sm font-black text-amber-400 mt-0.5">552 150 ₽</p>
                        </div>
                        <div className="bg-slate-900/70 border border-slate-800 p-2.5 rounded-xl">
                          <p className="text-[10px] text-slate-400">Гостей в базе</p>
                          <p className="text-sm font-black text-white mt-0.5">1 420 чел</p>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 text-center pt-1">
                        Все данные принадлежат исключительно вашему ресторану.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-12 bg-gradient-to-r from-amber-500/10 via-slate-900/80 to-amber-500/10 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black text-white">
                Железная гарантия 48 часов по договору
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Если мы не запустим приложение вашего заведения за 48 часов — первый месяц обслуживания <span className="text-amber-400 font-bold">БЕСПЛАТНО</span>.
              </p>
            </div>
          </div>

          <button
            onClick={scrollToBrief}
            className="w-full sm:w-auto shrink-0 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black px-7 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 active:scale-95 transition-all cursor-pointer"
          >
            Зафиксировать условия в договоре →
          </button>
        </div>
      </div>
    </section>
  );
}
