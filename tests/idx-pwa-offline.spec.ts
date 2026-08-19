import { test, expect } from '@playwright/test';

test.describe('PWA Offline Resilience & Sync Automation Suite', () => {

  test('should queue order in IndexedDB when offline and sync when network is restored', async ({ page, context }) => {
    // 1. Initial Cache Hydration: Boot the page and let service worker activate
    await page.goto('/');
    
    // Wait for the service worker to be ready
    await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.ready;
      }
    });

    // Verify page has loaded by checking for standard items
    const dishCard = page.locator('.glass-panel h3.font-serif').first();
    await expect(dishCard).toBeVisible();

    // 2. Add item to the cart
    // Click the "Plus" add to cart button on the first dish card
    const firstDishAddBtn = page.locator('button:has(svg.lucide-plus)').first();
    await expect(firstDishAddBtn).toBeVisible();
    await firstDishAddBtn.click();

    // Verify that the cart badge on the Room Service navigation item gets updated to 1
    const cartCountBadge = page.locator('button:has(svg.lucide-phone-call) span.absolute');
    await expect(cartCountBadge).toHaveText('1');

    // 3. Simulate Connection Drop (Go Offline)
    await context.setOffline(true);
    console.log('[Test Log] Simulated network connection drop (Offline)');

    // 4. Open RoomServiceModal (Room Service Checkout Form)
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.querySelector('svg.lucide-phone-call'));
      if (btn) (btn as HTMLElement).click();
    });

    // Inside step 1 (Cart Review): Click checkout confirm button
    const checkoutBtn = page.locator('button:has-text("Оформить заказ")');
    await expect(checkoutBtn).toBeVisible();
    await checkoutBtn.click();

    // Inside step 2 (Details Form): Fill in the order fields
    const roomInput = page.locator('input[placeholder="e.g. 1205"]');
    const phoneInput = page.locator('input[type="tel"]');
    
    await expect(roomInput).toBeVisible();
    await roomInput.fill('777');
    await phoneInput.fill('+79998887766');

    // Submit the order while offline
    const submitOrderBtn = page.locator('button:has-text("Отправить заказ")');
    await submitOrderBtn.click();

    // 5. Assert Offline Banner / Success Screen
    // Verify that the modal shows the successful offline preservation message
    const successTitle = page.locator('text=Заказ сохранен офлайн!');
    await expect(successTitle).toBeVisible();

    const successDetail = page.locator('text=Вы находитесь офлайн. Ваш заказ надежно сохранен');
    await expect(successDetail).toBeVisible();

    // 6. Verify IndexedDB contents via page-level evaluation
    console.log('[Test Log] Verifying IndexedDB queued requests...');
    const queuedRequests = await page.evaluate(async () => {
      return new Promise<any[]>((resolve, reject) => {
        const DB_NAME = 'porto-bar-offline';
        const STORE_NAME = 'pending-requests';
        
        const openRequest = indexedDB.open(DB_NAME, 1);
        
        openRequest.onsuccess = () => {
          const db = openRequest.result;
          try {
            const tx = db.transaction([STORE_NAME], 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const getAllRequest = store.getAll();
            
            getAllRequest.onsuccess = () => {
              resolve(getAllRequest.result);
            };
            getAllRequest.onerror = () => {
              reject(getAllRequest.error);
            };
          } catch (e) {
            reject(e);
          }
        };
        
        openRequest.onerror = () => {
          reject(openRequest.error);
        };
      });
    });

    expect(queuedRequests.length).toBe(1);
    expect(queuedRequests[0].url).toBe('/api/orders');
    expect(queuedRequests[0].syncTag).toBe('sync-orders');
    expect(queuedRequests[0].body.phone).toBe('+79998887766');
    expect(queuedRequests[0].body.roomNumber).toBe('777');
    expect(queuedRequests[0].body.idempotencyKey).toBeDefined();

    console.log('[Test Log] Order successfully preserved in IndexedDB with idempotencyKey:', queuedRequests[0].body.idempotencyKey);

    // 7. Network Restoration: Re-enable the connection
    // Intercept/listen for the outgoing network request to /api/orders
    const requestPromise = page.waitForRequest(request => 
      request.url().includes('/api/orders') && request.method() === 'POST'
    );

    await context.setOffline(false);
    console.log('[Test Log] Simulated network connection restoration (Online)');

    // Trigger online event inside browser to fire the manual fallback sync listener instantly
    await page.evaluate(() => {
      window.dispatchEvent(new Event('online'));
    });

    // Wait for the replayed HTTP request and capture its payload
    const replayedRequest = await requestPromise;
    const replayedBody = JSON.parse(replayedRequest.postData() || '{}');

    // 8. Sync Verification
    // Ensure the replayed request contains the exact same idempotencyKey
    expect(replayedBody.idempotencyKey).toBe(queuedRequests[0].body.idempotencyKey);
    expect(replayedBody.phone).toBe('+79998887766');
    console.log('[Test Log] Outgoing sync request matched the offline idempotencyKey successfully.');

    // Verify database has cleared the record
    await page.waitForFunction(async () => {
      return new Promise<boolean>((resolve) => {
        const openRequest = indexedDB.open('porto-bar-offline', 1);
        openRequest.onsuccess = () => {
          const db = openRequest.result;
          try {
            const tx = db.transaction(['pending-requests'], 'readonly');
            const store = tx.objectStore('pending-requests');
            const countRequest = store.count();
            countRequest.onsuccess = () => {
              resolve(countRequest.result === 0);
            };
            countRequest.onerror = () => resolve(false);
          } catch (e) {
            resolve(false);
          }
        };
        openRequest.onerror = () => resolve(false);
      });
    }, { timeout: 8000 });

    console.log('[Test Log] Checked IndexedDB: queue has been cleared after successful sync replay.');
  });

  test('should automatically add free Pizza Margherita to Room Service order when total >= 3000', async ({ page, context }) => {
    await page.goto('/');

    // Wait for the service worker
    await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.ready;
      }
    });

    // Add items until the total >= 3000 (click the first dish add button multiple times)
    const firstDishAddBtn = page.locator('button:has(svg.lucide-plus)').first();
    await expect(firstDishAddBtn).toBeVisible();

    // Click 6 times to exceed 3000 rubles
    for (let i = 0; i < 6; i++) {
      await firstDishAddBtn.click();
      await page.waitForTimeout(100);
    }

    // Verify cart badge count is 6
    const cartCountBadge = page.locator('button:has(svg.lucide-phone-call) span.absolute');
    await expect(cartCountBadge).toHaveText('6');

    // Open checkout modal
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.querySelector('svg.lucide-phone-call'));
      if (btn) (btn as HTMLElement).click();
    });

    // Verify promotion banner is eligible
    const promoEligibleBanner = page.locator('text=Вы получили Пиццу Маргарита в подарок');
    await expect(promoEligibleBanner).toBeVisible();

    // Proceed to Step 2
    const checkoutBtn = page.locator('button:has-text("Оформить заказ")');
    await expect(checkoutBtn).toBeVisible();
    await checkoutBtn.click();

    // Fill details
    const roomInput = page.locator('input[placeholder="e.g. 1205"]');
    const phoneInput = page.locator('input[type="tel"]');
    await roomInput.fill('888');
    await phoneInput.fill('+79991112233');

    // Go offline
    await context.setOffline(true);

    // Submit order
    const submitOrderBtn = page.locator('button:has-text("Отправить заказ")');
    await submitOrderBtn.click();

    // Verify offline success screen
    const successTitle = page.locator('text=Заказ сохранен офлайн!');
    await expect(successTitle).toBeVisible();

    // Verify gift confirmation is displayed in the success screen details
    const giftLabel = page.locator('text=🎁 Подарок по акции:');
    await expect(giftLabel).toBeVisible();
    const giftName = page.locator('div.glass-panel').locator('span:has-text("Пицца Маргарита")');
    await expect(giftName).toBeVisible();

    // Check IndexedDB
    const queuedRequests = await page.evaluate(async () => {
      return new Promise<any[]>((resolve, reject) => {
        const DB_NAME = 'porto-bar-offline';
        const STORE_NAME = 'pending-requests';
        const openRequest = indexedDB.open(DB_NAME, 1);
        openRequest.onsuccess = () => {
          const db = openRequest.result;
          try {
            const tx = db.transaction([STORE_NAME], 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const getAllRequest = store.getAll();
            getAllRequest.onsuccess = () => resolve(getAllRequest.result);
            getAllRequest.onerror = () => reject(getAllRequest.error);
          } catch (e) { reject(e); }
        };
        openRequest.onerror = () => reject(openRequest.error);
      });
    });

    expect(queuedRequests.length).toBe(1);
    const orderBody = queuedRequests[0].body;
    expect(orderBody.phone).toBe('+79991112233');
    expect(orderBody.roomNumber).toBe('888');

    // Find Pizza Margherita (dish-10) in the items list with price 0
    const giftItem = orderBody.items.find((item: any) => item.dishId === 'dish-10');
    expect(giftItem).toBeDefined();
    expect(giftItem.quantity).toBe(1);
    expect(giftItem.priceAtOrder).toBe(0);

    console.log('[Test Log] Verified order items in IndexedDB contains Pizza Margherita (dish-10) at price 0.');

    // Restore Connection & Sync Verification
    const requestPromise = page.waitForRequest(request => 
      request.url().includes('/api/orders') && request.method() === 'POST'
    );

    await context.setOffline(false);
    console.log('[Test Log] Simulated network connection restoration (Online)');

    await page.evaluate(() => {
      window.dispatchEvent(new Event('online'));
    });

    // Capture replayed request
    const replayedRequest = await requestPromise;
    const replayedBody = JSON.parse(replayedRequest.postData() || '{}');
    expect(replayedBody.idempotencyKey).toBe(queuedRequests[0].body.idempotencyKey);
    
    // Verify the replayed request also contains the gift item
    const replayedGiftItem = replayedBody.items.find((item: any) => item.dishId === 'dish-10');
    expect(replayedGiftItem).toBeDefined();
    expect(replayedGiftItem.priceAtOrder).toBe(0);

    console.log('[Test Log] Verified replayed sync request contains Pizza Margherita (dish-10) at price 0.');
  });
});

