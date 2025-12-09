import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { createRandomUserViaApi } from '@_src/api/factories/user.factory';
import { authenticateWithToken } from '@_src/ui/utilis/auth';
import { buildArticleData } from '@_src/ui/factories/article.factory';

test.describe('Articles - Create, Edit, Delete', () => {
	let username: string;

	test.beforeEach(async ({ request, page, homePage }) => {
		// Create a fresh user and authenticate UI with the token
		const { user } = await createRandomUserViaApi(request);
		username = user.username;
		await authenticateWithToken(page, user.token);
		await homePage.goto();
	});

	test('Create article and see it in user Articles', async ({ page, homePage, articlePage, profilePage }) => {
		// Confirm logged-in header
		await expect(homePage.headerNav.brandLink.page().getByRole('link', { name: username })).toBeVisible();

		// Create article
		await homePage.newArticleLink.click();
		await expect(articlePage.editorHeading).toBeVisible();
		const data = buildArticleData();
		await articlePage.fillForm(data);
		await articlePage.publish();
		// Editor shows success toast after publish; it does not navigate to article view automatically
		await expect(page.getByText('Published successfully!')).toBeVisible();

		// Verify in user's Articles (profile page list)
		await homePage.userProfileImage.click();
		await expect(profilePage.articlesTabByUsername(username)).toBeVisible();
		await expect(page.getByRole('link', { name: `${username}'s Articles` })).toBeVisible();
		await expect(page.getByRole('link', { name: username, exact: true })).toBeVisible();
		await expect(page.locator('h1')).toContainText(data.title);
		await expect(profilePage.articleLinkByTitle(data.title)).toBeVisible();
	});

	test('Create, then edit body and tags - changes visible', async ({ page, homePage, articlePage, profilePage }) => {
		// Create article
		await homePage.newArticleLink.click();
		await expect(articlePage.editorHeading).toBeVisible();
		const data = buildArticleData();
		await articlePage.fillForm(data);
		await articlePage.publish();
		await expect(homePage.headerNav.brandLink).toBeVisible();

		// Open article from profile
		await homePage.userProfileImage.click();
		await profilePage.articleLinkByTitle(data.title).click();
		await expect(articlePage.editButton).toBeVisible();

		// Edit
		await articlePage.clickEdit();
		await expect(articlePage.editorHeading).toBeVisible();
		const newBody = `EDITED: ${buildArticleData().body}`;
		const newTags = ['edited', 'update'];
		await articlePage.bodyInput.fill(newBody);
		for (const tag of newTags) {
			await articlePage.tagsInput.fill(tag);
			await articlePage.tagsInput.press('Enter');
		}
		await articlePage.publish();
		// Editor shows success toast after publish
		await expect(homePage.headerNav.brandLink.page().getByText('Published successfully!')).toBeVisible();
		// Open the article view and verify body updated
		await homePage.userProfileImage.click();
		await profilePage.articleLinkByTitle(data.title).click();
		await expect(articlePage.titleHeading).toContainText(data.title);
		await expect(page.getByText('edited')).toBeVisible();
		await expect(page.getByText('update')).toBeVisible();

		// Back to profile, still present
		await homePage.userProfileImage.click();
		await expect(profilePage.articleLinkByTitle(data.title)).toBeVisible();
	});

	test('Create and delete article - disappears from lists', async ({ homePage, profilePage, articlePage }) => {
		// Create article
		await homePage.newArticleLink.click();
		await expect(articlePage.editorHeading).toBeVisible();
		const data = buildArticleData();
		await articlePage.fillForm(data);
		await articlePage.publish();
		await expect(homePage.headerNav.brandLink).toBeVisible();

		// Open article and delete
		await homePage.userProfileImage.click();
		await profilePage.articleLinkByTitle(data.title).click();
		await expect(articlePage.deleteButton).toBeVisible();
		await articlePage.clickDelete();

		// Verify removed from profile
		await homePage.userProfileImage.click();
		await expect(profilePage.articleLinkByTitle(data.title)).toHaveCount(0);

		// Verify removed from Home
		await homePage.headerNav.homeLink.click();
		await expect(
			homePage.headerNav.brandLink.page().getByRole('link', { name: new RegExp(data.title, 'i') })
		).toHaveCount(0);
	});
});


