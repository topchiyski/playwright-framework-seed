// Demo app (SauceDemo + Restful-Booker). `npm run init:project` replaces this file with a skeleton.
export { ApiError, BaseApiClient } from './base-api.client';
export { AuthApi, type ApiCredentials } from './auth.api';
export { BookingApi, type BookingFilter } from './booking.api';
export * from './schemas/booking.schema';
