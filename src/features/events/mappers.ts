import type { LegacyEventFixture } from '../../data/fixtures/legacyEvents';
import type { Category } from '../categories/types';
import { combineDateAndTime } from './dates';
import type { Event } from './types';
import { eurosToCents, optionalText } from './utils';
import { validateEvent } from './validation';

/** Adaptador puro; recibe la fecha ya preparada por la capa de fixtures. */
export function mapLegacyEventToEvent(legacy: LegacyEventFixture, categories: readonly Category[]): Event {
  const amountCents = eurosToCents(legacy.precio);
  const subcategory = categories.find(category => category.id === legacy.categoria)
    ?.subcategories.find(item => item.id === legacy.subcategoria);
  const description = optionalText(legacy.descripcion);
  const artistName = optionalText(legacy.artista);
  const timeZone = 'Europe/Madrid';
  const event: Event = {
    id: legacy.id,
    title: legacy.nombre.trim(),
    ...(description ? { description } : {}),
    ...(artistName ? { artistName } : {}),
    categoryId: legacy.categoria,
    subcategoryId: legacy.subcategoria,
    startsAt: combineDateAndTime(legacy.fecha, legacy.hora, timeZone),
    location: { venueName: legacy.lugar.trim(), locality: legacy.localidad.trim(), timeZone },
    price: amountCents === 0
      ? { kind: 'free', currency: 'EUR' }
      : { kind: 'fixed', currency: 'EUR', amountCents },
    illustrationKey: subcategory?.illustrationKey ?? 'generica',
    status: 'scheduled',
  };
  validateEvent(event, categories);
  return event;
}
