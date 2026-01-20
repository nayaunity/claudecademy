import { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { GameContextValue, FishType } from '../types';
import { getHealthStateFromValue, isFishDead } from '../utils/health';
import { getHealthState } from '../constants/fish';

// Hook to access game state and dispatch
export function useGameState(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
}

// Hook for derived game values
export function useGameDerived() {
  const { state } = useGameState();

  const healthState = getHealthStateFromValue(state.health);
  const isDead = isFishDead(state.health);
  const needsOnboarding = !state.hasCompletedOnboarding || !state.fishType;

  return {
    healthState,
    isDead,
    needsOnboarding,
    accuracy:
      state.totalAnswered > 0
        ? Math.round((state.totalCorrect / state.totalAnswered) * 100)
        : 0,
  };
}

// Hook for game actions
export function useGameActions() {
  const { dispatch } = useGameState();

  const selectFish = (fishType: FishType) => {
    dispatch({ type: 'SET_FISH_TYPE', payload: fishType });
  };

  const feedFish = (questionId: string, correct: boolean) => {
    dispatch({ type: 'FEED_FISH', payload: { questionId, correct } });
  };

  const updateHealth = (health: number) => {
    dispatch({ type: 'UPDATE_HEALTH', payload: health });
  };

  const reviveFish = () => {
    dispatch({ type: 'REVIVE_FISH' });
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  return {
    selectFish,
    feedFish,
    updateHealth,
    reviveFish,
    resetGame,
  };
}
