import { Locator, Page } from '@playwright/test';

export class ProfilePage {
	private readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	articleLinkByTitle(title: string): Locator {
		return this.page.getByRole('link', { name: new RegExp(title, 'i') });
	}

	articlesTabByUsername(username: string): Locator {
		return this.page.getByRole('link', { name: `${username}'s Articles` });
	}

	favoritedArticlesTabByUsername(username: string): Locator {
		return this.page.getByRole('link', { name: `${username}'s Favorited Articles` });
	}
}


