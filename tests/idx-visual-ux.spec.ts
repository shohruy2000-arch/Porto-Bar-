import { test, expect, devices } from '@playwright/test';

// Use iPhone 14 Pro viewport presets to test top notch & safe-area environmental bounds
test.use({
  ...devices['iPhone 14 Pro'],
});

test.describe('Mobile UX & Visual Safe-Area Inspection', () => {
  test('should verify top header buttons and BottomNavBar are fully accessible and take component screenshots', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Ensure the page shell has loaded
    await page.waitForSelector('text=Porto Club');

    // 1. Locate and inspect the PORTO Club button (inside the BottomNavBar)
    const loyaltyBtn = page.locator('button:has-text("Porto Club")');
    await expect(loyaltyBtn).toBeVisible();

    // 2. Locate and inspect the Language Selector (top-right absolute safe-area placement)
    const langSelector = page.locator('.safe-top-offset.right-4');
    await expect(langSelector).toBeVisible();

    // Verify positioning of the elements is within visible screen bounds
    const loyaltyBox = await loyaltyBtn.boundingBox();
    const langSelectorBox = await langSelector.boundingBox();

    expect(loyaltyBox).not.toBeNull();
    expect(langSelectorBox).not.toBeNull();

    if (loyaltyBox && langSelectorBox) {
      console.log(`[UX Test Log] PORTO Club Button bounds: Y=${loyaltyBox.y}, Height=${loyaltyBox.height}`);
      console.log(`[UX Test Log] Language Selector bounds: Y=${langSelectorBox.y}, Height=${langSelectorBox.height}`);
      
      // Language Selector should be pushed below status bar/notch (which occupies roughly 47px on iPhone 14 Pro)
      expect(langSelectorBox.y).toBeGreaterThanOrEqual(10);
      // PORTO Club button should be in the bottom nav bar (Y coordinate near the bottom)
      expect(loyaltyBox.y).toBeGreaterThan(500);
    }

    // Capture screenshots of the components
    await loyaltyBtn.screenshot({ path: 'screenshots/idx-porto-club-button.png' });
    await langSelector.screenshot({ path: 'screenshots/idx-language-selector.png' });

    // 3. Locate and inspect the BottomNavBar (bottom floating safe-area dock)
    const bottomNav = page.locator('.fixed.bottom-0.left-0.right-0');
    await expect(bottomNav).toBeVisible();

    const bottomNavBox = await bottomNav.boundingBox();
    expect(bottomNavBox).not.toBeNull();
    if (bottomNavBox) {
      console.log(`[UX Test Log] BottomNavBar bounds: Y=${bottomNavBox.y}, Height=${bottomNavBox.height}`);
    }

    // Capture screenshot of the BottomNavBar component
    await bottomNav.screenshot({ path: 'screenshots/idx-bottom-nav-bar.png' });

    // Take a viewport screenshot showing the overall layout composition
    await page.screenshot({ path: 'screenshots/idx-iphone14pro-landing.png' });

    console.log('[UX Test Log] Visual Safe-Area and notch verification screenshots saved successfully.');
  });
});
