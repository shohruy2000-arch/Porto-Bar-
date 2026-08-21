'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Building, Info, Search, MapPin, Sparkles, Film, Play, Calendar, BookOpen, X, Utensils, Star, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { menuRepository } from '../data/localMenuRepository';
import { Dish, Category, Promotion, Story, MultilingualText } from '../types';

import { LanguageSelector } from '../components/LanguageSelector';
import { CategoryScroller } from '../components/CategoryScroller';
import { DishCard } from '../components/DishCard';
import { BottomNavBar } from '../components/BottomNavBar';
import { CallWaiterModal } from '../components/CallWaiterModal';
import { RoomServiceModal } from '../components/RoomServiceModal';
import { LoyaltyModal } from '../components/LoyaltyModal';
import { DishDetailModal } from '../components/DishDetailModal';
import { StoriesModal } from '../components/StoriesModal';
import { BookingModal } from '../components/BookingModal';
import { Footer } from '../components/Footer';
import { LegalModal, LegalTab } from '../components/LegalModal';
import { CookieBanner } from '../components/CookieBanner';

const HERO_IMAGES = [
  '/images/interior-1.jpg',
  '/images/interior-2.jpg',
  '/images/veranda-1.jpg',
  '/images/veranda-2.jpg'
];

export default function Home() {
  const { t, translate } = useLanguage();
  const { items } = useCart();
  const menuSectionRef = useRef<HTMLDivElement | null>(null);
  const isScrollingRef = useRef(false);

  // States
  const [activeSection, setActiveSection] = useState<'menu' | 'promotions'>('menu');
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isWaiterOpen, setIsWaiterOpen] = useState(false);
  const [isRoomServiceOpen, setIsRoomServiceOpen] = useState(false);
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Stories Video states
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [isStoriesModalOpen, setIsStoriesModalOpen] = useState(false);
  const [backstageVideoEnabled, setBackstageVideoEnabled] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPrintedMenuOpen, setIsPrintedMenuOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTab>('privacy');

  // Hero & Content config states
  const [heroVideoUrl, setHeroVideoUrl] = useState('');
  const [heroType, setHeroType] = useState<'video' | 'slideshow'>('slideshow');
  const [heroSlogan, setHeroSlogan] = useState<MultilingualText | null>(null);
  const [statusBannerText, setStatusBannerText] = useState<MultilingualText | null>(null);
  const [printedMenuImage, setPrintedMenuImage] = useState('/images/image_2026-07-01_13-49-49.png');

  const handleOpenLegal = (tab: LegalTab = 'privacy') => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  // Carousel refs for Recommended & Stories
  const recommendedScrollRef = useRef<HTMLDivElement | null>(null);
  const storiesScrollRef = useRef<HTMLDivElement | null>(null);

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (!ref.current) return;
    const scrollAmount = 260;
    ref.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Mouse wheel horizontal scroll listener for PC desktop
  useEffect(() => {
    const handleWheel = (el: HTMLDivElement | null, e: WheelEvent) => {
      if (!el) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 1.5;
      }
    };

    const recEl = recommendedScrollRef.current;
    const storiesEl = storiesScrollRef.current;

    const onRecWheel = (e: WheelEvent) => handleWheel(recEl, e);
    const onStoriesWheel = (e: WheelEvent) => handleWheel(storiesEl, e);

    if (recEl) {
      recEl.addEventListener('wheel', onRecWheel, { passive: false });
    }
    if (storiesEl) {
      storiesEl.addEventListener('wheel', onStoriesWheel, { passive: false });
    }

    return () => {
      if (recEl) recEl.removeEventListener('wheel', onRecWheel);
      if (storiesEl) storiesEl.removeEventListener('wheel', onStoriesWheel);
    };
  }, [dishes.length, stories.length]);

  // Mouse drag-to-scroll for desktop
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const dragDistanceRef = useRef(0);

  const onDragStart = (e: React.MouseEvent, el: HTMLDivElement | null) => {
    if (!el) return;
    isDraggingRef.current = true;
    dragDistanceRef.current = 0;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const onDragMove = (e: React.MouseEvent, el: HTMLDivElement | null) => {
    if (!isDraggingRef.current || !el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    dragDistanceRef.current += Math.abs(walk);
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const onDragEnd = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tableParam = params.get('table');
      if (tableParam) {
        localStorage.setItem('porto_table_number', tableParam);
      }
    }
  }, []);

  // Scroll tracking state for bottom navbar autohide
  const [isBottomBarVisible, setIsBottomBarVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setIsBottomBarVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsBottomBarVisible(false); // Scroll Down -> Hide
      } else {
        setIsBottomBarVisible(true);  // Scroll Up -> Show
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero slideshow index
  const [heroIndex, setHeroIndex] = useState(0);

  // Working hours and open status states
  const [workHoursStart, setWorkHoursStart] = useState('12:00');
  const [workHoursEnd, setWorkHoursEnd] = useState('24:00');
  const [isOpen, setIsOpen] = useState(true);

  // Load menu data from repository
  const loadData = async () => {
    try {
      const menuData = await menuRepository.getMenuData();
      
      setCategories(menuData.categories);
      setDishes(menuData.dishes.filter(d => d.visible));
      setPromotions(menuData.promotions.filter(p => p.active));

      // Fetch Backstage Video & Hero Content config from the api/config endpoint
      const configRes = await fetch('/api/config');
      if (configRes.ok) {
        const configData = await configRes.json();
        setBackstageVideoEnabled(configData.backstageVideoEnabled || false);
        setStories(configData.stories || []);
        setWorkHoursStart(configData.workHoursStart || '11:30');
        setWorkHoursEnd(configData.workHoursEnd || '23:30');
        setHeroVideoUrl(configData.heroVideoUrl || '');
        setHeroType(configData.heroType || 'slideshow');
        setHeroSlogan(configData.heroSlogan || null);
        setStatusBannerText(configData.statusBannerText || null);
        if (configData.printedMenuImage) {
          setPrintedMenuImage(configData.printedMenuImage);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const checkIfOpen = (start: string, end: string) => {
    try {
      const formatter = new Intl.DateTimeFormat('ru-RU', {
        timeZone: 'Europe/Moscow',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      });
      const moscowTimeStr = formatter.format(new Date()); // e.g. "12:20" or "0:20"
      const [h, m] = moscowTimeStr.split(':').map(Number);
      const currentTimeMinutes = h * 60 + m;
      
      const parseTimeToMinutes = (timeStr: string): number => {
        const parts = timeStr.split(':');
        const hh = parseInt(parts[0], 10) || 0;
        const mm = parseInt(parts[1], 10) || 0;
        return hh * 60 + mm;
      };
      
      let startMinutes = parseTimeToMinutes(start);
      let endMinutes = parseTimeToMinutes(end);
      
      if (endMinutes <= startMinutes) {
        return currentTimeMinutes >= startMinutes || currentTimeMinutes < endMinutes;
      }
      
      return currentTimeMinutes >= startMinutes && currentTimeMinutes < endMinutes;
    } catch (e) {
      console.error(e);
      return true; // fallback
    }
  };

  useEffect(() => {
    setIsOpen(checkIfOpen(workHoursStart, workHoursEnd));
    const interval = setInterval(() => {
      setIsOpen(checkIfOpen(workHoursStart, workHoursEnd));
    }, 60000);
    return () => clearInterval(interval);
  }, [workHoursStart, workHoursEnd]);

  useEffect(() => {
    loadData();

    // Listen to changes in localStorage from the admin panel (same origin tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === 'porto_menu_dishes' ||
        e.key === 'porto_menu_categories' ||
        e.key === 'porto_menu_promotions'
      ) {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Slide hero background images every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Click to open menu (instant scroll)
  const handleOpenMenuClick = () => {
    setActiveSection('menu');
    setTimeout(() => {
      menuSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSectionChange = (section: 'menu' | 'promotions') => {
    setActiveSection(section);
    setTimeout(() => {
      menuSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    isScrollingRef.current = true;

    if (categoryId === 'all') {
      const element = menuSectionRef.current;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      const element = document.getElementById(`category-section-${categoryId}`);
      if (element) {
        const yOffset = !isOpen ? -111 : -75; // Offset for sticky category bar
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }

    // Lock scroll spy until smooth scrolling ends
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 850);
  };

  const handleStoryAction = (story: Story) => {
    if (!story.actionType || story.actionType === 'none') {
      handleOpenMenuClick();
      return;
    }

    if (story.actionType === 'category' && story.actionTarget) {
      handleOpenMenuClick();
      setTimeout(() => {
        handleCategoryChange(story.actionTarget!);
      }, 200);
    } else if (story.actionType === 'booking') {
      setIsBookingOpen(true);
    } else if (story.actionType === 'cart') {
      setIsRoomServiceOpen(true);
    } else if (story.actionType === 'url' && story.actionTarget) {
      if (story.actionTarget.startsWith('http://') || story.actionTarget.startsWith('https://')) {
        window.open(story.actionTarget, '_blank');
      } else {
        window.location.href = story.actionTarget;
      }
    } else {
      handleOpenMenuClick();
    }
  };

  // Reliable Scroll Spy for active category highlighting
  useEffect(() => {
    if (activeSection !== 'menu' || categories.length === 0) return;

    const handleScrollSpy = () => {
      if (isScrollingRef.current) return;

      const sections = document.querySelectorAll('.category-section');
      let currentActive: string | null = null;
      const triggerPoint = !isOpen ? 131 : 95; // Trigger point just below sticky header (approx 75px + closed banner height)

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const rect = section.getBoundingClientRect();
        const id = section.getAttribute('data-category-id');

        // If top of the section is scrolled past the trigger point, it becomes a candidate
        if (rect.top <= triggerPoint) {
          if (id) {
            currentActive = id;
          }
        }
      }

      if (currentActive) {
        setActiveCategory(currentActive);
      } else {
        // Above the first category section, highlight 'all'
        setActiveCategory('all');
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy(); // Initialize on load

    return () => {
      window.removeEventListener('scroll', handleScrollSpy);
    };
  }, [activeSection, categories, dishes, searchQuery]);

  // Search logic across Russian, English, and Chinese
  const filteredDishes = dishes.filter((dish) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();

    const nameMatch =
      dish.name.ru.toLowerCase().includes(query) ||
      dish.name.en.toLowerCase().includes(query) ||
      dish.name.zh.toLowerCase().includes(query);

    const descMatch =
      dish.description.ru.toLowerCase().includes(query) ||
      dish.description.en.toLowerCase().includes(query) ||
      dish.description.zh.toLowerCase().includes(query);

    // Filter by matching category name as well
    const cat = categories.find((c) => c.id === dish.category);
    const catMatch = cat
      ? cat.name.ru.toLowerCase().includes(query) ||
        cat.name.en.toLowerCase().includes(query) ||
        cat.name.zh.toLowerCase().includes(query)
      : false;

    return nameMatch || descMatch || catMatch;
  });

  // Recommended dishes list (configured via admin or labeled 'recommended')
  const recommendedDishes = dishes.filter(
    (dish) => dish.visible && !dish.outOfStock && (dish.isRecommended === true || dish.labels?.includes('recommended'))
  );

  return (
    <div className="flex-1 flex flex-col pb-24 md:pb-28">
      {/* Top Sticky Status Banner (China News style with Yellow Clock) */}
      <div className="sticky top-0 z-40 bg-[#0a0d14]/95 border-b border-amber-500/20 py-2.5 px-4 shadow-[0_2px_15px_rgba(0,0,0,0.6)] flex items-center justify-center space-x-2 text-center select-none backdrop-blur-md">
        <Clock className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 shrink-0" />
        <div className="text-xs tracking-wide leading-tight flex items-center gap-1.5 flex-wrap justify-center font-sans">
          <span className="font-bold text-amber-300">
            {statusBannerText
              ? translate(statusBannerText)
              : t('promo.cookingTimeBanner').replace('{start}', workHoursStart).replace('{end}', workHoursEnd)}
          </span>
          <span className="text-amber-200/85 font-medium">
            {!isOpen ? t('promo.canPreorder') : t('promo.welcomeOrder')}
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative w-full min-h-[85vh] flex flex-col justify-between items-center text-center pb-8 overflow-hidden">
        {/* Floating printed menu button - left top corner */}
        <button
          onClick={() => setIsPrintedMenuOpen(true)}
          className="absolute safe-top-offset left-4 z-20 flex items-center space-x-1.5 bg-porto-bg/65 backdrop-blur-md border border-porto-gold/25 hover:border-porto-gold text-porto-gold-bright py-2.5 px-3.5 rounded-full text-[10px] uppercase font-bold tracking-wider active:scale-95 transition-all cursor-pointer shadow-lg"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{t('menu.printed')}</span>
        </button>

        {/* Floating Language Switcher - scrolls away with hero to prevent category overlapping */}
        <div className="absolute safe-top-offset right-4 z-20">
          <LanguageSelector className="relative z-20" />
        </div>
        {/* Background Video or Slideshow */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {heroType === 'video' && heroVideoUrl ? (
            <video
              src={heroVideoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover scale-105"
            />
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={heroIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 0.5, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={HERO_IMAGES[heroIndex]}
                  alt="Porto Bar Ambient Photo"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          )}
          {/* Dark luxury overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-porto-bg/85 via-porto-bg/60 to-porto-bg z-0" />
        </div>

        {/* Top Header Logo */}
        <div className="z-10 flex flex-col items-center" style={{ marginTop: 'calc(40px + env(safe-area-inset-top, 0px))' }}>
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-44 h-16"
          >
            <img
              src="/images/porto-logo.jpg?v=2"
              alt="PORTO-BAR"
              className="w-full h-full object-contain invert mix-blend-screen filter brightness-150 contrast-125"
            />
          </motion.div>
          {/* Subtitle / Location indicator */}
          <p className="text-[10px] tracking-[0.25em] text-porto-gold font-bold uppercase mt-2.5">
            Hotel Astrus • Moscow
          </p>
        </div>

        {/* Center Slogan */}
        <div className="z-10 px-6 max-w-lg min-h-[160px] flex flex-col justify-center items-center mt-8 md:mt-12">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative px-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-center max-w-md"
          >
            <h1 
              className="text-[13px] md:text-base font-serif text-gray-300 leading-relaxed italic select-none"
              dangerouslySetInnerHTML={{ 
                __html: heroSlogan ? translate(heroSlogan) : t('hero.slogan') 
              }}
            />
          </motion.div>
          <div className="flex justify-center mt-4">
            <span className="w-16 h-[1px] bg-porto-gold/30"></span>
          </div>
        </div>

        {/* Bottom Hero Buttons & Stories */}
        <div className="z-10 w-full px-6 max-w-md space-y-5 mt-6">
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            onClick={handleOpenMenuClick}
            className="w-full bg-gradient-to-r from-porto-gold-dark via-porto-gold to-porto-gold-bright text-porto-bg font-black py-4 rounded-full text-xs tracking-[0.2em] uppercase active:scale-95 transition-all shadow-xl hover:shadow-porto-gold/15 cursor-pointer"
          >
            {t('hero.openMenu')}
          </motion.button>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            onClick={() => setIsBookingOpen(true)}
            className="w-full flex items-center justify-center space-x-2 border border-porto-gold/30 hover:border-porto-gold-bright bg-porto-bg/60 text-porto-gold-bright font-black py-4 rounded-full text-xs tracking-[0.2em] uppercase active:scale-95 transition-all shadow-lg hover:bg-porto-gold/5 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-porto-gold-bright animate-pulse" />
            <span>{t('booking.btn')}</span>
          </motion.button>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            onClick={() => setIsPrintedMenuOpen(true)}
            className="w-full flex items-center justify-center space-x-2 border border-white/10 hover:border-porto-gold bg-porto-bg/60 text-white font-black py-4 rounded-full text-xs tracking-[0.2em] uppercase active:scale-95 transition-all shadow-lg hover:bg-white/5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-porto-gold-bright" />
            <span>{t('menu.printed')}</span>
          </motion.button>

          {/* Stories & News Cards (China News Style Carousel) */}
          {backstageVideoEnabled && stories.length > 0 && (
            <div className="w-full pt-2 pb-2">
              <div className="flex items-center justify-between px-1 mb-3.5">
                <h3 className="text-xs sm:text-sm font-bold font-serif uppercase tracking-[0.2em] text-porto-gold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-porto-gold-bright animate-pulse" />
                  <span>{t('stories.newsTitle')}</span>
                </h3>
                {/* Desktop Navigation Scroll Controls */}
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => scrollCarousel(storiesScrollRef, 'left')}
                    className="p-1.5 rounded-full bg-white/5 hover:bg-porto-gold/25 border border-white/10 hover:border-porto-gold/50 text-gray-300 hover:text-porto-gold-bright transition-all cursor-pointer shadow-sm active:scale-95"
                    title="Назад"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollCarousel(storiesScrollRef, 'right')}
                    className="p-1.5 rounded-full bg-white/5 hover:bg-porto-gold/25 border border-white/10 hover:border-porto-gold/50 text-gray-300 hover:text-porto-gold-bright transition-all cursor-pointer shadow-sm active:scale-95"
                    title="Вперед"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div
                ref={storiesScrollRef}
                onMouseDown={(e) => onDragStart(e, storiesScrollRef.current)}
                onMouseMove={(e) => onDragMove(e, storiesScrollRef.current)}
                onMouseUp={onDragEnd}
                onMouseLeave={onDragEnd}
                className="flex gap-3 overflow-x-auto stories-scrollbar pb-4 pt-1 w-full snap-x snap-mandatory px-0.5 cursor-grab active:cursor-grabbing select-none"
              >
                {stories.map((story, index) => {
                  if (!story.enabled) return null;
                  const isVideo = Boolean(story.videoUrl && story.videoUrl.trim() !== '');
                  const mediaUrl = isVideo ? story.videoUrl : (story.imageUrl || story.previewUrl || '');
                  return (
                    <div
                      key={story.id}
                      onClick={() => {
                        if (dragDistanceRef.current > 6) return;
                        setActiveStoryIndex(index);
                        setIsStoriesModalOpen(true);
                      }}
                      className="story-animated-border h-48 w-32 md:h-56 md:w-36 shrink-0 cursor-pointer snap-start group"
                    >
                      <div className="story-card-inner flex flex-col justify-between p-3">
                        {/* Media Background: Video or Image */}
                        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                          {isVideo ? (
                            <video
                              src={mediaUrl}
                              autoPlay
                              muted
                              loop
                              playsInline
                              className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <img
                              src={mediaUrl}
                              alt={translate(story.title)}
                              className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                            />
                          )}
                        </div>

                        {/* High Contrast Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/60 z-10 pointer-events-none" />

                        {/* Top Badge & Title on poster */}
                        <div className="relative z-20 flex flex-col items-start space-y-1">
                          {story.badge && (
                            <span className="text-[8px] font-black uppercase tracking-wider text-porto-bg bg-gradient-to-r from-porto-gold via-porto-gold-bright to-amber-300 px-2 py-0.5 rounded-full shadow-md">
                              {translate(story.badge)}
                            </span>
                          )}
                          <h4 className="text-[11px] md:text-xs font-black uppercase text-amber-300 font-serif leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] line-clamp-2">
                            {translate(story.title)}
                          </h4>
                        </div>

                        {/* Bottom Info badge & Play icon */}
                        <div className="relative z-20 flex items-center justify-between pt-1">
                          <span className="text-[8px] font-bold text-white/90 uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-md">
                            {isVideo ? 'Видео' : 'Инфо'}
                          </span>
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-porto-gold-dark to-amber-300 text-porto-bg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-2.5 h-2.5 fill-current translate-x-[0.5px]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Location & Quick Actions Info Box (Centered spacing under Stories) */}
          <div className="w-full pt-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="glass-panel rounded-2xl p-3.5 border border-porto-gold/20 bg-porto-card/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md space-y-2.5 text-center w-full"
            >
              {/* Location Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-porto-gold/10 border border-porto-gold/20 rounded-full mx-auto">
                <MapPin className="w-3.5 h-3.5 text-porto-gold shrink-0" />
                <span className="text-[9px] font-black text-porto-gold-bright uppercase tracking-widest leading-tight">
                  {t('info.location')}
                </span>
              </div>

              <div className="h-[1px] bg-gradient-to-r from-transparent via-porto-gold/25 to-transparent w-full"></div>

              {/* Quick Actions (Call & Room Order) */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Phone Link */}
                <a
                  href="tel:+74957978566"
                  className="flex items-center justify-center gap-2 py-2 px-2.5 bg-white/5 hover:bg-porto-gold/10 border border-white/5 hover:border-porto-gold/20 rounded-xl transition-all duration-300 group cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-porto-gold group-hover:scale-110 transition-transform shrink-0" />
                  <span className="text-[10px] font-black text-gray-200 tracking-wider font-sans group-hover:text-white truncate">
                    +7 (495) 797-85-66
                  </span>
                </a>

                {/* Room order badge */}
                <div className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-white/5 border border-white/5 rounded-xl select-none">
                  <Building className="w-3.5 h-3.5 text-porto-gold shrink-0" />
                  <span className="text-[10px] font-black text-gray-200 tracking-wider truncate">
                    {t('info.roomOrder')}{' '}
                    <span className="text-porto-gold-bright font-serif font-black">2227</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recommended Dishes Carousel (Рекомендуем - China News style) */}
          {recommendedDishes.length > 0 && (
            <div className="w-full pt-2 pb-1 text-left">
              <div className="flex items-center justify-between px-1 mb-2.5">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-white">
                    {t('menu.recommended')}
                  </h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-porto-gold animate-pulse" />
                </div>
                {/* Desktop Navigation Scroll Controls */}
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => scrollCarousel(recommendedScrollRef, 'left')}
                    className="p-1.5 rounded-full bg-white/5 hover:bg-porto-gold/25 border border-white/10 hover:border-porto-gold/50 text-gray-300 hover:text-porto-gold-bright transition-all cursor-pointer shadow-sm active:scale-95"
                    title="Назад"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollCarousel(recommendedScrollRef, 'right')}
                    className="p-1.5 rounded-full bg-white/5 hover:bg-porto-gold/25 border border-white/10 hover:border-porto-gold/50 text-gray-300 hover:text-porto-gold-bright transition-all cursor-pointer shadow-sm active:scale-95"
                    title="Вперед"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[9px] font-bold text-porto-gold uppercase tracking-widest bg-porto-gold/10 px-2 py-0.5 rounded-full border border-porto-gold/20">
                    {recommendedDishes.length}
                  </span>
                </div>
              </div>

              <div
                ref={recommendedScrollRef}
                onMouseDown={(e) => onDragStart(e, recommendedScrollRef.current)}
                onMouseMove={(e) => onDragMove(e, recommendedScrollRef.current)}
                onMouseUp={onDragEnd}
                onMouseLeave={onDragEnd}
                className="flex gap-2.5 overflow-x-auto stories-scrollbar pb-3 w-full snap-x snap-mandatory px-0.5 cursor-grab active:cursor-grabbing select-none"
              >
                {recommendedDishes.map((dish) => (
                  <div
                    key={dish.id}
                    onClick={() => {
                      if (dragDistanceRef.current > 6) return;
                      setSelectedDish(dish);
                      setIsDetailOpen(true);
                    }}
                    className="group relative bg-[#131722]/95 hover:bg-[#181d2a] border border-white/10 hover:border-porto-gold/40 rounded-2xl p-2.5 w-28 sm:w-32 shrink-0 flex flex-col justify-between cursor-pointer transition-all duration-300 active:scale-95 snap-start shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
                  >
                    {/* Dish image container */}
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black/60 flex items-center justify-center pointer-events-none">
                      {/* Ambient warm glow behind dish */}
                      <div className="absolute inset-0 bg-radial from-amber-500/20 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                      {dish.image ? (
                        <img
                          src={dish.image}
                          alt={translate(dish.name)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10"
                        />
                      ) : (
                        <Utensils className="w-6 h-6 text-porto-gold/40 relative z-10" />
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="text-[11px] font-bold text-gray-200 group-hover:text-white leading-tight line-clamp-2 mt-2 min-h-[28px] text-center pointer-events-none">
                      {translate(dish.name)}
                    </h4>

                    {/* Price */}
                    <div className="mt-1 text-center pointer-events-none">
                      <span className="text-xs font-black text-porto-gold-bright tracking-tight font-sans">
                        {dish.price} ₽
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Sections (Menu / Promotions) */}
      <div ref={menuSectionRef} className="w-full max-w-md mx-auto px-4 mt-6">
        
        {activeSection === 'menu' ? (
          /* MENU VIEW */
          <div className="space-y-5">
            {/* Search Input Box */}
            <div className="relative">
              <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4 h-4 text-porto-gold/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('ui.search')}
                className="w-full bg-porto-card/50 border border-porto-gold/15 rounded-full pl-11 pr-4 py-3 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-porto-gold-bright focus:bg-porto-card/75 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white flex items-center"
                >
                  <span className="text-xs uppercase font-bold tracking-wider">{t('admin.cancel')}</span>
                </button>
              )}
            </div>

            {/* Category Scroller */}
            {categories.length > 0 && (
              <CategoryScroller
                categories={[{ id: 'all', name: { ru: 'Все блюда', en: 'All items', zh: '全部' } }, ...categories]}
                activeCategoryId={activeCategory}
                onCategoryChange={handleCategoryChange}
                isRestaurantClosed={!isOpen}
              />
            )}

            {/* Dishes Sections by Category */}
            <div className="space-y-8">
              {categories.map((category) => {
                const categoryDishes = filteredDishes.filter((dish) => dish.category === category.id);
                if (categoryDishes.length === 0) return null;
                return (
                  <div 
                    key={category.id} 
                    id={`category-section-${category.id}`}
                    data-category-id={category.id}
                    className={`category-section space-y-4 ${!isOpen ? 'scroll-mt-[111px]' : 'scroll-mt-[75px]'}`}
                  >
                    <div className="flex items-center space-x-2 border-b border-porto-gold/10 pb-2">
                      <span className="w-1.5 h-4 bg-porto-gold rounded-full"></span>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-porto-gold-bright">
                        {translate(category.name)}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 gap-5">
                      {categoryDishes.map((dish) => (
                        <DishCard 
                          key={dish.id} 
                          dish={dish} 
                          onCardClick={() => {
                            setSelectedDish(dish);
                            setIsDetailOpen(true);
                          }} 
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {filteredDishes.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <Info className="w-8 h-8 mx-auto text-gray-600 mb-2 stroke-1" />
                  <p className="text-sm font-semibold">{t('ui.noItems')}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* PROMOTIONS VIEW */
          <div className="space-y-6">
            <div className="flex items-center space-x-2.5 mb-2">
              <Sparkles className="w-5 h-5 text-porto-gold" />
              <h2 className="text-xl font-bold font-serif text-gold-gradient tracking-wide">
                {t('nav.promotions')}
              </h2>
            </div>
            
            {promotions.length > 0 ? (
              promotions.map((promo) => (
                <motion.div
                  key={promo.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel rounded-2xl overflow-hidden border border-porto-gold/20 bg-porto-card"
                >
                  {promo.image && (
                    <div className="relative aspect-[16/9] w-full bg-porto-bg">
                      {promo.image.startsWith('/uploads/') ? (
                        <img
                          src={promo.image}
                          alt={translate(promo.title)}
                          className="object-cover w-full h-full absolute inset-0"
                        />
                      ) : (
                        <Image
                          src={promo.image}
                          alt={translate(promo.title)}
                          fill
                          sizes="(max-width: 500px) 100vw, 500px"
                          loading="lazy"
                          className="object-cover"
                        />
                      )}
                      {/* Smooth shadow overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-porto-bg via-transparent to-transparent opacity-60" />
                    </div>
                  )}
                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-porto-gold-bright font-serif">
                      {translate(promo.title)}
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed font-light">
                      {translate(promo.description)}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16 text-gray-500">
                <Info className="w-8 h-8 mx-auto text-gray-600 mb-2 stroke-1" />
                <p className="text-sm font-semibold">{t('ui.noItems')}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky persistent Bottom Mobile Navigation Dock */}
      <BottomNavBar
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        onCallWaiterClick={() => setIsWaiterOpen(true)}
        onRoomServiceClick={() => setIsRoomServiceOpen(true)}
        onLoyaltyClick={() => setIsLoyaltyOpen(true)}
        visible={isBottomBarVisible}
      />

      {/* Waiter Calling Drawer overlay */}
      <CallWaiterModal isOpen={isWaiterOpen} onClose={() => setIsWaiterOpen(false)} />

      {/* Room Service Cart Drawer overlay */}
      <RoomServiceModal isOpen={isRoomServiceOpen} onClose={() => setIsRoomServiceOpen(false)} />

      {/* Loyalty Modal overlay */}
      <LoyaltyModal
        isOpen={isLoyaltyOpen}
        onClose={() => setIsLoyaltyOpen(false)}
        onRepeatOrderSuccess={() => {
          setIsLoyaltyOpen(false);
          setIsRoomServiceOpen(true);
        }}
      />

      {/* Dish Detailed Drawer overlay */}
      <DishDetailModal 
        dish={selectedDish} 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        allDishes={filteredDishes} 
        onNavigate={setSelectedDish} 
      />

      {/* Full Screen Stories Modal */}
      <StoriesModal
        stories={stories}
        initialIndex={activeStoryIndex}
        isOpen={isStoriesModalOpen}
        onClose={() => setIsStoriesModalOpen(false)}
        onAction={handleStoryAction}
      />

      {/* Booking Table Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* Printed Menu Modal Overlay */}
      <AnimatePresence>
        {isPrintedMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrintedMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-4 md:inset-10 z-50 flex flex-col glass-panel border border-porto-gold/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.85)] max-w-5xl mx-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-porto-card/50">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-porto-gold" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-porto-gold-bright">
                    {t('menu.printedSubtitle')}
                  </h3>
                </div>
                <button
                  onClick={() => setIsPrintedMenuOpen(false)}
                  className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Image Container with Scroll/Zoom instruction */}
              <div className="flex-1 overflow-auto bg-porto-bg/30 p-4 flex justify-center items-start scrollbar-thin">
                <div className="relative max-w-full">
                  <img
                    src={printedMenuImage || "/images/image_2026-07-01_13-49-49.png"}
                    alt="Printed Menu"
                    className="max-w-full h-auto rounded-xl border border-white/5 shadow-2xl select-none"
                  />
                </div>
              </div>

              {/* Footer instruction */}
              <div className="px-6 py-3 bg-porto-card/25 border-t border-white/5 text-center text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                {t('menu.printedHint')}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Legal Footer */}
      <Footer onOpenLegal={handleOpenLegal} />

      {/* Legal Documents Modal (152-FZ, Terms, Requisites, Refund, Alcohol) */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        initialTab={legalTab}
      />

      {/* Cookie Consent Banner (152-FZ) */}
      <CookieBanner onOpenPrivacy={() => handleOpenLegal('privacy')} />
    </div>
  );
}

