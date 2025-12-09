import { HeaderNav } from '@_src/ui/components/header.component';

import { Locator, Page, expect } from '@playwright/test';

export class HomePage {
  private readonly page: Page;
  readonly headerNav: HeaderNav;
  readonly heroHeading: Locator;
  readonly heroSubheading: Locator;
  readonly globalFeedTab: Locator;
  readonly yourFeedTab: Locator;
  readonly popularTagsPanel: Locator;
  readonly newArticleLink: Locator;
  readonly settingsLink: Locator;
  readonly userProfileImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headerNav = new HeaderNav(page);
    this.heroHeading = this.page.getByRole('heading', { name: 'conduit' });
    this.heroSubheading = this.page.getByText(/A place to share your/i);
    this.globalFeedTab = this.page.getByText('Global Feed');
    this.yourFeedTab = this.page.getByText(/Your Feed|My Feed/i);
    this.popularTagsPanel = this.page.getByText('Popular Tags');
    this.newArticleLink = this.page.getByRole('link', { name: '   New Article' });
    this.settingsLink = this.page.getByRole('link', { name: '   Settings' });
    this.userProfileImage = this.page.getByRole('link', { name: 'User profile image' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/#/');
  }

  articleLinkByTitle(title: string): Locator {
    const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.page.getByRole('link', { name: new RegExp(escaped, 'i') });
  }
}
