// Demo app (SauceDemo + Restful-Booker). Removed by `npm run init:project`.
export interface Product {
  /** SauceDemo internal product id (used as the cart key in localStorage). */
  id: number;
  name: string;
  price: number;
}

/** A product as rendered on screen (no id — the UI does not expose it). */
export type DisplayedProduct = Omit<Product, 'id'>;

/** Visible labels of the inventory sort dropdown. */
export const SORT_OPTIONS = {
  nameAsc: 'Name (A to Z)',
  nameDesc: 'Name (Z to A)',
  priceAsc: 'Price (low to high)',
  priceDesc: 'Price (high to low)',
} as const;
export type SortOption = keyof typeof SORT_OPTIONS;

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}
