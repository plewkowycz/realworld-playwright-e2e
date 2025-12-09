import type { Page } from '@playwright/test';

export async function authenticateWithToken(page: Page, token: string): Promise<void> {
	// Ensure token is present before the app initializes so it is picked up on bootstrap
	await page.addInitScript((t: unknown) => {
		window.localStorage.setItem('token', String(t));
	}, token);
}

export async function setTokenAndReload(page: Page, token: string): Promise<void> {
	// Ensure future reloads also use the new token by adding a new init script
	await page.addInitScript((t: unknown) => {
		window.localStorage.setItem('token', String(t));
	}, token);
	// Switch identity during a running test by updating token at runtime and reloading the app
	await page.evaluate((t) => localStorage.setItem('token', String(t)), token);
	await page.reload();
}


