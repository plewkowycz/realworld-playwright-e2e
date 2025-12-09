import type { Page } from '@playwright/test';

export async function authenticateWithToken(page: Page, token: string): Promise<void> {
	// Ensure token is present before the app initializes so it is picked up on bootstrap
	await page.addInitScript((t: unknown) => {
		window.localStorage.setItem('token', String(t));
	}, token);
}


