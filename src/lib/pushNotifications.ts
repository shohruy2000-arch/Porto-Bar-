/**
 * Push Notifications Helper
 * Context-aware push permission requests triggered after high-value user actions
 */

export async function requestPushPermissionAfterAction(): Promise<boolean> {
  // Check if already handled
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  const permission = Notification.permission;
  const dismissed = localStorage.getItem('porto_push_prompt_dismissed');

  // Already granted or explicitly dismissed
  if (permission === 'granted' || permission === 'denied' || dismissed) {
    return false;
  }

  // Check if we've already shown the context-aware prompt
  const contextPromptShown = sessionStorage.getItem('porto_push_context_shown');
  if (contextPromptShown) {
    return false;
  }

  // Mark as shown in this session
  sessionStorage.setItem('porto_push_context_shown', 'true');

  try {
    // Fetch VAPID key
    const configRes = await fetch('/api/config');
    const config = await configRes.json();

    if (!config.vapidPublicKey) {
      console.warn('[Push] No VAPID key available');
      return false;
    }

    // Request permission
    const newPermission = await Notification.requestPermission();

    if (newPermission !== 'granted') {
      return false;
    }

    // Subscribe to push
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return false;
    }

    const registration = await navigator.serviceWorker.ready;

    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(config.vapidPublicKey)
    };

    const subscription = await registration.pushManager.subscribe(subscribeOptions as any);

    // Save to server
    const savedPhone = localStorage.getItem('porto_member_phone') ||
                       localStorage.getItem('porto_loyalty_logged_phone') || '';

    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription, phone: savedPhone })
    });

    const result = await response.json();

    if (result.success) {
      console.log('[Push] Successfully subscribed after user action');
      return true;
    }

    return false;
  } catch (error) {
    console.error('[Push] Context-aware subscription failed:', error);
    return false;
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
