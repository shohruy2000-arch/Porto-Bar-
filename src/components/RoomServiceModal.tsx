'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, CheckCircle, ShoppingCart, User, Phone, Check, CreditCard, Banknote, Gift, MapPin, Building2, Home, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { menuRepository } from '../data/localMenuRepository';
import { Order, OrderType, OrderDetailItem, Language } from '../types';
import { DeliveryMapPicker, DeliveryLocationData } from './DeliveryMapPicker';

interface RoomServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoomServiceModal: React.FC<RoomServiceModalProps> = ({ isOpen, onClose }) => {
  const { t, translate, language, setLanguage } = useLanguage();
  const {
    items,
    roomNumber,
    setRoomNumber,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalAmount
  } = useCart();

  // Checkout Step State: 'cart' | 'details' | 'success'
  const [step, setStep] = useState<'cart' | 'details' | 'success'>('cart');
  
  // Checkout Form States
  const [orderType, setOrderType] = useState<OrderType>('room');
  const [tableNumber, setTableNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'terminal' | 'cash'>('terminal');

  // Delivery details state
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryLat, setDeliveryLat] = useState<number | undefined>(undefined);
  const [deliveryLng, setDeliveryLng] = useState<number | undefined>(undefined);
  const [deliveryApartment, setDeliveryApartment] = useState('');
  const [deliveryEntrance, setDeliveryEntrance] = useState('');
  const [deliveryFloor, setDeliveryFloor] = useState('');
  const [deliveryIntercom, setDeliveryIntercom] = useState('');
  const [deliveryComment, setDeliveryComment] = useState('');
  const [deliveryDistance, setDeliveryDistance] = useState<number | undefined>(undefined);
  const [isWithinDeliveryRadius, setIsWithinDeliveryRadius] = useState<boolean>(true);

  // Delivery Config States from /api/config
  const [yandexEdaUrl, setYandexEdaUrl] = useState('');
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState(2);
  const [restaurantLat, setRestaurantLat] = useState(55.654060);
  const [restaurantLng, setRestaurantLng] = useState(37.498877);
  const [restaurantAddress, setRestaurantAddress] = useState('Ленинский проспект, 146 (Отель Аструс)');
  const [deliveryFee, setDeliveryFee] = useState(0);

  // Working Hours States
  const [workHoursStart, setWorkHoursStart] = useState('12:00');
  const [workHoursEnd, setWorkHoursEnd] = useState('24:00');
  const [isRestaurantClosed, setIsRestaurantClosed] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const checkIfOpen = (start: string, end: string) => {
    try {
      const formatter = new Intl.DateTimeFormat('ru-RU', {
        timeZone: 'Europe/Moscow',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      });
      const moscowTimeStr = formatter.format(new Date()); // e.g. "12:20" or "0:20"
      const [h, m] = moscowTimeStr.split(':').map(Number);
      const currentTimeMinutes = h * 60 + m;
      
      const parseTimeToMinutes = (timeStr: string): number => {
        const parts = timeStr.split(':');
        const hh = parseInt(parts[0], 10) || 0;
        const mm = parseInt(parts[1], 10) || 0;
        return hh * 60 + mm;
      };
      
      let startMinutes = parseTimeToMinutes(start);
      let endMinutes = parseTimeToMinutes(end);
      
      if (endMinutes <= startMinutes) {
        return currentTimeMinutes >= startMinutes || currentTimeMinutes < endMinutes;
      }
      
      return currentTimeMinutes >= startMinutes && currentTimeMinutes < endMinutes;
    } catch (e) {
      console.error(e);
      return true; // fallback
    }
  };

  // Lock background body scroll when cart modal is open
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isOpen) {
      const scrollY = window.scrollY;
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const storedPhone = localStorage.getItem('porto_loyalty_logged_phone');
      if (storedPhone) {
        setPhone(storedPhone);
        menuRepository.getLoyaltyMemberByPhone(storedPhone)
          .then((m) => {
            if (m) setGuestName(m.name);
          })
          .catch((err) => console.error(err));
      }

      // Fetch config hours and delivery settings
      fetch('/api/config')
        .then(res => {
          if (res.ok) return res.json();
          throw new Error();
        })
        .then(configData => {
          const start = configData.workHoursStart || '12:00';
          const end = configData.workHoursEnd || '24:00';
          setWorkHoursStart(start);
          setWorkHoursEnd(end);
          setIsRestaurantClosed(!checkIfOpen(start, end));

          if (configData.yandexEdaUrl) setYandexEdaUrl(configData.yandexEdaUrl);
          if (configData.deliveryRadiusKm !== undefined) setDeliveryRadiusKm(Number(configData.deliveryRadiusKm));
          if (configData.restaurantLat !== undefined) setRestaurantLat(Number(configData.restaurantLat));
          if (configData.restaurantLng !== undefined) setRestaurantLng(Number(configData.restaurantLng));
          if (configData.restaurantAddress) setRestaurantAddress(configData.restaurantAddress);
          if (configData.deliveryFee !== undefined) setDeliveryFee(Number(configData.deliveryFee));
        })
        .catch(err => console.error('Failed to load config in modal:', err));
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    // Reset steps after slide-out transition
    setTimeout(() => {
      setStep('cart');
      setTableNumber('');
      setPhone('');
      setGuestName('');
      setSubmittedOrder(null);
      setError('');
      setIsSubmitting(false);
      setIsRestaurantClosed(false);
    }, 300);
  };

  const handleLocationChange = (data: DeliveryLocationData) => {
    setDeliveryLat(data.lat);
    setDeliveryLng(data.lng);
    setDeliveryAddress(data.address);
    setDeliveryDistance(data.distance);
    setIsWithinDeliveryRadius(data.isWithinRadius);
    setError('');
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRestaurantClosed) {
      setError(t('checkout.restaurantClosed'));
      return;
    }
    if (!phone.trim()) {
      setError(t('checkout.phoneRequired'));
      return;
    }
    if (orderType === 'room' && !roomNumber.trim()) {
      setError(t('checkout.roomRequired'));
      return;
    }
    if (orderType === 'table' && !tableNumber.trim()) {
      setError(t('checkout.tableRequired'));
      return;
    }
    if (orderType === 'delivery') {
      if (!deliveryAddress.trim()) {
        setError(t('checkout.addressRequired').replace('{radius}', String(deliveryRadiusKm)));
        return;
      }
      if (!isWithinDeliveryRadius) {
        setError(t('checkout.outOfRangeError').replace('{radius}', String(deliveryRadiusKm)));
        return;
      }
    }

    setIsSubmitting(true);
    setError('');

    const orderItems: OrderDetailItem[] = items.map(item => ({
      dishId: item.dish.id,
      quantity: item.quantity,
      priceAtOrder: item.dish.price
    }));

    // Inject Margarita Pizza as a free gift if eligible (Room Service & Total >= 3000)
    if (orderType === 'room' && totalAmount >= 3000) {
      orderItems.push({
        dishId: 'dish-10', // Pizza Margherita
        quantity: 1,
        priceAtOrder: 0
      });
    }

    const extraFee = orderType === 'room' ? 150 : (orderType === 'delivery' ? deliveryFee : 0);

    const orderData: Omit<Order, 'id' | 'createdAt'> = {
      type: orderType,
      phone: phone.trim(),
      roomNumber: orderType === 'room' ? roomNumber.trim() : undefined,
      tableNumber: orderType === 'table' ? tableNumber.trim() : undefined,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
      deliveryLat: orderType === 'delivery' ? deliveryLat : undefined,
      deliveryLng: orderType === 'delivery' ? deliveryLng : undefined,
      deliveryApartment: orderType === 'delivery' && deliveryApartment.trim() ? deliveryApartment.trim() : undefined,
      deliveryEntrance: orderType === 'delivery' && deliveryEntrance.trim() ? deliveryEntrance.trim() : undefined,
      deliveryFloor: orderType === 'delivery' && deliveryFloor.trim() ? deliveryFloor.trim() : undefined,
      deliveryIntercom: orderType === 'delivery' && deliveryIntercom.trim() ? deliveryIntercom.trim() : undefined,
      deliveryComment: orderType === 'delivery' && deliveryComment.trim() ? deliveryComment.trim() : undefined,
      deliveryDistance: orderType === 'delivery' ? deliveryDistance : undefined,
      items: orderItems,
      totalAmount: totalAmount + extraFee,
      paymentMethod,
      status: 'received',
      idempotencyKey: typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID 
        ? window.crypto.randomUUID() 
        : 'idemp-' + Math.random().toString(36).substring(2) + Date.now().toString(36)
    };

    try {
      if (typeof window !== 'undefined' && !navigator.onLine) {
        // Queue order offline
        const { queueOrderSubmission } = await import('../lib/offlineQueue');
        await queueOrderSubmission(orderData);

        const offlineOrder: Order = {
          id: `offline-order-${Date.now()}`,
          createdAt: new Date().toISOString(),
          ...orderData,
          status: 'received'
        };
        setSubmittedOrder(offlineOrder);
        clearCart();
        setStep('success');
        return;
      }

      const savedOrder = await menuRepository.addOrder(orderData);
      setSubmittedOrder(savedOrder);
      clearCart();
      setStep('success');

      // Request push permission after successful order placement
      const { requestPushPermissionAfterAction } = await import('../lib/pushNotifications');
      requestPushPermissionAfterAction().catch(err => console.log('[Push] Request deferred:', err));
    } catch (err) {
      console.error(err);
      
      // Fallback: If network request failed, queue it offline instead of failing
      try {
        const { queueOrderSubmission } = await import('../lib/offlineQueue');
        await queueOrderSubmission(orderData);

        const offlineOrder: Order = {
          id: `offline-order-${Date.now()}`,
          createdAt: new Date().toISOString(),
          ...orderData,
          status: 'received'
        };
        setSubmittedOrder(offlineOrder);
        clearCart();
        setStep('success');
      } catch (innerErr) {
        console.error('Failed to queue offline:', innerErr);
        setError(t('error.connection'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculatedTotal = totalAmount + (orderType === 'room' ? 150 : (orderType === 'delivery' ? deliveryFee : 0));

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
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={isMobile ? { type: 'spring', damping: 25, stiffness: 220 } : { type: 'spring', damping: 28, stiffness: 180 }}
            className="fixed z-50 glass-panel border-porto-gold/30 shadow-[0_-15px_40px_rgba(0,0,0,0.8)] flex flex-col bottom-0 left-0 right-0 rounded-t-3xl p-5 pb-8 max-h-[92vh] w-full max-w-md mx-auto border-t md:right-0 md:left-auto md:top-0 md:bottom-0 md:h-screen md:max-h-screen md:w-[460px] md:rounded-l-3xl md:rounded-tr-none md:border-l md:border-t-0 overflow-hidden overscroll-contain"
            style={{ overscrollBehavior: 'contain' }}
          >
            {/* Top Bar with Title, Language Switcher & Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-porto-gold/15 mb-2.5 shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-porto-gold/10 rounded-full border border-porto-gold/25">
                  <ShoppingCart className="w-4 h-4 text-porto-gold" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-gold-gradient leading-tight">
                    {step === 'cart' ? t('cart.title') : step === 'details' ? t('checkout.title') : t('checkout.successOnline')}
                  </h3>
                  <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">
                    {t('info.location')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Language Switcher inside Cart */}
                <div className="p-0.5 bg-black/50 border border-porto-gold/25 rounded-full flex items-center shadow-inner">
                  {(['ru', 'en', 'zh'] as Language[]).map((lang) => {
                    const isActive = language === lang;
                    const labels: Record<Language, string> = { ru: 'RU', en: 'EN', zh: '中文' };
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setLanguage(lang)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-porto-gold text-porto-bg shadow-sm scale-105'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {labels[lang]}
                      </button>
                    );
                  })}
                </div>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
                  title={t('ui.close')}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* STEP 1: REVIEW CART ITEMS */}
            {step === 'cart' && (
              <>

                {/* Progress Bar towards Free Gift */}
                {items.length > 0 && (
                  <div className="mb-4 bg-white/5 border border-porto-gold/15 p-3 rounded-2xl">
                    <div className="flex justify-between items-center text-[9px] uppercase font-bold text-porto-gold tracking-wider mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 animate-pulse text-porto-gold-bright" />
                        <span>{t('cart.promoGiftTitle')}</span>
                      </span>
                      <span>{totalAmount} / 3000 {t('label.rub')}</span>
                    </div>
                    <div className="relative w-full h-1.5 bg-white/15 rounded-full overflow-hidden mb-1.5">
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-porto-gold to-porto-gold-bright transition-all duration-500 rounded-full"
                        style={{ width: `${Math.min(100, (totalAmount / 3000) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                      {totalAmount < 3000 ? (
                        t('cart.promoGiftProgress').replace('{amount}', String(3000 - totalAmount))
                      ) : (
                        <span className="text-emerald-400 font-bold flex items-center space-x-1">
                          <span>{t('cart.promoGiftSuccess')}</span>
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Items Scroll list */}
                <div 
                  className="flex-1 overflow-y-auto space-y-3.5 pr-1 min-h-[180px] max-h-[40vh] md:max-h-[55vh] overscroll-contain"
                  style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
                >
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
                      <ShoppingCart className="w-10 h-10 text-gray-600 mb-2 stroke-1" />
                      <p className="text-sm font-semibold">{t('cart.empty')}</p>
                      <p className="text-xs text-gray-500 mt-1">{t('cart.addInstructions')}</p>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.dish.id}
                        className="flex items-center space-x-3 border-b border-white/5 pb-3 last:border-b-0 last:pb-0"
                      >
                        {/* Tiny Preview */}
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-porto-gold/10 bg-porto-bg/85 flex-shrink-0">
                          {item.dish.image ? (
                            (item.dish.image.startsWith('data:') || item.dish.image.startsWith('/uploads/')) ? (
                              <img
                                src={item.dish.image}
                                alt={translate(item.dish.name)}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <Image
                                src={item.dish.image}
                                alt={translate(item.dish.name)}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            )
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-porto-bg">
                              <span className="text-[6px] text-porto-gold font-bold font-serif uppercase">P-B</span>
                            </div>
                          )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-gray-100 truncate">
                            {translate(item.dish.name)}
                          </h4>
                          <p className="text-xs font-semibold text-porto-gold mt-0.5">
                            {item.dish.price} {t('label.rub')}
                          </p>
                        </div>

                        {/* Qtys */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.dish.id, item.quantity - 1)}
                            className="p-1 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 text-gray-300"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-white w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.dish.id, item.quantity + 1)}
                            className="p-1 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 text-gray-300"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.dish.id)}
                            className="p-1 bg-red-500/10 hover:bg-red-500/20 rounded-md border border-red-500/20 text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Bottom Total & Checkout Link */}
                {items.length > 0 && (
                  <div className="border-t border-porto-gold/20 pt-4 mt-4 space-y-4">
                    {/* Promotion Banner */}
                    {totalAmount >= 3000 ? (
                      <div className="p-3 bg-porto-gold/15 border border-porto-gold/30 rounded-xl text-center text-xs font-bold text-porto-gold-bright animate-pulse">
                        {t('promo.banner.eligible')}
                      </div>
                    ) : (
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center text-[11px] text-gray-400">
                        {t('promo.banner.notEligible').replace('{amount}', String(3000 - totalAmount))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        {t('cart.total')}
                      </span>
                      <span className="text-xl font-bold text-porto-gold-bright font-serif">
                        {totalAmount} {t('label.rub')}
                      </span>
                    </div>

                    {isRestaurantClosed ? (
                      <div className="w-full bg-red-950/40 border border-red-500/20 p-4 rounded-xl text-center shadow-lg">
                        <p className="text-xs font-bold text-red-200">
                          {t('promo.closed')}
                        </p>
                        <p className="text-[10px] text-gray-400 font-semibold mt-1.5 tracking-wider">
                          {t('promo.workHoursText').replace('{start}', workHoursStart).replace('{end}', workHoursEnd)}
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setStep('details')}
                        className="w-full bg-gradient-to-r from-porto-gold-dark via-porto-gold to-porto-gold-bright text-porto-bg font-black py-4 rounded-xl text-xs uppercase tracking-widest active:scale-98 transition-all shadow-lg cursor-pointer"
                      >
                        {t('cart.checkoutBtn')}
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {/* STEP 2: FILL DETAILS FOR CHECKOUT */}
            {step === 'details' && (
              <form 
                onSubmit={handleCheckoutSubmit} 
                className="flex-1 flex flex-col min-h-0 overflow-y-auto pr-1 space-y-4 overscroll-contain"
                style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
              >
                <div className="text-left shrink-0">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">{t('checkout.subtitle')}</p>
                </div>

                {guestName && (
                  <div className="bg-porto-gold/10 border border-porto-gold/20 rounded-xl p-2.5 text-xs text-gray-300 text-center font-medium shrink-0">
                    {t('checkout.welcomeLoyalty').replace('{name}', guestName)}
                  </div>
                )}

                {/* Order Type Toggle Selector */}
                <div className="space-y-1.5 text-left shrink-0">
                  <span className="text-[10px] font-bold uppercase text-porto-gold tracking-wider">{t('checkout.orderType')}</span>
                  <div className="grid grid-cols-4 gap-1 p-1 bg-porto-bg/60 border border-porto-gold/15 rounded-xl">
                    {(['room', 'delivery', 'table', 'takeaway'] as OrderType[]).map((type) => {
                      const labels: Record<string, string> = {
                        room: t('checkout.deliveryRoom'),
                        delivery: t('checkout.deliveryAddressTab'),
                        table: t('checkout.deliveryTable'),
                        takeaway: t('checkout.deliveryTakeaway')
                      };
                      const isActive = orderType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setOrderType(type);
                            setError('');
                          }}
                          className={`py-2 px-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer truncate text-center ${
                            isActive
                              ? 'bg-porto-gold text-porto-bg shadow'
                              : 'text-gray-400 hover:text-gray-200'
                          }`}
                        >
                          {labels[type]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 1. ROOM DESTINATION */}
                {orderType === 'room' && (
                  <div className="space-y-1 text-left shrink-0">
                    <label className="text-[10px] font-bold uppercase text-porto-gold tracking-wider">{t('checkout.roomLabel')}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1205"
                      value={roomNumber}
                      onChange={(e) => {
                        setRoomNumber(e.target.value);
                        setError('');
                      }}
                      className="w-full bg-porto-bg border border-porto-gold/25 rounded-xl px-4 py-3 font-bold text-center text-sm focus:outline-none focus:border-porto-gold-bright"
                    />
                  </div>
                )}

                {/* 2. TABLE DESTINATION */}
                {orderType === 'table' && (
                  <div className="space-y-1 text-left shrink-0">
                    <label className="text-[10px] font-bold uppercase text-porto-gold tracking-wider">{t('checkout.tableLabel')}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5"
                      value={tableNumber}
                      onChange={(e) => {
                        setTableNumber(e.target.value);
                        setError('');
                      }}
                      className="w-full bg-porto-bg border border-porto-gold/25 rounded-xl px-4 py-3 font-bold text-center text-sm focus:outline-none focus:border-porto-gold-bright"
                    />
                  </div>
                )}

                {/* 3. DELIVERY MAP & ADDRESS PICKER */}
                {orderType === 'delivery' && (
                  <div className="space-y-3 shrink-0">
                    <DeliveryMapPicker
                      restaurantLat={restaurantLat}
                      restaurantLng={restaurantLng}
                      restaurantAddress={restaurantAddress}
                      deliveryRadiusKm={deliveryRadiusKm}
                      yandexEdaUrl={yandexEdaUrl}
                      initialLat={deliveryLat}
                      initialLng={deliveryLng}
                      initialAddress={deliveryAddress}
                      onLocationChange={handleLocationChange}
                    />

                    {/* Extra apartment / entrance / intercom details */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">{t('checkout.apartmentLabel')}</label>
                        <input
                          type="text"
                          placeholder="12"
                          value={deliveryApartment}
                          onChange={(e) => setDeliveryApartment(e.target.value)}
                          className="w-full bg-porto-bg border border-white/10 focus:border-porto-gold rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">{t('checkout.entranceLabel')}</label>
                        <input
                          type="text"
                          placeholder="1"
                          value={deliveryEntrance}
                          onChange={(e) => setDeliveryEntrance(e.target.value)}
                          className="w-full bg-porto-bg border border-white/10 focus:border-porto-gold rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">{t('checkout.floorLabel')}</label>
                        <input
                          type="text"
                          placeholder="3"
                          value={deliveryFloor}
                          onChange={(e) => setDeliveryFloor(e.target.value)}
                          className="w-full bg-porto-bg border border-white/10 focus:border-porto-gold rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">{t('checkout.intercomLabel')}</label>
                        <input
                          type="text"
                          placeholder="12K"
                          value={deliveryIntercom}
                          onChange={(e) => setDeliveryIntercom(e.target.value)}
                          className="w-full bg-porto-bg border border-white/10 focus:border-porto-gold rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Courier Comment */}
                    <div className="space-y-1 text-left">
                      <label className="text-[9px] font-bold text-gray-400 uppercase">{t('checkout.commentLabel')}</label>
                      <input
                        type="text"
                        placeholder={t('checkout.commentPlaceholder')}
                        value={deliveryComment}
                        onChange={(e) => setDeliveryComment(e.target.value)}
                        className="w-full bg-porto-bg border border-white/10 focus:border-porto-gold rounded-lg px-3 py-2 text-xs text-white font-semibold focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Contact Phone Input */}
                <div className="space-y-1 text-left shrink-0">
                  <label className="text-[10px] font-bold uppercase text-porto-gold tracking-wider">{t('checkout.phoneLabel')}</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 w-4 h-4 text-porto-gold" />
                    <input
                      type="tel"
                      required
                      placeholder="+7 (999) 888-77-66"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setError('');
                      }}
                      className="w-full bg-porto-bg border border-porto-gold/25 rounded-xl pl-11 pr-4 py-3.5 font-bold text-sm focus:outline-none focus:border-porto-gold-bright"
                    />
                  </div>
                </div>

                {/* Pricing Summary Breakdown */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 space-y-1.5 text-xs text-left shrink-0">
                  <div className="flex justify-between text-gray-400">
                    <span>{t('checkout.summaryTitle')}</span>
                    <span className="font-bold text-gray-200">{totalAmount} ₽</span>
                  </div>
                  {orderType === 'room' && (
                    <div className="flex justify-between text-porto-gold-bright font-semibold">
                      <span>{t('checkout.summaryDelivery')}</span>
                      <span>150 ₽</span>
                    </div>
                  )}
                  {orderType === 'delivery' && deliveryFee > 0 && (
                    <div className="flex justify-between text-porto-gold-bright font-semibold">
                      <span>{t('checkout.summaryCourierDelivery')}</span>
                      <span>{deliveryFee} ₽</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-white border-t border-white/5 pt-1.5 text-sm">
                    <span>{t('checkout.summaryTotal')}</span>
                    <span className="text-porto-gold-bright">{calculatedTotal} ₽</span>
                  </div>
                </div>

                {/* Payment Option Select (Compact Segmented Glass Control) */}
                <div className="space-y-1.5 text-left shrink-0">
                  <span className="text-[10px] uppercase font-bold text-porto-gold tracking-wider block">
                    {t('checkout.paymentTitle')}
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-porto-bg/80 border border-porto-gold/20 rounded-xl backdrop-blur-md">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('terminal')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs transition-all cursor-pointer ${
                        paymentMethod === 'terminal'
                          ? 'bg-gradient-to-r from-porto-gold/25 via-porto-gold/20 to-porto-gold/15 border border-porto-gold/40 text-porto-gold-bright font-bold shadow-[0_2px_10px_rgba(212,175,55,0.15)]'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent font-medium'
                      }`}
                    >
                      <CreditCard className={`w-4 h-4 shrink-0 ${paymentMethod === 'terminal' ? 'text-porto-gold-bright' : 'text-gray-400'}`} />
                      <span className="text-[11px] truncate font-sans">{t('checkout.paymentTerminal')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs transition-all cursor-pointer ${
                        paymentMethod === 'cash'
                          ? 'bg-gradient-to-r from-porto-gold/25 via-porto-gold/20 to-porto-gold/15 border border-porto-gold/40 text-porto-gold-bright font-bold shadow-[0_2px_10px_rgba(212,175,55,0.15)]'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent font-medium'
                      }`}
                    >
                      <Banknote className={`w-4 h-4 shrink-0 ${paymentMethod === 'cash' ? 'text-porto-gold-bright' : 'text-gray-400'}`} />
                      <span className="text-[11px] truncate font-sans">{t('checkout.paymentCash')}</span>
                    </button>
                  </div>
                </div>

                {error && <p className="text-xs text-red-400 text-center font-bold">{error}</p>}

                {/* Confirm Buttons */}
                <div className="flex space-x-3.5 border-t border-porto-gold/10 pt-3 mt-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="flex-1 border border-white/10 hover:bg-white/5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    {t('checkout.btnBack')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || (orderType === 'delivery' && !isWithinDeliveryRadius)}
                    className="flex-1 bg-gradient-to-r from-porto-gold-dark via-porto-gold to-porto-gold-bright text-porto-bg font-black py-3.5 rounded-xl text-xs uppercase tracking-widest active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg cursor-pointer"
                  >
                    {isSubmitting ? t('btn.sending') : t('checkout.btnSubmit')}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: SUBMITTED SUCCESS DISPLAY */}
            {step === 'success' && submittedOrder && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-6 space-y-5"
              >
                <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-emerald-400 stroke-[3px]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif text-emerald-400">
                    {submittedOrder.id.startsWith('offline-order') ? t('checkout.successOffline') : t('checkout.successOnline')}
                  </h3>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                    ID: #{submittedOrder.id.replace('order-', '').replace('offline-order-', 'OFFLINE-')}
                  </p>
                  <p className="text-xs text-gray-300 mt-2 leading-relaxed px-4">
                    {submittedOrder.id.startsWith('offline-order') ? (
                      <span className="text-porto-gold-bright font-semibold">
                        {t('checkout.successOfflineMsg')}
                      </span>
                    ) : (
                      <>
                        {t('checkout.successOnlineMsg').replace('{phone}', submittedOrder.phone)}
                      </>
                    )}
                  </p>
                </div>

                <div className="glass-panel p-4 rounded-xl text-xs text-left space-y-1.5 border border-porto-gold/15 bg-porto-bg/40 max-w-sm mx-auto">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-gray-400 font-bold uppercase text-[9px]">{t('checkout.successDetailsTitle')}</span>
                    <span className="text-porto-gold-bright font-bold text-right max-w-[200px] truncate">
                      {submittedOrder.type === 'room' && t('checkout.successTypeRoom').replace('{val}', submittedOrder.roomNumber || '')}
                      {submittedOrder.type === 'table' && t('checkout.successTypeTable').replace('{val}', submittedOrder.tableNumber || '')}
                      {submittedOrder.type === 'takeaway' && t('checkout.successTypeTakeaway')}
                      {submittedOrder.type === 'delivery' && (submittedOrder.deliveryAddress || 'Доставка курьером')}
                    </span>
                  </div>

                  {submittedOrder.type === 'delivery' && (submittedOrder.deliveryApartment || submittedOrder.deliveryEntrance) && (
                    <div className="flex justify-between text-gray-300 text-[11px]">
                      <span className="text-gray-400">Кв/Подъезд:</span>
                      <span>
                        {submittedOrder.deliveryApartment ? `кв. ${submittedOrder.deliveryApartment}` : ''}
                        {submittedOrder.deliveryEntrance ? `, под. ${submittedOrder.deliveryEntrance}` : ''}
                        {submittedOrder.deliveryFloor ? `, эт. ${submittedOrder.deliveryFloor}` : ''}
                      </span>
                    </div>
                  )}

                  {submittedOrder.items.some(item => item.priceAtOrder === 0) && (
                    <div className="flex justify-between text-emerald-400 font-semibold text-[11px]">
                      <span>🎁 {t('promo.giftLabel')}:</span>
                      <span>{translate({ ru: 'Пицца Маргарита', en: 'Pizza Margherita', zh: '玛格丽特披萨' })}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('checkout.successPaymentMethod')}</span>
                    <span>{submittedOrder.paymentMethod === 'terminal' ? t('checkout.successMethodTerminal') : t('checkout.successMethodCash')}</span>
                  </div>
                  {submittedOrder.type === 'room' && (
                    <div className="flex justify-between text-porto-gold-bright font-semibold">
                      <span>{t('checkout.summaryDelivery')}</span>
                      <span>150 ₽</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold border-t border-white/5 pt-1.5 text-porto-gold text-sm">
                    <span>{t('checkout.summaryTotal')}</span>
                    <span>{submittedOrder.totalAmount} ₽</span>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-3 rounded-xl text-xs uppercase cursor-pointer"
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
