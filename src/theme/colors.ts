export type ThemeColors = Readonly<{
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  brandPrimary: string;
  brandPrimaryPressed: string;
  brandSurface: string;
  brandSurfacePressed: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  textOnPrimary: string;
  border: string;
  borderStrong: string;
  inputBackground: string;
  overlay: string;
  cardBorderCream: string;
  cardBorderRose: string;
  success: string;
  successSurface: string;
  interestIndicator: string;
  warning: string;
  warningSurface: string;
  error: string;
  errorSurface: string;
  favorite: string;
  attending: string;
  splashBackground: string;
  splashText: string;
}>;

export const lightColors: ThemeColors = Object.freeze({
  background: '#f7efec',
  surface: '#fffafa',
  surfaceElevated: '#ffffff',
  surfaceMuted: '#f3e8e6',
  brandPrimary: '#7a1738',
  brandPrimaryPressed: '#5a1029',
  brandSurface: '#7a1738',
  brandSurfacePressed: '#5a1029',
  accent: '#9b274a',
  textPrimary: '#382f32',
  textSecondary: '#716468',
  textMuted: '#88777c',
  textInverse: '#ffffff',
  textOnPrimary: '#ffffff',
  border: '#e2d5d3',
  borderStrong: '#d9c0c6',
  inputBackground: '#fffafa',
  overlay: 'rgba(56, 47, 50, 0.48)',
  cardBorderCream: '#decac8',
  cardBorderRose: '#dfc1c8',
  success: '#2f6b4f',
  successSurface: '#e0ede6',
  interestIndicator: '#674000',
  warning: '#7a5417',
  warningSurface: '#f5e7c8',
  error: '#a12745',
  errorSurface: '#f7dfe5',
  favorite: '#8f1f48',
  attending: '#2f6b4f',
  splashBackground: '#7a1738',
  splashText: '#ffffff',
});

export const darkColors: ThemeColors = Object.freeze({
  background: '#1c1518',
  surface: '#291f23',
  surfaceElevated: '#35262c',
  surfaceMuted: '#241a1e',
  brandPrimary: '#f09ab5',
  brandPrimaryPressed: '#df7f9e',
  brandSurface: '#641f3a',
  brandSurfacePressed: '#83304f',
  accent: '#f1adc2',
  textPrimary: '#fff4f0',
  textSecondary: '#d5c1c6',
  textMuted: '#b7a0a7',
  textInverse: '#fffaf8',
  textOnPrimary: '#382f32',
  border: '#513d45',
  borderStrong: '#755560',
  inputBackground: '#302329',
  overlay: 'rgba(10, 6, 8, 0.68)',
  cardBorderCream: '#6f4c50',
  cardBorderRose: '#743f50',
  success: '#8ed6ad',
  successSurface: '#173c2a',
  interestIndicator: '#f6c978',
  warning: '#f3c87c',
  warningSurface: '#453519',
  error: '#ff9eb0',
  errorSurface: '#4f202c',
  favorite: '#f08baa',
  attending: '#8ed6ad',
  splashBackground: '#401225',
  splashText: '#fff7f5',
});

export const themeColors = Object.freeze({ light: lightColors, dark: darkColors });

/** Alias claro para lógica no React heredada; la UI debe consumir useAppTheme(). */
export const colors = lightColors;
