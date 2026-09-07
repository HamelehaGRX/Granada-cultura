import type { TextStyle } from 'react-native';

export const fontFamilies = {
  system: undefined,
} as const;

export const typography = {
  display: {
    fontFamily: fontFamilies.system,
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700',
  },
  title: {
    fontFamily: fontFamilies.system,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  },
  heading: {
    fontFamily: fontFamilies.system,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600',
  },
  body: {
    fontFamily: fontFamilies.system,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodySmall: {
    fontFamily: fontFamilies.system,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  label: {
    fontFamily: fontFamilies.system,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
  },
  caption: {
    fontFamily: fontFamilies.system,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
} as const satisfies Record<
  'display' | 'title' | 'heading' | 'body' | 'bodySmall' | 'label' | 'caption',
  TextStyle
>;
