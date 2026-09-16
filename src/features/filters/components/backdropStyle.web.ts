import type { ViewStyle } from 'react-native';

/** React Native Web transmite esta mejora progresiva al navegador. */
export const backdropBlurStyle = {
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
} as ViewStyle;
