// Aquarium theme colors
export const THEME = {
  // Backgrounds
  background: '#0a1628', // Deep ocean
  surface: '#1a3a5c', // Card backgrounds
  surfaceLight: '#2a4a6c', // Lighter surface for hover states

  // Health colors
  primary: '#4ecdc4', // Teal (healthy/thriving)
  warning: '#ffd93d', // Yellow (hungry)
  danger: '#ff6b6b', // Coral (critical)

  // Text
  text: '#ffffff',
  textSecondary: '#a0c4d8',
  textMuted: '#6a8a9d',

  // Accents
  accent: '#5dade2', // Light blue accent
  success: '#2ecc71', // Green for correct answers
  error: '#e74c3c', // Red for wrong answers (softer than danger)

  // Tank colors
  tankGlass: 'rgba(255, 255, 255, 0.1)',
  tankBorder: 'rgba(255, 255, 255, 0.2)',
  bubbleColor: 'rgba(255, 255, 255, 0.4)',

  // Shadows
  shadow: '#000000',
} as const;

// Health bar color based on percentage
export function getHealthColor(health: number): string {
  if (health >= 70) return THEME.primary;
  if (health >= 30) return THEME.warning;
  return THEME.danger;
}

// Spacing values
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Border radius values
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
} as const;

// Font sizes
export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  title: 40,
} as const;
