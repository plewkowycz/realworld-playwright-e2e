import type { Page } from '@playwright/test';

export async function authenticateWithToken(page: Page, token: string): Promise<void> {
	await page.addInitScript((t: unknown) => {
		window.localStorage.setItem('token', String(t));
	}, token);
}

export async function setTokenAndReload(page: Page, token: string): Promise<void> {
	await page.addInitScript((t: unknown) => {
		window.localStorage.setItem('token', String(t));
	}, token);
	await page.evaluate((t) => localStorage.setItem('token', String(t)), token);
	await page.reload();
}


