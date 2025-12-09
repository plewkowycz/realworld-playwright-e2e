import { faker } from '@faker-js/faker';
import type { APIRequestContext } from '@playwright/test';
import { apiCreateUser } from '@_src/api/utilis/users';
import type { ApiUserRegistration, ApiUserResponse } from '@_src/api/models/user.api.model';
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
