// Demo app (SauceDemo + Restful-Booker). Removed by `npm run init:project`.
import type { Product } from '@app-types/product.types';

/** Static SauceDemo catalog — the source of truth for expected names/prices in assertions. */
export const PRODUCTS = {
  backpack: { id: 4, name: 'Sauce Labs Backpack', price: 29.99 },
  bikeLight: { id: 0, name: 'Sauce Labs Bike Light', price: 9.99 },
  boltTShirt: { id: 1, name: 'Sauce Labs Bolt T-Shirt', price: 15.99 },
  fleeceJacket: { id: 5, name: 'Sauce Labs Fleece Jacket', price: 49.99 },
  onesie: { id: 2, name: 'Sauce Labs Onesie', price: 7.99 },
  redTShirt: { id: 3, name: 'Test.allTheThings() T-Shirt (Red)', price: 15.99 },
} as const satisfies Record<string, Product>;

export type ProductKey = keyof typeof PRODUCTS;

export const ALL_PRODUCTS: readonly Product[] = Object.values(PRODUCTS);

/** SauceDemo applies a flat 8% sales tax at checkout. */
export const TAX_RATE = 0.08;
