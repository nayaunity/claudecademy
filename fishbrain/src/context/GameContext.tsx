import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { GameState, GameAction, GameContextValue, FishType } from '../types';
import {
  saveGameState,
  loadGameState,
  DEFAULT_GAME_STATE,
} from '../services/storage';
import { HEALTH } from '../constants/game';
import { getCurrentHealth, applyCorrectAnswerBonus } from '../utils/health';

// Initial context value
const initialContextValue: GameContextValue = {
  state: DEFAULT_GAME_STATE,
  dispatch: () => {},
  isLoading: true,
};

// Create context
export const GameContext = createContext<GameContextValue>(initialContextValue);

// Reducer function
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_FISH_TYPE': {
      return {
        ...state,
        fishType: action.payload,
        hasCompletedOnboarding: true,
        lastFeedTime: Date.now(),
      };
    }

    case 'UPDATE_HEALTH': {
      return {
        ...state,
        health: Math.max(0, Math.min(HEALTH.MAX, action.payload)),
      };
    }

    case 'FEED_FISH': {
      const { questionId, correct } = action.payload;
      const now = Date.now();

      if (correct) {
        const newHealth = applyCorrectAnswerBonus(state.health);
        return {
          ...state,
          health: newHealth,
          lastFeedTime: now,
          streak: state.streak + 1,
          totalCorrect: state.totalCorrect + 1,
          totalAnswered: state.totalAnswered + 1,
          answeredQuestionIds: [...state.answeredQuestionIds, questionId],
        };
      } else {
        return {
          ...state,
          streak: 0,
          totalAnswered: state.totalAnswered + 1,
          answeredQuestionIds: [...state.answeredQuestionIds, questionId],
        };
      }
    }

    case 'RESET_STREAK': {
      return {
        ...state,
        streak: 0,
      };
    }

    case 'REVIVE_FISH': {
      return {
        ...state,
        health: HEALTH.REVIVAL,
        lastFeedTime: Date.now(),
        streak: 0,
      };
    }

    case 'LOAD_STATE': {
      return action.payload;
    }

    case 'RESET_GAME': {
      return {
        ...DEFAULT_GAME_STATE,
        lastFeedTime: Date.now(),
      };
    }

    default:
      return state;
  }
}

// Provider component
interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, DEFAULT_GAME_STATE);
  const [isLoading, setIsLoading] = React.useState(true);

  // Load saved state on mount
  useEffect(() => {
    async function initializeState() {
      try {
        const savedState = await loadGameState();
        if (savedState) {
          // Calculate current health based on decay
          const currentHealth = getCurrentHealth(
            savedState.health,
            savedState.lastFeedTime
          );
          dispatch({
            type: 'LOAD_STATE',
            payload: { ...savedState, health: currentHealth },
          });
        }
      } catch (error) {
        console.error('Failed to load game state:', error);
      } finally {
        setIsLoading(false);
      }
    }

    initializeState();
  }, []);

  // Save state whenever it changes (after initial load)
  useEffect(() => {
    if (!isLoading) {
      saveGameState(state).catch((error) => {
        console.error('Failed to save game state:', error);
      });
    }
  }, [state, isLoading]);

  const value: GameContextValue = {
    state,
    dispatch,
    isLoading,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
