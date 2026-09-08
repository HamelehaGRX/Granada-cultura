import { useState } from 'react';

import { AppShell } from '@/components/layout/AppShell';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EventList } from '../components/EventList';
import { HomeHeader } from '../components/HomeHeader';
import { useHomeEvents } from '../hooks/useHomeEvents';
import { createHomeRepositories, type HomeRepositories } from '../repositories/homeRepositories';

/** Inyección opcional para pruebas y futura composición con backend. */
export function HomeScreen({ repositories }: { repositories?: HomeRepositories }) {
  const [defaults] = useState(createHomeRepositories);
  const { data, categories, loading, error, retry } = useHomeEvents(repositories ?? defaults);

  return (
    <AppShell>
      <HomeHeader />
      <ScreenContainer>
        <EventList data={data} categories={categories} loading={loading} error={error} onRetry={retry} />
      </ScreenContainer>
    </AppShell>
  );
}
