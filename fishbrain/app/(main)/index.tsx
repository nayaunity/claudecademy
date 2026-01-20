import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useGameState, useGameDerived } from '../../src/hooks/useGameState';
import { useHealthDecay } from '../../src/hooks/useHealthDecay';
import { Fish } from '../../src/components/fish/Fish';
import { FishTank } from '../../src/components/fish/FishTank';
import { HealthBar } from '../../src/components/ui/HealthBar';
import { StreakBadge } from '../../src/components/ui/StreakBadge';
import { Button } from '../../src/components/ui/Button';
import { FISH_CONFIG } from '../../src/constants/fish';
import { THEME, SPACING, FONT_SIZE } from '../../src/constants/theme';

export default function HomeScreen() {
  const { state } = useGameState();
  const { healthState } = useGameDerived();

  // Initialize health decay tracking
  useHealthDecay();

  const fishConfig = state.fishType ? FISH_CONFIG[state.fishType] : null;

  const handleFeedPress = () => {
    router.push('/(main)/question');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.fishName}>
          {fishConfig?.name || 'Your Fish'}
        </Text>
        <StreakBadge streak={state.streak} />
      </View>

      <View style={styles.tankContainer}>
        <FishTank>
          <Fish
            fishType={state.fishType || 'goldfish'}
            healthState={healthState}
          />
        </FishTank>
      </View>

      <View style={styles.statsContainer}>
        <HealthBar health={state.health} />
        <View style={styles.statsRow}>
          <Text style={styles.statText}>
            Questions: {state.totalAnswered}
          </Text>
          <Text style={styles.statText}>
            Correct: {state.totalCorrect}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Feed Me!"
          onPress={handleFeedPress}
          variant={healthState === 'critical' ? 'danger' : 'primary'}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  fishName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: THEME.text,
  },
  tankContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  statsContainer: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statText: {
    fontSize: FONT_SIZE.sm,
    color: THEME.textSecondary,
  },
  buttonContainer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
});
