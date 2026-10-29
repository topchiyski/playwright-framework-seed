import type { Locator, Page } from '@playwright/test';

/**
 * Root of every Page Object.
 *
 * Contract:
 *  - exposes user-facing locators (`getByRole` / `getByLabel` / `getByText` first) and intent-level actions;
 *  - NEVER asserts (`expect` is lint-banned under src/pages) — specs own verification;
 *  - NEVER sleeps — synchronisation is done by waiting on `readyLocator` or other concrete conditions.
 */
export abstract class BasePage {
  /** Path relative to `baseURL`, e.g. `/inventory.html`. */
  protected abstract readonly path: string;

  /** An element whose visibility proves the page has rendered and is interactive. */
  abstract readonly readyLocator: Locator;

  constructor(readonly page: Page) {}

  /** Navigates to this page and resolves once it is ready for interaction. */
  async goto(): Promise<this> {
    await this.page.goto(this.path);
    return this.waitUntilReady();
  }

  /** Waits for the ready indicator — use after an action that navigates here. */
  async waitUntilReady(): Promise<this> {
    await this.readyLocator.waitFor({ state: 'visible' });
    return this;
  }

  /** URL matcher for `expect(page).toHaveURL(...)` in specs. */
  get urlPattern(): RegExp {
    return new RegExp(`${this.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
  }
}
