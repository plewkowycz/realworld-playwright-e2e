import { Locator, Page } from '@playwright/test';

export class RegisterPage {
  private readonly page: Page;
  readonly heading: Locator;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signUpButton: Locator;
  readonly haveAnAccountLink: Locator;
  readonly successToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = this.page.getByRole('heading', { name: 'Sign up' });
    this.usernameInput = this.page.getByRole('textbox', { name: 'Username' });
    this.emailInput = this.page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = this.page.getByRole('textbox', { name: 'Password' });
    this.signUpButton = this.page.getByRole('button', { name: 'Sign up' });
    this.haveAnAccountLink = this.page.getByRole('link', { name: 'Have an account?' });
    this.successToast = this.page.getByText('Registration successful.');
  }

  async goto(): Promise<void> {
    await this.page.goto('/#/register');
  }

  async register(username: string, email: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signUpButton.click();
  }
}
