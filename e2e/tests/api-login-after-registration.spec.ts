import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { createRandomUserViaApi } from '@_src/api/factories/user.factory';
import { authenticateWithToken } from '@_src/ui/utilis/auth';

test.describe('API Login after Registration', () => {
	test('logs user into UI after API login', async ({ request, page, homePage }) => {
		// Register via API and use returned token to authenticate UI
		const { user } = await createRandomUserViaApi(request);
		expect(user.token).toBeTruthy();

		// Seed token before app loads so Angular picks it up on bootstrap
		await authenticateWithToken(page, user.token);

		// Navigate to Home and verify logged-in UI elements
		await homePage.goto();
		await expect(homePage.newArticleLink).toBeVisible();
		await expect(homePage.settingsLink).toBeVisible();
		await expect(homePage.userProfileImage).toBeVisible();
		// Extra confirmation: auth-only menu visible, anon-only menu hidden
		await expect(homePage.headerNav.signInLink).toBeHidden();
		await expect(homePage.headerNav.signUpLink).toBeHidden();
	});
});


