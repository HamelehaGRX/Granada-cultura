import { useCallback } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { HomeScreen } from '@/features/events/screens/HomeScreen';

export default function HomeRoute() {
  const { q, panel } = useLocalSearchParams<{ q?: string | string[]; panel?: string | string[] }>();
  const handled = useCallback(() => router.setParams({ q: undefined, panel: undefined }), []);
  return <HomeScreen incomingQuery={Array.isArray(q) ? q[0] : q}
    incomingPanel={Array.isArray(panel) ? panel[0] : panel} onRequestHandled={handled} />;
}
