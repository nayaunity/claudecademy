import { FishType, HealthState } from '../types';

// Fish configurations
export const FISH_CONFIG: Record<FishType, { name: string; color: string; emoji: string }> = {
  goldfish: {
    name: 'Goldie',
    color: '#FFD700',
    emoji: '🐠',
  },
  betta: {
    name: 'Beta',
    color: '#9B59B6',
    emoji: '🐟',
  },
  clownfish: {
    name: 'Nemo',
    color: '#FF6B35',
    emoji: '🐡',
  },
};

// Health thresholds
export const HEALTH_THRESHOLDS = {
  THRIVING: 70,
  HUNGRY: 30,
  CRITICAL: 0,
} as const;

// Get health state based on current health
export function getHealthState(health: number): HealthState {
  if (health <= 0) return 'dead';
  if (health < HEALTH_THRESHOLDS.HUNGRY) return 'critical';
  if (health < HEALTH_THRESHOLDS.THRIVING) return 'hungry';
  return 'thriving';
}

// Fish selection options for onboarding
export const FISH_OPTIONS: FishType[] = ['goldfish', 'betta', 'clownfish'];
