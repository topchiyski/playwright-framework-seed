import type { Locator } from '@playwright/test';
import type { DisplayedProduct } from '@app-types/product.types';
import { parseMoney } from '@utils/money';
import { BaseComponent } from './base.component';

/**
 * A product row/card. The same markup is used on the inventory, cart and checkout
 * overview pages, so one component serves all three (cart-only parts are optional).
 */
export class ProductCardComponent extends BaseComponent {
  readonly name: Locator;
  readonly description: Locator;
  readonly price: Locator;
  readonly quantity: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;

  constructor(root: Locator) {
    super(root);
    this.name = root.getByTestId('inventory-item-name');
    this.description = root.getByTestId('inventory-item-desc');
    this.price = root.getByTestId('inventory-item-price');
    this.quantity = root.getByTestId('item-quantity');
    this.addToCartButton = root.getByRole('button', { name: 'Add to cart' });
    this.removeButton = root.getByRole('button', { name: 'Remove' });
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async remove(): Promise<void> {
    await this.removeButton.click();
  }

  async openDetails(): Promise<void> {
    await this.name.click();
  }

  /** Snapshot of what is rendered. Read after the page is ready; assert with web-first matchers when state may change. */
  async read(): Promise<DisplayedProduct> {
    const [name, price] = await Promise.all([this.name.innerText(), this.price.innerText()]);
    return { name: name.trim(), price: parseMoney(price) };
  }
}

/** Builds a product-card locator list + by-name lookup for a container. */
export class ProductList {
  readonly cards: Locator;
  readonly names: Locator;
  readonly prices: Locator;

  constructor(container: Locator) {
    this.cards = container.getByTestId('inventory-item');
    this.names = this.cards.getByTestId('inventory-item-name');
    this.prices = this.cards.getByTestId('inventory-item-price');
  }

  byName(name: string): ProductCardComponent {
    return new ProductCardComponent(
      this.cards.filter({ has: this.cards.page().getByText(name, { exact: true }) }),
    );
  }

  nth(index: number): ProductCardComponent {
    return new ProductCardComponent(this.cards.nth(index));
  }

  async readAll(): Promise<DisplayedProduct[]> {
    const count = await this.cards.count();
    return Promise.all(Array.from({ length: count }, (_, i) => this.nth(i).read()));
  }
}
