import AxeBuilder from '@axe-core/playwright';
import { chromium, request as playwrightRequest } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const base = (process.argv[2] || '').replace(/\/$/, '');
const output = process.argv[3];

if (!base || !output) {
  throw new Error('Usage: node tools/audit-live.mjs <base-url> <evidence-json>');
}

const evidence = {
  base,
  checkedAt: new Date().toISOString(),
  checks: [],
  consoleErrors: [],
};

function passed(name, detail = true) {
  evidence.checks.push({ name, passed: true, detail });
}

const browser = await chromium.launch();
const api = await playwrightRequest.newContext();

try {
  const routeExpectations = {
    '/': ['Demo Loop — Record browser interactions', 'Record a browser interaction for your portfolio'],
    '/demo': ['Demo — Demo Loop', 'Review a sample recording'],
    '/privacy': ['Privacy — Demo Loop', 'Privacy'],
    '/terms': ['Terms — Demo Loop', 'Terms'],
    '/404': ['Page not found — Demo Loop', 'Page not found'],
  };

  const routeContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const routePage = await routeContext.newPage();
  let expectedNotFoundNavigation = false;
  routePage.on('console', (message) => {
    const expected404 = expectedNotFoundNavigation && /Failed to load resource:.*404/i.test(message.text());
    if (message.type() === 'error' && !expected404) evidence.consoleErrors.push(message.text());
  });
  routePage.on('pageerror', (error) => evidence.consoleErrors.push(String(error)));

  for (const [route, [title, heading]] of Object.entries(routeExpectations)) {
    const response = await routePage.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    assert.equal(response?.status(), 200, `${route} should return 200`);
    if (route === '/demo') await routePage.getByText('SAMPLE RECORDING / ISOLATED').waitFor();
    assert.equal(await routePage.title(), title);
    assert.equal(await routePage.locator('h1').textContent(), heading);
    assert.equal(await routePage.locator('h1').count(), 1);
    assert.equal(await routePage.locator('main').count(), 1);
    assert.equal(await routePage.locator('html').getAttribute('lang'), 'en');
    assert.equal(await routePage.locator('link[rel="canonical"]').getAttribute('href'), `${base}${route === '/' ? '/' : route}`);
    assert.match(await routePage.locator('meta[property="og:image"]').getAttribute('content'), /social-card\.jpg$/);
    const axe = await new AxeBuilder({ page: routePage }).analyze();
    const severe = axe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''));
    assert.deepEqual(severe, [], `${route} should have no serious or critical axe findings`);
    const targets = await routePage.locator('a[href], button, input, textarea, select, summary').evaluateAll((elements) => elements.flatMap((element) => {
      if (!(element instanceof HTMLElement) || !element.getClientRects().length || getComputedStyle(element).visibility === 'hidden') return [];
      const target = element instanceof HTMLInputElement && ['checkbox', 'radio'].includes(element.type) ? element.closest('label') || element : element;
      const rect = target.getBoundingClientRect();
      return rect.width + 0.01 < 44 || rect.height + 0.01 < 44 ? [{ html: element.outerHTML.slice(0, 100), width: rect.width, height: rect.height }] : [];
    }));
    assert.deepEqual(targets, [], `${route} should have 44px targets`);
    assert.equal(await routePage.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true);
  }
  passed('route titles, metadata, landmarks, axe, mobile targets, and overflow', Object.keys(routeExpectations));

  expectedNotFoundNavigation = true;
  const missing = await routePage.goto(`${base}/missing-polish-4`, { waitUntil: 'networkidle' });
  expectedNotFoundNavigation = false;
  assert.equal(missing?.status(), 404);
  assert.equal(await routePage.title(), 'Page not found — Demo Loop');
  assert.equal(await routePage.locator('h1').textContent(), 'Page not found');
  await routePage.getByRole('link', { name: 'Return home' }).waitFor();
  await routePage.getByRole('link', { name: 'Open sample demo' }).waitFor();
  passed('unknown paths return the designed HTTP 404');

  await routePage.goto(`${base}/`, { waitUntil: 'networkidle' });
  const foldNames = [
    'Record a browser interaction for your portfolio',
    'Try it with sample data',
    'Media stays in this browser',
    'Nothing is uploaded',
    'Choose 20, 30, or 45 seconds',
  ];
  for (const name of foldNames) {
    const locator = routePage.getByText(name, { exact: true }).first();
    const box = await locator.boundingBox();
    assert.ok(box && box.y >= 0 && box.y + box.height <= 844, `${name} should be in the first mobile viewport`);
  }
  assert.match(await routePage.getByText(/For creative-technology students/).textContent(), /20–45 second video/);
  passed('first mobile screen states the job, audience, action, result, and three facts');

  await routePage.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  assert.equal(await routePage.locator('h1').textContent(), 'Privacy');
  assert.equal(await routePage.locator('h1').evaluate((element) => element === document.activeElement), true);
  await routePage.goBack({ waitUntil: 'networkidle' });
  assert.equal(await routePage.locator('h1').evaluate((element) => element === document.activeElement), true);
  passed('route navigation and browser Back restore h1 focus');
  await routeContext.close();

  const demoContext = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
  await demoContext.addInitScript(() => {
    window.__storageReads = [];
    const getItem = Storage.prototype.getItem;
    Storage.prototype.getItem = function patchedGetItem(key) {
      window.__storageReads.push(String(key));
      return getItem.call(this, key);
    };
  });
  const demoPage = await demoContext.newPage();
  const requestOrigins = new Set();
  demoPage.on('request', (request) => requestOrigins.add(new URL(request.url()).origin));
  demoPage.on('console', (message) => {
    if (message.type() === 'error') evidence.consoleErrors.push(message.text());
  });
  demoPage.on('pageerror', (error) => evidence.consoleErrors.push(String(error)));
  await demoPage.goto(`${base}/?demo=1`, { waitUntil: 'networkidle' });
  await demoPage.getByText('SAMPLE RECORDING / ISOLATED').waitFor();
  assert.equal(await demoPage.title(), 'Demo — Demo Loop');
  await demoPage.getByText('Demo — sample data, nothing is saved').waitFor();
  await demoPage.getByRole('button', { name: 'Reset demo' }).waitFor();
  await demoPage.getByRole('link', { name: 'Start for real' }).waitFor();
  const video = await demoPage.locator('#preview').boundingBox();
  const exportButton = await demoPage.getByRole('button', { name: 'Export WebM' }).boundingBox();
  assert.ok(video && video.y + video.height <= 844);
  assert.ok(exportButton && exportButton.y + exportButton.height <= 844);
  assert.equal(await demoPage.locator('#beat-label').textContent(), 'BEAT — 00:09');
  const databases = await demoPage.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
  assert.deepEqual(databases, ['demo:demo-loop-local']);
  const licenseReads = await demoPage.evaluate(() => window.__storageReads.filter((key) => key.startsWith('sb_license:')));
  assert.deepEqual(licenseReads, []);
  passed('query demo is one-click, first-viewport ready, and opens only isolated demo storage');

  const webmEvent = demoPage.waitForEvent('download');
  await demoPage.getByRole('button', { name: 'Export WebM' }).click();
  const webm = await webmEvent;
  assert.equal(webm.suggestedFilename(), 'kinetic-type-controller.webm');
  const webmPath = await webm.path();
  assert.ok(webmPath);
  assert.ok((await (await import('node:fs/promises')).stat(webmPath)).size > 0);
  const posterEvent = demoPage.waitForEvent('download');
  await demoPage.getByRole('button', { name: 'Export PNG poster' }).click();
  const poster = await posterEvent;
  assert.equal(poster.suggestedFilename(), 'kinetic-type-controller-poster.png');
  const posterPath = await poster.path();
  assert.ok(posterPath);
  assert.ok((await (await import('node:fs/promises')).stat(posterPath)).size > 0);
  assert.deepEqual([...requestOrigins], [new URL(base).origin]);
  passed('live sample exports WebM and PNG with same-origin requests only', { origins: [...requestOrigins] });

  await demoPage.getByLabel('One-line caption').fill('Changed only in the demo');
  await Promise.all([
    demoPage.waitForNavigation({ waitUntil: 'networkidle' }),
    demoPage.getByRole('button', { name: 'Reset demo' }).click(),
  ]);
  await demoPage.getByText('SAMPLE RECORDING / ISOLATED').waitFor();
  assert.equal(await demoPage.getByLabel('One-line caption').inputValue(), 'Turning the dial stretches the projected letters.');
  passed('Reset demo restores the bundled sample');
  await demoContext.close();

  const isolationContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const isolationPage = await isolationContext.newPage();
  await isolationPage.goto(`${base}/`, { waitUntil: 'networkidle' });
  await isolationPage.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const open = indexedDB.open('demo-loop-local', 1);
      open.onupgradeneeded = () => open.result.createObjectStore('takes', { keyPath: 'id' });
      open.onsuccess = () => resolve(open.result);
      open.onerror = () => reject(open.error);
    });
    await new Promise((resolve, reject) => {
      const transaction = db.transaction('takes', 'readwrite');
      transaction.objectStore('takes').put({ id: 'private-round-4', title: 'Private round 4', caption: '', beatMs: 1, durationMs: 2, createdAt: new Date().toISOString(), mimeType: 'video/webm', video: new Blob(['private']) });
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
    db.close();
  });
  await isolationPage.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  await isolationPage.getByText('SAMPLE RECORDING / ISOLATED').waitFor();
  await Promise.all([
    isolationPage.waitForNavigation({ waitUntil: 'networkidle' }),
    isolationPage.getByRole('button', { name: 'Reset demo' }).click(),
  ]);
  await isolationPage.getByText('SAMPLE RECORDING / ISOLATED').waitFor();
  await isolationPage.getByRole('link', { name: 'Start for real' }).click();
  await isolationPage.getByRole('heading', { name: 'Private round 4' }).waitFor();
  const remainingDatabases = await isolationPage.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
  assert.deepEqual(remainingDatabases, ['demo-loop-local']);
  passed('demo reset and exit preserve real recordings and discard demo storage');
  await isolationContext.close();

  const licenseContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const licensePage = await licenseContext.newPage();
  let releaseVerification;
  const verificationMayFinish = new Promise((resolve) => { releaseVerification = resolve; });
  let verificationStarted;
  const verificationDidStart = new Promise((resolve) => { verificationStarted = resolve; });
  await licensePage.route('https://api.sociobot.in/api/v1/products/creative-tech-demo-recorder/verify?license=unverified-live-token', async (route) => {
    verificationStarted();
    await verificationMayFinish;
    await route.fulfill({ json: { valid: false, reason: 'invalid', expires_at: null } });
  });
  await licensePage.goto(`${base}/?license=unverified-live-token`, { waitUntil: 'domcontentloaded' });
  await verificationDidStart;
  await licensePage.getByText('No license on this browser.').waitFor();
  assert.equal(await licensePage.evaluate(() => localStorage.getItem('sb_license:creative-tech-demo-recorder')), 'unverified-live-token');
  assert.equal(await licensePage.evaluate(() => localStorage.getItem('sb_license:creative-tech-demo-recorder:verdict')), null);
  releaseVerification();
  await licensePage.getByText('License no longer active. Free recording remains available.').waitFor();
  passed('returned license tokens stay locked until Sociobot verification completes');
  await licenseContext.close();

  const offlineContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const offlinePage = await offlineContext.newPage();
  offlinePage.on('console', (message) => {
    if (message.type() === 'error') evidence.consoleErrors.push(message.text());
  });
  offlinePage.on('pageerror', (error) => evidence.consoleErrors.push(String(error)));
  await offlinePage.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  await offlinePage.getByText('SAMPLE RECORDING / ISOLATED').waitFor();
  await offlinePage.evaluate(() => navigator.serviceWorker.ready);
  if (!await offlinePage.evaluate(() => Boolean(navigator.serviceWorker.controller))) {
    await offlinePage.reload({ waitUntil: 'networkidle' });
  }
  await offlinePage.getByText('SAMPLE RECORDING / ISOLATED').waitFor();
  await offlineContext.setOffline(true);
  await offlinePage.reload({ waitUntil: 'domcontentloaded' });
  await offlinePage.getByText('SAMPLE RECORDING / ISOLATED').waitFor();
  await offlinePage.getByText('Offline', { exact: true }).waitFor();
  passed('service-worker-controlled demo reloads offline with its sample');
  await offlineContext.setOffline(false);
  await offlineContext.close();

  const assets = ['/', '/demo', '/privacy', '/terms', '/404', '/robots.txt', '/sitemap.xml', '/manifest.webmanifest', '/assets/social-card.jpg', '/icons/apple-touch-icon.png'];
  for (const route of assets) assert.equal((await api.get(`${base}${route}`)).status(), 200, `${route} should return 200`);
  assert.equal((await api.get(`${base}/missing-live-audit`)).status(), 404);
  assert.equal((await api.get('https://sociobot.in/')).status(), 200);
  const checkout = await api.get('https://api.sociobot.in/api/v1/products/creative-tech-demo-recorder/checkout', { maxRedirects: 0 });
  assert.equal(checkout.status(), 303);
  assert.match(checkout.headers().location, /^https:\/\/checkout\.dodopayments\.com\/session\//);
  const homeResponse = await api.get(`${base}/`);
  const headers = homeResponse.headers();
  for (const header of ['content-security-policy', 'permissions-policy', 'x-content-type-options', 'referrer-policy', 'x-frame-options']) assert.ok(headers[header], `${header} should be present`);
  passed('links, app assets, checkout redirect, and security headers respond correctly');

  assert.deepEqual(evidence.consoleErrors, []);
  passed('all audited live contexts have zero console errors');
} finally {
  await api.dispose();
  await browser.close();
}

await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify({ checks: evidence.checks.length, consoleErrors: evidence.consoleErrors.length, output }));
