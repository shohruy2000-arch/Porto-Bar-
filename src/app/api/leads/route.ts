/**
 * @file src/app/api/leads/route.ts
 * @description API endpoint for handling incoming restaurant briefs and super-admin lead management.
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '../../../lib/prisma';
import { getTelegramConfigServer } from '../../../data/telegramService';

const SUPER_ADMIN_PIN = process.env.SUPER_ADMIN_PIN || 'porto777';
const LEADS_FILE = path.join(process.cwd(), 'src', 'data', 'db', 'leads.json');

function getLeadsFromJson(): any[] {
  try {
    if (!fs.existsSync(LEADS_FILE)) {
      fs.writeFileSync(LEADS_FILE, '[]', 'utf-8');
      return [];
    }
    const data = fs.readFileSync(LEADS_FILE, 'utf-8');
    return JSON.parse(data) || [];
  } catch {
    return [];
  }
}

function saveLeadsToJson(leads: any[]): void {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving leads to JSON:', err);
  }
}

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

    let lead: any = null;

    if (prisma?.lead) {
      try {
        lead = await prisma.lead.create({
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
      } catch (err) {
        console.warn('Prisma lead creation failed, falling back to JSON:', err);
      }
    }

    if (!lead) {
      const leads = getLeadsFromJson();
      lead = {
        id: `lead-${Date.now()}`,
        name: name.trim(),
        phone: phone.trim(),
        restaurantName: restaurantName.trim(),
        city: city.trim(),
        cuisineType: cuisineType || null,
        preferredStyle: preferredStyle || null,
        avgCheck: avgCheck ? parseInt(String(avgCheck), 10) : null,
        comment: comment?.trim() || null,
        status: 'NEW',
        createdAt: new Date().toISOString()
      };
      leads.unshift(lead);
      saveLeadsToJson(leads);
    }

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
      console.error('Error sending Telegram brief notification:', tgErr);
    }

    return NextResponse.json({ success: true, lead });
  } catch (e: any) {
    console.error('Error creating lead:', e);
    return NextResponse.json(
      { success: false, error: e?.message || 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pin = searchParams.get('pin');

    if (pin !== SUPER_ADMIN_PIN) {
      return NextResponse.json({ success: false, error: 'Доступ запрещен' }, { status: 401 });
    }

    if (prisma?.lead) {
      try {
        const leads = await prisma.lead.findMany({
          orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, leads });
      } catch {
        // fallback
      }
    }

    const leads = getLeadsFromJson();
    return NextResponse.json({ success: true, leads });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
