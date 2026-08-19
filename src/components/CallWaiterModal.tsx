'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BellRing, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CallWaiterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CallWaiterModal: React.FC<CallWaiterModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [table, setTable] = useState('');
  const [success, setSuccess] = useState(false);
  const [isOfflineQueued, setIsOfflineQueued] = useState(false);
  const [isCalling, setIsCalling] = useState(false);

  // Auto-load prefilled table number from localStorage if present
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const savedTable = localStorage.getItem('porto_table_number');
      if (savedTable) {
        setTable(savedTable);
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!table.trim()) return;
    
    setIsCalling(true);
    try {
      if (typeof window !== 'undefined' && !navigator.onLine) {
        const { queueWaiterCall } = await import('../lib/offlineQueue');
        await queueWaiterCall({ tableNumber: table });
        setIsOfflineQueued(true);
        setSuccess(true);
        return;
      }

      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'callWaiter',
          data: { tableNumber: table }
        })
      });
      setSuccess(true);

      // Request push permission after successfully calling a waiter
      const { requestPushPermissionAfterAction } = await import('../lib/pushNotifications');
      requestPushPermissionAfterAction().catch(err => console.log('[Push] Request deferred:', err));
    } catch (err) {
      console.error('Failed to notify waiter:', err);
      // Fallback: Queue offline instead of throwing error
      try {
        const { queueWaiterCall } = await import('../lib/offlineQueue');
        await queueWaiterCall({ tableNumber: table });
        setIsOfflineQueued(true);
      } catch (innerErr) {
        console.error('Failed to queue waiter call:', innerErr);
      }
      setSuccess(true);
    } finally {
      setIsCalling(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state on close
    setTimeout(() => {
      setSuccess(false);
      setIsOfflineQueued(false);
      setTable('');
    }, 300);
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
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto rounded-t-3xl glass-panel border-t border-porto-gold/30 p-6 pb-8 shadow-[0_-15px_40px_rgba(0,0,0,0.8)]"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-3 mt-2">
                  <div className="p-3 bg-porto-gold/10 rounded-full border border-porto-gold/25">
                    <BellRing className="w-6 h-6 text-porto-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-serif text-gold-gradient">{t('waiter.title')}</h3>
                    <p className="text-xs text-gray-400 font-medium">{t('waiter.subtitle')}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="table-number" className="block text-xs font-semibold uppercase tracking-wider text-porto-gold">
                    {t('waiter.tablePlaceholder')}
                  </label>
                  <input
                    id="table-number"
                    type="number"
                    inputMode="numeric"
                    required
                    value={table}
                    onChange={(e) => setTable(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full bg-porto-bg/60 border border-porto-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-porto-gold-bright transition-colors text-center text-xl font-bold tracking-widest"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCalling}
                  className="w-full bg-gradient-to-r from-porto-gold-dark via-porto-gold to-porto-gold-bright text-porto-bg font-bold py-3.5 rounded-xl active:scale-98 transition-all shadow-lg hover:shadow-porto-gold/10 text-sm tracking-wider uppercase disabled:opacity-50 cursor-pointer"
                >
                  {isCalling ? t('waiter.calling') : t('waiter.callBtn')}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-6 space-y-4"
              >
                <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif text-emerald-400">
                    {isOfflineQueued ? t('waiter.offlineSuccess') : `${t('waiter.success')} #${table}`}
                  </h3>
                  <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                    {isOfflineQueued ? (
                      <span className="text-porto-gold-bright font-semibold">
                        {t('waiter.offlineMsg')}
                      </span>
                    ) : (
                      t('waiter.successDesc')
                    )}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full bg-white/5 border border-white/10 text-white font-semibold py-2.5 rounded-xl hover:bg-white/10 transition-colors text-xs uppercase mt-2"
                >
                  {t('ui.close')}
                </button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
