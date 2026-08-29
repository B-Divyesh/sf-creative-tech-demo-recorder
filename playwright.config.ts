import { defineConfig, devices } from '@playwright/test';

const testPort = Number(process.env.PW_TEST_PORT || 4173);
const testOrigin = `http://127.0.0.1:${testPort}`;

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 7_000 },
  use: {
    baseURL: testOrigin,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `npm run build && npm run preview:test -- --port ${testPort}`,
    url: testOrigin,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
});
