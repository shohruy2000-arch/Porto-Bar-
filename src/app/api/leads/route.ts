/**
 * @file src/app/api/leads/route.ts
 * @description API endpoint for handling incoming restaurant briefs and super-admin lead management.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getTelegramConfigServer } from '../../../data/telegramService';

const SUPER_ADMIN_PIN = process.env.SUPER_ADMIN_PIN || 'porto777';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      restaurantName,
      city,
      cuisineType,
      preferredStyle,
      avgCheck,
      comment
    } = body;

    // Validation
    if (!name?.trim() || !phone?.trim() || !restaurantName?.trim() || !city?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Пожалуйста, заполните обязательные поля (Имя, Телефон, Ресторан, Город)' },
        { status: 400 }
      );
    }

    // Save lead to database
    const lead = await prisma.lead.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        restaurantName: restaurantName.trim(),
        city: city.trim(),
        cuisineType: cuisineType || null,
        preferredStyle: preferredStyle || null,
        avgCheck: avgCheck ? parseInt(String(avgCheck), 10) : null,
        comment: comment?.trim() || null,
        status: 'NEW'
      }
    });

    // Send Telegram Notification to Master Channel / Admin
    try {
      const config = getTelegramConfigServer();
      const botToken = config?.botToken || process.env.TELEGRAM_BOT_TOKEN;
      const chatId = config?.chatId || process.env.TELEGRAM_CHAT_ID;

      if (botToken && chatId) {
        const text = 
`🔔 <b>НОВАЯ ЗАЯВКА НА СОЗДАНИЕ PWA</b>

🏢 <b>Ресторан:</b> ${lead.restaurantName}
👤 <b>Имя:</b> ${lead.name}
📞 <b>Телефон:</b> ${lead.phone}
📍 <b>Город:</b> ${lead.city}
🍽 <b>Кухня:</b> ${lead.cuisineType || 'Не указана'}
🎨 <b>Стиль:</b> ${lead.preferredStyle || 'Не указан'}
💰 <b>Средний чек:</b> ${lead.avgCheck ? `${lead.avgCheck} ₽` : 'Не указан'}
💬 <b>Комментарий:</b> ${lead.comment || 'Нет'}

📅 <i>${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}</i>`;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: 'HTML'
          })
        });
      }
    } catch (tgErr) {
      console.error('[Leads API] Telegram notification failed:', tgErr);
    }

    return NextResponse.json({
      success: true,
      id: lead.id,
      message: 'Заявка успешно отправлена! Мы свяжемся с вами в течение часа.'
    });
  } catch (err: any) {
    console.error('[Leads API POST Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Ошибка сохранения заявки' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('x-super-admin-auth');
    const { searchParams } = new URL(req.url);
    const pin = searchParams.get('pin');

    if (authHeader !== SUPER_ADMIN_PIN && pin !== SUPER_ADMIN_PIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const statusFilter = searchParams.get('status');
    const whereClause: any = {};
    if (statusFilter && statusFilter !== 'ALL') {
      whereClause.status = statusFilter;
    }

    const leads = await prisma.lead.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      leads
    });
  } catch (err: any) {
    console.error('[Leads API GET Error]:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('x-super-admin-auth');
    if (authHeader !== SUPER_ADMIN_PIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
    }

    const updated = await prisma.lead.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (err: any) {
    console.error('[Leads API PATCH Error]:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
