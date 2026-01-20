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
          <Text style={styles.deadIndicator}>x_x</Text>
        </View>

        <Text style={styles.title}>Oh no!</Text>
        <Text style={styles.subtitle}>
          {fishConfig?.name || 'Your fish'} has passed away...
        </Text>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Final Stats</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Questions Answered:</Text>
            <Text style={styles.statsValue}>{state.totalAnswered}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Correct Answers:</Text>
            <Text style={styles.statsValue}>{state.totalCorrect}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Best Streak:</Text>
            <Text style={styles.statsValue}>{state.streak}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Revive Fish (50% Health)"
            onPress={handleRevive}
            variant="primary"
          />
          <Button
            title="Choose New Fish"
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
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  deadFishEmoji: {
    fontSize: 100,
    opacity: 0.5,
    transform: [{ rotate: '180deg' }],
  },
  deadIndicator: {
    position: 'absolute',
    bottom: 10,
    right: -10,
    fontSize: FONT_SIZE.xl,
    color: THEME.danger,
  },
  title: {
    fontSize: FONT_SIZE.title,
    fontWeight: 'bold',
    color: THEME.danger,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.lg,
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
  },
  statsTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: THEME.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  statsLabel: {
    fontSize: FONT_SIZE.md,
    color: THEME.textSecondary,
  },
  statsValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: THEME.text,
  },
  buttonContainer: {
    width: '100%',
    gap: SPACING.md,
  },
});
