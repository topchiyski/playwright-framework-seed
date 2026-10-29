// Demo app (SauceDemo + Restful-Booker). Removed by `npm run init:project`.
import type { BookingPayload } from '@api/schemas/booking.schema';
import type { CheckoutInfo } from '@app-types/product.types';
import { isoDate, uniqueId } from './data-factory';

/** Valid booking payload with a unique guest name; override any field. */
export function buildBooking(overrides: Partial<BookingPayload> = {}): BookingPayload {
  return {
    firstname: 'Auto',
    lastname: uniqueId('Test'),
    totalprice: 100 + Math.floor(Math.random() * 900),
    depositpaid: true,
    bookingdates: { checkin: isoDate(7), checkout: isoDate(10) },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}

/** Valid checkout form data with a unique last name; override any field. */
export function buildCheckoutInfo(overrides: Partial<CheckoutInfo> = {}): CheckoutInfo {
  return {
    firstName: 'Ada',
    lastName: uniqueId('Lovelace'),
    postalCode: String(10_000 + Math.floor(Math.random() * 89_999)),
    ...overrides,
  };
}
