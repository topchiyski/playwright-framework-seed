// Demo app (SauceDemo + Restful-Booker). Removed by `npm run init:project`.
import type { Locator, Page } from '@playwright/test';
import { SORT_OPTIONS, type SortOption } from '@app-types/product.types';
import { BasePage } from './base.page';
import { HeaderComponent } from './components/header.component';
import { ProductList } from './components/product-card.component';

export class InventoryPage extends BasePage {
  protected readonly path = '/inventory.html';

  readonly header: HeaderComponent;
  readonly products: ProductList;
  readonly sortSelect: Locator;
  readonly readyLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.products = new ProductList(page.getByTestId('inventory-list'));
    this.sortSelect = page.getByTestId('product-sort-container');
    this.readyLocator = this.products.cards.first();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortSelect.selectOption({ label: SORT_OPTIONS[option] });
  }

  async addToCart(...productNames: string[]): Promise<void> {
    for (const name of productNames) {
      await this.products.byName(name).addToCart();
    }
  }
}
