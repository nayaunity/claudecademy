// Minimalist light theme colors
export const THEME = {
  // Backgrounds
  background: '#FFFFFF',
  surface: '#F5F7FA',
  surfaceLight: '#EBEEF2',

  // Health colors
  primary: '#3B82F6', // Blue
  warning: '#F59E0B', // Amber
  danger: '#EF4444', // Red

  // Text
  text: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',

  // Accents
  accent: '#3B82F6',
  success: '#10B981', // Green
  error: '#EF4444',

  // Tank colors
  tankGlass: 'rgba(59, 130, 246, 0.05)',
  tankBorder: 'rgba(59, 130, 246, 0.2)',
  bubbleColor: 'rgba(59, 130, 246, 0.3)',
  waterLight: 'rgba(59, 130, 246, 0.08)',
  waterDark: 'rgba(59, 130, 246, 0.15)',

  // Shadows
  shadow: 'rgba(0, 0, 0, 0.1)',
} as const;

// Health bar color based on percentage
export function getHealthColor(health: number): string {
  if (health >= 70) return THEME.success;
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
