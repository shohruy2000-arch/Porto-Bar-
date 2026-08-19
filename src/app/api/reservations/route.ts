import { NextResponse } from 'next/server';
import { serverDb } from '../../../data/serverDb';
import { orderNotificationService } from '../../../data/telegramService';
import { Reservation } from '../../../types';

export async function POST(req: Request) {
  try {
    const reservationData = await req.json();
    const { name, phone, date, time, guestsCount, zone, tableNumber, wishes, idempotencyKey } = reservationData;

    if (!name || !phone || !date || !time || !guestsCount || !zone) {
      return NextResponse.json({ error: 'Missing required reservation fields' }, { status: 400 });
    }

    const reservations = serverDb.getReservations();

    // Check for duplicate reservation based on idempotencyKey
    if (idempotencyKey) {
      const duplicate = reservations.find(r => r.idempotencyKey === idempotencyKey);
      if (duplicate) {
        console.log(`[Reservation API] Duplicate request detected for idempotencyKey: ${idempotencyKey}`);
        return NextResponse.json({ success: true, reservationId: duplicate.id, duplicate: true });
      }
    }

    // Create new reservation record
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      name,
      phone,
      date,
      time,
      guestsCount: Number(guestsCount),
      zone,
      tableNumber: tableNumber ? String(tableNumber) : undefined,
      wishes: wishes ? String(wishes) : undefined,
      idempotencyKey,
      createdAt: new Date().toISOString()
    };

    // Save to server database
    reservations.push(newReservation);
    serverDb.saveReservations(reservations);

    // Send Telegram notification
    try {
      await orderNotificationService.sendReservationNotification({
        name: newReservation.name,
        phone: newReservation.phone,
        date: newReservation.date,
        time: newReservation.time,
        guestsCount: newReservation.guestsCount,
        zone: newReservation.zone,
        tableNumber: newReservation.tableNumber,
        wishes: newReservation.wishes,
        idempotencyKey: newReservation.idempotencyKey
      });
    } catch (err) {
      console.error('[Reservation API] Failed to trigger Telegram reservation notification:', err);
    }

    return NextResponse.json({ success: true, reservationId: newReservation.id });
  } catch (err: any) {
    console.error('[Reservation API] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
