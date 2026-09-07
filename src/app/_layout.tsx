import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="eventos/[eventId]"
          options={{ title: 'Detalle del evento' }}
        />
        <Stack.Screen name="buscar" options={{ title: 'Buscar' }} />
        <Stack.Screen
          name="organizadores/[organizerId]"
          options={{ title: 'Organizador' }}
        />
        <Stack.Screen
          name="notificaciones/index"
          options={{ title: 'Notificaciones' }}
        />
        <Stack.Screen
          name="(modals)"
          options={{ presentation: 'modal' }}
        />
      </Stack>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
