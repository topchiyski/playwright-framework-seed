import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from './base.component';
import { SideMenuComponent } from './side-menu.component';

/** Primary header shared by every authenticated page: burger menu, title, cart. */
export class HeaderComponent extends BaseComponent {
  readonly menuButton: Locator;
  readonly title: Locator;
  readonly cartLink: Locator;
  /** Only rendered when the cart is non-empty — assert with `toBeHidden()` for an empty cart. */
  readonly cartBadge: Locator;
  readonly menu: SideMenuComponent;

  constructor(page: Page) {
    super(page.getByTestId('primary-header').locator('..'));
    this.menuButton = this.root.getByRole('button', { name: 'Open Menu' });
    this.title = this.root.getByTestId('title');
    this.cartLink = this.root.getByTestId('shopping-cart-link');
    this.cartBadge = this.root.getByTestId('shopping-cart-badge');
    this.menu = new SideMenuComponent(page);
  }

  async openMenu(): Promise<SideMenuComponent> {
    await this.menuButton.click();
    await this.menu.logoutButton.waitFor({ state: 'visible' });
    return this.menu;
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
