import { faker } from '@faker-js/faker';
import type { CommentFormData } from '@_src/ui/models/comment.model';

export function buildCommentData(overrides: Partial<CommentFormData> = {}): CommentFormData {
	const body =
		overrides.body ??
		faker.helpers.arrayElement([
			faker.hacker.phrase(),
			faker.lorem.sentence(),
			`cmt_${faker.string.alphanumeric(8).toLowerCase()}`
		]);
	return { body };
}

export function buildCommentText(overrides: Partial<CommentFormData> = {}): string {
	return buildCommentData(overrides).body;
}



