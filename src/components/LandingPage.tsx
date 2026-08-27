/**
 * @file src/components/LandingPage.tsx
 * @description Main Agency & Platform Landing Page for GetMenu (StarterApp for Restaurants).
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Percent, 
  Users, 
  Database, 
  Smartphone, 
  CreditCard, 
  Gift, 
  Settings, 
  Bell, 
  BarChart3, 
  FileText, 
  Palette, 
  Rocket, 
  TrendingUp, 
  Check, 
  ChevronDown, 
  ArrowRight, 
  Send, 
  Phone, 
  Mail, 
  MessageSquare, 
  Sparkles, 
  ExternalLink
} from 'lucide-react';
import { CharacterCarouselWave } from './CharacterCarouselWave';

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Brief Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    restaurantName: '',
    city: '',
    cuisineType: 'Европейская',
    preferredStyle: 'Темный премиум',
    avgCheck: '',
    comment: '',
    agree: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Scroll listener for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBriefSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agree) {
      setSubmitError('Необходимо дать согласие на обработку персональных данных');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Ошибка при отправке заявки');
      }

      setSubmitSuccess(true);
      setFormData({
        name: '',
        phone: '',
        restaurantName: '',
        city: '',
        cuisineType: 'Европейская',
        preferredStyle: 'Темный премиум',
        avgCheck: '',
        comment: '',
        agree: true
      });
    } catch (err: any) {
      setSubmitError(err.message || 'Произошла ошибка при отправке. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'Сколько времени занимает запуск?',
      a: 'Запуск занимает от 24 до 48 часов с момента утверждения брифа и передачи меню. Мы сами настраиваем дизайн, загружаем блюда с фото, описаниями, КБЖУ и подключаем онлайн-оплату.'
    },
    {
      q: 'Нужно ли регистрироваться в App Store и Google Play?',
      a: 'Нет, регистрация аккаунтов разработчика не требуется. Наше решение создано на базе технологии PWA (Progressive Web App). Гость открывает ссылку или сканирует QR-код, и приложение устанавливается на экран смартфона в 1 клик прямо из Safari или Chrome без модерации и без комиссий Apple/Google 30%.'
    },
    {
      q: 'Можно ли подключить свою кассу и систему учета?',
      a: 'Да! Мы поддерживаем интеграцию с iiko, R-Keeper, 1С и онлайн-кассами для фискализации чеков (54-ФЗ). Заказы могут падать прямо на терминал кухни.'
    },
    {
      q: 'Какая комиссия с заказов?',
      a: '0% комиссии с продаж! Вы платите только фиксированную абонентскую плату за платформу. Все средства гостей зачисляются напрямую на ваш расчетный счет через интернет-эквайринг (ЮKassa, СБП, Т-Банк).'
    },
    {
      q: 'Можно ли перенести существующее меню?',
      a: 'Да, наши специалисты могут автоматически импортировать ваше меню из iiko, PDF-файлов или текущего сайта ресторана вместе с категориями, ценами и модификаторами.'
    },
    {
      q: 'Что если мы захотим отказаться в будущем?',
      a: 'Все данные гостей, история заказов, телефонная база и статистика выгружаются в Excel/CSV в один клик. Вы ничем не рискуете и не привязаны к платформе.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* 1. NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg py-3.5' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-md shadow-amber-500/20">
              <Smartphone className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white font-serif">
                Get<span className="text-amber-400">Menu</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Agency & Tech
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Как это работает
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Возможности
            </button>
            <button 
              onClick={() => scrollToSection('demo')} 
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Демо
            </button>
            <button 
              onClick={() => scrollToSection('pricing')} 
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Тарифы
            </button>
            <button 
              onClick={() => scrollToSection('faq')} 
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              href="/r/porto-bar"
              className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-200 hover:border-amber-400/50 hover:bg-slate-800 transition-all"
            >
              <span>Пример PWA</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </Link>
            <button
              onClick={() => scrollToSection('brief-form')}
              className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
            >
              Оставить заявку
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-amber-500/15 to-orange-600/15 blur-[140px] rounded-full pointer-events-none -z-10" />
        <div className="absolute -top-10 right-10 w-[350px] h-[350px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Готовое персональное приложение без App Store за 48 часов</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] font-serif">
            Свое приложение доставки <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
              за 48 часов
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-300 font-light leading-relaxed">
            Без комиссий агрегаторов 30%. Свой брендинг, онлайн-оплата СБП, модификаторы блюд и прямая база ваших гостей.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => scrollToSection('brief-form')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-slate-950 font-black px-8 py-4 rounded-xl text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 active:scale-95 transition-all cursor-pointer"
            >
              <span>Оставить заявку на запуск</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <Link
              href="/r/porto-bar"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 px-7 py-4 rounded-xl text-sm font-bold tracking-wide active:scale-95 transition-all"
            >
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>Посмотреть живое демо</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 max-w-3xl mx-auto text-left">
            <div className="flex items-center space-x-3 bg-slate-900/70 border border-slate-800/80 p-3.5 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Percent className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">0% комиссии</p>
                <p className="text-[11px] text-slate-400">с каждого заказа</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-slate-900/70 border border-slate-800/80 p-3.5 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Rocket className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Запуск за 48 часов</p>
                <p className="text-[11px] text-slate-400">под ключ нашей командой</p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-center space-x-3 bg-slate-900/70 border border-slate-800/80 p-3.5 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">PWA технология</p>
                <p className="text-[11px] text-slate-400">без модерации App Store</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM SECTION */}
      <section className="py-24 bg-white text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600">
              Скрытые потери ресторанного бизнеса
            </h2>
            <p className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-slate-950">
              Почему агрегаторы съедают вашу чистую прибыль?
            </p>
            <p className="text-slate-600 text-base sm:text-lg">
              Работая только через Яндекс Еду и Маркет, вы отдаете львиную долю маржи и отдаете своих постоянных гостей.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-8 space-y-4 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center">
                <Percent className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-950">25–35% комиссия</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                С каждого заказа на 2 000 ₽ агрегатор забирает до 700 ₽. За месяц успешный ресторан теряет от 300 000 ₽ до 1 500 000 ₽ чистой прибыли.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-8 space-y-4 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-950">Клиенты — не ваши</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Агрегатор в любой момент покажет вашему гостю баннер конкурента с соседней улицы со скидкой 20%. Вы не контролируете удержание гостей.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-8 space-y-4 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-950">Нет данных о гостях</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Вы не получаете телефоны, предпочтения, дни рождения и историю заказов. Нельзя настроить триггерные пуши или персонализированный маркетинг.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <span>✓ Наше решение</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold font-serif text-white">
                0% комиссии с заказов. Полный контроль над гостями.
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Собственное PWA-приложение позволяет принимать заказы на доставку, самовывоз и в зале напрямую. Все платежи поступают на ваш счёт, а клиентская база и история заказов остаются вашей собственностью навсегда.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => scrollToSection('brief-form')}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  Рассчитать экономию ресторана
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section id="features" className="py-24 bg-slate-900 text-slate-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Функционал платформы
            </h2>
            <p className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-white">
              Что входит в ваше готовое приложение
            </p>
            <p className="text-slate-400 text-base sm:text-lg">
              Все современные инструменты e-commerce для ресторанов уровня Dodo Pizza и Яндекс Лавки.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-7 space-y-4 hover:border-amber-500/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white">PWA без App Store</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Устанавливается с экрана Safari / Chrome в 1 клик. Работает молниеносно, поддерживает офлайн-режим и занимает меньше 2 МБ.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-7 space-y-4 hover:border-amber-500/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Онлайн-оплата и СБП</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Интеграция с ЮKassa, Т-Банком, СБП и банковскими картами. Деньги поступают сразу на ваш расчетный счет без посредников.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-7 space-y-4 hover:border-amber-500/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Gift className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Программа лояльности</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Начисление и списание бонусов, уровни гостей (Bronze, Silver, Gold), подарки за первый заказ и повторные визиты.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-7 space-y-4 hover:border-amber-500/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Модификаторы блюд</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Выбор прожарки, размера пиццы, типа молока, добавки топпингов и соусов с динамическим пересчётом стоимости позиции.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-7 space-y-4 hover:border-amber-500/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bell className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Бесплатные Push-уведомления</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Информируйте гостей об этапах готовности заказа, вечерних скидках и новых акциях прямо на экран телефона без затрат на SMS.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-7 space-y-4 hover:border-amber-500/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Дашборд и аналитика</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Статистика выручки в реальном времени, средний чек, популярные блюда, стоп-лист и управление меню в 2 клика.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-white text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600">
              Простой и понятный процесс
            </h2>
            <p className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-slate-950">
              Как мы запускаем ваше приложение
            </p>
            <p className="text-slate-600 text-base sm:text-lg">
              Вам не нужно нанимать программистов и дизайнеров — мы берем 100% технической работы на себя.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="relative space-y-4 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border-2 border-amber-500 text-amber-600 flex items-center justify-center font-bold text-xl mx-auto md:mx-0 shadow-lg">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Шаг 1 • 5 минут</span>
              <h3 className="text-xl font-bold text-slate-950">Заявка и бриф</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Вы заполняете короткую форму на сайте, указываете тип кухни, прикрепляете меню и пожелания по стилю.
              </p>
            </div>

            <div className="relative space-y-4 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border-2 border-amber-500 text-amber-600 flex items-center justify-center font-bold text-xl mx-auto md:mx-0 shadow-lg">
                <Palette className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Шаг 2 • 24 часа</span>
              <h3 className="text-xl font-bold text-slate-950">Дизайн и настройка</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Мы подбираем фирменную палитру, настраиваем логотип, структуру категорий и визуал под концепцию вашего ресторана.
              </p>
            </div>

            <div className="relative space-y-4 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border-2 border-amber-500 text-amber-600 flex items-center justify-center font-bold text-xl mx-auto md:mx-0 shadow-lg">
                <Rocket className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Шаг 3 • 48 часов</span>
              <h3 className="text-xl font-bold text-slate-950">Запуск и оплата</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Подключаем интернет-эквайринг, привязываем домен, выдаем готовые QR-коды для столов и обучаем ваш персонал.
              </p>
            </div>

            <div className="relative space-y-4 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center font-bold text-xl mx-auto md:mx-0 shadow-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Шаг 4 • Всегда</span>
              <h3 className="text-xl font-bold text-slate-950">Рост прямых продаж</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Гости заказывают напрямую через PWA, возвращаются благодаря бонусам, а вы экономите сотни тысяч рублей на комиссиях.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SHOWCASE SECTION — ThreeUI CharacterCarousel Wave */}
      <CharacterCarouselWave />

      {/* 7. PRICING SECTION */}
      <section id="pricing" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Тарифные планы
            </h2>
            <p className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-white">
              Прозрачные тарифы без скрытых платежей
            </p>
            <p className="text-slate-400 text-base sm:text-lg">
              Фиксированная абонентская плата и 0% комиссии с продаж. Окупается уже с первых 20 заказов.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Для небольших кафе</span>
                <h3 className="text-2xl font-bold text-white">Starter</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-black text-white font-serif">9 900</span>
                  <span className="text-slate-400 text-sm">₽ / месяц</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Идеально для запуска электронного меню и приёма базовых заказов на вынос и доставку.
                </p>
                <div className="w-full h-px bg-slate-800 my-4" />
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>До 50 блюд в меню</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>PWA-приложение на поддомене</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>QR-коды для столов</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Уведомления в Telegram</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => {
                  setFormData(prev => ({ ...prev, comment: 'Выбран тариф: Starter (9 900 ₽/мес)' }));
                  scrollToSection('brief-form');
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Выбрать Starter
              </button>
            </div>

            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500 rounded-3xl p-8 flex flex-col justify-between space-y-6 relative shadow-2xl shadow-amber-500/15">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow">
                Хит продаж
              </div>
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Для ресторанов и баров</span>
                <h3 className="text-2xl font-bold text-white">Business</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-black text-amber-400 font-serif">19 900</span>
                  <span className="text-slate-400 text-sm">₽ / месяц</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Полный комплект: свой бренд, интернет-эквайринг, модификаторы и программа лояльности.
                </p>
                <div className="w-full h-px bg-slate-800 my-4" />
                <ul className="space-y-3 text-xs text-slate-200">
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-semibold text-white">До 200 блюд в меню</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Свой отдельный домен (например, porto-bar.ru)</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Онлайн-оплата (ЮKassa, СБП, карты)</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Модификаторы блюд и комбо-наборы</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Система лояльности и кешбэк</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Интеграция с iiko / r-keeper</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => {
                  setFormData(prev => ({ ...prev, comment: 'Выбран тариф: Business (19 900 ₽/мес)' }));
                  scrollToSection('brief-form');
                }}
                className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-slate-950 font-black py-4 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
              >
                Выбрать Business
              </button>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Для сетей и франшиз</span>
                <h3 className="text-2xl font-bold text-white">Enterprise</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-white font-serif">По запросу</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Масштабируемое решение для сетей ресторанов с индивидуальной архитектурой и SLA.
                </p>
                <div className="w-full h-px bg-slate-800 my-4" />
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Неограниченно блюд и филиалов</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Выделенный сервер и база данных</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Кастомные интеграции по API</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Персональный менеджер и SLA 24/7</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => {
                  setFormData(prev => ({ ...prev, comment: 'Выбран тариф: Enterprise (По запросу)' }));
                  scrollToSection('brief-form');
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Обсудить Enterprise
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. BRIEF FORM SECTION */}
      <section id="brief-form" className="py-24 bg-white text-slate-900 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
              <span>🚀 Быстрый старт</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-slate-950">
              Оставить заявку на запуск
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Заполните бриф, и наш ведущий архитектор свяжется с вами в течение часа с готовым демо-проектом.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xl">
            {submitSuccess ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-950 font-serif">Заявка успешно отправлена!</h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto">
                    Спасибо! Мы уже получили ваш бриф. Архитектор свяжется с вами по указанному телефону в течение часа.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitSuccess(false)}
                  className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors"
                >
                  Отправить еще одну заявку
                </button>
              </div>
            ) : (
              <form onSubmit={handleBriefSubmit} className="space-y-6">
                {submitError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Ваше имя <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Иван Петров"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Телефон <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+7 (999) 000-00-00"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Название заведения <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Porto Bar / Чайхана №1"
                      value={formData.restaurantName}
                      onChange={e => setFormData({ ...formData, restaurantName: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Город <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Москва / Санкт-Петербург"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Тип кухни
                    </label>
                    <select
                      value={formData.cuisineType}
                      onChange={e => setFormData({ ...formData, cuisineType: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Европейская">Европейская / Средиземноморская</option>
                      <option value="Грузинская">Грузинская / Кавказская</option>
                      <option value="Паназиатская">Паназиатская / Суши / Wok</option>
                      <option value="Итальянская">Итальянская / Пицца / Паста</option>
                      <option value="Бургерная">Бургеры / Стритфуд</option>
                      <option value="Кофейня">Кофейня / Кондитерская</option>
                      <option value="Стейкхаус">Стейкхаус / Мясной ресторан</option>
                      <option value="Другое">Другое</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Желаемый стиль
                    </label>
                    <select
                      value={formData.preferredStyle}
                      onChange={e => setFormData({ ...formData, preferredStyle: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Темный премиум">Темный премиум (Золото / Черный)</option>
                      <option value="Светлый минимализм">Светлый минимализм (Чистый белый / Синий)</option>
                      <option value="Яркий фастфуд">Яркий аппетитный (Красный / Оранжевый)</option>
                      <option value="Уютный кофейный">Уютный кофейный (Теплый беж / Дерево)</option>
                      <option value="Киберпанк">Неоновый киберпанк</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Средний чек (₽)
                  </label>
                  <input
                    type="number"
                    placeholder="1500"
                    value={formData.avgCheck}
                    onChange={e => setFormData({ ...formData, avgCheck: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Комментарии или ссылка на текущее меню (опционально)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Укажите сайт, ссылку на PDF-меню или особые пожелания..."
                    value={formData.comment}
                    onChange={e => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-start space-x-3 pt-2">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={formData.agree}
                    onChange={e => setFormData({ ...formData, agree: e.target.checked })}
                    className="w-4 h-4 mt-0.5 text-amber-500 rounded border-slate-300 focus:ring-amber-500 cursor-pointer"
                  />
                  <label htmlFor="agree" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                    Согласен на обработку персональных данных в соответствии с 152-ФЗ и политикой конфиденциальности.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-slate-950 font-black py-4 rounded-xl text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Отправка данных...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 stroke-[2.5]" />
                      <span>Отправить заявку архитектору</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 9. FAQ SECTION */}
      <section id="faq" className="py-24 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Часто задаваемые вопросы
            </h2>
            <p className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-white">
              Ответы на главные вопросы
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left cursor-pointer hover:bg-slate-900/50"
                  >
                    <span className="text-base sm:text-lg font-bold text-white pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-amber-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-slate-850 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="text-lg font-black text-white font-serif">
                Get<span className="text-amber-400">Menu</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Технологическая платформа и агентство по разработке индивидуальных PWA-приложений доставки для ресторанов, баров и кафе.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Продукт</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => scrollToSection('features')} className="hover:text-white cursor-pointer">
                  Возможности
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('pricing')} className="hover:text-white cursor-pointer">
                  Тарифные планы
                </button>
              </li>
              <li>
                <Link href="/r/porto-bar" className="hover:text-white">
                  Демонстрация PWA
                </Link>
              </li>
              <li>
                <button onClick={() => scrollToSection('brief-form')} className="hover:text-white cursor-pointer text-left">
                  Оставить бриф на запуск
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Правовая информация</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>Политика конфиденциальности (152-ФЗ)</li>
              <li>Пользовательское соглашение</li>
              <li>Публичная оферта</li>
              <li>Правила интернет-эквайринга</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Контакты</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center space-x-2 text-slate-300">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>+7 (968) 000-22-27</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-300">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>hello@getmenu.ru</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-300">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Telegram: @GetMenuSupport</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-900 text-center text-xs text-slate-600">
          © 2026 GetMenu Platform. Все права защищены.
        </div>
      </footer>
    </div>
  );
}
