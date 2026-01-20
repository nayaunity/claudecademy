import { HEALTH, DECAY } from '../constants/game';
import { HealthState } from '../types';
import { HEALTH_THRESHOLDS } from '../constants/fish';

// Calculate current health based on decay since last feed
export function getCurrentHealth(
  lastKnownHealth: number,
  lastFeedTime: number
): number {
  const now = Date.now();
  const elapsedMs = now - lastFeedTime;
  const decayPeriods = Math.floor(elapsedMs / DECAY.PERIOD_MS);
  const totalDecay = decayPeriods * DECAY.RATE;
  return Math.max(0, lastKnownHealth - totalDecay);
}

// Calculate health after answering a question correctly
export function applyCorrectAnswerBonus(currentHealth: number): number {
  return Math.min(HEALTH.MAX, currentHealth + HEALTH.CORRECT_ANSWER_BONUS);
}

// Get revival health
export function getRevivalHealth(): number {
  return HEALTH.REVIVAL;
}

// Check if fish is dead
export function isFishDead(health: number): boolean {
  return health <= 0;
}

// Get health state from health value
export function getHealthStateFromValue(health: number): HealthState {
  if (health <= 0) return 'dead';
  if (health < HEALTH_THRESHOLDS.HUNGRY) return 'critical';
  if (health < HEALTH_THRESHOLDS.THRIVING) return 'hungry';
  return 'thriving';
}

// Get time until next decay period
export function getTimeUntilNextDecay(lastFeedTime: number): number {
  const now = Date.now();
  const elapsedMs = now - lastFeedTime;
  const timeSinceLastPeriod = elapsedMs % DECAY.PERIOD_MS;
  return DECAY.PERIOD_MS - timeSinceLastPeriod;
}

// Format time remaining in human readable format
export function formatTimeRemaining(ms: number): string {
  const hours = Math.floor(ms / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
