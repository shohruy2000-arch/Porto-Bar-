'use client';

import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Search, 
  ExternalLink, 
  Key, 
  Palette, 
  PauseCircle, 
  PlayCircle, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  Lock, 
  LogOut, 
  Globe, 
  ShoppingBag, 
  Check, 
  X, 
  FileText, 
  Phone, 
  Sparkles,
  Copy,
  Activity,
  Terminal,
  Eye
} from 'lucide-react';
import { TenantRestaurant, SuperAdminStats, ThemePreset } from '../../types';

interface LeadItem {
  id: string;
  name: string;
  phone: string;
  restaurantName: string;
  city: string;
  cuisineType?: string | null;
  preferredStyle?: string | null;
  avgCheck?: number | null;
  comment?: string | null;
  status: 'NEW' | 'IN_PROGRESS' | 'CONVERTED' | 'REJECTED';
  createdAt: string;
}

const THEME_PRESETS: { id: ThemePreset; name: string; primary: string; accent: string; bg: string; desc: string }[] = [
  {
    id: 'luxury-dark',
    name: '👑 Luxury Dark (Золото и Тьма)',
    primary: '#d4af37',
    accent: '#f59e0b',
    bg: '#060a12',
    desc: 'Премиальный темный фон, золото, отельный стиль (как в Porto Bar)'
  },
  {
    id: 'clean-light',
    name: '☀️ Clean Modern (Светлый минимализм)',
    primary: '#2563eb',
    accent: '#3b82f6',
    bg: '#f8fafc',
    desc: 'Светлая, чистая тема для кофеен, пекарен, завтраков'
  },
  {
    id: 'vivid-fast',
    name: '🔥 Fast & Bold (Яркая доставка)',
    primary: '#e11d48',
    accent: '#f97316',
    bg: '#09090b',
    desc: 'Контрастная, сочная тема для пиццы, бургеров и стейков'
  }
];

export default function SuperAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // Tabs: Restaurants vs Leads
  const [activeTab, setActiveTab] = useState<'restaurants' | 'leads'>('restaurants');

  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [restaurants, setRestaurants] = useState<TenantRestaurant[]>([]);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'trial' | 'suspended'>('all');
  const [leadStatusFilter, setLeadStatusFilter] = useState<'ALL' | 'NEW' | 'IN_PROGRESS' | 'CONVERTED' | 'REJECTED'>('ALL');
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<TenantRestaurant | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  // API Key & Profit Monitoring Modal states
  const [apiKeyModalRestaurant, setApiKeyModalRestaurant] = useState<TenantRestaurant | null>(null);
  const [apiKeysList, setApiKeysList] = useState<any[]>([]);
  const [tenantMonitoring, setTenantMonitoring] = useState<any | null>(null);
  const [isLoadingApiKeys, setIsLoadingApiKeys] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(['orders:read', 'orders:write', 'analytics:read']);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedPasswordId, setCopiedPasswordId] = useState<string | null>(null);

  // Form states for creating / editing restaurant
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formLegalName, setFormLegalName] = useState('');
  const [formInn, setFormInn] = useState('');
  const [formDomains, setFormDomains] = useState('');
  const [formPreset, setFormPreset] = useState<ThemePreset>('luxury-dark');
  const [formPrimaryColor, setFormPrimaryColor] = useState('#d4af37');
  const [formAccentColor, setFormAccentColor] = useState('#f59e0b');
  const [formBgColor, setFormBgColor] = useState('#060a12');
  const [formLogoUrl, setFormLogoUrl] = useState('/images/porto-logo.jpg?v=2');
  const [formPlan, setFormPlan] = useState<'starter' | 'business' | 'enterprise'>('business');
  const [formMonthlyPrice, setFormMonthlyPrice] = useState(19900);
  const [formAdminPassword, setFormAdminPassword] = useState('admin123');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('superAdminPin');
    if (savedToken) {
      verifyAndLoad(savedToken);
    }
  }, []);

  const verifyAndLoad = async (pin: string) => {
    setIsLoadingAuth(true);
    setAuthError('');
    try {
      const res = await fetch('/api/super-admin', {
        headers: { 'x-super-admin-auth': pin }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRestaurants(data.restaurants || []);
        setIsAuthenticated(true);
        localStorage.setItem('superAdminPin', pin);
        loadLeads(pin);
      } else {
        setAuthError('Неверный PIN супер-админа');
        localStorage.removeItem('superAdminPin');
      }
    } catch (e) {
      setAuthError('Ошибка сети');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const loadData = async () => {
    const pin = localStorage.getItem('superAdminPin') || pinInput;
    if (!pin) return;
    setIsLoadingData(true);
    try {
      const res = await fetch('/api/super-admin', {
        headers: { 'x-super-admin-auth': pin }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRestaurants(data.restaurants || []);
      }
      await loadLeads(pin);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadLeads = async (pin: string) => {
    try {
      const res = await fetch('/api/leads', {
        headers: { 'x-super-admin-auth': pin }
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
    }
  };

  const handleUpdateLeadStatus = async (id: string, newStatus: string) => {
    const pin = localStorage.getItem('superAdminPin') || pinInput;
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-super-admin-auth': pin
        },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        showToast('Статус заявки обновлен');
        loadLeads(pin);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateFromLead = (lead: LeadItem) => {
    setEditingRestaurant(null);
    setFormName(lead.restaurantName);
    
    // Transliterate / slugify restaurant name
    const slugBase = lead.restaurantName
      .toLowerCase()
      .replace(/[а-я]/g, (c) => {
        const tr: Record<string, string> = {
          а:'a', б:'b', в:'v', г:'g', д:'d', е:'e', ё:'yo', ж:'zh', з:'z', и:'i', й:'y', к:'k', л:'l', м:'m', н:'n', о:'o', п:'p', р:'r', с:'s', т:'t', у:'u', ф:'f', х:'h', ц:'ts', ч:'ch', ш:'sh', щ:'sch', ъ:'', ы:'y', ь:'', э:'e', ю:'yu', я:'ya'
        };
        return tr[c] || c;
      })
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 24) || 'restaurant';

    setFormSlug(slugBase);
    setFormLegalName(lead.restaurantName);
    setFormPhone(lead.phone);
    setFormAddress(lead.city);
    setFormDomains(slugBase + '.starterapp.ru, ' + slugBase);

    // Preset selection
    if (lead.preferredStyle?.includes('Светлый')) {
      setFormPreset('clean-light');
      setFormPrimaryColor('#2563eb');
      setFormAccentColor('#3b82f6');
      setFormBgColor('#f8fafc');
    } else if (lead.preferredStyle?.includes('Яркий')) {
      setFormPreset('vivid-fast');
      setFormPrimaryColor('#e11d48');
      setFormAccentColor('#f97316');
      setFormBgColor('#09090b');
    } else {
      setFormPreset('luxury-dark');
      setFormPrimaryColor('#d4af37');
      setFormAccentColor('#f59e0b');
      setFormBgColor('#060a12');
    }

    setActiveTab('restaurants');
    setIsCreateModalOpen(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;
    verifyAndLoad(pinInput.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem('superAdminPin');
    setIsAuthenticated(false);
    setPinInput('');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const openApiKeyModal = async (restaurant: TenantRestaurant) => {
    setApiKeyModalRestaurant(restaurant);
    setNewKeyName('');
    setIsLoadingApiKeys(true);
    setTenantMonitoring(null);
    setApiKeysList([]);
    const pin = localStorage.getItem('superAdminPin') || pinInput;
    try {
      const res = await fetch('/api/super-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-super-admin-auth': pin },
        body: JSON.stringify({
          action: 'getTenantMonitoring',
          pin,
          data: { tenantId: restaurant.id }
        })
      });
      if (res.ok) {
        const json = await res.json();
        setTenantMonitoring(json.monitoring || null);
        setApiKeysList(json.monitoring?.apiKeys || []);
      }
    } catch (e) {
      console.error('Failed to load tenant monitoring & api keys:', e);
    } finally {
      setIsLoadingApiKeys(false);
    }
  };

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyModalRestaurant) return;
    const pin = localStorage.getItem('superAdminPin') || pinInput;
    try {
      const res = await fetch('/api/super-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-super-admin-auth': pin },
        body: JSON.stringify({
          action: 'createApiKey',
          pin,
          data: {
            tenantId: apiKeyModalRestaurant.id,
            name: newKeyName.trim() || 'Интеграционный ключ',
            permissions: newKeyPermissions
          }
        })
      });
      if (res.ok) {
        const json = await res.json();
        setApiKeysList(prev => [json.apiKey, ...prev]);
        setNewKeyName('');
        showToast('✓ Новый API-ключ успешно сгенерирован!');
      }
    } catch (e) {
      console.error('Failed to create API key:', e);
      showToast('Ошибка при генерации ключа');
    }
  };

  const handleRevokeApiKey = async (keyId: string) => {
    if (!confirm('Вы уверены, что хотите отозвать этот API-ключ? Все внешние интеграции по нему перестанут работать.')) return;
    const pin = localStorage.getItem('superAdminPin') || pinInput;
    try {
      const res = await fetch('/api/super-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-super-admin-auth': pin },
        body: JSON.stringify({
          action: 'revokeApiKey',
          pin,
          data: { keyId }
        })
      });
      if (res.ok) {
        setApiKeysList(prev => prev.filter(k => k.id !== keyId));
        showToast('API-ключ успешно отозван');
      }
    } catch (e) {
      console.error('Failed to revoke API key:', e);
    }
  };

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    showToast('✓ API-ключ скопирован в буфер обмена');
    setTimeout(() => setCopiedKeyId(null), 2500);
  };

  const handleCopyCurl = (key: string) => {
    const curl = `curl -X GET "http://localhost:3000/api/v1/monitoring" \\\n  -H "x-api-key: ${key}"`;
    navigator.clipboard.writeText(curl);
    setCopiedCurl(true);
    showToast('✓ cURL-запрос скопирован');
    setTimeout(() => setCopiedCurl(false), 2500);
  };

  const handleCopyPassword = (pass: string, id: string) => {
    navigator.clipboard.writeText(pass);
    setCopiedPasswordId(id);
    showToast('✓ Пароль админки скопирован в буфер обмена');
    setTimeout(() => setCopiedPasswordId(null), 2500);
  };

  const handlePresetSelect = (presetId: ThemePreset) => {
    setFormPreset(presetId);
    const found = THEME_PRESETS.find(p => p.id === presetId);
    if (found) {
      setFormPrimaryColor(found.primary);
      setFormAccentColor(found.accent);
      setFormBgColor(found.bg);
    }
  };

  const openCreateModal = () => {
    setEditingRestaurant(null);
    setFormName('');
    setFormSlug('');
    setFormLegalName('');
    setFormInn('');
    setFormDomains('');
    setFormPreset('luxury-dark');
    setFormPrimaryColor('#d4af37');
    setFormAccentColor('#f59e0b');
    setFormBgColor('#060a12');
    setFormLogoUrl('/images/porto-logo.jpg?v=2');
    setFormPlan('business');
    setFormMonthlyPrice(19900);
    setFormAdminPassword('admin123');
    setFormPhone('');
    setFormAddress('');
    setIsCreateModalOpen(true);
  };

  const openEditModal = (r: TenantRestaurant) => {
    setEditingRestaurant(r);
    setFormName(r.name);
    setFormSlug(r.slug);
    setFormLegalName(r.legalName || '');
    setFormInn(r.inn || '');
    setFormDomains(r.domains ? r.domains.join(', ') : '');
    setFormPreset(r.theme?.preset || 'luxury-dark');
    setFormPrimaryColor(r.theme?.primaryColor || '#d4af37');
    setFormAccentColor(r.theme?.accentColor || '#f59e0b');
    setFormBgColor(r.theme?.bgColor || '#060a12');
    setFormLogoUrl(r.theme?.logoUrl || '/images/porto-logo.jpg?v=2');
    setFormPlan(r.plan || 'business');
    setFormMonthlyPrice(r.monthlyPrice || 19900);
    setFormAdminPassword(r.adminPassword || 'admin123');
    setFormPhone(r.contacts?.phone || '');
    setFormAddress(r.contacts?.address || '');
    setIsCreateModalOpen(true);
  };

  const handleSaveRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    const pin = localStorage.getItem('superAdminPin') || pinInput;
    if (!pin) return;

    if (!formName.trim() || !formSlug.trim()) {
      alert('Заполните название и слаг заведения');
      return;
    }

    const domainList = formDomains
      .split(',')
      .map(d => d.trim().toLowerCase())
      .filter(Boolean);

    if (!domainList.includes(formSlug.toLowerCase().trim())) {
      domainList.push(formSlug.toLowerCase().trim());
    }

    const payload = {
      name: formName.trim(),
      slug: formSlug.toLowerCase().trim(),
      legalName: formLegalName.trim(),
      inn: formInn.trim(),
      domains: domainList,
      theme: {
        preset: formPreset,
        primaryColor: formPrimaryColor,
        primaryLightColor: formPrimaryColor + 'cc',
        primaryDarkColor: formPrimaryColor,
        accentColor: formAccentColor,
        bgColor: formBgColor,
        bgCardColor: formBgColor === '#ffffff' || formBgColor === '#f8fafc' ? '#ffffff' : '#0d131f',
        textColor: formBgColor === '#ffffff' || formBgColor === '#f8fafc' ? '#0f172a' : '#f3f4f6',
        logoUrl: formLogoUrl.trim() || '/images/porto-logo.jpg?v=2'
      },
      plan: formPlan,
      monthlyPrice: Number(formMonthlyPrice) || 19900,
      adminPassword: formAdminPassword.trim() || 'admin123',
      contacts: {
        phone: formPhone.trim(),
        address: formAddress.trim()
      }
    };

    try {
      if (editingRestaurant) {
        const res = await fetch('/api/super-admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-super-admin-auth': pin
          },
          body: JSON.stringify({
            action: 'updateRestaurant',
            data: {
              id: editingRestaurant.id,
              updatedFields: payload
            }
          })
        });
        if (res.ok) {
          showToast('Ресторан «' + formName + '» успешно обновлен!');
          setIsCreateModalOpen(false);
          loadData();
        } else {
          const err = await res.json().catch(() => ({}));
          alert(err.error || 'Ошибка при обновлении');
        }
      } else {
        const res = await fetch('/api/super-admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-super-admin-auth': pin
          },
          body: JSON.stringify({
            action: 'createRestaurant',
            data: payload
          })
        });
        if (res.ok) {
          showToast('🎉 Ресторан «' + formName + '» успешно создан и готов к работе!');
          setIsCreateModalOpen(false);
          loadData();
        } else {
          const err = await res.json().catch(() => ({}));
          alert(err.error || 'Ошибка при создании');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Сетевая ошибка');
    }
  };

  const handleToggleStatus = async (r: TenantRestaurant) => {
    const newStatus = r.status === 'active' ? 'suspended' : 'active';
    const pin = localStorage.getItem('superAdminPin') || pinInput;
    try {
      const res = await fetch('/api/super-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-super-admin-auth': pin
        },
        body: JSON.stringify({
          action: 'updateStatus',
          data: { id: r.id, status: newStatus }
        })
      });
      if (res.ok) {
        showToast('Статус ресторана «' + r.name + '» изменен на: ' + (newStatus === 'active' ? 'АКТИВЕН' : 'ЗАБЛОКИРОВАН'));
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteRestaurant = async (r: TenantRestaurant) => {
    if (r.id === 'porto-bar') {
      alert('Основной ресторан Porto Bar защищен от удаления.');
      return;
    }
    if (!confirm('Вы действительно хотите безвозвратно удалить «' + r.name + '»?')) return;

    const pin = localStorage.getItem('superAdminPin') || pinInput;
    try {
      const res = await fetch('/api/super-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-super-admin-auth': pin
        },
        body: JSON.stringify({
          action: 'deleteRestaurant',
          data: { id: r.id }
        })
      });
      if (res.ok) {
        showToast('Ресторан «' + r.name + '» удален.');
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const newLeadsCount = leads.filter(l => l.status === 'NEW').length;

  const filteredRestaurants = restaurants.filter(r => {
    const query = searchQuery.toLowerCase().trim();
    const matchQuery = !query || 
      r.name.toLowerCase().includes(query) || 
      r.slug.toLowerCase().includes(query) || 
      (r.domains && r.domains.some(d => d.toLowerCase().includes(query)));
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchQuery && matchStatus;
  });

  const filteredLeads = leads.filter(l => {
    const matchStatus = leadStatusFilter === 'ALL' || l.status === leadStatusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchQuery = !query || 
      l.restaurantName.toLowerCase().includes(query) || 
      l.name.toLowerCase().includes(query) || 
      l.phone.includes(query) || 
      l.city.toLowerCase().includes(query);
    return matchStatus && matchQuery;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060a12] flex items-center justify-center p-4 selection:bg-amber-500 selection:text-black">
        <div className="w-full max-w-md bg-[#0d131f] border border-amber-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(212,175,55,0.15)] text-center space-y-6">
          <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/30 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
            <Crown className="w-10 h-10 text-amber-400 animate-pulse" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-black uppercase tracking-wider text-white">
              👑 Master Super Admin
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Единый центр управления ресторанами, тарифами и заявками
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div className="relative">
              <input
                type="password"
                placeholder="Введите PIN супер-админа"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full bg-[#060a12] border border-white/15 focus:border-amber-400 rounded-xl py-3.5 px-4 text-center text-lg font-mono text-white tracking-[0.3em] focus:outline-none transition-all shadow-inner"
                autoFocus
              />
              <Lock className="w-4 h-4 text-gray-500 absolute left-4 top-4" />
            </div>

            {authError && (
              <p className="text-xs text-red-400 font-medium">{authError}</p>
            )}

            <button
              type="submit"
              disabled={isLoadingAuth}
              className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 text-black font-black py-3.5 rounded-xl uppercase tracking-wider text-xs shadow-lg hover:shadow-amber-500/25 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoadingAuth ? 'Проверка...' : 'Войти в панель платформы'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060a12] text-gray-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-amber-500 text-black px-5 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-[#0d131f]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center">
            <Crown className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                GetMenu Platform
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                MASTER SUPER ADMIN
              </span>
            </div>
            <p className="text-[10px] text-gray-400 hidden sm:block">
              Управление клиентами, заявками, базами данных и эквайрингом
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={loadData}
            disabled={isLoadingData}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-all cursor-pointer"
            title="Обновить данные"
          >
            <RefreshCw className={'w-4 h-4 ' + (isLoadingData ? 'animate-spin' : '')} />
          </button>

          <button
            onClick={openCreateModal}
            className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 text-black font-black px-3 sm:px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center space-x-1.5 hover:scale-[1.02] active:scale-95 transition-all shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3] shrink-0" />
            <span className="hidden sm:inline">Создать ресторан</span>
            <span className="sm:hidden">Создать</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all cursor-pointer"
            title="Выйти"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-[#0d131f] border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Всего заведений</span>
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-white">{stats?.totalRestaurants || restaurants.length}</span>
              <span className="text-xs text-emerald-400 font-bold">({stats?.activeRestaurants || restaurants.length} активны)</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">Подключено к платформе</p>
          </div>

          <div className="bg-[#0d131f] border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Новых заявок</span>
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-emerald-400">{newLeadsCount}</span>
              <span className="text-xs text-gray-400 font-medium">({leads.length} всего)</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">С главного лендинга</p>
          </div>

          <div className="bg-[#0d131f] border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Заказов оформлено</span>
              <ShoppingBag className="w-5 h-5 text-blue-400" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-blue-400">{stats?.totalOrdersMonth || 340}</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">Через PWA-витрины ресторанов</p>
          </div>

          <div className="bg-[#0d131f] border border-amber-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden group bg-gradient-to-br from-amber-500/5 to-transparent">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-amber-300 tracking-wider">Доход подписок (MRR)</span>
              <DollarSign className="w-5 h-5 text-amber-400" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-amber-300">
                {(stats?.monthlyRevenue || 19900).toLocaleString('ru-RU')} ₽ <span className="text-xs font-normal text-gray-400">/ мес</span>
              </span>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">Регулярная выручка платформы</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-3 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={'flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ' + (
              activeTab === 'restaurants'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            )}
          >
            <Building2 className="w-4 h-4" />
            <span>Рестораны платформы ({restaurants.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={'relative flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ' + (
              activeTab === 'leads'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            )}
          >
            <FileText className="w-4 h-4" />
            <span>Заявки с лендинга ({leads.length})</span>
            {newLeadsCount > 0 && (
              <span className="ml-1.5 px-2 py-0.5 text-[10px] rounded-full bg-red-500 text-white font-black animate-pulse">
                {newLeadsCount}
              </span>
            )}
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0d131f] border border-white/10 p-4 rounded-2xl shadow-md">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder={activeTab === 'restaurants' ? 'Поиск по названию, домену, слагу...' : 'Поиск по заведению, имени, телефону...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#060a12] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {activeTab === 'restaurants' ? (
            <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
              {(['all', 'active', 'trial', 'suspended'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={'text-xs px-3.5 py-2 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ' + (
                    statusFilter === st
                      ? 'bg-amber-500 text-black font-black shadow-md'
                      : 'bg-[#060a12] text-gray-400 hover:text-white border border-white/5'
                  )}
                >
                  {st === 'all' && 'Все'}
                  {st === 'active' && 'Активные'}
                  {st === 'trial' && 'Триал'}
                  {st === 'suspended' && 'Заблокированы'}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
              {(['ALL', 'NEW', 'IN_PROGRESS', 'CONVERTED', 'REJECTED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setLeadStatusFilter(st)}
                  className={'text-xs px-3.5 py-2 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ' + (
                    leadStatusFilter === st
                      ? 'bg-amber-500 text-black font-black shadow-md'
                      : 'bg-[#060a12] text-gray-400 hover:text-white border border-white/5'
                  )}
                >
                  {st === 'ALL' && 'Все заявки'}
                  {st === 'NEW' && '🔥 Новые'}
                  {st === 'IN_PROGRESS' && 'В работе'}
                  {st === 'CONVERTED' && '✓ Запущены'}
                  {st === 'REJECTED' && 'Отказ'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* TAB 1: RESTAURANTS LIST */}
        {activeTab === 'restaurants' && (
          <div className="space-y-4">
            {filteredRestaurants.length === 0 ? (
              <div className="bg-[#0d131f] border border-white/10 rounded-2xl p-12 text-center text-gray-500">
                <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-400" />
                <p className="text-sm font-bold text-gray-400">Рестораны не найдены</p>
                <p className="text-xs mt-1">Попробуйте изменить запрос или создайте новое заведение.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRestaurants.map((r) => {
                  const pwaUrl = '/r/' + r.slug;
                  const adminUrl = '/admin?tenant=' + r.slug;

                  return (
                    <div 
                      key={r.id}
                      className="bg-[#0d131f] border border-white/10 rounded-2xl p-5 shadow-lg space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg border border-white/15 shrink-0 shadow-md"
                              style={{ backgroundColor: r.theme?.bgColor || '#060a12' }}
                            >
                              <span style={{ color: r.theme?.primaryColor || '#d4af37' }}>
                                {r.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-white text-base">{r.name}</h3>
                                {r.id === 'porto-bar' && (
                                  <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                                    CORE
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 font-mono font-medium">/{r.slug}</p>
                            </div>
                          </div>

                          <div>
                            {r.status === 'active' && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                                Активен
                              </span>
                            )}
                            {r.status === 'trial' && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
                                Триал
                              </span>
                            )}
                            {r.status === 'suspended' && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30 uppercase tracking-wider">
                                Заблокирован
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                          <div className="bg-[#060a12] p-2.5 rounded-xl border border-white/5">
                            <span className="text-[10px] text-gray-500 uppercase block font-bold">Тариф</span>
                            <span className="font-bold text-amber-300 capitalize">{r.plan || 'Business'} ({r.monthlyPrice || 19900} ₽)</span>
                          </div>
                          <div className="bg-[#060a12] p-2.5 rounded-xl border border-white/5 flex items-center justify-between gap-2 overflow-hidden">
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] text-gray-500 uppercase block font-bold">Пароль /admin</span>
                              <span className="font-mono text-gray-200 text-xs block truncate" title={r.adminPassword || 'admin123'}>
                                {r.adminPassword?.startsWith('$2') ? '•••••••• (Хэш)' : (r.adminPassword || 'admin123')}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyPassword(r.adminPassword || 'admin123', r.id);
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-amber-300 transition-all shrink-0 cursor-pointer"
                              title="Скопировать пароль админки"
                            >
                              {copiedPasswordId === r.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Domains */}
                        {r.domains && r.domains.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {r.domains.map((dom, i) => (
                              <span key={i} className="text-[10px] bg-white/5 text-gray-300 px-2 py-0.5 rounded-lg border border-white/5 font-mono">
                                🌐 {dom}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center justify-between pt-3 border-t border-white/10 gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <a
                            href={pwaUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center space-x-1 border border-amber-500/20 transition-all"
                          >
                            <span>Витрина</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <a
                            href={adminUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs font-bold flex items-center space-x-1 border border-blue-500/20 transition-all"
                          >
                            <span>Админка</span>
                            <Key className="w-3 h-3" />
                          </a>

                          <button
                            onClick={() => openApiKeyModal(r)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center space-x-1 border border-emerald-500/20 transition-all cursor-pointer"
                            title="Управление API-ключами и мониторинг выручки"
                          >
                            <Activity className="w-3 h-3" />
                            <span>API & Мониторинг</span>
                          </button>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => openEditModal(r)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-all cursor-pointer"
                            title="Редактировать"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(r)}
                            className={'p-2 rounded-lg transition-all cursor-pointer ' + (
                              r.status === 'active' 
                                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400' 
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                            )}
                            title={r.status === 'active' ? 'Приостановить' : 'Активировать'}
                          >
                            {r.status === 'active' ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                          </button>

                          {r.id !== 'porto-bar' && (
                            <button
                              onClick={() => handleDeleteRestaurant(r)}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer"
                              title="Удалить"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LEADS LIST */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            {filteredLeads.length === 0 ? (
              <div className="bg-[#0d131f] border border-white/10 rounded-2xl p-12 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-400" />
                <p className="text-sm font-bold text-gray-400">Заявки не найдены</p>
                <p className="text-xs mt-1">Новые заявки с лендинга появятся здесь автоматически.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLeads.map((lead) => {
                  return (
                    <div 
                      key={lead.id}
                      className="bg-[#0d131f] border border-white/10 rounded-2xl p-5 shadow-lg hover:border-amber-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-white text-base">
                            «{lead.restaurantName}»
                          </h3>
                          <span className="text-xs text-gray-400">• {lead.city}</span>
                          
                          {/* Status Badge */}
                          {lead.status === 'NEW' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-wider animate-pulse">
                              🔥 Новая заявка
                            </span>
                          )}
                          {lead.status === 'IN_PROGRESS' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                              В обработке
                            </span>
                          )}
                          {lead.status === 'CONVERTED' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                              ✓ Создан ресторан
                            </span>
                          )}
                          {lead.status === 'REJECTED' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-700 text-gray-300 uppercase tracking-wider">
                              Отказ
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300">
                          <span className="flex items-center space-x-1.5 font-semibold text-amber-300">
                            <Phone className="w-3.5 h-3.5" />
                            <a href={'tel:' + lead.phone} className="hover:underline">{lead.phone}</a>
                          </span>
                          <span>Контактное лицо: <b>{lead.name}</b></span>
                          {lead.cuisineType && <span>Кухня: <b>{lead.cuisineType}</b></span>}
                          {lead.preferredStyle && <span>Стиль: <b>{lead.preferredStyle}</b></span>}
                          {lead.avgCheck && <span>Чек: <b>{lead.avgCheck} ₽</b></span>}
                        </div>

                        {lead.comment && (
                          <div className="bg-[#060a12] p-2.5 rounded-xl border border-white/5 text-xs text-gray-400">
                            <span className="text-gray-500 font-bold">Комментарий: </span>
                            {lead.comment}
                          </div>
                        )}

                        <p className="text-[10px] text-gray-500">
                          Дата заявки: {new Date(lead.createdAt).toLocaleString('ru-RU')}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {/* Quick Status Change */}
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                          className="bg-[#060a12] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="NEW">Новая</option>
                          <option value="IN_PROGRESS">В обработке</option>
                          <option value="CONVERTED">Запущен (Создан)</option>
                          <option value="REJECTED">Отклонен</option>
                        </select>

                        {/* Create Restaurant Button */}
                        <button
                          onClick={() => handleCreateFromLead(lead)}
                          className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Создать ресторан</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* CREATE / EDIT RESTAURANT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0d131f] border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase text-white">
                    {editingRestaurant ? 'Редактировать заведение' : 'Создать новое заведение'}
                  </h3>
                  <p className="text-[10px] text-gray-400">
                    Автоматическая изоляция базы данных, создание меню и доменов
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRestaurant} className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-amber-400 flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>1. Основные параметры и идентификация</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-300 uppercase">Название ресторана *</label>
                    <input
                      type="text"
                      placeholder="Steak & Wine"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-[#060a12] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-300 uppercase">Слаг / URL идентификатор *</label>
                    <input
                      type="text"
                      placeholder="steak-wine"
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      disabled={!!editingRestaurant && editingRestaurant.id === 'porto-bar'}
                      className="w-full bg-[#060a12] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono disabled:opacity-50"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-300 uppercase">Телефон заведения</label>
                    <input
                      type="text"
                      placeholder="+7 (495) 000-00-00"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full bg-[#060a12] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-300 uppercase">Город / Адрес</label>
                    <input
                      type="text"
                      placeholder="Москва, ул. Тверская 12"
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      className="w-full bg-[#060a12] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-bold text-gray-300 uppercase">Домены и поддомены (через запятую)</label>
                    <input
                      type="text"
                      placeholder="steak.starterapp.ru, steakhouse.ru, steak"
                      value={formDomains}
                      onChange={(e) => setFormDomains(e.target.value)}
                      className="w-full bg-[#060a12] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Theme Settings */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <h4 className="text-xs font-bold uppercase text-amber-400 flex items-center space-x-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  <span>2. Брендинг и стилистика</span>
                </h4>

                <div className="grid grid-cols-3 gap-2">
                  {THEME_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePresetSelect(p.id)}
                      className={'p-2.5 rounded-xl border text-left transition-all cursor-pointer ' + (
                        formPreset === p.id 
                          ? 'border-amber-400 bg-amber-500/10 shadow-md' 
                          : 'border-white/10 bg-[#060a12] hover:border-white/20'
                      )}
                    >
                      <p className="text-[11px] font-bold text-white truncate">{p.name}</p>
                      <div className="flex items-center space-x-1 mt-1.5">
                        <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: p.primary }} />
                        <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: p.accent }} />
                        <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: p.bg }} />
                      </div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-300 uppercase">Основной цвет (Primary)</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={formPrimaryColor}
                        onChange={(e) => setFormPrimaryColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={formPrimaryColor}
                        onChange={(e) => setFormPrimaryColor(e.target.value)}
                        className="w-full bg-[#060a12] border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-300 uppercase">Акцентный цвет (Accent)</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={formAccentColor}
                        onChange={(e) => setFormAccentColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={formAccentColor}
                        onChange={(e) => setFormAccentColor(e.target.value)}
                        className="w-full bg-[#060a12] border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-300 uppercase">Цвет фона (Background)</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={formBgColor}
                        onChange={(e) => setFormBgColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={formBgColor}
                        onChange={(e) => setFormBgColor(e.target.value)}
                        className="w-full bg-[#060a12] border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Plan & Pricing */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <h4 className="text-xs font-bold uppercase text-amber-400 flex items-center space-x-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>3. Тариф и доступ управляющего</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-300 uppercase">Тарифный план</label>
                    <select
                      value={formPlan}
                      onChange={(e: any) => setFormPlan(e.target.value)}
                      className="w-full bg-[#060a12] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                    >
                      <option value="starter">Starter (9 900 ₽)</option>
                      <option value="business">Business (19 900 ₽)</option>
                      <option value="enterprise">Enterprise (По запросу)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-300 uppercase">Стоимость (₽ / мес)</label>
                    <input
                      type="number"
                      value={formMonthlyPrice}
                      onChange={(e) => setFormMonthlyPrice(Number(e.target.value))}
                      className="w-full bg-[#060a12] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-300 uppercase">Пароль в /admin</label>
                    <input
                      type="text"
                      value={formAdminPassword}
                      onChange={(e) => setFormAdminPassword(e.target.value)}
                      className="w-full bg-[#060a12] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white font-mono font-bold"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Отмена
                </button>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 text-black font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-all shadow-xl cursor-pointer"
                >
                  {editingRestaurant ? 'Сохранить изменения' : '🚀 Создать заведение'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── API Keys & Live Monitoring Modal ── */}
      {apiKeyModalRestaurant && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0d131f] border border-white/15 rounded-3xl p-6 max-w-3xl w-full shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-white">{apiKeyModalRestaurant.name}</h3>
                    <span className="text-[10px] bg-white/10 text-gray-300 font-mono px-2 py-0.5 rounded">
                      /{apiKeyModalRestaurant.slug}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Управление API-ключами и аналитика выручки (97% ресторан / 3% платформа)</p>
                </div>
              </div>

              <button
                onClick={() => setApiKeyModalRestaurant(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Financial Overview Cards */}
            {isLoadingApiKeys ? (
              <div className="py-8 text-center text-gray-400 flex items-center justify-center space-x-2">
                <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                <span>Загрузка данных мониторинга...</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#060a12] border border-white/5 rounded-2xl p-3.5">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Оборот (GMV)</span>
                    <span className="text-lg font-black text-white">
                      {(tenantMonitoring?.totalGmv || 0).toLocaleString('ru-RU')} ₽
                    </span>
                  </div>

                  <div className="bg-[#060a12] border border-amber-500/20 rounded-2xl p-3.5 bg-amber-500/5">
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">Комиссия (3%)</span>
                    <span className="text-lg font-black text-amber-300">
                      {(tenantMonitoring?.platformFee || 0).toLocaleString('ru-RU')} ₽
                    </span>
                  </div>

                  <div className="bg-[#060a12] border border-emerald-500/20 rounded-2xl p-3.5 bg-emerald-500/5">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block">Прибыль (97%)</span>
                    <span className="text-lg font-black text-emerald-300">
                      {(tenantMonitoring?.restaurantProfit || 0).toLocaleString('ru-RU')} ₽
                    </span>
                  </div>

                  <div className="bg-[#060a12] border border-white/5 rounded-2xl p-3.5">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Заказов всего</span>
                    <span className="text-lg font-black text-blue-400">
                      {tenantMonitoring?.totalOrders || 0}
                    </span>
                  </div>
                </div>

                {/* API Keys List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase text-gray-300 tracking-wider flex items-center space-x-1.5">
                      <Key className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Выпущенные API-ключи ({apiKeysList.length})</span>
                    </h4>
                  </div>

                  {apiKeysList.length === 0 ? (
                    <div className="p-4 rounded-xl bg-[#060a12] border border-white/5 text-center text-xs text-gray-500">
                      Для этого заведения еще не создано API-ключей. Сгенерируйте первый ключ ниже.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {apiKeysList.map((k) => (
                        <div
                          key={k.id}
                          className="bg-[#060a12] border border-white/10 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-white">{k.name}</span>
                              <span className={'text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ' + (k.isActive ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/15 text-red-400')}>
                                {k.isActive ? 'Активен' : 'Отозван'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <code className="text-xs font-mono text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-white/5 truncate max-w-xs sm:max-w-md">
                                {k.key}
                              </code>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              {(k.permissions || []).map((p: string, pi: number) => (
                                <span key={pi} className="text-[9px] bg-white/5 text-gray-400 px-1.5 py-0.5 rounded font-mono">
                                  {p}
                                </span>
                              ))}
                              {k.lastUsedAt && (
                                <span className="text-[9px] text-gray-500">
                                  · Использован: {new Date(k.lastUsedAt).toLocaleDateString('ru-RU')}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <button
                              onClick={() => handleCopyKey(k.key, k.id)}
                              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 flex items-center space-x-1.5 border border-white/10 transition-all cursor-pointer"
                              title="Скопировать ключ"
                            >
                              {copiedKeyId === k.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">Скопирован</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Скопировать</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleRevokeApiKey(k.id)}
                              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                              title="Отозвать ключ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Create New Key Inline Form */}
                  <form onSubmit={handleCreateApiKey} className="bg-[#060a12] border border-dashed border-white/15 rounded-2xl p-4 space-y-3 mt-3">
                    <h5 className="text-[11px] font-bold uppercase text-gray-400">Выпустить новый API-ключ</h5>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        placeholder="Название интеграции (например, iiko / МойСклад / Telegram бот)"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        className="flex-1 bg-[#0d131f] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer shrink-0 shadow-lg"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Сгенерировать</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* cURL API Integration Snippet */}
                {apiKeysList.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-bold uppercase text-gray-400 flex items-center space-x-1.5">
                        <Terminal className="w-3.5 h-3.5 text-blue-400" />
                        <span>Внешний API Мониторинга (HTTP cURL)</span>
                      </h4>
                      <button
                        onClick={() => handleCopyCurl(apiKeysList[0].key)}
                        className="text-[10px] font-bold text-amber-400 hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedCurl ? 'Скопировано!' : 'Копировать cURL'}</span>
                      </button>
                    </div>
                    <pre className="bg-[#060a12] border border-white/10 rounded-xl p-3 text-[11px] font-mono text-gray-300 overflow-x-auto">
                      {`curl -X GET "http://localhost:3000/api/v1/monitoring" \\\n  -H "x-api-key: ${apiKeysList[0].key}"`}
                    </pre>
                  </div>
                )}

                {/* Recent 10 Orders Table */}
                {tenantMonitoring?.recentOrders && tenantMonitoring.recentOrders.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <h4 className="text-[11px] font-bold uppercase text-gray-400 flex items-center space-x-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                      <span>Последние заказы заведения</span>
                    </h4>
                    <div className="overflow-x-auto rounded-xl border border-white/10">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#060a12] text-gray-400 uppercase text-[9px] border-b border-white/10">
                          <tr>
                            <th className="p-2.5">№ Заказа</th>
                            <th className="p-2.5">Гость</th>
                            <th className="p-2.5">Сумма</th>
                            <th className="p-2.5 text-amber-400">Комиссия 3%</th>
                            <th className="p-2.5 text-emerald-400">Выручка 97%</th>
                            <th className="p-2.5">Статус</th>
                            <th className="p-2.5">Время</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-[#0d131f]">
                          {tenantMonitoring.recentOrders.map((o: any) => (
                            <tr key={o.id} className="hover:bg-white/5">
                              <td className="p-2.5 font-mono font-bold text-white">#{o.orderNumber}</td>
                              <td className="p-2.5 text-gray-300">{o.guestName || o.phone || 'Гость'}</td>
                              <td className="p-2.5 font-bold text-white">{Number(o.totalAmount)} ₽</td>
                              <td className="p-2.5 font-mono text-amber-400">{Number(o.platformFeeAmount || 0)} ₽</td>
                              <td className="p-2.5 font-mono text-emerald-400 font-bold">{Number(o.restaurantEarnings || 0)} ₽</td>
                              <td className="p-2.5">
                                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                                  {o.status}
                                </span>
                              </td>
                              <td className="p-2.5 text-[10px] text-gray-500">
                                {new Date(o.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-end pt-3 border-t border-white/10">
              <button
                onClick={() => setApiKeyModalRestaurant(null)}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

