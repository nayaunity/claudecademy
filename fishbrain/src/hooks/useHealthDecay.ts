import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useGameState, useGameActions } from './useGameState';
import { getCurrentHealth } from '../utils/health';
import { DECAY } from '../constants/game';

// Hook to manage health decay based on time
export function useHealthDecay() {
  const { state, isLoading } = useGameState();
  const { updateHealth } = useGameActions();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // Calculate and update health based on time elapsed
  const recalculateHealth = () => {
    if (state.health > 0) {
      const currentHealth = getCurrentHealth(state.health, state.lastFeedTime);
      if (currentHealth !== state.health) {
        updateHealth(currentHealth);
      }
    }
  };

  // Set up periodic check while app is in foreground
  useEffect(() => {
    if (isLoading || !state.hasCompletedOnboarding) return;

    // Initial health calculation
    recalculateHealth();

    // Set up interval for periodic checks
    intervalRef.current = setInterval(() => {
      recalculateHealth();
    }, DECAY.CHECK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLoading, state.hasCompletedOnboarding, state.lastFeedTime]);

  // Handle app state changes (foreground/background)
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        // App coming to foreground
        if (
          appStateRef.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          recalculateHealth();
        }
        appStateRef.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, [state.health, state.lastFeedTime]);

  return {
    currentHealth: state.health,
    lastFeedTime: state.lastFeedTime,
  };
}
