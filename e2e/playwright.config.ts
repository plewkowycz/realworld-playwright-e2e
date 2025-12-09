import { APP_BASE_URL } from '@_config/env.config';

import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: APP_BASE_URL,
    trace: 'retain-on-failure', // Capture trace for failing tests
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 30_000, // 30 seconds max for actions
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
