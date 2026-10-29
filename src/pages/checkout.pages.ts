import type { Locator, Page } from '@playwright/test';
import type { CheckoutInfo } from '@app-types/product.types';
import { parseMoney } from '@utils/money';
import { BasePage } from './base.page';
import { HeaderComponent } from './components/header.component';
import { ProductList } from './components/product-card.component';

/** Step 1 — customer information form. */
export class CheckoutInformationPage extends BasePage {
  protected readonly path = '/checkout-step-one.html';

  readonly header: HeaderComponent;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly readyLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.errorMessage = page.getByTestId('error');
    this.readyLocator = this.continueButton;
  }

  async fill(info: Partial<CheckoutInfo>): Promise<void> {
    if (info.firstName !== undefined) await this.firstNameInput.fill(info.firstName);
    if (info.lastName !== undefined) await this.lastNameInput.fill(info.lastName);
    if (info.postalCode !== undefined) await this.postalCodeInput.fill(info.postalCode);
  }

  async submit(info: Partial<CheckoutInfo>): Promise<void> {
    await this.fill(info);
    await this.continueButton.click();
  }
}

/** Step 2 — order overview with price summary. */
export class CheckoutOverviewPage extends BasePage {
  protected readonly path = '/checkout-step-two.html';

  readonly header: HeaderComponent;
  readonly items: ProductList;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly readyLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.items = new ProductList(page.getByTestId('cart-list'));
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.readyLocator = this.finishButton;
  }

  async readSummary(): Promise<{ subtotal: number; tax: number; total: number }> {
    const [subtotal, tax, total] = await Promise.all(
      [this.subtotalLabel, this.taxLabel, this.totalLabel].map(async (l) => parseMoney(await l.innerText())),
    );
    return { subtotal: subtotal!, tax: tax!, total: total! };
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}

/** Step 3 — confirmation. */
export class CheckoutCompletePage extends BasePage {
  protected readonly path = '/checkout-complete.html';

  readonly header: HeaderComponent;
  readonly confirmationHeading: Locator;
  readonly backHomeButton: Locator;
  readonly readyLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.confirmationHeading = page.getByRole('heading', { name: 'Thank you for your order!' });
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
    this.readyLocator = this.confirmationHeading;
  }

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
