import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { buildUser, wrongPasswordFor } from '@_src/ui/factories/user.factory';
import { createRandomUserViaApi } from '@_src/api/factories/user.factory';

test.describe.serial('Sign-up & Login', () => {
	const user = buildUser();

	test('Register a new user and log in successfully', async ({registerPage, loginPage, homePage }) => {
		await registerPage.goto();
		await expect(registerPage.heading).toBeVisible();
		await registerPage.register(user.username, user.email, user.password);
		await expect(registerPage.successToast).toBeVisible();
		await expect(loginPage.heading).toBeVisible();
	});

	test('Log in successfully', async ({ request, loginPage, homePage }) => {
		await loginPage.goto();
		await expect(loginPage.heading).toBeVisible();
		const apiUser = await createRandomUserViaApi(request);
		await loginPage.login(apiUser.credentials.email, apiUser.credentials.password);
		await expect(homePage.newArticleLink).toBeVisible();
		await expect(homePage.settingsLink).toBeVisible();
		await expect(homePage.userProfileImage).toBeVisible();
	});

	test('Attempt login with wrong password shows error (expect 401)', async ({ page, loginPage }) => {
		await loginPage.goto();
		await expect(loginPage.heading).toBeVisible();
		const responsePromise = page.waitForResponse((resp) => {
			return resp.url().includes('/api/users/login') && resp.request().method() === 'POST';
		});
		await loginPage.login(user.email, wrongPasswordFor(user));
		const response = await responsePromise;
		await expect(loginPage.errorMessages).toBeVisible();
		expect(response.status()).toBe(401);
	});
});
