import { Platform, type ViewStyle } from 'react-native';

import { colors } from './colors';

const softShadow = Platform.select<ViewStyle>({
  android: {
    elevation: 2,
    shadowColor: colors.brandPrimaryPressed,
  },
  ios: {
    shadowColor: colors.brandPrimaryPressed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  web: {
    boxShadow: '0px 8px 24px rgba(83, 55, 64, 0.08)',
  },
  default: {
    shadowColor: colors.brandPrimaryPressed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
});

const raisedShadow = Platform.select<ViewStyle>({
  android: {
    elevation: 4,
    shadowColor: colors.brandPrimaryPressed,
  },
  ios: {
    shadowColor: colors.brandPrimaryPressed,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
  },
  web: {
    boxShadow: '0px 12px 32px rgba(83, 55, 64, 0.1)',
  },
  default: {
    shadowColor: colors.brandPrimaryPressed,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
  },
});

export const shadows = {
  none: {} satisfies ViewStyle,
  soft: softShadow ?? {},
  raised: raisedShadow ?? {},
} as const;
