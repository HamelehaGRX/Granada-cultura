import type { ExploreEditorial } from './types';

/** Etiquetas exclusivamente ficticias del catálogo Expo; no certifican cualidades de eventos reales. */
export const DEMO_EDITORIAL: Readonly<Record<string, ExploreEditorial>> = {
  'demo-02': { provenance: 'demo', emergingArtist: true, smallVenue: true },
  'demo-03': { provenance: 'demo', emergingArtist: true, smallVenue: true,
    activeParticipation: true, localScene: true },
  'demo-06': { provenance: 'demo', smallVenue: true, nighttime: true, outdoor: true },
  'demo-09': { provenance: 'demo', localScene: true, activeParticipation: true },
  'demo-10': { provenance: 'demo', emergingArtist: true, smallVenue: true, localScene: true },
  'demo-11': { provenance: 'demo', hiddenHeritage: true, curiosity: true, outdoor: true },
  'demo-12': { provenance: 'demo', rural: true, outdoor: true },
  'demo-13': { provenance: 'demo', localScene: true },
  'demo-14': { provenance: 'demo', nighttime: true, outdoor: true },
  'demo-15': { provenance: 'demo', smallVenue: true, nighttime: true },
  'demo-16': { provenance: 'demo', activeParticipation: true },
  'demo-21': { provenance: 'demo', activeParticipation: true, curiosity: true },
  'demo-22': { provenance: 'demo', emergingArtist: true, smallVenue: true },
};
