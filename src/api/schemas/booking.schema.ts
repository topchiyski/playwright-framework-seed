import { z } from 'zod';

const isoDate = z.iso.date();

export const BookingDatesSchema = z.object({
  checkin: isoDate,
  checkout: isoDate,
});

export const BookingSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number(),
  depositpaid: z.boolean(),
  bookingdates: BookingDatesSchema,
  additionalneeds: z.string().optional(),
});

export const CreatedBookingSchema = z.object({
  bookingid: z.number().int().positive(),
  booking: BookingSchema,
});

export const BookingRefListSchema = z.array(z.object({ bookingid: z.number().int().positive() }));

export const AuthTokenSchema = z.object({ token: z.string().min(1) });

export type BookingDates = z.infer<typeof BookingDatesSchema>;
export type Booking = z.infer<typeof BookingSchema>;
export type BookingPayload = Booking;
export type CreatedBooking = z.infer<typeof CreatedBookingSchema>;
export type BookingRef = z.infer<typeof BookingRefListSchema>[number];
