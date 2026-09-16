import type { EventTicketing, EventTicketingAction } from './types';

const actionStatuses = {
  purchase: ['available', 'lastTickets'],
  reservation: ['reservationRequired'],
  registration: ['registrationRequired'],
} as const;

export type SafeTicketingAction = EventTicketingAction & { label: string };

export function isSafeWebUrl(value: string): boolean {
  try {
    const protocol = new URL(value).protocol;
    return protocol === 'https:' || protocol === 'http:';
  } catch {
    return false;
  }
}

export function isSafeHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Frontera de seguridad: la UI nunca recibe un CTA directo si la acción no
 * está marcada explícitamente como oficial/verificada o el estado lo bloquea.
 */
export function getSafeTicketingAction(ticketing?: EventTicketing): SafeTicketingAction | null {
  const action = ticketing?.action;
  if (!ticketing || !action?.verifiedOfficial || !isSafeHttpsUrl(action.url)
    || ticketing.statuses.includes('soldOut') || ticketing.statuses.includes('notYetAvailable')
    || ticketing.statuses.includes('unverified')) return null;
  const allowed = actionStatuses[action.kind] as readonly string[];
  if (!ticketing.statuses.some(status => allowed.includes(status))) return null;
  const label = action.kind === 'purchase' ? 'Comprar entradas'
    : action.kind === 'reservation' ? 'Reservar plaza' : 'Inscribirse';
  return { ...action, label };
}

export function ticketingNeedsSafetyNotice(ticketing?: EventTicketing): boolean {
  return Boolean(ticketing?.statuses.includes('unverified')
    || (ticketing?.action && (!ticketing.action.verifiedOfficial || !isSafeHttpsUrl(ticketing.action.url))));
}
