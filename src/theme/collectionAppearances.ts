import type { EffectiveTheme } from './themePreference';

export type CollectionAppearance = Readonly<{ icon: string; accent: string; surface: string }>;

/** Identidad provisional de formas de descubrir; independiente de la categoría de cada evento. */
export const lightCollectionAppearances = Object.freeze({
  under10: { icon: '✧', accent: '#8a4d15', surface: '#fbe9da' },
  emergingArtists: { icon: '✦', accent: '#8c3c71', surface: '#f8e4f1' },
  smallVenues: { icon: '▢', accent: '#315f84', surface: '#e0edf7' },
  hiddenHeritage: { icon: '◇', accent: '#776028', surface: '#f3ecd8' },
  ruralCulture: { icon: '❋', accent: '#436847', surface: '#e5f0e1' },
  localScene: { icon: '◎', accent: '#9a493c', surface: '#fae4dc' },
  participate: { icon: '✳', accent: '#8f4d18', surface: '#fbe8d5' },
  yourNeighborhood: { icon: '⌂', accent: '#1c6d70', surface: '#daf1ef' },
  curious: { icon: '◈', accent: '#66528e', surface: '#ebe6f8' },
  atNight: { icon: '☾', accent: '#3d4c88', surface: '#e4e8f8' },
  outdoors: { icon: '☼', accent: '#426d39', surface: '#e3f0df' },
  somethingNew: { icon: '↗', accent: '#7e3e64', surface: '#f4e2ed' },
} satisfies Record<string, CollectionAppearance>);

export const darkCollectionAppearances = Object.freeze({
  under10: { icon: '✧', accent: '#f9bf88', surface: '#483020' },
  emergingArtists: { icon: '✦', accent: '#efabd6', surface: '#44283b' },
  smallVenues: { icon: '▢', accent: '#a5d4f5', surface: '#253747' },
  hiddenHeritage: { icon: '◇', accent: '#e7cf8d', surface: '#413821' },
  ruralCulture: { icon: '❋', accent: '#abd7a8', surface: '#263b2a' },
  localScene: { icon: '◎', accent: '#f0b4a3', surface: '#482b28' },
  participate: { icon: '✳', accent: '#f1bd86', surface: '#49301e' },
  yourNeighborhood: { icon: '⌂', accent: '#8cdbd6', surface: '#204044' },
  curious: { icon: '◈', accent: '#c6b3f2', surface: '#352c49' },
  atNight: { icon: '☾', accent: '#b6c5ff', surface: '#28304d' },
  outdoors: { icon: '☼', accent: '#a7d99c', surface: '#273e27' },
  somethingNew: { icon: '↗', accent: '#ebaed1', surface: '#44293c' },
} satisfies Record<keyof typeof lightCollectionAppearances, CollectionAppearance>);

export function collectionAppearanceFor(id: keyof typeof lightCollectionAppearances,
  theme: EffectiveTheme): CollectionAppearance {
  return theme === 'dark' ? darkCollectionAppearances[id] : lightCollectionAppearances[id];
}
