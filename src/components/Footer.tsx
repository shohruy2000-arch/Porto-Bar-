'use client';

import React from 'react';
import Image from 'next/image';
import { Phone, Building, ShieldCheck, FileText, AlertTriangle, CreditCard, ChevronRight } from 'lucide-react';
import { LegalTab } from './LegalModal';

interface FooterProps {
  onOpenLegal: (tab: LegalTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="w-full max-w-md mx-auto px-4 pt-8 pb-16 text-center space-y-5 border-t border-white/5 mt-8">
      {/* Brand logo / title */}
      <div className="space-y-1 flex flex-col items-center">
        <div className="relative w-48 h-auto">
          <img
            src="/images/porto-header-logo.png"
            alt="PORTO-BAR"
            className="w-full h-auto object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
          />
        </div>
      </div>

      {/* Legal Organization Info (ООО Движение ВВЕРХ И ВПЕРЕД) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-2">
        <div className="flex items-center space-x-2 text-porto-gold text-xs font-bold uppercase tracking-wider border-b border-white/5 pb-2">
          <ShieldCheck className="w-4 h-4 text-porto-gold" />
          <span>Юридическая информация</span>
        </div>
        <div className="space-y-1 text-[11px] text-gray-300">
          <p><span className="text-gray-400 font-medium">Организация:</span> <strong className="text-white">ООО «Движение ВВЕРХ И ВПЕРЕД»</strong></p>
          <p><span className="text-gray-400 font-medium">ОГРН:</span> <span className="font-mono text-gray-200">1217700021912</span></p>
          <p><span className="text-gray-400 font-medium">ИНН / КПП:</span> <span className="font-mono text-gray-200">9729304162 / 772901001</span></p>
          <p><span className="text-gray-400 font-medium">Адрес:</span> 119571, г. Москва, проспект Ленинский, д. 146, эт. 1</p>
          <p><span className="text-gray-400 font-medium">Телефон:</span> <a href="tel:+74957978566" className="text-porto-gold-bright font-bold hover:underline">+7 (495) 797-85-66</a></p>
        </div>
      </div>

      {/* Legal Links List */}
      <div className="grid grid-cols-2 gap-2 text-left">
        <button
          type="button"
          onClick={() => onOpenLegal('privacy')}
          className="flex items-center justify-between p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-porto-gold/30 rounded-xl text-[11px] text-gray-300 hover:text-white transition-all cursor-pointer"
        >
          <span className="truncate">Политика 152-ФЗ</span>
          <ChevronRight className="w-3.5 h-3.5 text-porto-gold shrink-0 ml-1" />
        </button>

        <button
          type="button"
          onClick={() => onOpenLegal('terms')}
          className="flex items-center justify-between p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-porto-gold/30 rounded-xl text-[11px] text-gray-300 hover:text-white transition-all cursor-pointer"
        >
          <span className="truncate">Публичная оферта</span>
          <ChevronRight className="w-3.5 h-3.5 text-porto-gold shrink-0 ml-1" />
        </button>

        <button
          type="button"
          onClick={() => onOpenLegal('refund')}
          className="flex items-center justify-between p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-porto-gold/30 rounded-xl text-[11px] text-gray-300 hover:text-white transition-all cursor-pointer"
        >
          <span className="truncate">Оплата и возврат</span>
          <ChevronRight className="w-3.5 h-3.5 text-porto-gold shrink-0 ml-1" />
        </button>

        <button
          type="button"
          onClick={() => onOpenLegal('requisites')}
          className="flex items-center justify-between p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-porto-gold/30 rounded-xl text-[11px] text-gray-300 hover:text-white transition-all cursor-pointer"
        >
          <span className="truncate">Все реквизиты</span>
          <ChevronRight className="w-3.5 h-3.5 text-porto-gold shrink-0 ml-1" />
        </button>
      </div>

      {/* Alcohol & Allergen Disclaimers */}
      <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-2xl text-[10px] text-gray-400 space-y-1 text-left leading-relaxed">
        <p className="flex items-start gap-1.5 text-amber-300/90 font-medium">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span>Дистанционная продажа алкогольной продукции не осуществляется (171-ФЗ РФ). Алкоголь доступен только на территории ресторана лицам старше 18 лет. Чрезмерное употребление алкоголя вредит вашему здоровью (18+).</span>
        </p>
        <p className="text-gray-400 pt-0.5">
          <span>⚠️ Информация об аллергенах и КБЖУ указана в карточке каждого блюда.</span>
        </p>
      </div>

      {/* Copyright */}
      <div className="text-[10px] text-gray-500 space-y-1">
        <p>© 2026 Porto Bar. Все права защищены.</p>
        <p className="text-[9px] text-gray-600">Разработано в строгом соответствии с законодательством РФ</p>
      </div>
    </footer>
  );
};
