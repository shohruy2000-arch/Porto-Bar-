import { NextResponse } from 'next/server';
import { getTelegramConfigServer } from '../../../data/telegramService';

// Reference the persistent in-memory session store
const globalAny: any = global;
globalAny.otpSessions = globalAny.otpSessions || new Map();
const otpSessions = globalAny.otpSessions as Map<string, {
  code: string;
  channel: 'tg' | 'email' | 'vk';
  identifier: string;
  telegramId?: string;
  telegramUsername?: string;
  verified: boolean;
  createdAt: number;
}>;

export async function POST(req: Request) {
  try {
    const update = await req.json();
    console.log('Received Telegram Bot update:', JSON.stringify(update));

    const message = update.message;
    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const text = message.text.trim();
    const config = getTelegramConfigServer();
    const botToken = config.botToken;

    if (!botToken) {
      console.error('Telegram Bot Token is not configured, cannot reply to webhook.');
      return NextResponse.json({ ok: true });
    }

    let codeCandidate = '';

    // Check if it's a start command with deep-link parameter: /start login_xxxx
    if (text.startsWith('/start login_')) {
      codeCandidate = text.replace('/start login_', '').trim();
    } else if (/^\d{4}$/.test(text)) {
      // User just typed the 4-digit code directly
      codeCandidate = text;
    }

    if (codeCandidate) {
      const session = otpSessions.get(codeCandidate);

      if (session && session.channel === 'tg' && !session.verified) {
        // Double check session expiration (5 minutes)
        if (Date.now() - session.createdAt <= 5 * 60 * 1000) {
          // Verify the session
          session.verified = true;
          session.telegramId = String(message.from.id);
          session.telegramUsername = message.from.username || '';
          session.identifier = String(message.from.id);

          console.log(`Telegram login verified successfully for code ${codeCandidate}, User ID: ${message.from.id}`);

          // Reply with success message to user in Telegram
          const replyText = `✅ Вы успешно авторизовались в PORTO-BAR!\n\nИмя: ${message.from.first_name || ''}\nUsername: @${message.from.username || 'нет'}\n\nТеперь вернитесь в окно браузера, вход выполнится автоматически.`;
          try {
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: message.chat.id,
                text: replyText
              })
            });
          } catch (err) {
            console.error('Failed to send success message to user on Telegram:', err);
          }

          return NextResponse.json({ ok: true });
        } else {
          otpSessions.delete(codeCandidate);
        }
      }

      // If code is not found, expired, or invalid, send failure message
      const errorText = `❌ Неверный или устаревший код авторизации.\nПожалуйста, запросите новый код на сайте.`;
      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: message.chat.id,
            text: errorText
          })
        });
      } catch (err) {
        console.error('Failed to send error message to user on Telegram:', err);
      }
    } else {
      // General bot command (e.g. general /start)
      if (text.startsWith('/start')) {
        const welcomeText = `👋 Добро пожаловать в цифровое меню PORTO-BAR!\n\nЭтот бот используется для быстрого входа в личный кабинет на сайте и получения уведомлений о ваших заказах.\n\nЧтобы войти в аккаунт, откройте меню в браузере, выберите вход через Telegram и перейдите по предоставленной ссылке.`;
        try {
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: message.chat.id,
              text: welcomeText
            })
          });
        } catch (err) {
          console.error('Failed to send start message on Telegram:', err);
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Error in telegram-webhook handler:', err);
    return NextResponse.json({ ok: true }); // Always return OK 200 to Telegram so it doesn't retry spamming us
  }
}
