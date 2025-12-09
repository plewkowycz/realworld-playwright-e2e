import { Locator, Page } from '@playwright/test';

export class ProfilePage {
	private readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async goto(username: string): Promise<void> {
		await this.page.goto(`/#/profile/${username}`);
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

	profileHeadingByUsername(username: string): Locator {
		return this.page.getByRole('heading', { name: username });
	}

	followButton(username: string): Locator {
		const escaped = username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		return this.page.getByRole('button', { name: new RegExp(`Follow\\s+${escaped}`, 'i') });
	}

	unfollowButton(username: string): Locator {
		const escaped = username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		return this.page.getByRole('button', { name: new RegExp(`Unfollow\\s+${escaped}`, 'i') });
	}
}


