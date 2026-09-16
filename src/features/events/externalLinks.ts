import { Platform } from 'react-native';

import type { Event } from './types';

export function eventLocationQuery(event: Event): string {
  const { venueName, address, locality } = event.location;
  return [venueName, address, locality].filter(Boolean).join(', ');
}

export function mapsUrlForEvent(event: Event): string {
  const coordinates = event.location.coordinates;
  const query = coordinates
    ? `${coordinates.latitude},${coordinates.longitude}`
    : eventLocationQuery(event);
  if (Platform.OS !== 'web' && coordinates) {
    return `geo:${coordinates.latitude},${coordinates.longitude}?q=${encodeURIComponent(event.title)}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
