import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('home is clear, keyboard reachable, and has no serious accessibility issues', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Capture the cause/);
  await expect(page.getByRole('button', { name: /Choose a tab/ })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
  expect(errors).toEqual([]);
});

test('permission denial leaves a useful retry state', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'mediaDevices', { value: { getDisplayMedia: async () => { throw new DOMException('Denied', 'NotAllowedError'); } } });
  });
  await page.goto('/#recorder');
  await page.getByRole('button', { name: /Choose a tab/ }).click();
  await expect(page.getByRole('status').filter({ hasText: /Nothing was recorded/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Choose a tab/ })).toBeEnabled();
});

test('capture, mark, finish, and export controls work end to end', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium');
  await page.addInitScript(() => {
    Object.defineProperty(navigator.mediaDevices, 'getDisplayMedia', { configurable: true, value: async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 360;
      const context = canvas.getContext('2d')!;
      context.fillStyle = '#007c83';
      context.fillRect(0, 0, 640, 360);
      context.fillStyle = '#f2c84b';
      context.fillRect(100, 100, 180, 160);
      return canvas.captureStream(20);
    }});
  });
  await page.goto('/#recorder');
  await page.getByLabel('One-line caption').fill('A dial changes the shape field.');
  await page.getByRole('button', { name: /Choose a tab/ }).click();
  await expect(page.getByText('CAPTURING / LOCAL')).toBeVisible();
  await page.getByRole('button', { name: /Mark interaction/ }).click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: /Finish take/ }).click();
  await expect(page.getByRole('button', { name: 'Export WebM' })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole('button', { name: 'Export poster' })).toBeVisible();
  await expect(page.locator('.take-card')).toHaveCount(1);
});

test('privacy and terms render as first-class routes', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy, in plain ink');
  await page.goto('/terms');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Terms of use');
});

test('app shell reloads offline after installation', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Capture the cause');
  await expect(page.getByText(/Offline/).first()).toBeVisible();
});
