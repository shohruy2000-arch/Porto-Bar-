import fs from 'fs';
import path from 'path';
import { Order, TelegramConfig } from '../types';
import webpush from 'web-push';

const CONFIG_FILE = path.join(process.cwd(), 'src', 'data', 'config.json');

// Initialize config file if it does not exist
const initConfig = () => {
  const dir = path.dirname(CONFIG_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(
      CONFIG_FILE,
      JSON.stringify({ botToken: '', chatId: '' }, null, 2),
      'utf-8'
    );
  }
};

export const getTelegramConfigServer = (): TelegramConfig => {
  try {
    initConfig();
    const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
    const config = JSON.parse(content) as TelegramConfig;
    
    // Auto-generate VAPID keys if missing
    if (!config.vapidPublicKey || !config.vapidPrivateKey) {
      try {
        const keys = webpush.generateVAPIDKeys();
        config.vapidPublicKey = keys.publicKey;
        config.vapidPrivateKey = keys.privateKey;
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
      } catch (err) {
        console.error('Failed to auto-generate VAPID keys:', err);
      }
    }
    
    return config;
  } catch (e) {
    console.error('Failed to read Telegram Config:', e);
    return { botToken: '', chatId: '' };
  }
};

export const saveTelegramConfigServer = (config: TelegramConfig): boolean => {
  try {
    initConfig();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Failed to write Telegram Config:', e);
    return false;
  }
};

export interface OrderNotificationService {
  sendOrderNotification(order: Order, itemsListText: string): Promise<boolean>;
}

export class TelegramNotificationService implements OrderNotificationService {
  async sendOrderNotification(order: Order, itemsListText: string): Promise<boolean> {
    const config = getTelegramConfigServer();
    if (!config.botToken || !config.chatId) {
      console.log(' Telegram Bot Token or Chat ID not configured. Notification output (Console log only):');
      console.log(`🔔 NEW ORDER: type=${order.type}, phone=${order.phone}, total=${order.totalAmount} ₽`);
      console.log(itemsListText);
      return true; // Return true to simulate delivery success even if not configured
    }

    const typeLabels: Record<string, string> = {
      room: '🏨 ЗАКАЗ В НОМЕР',
      table: '🍽️ ЗАКАЗ НА СТОЛ',
      takeaway: '🛍️ ЗАКАЗ НА ВЫНОС',
      delivery: '🛵 ДОСТАВКА ПО АДРЕСУ'
    };

    let details = 'Take Away';
    if (order.type === 'room') {
      details = `Room: ${order.roomNumber}`;
    } else if (order.type === 'table') {
      details = `Table: ${order.tableNumber}`;
    } else if (order.type === 'delivery') {
      const extraParts = [];
      if (order.deliveryApartment) extraParts.push(`Кв./офис: ${order.deliveryApartment}`);
      if (order.deliveryEntrance) extraParts.push(`Подъезд: ${order.deliveryEntrance}`);
      if (order.deliveryFloor) extraParts.push(`Этаж: ${order.deliveryFloor}`);
      if (order.deliveryIntercom) extraParts.push(`Домофон: ${order.deliveryIntercom}`);
      if (order.deliveryComment) extraParts.push(`Комментарий: ${order.deliveryComment}`);

      const extraText = extraParts.length > 0 ? `\n🏢 Доп. данные: ${extraParts.join(', ')}` : '';
      const distanceText = order.deliveryDistance !== undefined ? `\n📏 Расстояние: ~${order.deliveryDistance} км` : '';
      const mapLink = (order.deliveryLat && order.deliveryLng)
        ? `\n🗺️ Карта: https://yandex.ru/maps/?pt=${order.deliveryLng},${order.deliveryLat}&z=16&l=map`
        : '';

      details = `Адрес: ${order.deliveryAddress || 'Не указан'}${extraText}${distanceText}${mapLink}`;
    }

    const deliveryFeeText = order.type === 'room'
      ? '\n🚚 Доставка в номер: 150 ₽'
      : (order.type === 'delivery' && (config.deliveryFee || 0) > 0)
      ? `\n🛵 Доставка курьером: ${config.deliveryFee} ₽`
      : '';

    const message = `
${typeLabels[order.type] || '🔔 НОВЫЙ ЗАКАЗ'}
----------------------------
🆔 ID Заказа: ${order.id.replace('order-', '')}
📞 Телефон: ${order.phone}
📍 ${details}
💳 Оплата: ${order.paymentMethod === 'terminal' ? 'Карта (Терминал)' : 'Наличные'}
----------------------------
🛒 БЛЮДА:
${itemsListText}
----------------------------${deliveryFeeText}
💰 ИТОГО: ${order.totalAmount} ₽
`;

    try {
      const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: config.chatId,
          text: message.trim()
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Telegram API response error:', errText);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Failed to send Telegram notification:', e);
      return false;
    }
  }

  async sendReservationNotification(reservation: {
    name: string;
    phone: string;
    date: string;
    time: string;
    guestsCount: number;
    zone: 'inside' | 'veranda';
    tableNumber?: string;
    wishes?: string;
    idempotencyKey?: string;
  }): Promise<boolean> {
    const config = getTelegramConfigServer();
    if (!config.botToken || !config.chatId) {
      console.log(' Telegram Bot Token or Chat ID not configured. Notification output (Console log only):');
      console.log(`🔔 NEW RESERVATION: name=${reservation.name}, phone=${reservation.phone}, wishes=${reservation.wishes}`);
      return true;
    }

    const isInside = reservation.zone === 'inside';
    const wishesText = reservation.wishes ? reservation.wishes.trim() : 'Нет';

    const message = `
🗓️ НОВАЯ БРОНЬ СТОЛИКА
----------------------------
👤 Гость: ${reservation.name}
📞 Телефон: ${reservation.phone}
📅 Дата: ${reservation.date}
⏰ Время: ${reservation.time}
👥 Гостей: ${reservation.guestsCount} чел.
📍 Зона: ${isInside ? 'Внутри (Зал)' : 'Веранда'}
💬 Пожелания: ${wishesText}
----------------------------
`;

    try {
      const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: config.chatId,
          text: message.trim()
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Telegram API reservation response error:', errText);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Failed to send Telegram reservation notification:', e);
      return false;
    }
  }
}

export const orderNotificationService = new TelegramNotificationService();
