import type { User } from '@_src/ui/models/user.model';

import { faker } from '@faker-js/faker';

export function buildUser(): User {
  const usernameBase = faker.internet.username().replace(/\W+/g, '').toLowerCase();
  const suffix = faker.string.alphanumeric(6).toLowerCase();
  const username = `${usernameBase}_${suffix}`;
  const email = faker.internet
    .email({ firstName: usernameBase, provider: 'example.com' })
    .toLowerCase();
  const password = faker.internet.password({ length: 12 });
  return { username, email, password };
}

export function wrongPasswordFor(_user: User): string {
  return `${faker.internet.password({ length: 10 })}!wrong`;
}
