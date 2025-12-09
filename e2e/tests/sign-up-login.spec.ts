import { createRandomUserViaApi } from '@_src/api/factories/user.factory';
import { buildUser, wrongPasswordFor } from '@_src/ui/factories/user.factory';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';

test.describe.serial('Sign-up & Login', () => {
  const user = buildUser();

  test('Register a new user and log in successfully', async ({ registerPage, loginPage }) => {
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

  // Reason: Backend returns 422 (Unprocessable Entity) for invalid credentials instead of 401.
  // The RealWorld spec is ambiguous; this backend treats wrong password as a validation error.
  test('Attempt login with wrong password shows error (expect 422)', async ({
    request,
    page,
    loginPage,
  }) => {
    const apiUser = await createRandomUserViaApi(request);
    await loginPage.goto();
    await expect(loginPage.heading).toBeVisible();

    const responsePromise = page.waitForResponse((resp) => {
      return resp.url().includes('/api/users/login') && resp.request().method() === 'POST';
    });
    await loginPage.login(apiUser.credentials.email, wrongPasswordFor(apiUser.credentials));

    const response = await responsePromise;
    await expect(loginPage.errorMessages).toBeVisible();
    expect(response.status()).toBe(422);
  });
});
