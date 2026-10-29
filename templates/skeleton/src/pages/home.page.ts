import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

/** Example page object (sandbox home page). Replace with your application's pages. */
export class HomePage extends BasePage {
  protected readonly path = '/';

  readonly heading: Locator;
  readonly readyLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1 });
    this.readyLocator = this.heading;
  }
}
