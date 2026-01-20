// Game mechanics constants

// Health values
export const HEALTH = {
  MAX: 100,
  INITIAL: 100,
  REVIVAL: 50,
  CORRECT_ANSWER_BONUS: 10,
} as const;

// Health decay settings
export const DECAY = {
  RATE: 5, // Percentage decay per period
  PERIOD_MS: 4 * 60 * 60 * 1000, // 4 hours in milliseconds
  CHECK_INTERVAL_MS: 60 * 1000, // Check every 60 seconds when foregrounded
} as const;

// Calculate health decay based on elapsed time
export function calculateHealthDecay(
  lastHealth: number,
  lastFeedTime: number,
  currentTime: number = Date.now()
): number {
  const elapsedMs = currentTime - lastFeedTime;
  const decayPeriods = Math.floor(elapsedMs / DECAY.PERIOD_MS);
  const totalDecay = decayPeriods * DECAY.RATE;
  return Math.max(0, lastHealth - totalDecay);
}

// Calculate health gain from correct answer
export function calculateHealthGain(currentHealth: number): number {
  return Math.min(HEALTH.MAX, currentHealth + HEALTH.CORRECT_ANSWER_BONUS);
}
