import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/theme';

type AppShellProps = PropsWithChildren<{
  testID?: string;
}>;

export function AppShell({ children, testID }: AppShellProps) {
  const { colors } = useAppTheme();
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      testID={testID}
    >
      <View style={[styles.content, { backgroundColor: colors.background }]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
