import { useMemo, useState, type ReactNode } from 'react';
import * as ExpoLinking from 'expo-linking';
import { router } from 'expo-router';
import { Image, Linking, Pressable, Share, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/layout/AppShell';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { colors, radii, shadows, sizes, spacing, typography } from '@/theme';
import { eventCategoryLabel, formatEventDay, formatEventDuration, formatEventTime } from '../presentation';
import { createHomeRepositories, type HomeRepositories } from '../repositories/homeRepositories';
import { EventCard } from '../components/EventCard';
import { EventIllustration } from '../illustrations/EventIllustration';
import { useEventInteraction } from '../interactions/EventInteractionProvider';
import { mapsUrlForEvent } from '../externalLinks';
import { selectRelatedEvents } from '../relatedEvents';
import type { Event, EventStatus } from '../types';
import { EventDetailHeader } from './EventDetailHeader';
import { EventMoreInformation } from './EventMoreInformation';
import { EventPersonalActions } from './EventPersonalActions';
import { EventTicketingPanel } from './EventTicketingPanel';
import { useEventDetail } from './useEventDetail';

const statusLabels: Partial<Record<EventStatus, string>> = {
  cancelled: 'CANCELADO', soldOut: 'AGOTADO', postponed: 'APLAZADO',
};

function currentStatusStyle(status: EventStatus) {
  return status === 'cancelled' || status === 'soldOut' ? styles.dangerBadge : styles.warningBadge;
}

function InfoRow({ glyph, label, value, action }: {
  glyph?: string; label: string; value: string; action?: ReactNode;
}) {
  return (
    <View accessibilityLabel={`${label}: ${value}`} style={styles.infoRow}>
      <View style={styles.infoLabelGroup}>
        {glyph ? <Text accessible={false} aria-hidden style={styles.infoIcon}>{glyph}</Text> : null}
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <View style={styles.infoValueGroup}>
        <Text style={styles.infoValue}>{value}</Text>
        {action}
      </View>
    </View>
  );
}

function ChangeNotice({ event }: { event: Event }) {
  const notice = event.changeNotice;
  if (!notice) return null;
  const updated = notice.updatedAt ? new Intl.DateTimeFormat('es-ES', {
    timeZone: event.location.timeZone, dateStyle: 'medium', timeStyle: 'short',
  }).format(new Date(notice.updatedAt)) : undefined;
  const accessibilityLabel = [notice.title, notice.summary, notice.currentValue,
    notice.previousValue, updated ? `Actualizado: ${updated}` : undefined].filter(Boolean).join('. ');
  return (
    <View accessibilityRole="alert" accessibilityLabel={accessibilityLabel} style={styles.notice}>
      <Text style={styles.noticePrimary}>
        <Text style={styles.noticeTitle}>{notice.title}</Text>
        {` · ${notice.currentValue}`}
      </Text>
      {notice.previousValue ? <Text style={styles.noticePrevious}>{notice.previousValue}</Text> : null}
      {updated ? <Text style={styles.noticeDate}>Actualizado: {updated}</Text> : null}
    </View>
  );
}

function DetailState({ message, action }: { message: string; action?: () => void }) {
  return (
    <View style={styles.state}>
      <Text accessibilityRole="header" style={styles.stateText}>{message}</Text>
      {action ? <Pressable accessibilityRole="button" onPress={action} style={styles.retry}>
        <Text style={styles.retryText}>Reintentar</Text>
      </Pressable> : null}
    </View>
  );
}

export function EventDetailScreen({ eventId, repositories }: { eventId: string; repositories?: HomeRepositories }) {
  const [defaults] = useState(createHomeRepositories);
  const data = useEventDetail(eventId, repositories ?? defaults);
  const { hydrated, interaction, interactions, toggleFavorite, toggleInterested, toggleGoing } = useEventInteraction(eventId);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const related = useMemo(() => data.event
    ? selectRelatedEvents(data.event, data.results, interactions) : [], [data.event, data.results, interactions]);

  const goBack = () => { if (router.canGoBack()) router.back(); else router.replace('/'); };
  const share = async () => {
    if (!data.event) return;
    const url = ExpoLinking.createURL(`/eventos/${data.event.id}`);
    try {
      await Share.share({ title: data.event.title, message: `${data.event.title}\n${url}`, url });
      setActionMessage(null);
    } catch { setActionMessage('No se ha podido abrir el diálogo para compartir.'); }
  };

  return (
    <AppShell testID="event-detail-screen">
      <EventDetailHeader favorite={interaction.favorite} hydrated={hydrated} onBack={goBack}
        onFavorite={toggleFavorite} onShare={() => { void share(); }} />
      <ScreenContainer scrollable maxWidth={sizes.readingMaxWidth}>
        {data.loading ? <DetailState message="Cargando evento…" />
          : data.error ? <DetailState message={data.error} action={data.retry} />
            : !data.event ? <DetailState message="Este evento no existe o ya no está disponible." />
              : <EventDetailContent event={data.event} categories={data.categories} related={related}
                actionMessage={actionMessage} onMapError={() => setActionMessage('No se ha podido abrir el mapa.')} />}
      </ScreenContainer>
    </AppShell>
  );
}

function EventDetailContent({ event, categories, related, actionMessage, onMapError }: {
  event: Event; categories: Parameters<typeof eventCategoryLabel>[1]; related: ReturnType<typeof selectRelatedEvents>;
  actionMessage: string | null; onMapError: () => void;
}) {
  const status = statusLabels[event.status];
  const authorizedImage = event.media?.find(item => item.kind === 'image' && item.authorizedForUse);
  const { hydrated, interaction, toggleFavorite, toggleInterested, toggleGoing } = useEventInteraction(event.id);
  const locality = [event.location.locality, event.location.province].filter(Boolean).join(', ');
  return (
    <View style={styles.content}>
      <ChangeNotice event={event} />
      {event.sponsored ? <Text style={styles.sponsored}>PATROCINADO</Text> : null}
      {authorizedImage ? <Image source={{ uri: authorizedImage.url }} resizeMode="cover"
        accessibilityLabel={authorizedImage.alternativeText ?? `Imagen de ${event.title}`} style={styles.hero} />
        : <EventIllustration illustrationKey={event.illustrationKey} featured />}

      <View style={styles.identity}>
        <Text style={styles.category}>{eventCategoryLabel(event, categories)}</Text>
        {status ? <Text style={[styles.badge, currentStatusStyle(event.status)]}>{status}</Text> : null}
        <Text accessibilityRole="header" aria-level={1} style={styles.title}>{event.title}</Text>
      </View>

      <View style={styles.section}>
        <Text accessibilityRole="header" aria-level={2} style={styles.sectionTitle}>Información esencial</Text>
        <InfoRow glyph="▣" label="Fecha" value={formatEventDay(event)} />
        <InfoRow glyph="◷" label="Hora" value={formatEventTime(event.startsAt, event.location.timeZone)} />
        {event.doorTime ? <InfoRow label="Apertura de puertas" value={event.doorTime} /> : null}
        {event.durationMinutes ? <InfoRow label="Duración aproximada" value={formatEventDuration(event.durationMinutes)} /> : null}
        {event.endsAt ? <InfoRow label="Finalización estimada" value={formatEventTime(event.endsAt, event.location.timeZone)} /> : null}
        {event.ageRestriction ? <InfoRow label="Edad" value={event.ageRestriction} /> : null}
        <InfoRow glyph="⌖" label="Lugar" value={`${event.location.venueName} · ${locality}`}
          action={<Pressable accessibilityRole="link" accessibilityLabel={`Ver ${event.location.venueName} en Maps`}
            onPress={() => { void Linking.openURL(mapsUrlForEvent(event)).catch(onMapError); }} style={styles.inlineLink}>
            <Text style={styles.inlineLinkText}>Ver en Maps</Text>
          </Pressable>} />
      </View>

      <View style={styles.section}>
        <Text accessibilityRole="header" aria-level={2} style={styles.sectionTitle}>Entradas y acceso</Text>
        <EventTicketingPanel event={event} />
      </View>

      <EventPersonalActions hydrated={hydrated} interaction={interaction} onFavorite={toggleFavorite}
        onInterested={toggleInterested} onGoing={toggleGoing} />
      {actionMessage ? <Text accessibilityLiveRegion="polite" style={styles.actionMessage}>{actionMessage}</Text> : null}

      {event.shortDescription ?? event.description ? (
        <View style={styles.section}>
          <Text accessibilityRole="header" aria-level={2} style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>{event.shortDescription ?? event.description}</Text>
        </View>
      ) : null}
      <EventMoreInformation event={event} />

      <View style={styles.relatedSection}>
        <Text accessibilityRole="header" aria-level={2} style={styles.relatedTitle}>TAMBIÉN PODRÍA INTERESARTE</Text>
        {related.map(result => <EventCard key={result.event.id} result={result}
          categoryLabel={eventCategoryLabel(result.event, categories)} illustrationKey={result.event.illustrationKey}
          onOpen={() => router.push({ pathname: '/eventos/[eventId]', params: { eventId: result.event.id } })} />)}
        {related.length === 0 ? <Text style={styles.description}>No hay propuestas relacionadas suficientes por ahora.</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingBottom: spacing.xl },
  notice: { gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.medium,
    backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warning },
  noticePrimary: { ...typography.bodySmall, color: colors.textPrimary },
  noticeTitle: { fontWeight: '700', color: colors.warning },
  noticePrevious: { ...typography.caption, color: colors.textSecondary },
  noticeDate: { ...typography.caption, color: colors.textSecondary },
  sponsored: { ...typography.caption, color: colors.brandPrimary, letterSpacing: 1.5, alignSelf: 'flex-start',
    borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radii.pill, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  hero: { width: '100%', aspectRatio: sizes.eventHeroAspectRatio,
    borderRadius: radii.large, backgroundColor: colors.surface },
  identity: { gap: spacing.sm },
  category: { ...typography.label, color: colors.brandPrimary },
  badge: { ...typography.label, alignSelf: 'flex-start', paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs, borderRadius: radii.pill, overflow: 'hidden' },
  dangerBadge: { color: colors.error, backgroundColor: colors.errorSurface },
  warningBadge: { color: colors.warning, backgroundColor: colors.warningSurface },
  title: { ...typography.display, color: colors.textPrimary },
  section: { gap: spacing.md, padding: spacing.lg, borderRadius: radii.large,
    backgroundColor: colors.surface, ...shadows.soft },
  sectionTitle: { ...typography.heading, color: colors.textPrimary },
  infoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, alignItems: 'flex-start' },
  infoLabelGroup: { width: 152, maxWidth: '42%', flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  infoIcon: { ...typography.body, width: 22, color: colors.brandPrimary, textAlign: 'center', fontWeight: '700' },
  infoLabel: { ...typography.label, flex: 1, color: colors.textSecondary },
  infoValueGroup: { flex: 1, minWidth: 160, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm },
  infoValue: { ...typography.body, color: colors.textPrimary, flexShrink: 1 },
  inlineLink: { minHeight: sizes.touchTarget, alignSelf: 'flex-start', justifyContent: 'center' },
  inlineLinkText: { ...typography.label, color: colors.brandPrimary, textDecorationLine: 'underline' },
  description: { ...typography.body, color: colors.textSecondary },
  actionMessage: { ...typography.bodySmall, color: colors.warning },
  relatedSection: { gap: spacing.md, marginTop: spacing.lg },
  relatedTitle: { ...typography.label, color: colors.brandPrimary, letterSpacing: 1.5 },
  state: { flex: 1, minHeight: 240, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  stateText: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  retry: { minHeight: sizes.touchTarget, justifyContent: 'center', paddingHorizontal: spacing.lg,
    borderRadius: radii.medium, backgroundColor: colors.brandPrimary },
  retryText: { ...typography.label, color: colors.textInverse },
});
