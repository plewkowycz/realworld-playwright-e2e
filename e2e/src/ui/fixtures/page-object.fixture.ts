import { test as baseTest } from '@playwright/test';
import { HomePage } from '@_src/ui/pages/home.page';
import { LoginPage } from '@_src/ui/pages/login.page';
import { RegisterPage } from '@_src/ui/pages/register.page';

interface Pages {
	homePage: HomePage;
	loginPage: LoginPage;
	registerPage: RegisterPage;
}

export const pageObjectTest = baseTest.extend<Pages>({
	homePage: async ({ page }, use) => {
		await use(new HomePage(page));
	},
	loginPage: async ({ page }, use) => {
		await use(new LoginPage(page));
	},
	registerPage: async ({ page }, use) => {
		await use(new RegisterPage(page));
	}
});


