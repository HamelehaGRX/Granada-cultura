import type { PropsWithChildren } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

import { breakpoints, spacing } from '@/theme';

type ScreenContainerProps = PropsWithChildren<{
  centered?: boolean;
  maxWidth?: number;
  scrollable?: boolean;
  testID?: string;
}>;

export function ScreenContainer({
  centered = false,
  children,
  maxWidth = breakpoints.desktop,
  scrollable = false,
  testID,
}: ScreenContainerProps) {
  const { width } = useWindowDimensions();
  const horizontalPadding =
    width >= breakpoints.desktop
      ? spacing.xxl
      : width >= breakpoints.tablet
        ? spacing.xl
        : spacing.lg;

  const responsiveStyle = {
    maxWidth,
    paddingHorizontal: horizontalPadding,
  };

  if (scrollable) {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.container,
          styles.scrollContent,
          responsiveStyle,
          centered && styles.centered,
        ]}
        keyboardShouldPersistTaps="handled"
        style={styles.fill}
        testID={testID}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={styles.fill} testID={testID}>
      <View
        style={[
          styles.container,
          styles.staticContent,
          responsiveStyle,
          centered && styles.centered,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  container: {
    alignSelf: 'center',
    width: '100%',
    paddingVertical: spacing.lg,
  },
  staticContent: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  centered: {
    justifyContent: 'center',
  },
});
