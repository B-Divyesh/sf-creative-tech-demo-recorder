import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

test('home is clear, keyboard reachable, and accessible', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Record a browser interaction for your portfolio');
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
  expect(errors).toEqual([]);
});

test('the complete first-screen message fits in the mobile viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  await page.goto('/');
  const firstScreenCopy = [
    'Record a browser interaction for your portfolio',
    'For creative-technology students who need a 20–45 second video of a prototype working.',
    'Try it with sample data',
    'Opens a finished recording, poster, and marked beat.',
    'Media stays in this browser',
    'Nothing is uploaded',
    'Choose 20, 30, or 45 seconds',
  ];
  for (const text of firstScreenCopy) {
    const box = await page.getByText(text, { exact: true }).first().boundingBox();
    expect(box, `${text} should be visible`).not.toBeNull();
    expect(box!.y, `${text} should start inside the viewport`).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height, `${text} should end inside the viewport`).toBeLessThanOrEqual(844);
  }
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
  const response = await page.goto('/missing-page');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found — Demo Loop');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await expect(page.getByText('ERROR 404')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return home' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open sample demo' })).toBeVisible();
});

test('deployment config routes known pages and leaves unknown paths to the 404 override', async () => {
  const config = JSON.parse(await readFile('public/staticwebapp.config.json', 'utf8'));
  expect(config.navigationFallback).toBeUndefined();
  expect(config.routes.slice(0, 5)).toEqual([
    { route: '/', rewrite: '/index.html' },
    { route: '/demo', rewrite: '/demo/index.html' },
    { route: '/privacy', rewrite: '/privacy/index.html' },
    { route: '/terms', rewrite: '/terms/index.html' },
    { route: '/404', rewrite: '/404/index.html' },
  ]);
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
});

test('metadata points to a real 180-pixel Apple touch icon', async ({ page, request }) => {
  await page.goto('/privacy');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/icons/apple-touch-icon.png');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('sizes', '180x180');
  const response = await request.get('/icons/apple-touch-icon.png');
  expect(response.status()).toBe(200);
  expect(await sharp(await response.body()).metadata()).toMatchObject({ width: 180, height: 180, format: 'png' });
});

test('mobile routes keep every visible control at least 44 pixels', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  for (const route of ['/', '/demo', '/privacy', '/terms', '/404']) {
    await page.goto(route);
    if (route === '/demo') await expect(page.getByText('SAMPLE RECORDING / ISOLATED')).toBeVisible();
    const failures = await page.locator('a[href], button, input, textarea, select, summary').evaluateAll((elements) => elements.flatMap((element) => {
      if (!(element instanceof HTMLElement) || !element.getClientRects().length || getComputedStyle(element).visibility === 'hidden') return [];
      const effectiveTarget = element instanceof HTMLInputElement && ['checkbox', 'radio'].includes(element.type) ? element.closest('label') || element : element;
      const rect = effectiveTarget.getBoundingClientRect();
      return rect.width + 0.01 < 44 || rect.height + 0.01 < 44 ? [{ element: element.outerHTML.slice(0, 140), width: rect.width, height: rect.height }] : [];
    }));
    expect(failures, `${route} has undersized touch targets`).toEqual([]);
  }
});

test('essential helper and status copy stays at 16 pixels or larger', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  await page.goto('/demo');
  await expect(page.getByText('SAMPLE RECORDING / ISOLATED')).toBeVisible();
  const selectors = ['.demo-banner', '.demo-intro > p:last-child', '.demo-sample-meta span', '.stage-topline', '.timeline-labels', '.status-message', '.support-note', '.take-card p:not(.take-number)', '.take-card span', '.site-footer'];
  for (const selector of selectors) {
    const sizes = await page.locator(selector).evaluateAll((elements) => elements.map((element) => Number.parseFloat(getComputedStyle(element).fontSize)));
    expect(sizes.length, `${selector} should exist`).toBeGreaterThan(0);
    expect(Math.min(...sizes), `${selector} should use readable text`).toBeGreaterThanOrEqual(16);
  }
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

test('demo result and export action are visible in the first viewport', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('SAMPLE RECORDING / ISOLATED')).toBeVisible();
  await expect(page.getByText('Turning the dial stretches the projected letters.').first()).toBeVisible();
  await expect(page.locator('#beat-label')).toHaveText('BEAT — 00:09');
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const size = await page.getByRole('button', { name: /Choose a tab/ }).boundingBox();
  expect(size?.height).toBeGreaterThanOrEqual(44);
  const video = await page.locator('#preview').boundingBox();
  const sampleAction = await page.getByRole('button', { name: 'Export WebM' }).boundingBox();
  const viewportHeight = page.viewportSize()!.height;
  expect(video).not.toBeNull();
  expect(sampleAction).not.toBeNull();
  expect(video!.y).toBeGreaterThanOrEqual(0);
  expect(video!.y + video!.height).toBeLessThanOrEqual(viewportHeight);
  expect(sampleAction!.y + sampleAction!.height).toBeLessThanOrEqual(viewportHeight);
  const another = page.getByRole('button', { name: 'Record another interaction' });
  await expect(another).toBeVisible();
  expect(await another.evaluate((element) => {
    const style = getComputedStyle(element);
    return style.color === style.backgroundColor;
  })).toBe(false);
  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
});

test('query-string demo entry opens the same isolated sample controls', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Demo Loop');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('SAMPLE RECORDING / ISOLATED')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start for real' })).toBeVisible();
});

test('factory footer uses the reachable canonical destination', async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile');
  await page.goto('/');
  const link = page.getByRole('link', { name: 'Built by Param Factory' });
  await expect(link).toHaveAttribute('href', 'https://sociobot.in/');
  expect((await request.get('https://sociobot.in/', { timeout: 15_000 })).status()).toBe(200);
});

test('a returned license waits for Sociobot verification before enabling paid features', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile');
  let releaseVerification!: () => void;
  const verificationMayFinish = new Promise<void>((resolve) => { releaseVerification = resolve; });
  let verificationStarted!: () => void;
  const verificationDidStart = new Promise<void>((resolve) => { verificationStarted = resolve; });
  await page.route('https://api.sociobot.in/api/v1/products/creative-tech-demo-recorder/verify?license=unverified-token', async (route) => {
    verificationStarted();
    await verificationMayFinish;
    await route.fulfill({ json: { valid: false, reason: 'invalid', expires_at: null } });
  });

  await page.goto('/?license=unverified-token');
  await verificationDidStart;
  await expect(page).toHaveURL('/');
  await expect(page.getByText('No license on this browser.')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('sb_license:creative-tech-demo-recorder'))).toBe('unverified-token');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:creative-tech-demo-recorder:verdict'))).toBeNull();

  releaseVerification();
  await expect(page.getByText('License no longer active. Free recording remains available.')).toBeVisible();
});

for (const route of ['/', '/demo', '/privacy', '/terms', '/404']) {
  test(`route ${route} has no serious or critical axe findings`, async ({ page }) => {
    await page.goto(route);
    if (route === '/demo') await expect(page.getByText('SAMPLE RECORDING / ISOLATED')).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
  });
}
