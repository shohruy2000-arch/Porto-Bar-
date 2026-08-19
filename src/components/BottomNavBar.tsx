'use client';

import React from 'react';
import { BookOpen, Sparkles, Bell, PhoneCall, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

interface BottomNavBarProps {
  activeSection: 'menu' | 'promotions';
  setActiveSection: (sec: 'menu' | 'promotions') => void;
  onCallWaiterClick: () => void;
  onRoomServiceClick: () => void;
  onLoyaltyClick: () => void;
  visible?: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeSection,
  setActiveSection,
  onCallWaiterClick,
  onRoomServiceClick,
  onLoyaltyClick,
  visible = true
}) => {
  const { t } = useLanguage();
  const { items } = useCart();

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: visible ? 0 : 100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 safe-bottom-offset md:px-4 md:pb-6 pointer-events-none"
    >
      <div className="max-w-md mx-auto glass-panel rounded-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.5)] border border-porto-gold/25 p-1.5 md:p-2 flex justify-around items-center pointer-events-auto">
        {/* Menu Tab */}
        <button
          onClick={() => setActiveSection('menu')}
          className={`flex flex-col items-center justify-center py-1.5 px-1.5 md:py-2 md:px-3 rounded-xl transition-all duration-300 relative w-14 md:w-20 ${
            activeSection === 'menu'
              ? 'text-porto-gold-bright scale-105 font-semibold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <BookOpen className={`w-5 h-5 md:w-6 md:h-6 mb-0.5 md:mb-1 transition-transform ${activeSection === 'menu' ? 'scale-110' : ''}`} />
          <span className="text-[8px] md:text-[9px] tracking-wider uppercase font-semibold">{t('nav.menu')}</span>
          {activeSection === 'menu' && (
            <span className="absolute bottom-0.5 w-1.5 h-1.5 bg-porto-gold-bright rounded-full pulse-active"></span>
          )}
        </button>

        {/* Promotions Tab */}
        <button
          onClick={() => setActiveSection('promotions')}
          className={`flex flex-col items-center justify-center py-1.5 px-1.5 md:py-2 md:px-3 rounded-xl transition-all duration-300 relative w-14 md:w-20 ${
            activeSection === 'promotions'
              ? 'text-porto-gold-bright scale-105 font-semibold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Sparkles className={`w-5 h-5 md:w-6 md:h-6 mb-0.5 md:mb-1 transition-transform ${activeSection === 'promotions' ? 'scale-110' : ''}`} />
          <span className="text-[8px] md:text-[9px] tracking-wider uppercase font-semibold">{t('nav.promotions')}</span>
          {activeSection === 'promotions' && (
            <span className="absolute bottom-0.5 w-1.5 h-1.5 bg-porto-gold-bright rounded-full pulse-active"></span>
          )}
        </button>

        {/* Porto Club Tab */}
        <button
          onClick={onLoyaltyClick}
          className="flex flex-col items-center justify-center py-1.5 px-1.5 md:py-2 md:px-3 rounded-xl transition-all duration-300 text-gray-400 hover:text-gray-200 active:scale-95 w-14 md:w-20"
        >
          <Award className="w-5 h-5 md:w-6 md:h-6 mb-0.5 md:mb-1 text-porto-gold/90" />
          <span className="text-[8px] md:text-[9px] tracking-wider uppercase font-semibold text-gray-300">{t('nav.loyalty')}</span>
        </button>

        {/* Call Waiter Tab */}
        <button
          onClick={onCallWaiterClick}
          className="flex flex-col items-center justify-center py-1.5 px-1.5 md:py-2 md:px-3 rounded-xl transition-all duration-300 text-gray-400 hover:text-gray-200 active:scale-95 w-14 md:w-20"
        >
          <Bell className="w-5 h-5 md:w-6 md:h-6 mb-0.5 md:mb-1 text-porto-gold/90" />
          <span className="text-[8px] md:text-[9px] tracking-wider uppercase font-semibold text-gray-300">{t('nav.waiter')}</span>
        </button>

        {/* Room Service Tab */}
        <button
          onClick={onRoomServiceClick}
          className="flex flex-col items-center justify-center py-1.5 px-1 md:py-2 md:px-2 rounded-xl transition-all duration-300 text-gray-400 hover:text-gray-200 active:scale-95 w-18 md:w-22 relative"
        >
          <PhoneCall className="w-5 h-5 md:w-6 md:h-6 mb-0.5 md:mb-1 text-porto-gold/90" />
          <span className="text-[8px] md:text-[9px] tracking-wider uppercase font-semibold text-gray-300">{t('nav.roomService')}</span>
          
          {totalItems > 0 && (
            <span className="absolute -top-1 right-1 bg-porto-gold-bright text-porto-bg text-[8px] md:text-[10px] font-bold w-3.5 h-3.5 md:w-4.5 md:h-4.5 rounded-full flex items-center justify-center shadow-lg border border-porto-bg">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </motion.div>
  );
};
