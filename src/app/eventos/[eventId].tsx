import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function EventDetailScreen() {
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();

  return (
    <PlaceholderScreen
      title="Detalle del evento"
      description="Ruta preparada para mostrar un evento cuando se migren los datos y las tarjetas."
      parameter={{
        label: 'Identificador del evento',
        value: eventId ?? 'No indicado',
      }}
      showBackAction
    />
  );
}
