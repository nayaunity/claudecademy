import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { THEME, SPACING, RADIUS, FONT_SIZE, getHealthColor } from '../../constants/theme';

interface HealthBarProps {
  health: number;
}

export function HealthBar({ health }: HealthBarProps) {
  const widthAnim = useRef(new Animated.Value(health)).current;
  const color = getHealthColor(health);

  // Animate width changes
  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: health,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [health, widthAnim]);

  // Interpolate width percentage
  const widthInterpolate = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Health</Text>
        <Text style={[styles.percentage, { color }]}>{Math.round(health)}%</Text>
      </View>
      <View style={styles.barBackground}>
        <Animated.View
          style={[
            styles.barFill,
            {
              width: widthInterpolate,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: THEME.textSecondary,
    fontWeight: '600',
  },
  percentage: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
  },
  barBackground: {
    height: 12,
    backgroundColor: THEME.surface,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: RADIUS.sm,
  },
});
