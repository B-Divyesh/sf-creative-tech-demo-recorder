import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('home is clear, keyboard reachable, and accessible', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Record a portfolio interaction demo');
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
  expect(errors).toEqual([]);
});

test('demo and legal routes have their own titles, metadata, focus, and landmarks', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  await expect(page).toHaveTitle('Privacy — Demo Loop');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.goto('/terms');
  await expect(page).toHaveTitle('Terms — Demo Loop');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/terms$/);
  await page.goto('/demo');
  await expect(page).toHaveTitle('Demo — Demo Loop');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /social-card\.jpg$/);
  await expect(page.locator('main')).toHaveCount(1);
});

test('unknown paths render the designed 404 with recovery links', async ({ page }) => {
  await page.goto('/missing-page');
  await expect(page).toHaveTitle('Page not found — Demo Loop');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await expect(page.getByRole('link', { name: 'Return home' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open sample demo' })).toBeVisible();
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

test('mobile layout has no horizontal overflow and keeps primary targets large', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  await page.goto('/demo');
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const size = await page.getByRole('button', { name: /Choose a tab/ }).boundingBox();
  expect(size?.height).toBeGreaterThanOrEqual(44);
  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
});

for (const route of ['/', '/demo', '/privacy', '/terms', '/404']) {
  test(`route ${route} has no serious or critical axe findings`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
  });
}
