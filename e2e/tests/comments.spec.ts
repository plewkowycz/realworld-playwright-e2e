import { createRandomUserViaApi } from '@_src/api/factories/user.factory';
import { buildArticleData } from '@_src/ui/factories/article.factory';
import { buildCommentText } from '@_src/ui/factories/comment.factory';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { authenticateWithToken } from '@_src/ui/utils/auth';

test.describe('Comments', () => {
  test.beforeEach(async ({ request, page, homePage, articlePage, profilePage }) => {
    // Arrange: create user, authenticate, and create an article to comment on
    const { user } = await createRandomUserViaApi(request);
    await authenticateWithToken(page, user.token);
    await homePage.goto();

    // Create article for comments
    const data = buildArticleData();
    await homePage.newArticleLink.click();
    await expect(articlePage.editorHeading).toBeVisible();
    await articlePage.fillForm(data);
    await articlePage.publish();
    await expect(page.getByText('Published successfully!')).toBeVisible();

    // Navigate to the article
    await homePage.userProfileImage.click();
    await profilePage.articleLinkByTitle(data.title).click();
    await expect(articlePage.editButton).toBeVisible();
  });

  test('should display newly added comment on article', async ({ articlePage }) => {
    // Arrange
    const commentText = buildCommentText();

    // Act
    await articlePage.addComment(commentText);

    // Assert
    await expect(articlePage.commentByText(commentText)).toBeVisible();
  });

  test('should remove comment after deletion', async ({ articlePage }) => {
    // Arrange: add a comment first
    const commentText = buildCommentText();
    await articlePage.addComment(commentText);
    await expect(articlePage.commentByText(commentText)).toBeVisible();

    // Act
    await articlePage.deleteCommentByText(commentText);

    // Assert
    await expect(articlePage.commentByText(commentText)).toHaveCount(0);
  });
});
