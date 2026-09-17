import { Tabs } from 'expo-router';
import {
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  type ColorValue,
} from 'react-native';

import { breakpoints, radii, sizes, spacing, typography, useAppTheme, useThemeStyles, type ThemeColors } from '@/theme';

type TabIconProps = {
  color: ColorValue;
  glyph: string;
};

function TabIcon({ color, glyph }: TabIconProps) {
  const styles = useThemeStyles(createStyles);
  return <Text style={[styles.icon, { color }]}>{glyph}</Text>;
}

function TabLabel({ children, color, focused }: {
  children: string;
  color: ColorValue;
  focused: boolean;
}) {
  const styles = useThemeStyles(createStyles);
  return (
    <Text style={[styles.label, { color }, focused && styles.activeLabel]}>
      {children}
    </Text>
  );
}

export default function TabLayout() {
  const { colors } = useAppTheme();
  const styles = useThemeStyles(createStyles);
  const { width } = useWindowDimensions();
  const desktop = Platform.OS === 'web' && width >= breakpoints.desktop;

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brandPrimary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarActiveBackgroundColor: colors.surfaceElevated,
        sceneStyle: styles.scene,
        tabBarPosition: desktop ? 'left' : 'bottom',
        tabBarVariant: desktop ? 'material' : 'uikit',
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: desktop ? styles.sidebar : styles.tabBar,
        tabBarItemStyle: desktop ? styles.sidebarItem : styles.tabBarItem,
        tabBarLabel: ({ children, color, focused }) => (
          <TabLabel color={color} focused={focused}>{children}</TabLabel>
        ),
      }}
    >
      <Tabs.Screen
        name="explorar"
        options={{
          title: 'Explorar',
          tabBarAccessibilityLabel: 'Explorar',
          tabBarIcon: ({ color }) => <TabIcon color={color} glyph="⌕" />,
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: 'Agenda',
          tabBarAccessibilityLabel: 'Agenda',
          tabBarIcon: ({ color }) => <TabIcon color={color} glyph="▣" />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarAccessibilityLabel: 'Inicio',
          tabBarIcon: ({ color }) => <TabIcon color={color} glyph="⌂" />,
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: 'Favoritos',
          tabBarAccessibilityLabel: 'Favoritos',
          tabBarIcon: ({ color }) => <TabIcon color={color} glyph="♡" />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarAccessibilityLabel: 'Perfil',
          tabBarIcon: ({ color }) => <TabIcon color={color} glyph="○" />,
        }}
      />
    </Tabs>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  scene: {
    backgroundColor: colors.background,
  },
  tabBar: {
    minHeight: sizes.tabBarMinHeight,
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
  },
  tabBarItem: {
    borderRadius: radii.medium,
    marginVertical: spacing.xs,
  },
  sidebar: {
    width: 160,
    minHeight: '100%',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 0,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.border,
  },
  sidebarItem: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 64,
    width: '100%',
    height: 64,
    minHeight: sizes.touchTarget,
    maxHeight: 64,
    borderRadius: radii.medium,
    marginVertical: spacing.xs,
  },
  label: {
    ...typography.caption,
  },
  activeLabel: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  icon: {
    ...typography.heading,
  },
});
