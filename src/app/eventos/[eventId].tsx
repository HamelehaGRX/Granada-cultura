import { useLocalSearchParams } from 'expo-router';

import { EventDetailScreen as EventDetail } from '@/features/events/detail/EventDetailScreen';

export default function EventDetailScreen() {
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  return <EventDetail eventId={eventId ?? ''} />;
}
