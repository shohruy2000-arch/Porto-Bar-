'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { menuRepository } from '../../data/localMenuRepository';
import { Dish, Category, Promotion, DishLabel, Order, OrderStatus, LoyaltyMember, LoyaltyTier, WaiterCall, Story } from '../../types';
import { Plus, Trash2, Eye, EyeOff, Edit, ArrowLeft, LogIn, Lock, Settings, FolderPlus, Tag, Sparkles, Search, Award, CheckCircle, AlertCircle, Archive, User, Check, X, ShieldCheck, ShoppingBag, CreditCard, Film, Play, Mail, Globe, Star, Clock, BookOpen, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  const { t, translate } = useLanguage();
  const router = useRouter();

  // Authentication
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState<'dishes' | 'stoplist' | 'categories' | 'content' | 'promotions' | 'orders' | 'loyalty' | 'calls' | 'push' | 'settings'>('dishes');

  // Database State
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [waiterCalls, setWaiterCalls] = useState<WaiterCall[]>([]);
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'completed' | 'archived'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [dishSearch, setDishSearch] = useState('');

  // Loyalty State
  const [loyaltyMembers, setLoyaltyMembers] = useState<LoyaltyMember[]>([]);
  const [loyaltySearch, setLoyaltySearch] = useState('');
  const [selectedLoyaltyMember, setSelectedLoyaltyMember] = useState<LoyaltyMember | null>(null);
  const [pointsAmount, setPointsAmount] = useState<string>('');
  const [pointsComment, setPointsComment] = useState<string>('');

  // Settings State
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [waiterChatId, setWaiterChatId] = useState('');
  const [waiters, setWaiters] = useState<{ name: string; chatId: string; tables: string }[]>([]);
  const [newWaiterName, setNewWaiterName] = useState('');
  const [newWaiterChatId, setNewWaiterChatId] = useState('');
  const [newWaiterTables, setNewWaiterTables] = useState('');
  const [isTelegramConfigured, setIsTelegramConfigured] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [geminiProxyUrl, setGeminiProxyUrl] = useState('');
  const [isGeminiConfigured, setIsGeminiConfigured] = useState(false);
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [isOpenAiConfigured, setIsOpenAiConfigured] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isFreeTranslating, setIsFreeTranslating] = useState(false);
  const [isFreeTranslatingPromo, setIsFreeTranslatingPromo] = useState(false);
  const [isFreeTranslatingCat, setIsFreeTranslatingCat] = useState(false);
  const [isEstimatingKbju, setIsEstimatingKbju] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');
  
  // SMTP and VK ID configurations
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState<string>('465');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [vkAppId, setVkAppId] = useState('');
  const [isSmtpConfigured, setIsSmtpConfigured] = useState(false);
  const [botUsername, setBotUsername] = useState('');
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);

  // iiko Integration
  const [iikoEnabled, setIikoEnabled] = useState(false);
  const [iikoApiLogin, setIikoApiLogin] = useState('');
  const [iikoOrganizationId, setIikoOrganizationId] = useState('');
  const [iikoTerminalGroupId, setIikoTerminalGroupId] = useState('');
  const [isIikoConfigured, setIsIikoConfigured] = useState(false);
  const [isTestingIiko, setIsTestingIiko] = useState(false);

  // Working Hours State
  const [workHoursStart, setWorkHoursStart] = useState('11:30');
  const [workHoursEnd, setWorkHoursEnd] = useState('23:30');

  // Hero & Content management states
  const [heroVideoUrl, setHeroVideoUrl] = useState('');
  const [heroType, setHeroType] = useState<'video' | 'slideshow'>('slideshow');
  const [heroSloganRU, setHeroSloganRU] = useState('');
  const [heroSloganEN, setHeroSloganEN] = useState('');
  const [heroSloganZH, setHeroSloganZH] = useState('');
  const [statusBannerTextRU, setStatusBannerTextRU] = useState('');
  const [statusBannerTextEN, setStatusBannerTextEN] = useState('');
  const [statusBannerTextZH, setStatusBannerTextZH] = useState('');
  const [printedMenuImage, setPrintedMenuImage] = useState('/images/image_2026-07-01_13-49-49.png');
  const [isHeroVideoUploading, setIsHeroVideoUploading] = useState(false);
  const [isPrintedMenuUploading, setIsPrintedMenuUploading] = useState(false);
  const [heroVideoUploadError, setHeroVideoUploadError] = useState('');
  const [contentSuccess, setContentSuccess] = useState('');

  // Delivery Settings States
  const [yandexEdaUrl, setYandexEdaUrl] = useState('');
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState<number>(2);
  const [restaurantAddress, setRestaurantAddress] = useState('Ленинский проспект, 146, Москва (Отель Аструс)');
  const [restaurantLat, setRestaurantLat] = useState<number>(55.654060);
  const [restaurantLng, setRestaurantLng] = useState<number>(37.498877);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);

  // Push Notification States
  const [pushCount, setPushCount] = useState<number>(0);
  const [pushTitle, setPushTitle] = useState<string>('');
  const [pushBody, setPushBody] = useState<string>('');
  const [pushUrl, setPushUrl] = useState<string>('');
  const [isBroadcastingPush, setIsBroadcastingPush] = useState<boolean>(false);
  const [pushBroadcastResult, setPushBroadcastResult] = useState<{ success: boolean; sent?: number; failed?: number; error?: string } | null>(null);
  const [iikoTestResult, setIikoTestResult] = useState<{ success: boolean; organizations?: any[]; error?: string } | null>(null);
  const [iikoOrganizations, setIikoOrganizations] = useState<any[]>([]);
  const [iikoTerminalGroups, setIikoTerminalGroups] = useState<any[]>([]);

  // Stories Video states
  const [stories, setStories] = useState<Story[]>([]);
  const [backstageVideoEnabled, setBackstageVideoEnabled] = useState(true);
  const [isVideoUploadingMap, setIsVideoUploadingMap] = useState<Record<string, boolean>>({});
  const [videoUploadErrorMap, setVideoUploadErrorMap] = useState<Record<string, string>>({});

  // Editing state
  const [editingDish, setEditingDish] = useState<Partial<Dish> | null>(null);
  const [editingPromo, setEditingPromo] = useState<Partial<Promotion> | null>(null);

  // Form states for Category
  const [newCatRU, setNewCatRU] = useState('');
  const [newCatEN, setNewCatEN] = useState('');
  const [newCatZH, setNewCatZH] = useState('');

  useEffect(() => {
    // Check if session has authorized status
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('porto_admin_auth');
      if (auth === 'true') {
        setIsAuthorized(true);
      }
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        menuData,
        dbOrders,
        dbLoyalty,
        waiterCallsRes,
        configRes,
        pushRes
      ] = await Promise.all([
        menuRepository.getMenuData(),
        menuRepository.getOrders(),
        menuRepository.getLoyaltyMembers(),
        fetch('/api/waiter-calls').catch(() => null),
        fetch('/api/config').catch(() => null),
        fetch('/api/push/subscribe').catch(() => null)
      ]);

      if (menuData) {
        setCategories(menuData.categories || []);
        setDishes(menuData.dishes || []);
        setPromotions(menuData.promotions || []);
      }

      if (dbOrders) {
        dbOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(dbOrders);
      }

      if (dbLoyalty) setLoyaltyMembers(dbLoyalty);

      if (waiterCallsRes && waiterCallsRes.ok) {
        const callsData = await waiterCallsRes.json();
        callsData.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setWaiterCalls(callsData);
      }

      if (pushRes && pushRes.ok) {
        const pushData = await pushRes.json();
        setPushCount(pushData.count || 0);
      }

      if (configRes && configRes.ok) {
        const configData = await configRes.json();
        setIsTelegramConfigured(configData.isConfigured);
        setIsGeminiConfigured(configData.isGeminiConfigured);
        setIsOpenAiConfigured(configData.isOpenAiConfigured);
        setChatId(configData.chatId || '');
        setGeminiProxyUrl(configData.geminiProxyUrl || '');
        setWaiterChatId(configData.waiterChatId || '');
        setWaiters(configData.waiters || []);
        
        setIsSmtpConfigured(configData.isSmtpConfigured || false);
        setSmtpHost(configData.smtpHost || '');
        setSmtpPort(String(configData.smtpPort || '465'));
        setSmtpUser(configData.smtpUser || '');
        setVkAppId(configData.vkAppId || '');
        setBotUsername(configData.botUsername || '');
        setWorkHoursStart(configData.workHoursStart || '11:30');
        setWorkHoursEnd(configData.workHoursEnd || '23:30');

        // Hero & Content config
        setHeroVideoUrl(configData.heroVideoUrl || '');
        setHeroType(configData.heroType || 'slideshow');
        setHeroSloganRU(configData.heroSlogan?.ru || '');
        setHeroSloganEN(configData.heroSlogan?.en || '');
        setHeroSloganZH(configData.heroSlogan?.zh || '');
        setStatusBannerTextRU(configData.statusBannerText?.ru || '');
        setStatusBannerTextEN(configData.statusBannerText?.en || '');
        setStatusBannerTextZH(configData.statusBannerText?.zh || '');
        setPrintedMenuImage(configData.printedMenuImage || '/images/image_2026-07-01_13-49-49.png');

        // Delivery config
        setYandexEdaUrl(configData.yandexEdaUrl || '');
        if (configData.deliveryRadiusKm !== undefined) setDeliveryRadiusKm(Number(configData.deliveryRadiusKm));
        if (configData.restaurantAddress) setRestaurantAddress(configData.restaurantAddress);
        if (configData.restaurantLat !== undefined) setRestaurantLat(Number(configData.restaurantLat));
        if (configData.restaurantLng !== undefined) setRestaurantLng(Number(configData.restaurantLng));
        if (configData.deliveryFee !== undefined) setDeliveryFee(Number(configData.deliveryFee));

        // iiko config
        setIsIikoConfigured(configData.isIikoConfigured || false);
        setIikoEnabled(configData.iiko?.enabled || false);
        setIikoApiLogin(configData.iiko?.apiLogin || '');
        setIikoOrganizationId(configData.iiko?.organizationId || '');
        setIikoTerminalGroupId(configData.iiko?.terminalGroupId || '');

        // Stories video configuration
        setBackstageVideoEnabled(configData.backstageVideoEnabled || false);
        setStories(configData.stories || []);

        // Masked pre-fill for Telegram and Gemini keys if already saved on the server
        if (configData.isConfigured) {
          setBotToken('••••••••••••••••••••••••••••');
        } else {
          setBotToken('');
        }
        if (configData.isGeminiConfigured) {
          setGeminiApiKey('••••••••••••••••••••••••••••');
        } else {
          setGeminiApiKey('');
        }
        if (configData.isOpenAiConfigured) {
          setOpenaiApiKey('••••••••••••••••••••••••••••');
        } else {
          setOpenaiApiKey('');
        }
        if (configData.isSmtpConfigured) {
          setSmtpPass('••••••••••••••••••••••••••••');
        } else {
          setSmtpPass('');
        }
      }
    } catch (e) {
      console.error('Error loading admin dashboard data:', e);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'porto2026') {
      setIsAuthorized(true);
      setAuthError('');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('porto_admin_auth', 'true');
      }
    } else {
      setAuthError(t('admin.wrongPassword'));
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setPassword('');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('porto_admin_auth');
    }
  };

  const handleSendPushBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle.trim() || !pushBody.trim()) {
      alert('Заголовок и текст сообщения обязательны!');
      return;
    }

    setIsBroadcastingPush(true);
    setPushBroadcastResult(null);

    try {
      const res = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pushTitle,
          body: pushBody,
          url: pushUrl
        })
      });

      const data = await res.json();
      if (data.success) {
        setPushBroadcastResult({
          success: true,
          sent: data.sent,
          failed: data.failed
        });
        setPushTitle('');
        setPushBody('');
        setPushUrl('');
        loadData();
      } else {
        setPushBroadcastResult({
          success: false,
          error: data.error || 'Failed to send broadcast'
        });
      }
    } catch (err: any) {
      setPushBroadcastResult({
        success: false,
        error: err.message || 'Network error'
      });
    } finally {
      setIsBroadcastingPush(false);
    }
  };

  // File upload helper
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'dish' | 'promo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Не удалось загрузить изображение');
      }

      const data = await res.json();
      if (type === 'dish' && editingDish) {
        setEditingDish({ ...editingDish, image: data.url });
      } else if (type === 'promo' && editingPromo) {
        setEditingPromo({ ...editingPromo, image: data.url });
      }
    } catch (err: any) {
      console.error(err);
      alert('Ошибка при загрузке изображения: ' + (err.message || 'Неизвестная ошибка'));
    }
  };

  // DISH CRUD METHODS
  const startAddDish = () => {
    setEditingDish({
      name: { ru: '', en: '', zh: '' },
      description: { ru: '', en: '', zh: '' },
      price: 0,
      weight: '',
      category: categories[0]?.id || '',
      visible: true,
      outOfStock: false,
      labels: [],
      image: '',
      kbju: {
        calories: 0,
        proteins: 0,
        fats: 0,
        carbs: 0
      }
    });
  };

  const saveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish || !editingDish.name || !editingDish.description) return;

    try {
      if (editingDish.id) {
        // Update
        await menuRepository.updateDish(editingDish.id, editingDish);
      } else {
        // Add
        await menuRepository.addDish({
          name: editingDish.name,
          description: editingDish.description,
          price: editingDish.price || 0,
          weight: editingDish.weight || '',
          category: editingDish.category || categories[0]?.id || '',
          visible: editingDish.visible ?? true,
          outOfStock: editingDish.outOfStock ?? false,
          quantityLimit: editingDish.quantityLimit !== undefined ? editingDish.quantityLimit : null,
          prepTime: editingDish.prepTime,
          labels: editingDish.labels || [],
          image: editingDish.image || '',
          kbju: editingDish.kbju || { calories: 0, proteins: 0, fats: 0, carbs: 0 },
          isRecommended: editingDish.isRecommended ?? (editingDish.labels?.includes('recommended') || false)
        });
      }
      setEditingDish(null);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteDish = async (id: string) => {
    if (confirm('Are you sure you want to delete this dish?')) {
      await menuRepository.deleteDish(id);
      loadData();
    }
  };

  const toggleDishVisibility = async (dish: Dish) => {
    await menuRepository.updateDish(dish.id, { visible: !dish.visible });
    loadData();
  };

  const toggleDishStopList = async (dish: Dish) => {
    await menuRepository.updateDish(dish.id, { outOfStock: !dish.outOfStock });
    loadData();
  };

  const toggleDishRecommended = async (dish: Dish) => {
    const isCurrentlyRecommended = dish.isRecommended === true || dish.labels?.includes('recommended');
    const newLabels = isCurrentlyRecommended
      ? (dish.labels || []).filter(l => l !== 'recommended')
      : [...(dish.labels || []).filter(l => l !== 'recommended'), 'recommended' as const];
    await menuRepository.updateDish(dish.id, { 
      isRecommended: !isCurrentlyRecommended,
      labels: newLabels
    });
    loadData();
  };

  const updateWaiterCallStatus = async (id: string, status: 'pending' | 'completed') => {
    try {
      const res = await fetch('/api/waiter-calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateStatus',
          data: { id, status }
        })
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const clearWaiterCallsHistory = async () => {
    if (confirm('Вы уверены, что хотите очистить всю историю вызовов?')) {
      try {
        const res = await fetch('/api/waiter-calls', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'clearAll' })
        });
        if (res.ok) {
          loadData();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDishLabelToggle = (label: DishLabel) => {
    if (!editingDish) return;
    const currentLabels = editingDish.labels || [];
    const newLabels = currentLabels.includes(label)
      ? currentLabels.filter((l) => l !== label)
      : [...currentLabels, label];
    setEditingDish({ ...editingDish, labels: newLabels });
  };

  // CATEGORY CRUD METHODS
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatRU.trim()) return;

    await menuRepository.addCategory({
      name: {
        ru: newCatRU.trim(),
        en: newCatEN.trim() || newCatRU.trim(),
        zh: newCatZH.trim() || newCatRU.trim()
      }
    });

    setNewCatRU('');
    setNewCatEN('');
    setNewCatZH('');
    loadData();
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Delete this category? Dishes associated will remain but category header will be removed.')) {
      await menuRepository.deleteCategory(id);
      loadData();
    }
  };

  // PROMOTION CRUD METHODS
  const startAddPromo = () => {
    setEditingPromo({
      title: { ru: '', en: '', zh: '' },
      description: { ru: '', en: '', zh: '' },
      image: '',
      active: true
    });
  };

  const savePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromo || !editingPromo.title || !editingPromo.description) return;

    try {
      if (editingPromo.id) {
        await menuRepository.updatePromotion(editingPromo.id, editingPromo);
      } else {
        await menuRepository.addPromotion({
          title: editingPromo.title,
          description: editingPromo.description,
          image: editingPromo.image || '',
          active: editingPromo.active ?? true
        });
      }
      setEditingPromo(null);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const deletePromo = async (id: string) => {
    if (confirm('Are you sure you want to delete this promotion?')) {
      await menuRepository.deletePromotion(id);
      loadData();
    }
  };

  const togglePromoActivity = async (promo: Promotion) => {
    await menuRepository.updatePromotion(promo.id, { active: !promo.active });
    loadData();
  };

  // ORDERS HANDLERS
  const handleOrderStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await menuRepository.updateOrderStatus(orderId, status);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  // LOYALTY HANDLERS
  const handlePointsAdjustment = async (e: React.FormEvent, type: 'accrual' | 'deduction') => {
    e.preventDefault();
    if (!selectedLoyaltyMember || !pointsAmount) return;
    const amt = parseInt(pointsAmount);
    if (isNaN(amt) || amt <= 0) return;

    try {
      const updated = await menuRepository.updateLoyaltyPoints(
        selectedLoyaltyMember.phone,
        amt,
        type,
        pointsComment.trim() || (type === 'accrual' ? 'Начисление баллов менеджером' : 'Списание баллов менеджером')
      );
      setSelectedLoyaltyMember(updated);
      setPointsAmount('');
      setPointsComment('');
      loadData();
    } catch (e) {
      console.error(e);
      alert('Не удалось изменить баланс баллов');
    }
  };

  // SETTINGS HANDLERS
  const handleAddWaiterRoute = () => {
    if (!newWaiterName.trim() || !newWaiterChatId.trim() || !newWaiterTables.trim()) {
      alert('Пожалуйста, заполните имя, Chat ID и столы для привязки официанта.');
      return;
    }
    const newRoute = {
      name: newWaiterName.trim(),
      chatId: newWaiterChatId.trim(),
      tables: newWaiterTables.trim()
    };
    setWaiters([...waiters, newRoute]);
    setNewWaiterName('');
    setNewWaiterChatId('');
    setNewWaiterTables('');
  };

  const handleRemoveWaiterRoute = (index: number) => {
    setWaiters(waiters.filter((_, idx) => idx !== index));
  };

  const handleSaveTelegramSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatId) {
      alert('Укажите основной Chat ID для заказов');
      return;
    }
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          botToken: botToken === '••••••••••••••••••••••••••••' ? '' : botToken, 
          chatId, 
          waiterChatId, 
          waiters, 
          geminiApiKey: geminiApiKey === '••••••••••••••••••••••••••••' ? '' : geminiApiKey,
          geminiProxyUrl,
          openaiApiKey: openaiApiKey === '••••••••••••••••••••••••••••' ? '' : openaiApiKey,
          backstageVideoEnabled,
          stories,
          smtpHost,
          smtpPort: Number(smtpPort) || 465,
          smtpUser,
          smtpPass: smtpPass === '••••••••••••••••••••••••••••' ? '' : smtpPass,
          vkAppId,
          workHoursStart,
          workHoursEnd,
          heroVideoUrl,
          heroType,
          heroSlogan: {
            ru: heroSloganRU,
            en: heroSloganEN,
            zh: heroSloganZH
          },
          statusBannerText: {
            ru: statusBannerTextRU,
            en: statusBannerTextEN,
            zh: statusBannerTextZH
          },
          printedMenuImage,
          yandexEdaUrl,
          deliveryRadiusKm: Number(deliveryRadiusKm) || 2,
          restaurantAddress,
          restaurantLat: Number(restaurantLat) || 55.654060,
          restaurantLng: Number(restaurantLng) || 37.498877,
          deliveryFee: Number(deliveryFee) || 0,
          iikoEnabled,
          iikoApiLogin,
          iikoOrganizationId,
          iikoTerminalGroupId
        })
      });
      if (res.ok) {
        setSettingsSuccess('Настройки успешно сохранены!');
        setIsTelegramConfigured(true);
        setTimeout(() => setSettingsSuccess(''), 4000);
        loadData();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Не удалось сохранить настройки');
      }
    } catch (e) {
      console.error(e);
      alert('Ошибка сохранения настроек');
    }
  };

  const handleHeroVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsHeroVideoUploading(true);
    setHeroVideoUploadError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setHeroVideoUrl(data.url);
        setHeroType('video');
      } else {
        setHeroVideoUploadError(data.error || 'Ошибка загрузки видео');
      }
    } catch (err: any) {
      setHeroVideoUploadError(err.message || 'Ошибка сети при загрузке');
    } finally {
      setIsHeroVideoUploading(false);
    }
  };

  const handlePrintedMenuUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsPrintedMenuUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setPrintedMenuImage(data.url);
      } else {
        alert(data.error || 'Ошибка загрузки изображения');
      }
    } catch (err: any) {
      alert(err.message || 'Ошибка сети при загрузке');
    } finally {
      setIsPrintedMenuUploading(false);
    }
  };

  const handleTranslateHeroSlogan = async () => {
    if (!heroSloganRU.trim()) {
      alert('Введите слоган на русском языке для перевода');
      return;
    }
    setIsTranslating(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'translate-free',
          textRu: heroSloganRU
        })
      });
      const data = await res.json();
      if (data.en) setHeroSloganEN(data.en);
      if (data.zh) setHeroSloganZH(data.zh);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSaveContent = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          botToken: botToken === '••••••••••••••••••••••••••••' ? '' : botToken, 
          chatId: chatId || 'porto_orders', 
          waiterChatId, 
          waiters, 
          geminiApiKey: geminiApiKey === '••••••••••••••••••••••••••••' ? '' : geminiApiKey,
          geminiProxyUrl,
          openaiApiKey: openaiApiKey === '••••••••••••••••••••••••••••' ? '' : openaiApiKey,
          backstageVideoEnabled,
          stories,
          workHoursStart,
          workHoursEnd,
          heroVideoUrl,
          heroType,
          heroSlogan: {
            ru: heroSloganRU,
            en: heroSloganEN,
            zh: heroSloganZH
          },
          statusBannerText: {
            ru: statusBannerTextRU,
            en: statusBannerTextEN,
            zh: statusBannerTextZH
          },
          printedMenuImage,
          smtpHost,
          smtpPort: Number(smtpPort) || 465,
          smtpUser,
          smtpPass: smtpPass === '••••••••••••••••••••••••••••' ? '' : smtpPass,
          vkAppId,
          yandexEdaUrl,
          deliveryRadiusKm: Number(deliveryRadiusKm) || 2,
          restaurantAddress,
          restaurantLat: Number(restaurantLat) || 55.654060,
          restaurantLng: Number(restaurantLng) || 37.498877,
          deliveryFee: Number(deliveryFee) || 0,
          iikoEnabled,
          iikoApiLogin,
          iikoOrganizationId,
          iikoTerminalGroupId
        })
      });
      if (res.ok) {
        setContentSuccess('Контент сайта успешно сохранен!');
        setTimeout(() => setContentSuccess(''), 4000);
        loadData();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Не удалось сохранить контент');
      }
    } catch (e) {
      console.error(e);
      alert('Ошибка сохранения контента');
    }
  };

  const handleTestSmtp = async () => {
    if (!smtpHost || !smtpUser) {
      alert('Пожалуйста, заполните SMTP Сервер и Пользователя перед тестированием.');
      return;
    }
    setIsTestingSmtp(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request-email-otp',
          email: smtpUser
        })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.demoMode) {
          alert('SMTP не настроен. Система работает в Демо-режиме (код: ' + data.code + ')');
        } else {
          alert('Успешно! Тестовый код отправлен на вашу почту: ' + smtpUser);
        }
      } else {
        alert('Ошибка при тестировании: ' + (data.error || 'Неизвестная ошибка'));
      }
    } catch (err: any) {
      alert('Ошибка соединения: ' + err.message);
    } finally {
      setIsTestingSmtp(false);
    }
  };

  const handleTestIikoConnection = async () => {
    const loginToTest = iikoApiLogin.trim();
    if (!loginToTest) {
      alert('Укажите API Login iiko перед тестированием.');
      return;
    }
    setIsTestingIiko(true);
    setIikoTestResult(null);
    try {
      const res = await fetch(`/api/config?action=test-iiko&apiLogin=${encodeURIComponent(loginToTest)}`);
      const data = await res.json();
      setIikoTestResult(data);
      if (data.success && data.organizations?.length > 0) {
        setIikoOrganizations(data.organizations);
      }
    } catch (err: any) {
      setIikoTestResult({ success: false, error: err.message });
    } finally {
      setIsTestingIiko(false);
    }
  };

  const handleLoadIikoTerminalGroups = async (orgId: string) => {
    if (!orgId) return;
    try {
      const res = await fetch(`/api/config?action=iiko-terminal-groups&organizationId=${encodeURIComponent(orgId)}`);
      const data = await res.json();
      if (data.terminalGroups) {
        setIikoTerminalGroups(data.terminalGroups);
      }
    } catch (err) {
      console.error('Failed to load terminal groups:', err);
    }
  };


  const handleStoryMediaUpload = async (storyId: string, e: React.ChangeEvent<HTMLInputElement>, mediaType: 'video' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = mediaType === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setVideoUploadErrorMap(prev => ({ ...prev, [storyId]: `Файл слишком большой. Лимит ${mediaType === 'video' ? '50 МБ' : '10 МБ'}.` }));
      return;
    }

    setIsVideoUploadingMap(prev => ({ ...prev, [storyId]: true }));
    setVideoUploadErrorMap(prev => ({ ...prev, [storyId]: '' }));
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`/api/upload?type=${mediaType === 'video' ? 'story' : 'promo'}`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Не удалось загрузить файл.');
      }

      const data = await res.json();
      setStories(prev => prev.map(s => s.id === storyId ? { 
        ...s, 
        ...(mediaType === 'video' ? { videoUrl: data.url, imageUrl: '' } : { imageUrl: data.url, videoUrl: '' }) 
      } : s));
      alert(mediaType === 'video' ? 'Видео истории успешно загружено!' : 'Изображение/постер успешно загружен!');
    } catch (err: any) {
      console.error(err);
      setVideoUploadErrorMap(prev => ({ ...prev, [storyId]: err.message || 'Ошибка загрузки.' }));
    } finally {
      setIsVideoUploadingMap(prev => ({ ...prev, [storyId]: false }));
    }
  };

  const handleAiTranslate = async () => {
    if (!editingDish || !editingDish.name?.ru) {
      alert('Пожалуйста, введите название блюда на русском языке для автоперевода.');
      return;
    }
    
    setIsTranslating(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'translate',
          text: {
            name: editingDish.name.ru,
            description: editingDish.description?.ru || ''
          }
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Ошибка запроса автоперевода');
      }

      const data = await res.json();
      setEditingDish({
        ...editingDish,
        name: {
          ru: editingDish.name.ru,
          en: data.name?.en || editingDish.name.en || '',
          zh: data.name?.zh || editingDish.name.zh || ''
        },
        description: {
          ru: editingDish.description?.ru || '',
          en: data.description?.en || editingDish.description?.en || '',
          zh: data.description?.zh || editingDish.description?.zh || ''
        }
      });
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Не удалось выполнить автоперевод');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleAiEstimateKbju = async () => {
    if (!editingDish || !editingDish.image) {
      alert('Пожалуйста, сначала загрузите или укажите фото блюда.');
      return;
    }

    setIsEstimatingKbju(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'estimate-kbju',
          image: editingDish.image,
          weight: editingDish.weight || '',
          name: editingDish.name?.ru || ''
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Ошибка оценки КБЖУ');
      }

      const data = await res.json();
      setEditingDish({
        ...editingDish,
        kbju: {
          calories: parseInt(data.calories) || 0,
          proteins: parseFloat(data.proteins) || 0,
          fats: parseFloat(data.fats) || 0,
          carbs: parseFloat(data.carbs) || 0
        }
      });
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Не удалось оценить КБЖУ по фото');
    } finally {
      setIsEstimatingKbju(false);
    }
  };

  const handleAiGenerateImageByPhoto = async () => {
    if (!editingDish || !editingDish.image) {
      alert('Пожалуйста, сначала загрузите или укажите фото блюда.');
      return;
    }

    setIsGeneratingImage(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-image-by-photo',
          image: editingDish.image,
          name: editingDish.name?.ru || '',
          description: editingDish.description?.ru || ''
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Ошибка при генерации красивого фото блюда');
      }

      const data = await res.json();
      setEditingDish({
        ...editingDish,
        image: data.url
      });
      alert('Новое красивое фото блюда успешно сгенерировано и сохранено!');
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Не удалось сгенерировать изображение по фото');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // FREE TRANSLATION via MyMemory API (no key required)
  const myMemoryTranslate = async (text: string, targetLang: string): Promise<string> => {
    if (!text.trim()) return '';
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ru|${targetLang}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Translation API error');
    const data = await res.json();
    return data.responseData?.translatedText || text;
  };

  const handleFreeTranslateDish = async () => {
    if (!editingDish || !editingDish.name?.ru) {
      alert('Введите название блюда на русском языке.');
      return;
    }
    setIsFreeTranslating(true);
    try {
      const [nameEN, nameZH, descEN, descZH] = await Promise.all([
        myMemoryTranslate(editingDish.name.ru, 'en'),
        myMemoryTranslate(editingDish.name.ru, 'zh'),
        myMemoryTranslate(editingDish.description?.ru || '', 'en'),
        myMemoryTranslate(editingDish.description?.ru || '', 'zh'),
      ]);
      setEditingDish({
        ...editingDish,
        name: { ru: editingDish.name.ru, en: nameEN, zh: nameZH },
        description: {
          ru: editingDish.description?.ru || '',
          en: descEN,
          zh: descZH,
        },
      });
    } catch (e: any) {
      alert('Ошибка перевода: ' + (e.message || 'Проверьте подключение к интернету'));
    } finally {
      setIsFreeTranslating(false);
    }
  };

  const handleFreeTranslatePromo = async () => {
    if (!editingPromo || !editingPromo.title?.ru) {
      alert('Введите название акции на русском языке.');
      return;
    }
    setIsFreeTranslatingPromo(true);
    try {
      const [titleEN, titleZH, descEN, descZH] = await Promise.all([
        myMemoryTranslate(editingPromo.title.ru, 'en'),
        myMemoryTranslate(editingPromo.title.ru, 'zh'),
        myMemoryTranslate(editingPromo.description?.ru || '', 'en'),
        myMemoryTranslate(editingPromo.description?.ru || '', 'zh'),
      ]);
      setEditingPromo({
        ...editingPromo,
        title: { ru: editingPromo.title.ru, en: titleEN, zh: titleZH },
        description: {
          ru: editingPromo.description?.ru || '',
          en: descEN,
          zh: descZH,
        },
      });
    } catch (e: any) {
      alert('Ошибка перевода: ' + (e.message || 'Проверьте подключение к интернету'));
    } finally {
      setIsFreeTranslatingPromo(false);
    }
  };

  const handleFreeTranslateCategory = async () => {
    if (!newCatRU.trim()) {
      alert('Введите название категории на русском языке.');
      return;
    }
    setIsFreeTranslatingCat(true);
    try {
      const [enName, zhName] = await Promise.all([
        myMemoryTranslate(newCatRU, 'en'),
        myMemoryTranslate(newCatRU, 'zh'),
      ]);
      setNewCatEN(enName);
      setNewCatZH(zhName);
    } catch (e: any) {
      alert('Ошибка перевода: ' + (e.message || 'Проверьте подключение к интернету'));
    } finally {
      setIsFreeTranslatingCat(false);
    }
  };

  // GATED ACCESS VIEW (Password form)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-porto-bg flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Decorative ambient glows */}
        <div className="bg-glow-gold top-10 left-10"></div>
        <div className="bg-glow-gold bottom-10 right-10"></div>

        <div className="max-w-md w-full glass-panel rounded-3xl p-8 border border-porto-gold/25 relative z-10 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="relative w-36 h-12 mx-auto">
              <img
                src="/images/porto-logo.jpg?v=2"
                alt="PORTO-BAR"
                className="w-full h-full object-contain invert mix-blend-screen"
              />
            </div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-porto-gold font-bold">
              Astrus Hotel Manager
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-porto-gold flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>{t('admin.password')}</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-porto-bg border border-porto-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-porto-gold-bright transition-colors text-center font-bold tracking-widest text-lg"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-400 text-center font-semibold animate-pulse">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-porto-gold-dark via-porto-gold to-porto-gold-bright text-porto-bg font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest active:scale-98 transition-all shadow-lg"
            >
              {t('admin.loginBtn')}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('admin.backToSite')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED-IN VIEW (Admin panel)
  return (
    <div className="min-h-screen bg-porto-bg text-gray-200 p-4 md:p-8 pb-16 max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-porto-gold/15 pb-4">
        <div className="flex items-center space-x-2.5">
          <Settings className="w-6 h-6 text-porto-gold" />
          <div>
            <h1 className="text-xl font-bold font-serif text-gold-gradient tracking-wide">{t('admin.dashboard')}</h1>
            <p className="text-[9px] uppercase tracking-widest text-gray-400">Porto Bar Astrus Control Panel</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-1.5 bg-white/5 border border-white/10 hover:bg-white/10 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('admin.backToSite')}</span>
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 px-3.5 py-2 rounded-xl text-xs font-bold text-red-400 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-white/5 pb-0.5 space-x-1 gap-y-1">
        {(['dishes', 'stoplist', 'categories', 'content', 'promotions', 'orders', 'loyalty', 'calls', 'push', 'settings'] as const).map((tab) => {
          const tabLabel =
            tab === 'dishes'
              ? t('admin.tabDishes')
              : tab === 'stoplist'
              ? 'Стоп-лист'
              : tab === 'categories'
              ? t('admin.tabCategories')
              : tab === 'content'
              ? 'Контент сайта'
              : tab === 'promotions'
              ? t('admin.tabPromotions')
              : tab === 'orders'
              ? 'Заказы'
              : tab === 'loyalty'
              ? 'Лояльность'
              : tab === 'calls'
              ? 'Вызовы официанта'
              : tab === 'push'
              ? 'Пуш-рассылки'
              : 'Настройки';
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setEditingDish(null);
                setEditingPromo(null);
                setSelectedLoyaltyMember(null);
              }}
              className={`px-4.5 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all relative ${
                activeTab === tab
                  ? 'border-porto-gold-bright text-porto-gold-bright font-black'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {tabLabel}
            </button>
          );
        })}
      </div>

      {/* DYNAMIC FORMS POPUP OVERLAY */}
      <AnimatePresence>
        {/* Dish Add/Edit Form Overlay */}
        {editingDish && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-2xl rounded-2xl p-6 border border-porto-gold/30 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="text-lg font-bold font-serif text-gold-gradient">
                  {editingDish.id ? t('admin.editDish') : t('admin.addDish')}
                </h3>
                <button
                  onClick={() => setEditingDish(null)}
                  className="text-gray-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              <form onSubmit={saveDish} className="space-y-5">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[10px] font-bold uppercase text-porto-gold">Языковые версии</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleFreeTranslateDish}
                      disabled={isFreeTranslating || !editingDish.name?.ru}
                      className="px-3 py-1 bg-blue-500/10 border border-blue-400/25 hover:bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase rounded-lg flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                      title="Бесплатный перевод через MyMemory — без API ключей"
                    >
                      🌐 {isFreeTranslating ? 'Перевод...' : 'Перевести'}
                    </button>
                    {isGeminiConfigured && (
                      <button
                        type="button"
                        onClick={handleAiTranslate}
                        disabled={isTranslating || !editingDish.name?.ru}
                        className="px-3 py-1 bg-porto-gold/10 border border-porto-gold/20 hover:bg-porto-gold/25 text-porto-gold text-[10px] font-bold uppercase rounded-lg flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                      >
                        <Sparkles className="w-3 h-3 text-porto-gold" />
                        {isTranslating ? 'ИИ...' : 'Перевод ИИ'}
                      </button>
                    )}
                  </div>
                </div>
                {/* Multilingual Names */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-porto-gold">{t('admin.dishNameRU')}</label>
                    <input
                      type="text"
                      required
                      value={editingDish.name?.ru || ''}
                      onChange={(e) =>
                        setEditingDish({
                          ...editingDish,
                          name: { ...editingDish.name!, ru: e.target.value }
                        })
                      }
                      className="w-full bg-porto-bg/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-porto-gold">{t('admin.dishNameEN')}</label>
                    <input
                      type="text"
                      required
                      value={editingDish.name?.en || ''}
                      onChange={(e) =>
                        setEditingDish({
                          ...editingDish,
                          name: { ...editingDish.name!, en: e.target.value }
                        })
                      }
                      className="w-full bg-porto-bg/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-porto-gold">{t('admin.dishNameZH')}</label>
                    <input
                      type="text"
                      required
                      value={editingDish.name?.zh || ''}
                      onChange={(e) =>
                        setEditingDish({
                          ...editingDish,
                          name: { ...editingDish.name!, zh: e.target.value }
                        })
                      }
                      className="w-full bg-porto-bg/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold"
                    />
                  </div>
                </div>

                {/* Multilingual Descriptions */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-porto-gold">{t('admin.dishDescRU')}</label>
                    <textarea
                      rows={2}
                      required
                      value={editingDish.description?.ru || ''}
                      onChange={(e) =>
                        setEditingDish({
                          ...editingDish,
                          description: { ...editingDish.description!, ru: e.target.value }
                        })
                      }
                      className="w-full bg-porto-bg/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-porto-gold">{t('admin.dishDescEN')}</label>
                    <textarea
                      rows={2}
                      required
                      value={editingDish.description?.en || ''}
                      onChange={(e) =>
                        setEditingDish({
                          ...editingDish,
                          description: { ...editingDish.description!, en: e.target.value }
                        })
                      }
                      className="w-full bg-porto-bg/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-porto-gold">{t('admin.dishDescZH')}</label>
                    <textarea
                      rows={2}
                      required
                      value={editingDish.description?.zh || ''}
                      onChange={(e) =>
                        setEditingDish({
                          ...editingDish,
                          description: { ...editingDish.description!, zh: e.target.value }
                        })
                      }
                      className="w-full bg-porto-bg/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold resize-none"
                    />
                  </div>
                </div>

                {/* Price, Weight, Category, PrepTime */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-porto-gold">{t('admin.price')}</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editingDish.price || ''}
                      onChange={(e) => setEditingDish({ ...editingDish, price: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-porto-bg/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-porto-gold">{t('admin.weight')} (e.g. 250 г)</label>
                    <input
                      type="text"
                      required
                      value={editingDish.weight || ''}
                      onChange={(e) => setEditingDish({ ...editingDish, weight: e.target.value })}
                      className="w-full bg-porto-bg/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-porto-gold">Время приг. (мин)</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={editingDish.prepTime || ''}
                      onChange={(e) => setEditingDish({ ...editingDish, prepTime: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full bg-porto-bg/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-porto-gold">{t('admin.category')}</label>
                    <select
                      value={editingDish.category || ''}
                      onChange={(e) => setEditingDish({ ...editingDish, category: e.target.value })}
                      className="w-full bg-porto-bg border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {translate(c.name)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Inventory / Limit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-porto-gold">Лимит количества (остаток на складе)</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="Без ограничений (unlimited)"
                      value={editingDish.quantityLimit !== undefined && editingDish.quantityLimit !== null ? editingDish.quantityLimit : ''}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        setEditingDish({ 
                          ...editingDish, 
                          quantityLimit: val === '' ? null : Math.max(0, parseInt(val, 10) || 0) 
                        });
                      }}
                      className="w-full bg-porto-bg/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold"
                    />
                    <p className="text-[9px] text-gray-500 font-semibold">Оставьте пустым для неограниченного запаса. Если установить 0, блюдо скроется как нет в наличии.</p>
                  </div>
                </div>

                {/* KBJU Nutritional Values */}
                <div className="space-y-2 border-t border-white/5 pt-4">
                  <div className="flex justify-between items-center pb-1">
                    <label className="text-[10px] font-bold uppercase text-porto-gold block">Пищевая ценность (КБЖУ)</label>
                    {isGeminiConfigured ? (
                      <button
                        type="button"
                        onClick={handleAiEstimateKbju}
                        disabled={isEstimatingKbju || !editingDish.image}
                        className="px-3 py-1 bg-porto-gold/10 border border-porto-gold/20 hover:bg-porto-gold/25 text-porto-gold text-[10px] font-bold uppercase rounded-lg flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                        title={!editingDish.image ? 'Сначала загрузите фотографию/укажите URL' : 'Оценить КБЖУ по фото через ИИ'}
                      >
                        <Sparkles className="w-3 h-3 text-porto-gold" />
                        {isEstimatingKbju ? 'Анализ...' : 'Оценить КБЖУ (ИИ)'}
                      </button>
                    ) : (
                      <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">
                        (Для ИИ-оценки укажите Gemini API Key в настройках)
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-gray-400">Калории (Ккал)</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        required
                        value={editingDish.kbju?.calories ?? ''}
                        onChange={(e) => {
                          const val = Math.max(0, parseInt(e.target.value) || 0);
                          setEditingDish({
                            ...editingDish,
                            kbju: {
                              ...(editingDish.kbju || { calories: 0, proteins: 0, fats: 0, carbs: 0 }),
                              calories: val
                            }
                          });
                        }}
                        className="w-full bg-porto-bg/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-gray-400">Белки (г)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        required
                        value={editingDish.kbju?.proteins ?? ''}
                        onChange={(e) => {
                          const val = Math.max(0, parseFloat(e.target.value) || 0);
                          setEditingDish({
                            ...editingDish,
                            kbju: {
                              ...(editingDish.kbju || { calories: 0, proteins: 0, fats: 0, carbs: 0 }),
                              proteins: val
                            }
                          });
                        }}
                        className="w-full bg-porto-bg/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-gray-400">Жиры (г)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        required
                        value={editingDish.kbju?.fats ?? ''}
                        onChange={(e) => {
                          const val = Math.max(0, parseFloat(e.target.value) || 0);
                          setEditingDish({
                            ...editingDish,
                            kbju: {
                              ...(editingDish.kbju || { calories: 0, proteins: 0, fats: 0, carbs: 0 }),
                              fats: val
                            }
                          });
                        }}
                        className="w-full bg-porto-bg/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-gray-400">Углеводы (г)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        required
                        value={editingDish.kbju?.carbs ?? ''}
                        onChange={(e) => {
                          const val = Math.max(0, parseFloat(e.target.value) || 0);
                          setEditingDish({
                            ...editingDish,
                            kbju: {
                              ...(editingDish.kbju || { calories: 0, proteins: 0, fats: 0, carbs: 0 }),
                              carbs: val
                            }
                          });
                        }}
                        className="w-full bg-porto-bg/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold"
                      />
                    </div>
                  </div>
                </div>

                {/* Dish badges (optional labels) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-porto-gold block">{t('admin.labels')}</label>
                  <div className="flex flex-wrap gap-2">
                    {(['new', 'bestseller', 'recommended', 'vegetarian', 'spicy'] as DishLabel[]).map((label) => {
                      const isSelected = editingDish.labels?.includes(label);
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => handleDishLabelToggle(label)}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-porto-gold text-porto-bg border-porto-gold'
                              : 'bg-transparent text-gray-400 border-white/10 hover:border-porto-gold/30'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Featured Recommended Switch */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 mt-3">
                    <div className="flex items-center space-x-2.5">
                      <Star className="w-5 h-5 text-amber-300 fill-current shrink-0" />
                      <div>
                        <h5 className="text-xs font-bold text-amber-200">Рекомендуемое блюдо</h5>
                        <p className="text-[10px] text-gray-400">Отображать в блоке «Рекомендуем» на главной странице</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editingDish.isRecommended || editingDish.labels?.includes('recommended'))}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const currentLabels = editingDish.labels || [];
                          const newLabels = checked
                            ? [...currentLabels.filter(l => l !== 'recommended'), 'recommended' as const]
                            : currentLabels.filter(l => l !== 'recommended');
                          setEditingDish({
                            ...editingDish,
                            isRecommended: checked,
                            labels: newLabels
                          });
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-porto-bg border border-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-amber-400 peer-checked:after:bg-porto-bg"></div>
                    </label>
                  </div>
                </div>

                {/* Photo inputs: URL + Local File Upload */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-porto-gold block">{t('admin.photoUrl')}</label>
                    <input
                      type="text"
                      value={editingDish.image || ''}
                      onChange={(e) => setEditingDish({ ...editingDish, image: e.target.value })}
                      placeholder="e.g. /images/salmon.jpg"
                      className="w-full bg-porto-bg/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-porto-gold block">{t('admin.uploadPhoto')} (Base64)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, 'dish')}
                      className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:uppercase file:bg-porto-gold/20 file:text-porto-gold file:cursor-pointer"
                    />
                  </div>
                </div>

                {/* Preview Selected Photo & AI Generator Button */}
                {editingDish.image && (
                  <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                    <div className="relative w-28 h-20 rounded-lg border border-porto-gold/20 overflow-hidden bg-porto-bg/50 flex-shrink-0">
                      <img
                        src={editingDish.image}
                        alt="Preview upload"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingDish({ ...editingDish, image: '' })}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-black/90 p-0.5 rounded-full text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex-1 space-y-2">
                      {isGeminiConfigured ? (
                        <button
                          type="button"
                          onClick={handleAiGenerateImageByPhoto}
                          disabled={isGeneratingImage}
                          className="px-4 py-2 bg-porto-gold hover:bg-porto-gold/80 text-porto-bg text-xs font-bold uppercase rounded-lg flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-porto-bg animate-pulse" />
                          {isGeneratingImage ? 'Нейросеть генерирует...' : 'Сгенерировать красивое фото (ИИ)'}
                        </button>
                      ) : (
                        <div className="text-[10px] text-yellow-400/80 bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-2.5">
                          <p className="font-bold uppercase mb-0.5">🎨 Фотогенерация через ИИ</p>
                          <p className="text-gray-400">Для генерации красивого ресторанного фото по реальному снимку блюда, настройте <strong>Google Gemini API Key</strong> во вкладке Настройки.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Visibility Switch */}
                <div className="flex items-center space-x-2 border-t border-white/5 pt-4">
                  <input
                    type="checkbox"
                    id="dish-visibility"
                    checked={editingDish.visible ?? true}
                    onChange={(e) => setEditingDish({ ...editingDish, visible: e.target.checked })}
                    className="w-4 h-4 accent-porto-gold cursor-pointer"
                  />
                  <label htmlFor="dish-visibility" className="text-xs font-semibold text-gray-200 cursor-pointer">
                    Show Dish on Guest Menu
                  </label>
                </div>

                {/* Stop List Switch */}
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="dish-outofstock"
                    checked={editingDish.outOfStock ?? false}
                    onChange={(e) => setEditingDish({ ...editingDish, outOfStock: e.target.checked })}
                    className="w-4 h-4 accent-porto-gold cursor-pointer"
                  />
                  <label htmlFor="dish-outofstock" className="text-xs font-semibold text-gray-200 cursor-pointer">
                    Стоп-лист (Блюдо закончилось)
                  </label>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end space-x-3 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setEditingDish(null)}
                    className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-lg text-xs font-semibold"
                  >
                    {t('admin.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-porto-gold text-porto-bg font-bold rounded-lg text-xs hover:bg-porto-gold-bright transition-all"
                  >
                    {t('admin.save')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Promotion Add/Edit Form Overlay */}
        {editingPromo && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-xl rounded-2xl p-6 border border-porto-gold/30 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="text-lg font-bold font-serif text-gold-gradient">
                  {editingPromo.id ? 'Edit Promotion' : t('admin.addPromo')}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleFreeTranslatePromo}
                    disabled={isFreeTranslatingPromo || !editingPromo.title?.ru}
                    className="px-3 py-1 bg-blue-500/10 border border-blue-400/25 hover:bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase rounded-lg flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                    title="Бесплатный перевод через MyMemory"
                  >
                    🌐 {isFreeTranslatingPromo ? 'Перевод...' : 'Перевести'}
                  </button>
                  <button
                    onClick={() => setEditingPromo(null)}
                    className="text-gray-400 hover:text-white text-xs"
                  >
                    Закрыть
                  </button>
                </div>
              </div>

              <form onSubmit={savePromo} className="space-y-5">
                {/* Multilingual Titles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-porto-gold">Title RU</label>
                    <input
                      type="text"
                      required
                      value={editingPromo.title?.ru || ''}
                      onChange={(e) =>
                        setEditingPromo({
                          ...editingPromo,
                          title: { ...editingPromo.title!, ru: e.target.value }
                        })
                      }
                      className="w-full bg-porto-bg/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-porto-gold">Title EN</label>
                    <input
                      type="text"
                      required
                      value={editingPromo.title?.en || ''}
                      onChange={(e) =>
                        setEditingPromo({
                          ...editingPromo,
                          title: { ...editingPromo.title!, en: e.target.value }
                        })
                      }
                      className="w-full bg-porto-bg/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-porto-gold">Title 中文</label>
                    <input
                      type="text"
                      required
                      value={editingPromo.title?.zh || ''}
                      onChange={(e) =>
                        setEditingPromo({
                          ...editingPromo,
                          title: { ...editingPromo.title!, zh: e.target.value }
                        })
                      }
                      className="w-full bg-porto-bg/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold"
                    />
                  </div>
                </div>

                {/* Multilingual Descriptions */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-porto-gold">Description RU</label>
                    <textarea
                      rows={2}
                      required
                      value={editingPromo.description?.ru || ''}
                      onChange={(e) =>
                        setEditingPromo({
                          ...editingPromo,
                          description: { ...editingPromo.description!, ru: e.target.value }
                        })
                      }
                      className="w-full bg-porto-bg/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-porto-gold">Description EN</label>
                    <textarea
                      rows={2}
                      required
                      value={editingPromo.description?.en || ''}
                      onChange={(e) =>
                        setEditingPromo({
                          ...editingPromo,
                          description: { ...editingPromo.description!, en: e.target.value }
                        })
                      }
                      className="w-full bg-porto-bg/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-porto-gold">Description 中文</label>
                    <textarea
                      rows={2}
                      required
                      value={editingPromo.description?.zh || ''}
                      onChange={(e) =>
                        setEditingPromo({
                          ...editingPromo,
                          description: { ...editingPromo.description!, zh: e.target.value }
                        })
                      }
                      className="w-full bg-porto-bg/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold resize-none"
                    />
                  </div>
                </div>

                {/* Photo setup */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-porto-gold block">{t('admin.photoUrl')}</label>
                    <input
                      type="text"
                      value={editingPromo.image || ''}
                      onChange={(e) => setEditingPromo({ ...editingPromo, image: e.target.value })}
                      placeholder="e.g. /images/promo.jpg"
                      className="w-full bg-porto-bg/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-porto-gold block">{t('admin.uploadPhoto')} (Base64)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, 'promo')}
                      className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:uppercase file:bg-porto-gold/20 file:text-porto-gold"
                    />
                  </div>
                </div>

                {editingPromo.image && (
                  <div className="relative w-28 h-20 rounded-lg border border-porto-gold/20 overflow-hidden bg-porto-bg/50">
                    <img
                      src={editingPromo.image}
                      alt="Preview Upload"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setEditingPromo({ ...editingPromo, image: '' })}
                      className="absolute top-1 right-1 bg-black/60 p-0.5 rounded-full text-white"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Active switch */}
                <div className="flex items-center space-x-2 border-t border-white/5 pt-4">
                  <input
                    type="checkbox"
                    id="promo-active"
                    checked={editingPromo.active ?? true}
                    onChange={(e) => setEditingPromo({ ...editingPromo, active: e.target.checked })}
                    className="w-4 h-4 accent-porto-gold cursor-pointer"
                  />
                  <label htmlFor="promo-active" className="text-xs font-semibold text-gray-200 cursor-pointer">
                    Activate Promotion Immediately
                  </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setEditingPromo(null)}
                    className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-lg text-xs font-semibold"
                  >
                    {t('admin.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-porto-gold text-porto-bg font-bold rounded-lg text-xs hover:bg-porto-gold-bright transition-all"
                  >
                    {t('admin.save')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DASHBOARD TAB CONTENTS */}
      <div className="space-y-6">
        
        {/* DISHES TAB */}
        {activeTab === 'dishes' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-porto-card/50 p-4 border border-porto-gold/10 rounded-2xl">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-porto-gold">Dishes Catalog</h3>
                <p className="text-[10px] text-gray-400">{dishes.length} dishes in database</p>
              </div>
              <button
                onClick={startAddDish}
                className="flex items-center space-x-1 bg-porto-gold text-porto-bg px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-porto-gold-bright transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{t('admin.addDish')}</span>
              </button>
            </div>

            {/* Search Input Box */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-porto-gold/60" />
              <input
                type="text"
                placeholder="Поиск блюд по названию..."
                value={dishSearch}
                onChange={(e) => setDishSearch(e.target.value)}
                className="w-full bg-porto-card/50 border border-porto-gold/10 rounded-2xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-porto-gold-bright placeholder-gray-500 font-medium"
              />
            </div>

            <div className="space-y-3">
              {dishes
                .filter((dish) => {
                  const query = dishSearch.trim().toLowerCase();
                  if (!query) return true;
                  return (
                    dish.name.ru.toLowerCase().includes(query) ||
                    (dish.name.en && dish.name.en.toLowerCase().includes(query)) ||
                    (dish.name.zh && dish.name.zh.toLowerCase().includes(query))
                  );
                })
                .map((dish) => {
                  const cat = categories.find((c) => c.id === dish.category);
                  return (
                    <div
                      key={dish.id}
                      className="glass-panel p-4 rounded-xl flex items-center justify-between border border-porto-gold/15 bg-porto-card/50 relative overflow-hidden"
                    >
                      {/* Hiding Indicator overlay */}
                      {!dish.visible && (
                        <div className="absolute top-0 right-0 bg-red-600/10 text-red-400 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-bl-lg border-l border-b border-red-500/20">
                          Hidden
                        </div>
                      )}

                      <div className="flex items-center space-x-3.5">
                        {/* Avatar preview */}
                        <div className="relative w-12 h-12 rounded-lg border border-porto-gold/10 overflow-hidden bg-porto-bg/50 flex-shrink-0">
                          {dish.image ? (
                            <img
                              src={dish.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[7px] font-serif font-black text-porto-gold">
                              NO PIC
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className={`text-sm font-semibold font-serif ${dish.visible ? 'text-gray-100' : 'text-gray-500 line-through'}`}>
                            {dish.name.ru} {dish.outOfStock && <span className="text-red-500 text-[10px] uppercase font-sans font-bold ml-1.5">[Стоп]</span>}
                          </h4>
                          <div className="flex flex-wrap gap-2.5 items-center mt-1 text-[10px] text-gray-400 font-semibold">
                            <span className="text-porto-gold">{cat ? translate(cat.name) : 'No Category'}</span>
                            <span>•</span>
                            <span>{dish.price} ₽</span>
                            {dish.quantityLimit !== undefined && dish.quantityLimit !== null && (
                              <>
                                <span>•</span>
                                <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-sm">
                                  Остаток: {dish.quantityLimit} шт
                                </span>
                              </>
                            )}
                            {dish.labels?.map(l => (
                              <span key={l} className="text-[8px] uppercase tracking-wider bg-white/5 border border-white/10 px-1 rounded-sm text-porto-gold">{l}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2.5 z-10">
                        {/* Recommended toggle */}
                        <button
                          onClick={() => toggleDishRecommended(dish)}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            dish.isRecommended || dish.labels?.includes('recommended')
                              ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                          }`}
                          title={
                            dish.isRecommended || dish.labels?.includes('recommended')
                              ? 'Убрать из блока «Рекомендуем»'
                              : 'Добавить в блок «Рекомендуем» на главной'
                          }
                        >
                          <Star className={`w-4 h-4 ${dish.isRecommended || dish.labels?.includes('recommended') ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => toggleDishStopList(dish)}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            dish.outOfStock
                              ? 'bg-red-500/15 border border-red-500/35 text-red-400 hover:bg-red-500/25'
                              : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                          }`}
                          title={dish.outOfStock ? 'Вернуть в продажу' : 'Добавить в стоп-лист'}
                        >
                          <AlertCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleDishVisibility(dish)}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            dish.visible
                              ? 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                              : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20'
                          }`}
                          title={dish.visible ? t('admin.hide') : t('admin.show')}
                        >
                          {dish.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setEditingDish(dish)}
                          className="p-2 bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors cursor-pointer"
                          title={t('admin.editDish')}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteDish(dish.id)}
                          className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                          title={t('admin.delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              {dishes.filter((dish) => {
                const query = dishSearch.trim().toLowerCase();
                if (!query) return true;
                return (
                  dish.name.ru.toLowerCase().includes(query) ||
                  (dish.name.en && dish.name.en.toLowerCase().includes(query)) ||
                  (dish.name.zh && dish.name.zh.toLowerCase().includes(query))
                );
              }).length === 0 && (
                <div className="text-center py-12 text-gray-500 font-semibold text-xs bg-porto-card/20 rounded-2xl border border-white/5">
                  Блюда с таким названием не найдены
                </div>
              )}
            </div>
          </div>
        )}

        {/* STOP LIST TAB */}
        {activeTab === 'stoplist' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-porto-card/50 p-4 border border-porto-gold/10 rounded-2xl">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-porto-gold">Управление Стоп-листом</h3>
                <p className="text-[10px] text-gray-400">
                  {dishes.filter(d => d.outOfStock || (d.quantityLimit !== undefined && d.quantityLimit !== null && d.quantityLimit <= 0)).length} позиций в стоп-листе
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {categories.map((cat) => {
                const catDishes = dishes.filter(
                  (d) =>
                    d.category === cat.id &&
                    (d.outOfStock ||
                      (d.quantityLimit !== undefined &&
                        d.quantityLimit !== null &&
                        d.quantityLimit <= 0))
                );

                if (catDishes.length === 0) return null;

                return (
                  <div key={cat.id} className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-porto-gold border-b border-porto-gold/15 pb-1.5 mt-2">
                      {translate(cat.name)} ({catDishes.length})
                    </h4>
                    
                    <div className="space-y-3">
                      {catDishes.map((dish) => {
                        return (
                          <div
                            key={dish.id}
                            className="glass-panel p-4 rounded-xl flex items-center justify-between border border-red-500/20 bg-porto-card/30 relative overflow-hidden"
                          >
                            <div className="flex items-center space-x-3.5">
                              {/* Avatar preview */}
                              <div className="relative w-12 h-12 rounded-lg border border-porto-gold/10 overflow-hidden bg-porto-bg/50 flex-shrink-0">
                                {dish.image ? (
                                  <img
                                    src={dish.image}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[7px] font-serif font-black text-porto-gold">
                                    NO PIC
                                  </div>
                                )}
                              </div>

                              <div>
                                <h4 className="text-sm font-semibold font-serif text-gray-100 flex items-center">
                                  {dish.name.ru}
                                  {dish.outOfStock ? (
                                    <span className="text-red-500 text-[9px] uppercase font-sans font-bold ml-2 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded-sm">
                                      Ручной стоп
                                    </span>
                                  ) : (
                                    <span className="text-yellow-500 text-[9px] uppercase font-sans font-bold ml-2 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded-sm">
                                      Закончился лимит
                                    </span>
                                  )}
                                </h4>
                                <div className="flex flex-wrap gap-2.5 items-center mt-1 text-[10px] text-gray-400 font-semibold">
                                  <span>{dish.price} ₽</span>
                                  {dish.quantityLimit !== undefined && dish.quantityLimit !== null && (
                                    <>
                                      <span>•</span>
                                      <span className="text-red-400 font-bold bg-red-500/10 border border-red-500/25 px-1.5 py-0.5 rounded-sm">
                                        Остаток: {dish.quantityLimit} шт
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2.5 z-10">
                              <button
                                onClick={() => toggleDishStopList(dish)}
                                className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                                title="Вернуть в продажу (убрать из стоп-листа)"
                              >
                                Вернуть в продажу
                              </button>
                              <button
                                onClick={() => setEditingDish(dish)}
                                className="p-2 bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors cursor-pointer"
                                title={t('admin.editDish')}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {dishes.filter(d => d.outOfStock || (d.quantityLimit !== undefined && d.quantityLimit !== null && d.quantityLimit <= 0)).length === 0 && (
                <div className="text-center py-12 text-gray-400 font-semibold text-xs bg-porto-card/20 rounded-2xl border border-white/5 flex flex-col items-center justify-center space-y-2">
                  <CheckCircle className="w-8 h-8 text-emerald-500 animate-bounce" />
                  <span>Все блюда в продаже. В стоп-листе нет позиций.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            {/* Create Category Form */}
            <form onSubmit={handleAddCategory} className="glass-panel p-5 rounded-2xl border border-porto-gold/20 bg-porto-card/50 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-porto-gold flex items-center space-x-1.5">
                <FolderPlus className="w-4 h-4" />
                <span>{t('admin.addCategory')}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-gray-400">RU Name</label>
                  <input
                    type="text"
                    required
                    value={newCatRU}
                    onChange={(e) => setNewCatRU(e.target.value)}
                    placeholder="e.g. Салаты"
                    className="w-full bg-porto-bg border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-gray-400">EN Name <span className="text-blue-400/60">(авто)</span></label>
                  <input
                    type="text"
                    required
                    value={newCatEN}
                    onChange={(e) => setNewCatEN(e.target.value)}
                    placeholder="e.g. Salads"
                    className="w-full bg-porto-bg border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-gray-400">ZH Name <span className="text-blue-400/60">(авто)</span></label>
                  <input
                    type="text"
                    required
                    value={newCatZH}
                    onChange={(e) => setNewCatZH(e.target.value)}
                    placeholder="e.g. 沙拉"
                    className="w-full bg-porto-bg border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={handleFreeTranslateCategory}
                  disabled={isFreeTranslatingCat || !newCatRU.trim()}
                  className="px-3 py-1.5 bg-blue-500/10 border border-blue-400/25 hover:bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase rounded-lg flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                >
                  🌐 {isFreeTranslatingCat ? 'Перевод...' : 'Авто-перевод EN / ZH'}
                </button>
                <button
                  type="submit"
                  className="bg-porto-gold text-porto-bg font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider hover:bg-porto-gold-bright transition-all"
                >
                  Create
                </button>
              </div>
            </form>

            {/* Categories List */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">Created Categories ({categories.length})</h4>
              
              <div className="space-y-2">
                {categories.map((c) => (
                  <div
                    key={c.id}
                    className="glass-panel p-4 rounded-xl flex items-center justify-between border border-porto-gold/15 bg-porto-card/50"
                  >
                    <div>
                      <h4 className="text-sm font-bold font-serif text-gray-100">{c.name.ru}</h4>
                      <p className="text-[10px] text-gray-400 font-medium tracking-wide mt-0.5">
                        EN: {c.name.en} • ZH: {c.name.zh}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                      title={t('admin.delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════════════ */}
        {/* UNIFIED SITE CONTENT & MEDIA MANAGEMENT TAB */}
        {/* ══════════════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'content' && (
          <div className="space-y-6 animate-fade-in text-left">
            {/* Top Bar with Save Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-porto-card/50 p-4 border border-porto-gold/20 rounded-2xl">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-porto-gold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-porto-gold-bright" />
                  <span>Управление контентом и медиа сайта</span>
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Настройка фонового видео/фото первого экрана, слогана, статуса приема заказов, историй и печатного меню
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSaveContent()}
                className="bg-gradient-to-r from-porto-gold-dark via-porto-gold to-porto-gold-bright text-porto-bg font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-all shadow-lg cursor-pointer shrink-0"
              >
                💾 Сохранить контент
              </button>
            </div>

            {/* Success Toast Notification */}
            {contentSuccess && (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold text-center animate-pulse">
                ✓ {contentSuccess}
              </div>
            )}

            {/* ───────────────────────────────────────────────────────────── */}
            {/* 1. TOP STATUS BANNER (Часы работы и статус заказов) */}
            {/* ───────────────────────────────────────────────────────────── */}
            <div className="glass-panel p-5 rounded-2xl border border-porto-gold/20 bg-porto-card/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <h4 className="text-xs font-bold uppercase text-porto-gold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>1. Верхний статус-баннер (Режим работы кухни)</span>
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Отображается в верхней строке сайта, информируя гостей о времени приема заказов
                  </p>
                </div>
              </div>

              {/* Working Hours Times */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-300 uppercase">
                    Время начала приготовления (Открытие)
                  </label>
                  <input
                    type="time"
                    value={workHoursStart}
                    onChange={(e) => setWorkHoursStart(e.target.value)}
                    className="w-full bg-porto-bg border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-300 uppercase">
                    Время окончания приготовления (Закрытие)
                  </label>
                  <input
                    type="time"
                    value={workHoursEnd}
                    onChange={(e) => setWorkHoursEnd(e.target.value)}
                    className="w-full bg-porto-bg border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold font-mono font-bold"
                  />
                </div>
              </div>

              {/* Custom Status Banner Text (optional overrides) */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <label className="text-[9px] font-bold text-gray-400 uppercase">
                  Пользовательский текст в плашке (Оставьте пустым для автотекста "Готовим с {workHoursStart} до {workHoursEnd}")
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder={`Например: Готовим с ${workHoursStart} до ${workHoursEnd}.`}
                    value={statusBannerTextRU}
                    onChange={(e) => setStatusBannerTextRU(e.target.value)}
                    className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-medium"
                  />
                  <input
                    type="text"
                    placeholder={`e.g. Cooking from ${workHoursStart} to ${workHoursEnd}.`}
                    value={statusBannerTextEN}
                    onChange={(e) => setStatusBannerTextEN(e.target.value)}
                    className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-medium"
                  />
                  <input
                    type="text"
                    placeholder="营业时间..."
                    value={statusBannerTextZH}
                    onChange={(e) => setStatusBannerTextZH(e.target.value)}
                    className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-medium"
                  />
                </div>
              </div>

              {/* Live Status Preview */}
              <div className="pt-2">
                <p className="text-[9px] font-bold text-gray-500 uppercase mb-1">Предварительный просмотр на сайте:</p>
                <div className="bg-[#0a0d14] border border-amber-500/30 rounded-xl p-2.5 flex items-center justify-center space-x-2 text-center shadow-inner">
                  <Clock className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 shrink-0" />
                  <div className="text-xs tracking-wide flex items-center gap-1.5 flex-wrap justify-center font-sans">
                    <span className="font-bold text-amber-300">
                      {statusBannerTextRU.trim() || `Готовим с ${workHoursStart} до ${workHoursEnd}.`}
                    </span>
                    <span className="text-amber-200/85 font-medium">
                      Можно сделать предзаказ.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ───────────────────────────────────────────────────────────── */}
            {/* 2. HERO SECTION (Фоновое видео / Фото и Главный слоган) */}
            {/* ───────────────────────────────────────────────────────────── */}
            <div className="glass-panel p-5 rounded-2xl border border-porto-gold/20 bg-porto-card/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <h4 className="text-xs font-bold uppercase text-porto-gold flex items-center gap-2">
                    <Film className="w-4 h-4 text-porto-gold" />
                    <span>2. Главный экран (Фоновое видео / Фото и Слоган)</span>
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Установите фоновое видео с завтраками, блюдами или атмосферой бара, а также продающий слоган
                  </p>
                </div>
              </div>

              {/* Hero Background Type Selector */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-gray-400 uppercase">Тип фона первого экрана:</label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer bg-white/5 border border-white/10 hover:border-porto-gold/40 px-3.5 py-2 rounded-xl text-xs text-white">
                    <input
                      type="radio"
                      name="hero_type"
                      checked={heroType === 'video'}
                      onChange={() => setHeroType('video')}
                      className="text-porto-gold focus:ring-porto-gold"
                    />
                    <span className="font-bold">🎬 Фоновое видео (MP4 / WebM)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer bg-white/5 border border-white/10 hover:border-porto-gold/40 px-3.5 py-2 rounded-xl text-xs text-white">
                    <input
                      type="radio"
                      name="hero_type"
                      checked={heroType === 'slideshow'}
                      onChange={() => setHeroType('slideshow')}
                      className="text-porto-gold focus:ring-porto-gold"
                    />
                    <span className="font-bold">🖼️ Фото-слайдшоу интерьера</span>
                  </label>
                </div>
              </div>

              {/* Hero Video URL & File Upload */}
              {heroType === 'video' && (
                <div className="bg-black/25 border border-porto-gold/20 p-4 rounded-xl space-y-3.5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-300 uppercase">
                        Прямая ссылка на видео (URL)
                      </label>
                      <input
                        type="text"
                        placeholder="https://.../breakfast-video.mp4 или /videos/hero.mp4"
                        value={heroVideoUrl}
                        onChange={(e) => setHeroVideoUrl(e.target.value)}
                        className="w-full bg-porto-bg border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-300 uppercase">
                        Загрузить видеофайл (MP4, WebM, до 50МБ)
                      </label>
                      <div className="flex items-center space-x-2.5 pt-0.5">
                        <input
                          type="file"
                          accept="video/mp4,video/webm"
                          onChange={handleHeroVideoUpload}
                          disabled={isHeroVideoUploading}
                          className="text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[9px] file:font-bold file:uppercase file:bg-porto-gold/20 file:text-porto-gold hover:file:bg-porto-gold/30 file:cursor-pointer w-full"
                        />
                        {isHeroVideoUploading && (
                          <span className="text-[10px] text-porto-gold font-bold animate-pulse shrink-0">Загрузка...</span>
                        )}
                      </div>
                      {heroVideoUploadError && (
                        <p className="text-[9px] text-red-400 font-semibold">{heroVideoUploadError}</p>
                      )}
                    </div>
                  </div>

                  {/* Video Preview Player */}
                  {heroVideoUrl && (
                    <div className="pt-2">
                      <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Предпросмотр фонового видео:</p>
                      <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black max-w-md aspect-video">
                        <video
                          src={heroVideoUrl}
                          controls
                          muted
                          loop
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Hero Slogan & Subtitles */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-porto-gold uppercase">
                    Главный текст / слоган первого экрана
                  </label>
                  <button
                    type="button"
                    onClick={handleTranslateHeroSlogan}
                    disabled={isTranslating}
                    className="text-[9px] uppercase font-bold bg-porto-gold/15 hover:bg-porto-gold/25 border border-porto-gold/30 text-porto-gold-bright px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                  >
                    {isTranslating ? 'Перевод...' : '✨ Автоперевод (Gemini AI)'}
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Слоган на русском (RU)</label>
                  <textarea
                    rows={2}
                    placeholder="Например: Изысканные завтраки, авторские блюда и уютная атмосфера в отеле Astrus"
                    value={heroSloganRU}
                    onChange={(e) => setHeroSloganRU(e.target.value)}
                    className="w-full bg-porto-bg border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold font-serif leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">English (EN)</label>
                    <input
                      type="text"
                      placeholder="e.g. Exquisite breakfasts, signature dishes and cozy atmosphere"
                      value={heroSloganEN}
                      onChange={(e) => setHeroSloganEN(e.target.value)}
                      className="w-full bg-porto-bg border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-serif"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">中文 (ZH)</label>
                    <input
                      type="text"
                      placeholder="精美早餐与舒适氛围..."
                      value={heroSloganZH}
                      onChange={(e) => setHeroSloganZH(e.target.value)}
                      className="w-full bg-porto-bg border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-serif"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ───────────────────────────────────────────────────────────── */}
            {/* 3. STORIES & NEWS CAROUSEL (Истории и события) */}
            {/* ───────────────────────────────────────────────────────────── */}
            <div className="glass-panel p-5 rounded-2xl border border-porto-gold/20 bg-porto-card/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <h4 className="text-xs font-bold uppercase text-porto-gold flex items-center gap-2">
                    <Film className="w-4 h-4 text-porto-gold" />
                    <span>3. Видео-истории и события (Stories)</span>
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Вертикальные истории с видео/фото, анимацией рамок и кнопками быстрого перехода
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={backstageVideoEnabled}
                    onChange={(e) => setBackstageVideoEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-porto-bg border border-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-porto-gold peer-checked:after:bg-porto-bg"></div>
                </label>
              </div>

              {backstageVideoEnabled && (
                <div className="space-y-4 bg-black/15 p-4 rounded-xl border border-white/5">
                  {stories.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4 font-semibold">Список историй пуст. Нажмите «Добавить историю».</p>
                  ) : (
                    <div className="space-y-4">
                      {stories.map((story, index) => (
                        <div key={story.id} className="border border-white/5 bg-black/20 p-3.5 rounded-xl space-y-3 relative">
                          <div className="flex justify-between items-center pb-2 border-b border-white/5">
                            <span className="text-[10px] font-bold text-porto-gold uppercase tracking-wider">История #{index + 1}</span>
                            <div className="flex items-center space-x-1.5">
                              {/* Enable/Disable Toggle */}
                              <label className="text-[9px] text-gray-400 font-semibold cursor-pointer flex items-center space-x-1">
                                <input
                                  type="checkbox"
                                  checked={story.enabled}
                                  onChange={(e) => {
                                    const updated = [...stories];
                                    updated[index] = { ...story, enabled: e.target.checked };
                                    setStories(updated);
                                  }}
                                  className="rounded border-white/10 bg-porto-bg text-porto-gold focus:ring-porto-gold w-3 h-3 cursor-pointer"
                                />
                                <span>Активна</span>
                              </label>

                              {/* Order controls */}
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => {
                                  if (index > 0) {
                                    const updated = [...stories];
                                    const temp = updated[index];
                                    updated[index] = updated[index - 1];
                                    updated[index - 1] = temp;
                                    setStories(updated);
                                  }
                                }}
                                className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                                title="Переместить вверх"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                disabled={index === stories.length - 1}
                                onClick={() => {
                                  if (index < stories.length - 1) {
                                    const updated = [...stories];
                                    const temp = updated[index];
                                    updated[index] = updated[index + 1];
                                    updated[index + 1] = temp;
                                    setStories(updated);
                                  }
                                }}
                                className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                                title="Переместить вниз"
                              >
                                ↓
                              </button>

                              {/* Delete button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setStories(stories.filter(s => s.id !== story.id));
                                }}
                                className="text-[9px] uppercase font-bold text-red-400 hover:text-red-300 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 ml-2 cursor-pointer"
                              >
                                Удалить
                              </button>
                            </div>
                          </div>

                          {/* Story Media (Video or Image) */}
                          <div className="space-y-2 pt-1">
                            <div className="flex items-center space-x-4">
                              <label className="text-[9px] font-bold text-gray-400 uppercase">Тип медиа:</label>
                              <div className="flex space-x-3">
                                <label className="text-xs text-gray-300 flex items-center space-x-1.5 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`media_type_${story.id}`}
                                    checked={!story.imageUrl && Boolean(story.videoUrl || !story.imageUrl)}
                                    onChange={() => {
                                      const updated = [...stories];
                                      updated[index] = { ...story, imageUrl: '' };
                                      setStories(updated);
                                    }}
                                    className="text-porto-gold focus:ring-porto-gold"
                                  />
                                  <span>🎬 Видео</span>
                                </label>
                                <label className="text-xs text-gray-300 flex items-center space-x-1.5 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`media_type_${story.id}`}
                                    checked={Boolean(story.imageUrl)}
                                    onChange={() => {
                                      const updated = [...stories];
                                      updated[index] = { ...story, videoUrl: '' };
                                      setStories(updated);
                                    }}
                                    className="text-porto-gold focus:ring-porto-gold"
                                  />
                                  <span>🖼️ Изображение / Постер</span>
                                </label>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-gray-400 uppercase">
                                  {story.imageUrl ? 'Ссылка на изображение' : 'Прямая ссылка на видео'}
                                </label>
                                <input
                                  type="text"
                                  placeholder={story.imageUrl ? '/uploads/promo_xxxx.jpg или https://...' : '/videos/story_xxxx.mp4 или https://...'}
                                  value={story.imageUrl || story.videoUrl || ''}
                                  onChange={(e) => {
                                    const updated = [...stories];
                                    if (story.imageUrl) {
                                      updated[index] = { ...story, imageUrl: e.target.value };
                                    } else {
                                      updated[index] = { ...story, videoUrl: e.target.value };
                                    }
                                    setStories(updated);
                                  }}
                                  className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-semibold"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-gray-400 uppercase">
                                  {story.imageUrl ? 'Загрузить картинку (JPG, PNG, WebP)' : 'Загрузить видеофайл (макс 50МБ)'}
                                </label>
                                <div className="flex items-center space-x-2.5 pt-0.5">
                                  <input
                                    type="file"
                                    accept={story.imageUrl ? 'image/jpeg,image/png,image/webp' : 'video/mp4,video/webm'}
                                    onChange={(e) => handleStoryMediaUpload(story.id, e, story.imageUrl ? 'image' : 'video')}
                                    disabled={isVideoUploadingMap[story.id]}
                                    className="text-xs text-gray-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[9px] file:font-bold file:uppercase file:bg-porto-gold/20 file:text-porto-gold hover:file:bg-porto-gold/30 file:cursor-pointer w-full"
                                  />
                                  {isVideoUploadingMap[story.id] && (
                                    <span className="text-[9px] text-porto-gold font-bold animate-pulse shrink-0">Загрузка...</span>
                                  )}
                                </div>
                                {videoUploadErrorMap[story.id] && (
                                  <p className="text-[9px] text-red-400 font-semibold">{videoUploadErrorMap[story.id]}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Localized Titles */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-gray-400 uppercase">Заголовок (RU)</label>
                              <input
                                type="text"
                                placeholder="Например: Завтраки в Porto Bar"
                                value={story.title?.ru || ''}
                                onChange={(e) => {
                                  const updated = [...stories];
                                  updated[index] = { ...story, title: { ...story.title, ru: e.target.value } };
                                  setStories(updated);
                                }}
                                className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-semibold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-gray-400 uppercase">Заголовок (EN)</label>
                              <input
                                type="text"
                                placeholder="e.g. Breakfast at Porto Bar"
                                value={story.title?.en || ''}
                                onChange={(e) => {
                                  const updated = [...stories];
                                  updated[index] = { ...story, title: { ...story.title, en: e.target.value } };
                                  setStories(updated);
                                }}
                                className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-semibold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-gray-400 uppercase">Заголовок (ZH)</label>
                              <input
                                type="text"
                                placeholder="故事标题"
                                value={story.title?.zh || ''}
                                onChange={(e) => {
                                  const updated = [...stories];
                                  updated[index] = { ...story, title: { ...story.title, zh: e.target.value } };
                                  setStories(updated);
                                }}
                                className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-semibold"
                              />
                            </div>
                          </div>

                          {/* Localized Badge & Subtitle */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-gray-400 uppercase">Стикер/Бейдж (RU) (например: НОВОЕ, АКЦИЯ)</label>
                              <input
                                type="text"
                                placeholder="НОВОЕ МЕНЮ"
                                value={story.badge?.ru || ''}
                                onChange={(e) => {
                                  const updated = [...stories];
                                  updated[index] = { ...story, badge: { ...story.badge, ru: e.target.value, en: story.badge?.en || '', zh: story.badge?.zh || '' } };
                                  setStories(updated);
                                }}
                                className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-gray-400 uppercase">Подзаголовок / Описание (RU)</label>
                              <input
                                type="text"
                                placeholder="Каждый день с 12:00 до 16:00"
                                value={story.subtitle?.ru || ''}
                                onChange={(e) => {
                                  const updated = [...stories];
                                  updated[index] = { ...story, subtitle: { ...story.subtitle, ru: e.target.value, en: story.subtitle?.en || '', zh: story.subtitle?.zh || '' } };
                                  setStories(updated);
                                }}
                                className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold"
                              />
                            </div>
                          </div>

                          {/* Action Link & CTA Button Settings */}
                          <div className="bg-white/5 border border-porto-gold/20 p-3 rounded-lg space-y-3 mt-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs">🔗</span>
                              <span className="text-[10px] font-bold uppercase text-porto-gold tracking-wider">
                                Кнопка перехода в историю (Action Link / CTA)
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-gray-400 uppercase">Действие при нажатии кнопки</label>
                                <select
                                  value={story.actionType || 'none'}
                                  onChange={(e) => {
                                    const updated = [...stories];
                                    const val = e.target.value as any;
                                    updated[index] = { 
                                      ...story, 
                                      actionType: val,
                                      actionTarget: val === 'category' ? (story.actionTarget || categories[0]?.id || '') : story.actionTarget 
                                    };
                                    setStories(updated);
                                  }}
                                  className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold cursor-pointer font-bold"
                                >
                                  <option value="none">Без кнопки перехода</option>
                                  <option value="category">Перейти к категории меню</option>
                                  <option value="booking">Открыть бронирование столика</option>
                                  <option value="cart">Открыть корзину / доставку</option>
                                  <option value="url">Внешняя ссылка / Свой URL</option>
                                </select>
                              </div>

                              {story.actionType === 'category' && (
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-gray-400 uppercase">Выберите категорию меню</label>
                                  <select
                                    value={story.actionTarget || categories[0]?.id || ''}
                                    onChange={(e) => {
                                      const updated = [...stories];
                                      updated[index] = { ...story, actionTarget: e.target.value };
                                      setStories(updated);
                                    }}
                                    className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold cursor-pointer font-bold"
                                  >
                                    {categories.map(cat => (
                                      <option key={cat.id} value={cat.id}>
                                        {cat.name.ru}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}

                              {story.actionType === 'url' && (
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-gray-400 uppercase">URL ссылки (https://...)</label>
                                  <input
                                    type="text"
                                    placeholder="https://eda.yandex.ru/..."
                                    value={story.actionTarget || ''}
                                    onChange={(e) => {
                                      const updated = [...stories];
                                      updated[index] = { ...story, actionTarget: e.target.value };
                                      setStories(updated);
                                    }}
                                    className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold"
                                  />
                                </div>
                              )}
                            </div>

                            {story.actionType && story.actionType !== 'none' && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-gray-400 uppercase">Текст кнопки (RU)</label>
                                  <input
                                    type="text"
                                    placeholder="Например: Посмотреть завтраки"
                                    value={story.actionButtonText?.ru || ''}
                                    onChange={(e) => {
                                      const updated = [...stories];
                                      updated[index] = { 
                                        ...story, 
                                        actionButtonText: { 
                                          ...story.actionButtonText, 
                                          ru: e.target.value, 
                                          en: story.actionButtonText?.en || '', 
                                          zh: story.actionButtonText?.zh || '' 
                                        } 
                                      };
                                      setStories(updated);
                                    }}
                                    className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-semibold"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-gray-400 uppercase">Текст кнопки (EN)</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. View Breakfast Menu"
                                    value={story.actionButtonText?.en || ''}
                                    onChange={(e) => {
                                      const updated = [...stories];
                                      updated[index] = { 
                                        ...story, 
                                        actionButtonText: { 
                                          ...story.actionButtonText, 
                                          en: e.target.value, 
                                          ru: story.actionButtonText?.ru || '', 
                                          zh: story.actionButtonText?.zh || '' 
                                        } 
                                      };
                                      setStories(updated);
                                    }}
                                    className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-semibold"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-gray-400 uppercase">Текст кнопки (ZH)</label>
                                  <input
                                    type="text"
                                    placeholder="查看菜单"
                                    value={story.actionButtonText?.zh || ''}
                                    onChange={(e) => {
                                      const updated = [...stories];
                                      updated[index] = { 
                                        ...story, 
                                        actionButtonText: { 
                                          ...story.actionButtonText, 
                                          zh: e.target.value, 
                                          ru: story.actionButtonText?.ru || '', 
                                          en: story.actionButtonText?.en || '' 
                                        } 
                                      };
                                      setStories(updated);
                                    }}
                                    className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-semibold"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add story button */}
                  <button
                    type="button"
                    onClick={() => {
                      const newStory: Story = {
                        id: 'story_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
                        videoUrl: '',
                        imageUrl: '',
                        title: { ru: '', en: '', zh: '' },
                        enabled: true,
                        actionType: 'none'
                      };
                      setStories([...stories, newStory]);
                    }}
                    className="w-full border border-dashed border-porto-gold/35 hover:border-porto-gold text-porto-gold hover:bg-porto-gold/5 font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    + Добавить историю
                  </button>
                </div>
              )}
            </div>

            {/* ───────────────────────────────────────────────────────────── */}
            {/* 4. PRINTED MENU IMAGE (Оригинальное печатное меню) */}
            {/* ───────────────────────────────────────────────────────────── */}
            <div className="glass-panel p-5 rounded-2xl border border-porto-gold/20 bg-porto-card/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <h4 className="text-xs font-bold uppercase text-porto-gold flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-porto-gold" />
                    <span>4. Печатное меню ресторана (PDF / Изображение)</span>
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Открывается гостям при нажатии на плавающую кнопку «Печатное меню»
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-300 uppercase">
                      URL изображения печатного меню
                    </label>
                    <input
                      type="text"
                      placeholder="/images/image_2026-07-01_13-49-49.png или https://..."
                      value={printedMenuImage}
                      onChange={(e) => setPrintedMenuImage(e.target.value)}
                      className="w-full bg-porto-bg border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-300 uppercase">
                      Загрузить новое изображение печатного меню
                    </label>
                    <div className="flex items-center space-x-2.5 pt-0.5">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePrintedMenuUpload}
                        disabled={isPrintedMenuUploading}
                        className="text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[9px] file:font-bold file:uppercase file:bg-porto-gold/20 file:text-porto-gold hover:file:bg-porto-gold/30 file:cursor-pointer w-full"
                      />
                      {isPrintedMenuUploading && (
                        <span className="text-[10px] text-porto-gold font-bold animate-pulse shrink-0">Загрузка...</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Printed Menu Preview */}
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Предпросмотр печатного меню:</p>
                  <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 max-h-48 flex items-center justify-center p-2">
                    {printedMenuImage ? (
                      <img
                        src={printedMenuImage}
                        alt="Printed Menu Preview"
                        className="max-h-44 object-contain rounded-lg shadow-md"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">Изображение не выбрано</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ───────────────────────────────────────────────────────────── */}
            {/* 5. RECOMMENDED DISHES (Рекомендуем) */}
            {/* ───────────────────────────────────────────────────────────── */}
            <div className="glass-panel p-5 rounded-2xl border border-porto-gold/20 bg-porto-card/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <h4 className="text-xs font-bold uppercase text-porto-gold flex items-center gap-2">
                    <Star className="w-4 h-4 text-porto-gold fill-porto-gold" />
                    <span>5. Блок «Рекомендуем» (Рекомендуемые блюда)</span>
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Блюда, которые отображаются в компактной горизонтальной карусели «Рекомендуем» на главной странице
                  </p>
                </div>
                <span className="text-[10px] font-bold text-porto-gold bg-porto-gold/10 border border-porto-gold/20 px-2.5 py-1 rounded-full">
                  Выбрано: {dishes.filter(d => d.isRecommended || d.labels?.includes('recommended')).length}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
                {dishes.map((dish) => {
                  const isRec = Boolean(dish.isRecommended || dish.labels?.includes('recommended'));
                  return (
                    <div
                      key={dish.id}
                      onClick={() => toggleDishRecommended(dish)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                        isRec
                          ? 'bg-porto-gold/15 border-porto-gold/50 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                          : 'bg-black/20 border-white/5 hover:border-white/15 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-black/40 shrink-0">
                          {dish.image ? (
                            <img src={dish.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Utensils className="w-4 h-4 text-gray-600 m-2" />
                          )}
                        </div>
                        <Star className={`w-4 h-4 ${isRec ? 'text-porto-gold fill-porto-gold' : 'text-gray-600'}`} />
                      </div>
                      <div className="mt-2">
                        <p className="text-[11px] font-bold text-white leading-tight line-clamp-1">{dish.name.ru}</p>
                        <p className="text-[10px] text-porto-gold font-bold font-sans mt-0.5">{dish.price} ₽</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Save Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => handleSaveContent()}
                className="bg-gradient-to-r from-porto-gold-dark via-porto-gold to-porto-gold-bright text-porto-bg font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-all shadow-xl cursor-pointer"
              >
                💾 Сохранить все изменения контента
              </button>
            </div>
          </div>
        )}
        {activeTab === 'promotions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-porto-card/50 p-4 border border-porto-gold/10 rounded-2xl">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-porto-gold">Promotions & Offers</h3>
                <p className="text-[10px] text-gray-400">{promotions.length} deals total</p>
              </div>
              <button
                onClick={startAddPromo}
                className="flex items-center space-x-1 bg-porto-gold text-porto-bg px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-porto-gold-bright transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{t('admin.addPromo')}</span>
              </button>
            </div>

            <div className="space-y-3">
              {promotions.map((promo) => (
                <div
                  key={promo.id}
                  className="glass-panel p-4 rounded-xl flex items-center justify-between border border-porto-gold/15 bg-porto-card/50 relative overflow-hidden"
                >
                  {!promo.active && (
                    <div className="absolute top-0 right-0 bg-red-600/10 text-red-400 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-bl-lg border-l border-b border-red-500/20">
                      Inactive
                    </div>
                  )}

                  <div className="flex items-center space-x-3.5">
                    {promo.image && (
                      <div className="relative w-12 h-12 rounded-lg border border-porto-gold/10 overflow-hidden bg-porto-bg/50 flex-shrink-0">
                        <img
                          src={promo.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div>
                      <h4 className={`text-sm font-semibold font-serif ${promo.active ? 'text-gray-100' : 'text-gray-500 line-through'}`}>
                        {promo.title.ru}
                      </h4>
                      <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{promo.description.ru}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 z-10">
                    <button
                      onClick={() => togglePromoActivity(promo)}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        promo.active
                          ? 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                          : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20'
                      }`}
                      title={promo.active ? 'Deactivate' : 'Activate'}
                    >
                      {promo.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setEditingPromo(promo)}
                      className="p-2 bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deletePromo(promo.id)}
                      className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-porto-card/50 p-4 border border-porto-gold/10 rounded-2xl">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-porto-gold">Управление Заказами</h3>
                <p className="text-[10px] text-gray-400">Всего заказов: {orders.length}</p>
              </div>

              {/* Order filters */}
              <div className="flex flex-wrap gap-1.5">
                {(['all', 'active', 'completed', 'archived'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setOrderFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all cursor-pointer ${
                      orderFilter === filter
                        ? 'bg-porto-gold text-porto-bg border-porto-gold'
                        : 'bg-transparent text-gray-400 border-white/10 hover:border-porto-gold/25'
                    }`}
                  >
                    {filter === 'all' ? 'Все' : filter === 'active' ? 'Активные' : filter === 'completed' ? 'Выполненные' : 'Архив'}
                  </button>
                ))}
              </div>
            </div>

            {/* Search orders */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-porto-gold/60" />
              <input
                type="text"
                placeholder="Поиск заказов по телефону, столу, комнате..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full bg-porto-card/50 border border-porto-gold/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-porto-gold-bright"
              />
            </div>

            {/* Orders list */}
            <div className="space-y-3">
              {orders
                .filter((order) => {
                  // Filter by status
                  if (orderFilter === 'active') {
                    if (order.status === 'completed' || order.status === 'archived' || order.status === 'cancelled') return false;
                  } else if (orderFilter === 'completed') {
                    if (order.status !== 'completed') return false;
                  } else if (orderFilter === 'archived') {
                    if (order.status !== 'archived') return false;
                  }

                  // Filter by search
                  if (!orderSearch.trim()) return true;
                  const search = orderSearch.toLowerCase();
                  const matchPhone = order.phone.toLowerCase().includes(search);
                  const matchRoom = order.roomNumber?.toLowerCase().includes(search) || false;
                  const matchTable = order.tableNumber?.toLowerCase().includes(search) || false;
                  const matchId = order.id.toLowerCase().includes(search);
                  return matchPhone || matchRoom || matchTable || matchId;
                })
                .map((order) => {
                  const orderDate = new Date(order.createdAt).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  return (
                    <div
                      key={order.id}
                      className="glass-panel p-5 rounded-2xl border border-porto-gold/15 bg-porto-card/40 space-y-4"
                    >
                      <div className="flex justify-between items-start border-b border-white/5 pb-2.5">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                              order.type === 'room'
                                ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                                : order.type === 'delivery'
                                ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                : order.type === 'table'
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            }`}>
                              {order.type === 'room' ? 'В Номер' : order.type === 'delivery' ? 'Доставка (Курьер)' : order.type === 'table' ? 'На Стол' : 'На Вынос'}
                            </span>
                            <span className="text-xs font-bold text-gray-300">
                              #{order.id.replace('order-', '')}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 mt-1 font-semibold">
                            Создан: {orderDate}
                          </p>
                        </div>

                        {/* Status Select Badge */}
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Статус:</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleOrderStatusChange(order.id, e.target.value as OrderStatus)}
                            className="bg-porto-bg border border-porto-gold/20 rounded-md px-2 py-1 text-[10px] font-bold text-porto-gold focus:outline-none focus:border-porto-gold-bright cursor-pointer"
                          >
                            <option value="received">Получен</option>
                            <option value="preparing">Готовится</option>
                            <option value="completed">Выполнен</option>
                            <option value="cancelled">Отменен</option>
                            <option value="archived">В архив</option>
                          </select>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-porto-gold">Блюда в заказе</p>
                        <div className="bg-black/20 border border-white/5 rounded-xl p-3 space-y-1">
                          {order.items.map((item, idx) => {
                            const dish = dishes.find(d => d.id === item.dishId);
                            const dishName = dish ? dish.name.ru : 'Неизвестное блюдо';
                            return (
                              <div key={idx} className="flex justify-between items-center text-xs">
                                <span className="text-gray-300 font-medium">
                                  {dishName} <span className="text-porto-gold-bright font-bold">x{item.quantity}</span>
                                </span>
                                <span className="text-gray-400 font-semibold">
                                  {item.priceAtOrder === 0 ? '🎁 ПОДАРОК' : `${item.priceAtOrder * item.quantity} ₽`}
                                </span>
                              </div>
                            );
                          })}
                          {order.type === 'room' && (
                            <div className="flex justify-between items-center text-xs text-porto-gold-bright pt-1 mt-1 border-t border-white/5 border-dashed">
                              <span>Доставка в номер:</span>
                              <span>150 ₽</span>
                            </div>
                          )}
                          <div className="border-t border-white/5 pt-1.5 mt-2 flex justify-between items-center text-xs font-bold text-porto-gold">
                            <span>Итого:</span>
                            <span>{order.totalAmount} ₽</span>
                          </div>
                        </div>
                      </div>

                      {/* Customer Details & Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-white/5 pt-3">
                        <div className="space-y-1 text-gray-400">
                          <p>
                            📞 Телефон: <strong className="text-white">{order.phone}</strong>
                          </p>
                          <p>
                            📍 Детали:{' '}
                            <strong className="text-white">
                              {order.type === 'room'
                                ? `Комната ${order.roomNumber}`
                                : order.type === 'delivery'
                                ? `Адрес: ${order.deliveryAddress || 'Не указан'}${order.deliveryApartment ? `, кв. ${order.deliveryApartment}` : ''}${order.deliveryEntrance ? `, под. ${order.deliveryEntrance}` : ''}${order.deliveryFloor ? `, эт. ${order.deliveryFloor}` : ''}${order.deliveryDistance !== undefined ? ` (~${order.deliveryDistance} км)` : ''}`
                                : order.type === 'table'
                                ? `Стол ${order.tableNumber}`
                                : 'На Вынос'}
                            </strong>
                          </p>
                          {order.type === 'delivery' && order.deliveryComment && (
                            <p className="text-[11px] text-amber-300">
                              💬 Комментарий: {order.deliveryComment}
                            </p>
                          )}
                          <p>
                            💳 Оплата:{' '}
                            <strong className="text-white">
                              {order.paymentMethod === 'terminal' ? 'Карта (Терминал)' : 'Наличные'}
                            </strong>
                          </p>
                        </div>

                        <div className="flex items-center space-x-2.5">
                          {order.status !== 'completed' && order.status !== 'archived' && (
                            <button
                              onClick={() => handleOrderStatusChange(order.id, 'completed')}
                              className="flex items-center space-x-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer animate-pulse-subtle"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Выполнить</span>
                            </button>
                          )}
                          {order.status !== 'archived' && (
                            <button
                              onClick={() => handleOrderStatusChange(order.id, 'archived')}
                              className="flex items-center space-x-1 bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer"
                            >
                              <Archive className="w-3.5 h-3.5" />
                              <span>Архивировать</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              {orders.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <ShoppingBag className="w-8 h-8 mx-auto text-gray-600 mb-2 stroke-1" />
                  <p className="text-sm font-semibold">Список заказов пуст</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LOYALTY TAB */}
        {activeTab === 'loyalty' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-porto-card/50 p-4 border border-porto-gold/10 rounded-2xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-porto-gold">Клуб Лояльности (Porto Club)</h3>
              <p className="text-[10px] text-gray-400">Поиск участников и управление балансом баллов гостей</p>
            </div>

            {/* Search member */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-porto-gold/60" />
              <input
                type="text"
                placeholder="Поиск участников по телефону или имени..."
                value={loyaltySearch}
                onChange={(e) => {
                  setLoyaltySearch(e.target.value);
                  const search = e.target.value.replace(/\D/g, '');
                  if (search.length >= 6) {
                    const found = loyaltyMembers.find(m => m.phone.replace(/\D/g, '').includes(search));
                    if (found) setSelectedLoyaltyMember(found);
                  }
                }}
                className="w-full bg-porto-card/50 border border-porto-gold/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-porto-gold-bright"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Members List */}
              <div className="md:col-span-1 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">Участники клуба ({loyaltyMembers.length})</h4>
                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                  {loyaltyMembers
                    .filter((m) => {
                      if (!loyaltySearch.trim()) return true;
                      return m.phone.includes(loyaltySearch) || m.name.toLowerCase().includes(loyaltySearch.toLowerCase());
                    })
                    .map((member) => (
                      <button
                        key={member.phone}
                        onClick={() => setSelectedLoyaltyMember(member)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                          selectedLoyaltyMember?.phone === member.phone
                            ? 'bg-porto-gold/10 border-porto-gold text-porto-gold-bright font-bold'
                            : 'bg-porto-card/40 border-white/5 hover:border-porto-gold/20 text-gray-300'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold">{member.name}</p>
                          <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{member.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black font-serif">{member.points} PTS</p>
                          <p className="text-[8px] uppercase tracking-wider font-semibold text-porto-gold">{member.tier}</p>
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              {/* Adjust Points Form / View Member Details */}
              <div className="md:col-span-2">
                {selectedLoyaltyMember ? (
                  <div className="glass-panel p-5 rounded-2xl border border-porto-gold/20 bg-porto-card/50 space-y-6">
                    <div className="flex justify-between items-start border-b border-white/5 pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-white font-serif">{selectedLoyaltyMember.name}</h4>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
                          Карта: {selectedLoyaltyMember.cardNumber} • Регистрация: {selectedLoyaltyMember.registrationDate}
                        </p>
                      </div>
                      <span className="text-[10px] tracking-wider uppercase font-black px-2 py-0.5 bg-black/40 text-porto-gold border border-porto-gold/25 rounded-md">
                        {selectedLoyaltyMember.tier}
                      </span>
                    </div>

                    {/* Balance summary */}
                    <div className="bg-black/35 rounded-2xl p-4 flex justify-between items-center border border-white/5">
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black">Текущие баллы</p>
                        <p className="text-3xl font-serif font-black text-porto-gold-bright leading-none mt-1">
                          {selectedLoyaltyMember.points} <span className="text-xs font-bold text-white uppercase font-sans">PTS</span>
                        </p>
                      </div>
                      <div className="text-right text-[10px] text-gray-400 leading-relaxed font-semibold">
                        <p>📞 {selectedLoyaltyMember.phone}</p>
                        <p>Tiers: Bronze &rarr; Silver &rarr; Gold &rarr; Premium</p>
                      </div>
                    </div>

                    {/* Adjustment Form */}
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-porto-gold">Количество баллов</label>
                          <input
                            type="number"
                            required
                            min="1"
                            placeholder="100"
                            value={pointsAmount}
                            onChange={(e) => setPointsAmount(e.target.value)}
                            className="w-full bg-porto-bg border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-porto-gold">Причина / Комментарий</label>
                          <input
                            type="text"
                            placeholder="Например: Бонус за визит"
                            value={pointsComment}
                            onChange={(e) => setPointsComment(e.target.value)}
                            className="w-full bg-porto-bg border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-porto-gold font-bold"
                          />
                        </div>
                      </div>

                      <div className="flex space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={(e) => handlePointsAdjustment(e, 'accrual')}
                          className="flex-1 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 font-bold py-2.5 rounded-lg text-xs uppercase cursor-pointer"
                        >
                          Начислить (+ баллы)
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handlePointsAdjustment(e, 'deduction')}
                          className="flex-1 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-bold py-2.5 rounded-lg text-xs uppercase cursor-pointer"
                        >
                          Списать (- баллы)
                        </button>
                      </div>
                    </form>

                    {/* Member History */}
                    <div className="space-y-2 text-left pt-2 border-t border-white/5">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-porto-gold flex items-center space-x-1">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>История операций</span>
                      </h4>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {selectedLoyaltyMember.history.map((log, index) => (
                          <div
                            key={index}
                            className="bg-black/10 border border-white/5 rounded-lg p-2 flex items-center justify-between text-xs"
                          >
                            <div>
                              <p className="text-gray-300 font-medium">{log.comment}</p>
                              <p className="text-[9px] text-gray-500 mt-0.5">{log.date}</p>
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
                        ))}
                        {selectedLoyaltyMember.history.length === 0 && (
                          <p className="text-xs text-gray-500 py-4 text-center">История пуста</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-porto-card/30 border border-white/5 rounded-2xl p-16 text-center text-gray-500">
                    <User className="w-8 h-8 mx-auto text-gray-600 mb-2 stroke-1" />
                    <p className="text-sm font-semibold">Выберите гостя слева или введите телефон для поиска</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* WAITER CALLS TAB */}
        {activeTab === 'calls' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-porto-card/50 p-4 border border-porto-gold/10 rounded-2xl flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-porto-gold">Журнал вызовов официантов</h3>
                <p className="text-[10px] text-gray-400">Просмотр и закрытие активных вызовов со столов</p>
              </div>
              <button
                onClick={clearWaiterCallsHistory}
                disabled={waiterCalls.length === 0}
                className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 px-3 py-1.5 rounded-xl text-[10px] font-bold text-red-400 disabled:opacity-50 transition-all cursor-pointer"
              >
                Очистить историю
              </button>
            </div>

            <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden bg-porto-card/35">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-black/20 text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="p-4">Время</th>
                      <th className="p-4">Стол</th>
                      <th className="p-4">Официант</th>
                      <th className="p-4">Статус</th>
                      <th className="p-4 text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-semibold text-gray-200">
                    {waiterCalls.map((call) => (
                      <tr key={call.id} className="hover:bg-white/5 transition-all">
                        <td className="p-4 whitespace-nowrap text-gray-400">
                          {new Date(call.timestamp).toLocaleString('ru-RU')}
                        </td>
                        <td className="p-4 text-porto-gold-bright font-black text-sm">
                          № {call.tableNumber}
                        </td>
                        <td className="p-4">
                          <span className={call.assignedWaiter.includes('Не назначен') ? 'text-yellow-500/80 font-medium italic' : 'text-gray-200'}>
                            {call.assignedWaiter}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            call.status === 'pending'
                              ? 'bg-amber-500/10 border border-amber-500/35 text-amber-400'
                              : 'bg-emerald-500/10 border border-emerald-500/35 text-emerald-400'
                          }`}>
                            {call.status === 'pending' ? 'Ожидает' : 'Выполнен'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {call.status === 'pending' ? (
                            <button
                              onClick={() => updateWaiterCallStatus(call.id, 'completed')}
                              className="bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider inline-flex items-center space-x-1 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Выполнено</span>
                            </button>
                          ) : (
                            <span className="text-gray-500 text-[10px] italic">Закрыт</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {waiterCalls.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-gray-500 text-sm">
                          Активных вызовов или истории вызовов пока нет
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PUSH TAB */}
        {activeTab === 'push' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-porto-card/50 p-4 border border-porto-gold/10 rounded-2xl flex justify-between items-center text-left">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-porto-gold">Рассылка пуш-уведомлений (Web Push)</h3>
                <p className="text-[10px] text-gray-400">Уведомления прилетают гостям на рабочий стол PWA-приложения</p>
              </div>
              <div className="bg-porto-gold/10 border border-porto-gold/25 px-4 py-2 rounded-xl text-center">
                <p className="text-[10px] uppercase font-bold text-porto-gold">Активные подписчики</p>
                <p className="text-xl font-black text-white">{pushCount}</p>
              </div>
            </div>

            <form onSubmit={handleSendPushBroadcast} className="glass-panel p-5 rounded-2xl border border-porto-gold/20 bg-porto-card/50 space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-porto-gold">Заголовок пуша</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Горячая пицца со скидкой 20%!"
                  value={pushTitle}
                  onChange={(e) => setPushTitle(e.target.value)}
                  className="w-full bg-porto-bg border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-porto-gold font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-porto-gold">Текст пуш-сообщения</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Только сегодня с 18:00 до 21:00 закажите пиццу Пепперони в номер с приятной скидкой..."
                  value={pushBody}
                  onChange={(e) => setPushBody(e.target.value)}
                  className="w-full bg-porto-bg border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-porto-gold font-semibold resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-porto-gold">Ссылка при клике (Опционально)</label>
                <input
                  type="text"
                  placeholder="e.g. /promos или /?table=5"
                  value={pushUrl}
                  onChange={(e) => setPushUrl(e.target.value)}
                  className="w-full bg-porto-bg border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-porto-gold font-mono"
                />
                <p className="text-[9px] text-gray-500">Оставьте пустым для перехода на главную страницу.</p>
              </div>

              {pushBroadcastResult && (
                <div className={`p-4 rounded-xl text-xs border ${pushBroadcastResult.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}>
                  {pushBroadcastResult.success ? (
                    <div>
                      <p className="font-bold">✅ Рассылка завершена успешно!</p>
                      <p className="text-[10px] mt-1">Доставлено: <strong className="text-white">{pushBroadcastResult.sent}</strong> | Ошибок (устаревшие подписки удалены): <strong className="text-white">{pushBroadcastResult.failed}</strong></p>
                    </div>
                  ) : (
                    <p>❌ Ошибка при отправке: {pushBroadcastResult.error}</p>
                  )}
                </div>
              )}

              <div className="flex justify-end pt-2 border-t border-white/5">
                <button
                  type="submit"
                  disabled={isBroadcastingPush || pushCount === 0}
                  className="bg-porto-gold text-porto-bg font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider hover:bg-porto-gold-bright transition-all cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isBroadcastingPush ? 'Отправка...' : `Разослать пуш (${pushCount})`}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-porto-card/50 p-4 border border-porto-gold/10 rounded-2xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-porto-gold">Настройки Telegram Интеграции</h3>
              <p className="text-[10px] text-gray-400">Настройте маршруты уведомлений для заказов и вызовов официантов</p>
            </div>

            <form onSubmit={handleSaveTelegramSettings} className="glass-panel p-5 rounded-2xl border border-porto-gold/20 bg-porto-card/50 space-y-5">
              <div className="flex items-center space-x-2 text-xs font-semibold">
                <span className="text-gray-400">Статус интеграции:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isTelegramConfigured
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                }`}>
                  {isTelegramConfigured ? 'АКТИВНА / НАСТРОЕНА' : 'НЕ НАСТРОЕНА'}
                </span>
              </div>

              <div className="h-[1px] bg-white/5"></div>

              <div className="space-y-4">
                {/* Bot Token */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-porto-gold">Telegram Bot Token</label>
                  <input
                    type="password"
                    placeholder={isTelegramConfigured ? "••••••••••••••••••••••••••••" : "5423854921:AAFr4... (введите токен бота)"}
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                    className="w-full bg-porto-bg border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-porto-gold font-bold"
                  />
                  <p className="text-[9px] text-gray-400 font-medium">Для безопасности текущий токен бота никогда не отправляется в клиентский браузер.</p>
                </div>

                {/* Orders Chat ID */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-porto-gold">Чат заказов (Основной Chat ID / Рабочий телефон)</label>
                  <input
                    type="text"
                    required
                    placeholder="-10018593849... (ID чата, куда приходят все заказы)"
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    className="w-full bg-porto-bg border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-porto-gold font-bold"
                  />
                  <p className="text-[9px] text-gray-400 font-medium">Сюда будут направляться все новые оформленные гостями заказы.</p>
                </div>

                {/* Working Hours */}
                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold uppercase text-porto-gold">Начало работы (ЧЧ:ММ)</label>
                    <input
                      type="text"
                      required
                      placeholder="12:00"
                      value={workHoursStart}
                      onChange={(e) => setWorkHoursStart(e.target.value)}
                      className="w-full bg-porto-bg border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-porto-gold font-bold"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold uppercase text-porto-gold">Конец работы (ЧЧ:ММ)</label>
                    <input
                      type="text"
                      required
                      placeholder="24:00"
                      value={workHoursEnd}
                      onChange={(e) => setWorkHoursEnd(e.target.value)}
                      className="w-full bg-porto-bg border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-porto-gold font-bold"
                    />
                  </div>
                </div>
                <p className="text-[9px] text-gray-400 font-medium text-left">Укажите время начала и окончания работы заведения (например, с 12:00 до 00:00 или 24:00). Будет использоваться для уведомления гостей в нерабочее время.</p>

                {/* Default Waiter Call Chat ID */}
                <div className="space-y-1 border-t border-white/5 pt-4">
                  <label className="text-[10px] font-bold uppercase text-porto-gold">Чат вызовов официантов (Общий / Fallback Chat ID)</label>
                  <input
                    type="text"
                    placeholder="-10019485039... (ID чата вызова по умолчанию)"
                    value={waiterChatId}
                    onChange={(e) => setWaiterChatId(e.target.value)}
                    className="w-full bg-porto-bg border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-porto-gold font-bold"
                  />
                  <p className="text-[9px] text-gray-400 font-medium">Сюда будут направляться вызовы официантов, если стол не привязан к конкретному сотруднику.</p>
                </div>

                {/* Gemini AI Key */}
                <div className="space-y-1 border-t border-white/5 pt-4">
                  <div className="flex items-center justify-between pb-1">
                    <label className="text-[10px] font-bold uppercase text-porto-gold">Google Gemini API Key</label>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                      isGeminiConfigured
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                    }`}>
                      {isGeminiConfigured ? 'АКТИВЕН / НАСТРОЕН' : 'НЕ НАСТРОЕН'}
                    </span>
                  </div>
                  <input
                    type="password"
                    placeholder={isGeminiConfigured ? "••••••••••••••••••••••••••••" : "AIzaSy... (введите ваш API-ключ Gemini)"}
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    className="w-full bg-porto-bg border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-porto-gold font-bold"
                  />
                  <p className="text-[9px] text-gray-400 font-medium">Ключ необходим для работы автоперевода меню на английский/китайский и автооценки КБЖУ по фотографиям блюд через модель Gemini 2.5 Flash.</p>
                  
                  <details className="group border border-white/10 bg-white/5 rounded-xl overflow-hidden transition-all duration-300 mt-2">
                    <summary className="flex items-center justify-between p-2.5 text-[10px] font-bold text-porto-gold cursor-pointer select-none hover:bg-white/5 list-none">
                      <span>ℹ️ ИНСТРУКЦИЯ: ПОЛУЧЕНИЕ GEMINI API KEY</span>
                      <span className="transition-transform duration-300 group-open:rotate-180 text-[8px]">▼</span>
                    </summary>
                    <div className="p-3 border-t border-white/5 text-[9px] text-gray-300 space-y-1 leading-relaxed">
                      <ol className="list-decimal pl-4 space-y-1">
                        <li>Перейдите на официальный сайт <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-porto-gold underline hover:text-porto-gold-bright">Google AI Studio</a>.</li>
                        <li>Войдите в систему, используя любой ваш Google-аккаунт.</li>
                        <li>Нажмите кнопку <strong>Get API key</strong> в верхнем левом меню.</li>
                        <li>Нажмите кнопку <strong>Create API key</strong>, выберите создание в новом или существующем проекте Google Cloud.</li>
                        <li>Скопируйте сгенерированный ключ (строка длиной около 40 символов, начинающаяся с <code className="font-mono bg-black/40 px-1 rounded text-porto-gold">AIzaSy</code>) и вставьте в поле выше.</li>
                      </ol>
                    </div>
                  </details>
                </div>

                {/* Gemini Proxy URL */}
                <div className="space-y-1 border-t border-white/5 pt-4">
                  <label className="text-[10px] font-bold uppercase text-porto-gold">Gemini Proxy URL (Опционально)</label>
                  <input
                    type="text"
                    placeholder="https://generativelanguage.googleapis.com"
                    value={geminiProxyUrl}
                    onChange={(e) => setGeminiProxyUrl(e.target.value)}
                    className="w-full bg-porto-bg border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-porto-gold font-bold"
                  />
                  <p className="text-[9px] text-gray-400 font-medium">Позволяет перенаправлять запросы к Gemini через прокси-сервер или Cloudflare Worker, если ваш сервер находится в неподдерживаемом регионе (например, РФ).</p>
                </div>

                {/* SMTP Server Configuration */}
                <div className="space-y-4 border-t border-white/5 pt-4 text-left">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase text-porto-gold flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-porto-gold" />
                      <span>Настройки почтового сервера (SMTP) для Email OTP</span>
                    </h4>
                    <p className="text-[9px] text-gray-400">Настройте параметры вашей корпоративной или личной почты для рассылки кодов авторизации</p>
                  </div>

                  <details className="group border border-white/10 bg-white/5 rounded-xl overflow-hidden transition-all duration-300">
                    <summary className="flex items-center justify-between p-2.5 text-[10px] font-bold text-porto-gold cursor-pointer select-none hover:bg-white/5 list-none">
                      <span>ℹ️ ИНСТРУКЦИЯ: НАСТРОЙКА SMTP И ПАРОЛЯ ПРИЛОЖЕНИЯ</span>
                      <span className="transition-transform duration-300 group-open:rotate-180 text-[8px]">▼</span>
                    </summary>
                    <div className="p-3 border-t border-white/5 text-[9px] text-gray-300 space-y-3 leading-relaxed">
                      <div>
                        <p className="font-bold text-white mb-1">1. Серверные параметры популярных почтовых служб:</p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li><strong>Mail.ru / VK Почта:</strong> Сервер: <code className="font-mono text-porto-gold">smtp.mail.ru</code>, Порт: <code className="font-mono text-porto-gold">465</code></li>
                          <li><strong>Яндекс.Почта:</strong> Сервер: <code className="font-mono text-porto-gold">smtp.yandex.ru</code>, Порт: <code className="font-mono text-porto-gold">465</code> (также убедитесь, что в настройках Яндекс.Почты → Почтовые программы включён доступ по протоколу IMAP/SMTP)</li>
                          <li><strong>Gmail (Google):</strong> Сервер: <code className="font-mono text-porto-gold">smtp.gmail.com</code>, Порт: <code className="font-mono text-porto-gold">465</code></li>
                        </ul>
                      </div>
                      <div className="border-t border-white/5 pt-2">
                        <p className="font-bold text-yellow-400 mb-1">2. ⚠️ ВАЖНО: Почему обычный пароль от почты не подойдёт?</p>
                        <p>Современные почтовые сервисы блокируют авторизацию по основному паролю через внешние скрипты. Вам необходимо включить <strong>двухфакторную аутентификацию (2FA)</strong> в настройках вашей почты и выпустить специальный <strong>Пароль для внешнего приложения</strong>:</p>
                        <ul className="list-disc pl-4 mt-1 space-y-1">
                          <li><strong>Mail.ru:</strong> Перейдите в Личный кабинет → Безопасность → Пароли для внешних приложений → Добавить → Назовите его (например, "Porto Bar") → Скопируйте сгенерированный 16-значный буквенный код.</li>
                          <li><strong>Яндекс:</strong> Яндекс ID → Безопасность → Пароли приложений → Создать пароль → Выберите тип "Почта" → Назовите и скопируйте код.</li>
                          <li><strong>Gmail:</strong> Аккаунт Google → Безопасность → Двухэтапная аутентификация → Пароли приложений (в самом низу страницы) → Создать → выберите "Другое" → Назовите и скопируйте код.</li>
                        </ul>
                        <p className="mt-1.5 text-porto-gold font-medium">Вставьте полученный код приложения в поле "Пароль" ниже вместо вашего пароля от почтового ящика.</p>
                      </div>
                    </div>
                  </details>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase">SMTP Сервер (Хост)</label>
                      <input
                        type="text"
                        placeholder="e.g. smtp.mail.ru"
                        value={smtpHost}
                        onChange={(e) => setSmtpHost(e.target.value)}
                        className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase">SMTP Порт</label>
                      <input
                        type="text"
                        placeholder="465"
                        value={smtpPort}
                        onChange={(e) => setSmtpPort(e.target.value)}
                        className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase">Пользователь (Email)</label>
                      <input
                        type="text"
                        placeholder="e.g. restaurant@mail.ru"
                        value={smtpUser}
                        onChange={(e) => setSmtpUser(e.target.value)}
                        className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase">Пароль (Или пароль приложения)</label>
                      <input
                        type="password"
                        placeholder={isSmtpConfigured ? "••••••••••••••••••••••••••••" : "Пароль от почты"}
                        value={smtpPass}
                        onChange={(e) => setSmtpPass(e.target.value)}
                        className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleTestSmtp}
                      disabled={isTestingSmtp}
                      className="bg-porto-gold/20 border border-porto-gold/30 hover:bg-porto-gold/30 text-porto-gold font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase cursor-pointer"
                    >
                      {isTestingSmtp ? 'Тестирование...' : 'Проверить SMTP'}
                    </button>
                  </div>
                </div>

                {/* Delivery Zone & Yandex Eda Configuration */}
                <div className="space-y-4 border-t border-white/5 pt-4 text-left">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase text-porto-gold flex items-center gap-1.5">
                      <span className="text-sm">🛵</span>
                      <span>Зона доставки и Яндекс Еда</span>
                    </h4>
                    <p className="text-[9px] text-gray-400 mt-0.5">
                      Настройка радиуса доставки от заведения (по умолчанию 2 км) и ссылка на Яндекс Еду для клиентов вне зоны.
                    </p>
                  </div>

                  <div className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-3.5">
                    {/* Yandex Eda URL */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase flex items-center gap-1">
                        <span>Ссылка на ресторан в Яндекс Еде</span>
                        <span className="text-[#FFE800] text-[8px] font-black px-1.5 py-0.2 bg-[#FFE800]/10 rounded border border-[#FFE800]/20">Яндекс Еда</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://eda.yandex.ru/restaurant/porto_bar"
                        value={yandexEdaUrl}
                        onChange={(e) => setYandexEdaUrl(e.target.value)}
                        className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-porto-gold font-medium"
                      />
                      <p className="text-[9px] text-gray-500">
                        Если адрес доставки гостя превышает радиус доставки, сайт покажет кнопку перехода по этой ссылке. Если ссылка пустая, сайт просто сообщит, что доставка невозможна.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Radius */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">
                          Радиус доставки ресторана (км)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.5"
                          max="50"
                          placeholder="2"
                          value={deliveryRadiusKm}
                          onChange={(e) => setDeliveryRadiusKm(parseFloat(e.target.value) || 2)}
                          className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-bold"
                        />
                      </div>

                      {/* Delivery Fee */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">
                          Стоимость доставки (₽)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="50"
                          placeholder="0 (Бесплатно)"
                          value={deliveryFee}
                          onChange={(e) => setDeliveryFee(parseInt(e.target.value) || 0)}
                          className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-bold"
                        />
                      </div>
                    </div>

                    {/* Restaurant Address & Coordinates */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase">
                        Адрес ресторана (Точка отсчета)
                      </label>
                      <input
                        type="text"
                        placeholder="Ленинский проспект, 146, Москва (Отель Аструс)"
                        value={restaurantAddress}
                        onChange={(e) => setRestaurantAddress(e.target.value)}
                        className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">Координаты: Широта (Lat)</label>
                        <input
                          type="number"
                          step="0.000001"
                          placeholder="55.654060"
                          value={restaurantLat}
                          onChange={(e) => setRestaurantLat(parseFloat(e.target.value) || 55.654060)}
                          className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">Координаты: Долгота (Lng)</label>
                        <input
                          type="number"
                          step="0.000001"
                          placeholder="37.498877"
                          value={restaurantLng}
                          onChange={(e) => setRestaurantLng(parseFloat(e.target.value) || 37.498877)}
                          className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* VK ID Integration Configuration */}
                <div className="space-y-3 border-t border-white/5 pt-4 text-left">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase text-porto-gold flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-porto-gold" />
                      <span>Интеграция VK ID</span>
                    </h4>
                    <p className="text-[9px] text-gray-400">Укажите ID приложения VK Developers для авторизации через соцсеть</p>
                  </div>

                  <details className="group border border-white/10 bg-white/5 rounded-xl overflow-hidden transition-all duration-300">
                    <summary className="flex items-center justify-between p-2.5 text-[10px] font-bold text-porto-gold cursor-pointer select-none hover:bg-white/5 list-none">
                      <span>ℹ️ ИНСТРУКЦИЯ: НАСТРОЙКА АВТОРИЗАЦИИ VK ID</span>
                      <span className="transition-transform duration-300 group-open:rotate-180 text-[8px]">▼</span>
                    </summary>
                    <div className="p-3 border-t border-white/5 text-[9px] text-gray-300 space-y-1.5 leading-relaxed">
                      <p>Для того чтобы гости могли авторизоваться через свой аккаунт ВКонтакте:</p>
                      <ol className="list-decimal pl-4 space-y-1">
                        <li>Перейдите на сайт <a href="https://vk.com/dev" target="_blank" rel="noopener noreferrer" className="text-porto-gold underline hover:text-porto-gold-bright">VK Developers</a>.</li>
                        <li>Нажмите кнопку <strong>Создать приложение</strong>.</li>
                        <li>Выберите тип <strong>Web-сайт</strong>, укажите название и введите URL вашего развернутого сайта.</li>
                        <li>Подтвердите создание по SMS/Push.</li>
                        <li>После создания перейдите в раздел <strong>Настройки</strong> в левом меню.</li>
                        <li>Скопируйте значение из поля <strong>ID приложения (App ID)</strong> (числовой код) и вставьте его ниже.</li>
                      </ol>
                    </div>
                  </details>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">VK App ID (Опционально)</label>
                    <input
                      type="text"
                      placeholder="e.g. 51765432"
                      value={vkAppId}
                      onChange={(e) => setVkAppId(e.target.value)}
                      className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-bold"
                    />
                  </div>
                </div>



                {/* ══════════════════════════════════════════════════════════ */}
                {/* iiko Integration */}
                {/* ══════════════════════════════════════════════════════════ */}
                <div className="space-y-4 border-t border-white/5 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase text-porto-gold flex items-center gap-1.5">
                        <span className="text-sm">🍽️</span> iiko Интеграция
                      </h4>
                      <p className="text-[9px] text-gray-400 mt-0.5">
                        Заказы улетают в iiko терминал. Гости синхронизируются в базу лояльности iiko.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isIikoConfigured && (
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">✓ Настроено</span>
                      )}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={iikoEnabled}
                          onChange={(e) => setIikoEnabled(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-porto-gold"></div>
                      </label>
                    </div>
                  </div>

                  {iikoEnabled && (
                    <div className="space-y-3 bg-black/20 border border-white/5 rounded-xl p-4">
                      {/* API Login */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">
                          API Login <span className="text-gray-500 normal-case">(из iikoWeb → Настройки → Облачные API)</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="myRestaurantLogin"
                            value={iikoApiLogin}
                            onChange={(e) => setIikoApiLogin(e.target.value)}
                            className="flex-1 bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-mono"
                          />
                          <button
                            type="button"
                            onClick={handleTestIikoConnection}
                            disabled={isTestingIiko}
                            className="bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 text-blue-300 font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase cursor-pointer disabled:opacity-50 whitespace-nowrap transition-colors"
                          >
                            {isTestingIiko ? '⏳ Тест...' : '🔌 Тест'}
                          </button>
                        </div>
                      </div>

                      {/* Test result */}
                      {iikoTestResult && (
                        <div className={`p-3 rounded-lg text-[10px] font-medium border ${iikoTestResult.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}>
                          {iikoTestResult.success ? (
                            <div className="space-y-1">
                              <p className="font-bold">✅ Подключение успешно!</p>
                              {iikoTestResult.organizations && iikoTestResult.organizations.length > 0 && (
                                <div>
                                  <p className="text-gray-400">Организации:</p>
                                  {iikoTestResult.organizations.map((org: any) => (
                                    <button
                                      key={org.id}
                                      type="button"
                                      onClick={() => {
                                        setIikoOrganizationId(org.id);
                                        handleLoadIikoTerminalGroups(org.id);
                                      }}
                                      className="block w-full text-left mt-1 px-2 py-1 bg-white/5 hover:bg-white/10 rounded cursor-pointer transition-colors"
                                    >
                                      🏢 <strong>{org.name}</strong> <span className="text-gray-500 font-mono text-[9px]">{org.id}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <p>❌ Ошибка: {iikoTestResult.error}</p>
                          )}
                        </div>
                      )}

                      {/* Organization ID */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">
                          Organization ID <span className="text-gray-500 normal-case">(нажмите на организацию выше или введите вручную)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="00000000-0000-0000-0000-000000000000"
                          value={iikoOrganizationId}
                          onChange={(e) => {
                            setIikoOrganizationId(e.target.value);
                            if (e.target.value.length === 36) handleLoadIikoTerminalGroups(e.target.value);
                          }}
                          className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-mono"
                        />
                      </div>

                      {/* Terminal Group ID */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">Terminal Group ID</label>
                        {iikoTerminalGroups.length > 0 ? (
                          <div className="space-y-1">
                            {iikoTerminalGroups.map((tg: any) => (
                              <button
                                key={tg.id}
                                type="button"
                                onClick={() => setIikoTerminalGroupId(tg.id)}
                                className={`block w-full text-left px-3 py-2 rounded-lg text-[10px] border transition-colors cursor-pointer ${iikoTerminalGroupId === tg.id ? 'bg-porto-gold/20 border-porto-gold/30 text-porto-gold' : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'}`}
                              >
                                🖥️ <strong>{tg.name}</strong> <span className="font-mono text-gray-500 text-[9px]">{tg.id}</span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <input
                            type="text"
                            placeholder="00000000-0000-0000-0000-000000000000"
                            value={iikoTerminalGroupId}
                            onChange={(e) => setIikoTerminalGroupId(e.target.value)}
                            className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-mono"
                          />
                        )}
                      </div>

                      {/* Status summary */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className={`text-[9px] font-bold text-center py-1.5 rounded-lg border ${iikoOrganizationId ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                          {iikoOrganizationId ? '✓ Организация' : '○ Организация не задана'}
                        </div>
                        <div className={`text-[9px] font-bold text-center py-1.5 rounded-lg border ${iikoTerminalGroupId ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                          {iikoTerminalGroupId ? '✓ Терминал' : '○ Терминал не задан'}
                        </div>
                      </div>

                      <div className="text-[9px] text-gray-500 bg-black/20 rounded-lg p-2.5 leading-relaxed">
                        💡 <strong className="text-gray-400">Как подключить:</strong> Войдите в iikoWeb → Настройки → Облачные API → Создать интеграцию → скопируйте API Login сюда → нажмите Тест → выберите организацию и терминал.
                      </div>
                    </div>
                  )}
                </div>

                {/* Waiter Routing List */}
                <div className="space-y-3 border-t border-white/5 pt-4">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase text-porto-gold">Распределение официантов по столам</h4>
                    <p className="text-[9px] text-gray-400">Привяжите конкретных официантов к их столам, чтобы уведомления с этих столов шли напрямую им в чаты</p>
                  </div>

                  {/* Waiters current list */}
                  <div className="space-y-2">
                    {waiters.map((w, idx) => (
                      <div key={idx} className="bg-black/25 border border-white/5 p-3 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <p className="text-white font-bold">{w.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Chat ID: {w.chatId} • Столы: <strong className="text-porto-gold-bright">{w.tables}</strong></p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveWaiterRoute(idx)}
                          className="p-1.5 bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {waiters.length === 0 && (
                      <p className="text-xs text-gray-500 text-center py-2 italic font-medium">Персональные официанты не назначены (все вызовы идут в общий чат вызовов)</p>
                    )}
                  </div>

                  {/* Add Waiter Route Form */}
                  <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-3 text-left">
                    <p className="text-[10px] font-bold uppercase text-porto-gold">Добавить официанта</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">Имя официанта</label>
                        <input
                          type="text"
                          placeholder="Иван"
                          value={newWaiterName}
                          onChange={(e) => setNewWaiterName(e.target.value)}
                          className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">Telegram Chat ID</label>
                        <input
                          type="text"
                          placeholder="184958302"
                          value={newWaiterChatId}
                          onChange={(e) => setNewWaiterChatId(e.target.value)}
                          className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">Столы (e.g. 1-5 или 6,7)</label>
                        <input
                          type="text"
                          placeholder="1-5"
                          value={newWaiterTables}
                          onChange={(e) => setNewWaiterTables(e.target.value)}
                          className="w-full bg-porto-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-porto-gold font-bold"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleAddWaiterRoute}
                        className="bg-porto-gold/20 border border-porto-gold/30 hover:bg-porto-gold/30 text-porto-gold font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase cursor-pointer"
                      >
                        Добавить официанта
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {settingsSuccess && (
                <p className="text-xs text-emerald-400 text-center font-bold animate-pulse">{settingsSuccess}</p>
              )}

              <div className="flex justify-end pt-2 border-t border-white/5">
                <button
                  type="submit"
                  className="bg-porto-gold text-porto-bg font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider hover:bg-porto-gold-bright transition-all cursor-pointer shadow-md"
                >
                  Сохранить настройки
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
