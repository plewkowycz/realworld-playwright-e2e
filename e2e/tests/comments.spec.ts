import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { createRandomUserViaApi } from '@_src/api/factories/user.factory';
import { authenticateWithToken } from '@_src/ui/utilis/auth';
import { buildArticleData } from '@_src/ui/factories/article.factory';
import { buildCommentText } from '@_src/ui/factories/comment.factory';

test.describe('Comments', () => {
	let username: string;

	test.beforeEach(async ({ request, page, homePage }) => {
		const { user } = await createRandomUserViaApi(request);
		username = user.username;
		await authenticateWithToken(page, user.token);
		await homePage.goto();
	});

	test('Add a comment → it displays', async ({ page, homePage, articlePage, profilePage }) => {
		await homePage.newArticleLink.click();
		await expect(articlePage.editorHeading).toBeVisible();
		const data = buildArticleData();
		await articlePage.fillForm(data);
		await articlePage.publish();
		await expect(page.getByText('Published successfully!')).toBeVisible();

		await homePage.userProfileImage.click();
		await profilePage.articleLinkByTitle(data.title).click();
		await expect(articlePage.editButton).toBeVisible();

		const commentText = buildCommentText();
		await articlePage.addComment(commentText);
		await expect(articlePage.commentByText(commentText)).toBeVisible();
	});

	test('Delete the comment → it disappears', async ({ page, homePage, articlePage, profilePage }) => {
		await homePage.newArticleLink.click();
		await expect(articlePage.editorHeading).toBeVisible();
		const data = buildArticleData();
		await articlePage.fillForm(data);
		await articlePage.publish();
		await expect(page.getByText('Published successfully!')).toBeVisible();

		await homePage.userProfileImage.click();
		await profilePage.articleLinkByTitle(data.title).click();
		await expect(articlePage.editButton).toBeVisible();

		const commentText = buildCommentText();
		await articlePage.addComment(commentText);
		await expect(articlePage.commentByText(commentText)).toBeVisible();
		await articlePage.deleteCommentByText(commentText);
		await expect(articlePage.commentByText(commentText)).toHaveCount(0);
	});
});
