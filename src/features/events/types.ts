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
  province?: string;
  address?: string;
  coordinates?: Coordinates;
  timeZone: TimeZone;
};

export type EventSource = {
  provider: string;
  externalId?: string;
  url?: string;
  verifiedOfficial?: boolean;
  lastCheckedAt?: ISODateTime;
  lastUpdatedAt?: ISODateTime;
};

export type EventMedia = {
  kind: 'image' | 'video';
  url: string;
  alternativeText?: string;
  authorizedForUse?: boolean;
};

/** Un dato ausente significa desconocido, no falta de accesibilidad. */
export type EventAccessibility = {
  wheelchairAccessible?: boolean;
  accessibleToilet?: boolean;
  hearingAssistance?: boolean;
  hearingLoop?: boolean;
  audioDescription?: boolean;
  notes?: string;
};

export type EventChangeKind = 'time' | 'date' | 'location' | 'postponed' | 'cancelled' | 'other';

export type EventChangeNotice = {
  kind: EventChangeKind;
  title: string;
  summary: string;
  currentValue: string;
  previousValue?: string;
  updatedAt?: ISODateTime;
};

export type EventScheduleItem = {
  time?: string;
  title: string;
  detail?: string;
};

export type EventScheduleSection = {
  label?: string;
  items: EventScheduleItem[];
};

export type EventPracticalInformation = {
  setting?: 'indoor' | 'outdoor' | 'mixed';
  publicTransport?: string;
  parking?: string;
  notes?: string[];
};

export type EventOrganizer = {
  id: string;
  name: string;
  type?: string;
};

export type EventTicketingStatus =
  | 'available'
  | 'lastTickets'
  | 'soldOut'
  | 'free'
  | 'freeCapacity'
  | 'reservationRequired'
  | 'registrationRequired'
  | 'notYetAvailable'
  | 'unverified';

export type EventTicketingAction = {
  kind: 'purchase' | 'reservation' | 'registration';
  url: string;
  verifiedOfficial: boolean;
};

export type EventTicketing = {
  statuses: EventTicketingStatus[];
  action?: EventTicketingAction;
  baseAmountCents?: number;
  feesAmountCents?: number;
  totalAmountCents?: number;
  feesMayApply?: boolean;
};

export type Event = {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  artistName?: string;
  categoryId: string;
  subcategoryId: string;
  startsAt: ISODateTime;
  endsAt?: ISODateTime;
  location: EventLocation;
  price: EventPrice;
  sponsored?: boolean;
  changeNotice?: EventChangeNotice;
  doorTime?: string;
  durationMinutes?: number;
  ageRestriction?: string;
  program?: EventScheduleSection[];
  practicalInformation?: EventPracticalInformation;
  organizer?: EventOrganizer;
  organizerId?: string;
  source?: EventSource;
  ticketing?: EventTicketing;
  illustrationKey?: string;
  media?: EventMedia[];
  accessibility?: EventAccessibility;
  popularity?: 'standard' | 'significant';
  status: EventStatus;
};

/** La distancia pertenece al resultado de una consulta, no al evento. */
export type EventResult = {
  event: Event;
  distanceMeters?: number;
};
