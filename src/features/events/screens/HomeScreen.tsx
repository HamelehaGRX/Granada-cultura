import { useEffect, useState } from 'react';

import { AppShell } from '@/components/layout/AppShell';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EventList } from '../components/EventList';
import { HomeHeader } from '../components/HomeHeader';
import { useHomeEvents } from '../hooks/useHomeEvents';
import { createHomeRepositories, type HomeRepositories } from '../repositories/homeRepositories';
import { FilterBar } from '../../filters/components/FilterBar';
import { FilterModal } from '../../filters/components/FilterModal';
import { activeFilterGroupCount } from '../../filters/draft';
import { useEventFilters } from '../../filters/hooks/useEventFilters';
import type { FilterPanel } from '../../filters/types';

/** Inyección opcional para pruebas y futura composición con backend. */
export function HomeScreen({ repositories, incomingQuery, incomingPanel, onRequestHandled }: {
  repositories?: HomeRepositories; incomingQuery?: string; incomingPanel?: string; onRequestHandled?: () => void;
}) {
  const [defaults] = useState(createHomeRepositories);
  const { data, categories, loading, error, retry } = useHomeEvents(repositories ?? defaults);
  const filters = useEventFilters(data, categories, !loading && !error);
  const [panel, setPanel] = useState<FilterPanel | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { setQuery } = filters;
  useEffect(() => {
    if (incomingQuery === undefined && incomingPanel === undefined) return;
    if (incomingQuery !== undefined) setQuery(incomingQuery);
    if (incomingPanel === 'date') {
      setPanel('date');
      setFiltersOpen(true);
    }
    onRequestHandled?.();
  }, [incomingQuery, incomingPanel, onRequestHandled, setQuery]);

  return (
    <AppShell>
      <HomeHeader query={filters.state.query} onQueryChange={filters.setQuery} />
      <ScreenContainer>
        <EventList data={filters.results} categories={categories} loading={loading || (!error && !filters.hydrated)} error={error} onRetry={retry}
          filtered={filters.active} onClear={filters.clear}
          filters={filters.hydrated ? <FilterBar activeCount={activeFilterGroupCount(filters.state)}
            onOpen={() => { setPanel(null); setFiltersOpen(true); }} /> : null} />
      </ScreenContainer>
      <FilterModal visible={filtersOpen} appliedState={filters.state} categories={categories}
        initialPanel={panel} onApply={filters.apply} onClearApplied={filters.clearFilters}
        onDismiss={() => { setFiltersOpen(false); setPanel(null); }} />
    </AppShell>
  );
}
