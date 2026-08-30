'use client';

import React from 'react';
import { X, Check, Star, Sparkles, Plus, Minus, ShoppingBag } from 'lucide-react';
import { ShowcaseDish, ShowcaseRestaurantData } from '../types';

interface Props {
  dish: ShowcaseDish | null;
  restaurant: ShowcaseRestaurantData;
  onClose: () => void;
  onAddToCart?: (dish: ShowcaseDish, quantity: number, selectedOptions?: string[]) => void;
}

export function ShowcaseDishDetailModal({ dish, restaurant, onClose, onAddToCart }: Props) {
  const [quantity, setQuantity] = React.useState(1);
  const [selectedOptions, setSelectedOptions] = React.useState<Record<string, string>>({});
  const [addedSuccess, setAddedSuccess] = React.useState(false);

  React.useEffect(() => {
    if (dish && dish.options) {
      const initial: Record<string, string> = {};
      dish.options.forEach((opt) => {
        if (opt.choices.length > 0) {
          initial[opt.title] = opt.choices[0].name;
        }
      });
      setSelectedOptions(initial);
    }
    setQuantity(1);
    setAddedSuccess(false);
  }, [dish]);

  if (!dish) return null;

  const calculateTotalPrice = () => {
    let base = dish.price;
    if (dish.options) {
      dish.options.forEach((opt) => {
        const choiceName = selectedOptions[opt.title];
        const choice = opt.choices.find((c) => c.name === choiceName);
        if (choice && choice.extraPrice) {
          base += choice.extraPrice;
        }
      });
    }
    return base * quantity;
  };

  const handleAdd = () => {
    setAddedSuccess(true);
    if (onAddToCart) {
      onAddToCart(dish, quantity, Object.values(selectedOptions));
    }
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border-2 flex flex-col max-h-[90vh]"
        style={{
          background: restaurant.colors.surface,
          borderColor: restaurant.colors.border,
          boxShadow: `0 25px 60px rgba(0,0,0,0.9), 0 0 35px ${restaurant.colors.primaryGlow}`,
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black text-white/80 hover:text-white transition-all cursor-pointer backdrop-blur-sm"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dish Image */}
        <div className="relative h-60 sm:h-72 w-full overflow-hidden shrink-0 bg-black">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to top, ${restaurant.colors.surface} 0%, transparent 60%)`,
            }}
          />

          {dish.badge && (
            <div
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border shadow-lg"
              style={{
                backgroundColor: restaurant.colors.badgeBg,
                borderColor: restaurant.colors.primary,
                color: restaurant.colors.badgeText,
              }}
            >
              {dish.badge}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-serif leading-tight">
                {dish.name}
              </h3>
              {dish.tagline && (
                <p className="text-xs sm:text-sm font-medium mt-1" style={{ color: restaurant.colors.primary }}>
                  {dish.tagline}
                </p>
              )}
            </div>

            <div className="text-right shrink-0">
              <div className="text-xl sm:text-2xl font-black text-white">
                {dish.price} ₽
              </div>
              {dish.weight && (
                <div className="text-[11px] text-slate-400 font-medium">
                  {dish.weight}
                </div>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            {dish.desc}
          </p>

          {/* Options (e.g. прожарка, сырный бортик, порции) */}
          {dish.options && dish.options.map((opt, oi) => (
            <div key={oi} className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {opt.title}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {opt.choices.map((choice, ci) => {
                  const isSelected = selectedOptions[opt.title] === choice.name;
                  return (
                    <button
                      key={ci}
                      type="button"
                      onClick={() =>
                        setSelectedOptions((prev) => ({ ...prev, [opt.title]: choice.name }))
                      }
                      className={`p-2.5 rounded-xl text-xs font-bold text-left transition-all border flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-2 text-white shadow-md'
                          : 'border-white/10 text-slate-400 hover:text-white'
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? restaurant.colors.surfaceElevated
                          : 'transparent',
                        borderColor: isSelected ? restaurant.colors.primary : 'rgba(255,255,255,0.1)',
                      }}
                    >
                      <span>{choice.name}</span>
                      {choice.extraPrice ? (
                        <span className="text-[10px] opacity-80">+{choice.extraPrice} ₽</span>
                      ) : (
                        isSelected && <Check className="w-3.5 h-3.5" style={{ color: restaurant.colors.primary }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div
          className="p-4 sm:p-5 border-t shrink-0 flex items-center justify-between gap-4"
          style={{
            borderColor: restaurant.colors.border,
            background: restaurant.colors.surfaceElevated,
          }}
        >
          {/* Quantity Controls */}
          <div className="flex items-center space-x-2 bg-black/40 rounded-2xl p-1 border border-white/10">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-bold text-white text-sm">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAdd}
            className="flex-1 py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-95 cursor-pointer text-slate-950"
            style={{
              background: addedSuccess
                ? '#10b981'
                : `linear-gradient(90deg, ${restaurant.colors.primary}, ${restaurant.colors.secondary})`,
            }}
          >
            {addedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span className="text-white">Добавлено в заказ!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-slate-950" />
                <span>Заказать • {calculateTotalPrice()} ₽</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
