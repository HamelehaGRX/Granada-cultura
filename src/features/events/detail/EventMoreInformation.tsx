import { useState, type ReactNode } from 'react';
import { router } from 'expo-router';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { radii, sizes, spacing, typography, useThemeStyles, type ThemeColors } from '@/theme';
import { isSafeWebUrl } from '../ticketing';
import type { Event } from '../types';

function dateTime(value: string, timeZone: string) {
  return new Intl.DateTimeFormat('es-ES', {
    timeZone, dateStyle: 'medium', timeStyle: 'short',
  }).format(new Date(value));
}

function InformationBlock({ title, children }: { title: string; children: ReactNode }) {
  const styles = useThemeStyles(createStyles);
  return (
    <View style={styles.block}>
      <Text accessibilityRole="header" aria-level={3} style={styles.heading}>{title}</Text>
      {children}
    </View>
  );
}

function AccessibilityAndPractical({ event }: { event: Event }) {
  const styles = useThemeStyles(createStyles);
  const accessibility = event.accessibility;
  const practical = event.practicalInformation;
  const lines = accessibility ? [
    accessibility.wheelchairAccessible === true ? 'Acceso para movilidad reducida.'
      : accessibility.wheelchairAccessible === false ? 'Sin acceso adaptado para movilidad reducida.' : null,
    accessibility.accessibleToilet === true ? 'Aseo adaptado.'
      : accessibility.accessibleToilet === false ? 'Sin aseo adaptado.' : null,
    accessibility.hearingAssistance === true ? 'Asistencia auditiva disponible.' : null,
    accessibility.hearingLoop === true ? 'Bucle magnético disponible.' : null,
    accessibility.audioDescription === true ? 'Audiodescripción disponible.' : null,
    accessibility.notes ?? null,
  ].filter((line): line is string => Boolean(line)) : [];
  const practicalLines = practical ? [
    practical.setting === 'indoor' ? 'Actividad en interior.'
      : practical.setting === 'outdoor' ? 'Actividad al aire libre.'
        : practical.setting === 'mixed' ? 'Actividad en espacios interiores y exteriores.' : null,
    practical.publicTransport ? `Transporte público: ${practical.publicTransport}` : null,
    practical.parking ? `Aparcamiento: ${practical.parking}` : null,
    ...(practical.notes ?? []),
  ].filter((line): line is string => Boolean(line)) : [];
  return (
    <InformationBlock title="Accesibilidad e información práctica">
      {lines.length > 0 ? lines.map(line => <Text key={line} style={styles.line}>• {line}</Text>)
        : <Text style={styles.unavailable}>Información de accesibilidad no disponible.</Text>}
      {practicalLines.map(line => <Text key={line} style={styles.line}>• {line}</Text>)}
    </InformationBlock>
  );
}

export function EventMoreInformation({ event }: { event: Event }) {
  const styles = useThemeStyles(createStyles);
  const [expanded, setExpanded] = useState(false);
  const sourceLink = event.source?.verifiedOfficial && event.source.url && isSafeWebUrl(event.source.url)
    ? event.source.url : undefined;
  return (
    <View>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded }} aria-expanded={expanded}
        accessibilityLabel={expanded ? 'Ocultar más información' : 'Mostrar más información'}
        onPress={() => setExpanded(value => !value)}
        style={({ pressed }) => [styles.toggle, pressed && styles.pressed]}>
        <Text style={styles.toggleLabel}>{expanded ? 'Menos información' : 'Más información'}</Text>
        <View accessible={false} style={[styles.chevron, expanded ? styles.chevronUp : styles.chevronDown]} />
      </Pressable>
      {expanded ? (
        <View style={styles.content} testID="event-more-information">
          {event.program?.length ? (
            <InformationBlock title="Programa / participantes">
              {event.program.map((section, index) => (
                <View key={`${section.label ?? 'programa'}-${index}`} style={styles.programSection}>
                  {section.label ? <Text style={styles.programLabel}>{section.label}</Text> : null}
                  {section.items.map((item, itemIndex) => (
                    <View key={`${item.title}-${itemIndex}`} style={styles.programItem}>
                      {item.time ? <Text style={styles.programTime}>{item.time}</Text> : null}
                      <View style={styles.programDescription}>
                        <Text style={styles.programTitle}>{item.title}</Text>
                        {item.detail ? <Text style={styles.line}>{item.detail}</Text> : null}
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </InformationBlock>
          ) : null}
          <AccessibilityAndPractical event={event} />
          {event.organizer ? (
            <InformationBlock title="Organiza">
              <Text style={styles.programTitle}>{event.organizer.name}</Text>
              {event.organizer.type ? <Text style={styles.line}>{event.organizer.type}</Text> : null}
              <Pressable accessibilityRole="link" accessibilityLabel={`Ver organizador ${event.organizer.name}`}
                onPress={() => router.push({ pathname: '/organizadores/[organizerId]',
                  params: { organizerId: event.organizer!.id } })} style={styles.textLink}>
                <Text style={styles.textLinkLabel}>Ver perfil del organizador</Text>
              </Pressable>
            </InformationBlock>
          ) : null}
          <InformationBlock title="Fuente e información">
            {event.source ? (
              <>
                <Text style={styles.programTitle}>{event.source.provider}</Text>
                <Text style={styles.line}>{event.source.verifiedOfficial ? 'Fuente oficial verificada.' : 'Procedencia no verificada.'}</Text>
                {event.source.lastCheckedAt
                  ? <Text style={styles.line}>Última comprobación: {dateTime(event.source.lastCheckedAt, event.location.timeZone)}</Text> : null}
                {event.source.lastUpdatedAt
                  ? <Text style={styles.line}>Última actualización: {dateTime(event.source.lastUpdatedAt, event.location.timeZone)}</Text> : null}
                {sourceLink ? (
                  <Pressable accessibilityRole="link"
                    onPress={() => { void Linking.openURL(sourceLink).catch(() => undefined); }}
                    style={styles.textLink}>
                    <Text style={styles.textLinkLabel}>Ver fuente oficial</Text>
                  </Pressable>
                ) : null}
              </>
            ) : <Text style={styles.unavailable}>Información de procedencia no disponible.</Text>}
          </InformationBlock>
        </View>
      ) : null}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  toggle: {
    minWidth: 208, minHeight: sizes.touchTarget, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderWidth: 1, borderColor: colors.borderStrong,
    borderRadius: radii.medium, backgroundColor: colors.surface,
  },
  pressed: { backgroundColor: colors.surfaceElevated },
  toggleLabel: { ...typography.label, color: colors.textPrimary },
  chevron: { width: 9, height: 9, borderRightWidth: 2, borderBottomWidth: 2, borderColor: colors.brandPrimary },
  chevronDown: { transform: [{ rotate: '45deg' }] },
  chevronUp: { transform: [{ rotate: '225deg' }] },
  content: { width: '100%', gap: spacing.lg, paddingTop: spacing.lg },
  block: { gap: spacing.sm, padding: spacing.md, borderRadius: radii.medium, backgroundColor: colors.surface },
  heading: { ...typography.heading, color: colors.textPrimary },
  line: { ...typography.bodySmall, color: colors.textSecondary },
  unavailable: { ...typography.bodySmall, color: colors.warning },
  programSection: { gap: spacing.sm },
  programLabel: { ...typography.label, color: colors.brandPrimary },
  programItem: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  programTime: { ...typography.label, color: colors.brandPrimary, width: 48 },
  programDescription: { flex: 1, minWidth: 0 },
  programTitle: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  textLink: { minHeight: sizes.touchTarget, alignSelf: 'flex-start', justifyContent: 'center' },
  textLinkLabel: { ...typography.label, color: colors.brandPrimary, textDecorationLine: 'underline' },
});
