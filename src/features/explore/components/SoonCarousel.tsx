import type { Category } from '@/features/categories/types';
import type { ExploreCandidate } from '../types';
import { ExploreCarousel } from './ExploreCarousel';

export function SoonCarousel({ candidates, categories, now, onMore }: {
  candidates: readonly ExploreCandidate[]; categories: Category[]; now: Date; onMore: () => void;
}) {
  return <ExploreCarousel kind="soon" title="Ocurre pronto" candidates={candidates}
    categories={categories} now={now} onMore={onMore} />;
}
