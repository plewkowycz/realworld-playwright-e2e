import { expect, test } from '@_src/ui/fixtures/merge.fixture';

test.describe('Smoke Test', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('Home page renders key elements', async ({ homePage }) => {
    await expect(homePage.headerNav.brandLink).toBeVisible();
    await expect(homePage.headerNav.homeLink).toBeVisible();
    await expect(homePage.headerNav.signInLink).toBeVisible();
    await expect(homePage.headerNav.signUpLink).toBeVisible();

    await expect(homePage.heroHeading).toBeVisible();
    await expect(homePage.heroSubheading).toBeVisible();
    await expect(homePage.globalFeedTab).toBeVisible();

    await expect(homePage.popularTagsPanel).toBeVisible();
    await expect.soft(homePage.emptyFeedState).toBeVisible();
  });
});