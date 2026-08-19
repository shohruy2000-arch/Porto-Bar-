import { test, expect } from '@playwright/test';

test.describe('PWA Table Booking Offline Resilience & Sync E2E Suite', () => {

  test('should queue table reservation in IndexedDB when offline and sync when online', async ({ page, context }) => {
    // 1. Initial Cache Hydration: Boot the page and let service worker activate
    await page.goto('/');

    // Wait for the service worker to be ready
    await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.ready;
      }
    });

    // 2. Open BookingModal by clicking "Забронировать столик"
    const openBookingBtn = page.locator('button:has-text("Забронировать столик")');
    await expect(openBookingBtn).toBeVisible();
    await openBookingBtn.click();

    // Verify Modal Header shows up
    const modalHeader = page.locator('h3:has-text("Бронирование стола")');
    await expect(modalHeader).toBeVisible();

    // 3. Step 1: Click "Далее" to proceed to scheme selection (since date/time are prefilled)
    const nextBtn1 = page.locator('button:has-text("Далее")');
    await expect(nextBtn1).toBeVisible();
    await nextBtn1.click();

    // 4. Step 2: Zone & Wishes Selection
    // Switch zone to Veranda to test zone selector
    const verandaToggle = page.locator('button:has-text("Веранда")');
    await expect(verandaToggle).toBeVisible();
    await verandaToggle.click();

    // Switch back to Inside (Зал)
    const insideToggle = page.locator('button:has-text("Внутри (Зал)")');
    await expect(insideToggle).toBeVisible();
    await insideToggle.click();

    // Click on a suggestion chip
    const chip = page.locator('button:has-text("🤫 Уединенное место")');
    await expect(chip).toBeVisible();
    await chip.click();

    // Verify textarea contains the suggestion text
    const textarea = page.locator('textarea[placeholder*="Например: свой алкоголь"]');
    await expect(textarea).toHaveValue('хочется уединенное место, где никто не будет мешать');

    // Proceed to Step 3
    const nextBtn2 = page.locator('button:has-text("Далее")');
    await nextBtn2.click();

    // Verify summary contains the selected zone and wishes
    const zoneSummary = page.locator('text=Внутри (Зал)');
    await expect(zoneSummary).toBeVisible();
    const wishesSummary = page.locator('text=«хочется уединенное место, где никто не будет мешать»');
    await expect(wishesSummary).toBeVisible();

    // 5. Go Offline to test offline queue guard
    await context.setOffline(true);
    console.log('[Test Log] Simulated network connection drop (Offline)');

    // 6. Step 3: Enter guest details
    const nameInput = page.locator('input[placeholder="Иван"]');
    const phoneInput = page.locator('input[placeholder="+7 (999) 123-45-67"]');

    await expect(nameInput).toBeVisible();
    await nameInput.fill('Александр Тест');
    await phoneInput.fill('+79997775544');

    // Submit the reservation form while offline
    const submitBtn = page.locator('button:has-text("Подтвердить")');
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // 7. Assert Branded Offline Success Banner
    const offlineSuccessTitle = page.locator('text=Запрос сохранен офлайн!');
    await expect(offlineSuccessTitle).toBeVisible();

    const offlineSuccessMsg = page.locator('text=Вы находитесь офлайн. Заявка на бронирование надежно сохранена');
    await expect(offlineSuccessMsg).toBeVisible();

    // 8. Verify IndexedDB contents via page evaluation
    console.log('[Test Log] Verifying IndexedDB queued requests for reservations...');
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

    // Find the queued reservation request
    const reservationRequests = queuedRequests.filter(r => r.url === '/api/reservations');
    expect(reservationRequests.length).toBe(1);
    expect(reservationRequests[0].syncTag).toBe('sync-reservations');
    expect(reservationRequests[0].body.name).toBe('Александр Тест');
    expect(reservationRequests[0].body.phone).toBe('+79997775544');
    expect(reservationRequests[0].body.wishes).toBe('хочется уединенное место, где никто не будет мешать');
    expect(reservationRequests[0].body.zone).toBe('inside');
    expect(reservationRequests[0].body.idempotencyKey).toBeDefined();

    console.log('[Test Log] Reservation saved in IndexedDB with key:', reservationRequests[0].body.idempotencyKey);

    // 9. Restore Connection & Sync Verification
    const requestPromise = page.waitForRequest(request =>
      request.url().includes('/api/reservations') && request.method() === 'POST'
    );

    await context.setOffline(false);
    console.log('[Test Log] Simulated network connection restoration (Online)');

    // Trigger online event inside browser to trigger manual sync replay
    await page.evaluate(() => {
      window.dispatchEvent(new Event('online'));
    });

    // Capture sync request
    const replayedRequest = await requestPromise;
    const replayedBody = JSON.parse(replayedRequest.postData() || '{}');

    // Match replayed data to verify idempotency
    expect(replayedBody.idempotencyKey).toBe(reservationRequests[0].body.idempotencyKey);
    expect(replayedBody.name).toBe('Александр Тест');
    expect(replayedBody.wishes).toBe('хочется уединенное место, где никто не будет мешать');
    console.log('[Test Log] Reservation successfully synced from IndexedDB offline queue.');

    // Verify IndexedDB table is clear
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

    console.log('[Test Log] IndexedDB pending queue successfully cleared after reservation sync.');
  });
});
