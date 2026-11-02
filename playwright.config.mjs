import { defineConfig, devices } from '@playwright/test';

const base = process.env.E2E_BASE_PATH || '';
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  outputDir: 'test-results',
  use: {
    baseURL: `http://127.0.0.1:4188${base}/`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        launchOptions: { firefoxUserPrefs: { 'network.proxy.type': 0 } },
      },
    },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], channel: 'chromium', viewport: { width: 390, height: 844 } },
    },
    {
      name: 'small-screen',
      use: {
        browserName: 'chromium',
        channel: 'chromium',
        viewport: { width: 320, height: 568 },
        hasTouch: true,
      },
    },
    {
      name: 'landscape',
      use: {
        browserName: 'chromium',
        channel: 'chromium',
        viewport: { width: 844, height: 390 },
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: 'node server.mjs --dist',
    url: `http://127.0.0.1:4188${base}/`,
    env: { PORT: '4188', BASE_PATH: base },
    reuseExistingServer: false,
  },
});
