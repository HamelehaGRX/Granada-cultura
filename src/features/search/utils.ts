import type { Category } from '../categories/types';
import type { Event } from '../events/types';

export function normalizeSearchText(value: string | undefined): string {
  return (value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function eventSearchText(event: Event, categories: readonly Category[]): string {
  const category = categories.find(item => item.id === event.categoryId);
  const subcategory = category?.subcategories.find(item => item.id === event.subcategoryId);
  return [event.title, event.artistName, event.location.locality, event.location.venueName,
    category?.name, subcategory?.name, event.description].map(normalizeSearchText).join(' ');
}
