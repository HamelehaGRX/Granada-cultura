import { Stack } from 'expo-router';

import { useAppTheme } from '@/theme';

export default function ModalLayout() {
  const { colors } = useAppTheme();
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
