'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TenantRestaurant, TenantTheme } from '../types';

const DEFAULT_THEME: TenantTheme = {
  preset: 'luxury-dark',
  primaryColor: '#d4af37',
  primaryLightColor: '#f5e6a8',
  primaryDarkColor: '#aa8010',
  accentColor: '#f59e0b',
  bgColor: '#060a12',
  bgCardColor: '#0d131f',
  textColor: '#f3f4f6',
  logoUrl: '/images/porto-logo.jpg?v=2',
  faviconUrl: '/images/porto-app-icon-192.png',
  fontFamily: 'var(--font-geist-sans)'
};

const DEFAULT_TENANT: TenantRestaurant = {
  id: 'porto-bar',
  slug: 'porto',
  name: 'Porto Bar',
  legalName: 'ООО «Движение ВВЕРХ И ВПЕРЕД»',
  inn: '9729304162',
  ogrn: '1217700021912',
  domains: ['localhost', 'portobar.ru'],
  theme: DEFAULT_THEME,
  status: 'active',
  plan: 'enterprise',
  adminPassword: 'porto',
  createdAt: '2026-01-01T00:00:00.000Z',
  contacts: {
    phone: '+7 968 000 22 27',
    email: 'info@porto-bar.ru',
    address: 'Ленинский проспект, 146, Москва (Отель Аструс, 1 этаж)'
  }
};

interface TenantContextType {
  tenant: TenantRestaurant;
  theme: TenantTheme;
  isLoading: boolean;
  setTenant: (tenant: TenantRestaurant) => void;
}

const TenantContext = createContext<TenantContextType>({
  tenant: DEFAULT_TENANT,
  theme: DEFAULT_THEME,
  isLoading: false,
  setTenant: () => {}
});

export const TenantProvider: React.FC<{
  children: React.ReactNode;
  initialTenant?: TenantRestaurant;
}> = ({ children, initialTenant }) => {
  const [tenant, setTenant] = useState<TenantRestaurant>(initialTenant || DEFAULT_TENANT);
  const [isLoading, setIsLoading] = useState<boolean>(!initialTenant);

  useEffect(() => {
    if (initialTenant) {
      setTenant(initialTenant);
      setIsLoading(false);
      return;
    }

    const fetchTenant = async () => {
      try {
        // Detect tenant from query param or hostname
        const urlParams = new URLSearchParams(window.location.search);
        const tenantQuery = urlParams.get('tenant');
        
        const endpoint = tenantQuery 
          ? `/api/config?tenant=${encodeURIComponent(tenantQuery)}`
          : '/api/config';
          
        const res = await fetch(endpoint);
        if (res.ok) {
          const configData = await res.json();
          if (configData.tenant) {
            setTenant(configData.tenant);
          }
        }
      } catch (err) {
        console.error('Failed to load tenant info:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenant();
  }, [initialTenant]);

  const currentTheme = tenant.theme || DEFAULT_THEME;

  // Apply CSS custom properties dynamically to document root
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const primary = currentTheme.primaryColor;
      const primaryLight = currentTheme.primaryLightColor || primary;
      const primaryDark = currentTheme.primaryDarkColor || primary;
      
      // Core colors used by Tailwind @theme via var()
      root.style.setProperty('--porto-primary', primary);
      root.style.setProperty('--porto-gold', primary);
      root.style.setProperty('--porto-gold-bright', primaryLight);
      root.style.setProperty('--porto-gold-dark', primaryDark);
      root.style.setProperty('--porto-accent', currentTheme.accentColor);
      root.style.setProperty('--porto-bg', currentTheme.bgColor);
      root.style.setProperty('--porto-card', currentTheme.bgCardColor);
      root.style.setProperty('--porto-text', currentTheme.textColor);
      
      // Border colors derived from primary
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '197, 168, 128';
      };
      const primaryRgb = hexToRgb(primary);
      root.style.setProperty('--porto-border', `rgba(${primaryRgb}, 0.28)`);
      root.style.setProperty('--porto-border-hover', `rgba(${primaryRgb}, 0.55)`);
      
      // Update background and foreground
      root.style.setProperty('--background', currentTheme.bgColor);
      root.style.setProperty('--foreground', currentTheme.textColor);
      document.body.style.backgroundColor = currentTheme.bgColor;
    }
  }, [currentTheme]);

  return (
    <TenantContext.Provider value={{ tenant, theme: currentTheme, isLoading, setTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
