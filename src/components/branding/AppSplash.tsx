import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Platform, StyleSheet, Text } from 'react-native';

import { BRAND } from '@/config/brand';
import { colors, typography } from '@/theme';

const timings = {
  normal: { nameDelay: 250, nameDuration: 550, hold: 800, exit: 400 },
  reduced: { hold: 80, exit: 120 },
} as const;

const useNativeDriver = Platform.OS !== 'web';

/** Secuencia visual de marca; no sustituye el splash técnico nativo de Expo. */
export function AppSplash() {
  const [visible, setVisible] = useState(true);
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const splashOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let active = true;
    let stopAnimation: (() => void) | undefined;

    const start = (reduceMotion: boolean) => {
      if (!active) return;
      stopAnimation?.();
      nameOpacity.setValue(reduceMotion ? 1 : 0);
      splashOpacity.setValue(1);

      const animation = reduceMotion
        ? Animated.sequence([
            Animated.delay(timings.reduced.hold),
            Animated.timing(splashOpacity, {
              toValue: 0,
              duration: timings.reduced.exit,
              useNativeDriver,
            }),
          ])
        : Animated.sequence([
            Animated.delay(timings.normal.nameDelay),
            Animated.timing(nameOpacity, {
              toValue: 1,
              duration: timings.normal.nameDuration,
              useNativeDriver,
            }),
            Animated.delay(timings.normal.hold),
            Animated.timing(splashOpacity, {
              toValue: 0,
              duration: timings.normal.exit,
              useNativeDriver,
            }),
          ]);

      stopAnimation = () => animation.stop();
      animation.start(({ finished }) => {
        if (active && finished) setVisible(false);
      });
    };

    AccessibilityInfo.isReduceMotionEnabled().then(start, () => start(false));
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', start);

    return () => {
      active = false;
      stopAnimation?.();
      subscription.remove();
    };
  }, [nameOpacity, splashOpacity]);

  if (!visible) return null;

  return (
    <Animated.View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.splash, { opacity: splashOpacity }]}
      testID="app-splash"
    >
      <Animated.View style={{ opacity: nameOpacity }}>
        <Text style={styles.name}>{BRAND.name}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  splash: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
    elevation: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    pointerEvents: 'auto',
  },
  name: {
    ...typography.display,
    color: colors.textInverse,
    letterSpacing: 6,
    paddingLeft: 6,
  },
});
