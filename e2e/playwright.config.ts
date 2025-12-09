import { APP_BASE_URL } from '@_config/env.config';

import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results',

  /* Test timeouts */
  timeout: 60_000,
  expect: { timeout: 10_000 },

  /* Run tests sequentially - required due to shared database state */
  fullyParallel: false,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: isCI,

  /* Retry failed tests in CI for stability */
  retries: isCI ? 2 : 0,

  /* Single worker to prevent database conflicts */
  workers: 1,

  /* Reporter configuration */
  reporter: isCI
    ? [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]]
    : [['html', { outputFolder: 'playwright-report', open: 'never' }]],

  use: {
    baseURL: APP_BASE_URL,

    /* Timeouts */
    actionTimeout: 30_000,
    navigationTimeout: 30_000,

    /* Artifacts - retain on failure for debugging */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to enable cross-browser testing
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
