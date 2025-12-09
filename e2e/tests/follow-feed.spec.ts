import { registerAndLoginRandomUserViaApi } from '@_src/api/factories/user.factory';
import { buildArticleData } from '@_src/ui/factories/article.factory';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { authenticateWithToken, setTokenAndReload } from '@_src/ui/utils/auth';

test.describe('Follow Feed', () => {
  test('should display followed user article in Your Feed', async ({
    request,
    page,
    homePage,
    profilePage,
    articlePage,
  }) => {
    // Arrange: create two users
    let articleTitle = '';
    const userA = await registerAndLoginRandomUserViaApi(request);
    const userB = await registerAndLoginRandomUserViaApi(request);

    await test.step('User A follows User B', async () => {
      // Arrange: authenticate as User A
      await authenticateWithToken(page, userA.user.token);
      await homePage.goto();

      // Act: follow User B
      await profilePage.goto(userB.user.username);
      await expect(profilePage.profileHeadingByUsername(userB.user.username)).toBeVisible();
      await profilePage.followButton(userB.user.username).click();

      // Assert: follow button changed to unfollow
      await expect(profilePage.unfollowButton(userB.user.username)).toBeVisible();
    });

    await test.step('User A logs out', async () => {
      // Act: logout via settings
      await homePage.settingsLink.click();
      await expect(page.getByRole('heading', { name: /Your Settings/i })).toBeVisible();
      await page.getByRole('button', { name: /Or click here to logout\./i }).click();

      // Assert: redirected to public view
      await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
    });

    await test.step('User B publishes a new article', async () => {
      // Arrange: authenticate as User B
      await setTokenAndReload(page, userB.user.token);
      await homePage.goto();
      await expect(
        page.getByRole('link', {
          name: new RegExp(`User profile image\\s+${userB.user.username}`),
        }),
      ).toBeVisible();

      // Act: create and publish article
      await homePage.newArticleLink.click();
      await expect(articlePage.editorHeading).toBeVisible();
      const article = buildArticleData();
      articleTitle = article.title;
      await articlePage.fillForm(article);
      await articlePage.publish();

      // Assert: article published successfully
      await expect(page.getByText('Published successfully!')).toBeVisible();
      await profilePage.goto(userB.user.username);
      await expect(profilePage.articleLinkByTitle(articleTitle)).toBeVisible();
    });

    await test.step('User B logs out', async () => {
      // Act: logout via settings
      await homePage.settingsLink.click();
      await expect(page.getByRole('heading', { name: /Your Settings/i })).toBeVisible();
      await page.getByRole('button', { name: /Or click here to logout\./i }).click();

      // Assert: redirected to public view
      await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
    });

    await test.step('User A sees article in Your Feed', async () => {
      // Arrange: authenticate as User A
      await setTokenAndReload(page, userA.user.token);
      await homePage.goto();
      await expect(
        page.getByRole('link', {
          name: new RegExp(`User profile image\\s+${userA.user.username}`),
        }),
      ).toBeVisible();

      // Act: navigate to Your Feed
      await homePage.globalFeedTab.click();
      await homePage.yourFeedTab.click();

      // Assert: followed user's article is visible
      await expect(homePage.articleLinkByTitle(articleTitle)).toBeVisible();
    });
  });
});
