import type { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './base-api.client';
import {
  BookingRefListSchema,
  BookingSchema,
  CreatedBookingSchema,
  type Booking,
  type BookingPayload,
  type BookingRef,
  type CreatedBooking,
} from './schemas/booking.schema';

export interface BookingFilter {
  firstname?: string;
  lastname?: string;
  checkin?: string;
  checkout?: string;
}

/** Restful-Booker `/booking` resource. Mutating calls require a token (cookie auth). */
export class BookingApi extends BaseApiClient {
  constructor(
    request: APIRequestContext,
    private readonly token?: string,
  ) {
    super(request);
  }

  /** Same client with a different (or no) token — used for authorization tests. */
  withToken(token: string | undefined): BookingApi {
    return new BookingApi(this.request, token);
  }

  private get authHeaders(): Record<string, string> {
    return this.token ? { Cookie: `token=${this.token}` } : {};
  }

  // ---- raw responses -------------------------------------------------------

  pingResponse(): Promise<APIResponse> {
    return this.send('GET', '/ping');
  }

  listResponse(filter: BookingFilter = {}): Promise<APIResponse> {
    return this.send('GET', '/booking', { params: { ...filter } });
  }

  getResponse(id: number): Promise<APIResponse> {
    return this.send('GET', `/booking/${id}`);
  }

  createResponse(payload: BookingPayload): Promise<APIResponse> {
    return this.send('POST', '/booking', { data: payload });
  }

  updateResponse(id: number, payload: BookingPayload): Promise<APIResponse> {
    return this.send('PUT', `/booking/${id}`, { data: payload, headers: this.authHeaders });
  }

  patchResponse(id: number, partial: Partial<BookingPayload>): Promise<APIResponse> {
    return this.send('PATCH', `/booking/${id}`, { data: partial, headers: this.authHeaders });
  }

  deleteResponse(id: number): Promise<APIResponse> {
    return this.send('DELETE', `/booking/${id}`, { headers: this.authHeaders });
  }

  // ---- typed, contract-validated -------------------------------------------

  async list(filter: BookingFilter = {}): Promise<BookingRef[]> {
    return this.parse(await this.listResponse(filter), BookingRefListSchema);
  }

  async get(id: number): Promise<Booking> {
    return this.parse(await this.getResponse(id), BookingSchema);
  }

  async create(payload: BookingPayload): Promise<CreatedBooking> {
    return this.parse(await this.createResponse(payload), CreatedBookingSchema);
  }

  async update(id: number, payload: BookingPayload): Promise<Booking> {
    return this.parse(await this.updateResponse(id, payload), BookingSchema);
  }

  async patch(id: number, partial: Partial<BookingPayload>): Promise<Booking> {
    return this.parse(await this.patchResponse(id, partial), BookingSchema);
  }

  /**
   * Idempotent delete for teardown: succeeds if the booking is gone afterwards.
   * Restful-Booker answers 201 on success and 404/405 when the id no longer exists.
   */
  async deleteIfExists(id: number): Promise<void> {
    const response = await this.deleteResponse(id);
    if (response.ok() || [404, 405].includes(response.status())) return;
    throw new Error(`DELETE /booking/${id} failed with ${response.status()}: ${await response.text()}`);
  }
}
