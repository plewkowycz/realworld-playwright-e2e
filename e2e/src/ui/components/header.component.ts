import { Locator, Page } from '@playwright/test';

export class HeaderNav {
	private readonly page: Page;
	readonly brandLink: Locator;
	readonly homeLink: Locator;
	readonly signInLink: Locator;
	readonly signUpLink: Locator;

	constructor(page: Page) {
		this.page = page;
		const nav = this.page.getByRole('navigation');
		this.brandLink = nav.getByRole('link', { name: 'conduit' });
		this.homeLink = nav.getByRole('link', { name: 'Home' });
		this.signInLink = nav.getByRole('link', { name: 'Sign in' });
		this.signUpLink = nav.getByRole('link', { name: 'Sign up' });
	}
}


