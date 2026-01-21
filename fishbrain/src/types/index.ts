// Fish types
export type FishType = 'goldfish' | 'betta' | 'clownfish';

// Health states
export type HealthState = 'thriving' | 'hungry' | 'critical' | 'dead';

// Question difficulty
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// Question
export interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: Difficulty;
  explanation: string;
}

// Game state
export interface GameState {
  fishType: FishType | null;
  health: number; // 0-100
  lastFeedTime: number; // Unix timestamp
  streak: number;
  totalCorrect: number;
  totalAnswered: number;
  answeredQuestionIds: string[];
  hasCompletedOnboarding: boolean;
}

// Game action types
export type GameAction =
  | { type: 'SET_FISH_TYPE'; payload: FishType }
  | { type: 'UPDATE_HEALTH'; payload: number }
  | { type: 'FEED_FISH'; payload: { questionId: string; correct: boolean } }
  | { type: 'RESET_STREAK' }
  | { type: 'REVIVE_FISH' }
  | { type: 'LOAD_STATE'; payload: GameState }
  | { type: 'RESET_GAME' };

// Game context value
export interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  isLoading: boolean;
}
