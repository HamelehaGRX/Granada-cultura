import type { Category } from '../categories/types';
import type { Event, EventPrice, EventResult } from './types';

/** Orden cronológico real; el offset ISO puede variar entre eventos. No muta la entrada. */
export function sortHomeEvents(results: readonly EventResult[]): EventResult[] {
  return [...results].sort((a, b) => {
    const chronological = Date.parse(a.event.startsAt) - Date.parse(b.event.startsAt);
    if (chronological !== 0) return chronological;
    const distanceA = a.distanceMeters ?? Infinity;
    const distanceB = b.distanceMeters ?? Infinity;
    return distanceA === distanceB ? 0 : distanceA < distanceB ? -1 : 1;
  });
}

export function formatEventDate(event: Pick<Event, 'startsAt' | 'location'>): string {
  const date = new Date(event.startsAt);
  const options = { timeZone: event.location.timeZone };
  const day = new Intl.DateTimeFormat('es-ES', {
    ...options, weekday: 'short', day: 'numeric', month: 'short',
  }).format(date);
  const hour = new Intl.DateTimeFormat('es-ES', {
    ...options, hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).format(date);
  return `${day} · ${hour}`;
}

export function formatEventPrice(price: EventPrice): string {
  const amount = (cents: number) => new Intl.NumberFormat('es-ES', {
    style: 'currency', currency: price.currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2, maximumFractionDigits: 2,
  }).format(cents / 100);
  switch (price.kind) {
    case 'free': return 'Gratis';
    case 'fixed': return amount(price.amountCents);
    case 'range': return `${amount(price.minAmountCents)} — ${amount(price.maxAmountCents)}`;
  }
}

export function formatDemoDistance(meters: number | undefined): string | undefined {
  if (meters === undefined) return undefined;
  const value = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 }).format(meters / 1000);
  return `A ${value} km · demo`;
}

export function eventCategoryLabel(event: Event, categories: readonly Category[]): string {
  const category = categories.find(item => item.id === event.categoryId);
  const subcategory = category?.subcategories.find(item => item.id === event.subcategoryId);
  return `${category?.name ?? event.categoryId} · ${subcategory?.name ?? event.subcategoryId}`;
}
