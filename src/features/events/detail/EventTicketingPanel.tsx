import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { radii, sizes, spacing, typography, useThemeStyles, type ThemeColors } from '@/theme';
import { getSafeTicketingAction, ticketingNeedsSafetyNotice } from '../ticketing';
import type { Event, EventTicketingStatus } from '../types';

const statusLabels: Record<EventTicketingStatus, string> = {
  available: 'Entradas disponibles', lastTickets: 'Últimas entradas', soldOut: 'Agotado',
  free: 'Entrada gratuita', freeCapacity: 'Entrada libre hasta completar aforo',
  reservationRequired: 'Reserva necesaria', registrationRequired: 'Inscripción previa',
  notYetAvailable: 'Venta todavía no disponible', unverified: 'Información de venta no verificada',
};

function money(cents: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

export function EventTicketingPanel({ event }: { event: Event }) {
  const styles = useThemeStyles(createStyles);
  const ticketing = event.ticketing;
  if (!ticketing) {
    return <Text style={styles.safety}>No se dispone todavía de información fiable sobre entradas o reservas.</Text>;
  }
  const action = getSafeTicketingAction(ticketing);
  const free = ticketing.statuses.includes('free');
  const soldOut = ticketing.statuses.includes('soldOut');
  return (
    <View style={styles.panel}>
      <View style={styles.statuses}>
        {ticketing.statuses.map(status => (
          <Text key={status} style={[styles.status,
            free && status === 'free' && styles.free, soldOut && status === 'soldOut' && styles.soldOut]}>
            {statusLabels[status]}
          </Text>
        ))}
      </View>
      {ticketing.baseAmountCents !== undefined ? (
        <View style={styles.pricing}>
          <Text style={styles.priceRow}>Entrada: {money(ticketing.baseAmountCents)}</Text>
          {ticketing.feesAmountCents !== undefined
            ? <Text style={styles.priceRow}>Gastos de gestión: {money(ticketing.feesAmountCents)}</Text> : null}
          {ticketing.totalAmountCents !== undefined
            ? <Text style={styles.total}>Total: {money(ticketing.totalAmountCents)}</Text> : null}
          {ticketing.feesMayApply && ticketing.feesAmountCents === undefined
            ? <Text style={styles.note}>{money(ticketing.baseAmountCents)} + posibles gastos de gestión</Text> : null}
        </View>
      ) : null}
      {action ? (
        <Pressable accessibilityRole="link" accessibilityLabel={action.label}
          onPress={() => { void Linking.openURL(action.url).catch(() => undefined); }}
          style={({ pressed }) => [styles.cta, pressed && styles.pressed]}>
          <Text style={styles.ctaLabel}>{action.label}</Text>
        </Pressable>
      ) : null}
      {ticketingNeedsSafetyNotice(ticketing) ? (
        <Text accessibilityRole="alert" style={styles.safety}>
          No se ha podido verificar un punto de venta oficial. Evita comprar desde enlaces no publicados por fuentes oficiales o de dudosa procedencia.
        </Text>
      ) : null}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  panel: { gap: spacing.md },
  statuses: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  status: { ...typography.label, color: colors.textPrimary, paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs, borderRadius: radii.pill, backgroundColor: colors.surfaceElevated },
  free: { color: colors.success, backgroundColor: colors.successSurface },
  soldOut: { color: colors.error, backgroundColor: colors.errorSurface },
  pricing: { gap: spacing.xs },
  priceRow: { ...typography.bodySmall, color: colors.textPrimary },
  total: { ...typography.body, fontWeight: '700', color: colors.textPrimary },
  note: { ...typography.bodySmall, color: colors.textSecondary },
  cta: { minHeight: sizes.touchTarget, alignItems: 'center', justifyContent: 'center',
    borderRadius: radii.medium, backgroundColor: colors.brandPrimary, paddingHorizontal: spacing.md },
  ctaLabel: { ...typography.label, color: colors.textOnPrimary },
  pressed: { backgroundColor: colors.brandPrimaryPressed },
  safety: { ...typography.bodySmall, color: colors.warning, backgroundColor: colors.warningSurface,
    padding: spacing.md, borderRadius: radii.medium },
});
