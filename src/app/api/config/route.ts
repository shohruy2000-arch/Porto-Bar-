import { NextResponse } from 'next/server';
import { getTelegramConfigServer, saveTelegramConfigServer } from '../../../data/telegramService';
import { testIikoConnection, getIikoOrganizations, getIikoTerminalGroups } from '../../../data/iikoService';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    const config = getTelegramConfigServer() as any;

    // ─────────────────────────────
    // iiko test endpoints
    // ─────────────────────────────
    if (action === 'test-iiko') {
      const apiLogin = searchParams.get('apiLogin') || config?.iiko?.apiLogin || '';
      if (!apiLogin) {
        return NextResponse.json({ success: false, error: 'API Login not provided' }, { status: 400 });
      }
      const result = await testIikoConnection(apiLogin);
      return NextResponse.json(result);
    }

    if (action === 'iiko-organizations') {
      const result = await getIikoOrganizations();
      return NextResponse.json({ organizations: result });
    }

    if (action === 'iiko-terminal-groups') {
      const orgId = searchParams.get('organizationId');
      if (!orgId) return NextResponse.json({ error: 'organizationId required' }, { status: 400 });
      const result = await getIikoTerminalGroups(orgId);
      return NextResponse.json({ terminalGroups: result });
    }

    // ─────────────────────────────
    // Normal config GET
    // ─────────────────────────────
    const isConfigured = !!config.botToken && !!config.chatId;
    const isGeminiConfigured = !!config.geminiApiKey;
    const isOpenAiConfigured = !!config.openaiApiKey;
    const isSmtpConfigured = !!config.smtpHost && !!config.smtpUser && !!config.smtpPass;
    const isIikoConfigured = !!config.iiko?.enabled && !!config.iiko?.apiLogin;

    return NextResponse.json({ 
      isConfigured, 
      isGeminiConfigured,
      isOpenAiConfigured,
      isSmtpConfigured,
      isIikoConfigured,
      chatId: config.chatId || '',
      geminiProxyUrl: config.geminiProxyUrl || '',
      waiterChatId: config.waiterChatId || '', 
      waiters: config.waiters || [],
      backstageVideoUrl: config.backstageVideoUrl || '',
      backstageVideoEnabled: config.backstageVideoEnabled ?? false,
      backstageVideoTitle: config.backstageVideoTitle || { ru: 'Атмосфера на кухне', en: 'Kitchen Atmosphere', zh: '后厨氛围' },
      stories: config.stories || [],
      workHoursStart: config.workHoursStart || '11:30',
      workHoursEnd: config.workHoursEnd || '23:30',
      heroVideoUrl: config.heroVideoUrl || '',
      heroType: config.heroType || 'slideshow',
      heroSlogan: config.heroSlogan || null,
      statusBannerText: config.statusBannerText || null,
      printedMenuImage: config.printedMenuImage || '/images/image_2026-07-01_13-49-49.png',
      smtpHost: config.smtpHost || '',
      smtpPort: config.smtpPort || 465,
      smtpUser: config.smtpUser || '',
      vkAppId: config.vkAppId || '',
      botUsername: config.botUsername || '',
      vapidPublicKey: config.vapidPublicKey || '',
      yandexEdaUrl: config.yandexEdaUrl || '',
      deliveryRadiusKm: config.deliveryRadiusKm !== undefined ? Number(config.deliveryRadiusKm) : 2,
      restaurantAddress: config.restaurantAddress || 'Ленинский проспект, 146, Москва (Отель Аструс)',
      restaurantLat: config.restaurantLat !== undefined ? Number(config.restaurantLat) : 55.654060,
      restaurantLng: config.restaurantLng !== undefined ? Number(config.restaurantLng) : 37.498877,
      deliveryFee: config.deliveryFee !== undefined ? Number(config.deliveryFee) : 0,
      iiko: {
        enabled: config.iiko?.enabled ?? false,
        apiLogin: config.iiko?.apiLogin || '',
        organizationId: config.iiko?.organizationId || '',
        terminalGroupId: config.iiko?.terminalGroupId || ''
      }
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      botToken, 
      chatId, 
      waiterChatId, 
      waiters, 
      geminiApiKey, 
      geminiProxyUrl,
      openaiApiKey,
      backstageVideoUrl,
      backstageVideoEnabled,
      backstageVideoTitle,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPass,
      vkAppId,
      // iiko fields
      iikoEnabled,
      iikoApiLogin,
      iikoOrganizationId,
      iikoTerminalGroupId,
      stories,
      workHoursStart,
      workHoursEnd,
      heroVideoUrl,
      heroType,
      heroSlogan,
      statusBannerText,
      printedMenuImage,
      // delivery fields
      yandexEdaUrl,
      deliveryRadiusKm,
      restaurantAddress,
      restaurantLat,
      restaurantLng,
      deliveryFee
    } = body;
    
    if (!chatId) {
      return NextResponse.json({ error: 'Missing parameters: chatId is required' }, { status: 400 });
    }

    const config = getTelegramConfigServer() as any;
    const finalBotToken = botToken || config.botToken;
    const finalGeminiApiKey = geminiApiKey || config.geminiApiKey;
    const finalGeminiProxyUrl = geminiProxyUrl !== undefined ? geminiProxyUrl : config.geminiProxyUrl;
    const finalOpenaiApiKey = openaiApiKey || config.openaiApiKey;

    const finalSmtpHost = smtpHost !== undefined ? smtpHost : config.smtpHost;
    const finalSmtpPort = smtpPort !== undefined ? Number(smtpPort) : config.smtpPort;
    const finalSmtpUser = smtpUser !== undefined ? smtpUser : config.smtpUser;
    const finalSmtpPass = smtpPass || config.smtpPass;
    const finalVkAppId = vkAppId !== undefined ? vkAppId : config.vkAppId;

    if (!finalBotToken) {
      return NextResponse.json({ error: 'Telegram Bot Token not configured' }, { status: 400 });
    }

    // 1. Fetch Telegram Bot Username dynamically via getMe
    let finalBotUsername = config.botUsername || '';
    try {
      const getMeUrl = `https://api.telegram.org/bot${finalBotToken}/getMe`;
      const meRes = await fetch(getMeUrl);
      if (meRes.ok) {
        const meJson = await meRes.json();
        if (meJson.ok && meJson.result?.username) {
          finalBotUsername = meJson.result.username;
        }
      }
    } catch (err) {
      console.error('Failed to query Telegram Bot getMe:', err);
    }

    // 2. Auto-register Webhook for Telegram Bot
    try {
      const domain = req.headers.get('host') || 'porto-bar.ru';
      const proto = req.headers.get('x-forwarded-proto') || 'https';
      const webhookUrl = `${proto}://${domain}/api/telegram-webhook`;
      console.log(`Setting Telegram Webhook to: ${webhookUrl}`);
      const setWebhookUrl = `https://api.telegram.org/bot${finalBotToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;
      const whRes = await fetch(setWebhookUrl);
      if (whRes.ok) {
        const whJson = await whRes.json();
        console.log('Telegram Webhook set response:', whJson);
      }
    } catch (err) {
      console.error('Failed to auto-set Telegram Webhook:', err);
    }

    const success = saveTelegramConfigServer({ 
      botToken: finalBotToken, 
      chatId, 
      waiterChatId: waiterChatId || '', 
      waiters: waiters || [],
      geminiApiKey: finalGeminiApiKey,
      geminiProxyUrl: finalGeminiProxyUrl,
      openaiApiKey: finalOpenaiApiKey,
      backstageVideoUrl: backstageVideoUrl !== undefined ? backstageVideoUrl : config.backstageVideoUrl,
      backstageVideoEnabled: backstageVideoEnabled !== undefined ? backstageVideoEnabled : config.backstageVideoEnabled,
      backstageVideoTitle: backstageVideoTitle !== undefined ? backstageVideoTitle : config.backstageVideoTitle,
      stories: stories !== undefined ? stories : config.stories,
      workHoursStart: workHoursStart !== undefined ? workHoursStart : config.workHoursStart,
      workHoursEnd: workHoursEnd !== undefined ? workHoursEnd : config.workHoursEnd,
      heroVideoUrl: heroVideoUrl !== undefined ? heroVideoUrl : (config.heroVideoUrl || ''),
      heroType: heroType !== undefined ? heroType : (config.heroType || 'slideshow'),
      heroSlogan: heroSlogan !== undefined ? heroSlogan : config.heroSlogan,
      statusBannerText: statusBannerText !== undefined ? statusBannerText : config.statusBannerText,
      printedMenuImage: printedMenuImage !== undefined ? printedMenuImage : config.printedMenuImage,
      smtpHost: finalSmtpHost,
      smtpPort: finalSmtpPort,
      smtpUser: finalSmtpUser,
      smtpPass: finalSmtpPass,
      vkAppId: finalVkAppId,
      botUsername: finalBotUsername,
      yandexEdaUrl: yandexEdaUrl !== undefined ? yandexEdaUrl.trim() : (config.yandexEdaUrl || ''),
      deliveryRadiusKm: deliveryRadiusKm !== undefined ? Number(deliveryRadiusKm) : (config.deliveryRadiusKm !== undefined ? config.deliveryRadiusKm : 2),
      restaurantAddress: restaurantAddress !== undefined ? restaurantAddress.trim() : (config.restaurantAddress || 'Ленинский проспект, 146, Москва (Отель Аструс)'),
      restaurantLat: restaurantLat !== undefined ? Number(restaurantLat) : (config.restaurantLat !== undefined ? Number(config.restaurantLat) : 55.654060),
      restaurantLng: restaurantLng !== undefined ? Number(restaurantLng) : (config.restaurantLng !== undefined ? Number(config.restaurantLng) : 37.498877),
      deliveryFee: deliveryFee !== undefined ? Number(deliveryFee) : (config.deliveryFee !== undefined ? Number(config.deliveryFee) : 0),
      iiko: {
        enabled: iikoEnabled !== undefined ? Boolean(iikoEnabled) : (config.iiko?.enabled ?? false),
        apiLogin: iikoApiLogin !== undefined ? iikoApiLogin : (config.iiko?.apiLogin || ''),
        organizationId: iikoOrganizationId !== undefined ? iikoOrganizationId : (config.iiko?.organizationId || ''),
        terminalGroupId: iikoTerminalGroupId !== undefined ? iikoTerminalGroupId : (config.iiko?.terminalGroupId || '')
      }
    } as any);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
    }

    return NextResponse.json({ success: true, botUsername: finalBotUsername });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
