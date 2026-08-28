import { expect, test, type Page } from '@playwright/test';
import sharp from 'sharp';

async function installSyntheticCapture(page: Page, width = 640, height = 360): Promise<void> {
  await page.addInitScript(({ width, height }) => {
    Object.defineProperty(navigator.mediaDevices, 'getDisplayMedia', { configurable: true, value: async () => {
      const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
      const context = canvas.getContext('2d')!; context.fillStyle = '#006a71'; context.fillRect(0, 0, width, height); context.fillStyle = '#f2c84b'; context.fillRect(width / 6, height / 4, width / 3, height / 2);
      return canvas.captureStream(20);
    }});
  }, { width, height });
}

async function recordOnce(page: Page, name: string): Promise<void> {
  await page.getByLabel('Recording name').fill(name);
  await page.getByRole('button', { name: /Choose a tab/ }).click();
  await expect(page.getByText('RECORDING / LOCAL')).toBeVisible();
  await page.waitForTimeout(450);
  await page.getByRole('button', { name: /Mark interaction/ }).click();
  await page.waitForTimeout(150);
  await page.getByRole('button', { name: /Finish recording/ }).click();
  await expect(page.getByRole('button', { name: 'Export WebM' })).toBeVisible({ timeout: 15_000 });
}

test('@claim:sample-demo-isolated opens a finished sample and never changes the real database', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile');
  await page.goto('/');
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => { const request = indexedDB.open('demo-loop-local', 1); request.onupgradeneeded = () => request.result.createObjectStore('takes', { keyPath: 'id' }); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
    await new Promise<void>((resolve, reject) => { const transaction = db.transaction('takes', 'readwrite'); transaction.objectStore('takes').put({ id: 'real-recording', title: 'Private real recording', caption: '', beatMs: 1, durationMs: 2, createdAt: new Date().toISOString(), mimeType: 'video/webm', video: new Blob(['real']) }); transaction.oncomplete = () => resolve(); transaction.onerror = () => reject(transaction.error); }); db.close();
  });
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('SAMPLE RECORDING / ISOLATED')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Kinetic type controller' })).toBeVisible();
  expect(await page.evaluate(() => indexedDB.databases().then((items) => items.map((item) => item.name).sort()))).toEqual(['demo-loop-local', 'demo:demo-loop-local']);
  page.once('dialog', (dialog) => dialog.accept()); await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('heading', { name: 'Kinetic type controller' })).toBeVisible();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByRole('heading', { name: 'Private real recording' })).toBeVisible();
  expect(await page.evaluate(() => indexedDB.databases().then((items) => items.map((item) => item.name)))).not.toContain('demo:demo-loop-local');
});

test('@claim:local-only-network keeps the complete sample flow on the product origin', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile');
  const origins = new Set<string>(); page.on('request', (request) => origins.add(new URL(request.url()).origin));
  await page.goto('/?demo=1'); await expect(page.getByText('SAMPLE RECORDING / ISOLATED')).toBeVisible();
  const video = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export WebM' }).click(); await video;
  const poster = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export PNG poster' }).click(); await poster;
  expect([...origins]).toEqual(['http://127.0.0.1:4173']);
});

test('@claim:offline-reload reloads the sample workspace offline', async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile');
  await page.goto('/demo'); await page.evaluate(() => navigator.serviceWorker.ready); await page.reload();
  await context.setOffline(true); await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Review a sample interaction recording');
  await expect(page.getByText('Offline').first()).toBeVisible();
  await expect(page.getByText('SAMPLE RECORDING / ISOLATED')).toBeVisible();
});

test('@claim:capture-length-options offers and applies 20, 30, and 45 second limits', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile'); await page.goto('/demo');
  await expect(page.getByLabel('Maximum length').locator('option')).toHaveText(['20 seconds', '30 seconds', '45 seconds']);
  for (const seconds of ['20', '30', '45']) { await page.getByLabel('Maximum length').selectOption(seconds); await expect(page.locator('#end-label')).toHaveText(`00:${seconds}`); }
});

test('@claim:explicit-capture asks for screen access only after the record action', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile');
  await page.addInitScript(() => { (window as unknown as { captureCalls: number }).captureCalls = 0; Object.defineProperty(navigator, 'mediaDevices', { value: { getDisplayMedia: async () => { (window as unknown as { captureCalls: number }).captureCalls += 1; throw new DOMException('Denied', 'NotAllowedError'); } } }); });
  await page.goto('/'); expect(await page.evaluate(() => (window as unknown as { captureCalls: number }).captureCalls)).toBe(0);
  await page.getByRole('button', { name: /Choose a tab/ }).click(); expect(await page.evaluate(() => (window as unknown as { captureCalls: number }).captureCalls)).toBe(1);
});

test('@claim:keyboard-motion supports keyboard focus and reduced-motion settings', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile'); await installSyntheticCapture(page); await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/');
  await page.keyboard.press('Tab'); await expect(page.locator('.skip-link')).toBeFocused(); await page.keyboard.press('Enter'); await expect(page.locator('#main')).toBeVisible();
  const duration = await page.getByRole('link', { name: 'Try it with sample data' }).evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.001);
  await page.getByRole('button', { name: /Choose a tab/ }).focus(); await page.keyboard.press('Enter'); await expect(page.getByText('RECORDING / LOCAL')).toBeVisible();
  await page.keyboard.press('m'); await expect(page.locator('#beat-label')).not.toHaveText(/NOT MARKED/); await page.keyboard.press('s'); await expect(page.getByRole('button', { name: 'Export WebM' })).toBeVisible({ timeout: 15_000 });
});

test('@claim:microphone-mix adds an optional microphone track to the recording stream', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile'); await installSyntheticCapture(page);
  await page.addInitScript(() => {
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { configurable: true, value: async () => { const context = new AudioContext(); const oscillator = context.createOscillator(); const destination = context.createMediaStreamDestination(); oscillator.connect(destination); oscillator.start(); return destination.stream; } });
    const NativeRecorder = MediaRecorder;
    window.MediaRecorder = new Proxy(NativeRecorder, { construct(target, argumentsList) { (window as unknown as { mixedAudioTracks: number }).mixedAudioTracks = (argumentsList[0] as MediaStream).getAudioTracks().length; return Reflect.construct(target, argumentsList); } });
  });
  await page.goto('/'); await page.getByLabel('Add microphone').check(); await page.getByRole('button', { name: /Choose a tab/ }).click();
  await expect(page.getByText('RECORDING / LOCAL')).toBeVisible(); expect(await page.evaluate(() => (window as unknown as { mixedAudioTracks: number }).mixedAudioTracks)).toBe(1); await page.keyboard.press('s');
});

test('@claim:webm-export downloads the sample recording as WebM', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile'); await page.goto('/demo'); await expect(page.getByText('SAMPLE RECORDING / ISOLATED')).toBeVisible();
  const pending = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export WebM' }).click(); const download = await pending;
  const path = await download.path(); expect(download.suggestedFilename()).toBe('kinetic-type-controller.webm'); expect((await (await import('node:fs/promises')).stat(path!)).size).toBeGreaterThan(1_000);
});

test('@claim:poster-export downloads a non-empty PNG poster', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile'); await page.goto('/demo'); await expect(page.getByText('SAMPLE RECORDING / ISOLATED')).toBeVisible();
  const pending = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export PNG poster' }).click(); const download = await pending; const path = await download.path();
  expect(download.suggestedFilename()).toBe('kinetic-type-controller-poster.png'); expect(path).toBeTruthy(); expect((await sharp(path!).metadata()).format).toBe('png');
});

test('@claim:local-persistence keeps a real recording after reload', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile'); await installSyntheticCapture(page); await page.goto('/'); await recordOnce(page, 'Reload proof'); await page.reload(); await expect(page.getByRole('heading', { name: 'Reload proof' })).toBeVisible();
});

test('@claim:backup-roundtrip exports and imports the complete local recording list', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile'); await page.goto('/demo'); await expect(page.getByRole('heading', { name: 'Kinetic type controller' })).toBeVisible();
  const pending = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export JSON backup' }).click(); const download = await pending; const path = await download.path();
  const backup = JSON.parse(await (await import('node:fs/promises')).readFile(path!, 'utf8')); expect(backup.takes).toHaveLength(1); expect(backup.takes[0].video).toMatch(/^data:video\/webm;base64,/);
  page.once('dialog', (dialog) => dialog.accept()); await page.getByRole('button', { name: 'Delete' }).click(); await expect(page.locator('.take-card')).toHaveCount(0);
  await page.locator('#restore-input').setInputFiles(path!); await expect(page.getByRole('heading', { name: 'Kinetic type controller' })).toBeVisible();
});

test('@claim:free-save-limit keeps three recordings while WebM, PNG, and JSON exports remain available', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile'); await installSyntheticCapture(page); await page.goto('/');
  await page.evaluate(async () => { const db = await new Promise<IDBDatabase>((resolve) => { const request = indexedDB.open('demo-loop-local', 1); request.onsuccess = () => resolve(request.result); }); const tx = db.transaction('takes', 'readwrite'); for (let index = 1; index <= 3; index += 1) tx.objectStore('takes').put({ id: `free-${index}`, title: `Saved ${index}`, caption: '', beatMs: 1, durationMs: 2, createdAt: new Date(Date.now() + index).toISOString(), mimeType: 'video/webm', video: new Blob(['saved']) }); await new Promise((resolve) => { tx.oncomplete = resolve; }); db.close(); });
  await page.reload(); await recordOnce(page, 'Fourth unsaved'); await expect(page.locator('.take-card')).toHaveCount(3); await expect(page.getByRole('button', { name: 'Export WebM' })).toBeVisible(); await expect(page.getByRole('button', { name: 'Export PNG poster' })).toBeVisible();
  const pending = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export JSON backup' }).click(); const backup = JSON.parse(await (await pending).createReadStream().then(async (stream) => { let content = ''; for await (const chunk of stream) content += chunk.toString(); return content; })); expect(backup.takes).toHaveLength(3);
});

test('@claim:paid-unlimited verifies a returned license and saves a fourth recording', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile'); await installSyntheticCapture(page);
  await page.route('https://api.sociobot.in/api/v1/products/creative-tech-demo-recorder/verify?license=returned-token', (route) => route.fulfill({ json: { valid: true, reason: 'ok', expires_at: null } }));
  await page.goto('/?license=returned-token'); await expect(page).toHaveURL('/'); await expect(page.getByText('Loop Pass active on this browser.')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('sb_license:creative-tech-demo-recorder'))).toBe('returned-token');
  await page.evaluate(async () => { const db = await new Promise<IDBDatabase>((resolve) => { const request = indexedDB.open('demo-loop-local', 1); request.onsuccess = () => resolve(request.result); }); const tx = db.transaction('takes', 'readwrite'); for (let index = 1; index <= 3; index += 1) tx.objectStore('takes').put({ id: `paid-${index}`, title: `Paid ${index}`, caption: '', beatMs: 1, durationMs: 2, createdAt: new Date(Date.now() + index).toISOString(), mimeType: 'video/webm', video: new Blob(['saved']) }); await new Promise((resolve) => { tx.oncomplete = resolve; }); db.close(); });
  await page.reload(); await recordOnce(page, 'Paid fourth'); await expect(page.locator('.take-card')).toHaveCount(4);
});

test('@claim:paid-poster produces a 1920-pixel poster for a verified Loop Pass', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile'); await installSyntheticCapture(page, 1920, 1080);
  await page.addInitScript(() => { localStorage.setItem('sb_license:creative-tech-demo-recorder', 'cached-token'); localStorage.setItem('sb_license:creative-tech-demo-recorder:verdict', JSON.stringify({ valid: true, checkedAt: Date.now() })); });
  await page.goto('/'); await recordOnce(page, 'Wide poster'); const pending = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export PNG poster' }).click(); const path = await (await pending).path(); expect((await sharp(path!).metadata()).width).toBe(1920);
});

test('@claim:license-restore verifies a pasted license through the production API origin', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile'); let verificationUrl = '';
  await page.route('https://api.sociobot.in/api/v1/products/creative-tech-demo-recorder/verify?license=pasted-token', (route) => { verificationUrl = route.request().url(); return route.fulfill({ json: { valid: true, reason: 'ok', expires_at: null } }); });
  await page.goto('/'); await page.getByText('Have a license?').click(); await page.getByLabel('Paste license token').fill('pasted-token'); await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('Loop Pass active on this browser.')).toBeVisible(); expect(verificationUrl).toMatch(/^https:\/\/api\.sociobot\.in\/api\/v1\//);
});

test('@claim:license-revocation keeps paid features locked for an inactive license', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile'); await page.route('https://api.sociobot.in/api/v1/products/creative-tech-demo-recorder/verify?license=revoked-token', (route) => route.fulfill({ json: { valid: false, reason: 'revoked', expires_at: null } }));
  await page.goto('/'); await page.getByText('Have a license?').click(); await page.getByLabel('Paste license token').fill('revoked-token'); await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('License no longer active. Free recording remains available.')).toBeVisible(); await expect(page.getByRole('link', { name: 'Buy Loop Pass' })).toBeVisible();
});

test('@claim:live-checkout redirects from Sociobot to the hosted $9 Dodo checkout', async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile'); await page.goto('/'); const href = await page.getByRole('link', { name: 'Buy Loop Pass' }).getAttribute('href');
  expect(href).toBe('https://api.sociobot.in/api/v1/products/creative-tech-demo-recorder/checkout'); const redirect = await request.get(href!, { maxRedirects: 0 }); expect(redirect.status()).toBe(303); expect(redirect.headers().location).toMatch(/^https:\/\/checkout\.dodopayments\.com\/session\//);
  const checkout = await request.get(redirect.headers().location); const content = await checkout.text(); expect(content).toContain('$9'); expect(content).toContain('One-time unlock');
});
