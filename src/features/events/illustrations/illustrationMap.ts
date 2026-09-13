export type IllustrationVariant = 'cream' | 'rose' | 'burgundy';

export type EventIllustrationDefinition = Readonly<{
  key: string;
  mark: string;
  variant: IllustrationVariant;
}>;

const definitions: Readonly<Record<string, EventIllustrationDefinition>> = Object.freeze({
  generica: { key: 'generica', mark: '✦', variant: 'cream' },
  'cine/cine-independiente': { key: 'cine/cine-independiente', mark: 'C', variant: 'burgundy' },
  'comedia/monologos': { key: 'comedia/monologos', mark: '☺', variant: 'rose' },
  'danza/contemporanea': { key: 'danza/contemporanea', mark: 'D', variant: 'cream' },
  'exposiciones/fotografia': { key: 'exposiciones/fotografia', mark: '◉', variant: 'burgundy' },
  'exposiciones/pintura': { key: 'exposiciones/pintura', mark: 'P', variant: 'rose' },
  'ferias/mercado-medieval': { key: 'ferias/mercado-medieval', mark: 'F', variant: 'cream' },
  'gastronomia/catas': { key: 'gastronomia/catas', mark: 'G', variant: 'burgundy' },
  'infantil/magia': { key: 'infantil/magia', mark: '✧', variant: 'rose' },
  'literatura/poesia': { key: 'literatura/poesia', mark: 'L', variant: 'cream' },
  'musica/flamenco': { key: 'musica/flamenco', mark: 'F', variant: 'burgundy' },
  'musica/jazz': { key: 'musica/jazz', mark: 'J', variant: 'rose' },
  'musica/rock': { key: 'musica/rock', mark: '♪', variant: 'cream' },
  'patrimonio/visitas-guiadas': { key: 'patrimonio/visitas-guiadas', mark: 'P', variant: 'burgundy' },
  'teatro/drama': { key: 'teatro/drama', mark: 'T', variant: 'rose' },
});

export const eventIllustrationKeys = Object.freeze(Object.keys(definitions));

export function hasEventIllustration(key: string): boolean {
  return Object.prototype.hasOwnProperty.call(definitions, key);
}

export function resolveEventIllustration(key?: string): EventIllustrationDefinition {
  return key && hasEventIllustration(key) ? definitions[key] : definitions.generica;
}
