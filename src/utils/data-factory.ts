import { randomUUID } from 'node:crypto';
import type { BookingPayload } from '@api/schemas/booking.schema';
import type { CheckoutInfo } from '@app-types/product.types';

/** Short unique suffix so parallel workers never collide on shared environments. */
export function uniqueId(prefix = 'pw'): string {
  return `${prefix}-${randomUUID().slice(0, 8)}`;
}

/** ISO `YYYY-MM-DD` date `offsetDays` from today (UTC). */
export function isoDate(offsetDays = 0): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

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

export function buildCheckoutInfo(overrides: Partial<CheckoutInfo> = {}): CheckoutInfo {
  return {
    firstName: 'Ada',
    lastName: uniqueId('Lovelace'),
    postalCode: String(10_000 + Math.floor(Math.random() * 89_999)),
    ...overrides,
  };
}
