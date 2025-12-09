import { test as baseTest } from '@playwright/test';
import { HomePage } from '@_src/ui/pages/home.page';
import { LoginPage } from '@_src/ui/pages/login.page';
import { RegisterPage } from '@_src/ui/pages/register.page';
import { ArticlePage } from '@_src/ui/pages/article.page';
import { ProfilePage } from '@_src/ui/pages/profile.page';

interface Pages {
	homePage: HomePage;
	loginPage: LoginPage;
	registerPage: RegisterPage;
	articlePage: ArticlePage;
	profilePage: ProfilePage;
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
	},
	articlePage: async ({ page }, use) => {
		await use(new ArticlePage(page));
	},
	profilePage: async ({ page }, use) => {
		await use(new ProfilePage(page));
	}
});


