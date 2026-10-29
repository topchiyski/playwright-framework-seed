// Demo app (SauceDemo + Restful-Booker). Removed by `npm run init:project`.
import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from './base.component';

export class SideMenuComponent extends BaseComponent {
  // Menu entries render as buttons (no href); only "About" is a real link.
  readonly allItemsButton: Locator;
  readonly logoutButton: Locator;
  readonly resetAppStateButton: Locator;
  readonly aboutLink: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    super(page.getByRole('navigation'));
    this.allItemsButton = this.root.getByRole('button', { name: 'All Items' });
    this.logoutButton = this.root.getByRole('button', { name: 'Logout' });
    this.resetAppStateButton = this.root.getByRole('button', { name: 'Reset App State' });
    this.aboutLink = this.root.getByRole('link', { name: 'About' });
    this.closeButton = page.getByRole('button', { name: 'Close Menu' });
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async resetAppState(): Promise<void> {
    await this.resetAppStateButton.click();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }
}
