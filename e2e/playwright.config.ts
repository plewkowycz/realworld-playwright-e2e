import 'dotenv/config';
import { APP_BASE_URL } from '@_config/env.config';
import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';

export const STORAGE_STATE = path.join(__dirname, 'tmp/session.json');

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results',
  globalSetup: require.resolve('./config/global.setup.ts'),
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: APP_BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 0
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});


