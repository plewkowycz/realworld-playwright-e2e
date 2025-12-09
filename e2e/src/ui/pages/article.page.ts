import { Locator, Page } from '@playwright/test';

export class ArticlePage {
  private readonly page: Page;
  readonly titleHeading: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;
  readonly bodyContent: Locator;
  readonly tagList: Locator;
  readonly commentTextarea: Locator;
  readonly postCommentButton: Locator;
  readonly editorHeading: Locator;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly bodyInput: Locator;
  readonly tagsInput: Locator;
  readonly publishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleHeading = this.page.getByRole('heading', { level: 1 });
    this.editButton = this.page.getByRole('button', { name: /Edit Article/i }).first();
    this.deleteButton = this.page.getByRole('button', { name: /Delete Article/i }).first();
    this.bodyContent = this.page.locator('.article-content');
    this.tagList = this.page.locator('ul.tag-list');
    this.commentTextarea = this.page.getByRole('textbox', { name: /Write a comment\.\.\./i });
    this.postCommentButton = this.page.getByRole('button', { name: /Post Comment/i });
    this.editorHeading = this.page.getByRole('heading', { name: /Article editor/i });
    this.titleInput = this.page.getByRole('textbox', { name: 'Article Title' });
    this.descriptionInput = this.page.getByRole('textbox', {
      name: /What's this article about\?/i,
    });
    this.bodyInput = this.page.getByRole('textbox', { name: /Write your article/i });
    this.tagsInput = this.page.getByRole('textbox', { name: /Enter tags/i });
    this.publishButton = this.page.getByRole('button', { name: /Publish Article/i });
  }

  async clickEdit(): Promise<void> {
    await this.editButton.click();
  }

  async clickDelete(): Promise<void> {
    await this.deleteButton.click();
  }

  async addComment(text: string): Promise<void> {
    await this.commentTextarea.fill(text);
    await this.postCommentButton.click();
  }

  commentByText(text: string): Locator {
    const commentText = this.page.getByText(text, { exact: true });
    return this.page.locator('.card').filter({ has: commentText });
  }

  async deleteCommentByText(text: string): Promise<void> {
    const commentCard = this.commentByText(text).first();
    await commentCard.locator('.mod-options .ion-trash-a').click();
  }

  async fillForm(params: {
    title: string;
    description: string;
    body: string;
    tags?: string[];
  }): Promise<void> {
    const { title, description, body, tags = [] } = params;
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);
    await this.bodyInput.fill(body);
    for (const tag of tags) {
      await this.tagsInput.fill(tag);
      await this.tagsInput.press('Enter');
    }
  }

  async addTags(tags: string[]): Promise<void> {
    for (const tag of tags) {
      await this.tagsInput.fill(tag);
      await this.tagsInput.press('Enter');
    }
  }

  async publish(): Promise<void> {
    await this.publishButton.click();
  }
}
