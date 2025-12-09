import { createRandomUserViaApi } from '@_src/api/factories/user.factory';
import { buildArticleData } from '@_src/ui/factories/article.factory';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { authenticateWithToken } from '@_src/ui/utils/auth';

test.describe('Articles CRUD', () => {
  let username: string;

  test.beforeEach(async ({ request, page, homePage }) => {
    // Arrange: create and authenticate user
    const { user } = await createRandomUserViaApi(request);
    username = user.username;
    await authenticateWithToken(page, user.token);
    await homePage.goto();
  });

  test('should display newly created article in user profile', async ({
    page,
    homePage,
    articlePage,
    profilePage,
  }) => {
    // Arrange
    await expect(page.getByRole('link', { name: username })).toBeVisible();
    const data = buildArticleData();

    // Act
    await homePage.newArticleLink.click();
    await expect(articlePage.editorHeading).toBeVisible();
    await articlePage.fillForm(data);
    await articlePage.publish();

    // Assert
    await expect(page.getByText('Published successfully!')).toBeVisible();
    await homePage.userProfileImage.click();
    await expect(profilePage.articlesTabByUsername(username)).toBeVisible();
    await expect(page.getByRole('link', { name: `${username}'s Articles` })).toBeVisible();
    await expect(page.getByRole('link', { name: username, exact: true })).toBeVisible();
    await expect(page.locator('h1')).toContainText(data.title);
    await expect(profilePage.articleLinkByTitle(data.title)).toBeVisible();
  });

  test('should persist body and tag edits after publishing', async ({
    page,
    homePage,
    articlePage,
    profilePage,
  }) => {
    // Arrange: create initial article
    const data = buildArticleData();
    await homePage.newArticleLink.click();
    await expect(articlePage.editorHeading).toBeVisible();
    await articlePage.fillForm(data);
    await articlePage.publish();
    await expect(homePage.headerNav.brandLink).toBeVisible();

    // Act: edit the article
    await homePage.userProfileImage.click();
    await profilePage.articleLinkByTitle(data.title).click();
    await expect(articlePage.editButton).toBeVisible();
    await articlePage.clickEdit();
    await expect(articlePage.editorHeading).toBeVisible();

    const newBody = `EDITED: ${buildArticleData().body}`;
    const newTags = ['edited', 'update'];
    await articlePage.bodyInput.fill(newBody);
    await articlePage.addTags(newTags);
    await articlePage.publish();

    // Assert: changes are visible
    await expect(page.getByText('Published successfully!')).toBeVisible();
    await homePage.userProfileImage.click();
    await profilePage.articleLinkByTitle(data.title).click();
    await expect(articlePage.titleHeading).toContainText(data.title);

    const tagList = page.locator('ul.tag-list');
    await expect(tagList.getByText('edited', { exact: true })).toBeVisible();
    await expect(tagList.getByText('update', { exact: true })).toBeVisible();

    await homePage.userProfileImage.click();
    await expect(profilePage.articleLinkByTitle(data.title)).toBeVisible();
  });

  test('should remove deleted article from profile and home feed', async ({
    page,
    homePage,
    profilePage,
    articlePage,
  }) => {
    // Arrange: create article
    const data = buildArticleData();
    await homePage.newArticleLink.click();
    await expect(articlePage.editorHeading).toBeVisible();
    await articlePage.fillForm(data);
    await articlePage.publish();
    await expect(homePage.headerNav.brandLink).toBeVisible();

    // Act: delete the article
    await homePage.userProfileImage.click();
    await profilePage.articleLinkByTitle(data.title).click();
    await expect(articlePage.deleteButton).toBeVisible();
    await articlePage.clickDelete();

    // Assert: article no longer visible
    await homePage.userProfileImage.click();
    await expect(profilePage.articleLinkByTitle(data.title)).toHaveCount(0);

    await homePage.headerNav.homeLink.click();
    await expect(page.getByRole('link', { name: new RegExp(data.title, 'i') })).toHaveCount(0);
  });
});
