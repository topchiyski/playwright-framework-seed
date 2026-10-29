import { BookingSchema, CreatedBookingSchema } from '@api/schemas/booking.schema';
import { buildBooking, isoDate } from '@utils/data-factory';
import { expect, TAG, test } from '@fixtures/index';

test.describe('Booking API', () => {
  test('health check responds', { tag: [TAG.smoke] }, async ({ bookingApi }) => {
    await expect(await bookingApi.pingResponse()).toHaveStatus(201);
  });

  test(
    'creates a booking that can be read back',
    { tag: [TAG.smoke, TAG.contract, TAG.destructive] },
    async ({ bookingApi, cleanup }) => {
      const payload = buildBooking();

      const response = await bookingApi.createResponse(payload);
      await expect(response).toHaveStatus(200);
      const json: unknown = await response.json();
      expect(json).toMatchSchema(CreatedBookingSchema);
      const { bookingid, booking } = CreatedBookingSchema.parse(json);
      cleanup.register(`booking #${bookingid}`, () => bookingApi.deleteIfExists(bookingid));

      expect(booking).toEqual(payload);
      expect(await bookingApi.get(bookingid)).toEqual(payload);
    },
  );

  test(
    'finds a booking by guest name',
    { tag: [TAG.regression, TAG.destructive] },
    async ({ bookingApi, createBooking }) => {
      const { bookingid, booking } = await createBooking();

      const matches = await bookingApi.list({ firstname: booking.firstname, lastname: booking.lastname });

      expect(matches).toContainEqual({ bookingid });
    },
  );

  test(
    'replaces a booking with PUT',
    { tag: [TAG.regression, TAG.destructive] },
    async ({ bookingApi, createBooking }) => {
      const { bookingid } = await createBooking();
      const replacement = buildBooking({ depositpaid: false, additionalneeds: 'Late checkout' });

      const updated = await bookingApi.update(bookingid, replacement);

      expect(updated).toEqual(replacement);
      expect(await bookingApi.get(bookingid)).toEqual(replacement);
    },
  );

  test(
    'partially updates a booking with PATCH',
    { tag: [TAG.regression, TAG.destructive] },
    async ({ bookingApi, createBooking }) => {
      const { bookingid, booking } = await createBooking();
      const change = { totalprice: 4242, bookingdates: { checkin: isoDate(30), checkout: isoDate(35) } };

      const patched = await bookingApi.patch(bookingid, change);

      expect(patched).toMatchSchema(BookingSchema);
      expect(patched).toEqual({ ...booking, ...change });
    },
  );

  test(
    'deletes a booking',
    { tag: [TAG.regression, TAG.destructive] },
    async ({ bookingApi, createBooking }) => {
      const { bookingid } = await createBooking();

      await expect(await bookingApi.deleteResponse(bookingid)).toHaveStatus(201);
      await expect(await bookingApi.getResponse(bookingid)).toHaveStatus(404);
    },
  );

  test.describe('authorization', () => {
    test(
      'rejects updates without a token',
      { tag: [TAG.regression, TAG.destructive] },
      async ({ bookingApi, createBooking }) => {
        const { bookingid, booking } = await createBooking();
        const anonymous = bookingApi.withToken(undefined);

        await expect(await anonymous.updateResponse(bookingid, buildBooking())).toHaveStatus(403);
        await expect(await anonymous.deleteResponse(bookingid)).toHaveStatus(403);
        expect(await bookingApi.get(bookingid)).toEqual(booking);
      },
    );
  });

  test('returns 404 for an unknown booking', { tag: [TAG.regression] }, async ({ bookingApi }) => {
    await expect(await bookingApi.getResponse(999_999_999)).toHaveStatus(404);
  });
});
