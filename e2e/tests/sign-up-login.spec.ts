import { createRandomUserViaApi } from '@_src/api/factories/user.factory';
import { buildUser, wrongPasswordFor } from '@_src/ui/factories/user.factory';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';

test.describe.serial('Sign-up & Login', () => {
  const user = buildUser();

  test('should register new user and redirect to login', async ({ registerPage, loginPage }) => {
    // Arrange
    await registerPage.goto();
    await expect(registerPage.heading).toBeVisible();

    // Act
    await registerPage.register(user.username, user.email, user.password);

    // Assert
    await expect(registerPage.successToast).toBeVisible();
    await expect(loginPage.heading).toBeVisible();
  });

  test('should login with valid credentials and show authenticated nav', async ({
    request,
    loginPage,
    homePage,
  }) => {
    // Arrange
    await loginPage.goto();
    await expect(loginPage.heading).toBeVisible();
    const apiUser = await createRandomUserViaApi(request);

    // Act
    await loginPage.login(apiUser.credentials.email, apiUser.credentials.password);

    // Assert
    await expect(homePage.newArticleLink).toBeVisible();
    await expect(homePage.settingsLink).toBeVisible();
    await expect(homePage.userProfileImage).toBeVisible();
  });

  // Reason: Backend returns 422 (Unprocessable Entity) for invalid credentials instead of 401.
  // The RealWorld spec is ambiguous; this backend treats wrong password as a validation error.
  test('should show error message for invalid credentials (HTTP 422)', async ({
    request,
    page,
    loginPage,
  }) => {
    // Arrange
    const apiUser = await createRandomUserViaApi(request);
    await loginPage.goto();
    await expect(loginPage.heading).toBeVisible();

    const responsePromise = page.waitForResponse((resp) => {
      return resp.url().includes('/api/users/login') && resp.request().method() === 'POST';
    });

    // Act
    await loginPage.login(apiUser.credentials.email, wrongPasswordFor(apiUser.credentials));
    const response = await responsePromise;

    // Assert
    await expect(loginPage.errorMessages).toBeVisible();
    expect(response.status()).toBe(422);
  });
});
