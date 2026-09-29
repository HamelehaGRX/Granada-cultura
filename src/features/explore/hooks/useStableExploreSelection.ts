import { useEffect, useMemo, useState } from 'react';

import { nextExploreSelectionSnapshot, retainValidExploreSessionIds,
  type ExploreSelectionSnapshot } from '../selection';
import type { ExploreCandidate, ExploreContext } from '../types';

/** Congela IDs y orden de la vista; EventCard sigue leyendo las interacciones compartidas. */
export function useStableExploreSelection(selection: readonly ExploreCandidate[],
  candidates: readonly ExploreCandidate[], context: ExploreContext, ready: boolean,
  generationKey = '') {
  const [snapshot, setSnapshot] = useState<ExploreSelectionSnapshot | null>(null);

  useEffect(() => {
    if (ready) setSnapshot(current => nextExploreSelectionSnapshot(current, selection, generationKey));
  }, [ready, selection, generationKey]);

  return useMemo(() => snapshot === null ? null
    : retainValidExploreSessionIds(snapshot.ids, candidates, context),
  [snapshot, candidates, context]);
}
