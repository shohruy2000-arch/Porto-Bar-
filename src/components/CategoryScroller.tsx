'use client';

import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Category } from '../types';
import { motion } from 'framer-motion';

interface CategoryScrollerProps {
  categories: Category[];
  activeCategoryId: string;
  onCategoryChange: (id: string) => void;
  isRestaurantClosed?: boolean;
}

export const CategoryScroller: React.FC<CategoryScrollerProps> = ({
  categories,
  activeCategoryId,
  onCategoryChange,
  isRestaurantClosed
}) => {
  const { translate } = useLanguage();
  const activeBtnRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll the active category button into view
  useEffect(() => {
    if (activeBtnRef.current && containerRef.current) {
      const container = containerRef.current;
      const button = activeBtnRef.current;
      
      const containerScrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const buttonLeft = button.offsetLeft;
      const buttonWidth = button.clientWidth;

      const targetScroll = buttonLeft - containerWidth / 2 + buttonWidth / 2;
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  }, [activeCategoryId]);

  return (
    <div className={`w-full relative z-10 border-b border-porto-gold/10 bg-porto-bg/85 backdrop-blur-md sticky transition-all duration-300 ${isRestaurantClosed ? 'top-[36px]' : 'top-0'}`}>
      <div
        ref={containerRef}
        className="flex items-center space-x-2.5 overflow-x-auto py-3.5 px-4 scrollbar-none scroll-smooth"
      >
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              ref={isActive ? activeBtnRef : null}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 border focus:outline-none flex-shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-porto-gold text-porto-bg border-porto-gold-bright shadow-lg shadow-porto-gold/15'
                  : 'glass-panel text-gray-300 border-porto-gold/25 hover:border-porto-gold/45'
              }`}
            >
              <span>{translate(cat.name)}</span>
              {isActive && (
                <motion.svg
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-6 h-3 text-porto-bg"
                  viewBox="0 0 100 50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                >
                  {/* Brand Ichthys Fish Outline */}
                  <path d="M5 25 C25 5, 75 5, 95 25 C75 45, 25 45, 5 25 Z" />
                  <path d="M75 12 C78 20, 78 30, 75 38" />
                  <circle cx="20" cy="22" r="3.5" fill="currentColor" />
                  <path d="M85 25 L95 15 L90 25 L95 35 Z" fill="currentColor" />
                </motion.svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
