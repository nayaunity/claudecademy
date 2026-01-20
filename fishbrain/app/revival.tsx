import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useGameState, useGameActions } from '../src/hooks/useGameState';
import { Button } from '../src/components/ui/Button';
import { FISH_CONFIG } from '../src/constants/fish';
import { THEME, SPACING, FONT_SIZE, RADIUS } from '../src/constants/theme';

export default function RevivalScreen() {
  const { state } = useGameState();
  const { reviveFish, resetGame } = useGameActions();

  const fishConfig = state.fishType ? FISH_CONFIG[state.fishType] : null;

  const handleRevive = () => {
    reviveFish();
    router.replace('/(main)');
  };

  const handleNewFish = () => {
    resetGame();
    router.replace('/onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.fishContainer}>
          <Text style={styles.deadFishEmoji}>
            {fishConfig?.emoji || '🐠'}
          </Text>
        </View>

        <Text style={styles.title}>Oh no!</Text>
        <Text style={styles.subtitle}>
          {fishConfig?.name || 'Your fish'} didn't make it...
        </Text>

        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Questions</Text>
            <Text style={styles.statsValue}>{state.totalAnswered}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Correct</Text>
            <Text style={styles.statsValue}>{state.totalCorrect}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Try Again"
            onPress={handleRevive}
            variant="primary"
          />
          <Button
            title="New Fish"
            onPress={handleNewFish}
            variant="secondary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fishContainer: {
    marginBottom: SPACING.lg,
  },
  deadFishEmoji: {
    fontSize: 80,
    opacity: 0.4,
    transform: [{ rotate: '180deg' }],
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: THEME.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: THEME.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  statsCard: {
    backgroundColor: THEME.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    width: '100%',
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsLabel: {
    fontSize: FONT_SIZE.md,
    color: THEME.textSecondary,
  },
  statsValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: THEME.text,
  },
  buttonContainer: {
    width: '100%',
    gap: SPACING.sm,
  },
});
