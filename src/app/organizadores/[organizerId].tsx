import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function OrganizerDetailScreen() {
  const { organizerId } = useLocalSearchParams<{ organizerId?: string }>();

  return (
    <PlaceholderScreen
      title="Organizador"
      description="Ruta preparada para el futuro perfil público de un organizador."
      parameter={{
        label: 'Identificador del organizador',
        value: organizerId ?? 'No indicado',
      }}
      showBackAction
    />
  );
}
