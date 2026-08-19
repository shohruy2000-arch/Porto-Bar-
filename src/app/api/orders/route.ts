import { NextResponse } from 'next/server';
import { serverDb } from '../../../data/serverDb';
import { orderNotificationService } from '../../../data/telegramService';
import { createIikoOrder } from '../../../data/iikoService';
import { Order, OrderStatus } from '../../../types';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');
    
    let orders = serverDb.getOrders();
    
    if (phone) {
      const cleanPhone = phone.trim().replace(/[^\d+]/g, '');
      orders = orders.filter(o => o.phone.replace(/[^\d+]/g, '') === cleanPhone);
    }
    
    return NextResponse.json(orders);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, data } = body;

    if (action === 'addOrder') {
      const orders = serverDb.getOrders();
      const newOrder: Order = {
        ...data,
        id: `order-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      
      // Save order locally first
      orders.push(newOrder);
      serverDb.saveOrders(orders);

      // Decrement quantity limits for ordered items if applicable
      try {
        const currentDishes = serverDb.getDishes();
        let dishUpdated = false;
        for (const item of newOrder.items) {
          const dishIndex = currentDishes.findIndex(d => d.id === item.dishId);
          if (dishIndex !== -1) {
            const dish = currentDishes[dishIndex];
            if (dish.quantityLimit !== undefined && dish.quantityLimit !== null) {
              dish.quantityLimit = Math.max(0, dish.quantityLimit - item.quantity);
              dishUpdated = true;
            }
          }
        }
        if (dishUpdated) {
          serverDb.saveDishes(currentDishes);
        }
      } catch (err) {
        console.error('Failed to decrement quantity limits for order:', err);
      }

      // Construct Telegram text notification on the server side safely
      const dishes = serverDb.getDishes();
      const itemsListText = newOrder.items
        .map(item => {
          const dish = dishes.find(d => d.id === item.dishId);
          const name = dish ? dish.name.ru : 'Неизвестное блюдо';
          const priceText = item.priceAtOrder === 0 ? '🎁 ПОДАРОК' : `${item.priceAtOrder * item.quantity} ₽`;
          return `- ${name} x${item.quantity} (${priceText})`;
        })
        .join('\n');

      // Dispatch Telegram notification
      try {
        await orderNotificationService.sendOrderNotification(newOrder, itemsListText);
      } catch (err) {
        console.error('Failed to trigger Telegram notification:', err);
      }

      // ─────────────────────────────────────────
      // Push order to iiko terminal (non-blocking)
      // ─────────────────────────────────────────
      try {
        // Build dishId → { name, price } map for iiko product matching
        const dishMap = new Map<string, { name: string; price: number }>();
        for (const item of newOrder.items) {
          const dish = dishes.find(d => d.id === item.dishId);
          if (dish) {
            dishMap.set(item.dishId, { name: dish.name.ru, price: item.priceAtOrder });
          }
        }

        const iikoResult = await createIikoOrder(newOrder, dishMap);
        
        // Update order with iiko result
        const allOrders = serverDb.getOrders();
        const idx = allOrders.findIndex(o => o.id === newOrder.id);
        if (idx !== -1) {
          if (iikoResult.success) {
            allOrders[idx].iikoOrderId = iikoResult.iikoOrderId;
            console.log(`[iiko] Order ${newOrder.id} synced → iiko id: ${iikoResult.iikoOrderId}`);
          } else {
            allOrders[idx].iikoSyncError = iikoResult.error;
            console.warn(`[iiko] Order ${newOrder.id} sync failed: ${iikoResult.error}`);
          }
          serverDb.saveOrders(allOrders);
        }
      } catch (iikoErr: any) {
        console.error('[iiko] Unexpected error during order sync:', iikoErr?.message || iikoErr);
      }

      return NextResponse.json(newOrder);
    }

    if (action === 'callWaiter') {
      const { tableNumber } = data;
      let waiterName = 'Не назначен (Менеджер)';
      let targetChatIds: string[] = [];

      try {
        const { getTelegramConfigServer } = require('../../../data/telegramService');
        const config = getTelegramConfigServer();
        const currentTableNum = parseInt(tableNumber);
        
        if (config.waiters && config.waiters.length > 0) {
          const assignedWaitersNames: string[] = [];
          config.waiters.forEach((waiter: any) => {
            const tableSpecs = waiter.tables.split(',').map((t: string) => t.trim());
            const isAssigned = tableSpecs.some((spec: string) => {
              if (spec.includes('-')) {
                const [start, end] = spec.split('-').map(Number);
                return currentTableNum >= start && currentTableNum <= end;
              }
              return parseInt(spec) === currentTableNum || spec.toLowerCase() === 'all';
            });
            
            if (isAssigned && waiter.chatId) {
              targetChatIds.push(waiter.chatId);
              assignedWaitersNames.push(waiter.name || 'Официант');
            }
          });
          if (assignedWaitersNames.length > 0) {
            waiterName = assignedWaitersNames.join(', ');
          }
        }
        
        let isFallback = false;
        if (targetChatIds.length === 0) {
          const fallbackId = config.waiterChatId || config.chatId;
          if (fallbackId) {
            targetChatIds.push(fallbackId);
            isFallback = true;
          }
          waiterName = 'Не назначен (Менеджер)';
        }

        // Save call trace record to db for traceability
        const calls = serverDb.getWaiterCalls();
        const newCall = {
          id: `call-${Date.now()}`,
          timestamp: new Date().toISOString(),
          tableNumber: String(tableNumber),
          assignedWaiter: waiterName,
          status: 'pending' as const
        };
        calls.push(newCall);
        serverDb.saveWaiterCalls(calls);

        if (config.botToken && targetChatIds.length > 0) {
          const message = `🔔 ВЫЗОВ ОФИЦИАНТА\n----------------------------\n🍽️ Стол №: ${tableNumber}\n----------------------------\n📍 Срочно требуется официант к столу №${tableNumber}!${isFallback ? '\n\n⚠️ Внимание: ответственный официант не назначен. Уведомление отправлено менеджеру.' : ''}`;
          const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
          
          for (const targetId of targetChatIds) {
            try {
              await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  chat_id: targetId,
                  text: message
                })
              });
            } catch (sendErr) {
              console.error(`Failed to send notification to chatId ${targetId}:`, sendErr);
            }
          }
        } else {
          console.log(`🔔 WAITER CALL SIMULATION: Table № ${tableNumber} (Assigned to: ${waiterName})`);
        }
      } catch (err) {
        console.error('Failed to notify waiter:', err);
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'updateOrderStatus') {
      const orders = serverDb.getOrders();
      const index = orders.findIndex(o => o.id === data.id);
      if (index === -1) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      
      orders[index].status = data.status as OrderStatus;
      serverDb.saveOrders(orders);
      return NextResponse.json(orders[index]);
    }

    return NextResponse.json({ error: 'Invalid Action' }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
