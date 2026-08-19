'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X } from 'lucide-react';

interface CookieBannerProps {
  onOpenPrivacy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPrivacy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('porto_cookie_consent_v1');
      if (!consent) {
        // Small delay to appear smoothly after initial page load
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('porto_cookie_consent_v1', 'accepted');
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed bottom-20 md:bottom-24 left-4 right-4 max-w-md mx-auto z-40"
      >
        <div className="glass-panel bg-neutral-950/95 border border-porto-gold/30 rounded-2xl p-3.5 sm:p-4 shadow-[0_10px_35px_rgba(0,0,0,0.85)] backdrop-blur-lg flex items-center justify-between gap-3 text-left">
          <div className="flex items-start space-x-2.5 flex-1 min-w-0">
            <ShieldCheck className="w-5 h-5 text-porto-gold shrink-0 mt-0.5" />
            <div className="text-[11px] text-gray-300 leading-snug">
              <span>Мы используем cookie для удобства работы сайта. Оставаясь на сайте, вы соглашаетесь с </span>
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-porto-gold-bright underline hover:text-white font-semibold cursor-pointer"
              >
                Политикой конфиденциальности (152-ФЗ)
              </button>
              <span>.</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleAccept}
              className="px-4 py-2 bg-gradient-to-r from-porto-gold-dark via-porto-gold to-porto-gold-bright text-porto-bg font-black text-[10px] uppercase tracking-wider rounded-xl active:scale-95 transition-all cursor-pointer shadow-md"
            >
              Принять
            </button>
            <button
              onClick={handleAccept}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              title="Закрыть"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
