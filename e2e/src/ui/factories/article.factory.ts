import { faker } from '@faker-js/faker';
import type { ArticleFormData } from '@_src/ui/models/article.model';

export function buildArticleData(overrides: Partial<ArticleFormData> = {}): ArticleFormData {
	const title = overrides.title ?? `Article ${faker.string.alphanumeric(6)}`;
	const description = overrides.description ?? faker.lorem.words(3);
	const body = overrides.body ?? faker.lorem.sentences(2);
	const tags =
		overrides.tags ??
		Array.from(
			new Set([
				faker.helpers.arrayElement(['playwright', 'e2e', 'testing', 'angular', 'django']),
				faker.hacker.noun()
			])
		).slice(0, 3) as string[];

	return { title, description, body, tags };
}


