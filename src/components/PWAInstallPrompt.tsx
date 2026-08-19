'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Download, X, Share, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showPushPrompt, setShowPushPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [vapidPublicKey, setVapidPublicKey] = useState<string>('');
  const [pushStatus, setPushStatus] = useState<'idle' | 'loading' | 'success' | 'denied'>('idle');

  useEffect(() => {
    // 1. Detect if running as standalone PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');

    // 2. Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(ios);

    // 3. Capture PWA Install Prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Only show install banner if not already installed and not dismissed recently
      const dismissed = localStorage.getItem('porto_pwa_install_dismissed');
      if (!isStandalone && !dismissed) {
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If it's iOS Safari and not standalone PWA and not dismissed
    const dismissedIOS = localStorage.getItem('porto_pwa_install_dismissed');
    if (ios && !isStandalone && !dismissedIOS) {
      setShowInstallPrompt(true);
    }

    // 4. Fetch Config to get VAPID Key and check push permissions
    const checkPushPermission = async () => {
      try {
        const res = await fetch('/api/config');
        const config = await res.json();
        if (config.vapidPublicKey) {
          setVapidPublicKey(config.vapidPublicKey);
        }

        // Track push permission status without prompting the user on page load
        if ('Notification' in window) {
          const permission = Notification.permission;
          if (permission === 'denied') {
            setPushStatus('denied');
          } else if (permission === 'granted') {
            setPushStatus('success');
          }
        }
      } catch (err) {
        console.error('Failed to load vapid config:', err);
      }
    };

    checkPushPermission();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const dismissInstall = () => {
    localStorage.setItem('porto_pwa_install_dismissed', 'true');
    setShowInstallPrompt(false);
  };

  const dismissPush = () => {
    localStorage.setItem('porto_push_prompt_dismissed', 'true');
    setShowPushPrompt(false);
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const handleSubscribePush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !vapidPublicKey) {
      alert(t('pwa.unsupportedPush'));
      return;
    }

    setPushStatus('loading');

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setPushStatus('denied');
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      
      // Subscribe options
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      };

      const subscription = await registration.pushManager.subscribe(subscribeOptions as any);
      console.log('Push Subscription created:', subscription);

      // Save to server
      const savedPhone = localStorage.getItem('porto_member_phone') || '';
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription, phone: savedPhone })
      });

      const result = await response.json();
      if (result.success) {
        setPushStatus('success');
        // Auto-close after 3 seconds
        setTimeout(() => {
          setShowPushPrompt(false);
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to save subscription');
      }
    } catch (err) {
      console.error('Push registration failed:', err);
      setPushStatus('idle');
      alert(t('pwa.pushFailed'));
    }
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 z-[100] px-4 pointer-events-none flex flex-col items-center gap-3">
      {/* 1. PWA Install Prompt Banner */}
      {showInstallPrompt && (
        <div className="w-full max-w-sm pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center justify-between text-left animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-porto-gold/20 flex items-center justify-center border border-porto-gold/30">
              <Download className="w-5 h-5 text-porto-gold" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">{t('pwa.title')}</p>
              {isIOS ? (
                <p className="text-[10px] text-gray-300 leading-normal mt-0.5 flex items-center gap-1">
                  {t('lang') === 'en' ? 'Press' : (t('lang') === 'zh' ? '点击' : 'Нажмите')}{' '}
                  <Share className="w-3.5 h-3.5 inline text-porto-gold" />{' '}
                  {t('lang') === 'en' ? 'and select' : (t('lang') === 'zh' ? '并选择' : 'и выберите')}{' '}
                  <strong className="text-white">
                    {t('lang') === 'en' ? 'Add to Home Screen' : (t('lang') === 'zh' ? '“添加到主屏幕”' : 'На экран Домой')}
                  </strong>
                </p>
              ) : (
                <p className="text-[10px] text-gray-300 leading-normal mt-0.5">{t('pwa.androidInstructions')}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isIOS && deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="bg-porto-gold text-porto-bg font-extrabold text-[10px] uppercase tracking-wider px-3 py-2 rounded-xl hover:bg-porto-gold-bright transition-colors cursor-pointer"
              >
                {t('pwa.download')}
              </button>
            )}
            <button
              onClick={dismissInstall}
              className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Web Push Permission Banner */}
      {showPushPrompt && (
        <div className="w-full max-w-sm pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center justify-between text-left animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-porto-gold/20 flex items-center justify-center border border-porto-gold/30">
              <Bell className="w-5 h-5 text-porto-gold" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">{t('pwa.pushTitle')}</p>
              <p className="text-[10px] text-gray-300 leading-normal mt-0.5">{t('pwa.pushSubtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {pushStatus === 'idle' && (
              <button
                onClick={handleSubscribePush}
                className="bg-porto-gold text-porto-bg font-extrabold text-[10px] uppercase tracking-wider px-3 py-2 rounded-xl hover:bg-porto-gold-bright transition-colors cursor-pointer"
              >
                {t('pwa.pushEnable')}
              </button>
            )}
            {pushStatus === 'loading' && (
              <span className="text-[10px] font-bold text-porto-gold animate-pulse uppercase tracking-wider px-2">{t('pwa.pushActivating')}</span>
            )}
            {pushStatus === 'success' && (
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Check className="w-4 h-4" />
              </div>
            )}
            {pushStatus !== 'loading' && pushStatus !== 'success' && (
              <button
                onClick={dismissPush}
                className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
