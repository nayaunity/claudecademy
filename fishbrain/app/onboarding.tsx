import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useGameActions } from '../src/hooks/useGameState';
import { FISH_OPTIONS, FISH_CONFIG } from '../src/constants/fish';
import { FishType } from '../src/types';
import { THEME, SPACING, RADIUS, FONT_SIZE } from '../src/constants/theme';

export default function OnboardingScreen() {
  const { selectFish } = useGameActions();

  const handleFishSelect = (fishType: FishType) => {
    selectFish(fishType);
    router.replace('/(main)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Choose Your Fish</Text>
        <Text style={styles.subtitle}>
          Answer AI/ML questions correctly to keep your fish healthy and happy.
        </Text>

        <View style={styles.fishGrid}>
          {FISH_OPTIONS.map((fishType) => {
            const config = FISH_CONFIG[fishType];
            return (
              <Pressable
                key={fishType}
                style={({ pressed }) => [
                  styles.fishCard,
                  pressed && styles.fishCardPressed,
                ]}
                onPress={() => handleFishSelect(fishType)}
              >
                <Text style={styles.fishEmoji}>{config.emoji}</Text>
                <Text style={styles.fishName}>{config.name}</Text>
              </Pressable>
            );
          })}
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
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: THEME.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: THEME.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    lineHeight: 24,
  },
  fishGrid: {
    gap: SPACING.md,
  },
  fishCard: {
    backgroundColor: THEME.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  fishCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  fishEmoji: {
    fontSize: 48,
  },
  fishName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: THEME.text,
  },
});
