import type { Category } from '../categories/types';
import { assertISODateTime } from './dates';
import { isSafeWebUrl } from './ticketing';
import type { Event, EventPrice, EventTicketing } from './types';

export function validateEventPrice(price: EventPrice): void {
  if (price.currency !== 'EUR') throw new Error('Moneda no soportada');
  const validCents = (amount: number) => Number.isSafeInteger(amount) && amount >= 0;
  switch (price.kind) {
    case 'free': return;
    case 'fixed':
      if (validCents(price.amountCents) && price.amountCents > 0) return;
      break;
    case 'range':
      if (validCents(price.minAmountCents) && validCents(price.maxAmountCents)
        && price.maxAmountCents > price.minAmountCents) return;
      break;
  }
  throw new Error('Precio incoherente: usar free para cero y fixed para un único importe');
}

const ticketingStatuses = new Set([
  'available', 'lastTickets', 'soldOut', 'free', 'freeCapacity', 'reservationRequired',
  'registrationRequired', 'notYetAvailable', 'unverified',
]);

export function validateEventTicketing(ticketing: EventTicketing): void {
  if (ticketing.statuses.length === 0 || new Set(ticketing.statuses).size !== ticketing.statuses.length
    || ticketing.statuses.some(status => !ticketingStatuses.has(status))) {
    throw new Error('Estados de entradas inválidos o duplicados');
  }
  const cents = [ticketing.baseAmountCents, ticketing.feesAmountCents, ticketing.totalAmountCents]
    .filter((value): value is number => value !== undefined);
  if (cents.some(value => !Number.isSafeInteger(value) || value < 0)) throw new Error('Importes de entradas inválidos');
  if (ticketing.totalAmountCents !== undefined && ticketing.baseAmountCents !== undefined
    && ticketing.feesAmountCents !== undefined
    && ticketing.totalAmountCents !== ticketing.baseAmountCents + ticketing.feesAmountCents) {
    throw new Error('Total de entradas incoherente');
  }
  if (ticketing.action) {
    if (!['purchase', 'reservation', 'registration'].includes(ticketing.action.kind)) {
      throw new Error('Acción de entradas desconocida');
    }
    if (!isSafeWebUrl(ticketing.action.url)) throw new Error('URL de entradas inválida');
  }
}

/** Comprobaciones del límite de datos, sin DOM ni librerías de validación. */
export function validateEvent(event: Event, categories: readonly Category[]): void {
  for (const value of [event.id, event.title, event.categoryId, event.subcategoryId,
    event.location.venueName, event.location.locality, event.location.timeZone]) {
    if (!value.trim()) throw new Error('Campo obligatorio vacío en evento');
  }
  const category = categories.find(item => item.id === event.categoryId);
  if (!category?.subcategories.some(item => item.id === event.subcategoryId && item.categoryId === category.id)) {
    throw new Error(`Categoría/subcategoría desconocida: ${event.categoryId}/${event.subcategoryId}`);
  }
  validateEventPrice(event.price);
  assertISODateTime(event.startsAt);
  if (event.endsAt !== undefined) {
    assertISODateTime(event.endsAt);
    if (Date.parse(event.endsAt) < Date.parse(event.startsAt)) throw new Error('Fin anterior al inicio');
  }
  if (event.doorTime !== undefined && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(event.doorTime)) {
    throw new Error('Hora de apertura inválida');
  }
  if (event.durationMinutes !== undefined
    && (!Number.isSafeInteger(event.durationMinutes) || event.durationMinutes <= 0)) {
    throw new Error('Duración inválida');
  }
  if (event.ticketing) validateEventTicketing(event.ticketing);
  if (event.changeNotice?.updatedAt) assertISODateTime(event.changeNotice.updatedAt);
  if (event.source?.lastCheckedAt) assertISODateTime(event.source.lastCheckedAt);
  if (event.source?.lastUpdatedAt) assertISODateTime(event.source.lastUpdatedAt);
  if (event.program?.some(section => section.items.length === 0
    || section.items.some(item => !item.title.trim()
      || (item.time !== undefined && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(item.time))))) {
    throw new Error('Programa inválido');
  }
  new Intl.DateTimeFormat('en', { timeZone: event.location.timeZone });
  if (!['scheduled', 'postponed', 'cancelled', 'soldOut'].includes(event.status)) {
    throw new Error('Estado de evento no válido');
  }
  const coordinates = event.location.coordinates;
  if (coordinates && (!Number.isFinite(coordinates.latitude) || Math.abs(coordinates.latitude) > 90
    || !Number.isFinite(coordinates.longitude) || Math.abs(coordinates.longitude) > 180)) {
    throw new Error('Coordenadas fuera de rango');
  }
}
