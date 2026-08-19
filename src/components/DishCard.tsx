'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, Check, Clock, Sparkles, Flame, Leaf } from 'lucide-react';
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

interface DishCardProps {
  dish: Dish;
  onCardClick?: () => void;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, onCardClick }) => {
  const { t, translate } = useLanguage();
  const { addToCart, items } = useCart();

  // Check if this item is in the cart and get its quantity
  const cartItem = items.find((item) => item.dish.id === dish.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const isOutOfStock = dish.outOfStock || (dish.quantityLimit !== undefined && dish.quantityLimit !== null && dish.quantityLimit <= 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening modal when clicking card body
    addToCart(dish);
  };

  // Map labels to icons and colors
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
    <div
      onClick={onCardClick}
      className="glass-panel glass-panel-hover rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full bg-porto-card/85"
    >
      {/* Image / Placeholder Area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-porto-bg/50">
        {dish.image ? (
          (dish.image.startsWith('data:') || dish.image.startsWith('/uploads/')) ? (
            <img
              src={dish.image}
              alt={translate(dish.name)}
              loading="lazy"
              className="object-cover w-full h-full absolute inset-0 transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <Image
              src={dish.image}
              alt={translate(dish.name)}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          )
        ) : (
          <PlaceholderImage className="w-full h-full" />
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
            <span className="bg-red-600/90 text-white font-black text-[10px] uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-red-500/40 shadow-lg">
              {t('status.outOfStock')}
            </span>
          </div>
        )}

        {/* Quantity Limit badge */}
        {!isOutOfStock && dish.quantityLimit !== undefined && dish.quantityLimit !== null && dish.quantityLimit > 0 && (
          <div className="absolute bottom-2.5 left-2.5 z-10 bg-porto-bg/85 backdrop-blur-sm border border-porto-gold/25 px-2 py-0.5 rounded-md text-[9px] font-bold text-porto-gold-bright shadow-md flex items-center gap-1 animate-pulse">
            <span>{t('label.itemsLeft').replace('{qty}', String(dish.quantityLimit))}</span>
          </div>
        )}

        {/* Labels Overlays */}
        {dish.labels && dish.labels.length > 0 && (
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 max-w-[85%]">
            {dish.labels.map((label) => {
              const badge = getBadgeStyle(label);
              return (
                <span
                  key={label}
                  className={`flex items-center px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-semibold shadow-md ${badge.className}`}
                >
                  {badge.icon}
                  {badge.text}
                </span>
              );
            })}
          </div>
        )}

        {/* Quick Quantity Badge in top-right */}
        {quantityInCart > 0 && (
          <div className="absolute top-2.5 right-2.5 bg-porto-gold-bright text-porto-bg text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border border-porto-bg">
            {quantityInCart}
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex justify-between items-start space-x-2">
            <h3 className="font-bold text-base text-gray-100 font-serif leading-tight">
              {translate(dish.name)}
            </h3>
            <div className="flex flex-col items-end shrink-0 space-y-1 mt-0.5">
              <span className="text-xs font-bold text-porto-gold/90">
                {formatWeight(dish.weight)}
              </span>
              {dish.prepTime ? (
                <span className="text-[9px] text-gray-400 font-semibold flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5 text-porto-gold" />
                  {dish.prepTime} {t('label.mins')}
                </span>
              ) : null}
            </div>
          </div>
          
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {translate(dish.description)}
          </p>
          
          {dish.kbju && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1.5 text-[10px] text-gray-400 font-semibold tracking-wide">
              <span className="text-porto-gold">{dish.kbju.calories} {t('detail.caloriesValueShort')}</span>
              <span className="opacity-40">•</span>
              <span>{t('detail.proteinsShort')} {dish.kbju.proteins}{t('detail.gramsValueShort')}</span>
              <span className="opacity-40">•</span>
              <span>{t('detail.fatsShort')} {dish.kbju.fats}{t('detail.gramsValueShort')}</span>
              <span className="opacity-40">•</span>
              <span>{t('detail.carbsShort')} {dish.kbju.carbs}{t('detail.gramsValueShort')}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3.5 mt-3 border-t border-white/10">
          <div>
            <span className="text-xs text-gray-400 font-medium block leading-none mb-1.5">
              {t('label.price')}
            </span>
            <span className="text-lg font-black text-porto-gold font-serif">
              {dish.price} {t('label.rub')}
            </span>
          </div>

          {isOutOfStock ? (
            <button
              disabled
              className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-500 text-[10px] font-black uppercase tracking-wider cursor-not-allowed select-none"
            >
              {t('status.soldOut')}
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`p-3 rounded-xl border-1.5 transition-all duration-300 flex items-center justify-center cursor-pointer ${
                quantityInCart > 0
                  ? 'bg-porto-gold/25 border-porto-gold text-porto-gold-bright shadow-inner scale-105'
                  : 'border-porto-gold/35 hover:border-porto-gold hover:bg-porto-gold/5 text-porto-gold'
              }`}
            >
              {quantityInCart > 0 ? <Check className="w-4 h-4 stroke-[3px]" /> : <Plus className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
