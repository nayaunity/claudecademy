import { View, Text, StyleSheet } from 'react-native';
import { THEME, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak === 0) {
    return null;
  }

  // Determine badge color based on streak length
  const getBadgeColor = () => {
    if (streak >= 10) return THEME.success;
    if (streak >= 5) return THEME.primary;
    return THEME.warning;
  };

  return (
    <View style={[styles.container, { backgroundColor: getBadgeColor() }]}>
      <Text style={styles.flame}>🔥</Text>
      <Text style={styles.count}>{streak}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
