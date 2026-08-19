import { NextResponse } from 'next/server';
import { getTelegramConfigServer } from '../../../data/telegramService';
import { serverDb } from '../../../data/serverDb';
import { LoyaltyMember } from '../../../types';
import nodemailer from 'nodemailer';
import { syncGuestToIiko } from '../../../data/iikoService';

// Persistent in-memory session store (survives HMR in Next.js development)
const globalAny: any = global;
globalAny.otpSessions = globalAny.otpSessions || new Map();
const otpSessions = globalAny.otpSessions as Map<string, {
  code: string;
  channel: 'tg' | 'email' | 'vk';
  identifier: string;
  telegramId?: string;
  telegramUsername?: string;
  vkId?: string;
  name?: string;
  verified: boolean;
  createdAt: number;
}>;

// Clean up expired sessions (older than 5 minutes) every few requests
function cleanExpiredSessions() {
  const now = Date.now();
  for (const [key, session] of otpSessions.entries()) {
    if (now - session.createdAt > 5 * 60 * 1000) {
      otpSessions.delete(key);
    }
  }
}

export async function GET(req: Request) {
  cleanExpiredSessions();
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const code = searchParams.get('code');

  if (action === 'poll-tg-session') {
    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const session = otpSessions.get(code);
    if (!session || session.channel !== 'tg') {
      return NextResponse.json({ success: false, error: 'Session not found or expired' });
    }

    if (Date.now() - session.createdAt > 5 * 60 * 1000) {
      otpSessions.delete(code);
      return NextResponse.json({ success: false, error: 'Session expired' });
    }

    if (session.verified) {
      // Find loyalty member by Telegram ID or Telegram Username
      const members = serverDb.getLoyalty();
      const existingMember = members.find(m => 
        (session.telegramId && m.telegramId === session.telegramId) || 
        (session.telegramUsername && m.telegramUsername?.toLowerCase() === session.telegramUsername.toLowerCase())
      );

      // Clean session up immediately
      otpSessions.delete(code);

      if (existingMember) {
        return NextResponse.json({ 
          success: true, 
          member: existingMember 
        });
      } else {
        return NextResponse.json({ 
          success: true, 
          needsRegistration: true, 
          telegramId: session.telegramId, 
          telegramUsername: session.telegramUsername 
        });
      }
    }

    return NextResponse.json({ success: false, message: 'Waiting for bot activation' });
  }

  return NextResponse.json({ error: 'Invalid GET action' }, { status: 400 });
}

export async function POST(req: Request) {
  cleanExpiredSessions();
  try {
    const body = await req.json();
    const { action, email, code, name, phone, telegramId, telegramUsername, vkId } = body;
    const config = getTelegramConfigServer() as any;

    // 1. REQUEST EMAIL OTP
    if (action === 'request-email-otp') {
      if (!email || !email.includes('@')) {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
      }

      // Generate a 4-digit code
      const generatedCode = String(Math.floor(1000 + Math.random() * 9000));
      
      // Store in memory
      otpSessions.set(email.toLowerCase(), {
        code: generatedCode,
        channel: 'email',
        identifier: email.toLowerCase(),
        verified: false,
        createdAt: Date.now()
      });

      const hasSmtp = !!config.smtpHost && !!config.smtpUser && !!config.smtpPass;

      if (hasSmtp) {
        try {
          const transporter = nodemailer.createTransport({
            host: config.smtpHost,
            port: Number(config.smtpPort) || 465,
            secure: Number(config.smtpPort) === 465,
            auth: {
              user: config.smtpUser,
              pass: config.smtpPass
            }
          });

          await transporter.sendMail({
            from: `"PORTO-BAR" <${config.smtpUser}>`,
            to: email,
            subject: 'Код подтверждения входа в PORTO-BAR',
            text: `Ваш проверочный код: ${generatedCode}\nДействителен в течение 5 минут.`,
            html: `<div style="font-family: sans-serif; padding: 20px; color: #111;">
              <h2>Личный кабинет PORTO-BAR</h2>
              <p>Вы запросили код для входа в личный кабинет программы лояльности PORTO Club.</p>
              <div style="background: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 2px; text-align: center; border-radius: 8px; margin: 20px 0; max-width: 150px;">
                ${generatedCode}
              </div>
              <p style="font-size: 12px; color: #666;">Код действителен в течение 5 минут. Если вы не запрашивали этот код, просто проигнорируйте это письмо.</p>
            </div>`
          });

          return NextResponse.json({ success: true, email });
        } catch (mailErr) {
          console.error('SMTP Mail error:', mailErr);
          // Fallback to demo mode if SMTP connection fails
          return NextResponse.json({ 
            success: true, 
            email, 
            demoMode: true, 
            code: generatedCode,
            warning: 'Ошибка почтового сервера. Включен демонстрационный режим.' 
          });
        }
      } else {
        // Mock / Demo mode when SMTP is not configured yet
        return NextResponse.json({ 
          success: true, 
          email, 
          demoMode: true, 
          code: generatedCode 
        });
      }
    }

    // 2. VERIFY EMAIL OTP
    if (action === 'verify-email-otp') {
      if (!email || !code) {
        return NextResponse.json({ error: 'Email and Code are required' }, { status: 400 });
      }

      const session = otpSessions.get(email.toLowerCase());
      if (!session || session.channel !== 'email' || session.code !== String(code).trim()) {
        return NextResponse.json({ error: 'Неверный или просроченный код' }, { status: 400 });
      }

      if (Date.now() - session.createdAt > 5 * 60 * 1000) {
        otpSessions.delete(email.toLowerCase());
        return NextResponse.json({ error: 'Срок действия кода истек' }, { status: 400 });
      }

      // Check if loyalty member already exists with this email
      const members = serverDb.getLoyalty();
      const existingMember = members.find(m => m.email?.toLowerCase() === email.toLowerCase());

      otpSessions.delete(email.toLowerCase());

      if (existingMember) {
        return NextResponse.json({ success: true, member: existingMember });
      } else {
        return NextResponse.json({ success: true, needsRegistration: true, email: email.toLowerCase() });
      }
    }

    // 3. REQUEST TG SESSION
    if (action === 'request-tg-session') {
      const generatedCode = String(Math.floor(1000 + Math.random() * 9000));
      
      otpSessions.set(generatedCode, {
        code: generatedCode,
        channel: 'tg',
        identifier: '',
        verified: false,
        createdAt: Date.now()
      });

      return NextResponse.json({ 
        success: true, 
        code: generatedCode, 
        botUsername: config.botUsername || '' 
      });
    }

    // 4. VK LOGIN / MOCK AUTH
    if (action === 'vk-login') {
      if (!vkId || !name) {
        return NextResponse.json({ error: 'vkId and name are required' }, { status: 400 });
      }

      const members = serverDb.getLoyalty();
      const existingMember = members.find(m => m.vkId === String(vkId));

      if (existingMember) {
        return NextResponse.json({ success: true, member: existingMember });
      } else {
        return NextResponse.json({ success: true, needsRegistration: true, vkId: String(vkId), name });
      }
    }

    // 5. REGISTER NEW USER (INTEGRATED INTO LOYALTY)
    if (action === 'register') {
      if (!name || !phone) {
        return NextResponse.json({ error: 'Имя и телефон обязательны' }, { status: 400 });
      }

      const members = serverDb.getLoyalty();
      
      // Clean phone number for checks
      const cleanPhone = phone.trim().replace(/[^\d+]/g, '');

      // Double check if a member with this phone number already exists
      let existingMember = members.find(m => m.phone.replace(/[^\d+]/g, '') === cleanPhone);

      if (existingMember) {
        // Update credentials on existing member if needed
        let modified = false;
        if (email && !existingMember.email) { existingMember.email = email; modified = true; }
        if (telegramId && !existingMember.telegramId) { existingMember.telegramId = telegramId; modified = true; }
        if (telegramUsername && !existingMember.telegramUsername) { existingMember.telegramUsername = telegramUsername; modified = true; }
        if (vkId && !existingMember.vkId) { existingMember.vkId = vkId; modified = true; }

        if (modified) {
          serverDb.saveLoyalty(members);
        }
        return NextResponse.json({ success: true, member: existingMember });
      }

      // Generate a new loyalty card
      const phoneDigits = cleanPhone.replace(/[^\d]/g, '');
      const suffix = phoneDigits.substring(phoneDigits.length - 7);
      const cardNumber = `PB-${suffix.substring(0, 3)}-${suffix.substring(3)}`;

      const newMember: LoyaltyMember = {
        phone: cleanPhone,
        name: name.trim(),
        cardNumber: cardNumber,
        qrCode: cardNumber,
        registrationDate: new Date().toLocaleDateString('ru-RU'),
        points: 100, // 100 welcome points!
        tier: 'Bronze',
        history: [
          { 
            date: new Date().toLocaleString('ru-RU'), 
            amount: 100, 
            type: 'accrual', 
            comment: 'Регистрация в клубе PORTO' 
          }
        ],
        email: email || undefined,
        telegramId: telegramId || undefined,
        telegramUsername: telegramUsername || undefined,
        vkId: vkId || undefined
      };

      members.push(newMember);
      serverDb.saveLoyalty(members);

      // Sync new guest to iiko loyalty system (non-blocking)
      syncGuestToIiko(newMember).then(result => {
        if (result.success) {
          console.log(`[iiko] ✅ Guest "${newMember.name}" synced to iiko loyalty, id: ${result.iikoCustomerId}`);
        } else {
          console.warn(`[iiko] Guest "${newMember.name}" iiko sync failed: ${result.error}`);
        }
      }).catch(err => {
        console.error('[iiko] syncGuestToIiko unexpected error:', err?.message || err);
      });

      return NextResponse.json({ success: true, member: newMember });
    }

    return NextResponse.json({ error: 'Invalid POST action' }, { status: 400 });
  } catch (e) {
    console.error('Auth handler error:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
