import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { createRandomUserViaApi } from '@_src/api/factories/user.factory';
import { authenticateWithToken } from '@_src/ui/utilis/auth';
import { buildArticleData } from '@_src/ui/factories/article.factory';

test.describe('Articles - Create, Edit, Delete', () => {
	let username: string;

	test.beforeEach(async ({ request, page, homePage }) => {
		const { user } = await createRandomUserViaApi(request);
		username = user.username;
		await authenticateWithToken(page, user.token);
		await homePage.goto();
	});

	test('Create article and see it in user Articles', async ({ page, homePage, articlePage, profilePage }) => {
		await expect(homePage.headerNav.brandLink.page().getByRole('link', { name: username })).toBeVisible();

		await homePage.newArticleLink.click();
		await expect(articlePage.editorHeading).toBeVisible();
		const data = buildArticleData();
		await articlePage.fillForm(data);
		await articlePage.publish();
		await expect(page.getByText('Published successfully!')).toBeVisible();

		await homePage.userProfileImage.click();
		await expect(profilePage.articlesTabByUsername(username)).toBeVisible();
		await expect(page.getByRole('link', { name: `${username}'s Articles` })).toBeVisible();
		await expect(page.getByRole('link', { name: username, exact: true })).toBeVisible();
		await expect(page.locator('h1')).toContainText(data.title);
		await expect(profilePage.articleLinkByTitle(data.title)).toBeVisible();
	});

	test('Create, then edit body and tags - changes visible', async ({ page, homePage, articlePage, profilePage }) => {
		await homePage.newArticleLink.click();
		await expect(articlePage.editorHeading).toBeVisible();
		const data = buildArticleData();
		await articlePage.fillForm(data);
		await articlePage.publish();
		await expect(homePage.headerNav.brandLink).toBeVisible();

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

		await expect(homePage.headerNav.brandLink.page().getByText('Published successfully!')).toBeVisible();

		await homePage.userProfileImage.click();
		await profilePage.articleLinkByTitle(data.title).click();
		await expect(articlePage.titleHeading).toContainText(data.title);

		const tagList = page.locator('ul.tag-list');
		await expect(tagList.getByText('edited', { exact: true })).toBeVisible();
		await expect(tagList.getByText('update', { exact: true })).toBeVisible();

		await homePage.userProfileImage.click();
		await expect(profilePage.articleLinkByTitle(data.title)).toBeVisible();
	});

	test('Create and delete article - disappears from lists', async ({ homePage, profilePage, articlePage }) => {
		await homePage.newArticleLink.click();
		await expect(articlePage.editorHeading).toBeVisible();
		const data = buildArticleData();
		await articlePage.fillForm(data);
		await articlePage.publish();
		await expect(homePage.headerNav.brandLink).toBeVisible();

		await homePage.userProfileImage.click();
		await profilePage.articleLinkByTitle(data.title).click();
		await expect(articlePage.deleteButton).toBeVisible();
		await articlePage.clickDelete();

		await homePage.userProfileImage.click();
		await expect(profilePage.articleLinkByTitle(data.title)).toHaveCount(0);

		await homePage.headerNav.homeLink.click();
		await expect(
			homePage.headerNav.brandLink.page().getByRole('link', { name: new RegExp(data.title, 'i') })
		).toHaveCount(0);
	});
});
