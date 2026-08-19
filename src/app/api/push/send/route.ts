import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { serverDb } from '../../../../data/serverDb';
import { getTelegramConfigServer } from '../../../../data/telegramService';

export async function POST(req: Request) {
  try {
    const { title, body: msgBody, url } = await req.json();

    if (!title || !msgBody) {
      return NextResponse.json({ success: false, error: 'Title and Body required' }, { status: 400 });
    }

    const config = getTelegramConfigServer();
    if (!config.vapidPublicKey || !config.vapidPrivateKey) {
      return NextResponse.json({ success: false, error: 'Web Push credentials not configured' }, { status: 500 });
    }

    // Configure web-push
    webpush.setVapidDetails(
      'mailto:manager@porto-bar.ru',
      config.vapidPublicKey,
      config.vapidPrivateKey
    );

    const subscriptions = serverDb.getPushSubscriptions();
    if (subscriptions.length === 0) {
      return NextResponse.json({ success: true, sent: 0, failed: 0, message: 'No subscribers found' });
    }

    const payload = JSON.stringify({
      title,
      body: msgBody,
      url: url || '/'
    });

    let sent = 0;
    let failed = 0;
    const unsubscribedEndpoints: string[] = [];

    // Send push notifications in parallel
    const promises = subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.keys.p256dh,
          auth: sub.keys.auth
        }
      };

      try {
        await webpush.sendNotification(pushSubscription, payload);
        sent++;
      } catch (err: any) {
        console.error('Push delivery error for endpoint:', sub.endpoint, err.statusCode);
        failed++;
        // If subscriber is gone or endpoint is invalid, queue for deletion
        if (err.statusCode === 410 || err.statusCode === 404) {
          unsubscribedEndpoints.push(sub.endpoint);
        }
      }
    });

    await Promise.all(promises);

    // Clean up gone/expired subscriptions
    if (unsubscribedEndpoints.length > 0) {
      const remainingSubscriptions = subscriptions.filter(
        sub => !unsubscribedEndpoints.includes(sub.endpoint)
      );
      serverDb.savePushSubscriptions(remainingSubscriptions);
      console.log(`Cleaned up ${unsubscribedEndpoints.length} expired subscriptions.`);
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      cleanedUp: unsubscribedEndpoints.length
    });
  } catch (e) {
    console.error('Failed to broadcast push notification:', e);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
