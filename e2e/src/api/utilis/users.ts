import type {
  ApiUserLogin,
  ApiUserRegistration,
  ApiUserResponse,
} from '../models/user.api.model';

import { expect } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';

export async function apiCreateUser(
  request: APIRequestContext,
  baseApiUrl: string,
  payload: ApiUserRegistration,
): Promise<ApiUserResponse> {
  const response = await request.post(`${baseApiUrl}/api/users`, {
    data: payload,
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok()) {
    const bodyText = await response.text();
    console.error('[apiCreateUser] Response details:', {
      status: response.status(),
      statusText: response.statusText(),
      body: bodyText,
    });
    throw new Error(`apiCreateUser failed: ${response.status()}`);
  }
  expect(response.status()).toBe(201);
  return (await response.json()) as ApiUserResponse;
}

export async function apiLoginUser(
  request: APIRequestContext,
  baseApiUrl: string,
  payload: ApiUserLogin,
): Promise<ApiUserResponse> {
  const response = await request.post(`${baseApiUrl}/api/users/login`, {
    data: payload,
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok()) {
    const bodyText = await response.text();
    console.error('[apiLoginUser] Response details:', {
      status: response.status(),
      statusText: response.statusText(),
      body: bodyText,
    });
    throw new Error(`apiLoginUser failed: ${response.status()}`);
  }
  expect(response.status()).toBe(200);
  return (await response.json()) as ApiUserResponse;
}
