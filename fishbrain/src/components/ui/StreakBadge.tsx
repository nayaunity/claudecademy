import { View, Text, StyleSheet } from 'react-native';
import { THEME, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.flame}>🔥</Text>
      <Text style={styles.count}>{streak}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surface,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.round,
    gap: 4,
  },
  flame: {
    fontSize: FONT_SIZE.sm,
  },
  count: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: THEME.text,
  },
});
