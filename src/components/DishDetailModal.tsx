'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, ChevronLeft, ChevronRight, Check, Sparkles, Clock, Leaf, Flame } from 'lucide-react';
import { Dish, DishLabel } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { PlaceholderImage } from './PlaceholderImage';

const formatWeight = (w: string | number) => {
  if (!w) return '';
  const wStr = String(w).trim();
  if (!wStr) return '';
  const lower = wStr.toLowerCase();
  if (lower.endsWith('г') || lower.endsWith('гр') || lower.endsWith('мл') || lower.endsWith('g') || lower.endsWith('ml') || lower.endsWith('шт') || lower.endsWith('гр.')) {
    return wStr;
  }
  return `${wStr} гр`;
};

interface DishDetailModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
  allDishes: Dish[];
  onNavigate: (dish: Dish) => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({
  dish,
  isOpen,
  onClose,
  allDishes,
  onNavigate
}) => {
  const { t, translate } = useLanguage();
  const { addToCart, items } = useCart();
  const touchStartX = useRef(0);

  // Lock body scroll when dish modal is open
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isOpen && dish) {
      const scrollY = window.scrollY;
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen, dish]);

  if (!dish) return null;

  const cartItem = items.find((item) => item.dish.id === dish.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const isOutOfStock = dish.outOfStock || (dish.quantityLimit !== undefined && dish.quantityLimit !== null && dish.quantityLimit <= 0);

  const handleAddToCart = () => {
    addToCart(dish);
  };

  // Navigations
  const handleNext = () => {
    const currentIndex = allDishes.findIndex((d) => d.id === dish.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % allDishes.length;
    onNavigate(allDishes[nextIndex]);
  };

  const handlePrev = () => {
    const currentIndex = allDishes.findIndex((d) => d.id === dish.id);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + allDishes.length) % allDishes.length;
    onNavigate(allDishes[prevIndex]);
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;
    // Swipe threshold 60px
    if (Math.abs(diff) > 60) {
      if (diff < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Badges helper
  const getBadgeStyle = (label: DishLabel) => {
    switch (label) {
      case 'new':
        return {
          text: t('label.new'),
          className: 'bg-amber-500 text-slate-950 font-bold border border-amber-400',
          icon: <Sparkles className="w-3 h-3 mr-0.5" />
        };
      case 'bestseller':
        return {
          text: t('label.bestseller'),
          className: 'bg-red-500 text-white font-bold border border-red-400',
          icon: <Clock className="w-3 h-3 mr-0.5" />
        };
      case 'recommended':
        return {
          text: t('label.recommended'),
          className: 'bg-porto-gold-bright text-slate-950 font-bold border border-yellow-300',
          icon: <Clock className="w-3 h-3 mr-0.5" />
        };
      case 'vegetarian':
        return {
          text: t('label.vegetarian'),
          className: 'bg-emerald-600 text-white font-bold border border-emerald-500',
          icon: <Leaf className="w-3 h-3 mr-0.5" />
        };
      case 'spicy':
        return {
          text: t('label.spicy'),
          className: 'bg-orange-600 text-white font-bold border border-orange-500',
          icon: <Flame className="w-3 h-3 mr-0.5" />
        };
      default:
        return { text: '', className: '', icon: null };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md"
          />

          {/* Slide up Detail Dialog */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto rounded-t-3xl glass-panel border-t border-porto-gold/35 shadow-[0_-15px_40px_rgba(0,0,0,0.9)] overflow-y-auto max-h-[92vh] select-none"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/45 hover:bg-black/60 p-2 rounded-full transition-colors z-20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Carousel navigation chevrons for Desktop / click fallback */}
            {allDishes.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/3 -translate-y-1/2 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 p-2.5 rounded-full transition-all z-20 cursor-pointer shadow-lg active:scale-90"
                  title={t('detail.prev')}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/3 -translate-y-1/2 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 p-2.5 rounded-full transition-all z-20 cursor-pointer shadow-lg active:scale-90"
                  title={t('detail.next')}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Large Image/Placeholder */}
            <div className="relative aspect-[4/3.5] w-full overflow-hidden bg-porto-bg border-b border-porto-gold/15">
              {dish.image ? (
                (dish.image.startsWith('data:') || dish.image.startsWith('/uploads/')) ? (
                  <img
                    src={dish.image}
                    alt={translate(dish.name)}
                    className="object-cover w-full h-full absolute inset-0"
                  />
                ) : (
                  <Image
                    src={dish.image}
                    alt={translate(dish.name)}
                    fill
                    sizes="(max-width: 500px) 100vw, 500px"
                    className="object-cover"
                  />
                )
              ) : (
                <PlaceholderImage className="w-full h-full" />
              )}

              {/* Big Badge Overlay list */}
              {dish.labels && dish.labels.length > 0 && (
                <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10">
                  {dish.labels.map((label) => {
                    const badge = getBadgeStyle(label);
                    return (
                      <span
                        key={label}
                        className={`flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-black shadow-md ${badge.className}`}
                      >
                        {badge.icon}
                        {badge.text}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Swipe suggestion banner inside image */}
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-[8px] tracking-[0.2em] font-black uppercase text-porto-gold px-2.5 py-1 rounded-full pointer-events-none">
                {t('detail.swipe')}
              </div>

              {/* Out of Stock Overlay */}
              {isOutOfStock && (
                <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                  <span className="bg-red-600/90 text-white font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full border border-red-500/40 shadow-lg">
                    {t('status.outOfStock')}
                  </span>
                </div>
              )}
            </div>

            {/* Details Content */}
            <div className="p-6 pb-8 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <h2 className="text-2xl font-bold font-serif text-gold-gradient leading-tight">
                    {translate(dish.name)}
                  </h2>
                  <div className="flex flex-col items-end shrink-0 ml-4 space-y-1">
                    <span className="text-sm font-semibold text-porto-gold/90">
                      {formatWeight(dish.weight)}
                    </span>
                    {dish.prepTime ? (
                      <span className="text-[11px] text-gray-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-porto-gold" />
                        {dish.prepTime} {t('label.mins')}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="w-12 h-0.5 bg-porto-gold/30"></div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-porto-gold">
                  {t('detail.description')}
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed font-light">
                  {translate(dish.description)}
                </p>
                {dish.prepTime ? (
                  <p className="text-[10px] text-gray-400/70 italic font-light pt-1 border-t border-white/5">
                    {t('label.prepTimeNotice')}
                  </p>
                ) : null}
              </div>

              {/* KBJU Block */}
              {dish.kbju && (
                <div className="space-y-3 border-t border-white/5 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-porto-gold">
                    {t('detail.nutrition')}
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="flex items-center justify-between bg-white/5 border border-porto-gold/20 rounded-xl px-4.5 py-2.5">
                      <span className="text-xs font-medium text-gray-300">{t('detail.calories')}</span>
                      <span className="text-xs font-black text-porto-gold-bright font-serif">{dish.kbju.calories} {t('detail.caloriesValueShort')}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 border border-porto-gold/20 rounded-xl px-4.5 py-2.5">
                      <span className="text-xs font-medium text-gray-300">{t('detail.proteins')}</span>
                      <span className="text-xs font-black text-porto-gold-bright font-serif">{dish.kbju.proteins} {t('detail.gramsValueShort')}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 border border-porto-gold/20 rounded-xl px-4.5 py-2.5">
                      <span className="text-xs font-medium text-gray-300">{t('detail.fats')}</span>
                      <span className="text-xs font-black text-porto-gold-bright font-serif">{dish.kbju.fats} {t('detail.gramsValueShort')}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 border border-porto-gold/20 rounded-xl px-4.5 py-2.5">
                      <span className="text-xs font-medium text-gray-300">{t('detail.carbs')}</span>
                      <span className="text-xs font-black text-porto-gold-bright font-serif">{dish.kbju.carbs} {t('detail.gramsValueShort')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Remaining quantity limit banner */}
              {!isOutOfStock && dish.quantityLimit !== undefined && dish.quantityLimit !== null && dish.quantityLimit > 0 && (
                <div className="bg-porto-gold/10 border border-porto-gold/25 p-3 rounded-xl flex items-center justify-between text-xs text-porto-gold-bright font-bold">
                  <span>{t('detail.available')}</span>
                  <span className="bg-porto-gold/20 px-2 py-0.5 rounded border border-porto-gold/30">
                    {t('label.itemsLeft').replace('{qty}', String(dish.quantityLimit))}
                  </span>
                </div>
              )}

              {/* Pricing & Add to cart button */}
              <div className="flex items-center justify-between border-t border-porto-gold/15 pt-5 mt-4">
                <div>
                  <span className="text-xs text-gray-400 font-semibold block uppercase tracking-wider mb-0.5">
                    {t('label.price')}
                  </span>
                  <span className="text-2xl font-bold text-porto-gold-bright font-serif">
                    {dish.price} {t('label.rub')}
                  </span>
                </div>

                {isOutOfStock ? (
                  <button
                    disabled
                    className="flex items-center space-x-2 bg-white/5 border border-white/5 text-gray-500 font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-widest cursor-not-allowed select-none animate-pulse-subtle"
                  >
                    <span>{t('status.soldOut')}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center space-x-2 bg-gradient-to-r from-porto-gold-dark via-porto-gold to-porto-gold-bright text-porto-bg font-black px-6 py-3.5 rounded-xl active:scale-95 transition-all shadow-lg hover:shadow-porto-gold/10 text-xs tracking-widest uppercase cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-porto-bg stroke-[2.5px]" />
                    <span>{t('cart.addToCart')}</span>
                    {quantityInCart > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 bg-porto-bg text-porto-gold-bright rounded-md text-[10px] font-black border border-porto-gold-bright/35">
                        {quantityInCart}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
