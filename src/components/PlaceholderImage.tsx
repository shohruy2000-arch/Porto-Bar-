'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';

interface PlaceholderImageProps {
  className?: string;
}

export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ className = 'w-full h-full' }) => {
  const { t } = useLanguage();

  return (
    <div className={`relative flex flex-col items-center justify-between overflow-hidden bg-porto-bg border border-porto-gold/20 p-4 ${className}`}>
      {/* Subtle background fish watermark */}
      <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay flex items-center justify-center">
        <Image
          src="/images/ichthys.jpg"
          alt="Fish Watermark"
          fill
          sizes="150px"
          className="object-contain"
        />
      </div>

      {/* Decorative Golden Corner Borders */}
      <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-porto-gold/50"></div>
      <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-porto-gold/50"></div>
      <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-porto-gold/50"></div>
      <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-porto-gold/50"></div>

      {/* Top logo spacing */}
      <div className="w-full flex justify-center mt-3.5 z-10">
        <div className="relative w-32 h-12">
          <img
            src="/images/porto-logo.jpg?v=2"
            alt="Porto Bar"
            className="w-full h-full object-contain invert mix-blend-screen filter brightness-150 contrast-125"
          />
        </div>
      </div>

      {/* Center Ichthys Fish Outline (Stylized Drawing) */}
      <div className="flex-1 flex items-center justify-center my-4.5 z-10">
        <svg
          className="w-12 h-12 text-porto-gold/45"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 100 50"
        >
          {/* Elegant fish outline */}
          <path d="M5 25 C25 5, 75 5, 95 25 C75 45, 25 45, 5 25 Z" />
          <path d="M75 12 C78 20, 78 30, 75 38" />
          <circle cx="20" cy="22" r="2.5" fill="currentColor" />
          {/* Fin tail crossings */}
          <path d="M85 25 L95 15 L90 25 L95 35 Z" />
        </svg>
      </div>

      {/* Branded Text */}
      <div className="text-center mb-4.5 z-10">
        <p className="text-xs tracking-[0.22em] font-black text-porto-gold mb-1.5 font-serif uppercase">
          {t('placeholder.photoTitle')}
        </p>
        <p className="text-[9px] tracking-widest text-gray-400 font-bold uppercase">
          {t('placeholder.photoSubtitle')}
        </p>
      </div>
    </div>
  );
};
