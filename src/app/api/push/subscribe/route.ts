import { NextResponse } from 'next/server';
import { serverDb } from '../../../../data/serverDb';
import { PushSubscriptionData } from '../../../../types';

export async function POST(req: Request) {
  try {
    const { subscription, phone } = await req.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ success: false, error: 'Invalid subscription' }, { status: 400 });
    }

    const subscriptions = serverDb.getPushSubscriptions();
    const existingIndex = subscriptions.findIndex(sub => sub.endpoint === subscription.endpoint);

    const subscriptionData: PushSubscriptionData = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys?.p256dh || '',
        auth: subscription.keys?.auth || ''
      },
      phone: phone || undefined,
      createdAt: new Date().toISOString()
    };

    if (existingIndex > -1) {
      // Update phone and keys if changed
      subscriptions[existingIndex] = {
        ...subscriptions[existingIndex],
        keys: subscriptionData.keys,
        phone: phone || subscriptions[existingIndex].phone
      };
    } else {
      subscriptions.push(subscriptionData);
    }

    serverDb.savePushSubscriptions(subscriptions);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Failed to save push subscription:', e);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const subscriptions = serverDb.getPushSubscriptions();
    return NextResponse.json({ count: subscriptions.length });
  } catch (e) {
    return NextResponse.json({ count: 0 });
  }
}
