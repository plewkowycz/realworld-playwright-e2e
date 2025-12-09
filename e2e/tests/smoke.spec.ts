import { expect, test } from '@_src/ui/fixtures/merge.fixture';

test.describe('Smoke Test', () => {
  test.beforeEach(async ({ homePage }) => {
    // Arrange: navigate to home page
    await homePage.goto();
  });

  test('should render all key navigation and content elements', async ({ homePage }) => {
    // Assert: navigation elements
    await expect(homePage.headerNav.brandLink).toBeVisible();
    await expect(homePage.headerNav.homeLink).toBeVisible();
    await expect(homePage.headerNav.signInLink).toBeVisible();
    await expect(homePage.headerNav.signUpLink).toBeVisible();

    // Assert: hero section
    await expect(homePage.heroHeading).toBeVisible();
    await expect(homePage.heroSubheading).toBeVisible();

    // Assert: content sections
    await expect(homePage.globalFeedTab).toBeVisible();
    await expect(homePage.popularTagsPanel).toBeVisible();
  });
});
