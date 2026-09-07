import type { Coordinates, ISODateTime, TimeZone } from '../../types/common';

export type EventStatus = 'scheduled' | 'postponed' | 'cancelled' | 'soldOut';

/** Importes enteros en céntimos. El catálogo actual solo utiliza EUR. */
export type EventPrice =
  | { kind: 'free'; currency: 'EUR' }
  | { kind: 'fixed'; currency: 'EUR'; amountCents: number }
  | { kind: 'range'; currency: 'EUR'; minAmountCents: number; maxAmountCents: number };

export type EventLocation = {
  venueName: string;
  locality: string;
  address?: string;
  coordinates?: Coordinates;
  timeZone: TimeZone;
};

export type EventSource = {
  provider: string;
  externalId?: string;
  url?: string;
};

export type EventMedia = {
  kind: 'image' | 'video';
  url: string;
  alternativeText?: string;
};

/** Un dato ausente significa desconocido, no falta de accesibilidad. */
export type EventAccessibility = {
  wheelchairAccessible?: boolean;
  hearingAssistance?: boolean;
  notes?: string;
};

export type Event = {
  id: string;
  title: string;
  description?: string;
  artistName?: string;
  categoryId: string;
  subcategoryId: string;
  startsAt: ISODateTime;
  endsAt?: ISODateTime;
  location: EventLocation;
  price: EventPrice;
  organizerId?: string;
  source?: EventSource;
  ticketUrl?: string;
  illustrationKey?: string;
  media?: EventMedia[];
  accessibility?: EventAccessibility;
  status: EventStatus;
};

/** La distancia pertenece al resultado de una consulta, no al evento. */
export type EventResult = {
  event: Event;
  distanceMeters?: number;
};
