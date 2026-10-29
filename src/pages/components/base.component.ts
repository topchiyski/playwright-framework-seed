import type { Locator, Page } from '@playwright/test';

/**
 * A reusable UI fragment scoped to a root locator. All child locators MUST be
 * derived from `root` so the component works wherever it is mounted (and in lists).
 */
export abstract class BaseComponent {
  constructor(readonly root: Locator) {}

  protected get page(): Page {
    return this.root.page();
  }
}
