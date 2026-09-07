import { router } from 'expo-router';

import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function HomeScreen() {
  return (
    <PlaceholderScreen
      title="Inicio"
      description="La nueva base universal está lista para recibir la interfaz del prototipo."
      primaryAction={{
        accessibilityHint: 'Abre el modal provisional de filtros',
        label: 'Abrir filtros',
        onPress: () => router.push('/filtros'),
      }}
      showBrand
    />
  );
}
