import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useGameState, useGameDerived } from '../src/hooks/useGameState';
import { THEME } from '../src/constants/theme';

export default function EntryScreen() {
  const { isLoading } = useGameState();
  const { needsOnboarding, isDead } = useGameDerived();

  // Show loading indicator while state is being loaded
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={THEME.primary} />
      </View>
    );
  }

  // Route based on game state
  if (needsOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  if (isDead) {
    return <Redirect href="/revival" />;
  }

  return <Redirect href="/(main)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.background,
  },
});
