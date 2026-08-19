'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, MapPin, Check, X, ChevronRight, ChevronLeft, Phone, User, MessageSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { queueReservationSubmission, isOnline } from '../lib/offlineQueue';
import { AnimatePresence, motion } from 'framer-motion';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<1 | 2 | 3 | 'success'>(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:00');
  const [guestsCount, setGuestsCount] = useState(2);
  const [zone, setZone] = useState<'inside' | 'veranda'>('inside');
  const [wishes, setWishes] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOfflineSuccess, setIsOfflineSuccess] = useState(false);
  const [reservationId, setReservationId] = useState('');
  const [error, setError] = useState('');

  const suggestions = [
    { label: t('booking.suggest.tv'), text: t('booking.suggest.tvText') },
    { label: t('booking.suggest.quiet'), text: t('booking.suggest.quietText') },
    { label: t('booking.suggest.alcohol'), text: t('booking.suggest.alcoholText') },
    { label: t('booking.suggest.window'), text: t('booking.suggest.windowText') },
    { label: t('booking.suggest.birthday'), text: t('booking.suggest.birthdayText') }
  ];

  // Set default date to today
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      // Reset state on open
      setStep(1);
      setZone('inside');
      setWishes('');
      setName('');
      setPhone('');
      setError('');
      setIsOfflineSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Generate available times (12:00 to 23:00)
  const times = [];
  for (let hour = 12; hour <= 23; hour++) {
    times.push(`${hour}:00`);
    times.push(`${hour}:30`);
  }

  const handleNextStep = () => {
    if (step === 1) {
      if (!date || !time) {
        setError(t('booking.error.dateTime'));
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2) {
      setError('');
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const handleSuggestionClick = (text: string) => {
    setWishes((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return text;
      // If the text is already included, don't duplicate
      if (trimmed.toLowerCase().includes(text.toLowerCase())) return prev;
      return `${prev}, ${text}`;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t('booking.error.name'));
      return;
    }
    if (!phone.trim() || phone.replace(/[^\d]/g, '').length < 10) {
      setError(t('booking.error.phone'));
      return;
    }

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      date,
      time,
      guestsCount,
      zone,
      wishes: wishes.trim(),
      idempotencyKey: `res-key-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    setIsSubmitting(true);
    setError('');

    try {
      if (!isOnline()) {
        // Queue reservation offline
        await queueReservationSubmission(payload);
        setReservationId(payload.idempotencyKey);
        setIsOfflineSuccess(true);
        setStep('success');
      } else {
        // Online reservation POST
        const res = await fetch('/api/reservations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || t('booking.error.server'));
        }

        const data = await res.json();
        setReservationId(data.reservationId);
        setIsOfflineSuccess(false);
        setStep('success');
      }
    } catch (err: any) {
      console.error(err);
      // Fallback to offline queue in case of network fetch failure
      try {
        await queueReservationSubmission(payload);
        setReservationId(payload.idempotencyKey);
        setIsOfflineSuccess(true);
        setStep('success');
      } catch (innerErr) {
        setError(err.message || t('booking.error.unknown'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Drawer */}
        <motion.div
          initial={{ scale: 0.95, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-md bg-porto-bg border border-porto-gold/25 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] max-h-[90vh] flex flex-col z-10"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4.5 border-b border-white/5 bg-porto-card/40">
            <div className="flex items-center space-x-2.5">
              <Calendar className="w-4 h-4 text-porto-gold-bright animate-pulse" />
              <h3 className="text-xs md:text-sm font-bold uppercase tracking-[0.15em] text-porto-gold-bright">
                {t('booking.title')}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {error && (
              <div className="p-3 bg-red-950/45 border border-red-500/20 text-red-200 text-xs rounded-xl text-center">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                {/* Step indicator */}
                <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-gray-400">
                  <span>{t('booking.step').replace('{step}', '1')}</span>
                  <span className="text-porto-gold font-bold">{t('booking.params')}</span>
                </div>

                {/* Date */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-porto-gold">{t('booking.date')}</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-porto-gold/60" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-porto-card/50 border border-porto-gold/15 rounded-2xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-porto-gold-bright transition-all"
                    />
                  </div>
                </div>

                {/* Time picker list */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-porto-gold">{t('booking.time')}</label>
                  <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1.5 glass-panel rounded-2xl border border-porto-gold/15">
                    {times.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTime(t)}
                        className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          time === t
                            ? 'bg-porto-gold text-porto-bg font-bold scale-105'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guests counter */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-porto-gold">{t('booking.guestsCount')}</label>
                  <div className="flex items-center justify-between p-3.5 glass-panel rounded-2xl border border-porto-gold/15">
                    <button
                      type="button"
                      disabled={guestsCount <= 1}
                      onClick={() => setGuestsCount(guestsCount - 1)}
                      className="w-8 h-8 rounded-full bg-white/5 text-white hover:bg-white/10 disabled:opacity-40 flex items-center justify-center cursor-pointer transition-all active:scale-95"
                    >
                      -
                    </button>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-porto-gold" />
                      <span className="text-sm font-bold text-white">{guestsCount}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGuestsCount(guestsCount + 1)}
                      className="w-8 h-8 rounded-full bg-white/5 text-white hover:bg-white/10 flex items-center justify-center cursor-pointer transition-all active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                {/* Step indicator */}
                <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-gray-400">
                  <span>{t('booking.step').replace('{step}', '2')}</span>
                  <span className="text-porto-gold font-bold">{t('booking.zone')}</span>
                </div>

                {/* Zone Toggle switcher */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-porto-gold">{t('booking.whereSeat')}</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-porto-card/60 border border-porto-gold/15 rounded-full">
                    <button
                      type="button"
                      onClick={() => setZone('inside')}
                      className={`py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        zone === 'inside'
                          ? 'bg-porto-gold text-porto-bg shadow-md'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {t('booking.zoneInside')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setZone('veranda')}
                      className={`py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        zone === 'veranda'
                          ? 'bg-porto-gold text-porto-bg shadow-md'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {t('booking.zoneVeranda')}
                    </button>
                  </div>
                </div>

                {/* Wishes textarea input */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-porto-gold">{t('booking.wishes')}</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-3.5 w-4 h-4 text-porto-gold/60" />
                    <textarea
                      value={wishes}
                      onChange={(e) => setWishes(e.target.value)}
                      placeholder={t('booking.wishesPlaceholder')}
                      rows={4}
                      className="w-full bg-porto-card/50 border border-porto-gold/15 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-porto-gold-bright transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Suggestion Chips */}
                <div className="space-y-2 text-left">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{t('booking.fastWishes')}</span>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => handleSuggestionClick(s.text)}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-porto-gold/15 hover:border-porto-gold-bright/35 text-[10px] text-gray-300 rounded-full transition-all cursor-pointer active:scale-95"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Step indicator */}
                <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-gray-400">
                  <span>{t('booking.step').replace('{step}', '3')}</span>
                  <span className="text-porto-gold font-bold">{t('booking.contacts')}</span>
                </div>

                {/* Summary Box */}
                <div className="p-4 glass-panel rounded-2xl border border-porto-gold/15 space-y-2 text-xs text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('booking.dateAndTime')}</span>
                    <span className="font-bold text-white">{date} {t('booking.at')} {time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('booking.guests')}</span>
                    <span className="font-bold text-white">{guestsCount} {t('booking.guestsShort')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('booking.zoneLabel')}</span>
                    <span className="font-bold text-porto-gold-bright">{zone === 'inside' ? t('booking.zoneInside') : t('booking.zoneVeranda')}</span>
                  </div>
                  {wishes.trim() && (
                    <div className="border-t border-white/5 pt-2 mt-1">
                      <span className="text-gray-400 block mb-1">{t('booking.wishesLabel')}</span>
                      <span className="text-white italic">«{wishes}»</span>
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-porto-gold">{t('booking.name')}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-4 h-4 text-porto-gold/60" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('booking.namePlaceholder')}
                      required
                      className="w-full bg-porto-card/50 border border-porto-gold/15 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-porto-gold-bright transition-all"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-porto-gold">{t('booking.phone')}</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 w-4 h-4 text-porto-gold/60" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (999) 123-45-67"
                      required
                      className="w-full bg-porto-card/50 border border-porto-gold/15 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-porto-gold-bright transition-all"
                    />
                  </div>
                </div>
              </form>
            )}

            {step === 'success' && (
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-400/35 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <Check className="w-8 h-8 text-emerald-400 stroke-[3px]" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-emerald-400 font-serif">
                    {isOfflineSuccess ? t('booking.successSaved') : t('booking.successOnline')}
                  </h3>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest">
                    ID: #{reservationId.substr(0, 10).replace('res-key-', '').toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-300 px-4 leading-relaxed">
                    {isOfflineSuccess ? (
                      <span className="text-porto-gold-bright font-semibold">
                        {t('booking.offlineMsg')}
                      </span>
                    ) : (
                      <>
                        {t('booking.onlineMsg').replace('{phone}', phone)}
                      </>
                    )}
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-gradient-to-r from-porto-gold-dark to-porto-gold text-porto-bg font-bold rounded-full text-xs uppercase tracking-widest active:scale-95 transition-all cursor-pointer shadow-lg"
                >
                  {t('btn.excellent')}
                </button>
              </div>
            )}
          </div>

          {/* Footer Navigation (Not shown in success step) */}
          {step !== 'success' && (
            <div className="px-6 py-4.5 border-t border-white/5 bg-porto-card/20 flex justify-between items-center">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-full border border-porto-gold/20 hover:border-porto-gold/45 text-xs text-porto-gold font-bold uppercase tracking-wider active:scale-95 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{t('btn.back')}</span>
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center space-x-1.5 px-5 py-2.5 bg-gradient-to-r from-porto-gold-dark to-porto-gold text-porto-bg rounded-full text-xs font-bold uppercase tracking-wider active:scale-95 transition-all cursor-pointer shadow-md"
                >
                  <span>{t('btn.next')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-porto-gold to-porto-gold-bright text-porto-bg rounded-full text-xs font-black uppercase tracking-widest active:scale-95 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{t('btn.sending')}</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t('btn.confirm')}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
