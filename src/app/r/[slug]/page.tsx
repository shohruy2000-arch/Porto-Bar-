/**
 * @file src/app/r/[slug]/page.tsx
 * @description Dedicated multi-tenant restaurant PWA route (e.g. /r/porto-bar, /r/steak-wine).
 */

import { notFound } from 'next/navigation';
import { getTenantRepository, getMenuRepository } from '../../../lib/serverContext';
import { HomeClient } from '../../../components/HomeClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function RestaurantPwaPage({ params }: Props) {
  const { slug } = await params;
  const cleanSlug = slug ? slug.toLowerCase().trim() : 'porto-bar';

  const tenantRepo = getTenantRepository();
  const menuRepo = getMenuRepository();

  let tenant = await tenantRepo.getBySlug(cleanSlug) || await tenantRepo.getById(cleanSlug);
  if (!tenant) {
    tenant = await tenantRepo.getBySlug('porto-bar') || await tenantRepo.getById('porto-bar');
  }

  if (!tenant) {
    return notFound();
  }

  const finalTenantId = tenant.id;
  const categories = await menuRepo.getCategories(finalTenantId);
  const dishes = await menuRepo.getDishes(finalTenantId);
  const promotions = await menuRepo.getPromotions(finalTenantId);

  // Load server config for working hours, banners, stories
  const { getTelegramConfigServer } = require('../../../data/telegramService');
  const serverConfig = getTelegramConfigServer() as any;

  const initialConfig = {
    workHoursStart: (tenant as any)?.config?.workHoursStart || serverConfig.workHoursStart || '11:30',
    workHoursEnd: (tenant as any)?.config?.workHoursEnd || serverConfig.workHoursEnd || '23:30',
    heroVideoUrl: serverConfig.heroVideoUrl || '',
    heroType: serverConfig.heroType || 'slideshow',
    heroSlogan: serverConfig.heroSlogan || null,
    statusBannerText: serverConfig.statusBannerText || null,
    statusBannerSubtitle: serverConfig.statusBannerSubtitle || null,
    statusBannerVideoUrl: serverConfig.statusBannerVideoUrl || '',
    stories: serverConfig.stories || [],
    backstageVideoEnabled: serverConfig.backstageVideoEnabled ?? false,
    printedMenuImage: serverConfig.printedMenuImage || '/images/image_2026-07-01_13-49-49.png'
  };

  const theme = tenant.theme;
  const primary = theme?.primaryColor || '#d4af37';
  const primaryLight = theme?.primaryLightColor || primary;
  const primaryDark = theme?.primaryDarkColor || '#aa8010';
  const accent = theme?.accentColor || '#f59e0b';
  const bg = theme?.bgColor || '#060a12';
  const bgCard = theme?.bgCardColor || '#0d131f';
  const text = theme?.textColor || '#f3f4f6';

  return (
    <>
      {/* Server-Injected Dynamic CSS Variables for instantaneous zero-flash rendering */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --porto-primary: ${primary};
              --porto-gold: ${primary};
              --porto-gold-bright: ${primaryLight};
              --porto-gold-dark: ${primaryDark};
              --porto-accent: ${accent};
              --porto-bg: ${bg};
              --porto-card: ${bgCard};
              --porto-text: ${text};
              --background: ${bg};
              --foreground: ${text};
            }
            body {
              background-color: ${bg} !important;
              color: ${text} !important;
            }
          `
        }}
      />
      <HomeClient
        initialTenant={tenant}
        initialCategories={categories}
        initialDishes={dishes}
        initialPromotions={promotions}
        initialConfig={initialConfig}
      />
    </>
  );
}
