import { Stack } from 'expo-router';

import { colors } from '@/theme';

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerShown: false,
        presentation: 'modal',
      }}
    >
      <Stack.Screen name="filtros" options={{ title: 'Filtros' }} />
    </Stack>
  );
}
