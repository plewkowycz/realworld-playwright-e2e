import { expect } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';
import type { ApiUserRegistration, ApiUserResponse } from '@_src/api/models/user.api.model';

export async function apiCreateUser(
	request: APIRequestContext,
	baseApiUrl: string,
	payload: ApiUserRegistration
): Promise<ApiUserResponse> {
	const response = await request.post(`${baseApiUrl}/api/users`, {
		data: payload,
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'application/json',
			Referer: `${process.env.APP_API_URL}/`
		},	
	});

	
	if (!response.ok()) {
		const bodyText = await response.text();
		throw new Error(`apiCreateUser failed: ${response.status()} ${response.statusText()} - ${bodyText}`);
	}
	expect(response.status()).toBe(201);
	return (await response.json()) as ApiUserResponse;
}


