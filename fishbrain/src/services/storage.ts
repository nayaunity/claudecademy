import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState } from '../types';
import { HEALTH } from '../constants/game';

const STORAGE_KEY = '@fishbrain_game_state';

// Default initial state
export const DEFAULT_GAME_STATE: GameState = {
  fishType: null,
  health: HEALTH.INITIAL,
  lastFeedTime: Date.now(),
  streak: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  answeredQuestionIds: [],
  hasCompletedOnboarding: false,
};

// Save game state to storage
export async function saveGameState(state: GameState): Promise<void> {
  try {
    const jsonValue = JSON.stringify(state);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving game state:', error);
    throw error;
  }
}

// Load game state from storage
export async function loadGameState(): Promise<GameState | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue === null) {
      return null;
    }
    return JSON.parse(jsonValue) as GameState;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
}

// Clear all game data
export async function clearGameState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing game state:', error);
    throw error;
  }
}
