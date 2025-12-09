import { faker } from '@faker-js/faker';
import type { APIRequestContext } from '@playwright/test';
import { apiCreateUser, apiLoginUser } from '@_src/api/utilis/users';
import type { ApiUserLogin, ApiUserRegistration, ApiUserResponse } from '@_src/api/models/user.api.model';
import { APP_API_URL } from '@_config/env.config';

export async function createRandomUserViaApi(
	request: APIRequestContext,
	baseApiUrl = APP_API_URL,
): Promise<
	ApiUserResponse & { credentials: { username: string; email: string; password: string } }
> {
	const usernameBase = faker.internet.username().replace(/\W+/g, '').toLowerCase();
	const credentials = {
		username: `${usernameBase}_${faker.string.alphanumeric(6).toLowerCase()}`,
		email: faker.internet.email({ firstName: usernameBase, provider: 'example.com' }).toLowerCase(),
		password: faker.internet.password({ length: 12 })
	};

	const payload: ApiUserRegistration = {
		user: credentials
	};

	const response = await apiCreateUser(request, baseApiUrl, payload);
	return { ...response, credentials };
}

export async function registerAndLoginRandomUserViaApi(
	request: APIRequestContext,
	baseApiUrl = APP_API_URL,
): Promise<
	ApiUserResponse & { credentials: { username: string; email: string; password: string } }
> {
	const registered = await createRandomUserViaApi(request, baseApiUrl);

	const loginPayload: ApiUserLogin = {
		user: {
			email: registered.credentials.email,
			password: registered.credentials.password
		}
	};

	const loginResponse = await apiLoginUser(request, baseApiUrl, loginPayload);
	return { ...loginResponse, credentials: registered.credentials };
}
