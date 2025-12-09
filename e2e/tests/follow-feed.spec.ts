import { registerAndLoginRandomUserViaApi } from '@_src/api/factories/user.factory';
import { buildArticleData } from '@_src/ui/factories/article.factory';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { authenticateWithToken, setTokenAndReload } from '@_src/ui/utilis/auth';

test.describe('Follow Feed', () => {
  test('Article from followed user appears in Your Feed', async ({
    request,
    page,
    homePage,
    profilePage,
    articlePage,
  }) => {
    let articleTitle = '';
    const userA = await registerAndLoginRandomUserViaApi(request);
    const userB = await registerAndLoginRandomUserViaApi(request);

    await test.step('User A follows User B', async () => {
      await authenticateWithToken(page, userA.user.token);
      await homePage.goto();

      await profilePage.goto(userB.user.username);
      await expect(profilePage.profileHeadingByUsername(userB.user.username)).toBeVisible();
      await profilePage.followButton(userB.user.username).click();
      await expect(profilePage.unfollowButton(userB.user.username)).toBeVisible();
    });

    await test.step('Log out as User A (UI)', async () => {
      await homePage.settingsLink.click();
      await expect(page.getByRole('heading', { name: /Your Settings/i })).toBeVisible();
      await page.getByRole('button', { name: /Or click here to logout\./i }).click();
      await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
    });

    await test.step('User B publishes a new article', async () => {
      await setTokenAndReload(page, userB.user.token);
      await homePage.goto();
      await expect(
        page.getByRole('link', {
          name: new RegExp(`User profile image\\s+${userB.user.username}`),
        }),
      ).toBeVisible();
      await homePage.newArticleLink.click();
      await expect(articlePage.editorHeading).toBeVisible();
      const article = buildArticleData();

      articleTitle = article.title;
      await articlePage.fillForm(article);
      await articlePage.publish();

      await expect(page.getByText('Published successfully!')).toBeVisible();
      await profilePage.goto(userB.user.username);
      await expect(profilePage.articleLinkByTitle(articleTitle)).toBeVisible();
    });

    await test.step('Log out as User B (UI)', async () => {
      await homePage.settingsLink.click();
      await expect(page.getByRole('heading', { name: /Your Settings/i })).toBeVisible();
      await page.getByRole('button', { name: /Or click here to logout\./i }).click();
      await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
    });

    await test.step('Article shows up in User A’s Your Feed', async () => {
      await setTokenAndReload(page, userA.user.token);

      await homePage.goto();
      await expect(
        page.getByRole('link', {
          name: new RegExp(`User profile image\\s+${userA.user.username}`),
        }),
      ).toBeVisible();
      await homePage.globalFeedTab.click();
      await homePage.yourFeedTab.click();

      await expect(homePage.articleLinkByTitle(articleTitle)).toBeVisible();
    });
  });
});
