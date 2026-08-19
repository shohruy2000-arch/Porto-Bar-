'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = "fixed top-4 right-4 z-40" }) => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string }[] = [
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' },
    { code: 'zh', label: '中文' }
  ];

  return (
    <div className={className}>
      <div className="glass-panel px-1.5 py-1 rounded-full flex items-center space-x-1 shadow-lg border border-porto-gold/20">
        {languages.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
                isActive
                  ? 'bg-porto-gold text-porto-bg shadow-md scale-105'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {lang.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
