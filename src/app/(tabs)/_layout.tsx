import { Tabs } from 'expo-router';
import { StyleSheet, Text, type ColorValue } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

type TabIconProps = {
  color: ColorValue;
  glyph: string;
};

function TabIcon({ color, glyph }: TabIconProps) {
  return <Text style={[styles.icon, { color }]}>{glyph}</Text>;
}

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brandPrimary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarActiveBackgroundColor: colors.surfaceElevated,
        sceneStyle: styles.scene,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: styles.label,
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

const styles = StyleSheet.create({
  scene: {
    backgroundColor: colors.background,
  },
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
  },
  tabBarItem: {
    borderRadius: radii.medium,
    marginVertical: spacing.xs,
  },
  label: {
    ...typography.caption,
  },
  icon: {
    ...typography.heading,
  },
});
