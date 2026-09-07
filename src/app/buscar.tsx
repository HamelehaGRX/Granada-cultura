import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function SearchScreen() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  const visibleQuery = q?.trim() || 'Sin término';

  return (
    <PlaceholderScreen
      title="Buscar"
      description="Ruta preparada para recibir un término sin ejecutar todavía una búsqueda real."
      parameter={{ label: 'Término recibido', value: visibleQuery }}
      showBackAction
    />
  );
}
