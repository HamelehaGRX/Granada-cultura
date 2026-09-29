import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppSplash } from '@/components/branding/AppSplash';
import { EventInteractionProvider } from '@/features/events/interactions/EventInteractionProvider';
import { SoonFilterProvider } from '@/features/explore/SoonFilterProvider';
import { ExplorePreferencesProvider } from '@/features/explore/ExplorePreferencesProvider';
import { BRAND } from '@/config/brand';
import { AppThemeProvider, typography, useAppTheme } from '@/theme';

function ThemedApplication() {
  const { colors, hydrated, isDark } = useAppTheme();

  if (!hydrated) {
    return (
      <View style={styles.bootstrap} testID="theme-bootstrap">
        <Text style={styles.bootstrapName}>{BRAND.name}</Text>
      </View>
    );
  }

  return (
    <EventInteractionProvider>
      <SoonFilterProvider>
      <ExplorePreferencesProvider>
        <Stack screenOptions={{ contentStyle: { backgroundColor: colors.background }, headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="eventos/[eventId]" options={{ title: 'Detalle del evento' }} />
          <Stack.Screen name="buscar" options={{ title: 'Buscar' }} />
          <Stack.Screen name="organizadores/[organizerId]" options={{ title: 'Organizador' }} />
          <Stack.Screen name="notificaciones/index" options={{ title: 'Notificaciones' }} />
          <Stack.Screen name="(modals)" options={{ presentation: 'modal' }} />
          <Stack.Screen name="explorar/ocurre-pronto" options={{ title: 'Ocurre pronto' }} />
          <Stack.Screen name="explorar/descubre" options={{ title: 'Descubre de otra forma' }} />
          <Stack.Screen name="explorar/escapate" options={{ title: 'Escápate un poco' }} />
          <Stack.Screen name="explorar/para-ti" options={{ title: 'También podría interesarte' }} />
          <Stack.Screen name="explorar/colecciones/index" options={{ title: 'Todas las colecciones' }} />
          <Stack.Screen name="explorar/colecciones/[collectionId]" options={{ title: 'Colección' }} />
        </Stack>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <AppSplash />
      </ExplorePreferencesProvider>
      </SoonFilterProvider>
    </EventInteractionProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <ThemedApplication />
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  bootstrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#641f3a' },
  bootstrapName: { ...typography.display, color: '#fff7f5', letterSpacing: 6, paddingLeft: 6 },
});
