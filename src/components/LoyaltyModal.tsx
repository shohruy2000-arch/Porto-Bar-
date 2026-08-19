'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, ShieldCheck, History, QrCode, LogOut, CheckCircle, User, MessageSquare, Mail, Globe, Sparkles, ClipboardList, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { menuRepository } from '../data/localMenuRepository';
import { LoyaltyMember, Order, Dish } from '../types';
import { useCart } from '../context/CartContext';

interface LoyaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRepeatOrderSuccess?: () => void;
}

export const LoyaltyModal: React.FC<LoyaltyModalProps> = ({ isOpen, onClose, onRepeatOrderSuccess }) => {
  const { t, translate } = useLanguage();
  
  // Auth states
  const [authMethod, setAuthMethod] = useState<'phone_direct' | 'tg' | 'email' | 'vk'>('tg');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  // TG Login states
  const [tgCode, setTgCode] = useState('');
  const [botUsername, setBotUsername] = useState('');
  const [isPolling, setIsPolling] = useState(false);
  
  // Email states
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [emailDemoCode, setEmailDemoCode] = useState('');
  
  // VK states
  const [showVkSim, setShowVkSim] = useState(false);
  const [vkName, setVkName] = useState('');
  const [vkProfileUrl, setVkProfileUrl] = useState('');

  // General App states
  const [member, setMember] = useState<LoyaltyMember | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationCredentials, setRegistrationCredentials] = useState<{
    email?: string;
    telegramId?: string;
    telegramUsername?: string;
    vkId?: string;
  } | null>(null);
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isQrZoomed, setIsQrZoomed] = useState(false);

  // Logged-in view tabs: 'card' | 'orders'
  const [activeSubTab, setActiveSubTab] = useState<'card' | 'orders'>('card');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Check if guest is already logged into loyalty in this session
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const storedPhone = localStorage.getItem('porto_loyalty_logged_phone');
      if (storedPhone) {
        checkLoyaltyDirect(storedPhone);
      }
    }
  }, [isOpen]);

  // Handle orders fetching when switching to the 'orders' sub-tab
  useEffect(() => {
    if (member && activeSubTab === 'orders') {
      fetchUserOrders();
    }
  }, [member, activeSubTab]);

  // Polling for Telegram authentication
  useEffect(() => {
    let intervalId: any;
    if (isPolling && tgCode) {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch(`/api/auth?action=poll-tg-session&code=${tgCode}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              setIsPolling(false);
              clearInterval(intervalId);
              
              if (data.member) {
                // User already registered
                loginSuccess(data.member);
              } else if (data.needsRegistration) {
                // User needs registration, save their TG details
                setRegistrationCredentials({
                  telegramId: data.telegramId,
                  telegramUsername: data.telegramUsername
                });
                setIsRegistering(true);
              }
            }
          }
        } catch (err) {
          console.error('Error polling Telegram auth:', err);
        }
      }, 2000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPolling, tgCode]);

  const loginSuccess = (loggedInMember: LoyaltyMember) => {
    setMember(loggedInMember);
    setError('');
    setIsRegistering(false);
    setRegistrationCredentials(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem('porto_loyalty_logged_phone', loggedInMember.phone);
    }
  };

  const checkLoyaltyDirect = async (phoneNum: string) => {
    try {
      const found = await menuRepository.getLoyaltyMemberByPhone(phoneNum);
      if (found) {
        setMember(found);
        setError('');
        setIsRegistering(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const { setCartItems } = useCart();

  const fetchUserOrders = async () => {
    if (!member) return;
    setOrdersLoading(true);
    try {
      const res = await fetch(`/api/orders?phone=${encodeURIComponent(member.phone)}`);
      if (res.ok) {
        const data = await res.json();
        // Sort orders newest first
        data.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleRepeatOrder = async (orderToRepeat: Order) => {
    try {
      const menuData = await menuRepository.getMenuData();
      const allDishes = menuData.dishes;

      const repeatedItems: { dish: Dish; quantity: number }[] = [];
      const skippedDishes: string[] = [];

      for (const item of orderToRepeat.items) {
        const activeDish = allDishes.find(d => d.id === item.dishId);
        if (activeDish) {
          const isOutOfStock = activeDish.outOfStock || (activeDish.quantityLimit !== undefined && activeDish.quantityLimit !== null && activeDish.quantityLimit <= 0);
          if (!isOutOfStock && activeDish.visible) {
            let finalQty = item.quantity;
            if (activeDish.quantityLimit !== undefined && activeDish.quantityLimit !== null) {
              finalQty = Math.min(item.quantity, activeDish.quantityLimit);
            }
            repeatedItems.push({
              dish: activeDish,
              quantity: finalQty
            });
          } else {
            skippedDishes.push(translate(activeDish.name));
          }
        } else {
          skippedDishes.push(translate({ ru: 'Неизвестное блюдо', en: 'Unknown dish', zh: '未知菜品' }));
        }
      }

      if (repeatedItems.length === 0) {
        alert(translate({
          ru: 'К сожалению, все блюда из этого заказа сейчас недоступны или закончились в наличии.',
          en: 'Unfortunately, all items from this order are currently unavailable or out of stock.',
          zh: '很抱歉，此订单中的所有菜品当前都处于售罄或不可用状态。'
        }));
        return;
      }

      setCartItems(repeatedItems);

      if (skippedDishes.length > 0) {
        alert(translate({
          ru: `Некоторые блюда (${skippedDishes.join(', ')}) были пропущены, так как они закончились.`,
          en: `Some items (${skippedDishes.join(', ')}) were skipped because they are out of stock.`,
          zh: `部分菜品 (${skippedDishes.join(', ')}) 因售罄而被跳过。`
        }));
      }

      if (onRepeatOrderSuccess) {
        onRepeatOrderSuccess();
      }
    } catch (err) {
      console.error('Failed to repeat order:', err);
      alert(translate({
        ru: 'Не удалось повторить заказ. Пожалуйста, попробуйте еще раз.',
        en: 'Failed to repeat order. Please try again.',
        zh: '复制订单失败。请重试。'
      }));
    }
  };

  // Telegram session request
  const handleTgRequest = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request-tg-session' })
      });
      if (res.ok) {
        const data = await res.json();
        setTgCode(data.code);
        setBotUsername(data.botUsername || 'PortoMenuBot');
        setIsPolling(true);
      } else {
        setError(t('loyalty.error.botConnection'));
      }
    } catch (err) {
      setError(t('error.network'));
    } finally {
      setLoading(false);
    }
  };

  // Email OTP request
  const handleEmailRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    setEmailDemoCode('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request-email-otp', email })
      });
      const data = await res.json();
      if (res.ok) {
        setIsOtpSent(true);
        if (data.demoMode) {
          setEmailDemoCode(data.code);
        }
      } else {
        setError(data.error || t('loyalty.error.sendOtp'));
      }
    } catch (err) {
      setError(t('error.network'));
    } finally {
      setLoading(false);
    }
  };

  // Email OTP verify
  const handleEmailVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-email-otp', email, code: otpCode })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.member) {
          loginSuccess(data.member);
        } else if (data.needsRegistration) {
          setRegistrationCredentials({ email: data.email });
          setIsRegistering(true);
        }
      } else {
        setError(data.error || t('loyalty.error.invalidOtp'));
      }
    } catch (err) {
      setError(t('error.network'));
    } finally {
      setLoading(false);
    }
  };

  // Mock VK authentication flow
  const handleVkLoginSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vkName.trim()) return;
    setLoading(true);
    setError('');
    
    // Generate a random stable numeric VK ID from the profile URL or name
    const seed = vkProfileUrl.trim() || vkName;
    let vkIdNum = 0;
    for (let i = 0; i < seed.length; i++) {
      vkIdNum = (vkIdNum << 5) - vkIdNum + seed.charCodeAt(i);
      vkIdNum |= 0;
    }
    const cleanVkId = Math.abs(vkIdNum).toString();

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'vk-login', vkId: cleanVkId, name: vkName })
      });
      const data = await res.json();
      if (res.ok) {
        setShowVkSim(false);
        if (data.member) {
          loginSuccess(data.member);
        } else if (data.needsRegistration) {
          setRegistrationCredentials({ vkId: cleanVkId });
          setIsRegistering(true);
        }
      } else {
        setError(data.error || t('loyalty.error.vkLogin'));
      }
    } catch (err) {
      setError(t('error.network'));
    } finally {
      setLoading(false);
    }
  };

  // Direct Phone login (Backward compatibility/fallback)
  const handleDirectPhoneLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setError('');
    menuRepository.getLoyaltyMemberByPhone(phone)
      .then((found) => {
        if (found) {
          loginSuccess(found);
        } else {
          setIsRegistering(true);
        }
      })
      .catch(() => setError(t('loyalty.error.auth')))
      .finally(() => setLoading(false));
  };

  // Registration process
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          name: name.trim(),
          phone: phone.trim(),
          email: registrationCredentials?.email,
          telegramId: registrationCredentials?.telegramId,
          telegramUsername: registrationCredentials?.telegramUsername,
          vkId: registrationCredentials?.vkId
        })
      });

      const data = await res.json();
      if (res.ok && data.member) {
        loginSuccess(data.member);
        setSuccessMsg(t('loyalty.success.cardIssued'));
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setError(data.error || t('loyalty.error.registration'));
      }
    } catch (err) {
      setError(t('error.connection'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setMember(null);
    setPhone('');
    setName('');
    setEmail('');
    setOtpCode('');
    setTgCode('');
    setIsPolling(false);
    setIsOtpSent(false);
    setIsRegistering(false);
    setRegistrationCredentials(null);
    setActiveSubTab('card');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('porto_loyalty_logged_phone');
    }
  };

  const handleClose = () => {
    setIsPolling(false);
    onClose();
    if (!member) {
      setPhone('');
      setName('');
      setEmail('');
      setOtpCode('');
      setTgCode('');
      setIsOtpSent(false);
      setIsRegistering(false);
      setError('');
    }
  };

  const getTierGlowColor = (tier: string) => {
    switch (tier) {
      case 'Porto Premium':
        return 'from-purple-600 via-amber-500 to-indigo-700 shadow-[0_0_25px_rgba(168,85,247,0.35)]';
      case 'Gold':
        return 'from-amber-600 via-yellow-500 to-amber-700 shadow-[0_0_20px_rgba(212,175,55,0.3)]';
      case 'Silver':
        return 'from-slate-400 via-gray-300 to-slate-500 shadow-[0_0_15px_rgba(200,200,200,0.2)]';
      default: // Bronze
        return 'from-amber-800 via-amber-700 to-amber-900 shadow-[0_0_10px_rgba(140,90,40,0.15)]';
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'received':
        return { text: t('loyalty.status.received'), style: 'border-blue-500/20 text-blue-400 bg-blue-500/5' };
      case 'preparing':
        return { text: t('loyalty.status.preparing'), style: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5 animate-pulse' };
      case 'completed':
        return { text: t('loyalty.status.completed'), style: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' };
      case 'cancelled':
        return { text: t('loyalty.status.cancelled'), style: 'border-red-500/20 text-red-400 bg-red-500/5' };
      default:
        return { text: status, style: 'border-gray-500/20 text-gray-400 bg-gray-500/5' };
    }
  };

  const getOrderTypeLabel = (type: string) => {
    switch (type) {
      case 'room': return t('checkout.deliveryRoom');
      case 'table': return t('checkout.deliveryTable');
      default: return t('checkout.deliveryTakeaway');
    }
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
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto rounded-t-3xl glass-panel border-t border-porto-gold/30 p-6 pb-8 shadow-[0_-15px_40px_rgba(0,0,0,0.9)] overflow-y-auto max-h-[92vh]"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <div className="flex items-center space-x-3 mt-2 mb-5">
              <div className="p-3 bg-porto-gold/10 rounded-full border border-porto-gold/25">
                <Award className="w-5 h-5 text-porto-gold" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif text-gold-gradient">
                  {member ? t('loyalty.titleCabinet') : t('loyalty.title')}
                </h3>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                  {member ? t('loyalty.subtitleCabinet').replace('{name}', member.name) : t('loyalty.subtitle')}
                </p>
              </div>
            </div>

            {successMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 text-center text-xs text-emerald-400 font-bold mb-4">
                {successMsg}
              </div>
            )}

            {/* DYNAMIC VIEWS */}
            {!member ? (
              !isRegistering ? (
                /* LOGIN CHANNELS SELECTOR */
                <div className="space-y-6">
                  {/* Channels Tab Bar */}
                  <div className="grid grid-cols-4 gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5">
                    <button
                      onClick={() => { setAuthMethod('tg'); setError(''); }}
                      className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${
                        authMethod === 'tg' ? 'bg-porto-gold text-porto-bg' : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{t('loyalty.method.tg')}</span>
                    </button>
                    <button
                      onClick={() => { setAuthMethod('email'); setError(''); }}
                      className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${
                        authMethod === 'email' ? 'bg-porto-gold text-porto-bg' : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                      <span>{t('loyalty.method.email')}</span>
                    </button>
                    <button
                      onClick={() => { setAuthMethod('vk'); setError(''); }}
                      className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${
                        authMethod === 'vk' ? 'bg-porto-gold text-porto-bg' : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M15.06 2C19.78 2 22 4.22 22 8.94v6.12C22 19.78 19.78 22 15.06 22H8.94C4.22 22 2 19.78 2 15.06V8.94C2 4.22 4.22 2 8.94 2h6.12zm-.41 15.25c-.56-.12-1.07-.46-1.5-.95-.62-.71-.85-.92-1.3-.92-.12 0-.25.04-.37.12v1.31c0 .28-.13.44-.43.44-.65 0-1.89-.37-2.93-1.89-1.28-1.82-1.84-3.79-1.84-4.08 0-.26.13-.39.43-.39h1.16c.26 0 .39.11.44.31.55 1.54 1.34 2.82 1.94 2.82.25 0 .37-.12.37-.37v-2.09c-.06-.82-.57-.89-.57-1.15 0-.13.11-.26.33-.26h1.83c.25 0 .37.13.37.39v2.79c0 .24.1.33.2.33.25 0 .58-.2 1.09-1.01a11.13 11.13 0 001.27-2.31c.06-.18.19-.24.4-.24h1.15c.34 0 .42.16.33.39-.42 1.12-1.63 3.39-1.63 3.39-.17.31-.22.45 0 .73.19.24.84.81 1.28 1.34.81.99 1.43 1.83 1.58 2.37.09.28-.06.41-.39.41h-1.28c-.28 0-.46-.07-.63-.44-.32-.69-.97-1.74-1.39-1.74-.2 0-.34.09-.43.29z"/>
                      </svg>
                      <span>{t('loyalty.method.vk')}</span>
                    </button>
                    <button
                      onClick={() => { setAuthMethod('phone_direct'); setError(''); }}
                      className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${
                        authMethod === 'phone_direct' ? 'bg-porto-gold text-porto-bg' : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>{t('loyalty.method.phone')}</span>
                    </button>
                  </div>

                  {/* TELEGRAM AUTH VIEW */}
                  {authMethod === 'tg' && (
                    <div className="space-y-5 text-center">
                      {!tgCode ? (
                        <div className="space-y-4">
                          <p className="text-xs text-gray-300 leading-relaxed font-semibold">
                            {t('loyalty.tg.desc')}
                          </p>
                          <button
                            onClick={handleTgRequest}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-porto-gold-dark via-porto-gold to-porto-gold-bright text-porto-bg font-black py-4 rounded-xl text-xs uppercase tracking-widest active:scale-98 transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>{loading ? t('loyalty.tg.loading') : t('loyalty.tg.btn')}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-5 p-4 bg-white/5 border border-white/5 rounded-2xl">
                          <p className="text-xs text-gray-300">{t('loyalty.tg.sessionText')}</p>
                          
                          <div className="text-3xl font-serif font-black text-porto-gold-bright tracking-widest bg-porto-bg py-3.5 rounded-xl border border-porto-gold/25 inline-block px-8">
                            {tgCode}
                          </div>

                          <div className="space-y-3">
                            <a
                              href={`https://t.me/${botUsername}?start=login_${tgCode}`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full bg-[#229ED9] hover:bg-[#229ED9]/80 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2 active:scale-98"
                            >
                              <span>{t('loyalty.tg.openLink')}</span>
                            </a>
                            
                            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase animate-pulse mt-2">
                              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                              {t('loyalty.tg.waiting')}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* EMAIL AUTH VIEW */}
                  {authMethod === 'email' && (
                    <div className="space-y-4">
                      {!isOtpSent ? (
                        <form onSubmit={handleEmailRequest} className="space-y-4">
                          <p className="text-xs text-gray-300 text-center leading-relaxed">
                            {t('loyalty.email.desc')}
                          </p>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-porto-gold">{t('loyalty.email.label')}</label>
                            <input
                              type="email"
                              required
                              placeholder="guest@mail.ru"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full bg-porto-bg border border-porto-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-porto-gold-bright transition-colors text-center font-bold text-sm"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-porto-gold-dark via-porto-gold to-porto-gold-bright text-porto-bg font-black py-3.5 rounded-xl text-xs uppercase tracking-widest active:scale-98 transition-all cursor-pointer"
                          >
                            {loading ? t('btn.sending') : t('loyalty.email.getBtn')}
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleEmailVerify} className="space-y-4">
                          <div className="bg-porto-gold/10 border border-porto-gold/20 rounded-xl p-3.5 text-center text-xs text-gray-300">
                            {t('loyalty.email.sentMsg').replace('{email}', email)}
                          </div>

                          {emailDemoCode && (
                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-center text-[10px] text-yellow-500 font-bold uppercase">
                              {t('loyalty.email.demo').replace('{code}', emailDemoCode)}
                            </div>
                          )}

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-porto-gold block text-center">{t('loyalty.email.codeLabel')}</label>
                            <input
                              type="text"
                              required
                              maxLength={4}
                              placeholder="••••"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value)}
                              className="w-full bg-porto-bg border border-porto-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-porto-gold-bright transition-colors text-center font-bold tracking-widest text-lg"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-porto-gold-dark via-porto-gold to-porto-gold-bright text-porto-bg font-black py-3.5 rounded-xl text-xs uppercase tracking-widest active:scale-98 transition-all cursor-pointer"
                          >
                            {loading ? t('loyalty.email.verifying') : t('loyalty.email.verifyBtn')}
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsOtpSent(false)}
                            className="w-full text-center text-[10px] font-bold text-gray-400 hover:text-white uppercase"
                          >
                            {t('loyalty.email.change')}
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* VK AUTH VIEW */}
                  {authMethod === 'vk' && (
                    <div className="space-y-4 text-center">
                      <p className="text-xs text-gray-300 leading-relaxed font-semibold">
                        {t('loyalty.vk.desc')}
                      </p>
                      <button
                        onClick={() => { setShowVkSim(true); setError(''); }}
                        className="w-full bg-[#0077FF] hover:bg-[#0077FF]/80 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                      >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M15.06 2C19.78 2 22 4.22 22 8.94v6.12C22 19.78 19.78 22 15.06 22H8.94C4.22 22 2 19.78 2 15.06V8.94C2 4.22 4.22 2 8.94 2h6.12zm-.41 15.25c-.56-.12-1.07-.46-1.5-.95-.62-.71-.85-.92-1.3-.92-.12 0-.25.04-.37.12v1.31c0 .28-.13.44-.43.44-.65 0-1.89-.37-2.93-1.89-1.28-1.82-1.84-3.79-1.84-4.08 0-.26.13-.39.43-.39h1.16c.26 0 .39.11.44.31.55 1.54 1.34 2.82 1.94 2.82.25 0 .37-.12.37-.37v-2.09c-.06-.82-.57-.89-.57-1.15 0-.13.11-.26.33-.26h1.83c.25 0 .37.13.37.39v2.79c0 .24.1.33.2.33.25 0 .58-.2 1.09-1.01a11.13 11.13 0 001.27-2.31c.06-.18.19-.24.4-.24h1.15c.34 0 .42.16.33.39-.42 1.12-1.63 3.39-1.63 3.39-.17.31-.22.45 0 .73.19.24.84.81 1.28 1.34.81.99 1.43 1.83 1.58 2.37.09.28-.06.41-.39.41h-1.28c-.28 0-.46-.07-.63-.44-.32-.69-.97-1.74-1.39-1.74-.2 0-.34.09-.43.29z"/>
                        </svg>
                        <span>{t('loyalty.vk.btn')}</span>
                      </button>
                    </div>
                  )}

                  {/* DIRECT PHONE FALLBACK */}
                  {authMethod === 'phone_direct' && (
                    <form onSubmit={handleDirectPhoneLogin} className="space-y-4">
                      <p className="text-xs text-gray-300 text-center leading-relaxed">
                        {t('loyalty.phone.desc')}
                      </p>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-porto-gold">{t('loyalty.phone.label')}</label>
                        <input
                          type="tel"
                          required
                          placeholder="+7 (999) 888-77-66"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-porto-bg border border-porto-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-porto-gold-bright transition-colors text-center font-bold text-sm"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-porto-gold-dark via-porto-gold to-porto-gold-bright text-porto-bg font-black py-3.5 rounded-xl text-xs uppercase tracking-widest active:scale-98 transition-all cursor-pointer"
                      >
                        {loading ? t('loyalty.phone.loading') : t('loyalty.phone.btn')}
                      </button>
                    </form>
                  )}

                  {error && <p className="text-xs text-red-400 text-center font-bold">{error}</p>}
                </div>
              ) : (
                /* REGISTRATION FORM (LINKED CREDENTIALS) */
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="bg-porto-gold/10 border border-porto-gold/20 rounded-2xl p-4 text-center">
                    <p className="text-xs text-gray-300 font-medium leading-relaxed">
                      {t('loyalty.reg.title')}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-porto-gold">
                        {t('loyalty.reg.name')}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t('loyalty.reg.namePlaceholder')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-porto-bg border border-porto-gold/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-porto-gold-bright transition-colors text-sm font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-porto-gold">
                        {t('loyalty.reg.phone')}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+7 (999) 888-77-66"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-porto-bg border border-porto-gold/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-porto-gold-bright transition-colors text-sm font-semibold"
                      />
                    </div>
                  </div>

                  {error && <p className="text-xs text-red-400 text-center font-bold">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-porto-gold-dark via-porto-gold to-porto-gold-bright text-porto-bg font-black py-4 rounded-xl text-xs uppercase tracking-widest active:scale-98 transition-all shadow-lg cursor-pointer"
                  >
                    {loading ? t('loyalty.reg.loading') : t('loyalty.reg.btn')}
                  </button>

                  <p className="text-[9px] text-gray-400 text-center leading-tight">
                    Нажимая кнопку регистрации, вы соглашаетесь с Политикой конфиденциальности и обработкой персональных данных (152-ФЗ).
                  </p>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-center text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                  >
                    {t('loyalty.reg.cancel')}
                  </button>
                </form>
              )
            ) : (
              /* LOGGED-IN VIEW (Tabs: Loyalty Card & Order History) */
              <div className="space-y-5">
                {/* Account Sub-Tabs */}
                <div className="grid grid-cols-2 gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
                  <button
                    onClick={() => setActiveSubTab('card')}
                    className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      activeSubTab === 'card' ? 'bg-porto-gold text-porto-bg' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{t('loyalty.tab.card')}</span>
                  </button>
                  <button
                    onClick={() => setActiveSubTab('orders')}
                    className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      activeSubTab === 'orders' ? 'bg-porto-gold text-porto-bg' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>{t('loyalty.tab.orders')}</span>
                  </button>
                </div>

                {/* TAB CONTENT: LOYALTY CARD */}
                {activeSubTab === 'card' && (
                  <div className="space-y-6">
                    {/* Premium Golden Member Card */}
                    <div className={`relative aspect-[1.58/1] w-full rounded-2xl p-5 overflow-hidden bg-gradient-to-br ${getTierGlowColor(member.tier)} border border-porto-gold/30 flex flex-col justify-between shadow-2xl`}>
                      <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-15 pointer-events-none wave-divider"></div>

                      <div className="flex justify-between items-start z-10">
                        <div>
                          <p className="text-[7px] tracking-[0.3em] font-black text-white/70 uppercase">
                            PORTO CLUB • GUEST CARD
                          </p>
                          <h4 className="text-sm font-bold text-white font-serif mt-1 truncate max-w-[180px]">
                            {member.name}
                          </h4>
                        </div>

                        <span className="text-[9px] tracking-wider uppercase font-black px-2 py-0.5 bg-black/40 text-porto-gold border border-porto-gold/20 rounded-md">
                          {member.tier}
                        </span>
                      </div>

                      <div className="flex justify-between items-end z-10">
                        <div>
                          <p className="text-[7px] tracking-[0.2em] font-black text-white/50 uppercase">
                            {t('loyalty.card.balance')}
                          </p>
                          <p className="text-3xl font-serif font-black text-white leading-none mt-1">
                            {member.points} <span className="text-xs font-normal text-porto-gold-bright font-sans">{t('loyalty.card.pts')}</span>
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[6px] tracking-wider text-white/40 uppercase">{t('loyalty.card.number')}</p>
                          <p className="text-xs font-bold text-white/90 tracking-widest">{member.cardNumber}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center z-10 border-t border-white/10 pt-2 text-[6px] text-white/40">
                        <span>REG: {member.registrationDate}</span>
                        <div className="flex space-x-0.5 h-3 items-end">
                          <span className="w-0.5 h-3 bg-white/70 inline-block"></span>
                          <span className="w-[1px] h-3 bg-white/70 inline-block"></span>
                          <span className="w-1.5 h-3 bg-white/70 inline-block"></span>
                        </div>
                      </div>
                    </div>

                    {/* Apple Wallet Button */}
                    <div className="flex justify-center mt-3">
                      <a
                        href={`/api/loyalty/wallet?phone=${encodeURIComponent(member.phone)}`}
                        download
                        className="flex items-center space-x-3 bg-black hover:bg-black/95 border border-porto-gold/30 hover:border-porto-gold-bright px-5 py-2 rounded-xl text-[10px] uppercase tracking-wider font-bold text-white transition-all shadow-lg active:scale-95 cursor-pointer select-none"
                      >
                        <svg className="w-5.5 h-5.5 text-white" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M36 12H12C10.3431 12 9 13.3431 9 15V27C9 28.6569 10.3431 30 12 30H36C37.6569 30 39 28.6569 39 27V15C39 13.3431 37.6569 12 36 12Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                          <path d="M33 9H15C13.8954 9 13 9.89543 13 11V12H35V11C35 9.89543 34.1046 9 33 9Z" fill="currentColor" fillOpacity="0.25"/>
                          <path d="M30 6H18C17.4477 6 17 6.44772 17 7V9H31V7C31 6.44772 30.5523 6 30 6Z" fill="currentColor" fillOpacity="0.35"/>
                          <circle cx="16" cy="21" r="2" fill="currentColor"/>
                        </svg>
                        <span>{t('loyalty.card.wallet')}</span>
                      </a>
                    </div>

                    {/* QR Code and Actions */}
                    <div className="grid grid-cols-3 gap-4 items-center bg-porto-bg/40 border border-porto-gold/10 rounded-2xl p-3.5">
                      <button
                        onClick={() => setIsQrZoomed(true)}
                        className="col-span-1 flex flex-col items-center justify-center border-r border-white/5 pr-3 cursor-pointer hover:scale-105 active:scale-95 transition-all text-center focus:outline-none"
                      >
                        <div className="bg-white p-1 rounded-md shadow-md">
                          <svg className="w-16 h-16 text-black" viewBox="0 0 100 100" fill="currentColor">
                            <rect x="10" y="10" width="20" height="20" />
                            <rect x="70" y="10" width="20" height="20" />
                            <rect x="10" y="70" width="20" height="20" />
                            <rect x="15" y="15" width="10" height="10" fill="white" />
                            <rect x="75" y="15" width="10" height="10" fill="white" />
                            <rect x="15" y="75" width="10" height="10" fill="white" />
                            <rect x="35" y="20" width="10" height="5" />
                            <rect x="50" y="15" width="5" height="15" />
                            <rect x="20" y="45" width="15" height="10" />
                            <rect x="45" y="40" width="20" height="5" />
                            <rect x="70" y="45" width="10" height="10" />
                            <rect x="40" y="70" width="10" height="15" />
                            <rect x="60" y="75" width="15" height="5" />
                          </svg>
                        </div>
                        <span className="text-[7px] text-gray-400 mt-1 uppercase tracking-widest font-black">{t('loyalty.card.qrLabel')}</span>
                      </button>

                      <div className="col-span-2 space-y-1.5 pl-2 text-left">
                        <p className="text-[10px] font-bold text-porto-gold flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{t('loyalty.card.memberText').replace('{tier}', member.tier)}</span>
                        </p>
                        <p className="text-[11px] text-gray-300 leading-relaxed font-light">
                          {t('loyalty.card.qrDesc')}
                        </p>
                      </div>
                    </div>

                    {/* Points Transaction History */}
                    <div className="space-y-2 text-left">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-porto-gold flex items-center space-x-1.5">
                        <History className="w-4 h-4" />
                        <span>{t('loyalty.card.historyTitle')}</span>
                      </h4>

                      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                        {member.history.length === 0 ? (
                          <p className="text-xs text-gray-500 py-3 text-center">{t('loyalty.card.historyEmpty')}</p>
                        ) : (
                          member.history.map((log, index) => (
                            <div
                              key={index}
                              className="bg-white/5 border border-white/5 rounded-lg p-2.5 flex items-center justify-between text-xs font-medium"
                            >
                              <div>
                                <p className="text-gray-200">{log.comment}</p>
                                <p className="text-[9px] text-gray-400 mt-0.5">{log.date}</p>
                              </div>
                              <span
                                className={`font-black ${
                                  log.type === 'accrual' ? 'text-emerald-400' : 'text-red-400'
                                }`}
                              >
                                {log.type === 'accrual' ? '+' : '-'}
                                {log.amount}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: ORDER HISTORY */}
                {activeSubTab === 'orders' && (
                  <div className="space-y-4 text-left">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-porto-gold flex items-center space-x-1.5">
                      <ShoppingBag className="w-4 h-4" />
                      <span>{t('loyalty.orders.title')}</span>
                    </h4>

                    {ordersLoading ? (
                      <div className="text-center py-12 text-xs text-gray-400 font-semibold animate-pulse">
                        {t('loyalty.orders.loading')}
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-16 text-gray-500 border border-dashed border-white/5 rounded-2xl">
                        <ShoppingBag className="w-8 h-8 mx-auto stroke-1 text-gray-600 mb-2" />
                        <p className="text-xs font-bold">{t('loyalty.orders.empty')}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{t('loyalty.orders.emptyDesc')}</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                        {orders.map((order) => {
                          const statusInfo = getOrderStatusBadge(order.status);
                          return (
                            <div 
                              key={order.id}
                              className="glass-panel p-4 rounded-xl border border-white/5 bg-white/5 space-y-3"
                            >
                              {/* Order Header */}
                              <div className="flex justify-between items-center text-xs font-bold">
                                <div>
                                  <span className="text-porto-gold">{t('loyalty.orders.id').replace('{val}', order.id.replace('order-', ''))}</span>
                                  <p className="text-[9px] text-gray-400 font-medium mt-0.5">
                                    {new Date(order.createdAt).toLocaleString(t('lang') === 'en' ? 'en-US' : (t('lang') === 'zh' ? 'zh-CN' : 'ru-RU'))}
                                  </p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full border text-[9px] uppercase tracking-wider font-semibold ${statusInfo.style}`}>
                                  {statusInfo.text}
                                </span>
                              </div>

                              {/* Details info */}
                              <div className="text-[10px] text-gray-300 bg-black/20 p-2.5 rounded-lg border border-white/5 space-y-1">
                                <p><strong>{t('loyalty.orders.method')}</strong> {getOrderTypeLabel(order.type)}</p>
                                {order.type === 'room' && <p><strong>{t('checkout.roomLabel')}:</strong> {order.roomNumber}</p>}
                                {order.type === 'table' && <p><strong>{t('checkout.tableLabel')}:</strong> {order.tableNumber}</p>}
                              </div>

                              {/* Totals */}
                              <div className="flex justify-between items-center text-xs font-bold pt-1">
                                <span className="text-gray-400">{t('loyalty.orders.total')}</span>
                                <span className="text-porto-gold-bright text-sm">{order.totalAmount} ₽</span>
                              </div>

                              {/* Repeat Order Button */}
                              <div className="pt-2 border-t border-white/5">
                                <button
                                  onClick={() => handleRepeatOrder(order)}
                                  className="w-full flex items-center justify-center space-x-1.5 bg-porto-gold/10 border border-porto-gold/20 hover:bg-porto-gold/20 text-porto-gold-bright font-bold py-2 rounded-lg text-[10px] uppercase transition-colors cursor-pointer"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-porto-gold" />
                                  <span>{t('profile.repeatOrder')}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Log Out */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 font-bold py-2.5 rounded-xl text-xs uppercase cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('loyalty.orders.logout')}</span>
                </button>
              </div>
            )}
          </motion.div>

          {/* QR Zoom Overlay */}
          <AnimatePresence>
            {isQrZoomed && member && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsQrZoomed(false)}
                className="fixed inset-0 z-55 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center cursor-pointer p-6"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white p-6 rounded-3xl border border-porto-gold/30 shadow-2xl flex flex-col items-center justify-center space-y-4 max-w-xs w-full text-center"
                >
                  <div className="p-2 bg-gray-50 rounded-2xl border border-gray-100">
                    <svg className="w-56 h-56 text-black animate-fade-in" viewBox="0 0 100 100" fill="currentColor">
                      <rect x="10" y="10" width="20" height="20" />
                      <rect x="70" y="10" width="20" height="20" />
                      <rect x="10" y="70" width="20" height="20" />
                      <rect x="15" y="15" width="10" height="10" fill="white" />
                      <rect x="75" y="15" width="10" height="10" fill="white" />
                      <rect x="15" y="75" width="10" height="10" fill="white" />
                      <rect x="35" y="20" width="10" height="5" />
                      <rect x="50" y="15" width="5" height="15" />
                      <rect x="20" y="45" width="15" height="10" />
                      <rect x="45" y="40" width="20" height="5" />
                      <rect x="70" y="45" width="10" height="10" />
                      <rect x="40" y="70" width="10" height="15" />
                      <rect x="60" y="75" width="15" height="5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-950 font-serif tracking-wider">
                      {member.cardNumber}
                    </p>
                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mt-1">
                      {t('loyalty.orders.qrWaiterHint')}
                    </p>
                  </div>
                </motion.div>
                <p className="text-gray-400 text-xs font-semibold uppercase mt-6 tracking-widest text-center">
                  {t('loyalty.orders.qrClose')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SIMULATED VK LOGIN MODAL SHEET */}
          <AnimatePresence>
            {showVkSim && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowVkSim(false)}
                  className="fixed inset-0 z-55 bg-black/90 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-55 bg-[#222] border border-[#333] rounded-3xl p-6 shadow-2xl space-y-5"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <div className="flex items-center space-x-2 text-[#0077FF]">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M15.06 2C19.78 2 22 4.22 22 8.94v6.12C22 19.78 19.78 22 15.06 22H8.94C4.22 22 2 19.78 2 15.06V8.94C2 4.22 4.22 2 8.94 2h6.12zm-.41 15.25c-.56-.12-1.07-.46-1.5-.95-.62-.71-.85-.92-1.3-.92-.12 0-.25.04-.37.12v1.31c0 .28-.13.44-.43.44-.65 0-1.89-.37-2.93-1.89-1.28-1.82-1.84-3.79-1.84-4.08 0-.26.13-.39.43-.39h1.16c.26 0 .39.11.44.31.55 1.54 1.34 2.82 1.94 2.82.25 0 .37-.12.37-.37v-2.09c-.06-.82-.57-.89-.57-1.15 0-.13.11-.26.33-.26h1.83c.25 0 .37.13.37.39v2.79c0 .24.1.33.2.33.25 0 .58-.2 1.09-1.01a11.13 11.13 0 001.27-2.31c.06-.18.19-.24.4-.24h1.15c.34 0 .42.16.33.39-.42 1.12-1.63 3.39-1.63 3.39-.17.31-.22.45 0 .73.19.24.84.81 1.28 1.34.81.99 1.43 1.83 1.58 2.37.09.28-.06.41-.39.41h-1.28c-.28 0-.46-.07-.63-.44-.32-.69-.97-1.74-1.39-1.74-.2 0-.34.09-.43.29z"/>
                      </svg>
                      <span className="font-bold text-sm tracking-wider uppercase">{t('loyalty.vkSim.title')}</span>
                    </div>
                    <button onClick={() => setShowVkSim(false)} className="text-gray-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleVkLoginSimulate} className="space-y-4">
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      {t('loyalty.vkSim.desc')}
                    </p>

                    <div className="space-y-3 text-left">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-porto-gold">{t('loyalty.vkSim.name')}</label>
                        <input
                          type="text"
                          required
                          placeholder="Александр Смирнов"
                          value={vkName}
                          onChange={(e) => setVkName(e.target.value)}
                          className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#0077FF]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-porto-gold">{t('loyalty.vkSim.profileUrl')}</label>
                        <input
                          type="text"
                          placeholder="vk.com/id12345"
                          value={vkProfileUrl}
                          onChange={(e) => setVkProfileUrl(e.target.value)}
                          className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#0077FF]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#0077FF] hover:bg-[#0077FF]/90 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-widest active:scale-98 transition-all cursor-pointer"
                    >
                      {t('loyalty.vkSim.btn')}
                    </button>
                  </form>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};
