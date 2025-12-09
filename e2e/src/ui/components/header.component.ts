import { Locator, Page } from '@playwright/test';

export class HeaderNav {
	private readonly page: Page;
	readonly brandLink: Locator;
	readonly homeLink: Locator;
	readonly signInLink: Locator;
	readonly signUpLink: Locator;

	constructor(page: Page) {
		this.page = page;
		this.brandLink = this.page.getByRole('navigation').getByRole('link', { name: 'conduit' });
		this.homeLink = this.page.getByRole('link', { name: 'Home' });
		this.signInLink = this.page.getByRole('link', { name: 'Sign in' });
		this.signUpLink = this.page.getByRole('link', { name: 'Sign up' });
	}
}


