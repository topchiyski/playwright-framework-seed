# How-to guides

Task-focused recipes. Each assumes you have completed [Getting started](getting-started.md). For background on _why_ things work this way, see the [framework guide](framework-guide.md).

- [Run exactly the tests you need](#run-exactly-the-tests-you-need)
- [Add a page object](#add-a-page-object)
- [Add a reusable component](#add-a-reusable-component)
- [Add an API endpoint](#add-an-api-endpoint)
- [Set up test data and clean it up](#set-up-test-data-and-clean-it-up)
- [Test as a different persona](#test-as-a-different-persona)
- [Add a persona](#add-a-persona)
- [Add a configuration setting](#add-a-configuration-setting)
- [Add an environment](#add-an-environment)
- [Tag tests and run safely against production](#tag-tests-and-run-safely-against-production)
- [Debug a failing test](#debug-a-failing-test)
- [Fix a broken locator](#fix-a-broken-locator)

---

## Run exactly the tests you need

```bash
npx playwright test tests/e2e/cart.spec.ts --project=e2e-chromium   # one file, one browser
npx playwright test tests/api/booking.spec.ts:40                      # the test at line 40
npx playwright test --grep "rejects locked-out" --project=e2e-chromium # by title (regex)
npx playwright test --grep @smoke                                     # by tag
npx playwright test --project=e2e-chromium --headed --workers=1       # watch, one at a time
TEST_ENV=staging npx playwright test --grep @smoke                    # against another environment
```

On Windows PowerShell set the variable first: `$env:TEST_ENV='staging'; npx playwright test --grep @smoke`, or use the cross-platform scripts `npm run test:staging`.

While iterating, stick to one file and one browser project; run the full `npm test` once at the end.

## Add a page object

Example: the SauceDemo product details page (`/inventory-item.html?id=<id>`).

**1. Create `src/pages/product-details.page.ts`:**

```ts
import type { Locator, Page } from '@playwright/test';
import type { Product } from '@app-types/product.types';
import { BasePage } from './base.page';
import { HeaderComponent } from './components/header.component';

export class ProductDetailsPage extends BasePage {
  protected readonly path = '/inventory-item.html';

  readonly header: HeaderComponent;
  readonly name: Locator;
  readonly price: Locator;
  readonly addToCartButton: Locator;
  readonly backButton: Locator;
  readonly readyLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.name = page.getByTestId('inventory-item-name');
    this.price = page.getByTestId('inventory-item-price');
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.backButton = page.getByRole('button', { name: 'Back to products' });
    this.readyLocator = this.backButton;
  }

  /** This page needs a product id, so it gets its own entry point next to `goto()`. */
  async openFor(product: Product): Promise<this> {
    await this.page.goto(`${this.path}?id=${product.id}`);
    return this.waitUntilReady();
  }
}
```

Checklist:

- `path` is relative to the base URL; `readyLocator` is an element that only appears once the page is usable.
- Locators are `readonly` fields, built in the constructor. Prefer `getByRole`; see [choosing locators](framework-guide.md#choosing-locators).
- Methods perform actions and return data or `this`. **No `expect`** — lint will reject it.

**2. Export it** from `src/pages/index.ts`:

```ts
export { ProductDetailsPage } from './product-details.page';
```

**3. Register a fixture** in `src/fixtures/page.fixtures.ts` — add `productDetailsPage: ProductDetailsPage;` to `PageFixtures` and:

```ts
productDetailsPage: async ({ page }, use) => use(new ProductDetailsPage(page)),
```

**4. Use it in a spec:**

```ts
test(
  'details page adds the product to the cart',
  { tag: [TAG.regression] },
  async ({ productDetailsPage }) => {
    await productDetailsPage.openFor(PRODUCTS.fleeceJacket);

    await expect(productDetailsPage.price).toHaveText(formatMoney(PRODUCTS.fleeceJacket.price));
    await productDetailsPage.addToCartButton.click();
    await expect(productDetailsPage.header.cartBadge).toHaveText('1');
  },
);
```

## Add a reusable component

Use a component when the same UI fragment appears on several pages or several times on one page.

1. Create `src/pages/components/<name>.component.ts` extending `BaseComponent`.
2. Take the fragment's **root locator** in the constructor and build every child locator from `this.root` — never from `page` — so each instance is scoped to its own fragment.
3. Have pages create it: a single instance (`new HeaderComponent(page)`) or one per item (`new ProductCardComponent(cardLocator)`).
4. Export it from `src/pages/index.ts`.

`src/pages/components/product-card.component.ts` is the reference example, including a `ProductList` helper that finds a card by product name.

## Add an API endpoint

The pattern, shown for a hypothetical `GET /room/{id}` on a new `RoomApi`:

**1. Describe the response** in `src/api/schemas/room.schema.ts`:

```ts
import { z } from 'zod';

export const RoomSchema = z.object({ id: z.number().int(), name: z.string(), capacity: z.number().int() });
export type Room = z.infer<typeof RoomSchema>;
```

**2. Add both methods** to the client (`src/api/room.api.ts`, extending `BaseApiClient`):

```ts
getResponse(id: number): Promise<APIResponse> {
  return this.send('GET', `/room/${id}`);
}

async get(id: number): Promise<Room> {
  return this.parse(await this.getResponse(id), RoomSchema);
}
```

**3. Register a fixture** in `src/fixtures/api.fixtures.ts` (`roomApi: async ({ apiRequest }, use) => use(new RoomApi(apiRequest))`) and export the client and schema from `src/api/index.ts`.

**4. Test it** — status and contract with the raw method, data with the typed one:

```ts
const response = await roomApi.getResponse(id);
await expect(response).toHaveStatus(200);
const body: unknown = await response.json();
expect(body).toMatchSchema(RoomSchema);
```

> Type the JSON as `unknown` before using `toMatchSchema`. Playwright hides custom matchers when the value is `any`, which is what `response.json()` returns, so the code would not type-check.

For an endpoint that creates data, also add a creation fixture that registers deletion — copy `createBooking` in `api.fixtures.ts`.

## Set up test data and clean it up

Create state that the test is _not_ about without the UI:

```ts
// Cart contents: written straight into the app's storage; lands on the cart page.
const cart = await seedCart(PRODUCTS.backpack, PRODUCTS.onesie);

// A booking: created via the API and deleted automatically after the test.
const { bookingid, booking } = await createBooking({ firstname: 'Grace' });
```

For anything else your test creates, register the undo step immediately after creating it:

```ts
const { bookingid } = await bookingApi.create(buildBooking());
cleanup.register(`booking #${bookingid}`, () => bookingApi.deleteIfExists(bookingid));
```

Rules:

- Register cleanup **right after** the create call, before any assertion that could fail.
- Make cleanup **idempotent** (it must succeed if the test already deleted the data) — see `deleteIfExists`.
- Generate unique values with `buildBooking()`, `buildCheckoutInfo()` and `uniqueId()` from `@utils/data-factory`; never reuse fixed names on shared systems.

## Test as a different persona

At the top of a file or inside a `describe` block:

```ts
test.use({ role: 'performanceGlitch' });
```

Use `role: 'anonymous'` to start logged out. Available personas are listed in the [reference](reference.md#personas).

## Add a persona

1. Add the persona key to `USER_ROLES` in `src/types/config.types.ts`. If it can log in, also add it to `AUTH_ROLES`.
2. Add its username to `users` in `config/default.ts` (and to an environment profile if it differs there).
3. Run any UI test. The `setup` project automatically logs the new persona in and writes `.auth/<persona>.json`.
4. Use it with `test.use({ role: '<persona>' })`.

TypeScript will point out anything you missed, because `users` must contain every key in `USER_ROLES`.

## Add a configuration setting

1. Add the field to `EnvironmentProfile` in `src/types/config.types.ts`.
2. Give it a default in `config/default.ts`; override it in `config/<env>.ts` where an environment differs.
3. Add a validation rule for it in `EnvSchema` in `src/config/env.ts`.
4. _Optional — environment-variable override:_ map a variable to it in the `defined({ ... })` block of `loadEnv()` in the same file, document it in `.env.example`, and add it to the [variables table](reference.md#environment-variables).
5. Read it anywhere as `env.<field>`.

Secrets are the exception: they never get a profile default. Add them only to the `credentials` block of `loadEnv()` and the schema, and to `.env.example` with a placeholder value.

## Add an environment

1. Add the name to `ENVIRONMENTS` in `src/types/config.types.ts`.
2. Create `config/<name>.ts` exporting a `DeepPartial<EnvironmentProfile>` with only the differences from `default.ts`.
3. Register it in the `PROFILES` map in `src/config/env.ts`.
4. Add an npm script: `"test:<name>": "cross-env TEST_ENV=<name> playwright test"`.
5. Add a row to the [environments table](reference.md#environments).

## Tag tests and run safely against production

Tag every test with at least one of `@smoke` or `@regression`, and add `@destructive` if it creates, changes or deletes data:

```ts
test('completes an order end to end', { tag: [TAG.smoke, TAG.destructive] }, async ({ ... }) => { ... });
```

`npm run test:prod` runs `@smoke` tests and excludes `@destructive` ones. Independently, the `prod` profile sets `allowDestructive: false`, so any `@destructive` test that still gets selected is skipped automatically — two layers of protection.

## Debug a failing test

1. **Open the report:** `npm run report`. Each failure shows the error, the expected vs. received values and the code line.
2. **Open the trace** (attached to the failed test in the report, or `npx playwright show-trace test-results/<test>/trace.zip`). Scrub through every action with before/after DOM snapshots, network calls and console output.
3. **Read the page snapshot:** `test-results/<test>/error-context.md` contains the accessibility tree of the page at the moment of failure — the fastest way to see which roles and names actually exist.
4. **Reproduce interactively:** `npm run test:debug -- tests/e2e/<file>.spec.ts` opens the Playwright Inspector paused on the first step; or `npm run test:ui` to watch and re-run.
5. **Check it is not the environment:** run `npm run test:smoke`. If many unrelated tests fail, the target system is likely down or slow.

Do not "fix" a failure by adding a sleep or raising a timeout — find the condition the test should wait for.

## Fix a broken locator

1. Open `test-results/<test>/error-context.md` and find the element in the accessibility tree.
2. Rewrite the locator from what the tree shows — role and accessible name first:
   ```text
   - button "Logout" [ref=f1e17]   →   getByRole('button', { name: 'Logout' })
   ```
3. Change it **in the page object or component only**; specs reference the locator by name, so they need no change.
4. Re-run the affected spec three times to confirm it is stable: `npx playwright test <spec> --repeat-each=3`.
