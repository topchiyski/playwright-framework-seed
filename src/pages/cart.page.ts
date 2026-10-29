// Demo app (SauceDemo + Restful-Booker). Removed by `npm run init:project`.
import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from './components/header.component';
import { ProductList } from './components/product-card.component';

export class CartPage extends BasePage {
  protected readonly path = '/cart.html';

  readonly header: HeaderComponent;
  readonly items: ProductList;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly readyLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.items = new ProductList(page.getByTestId('cart-list'));
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.readyLocator = this.checkoutButton;
  }

  async removeItem(productName: string): Promise<void> {
    await this.items.byName(productName).remove();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
