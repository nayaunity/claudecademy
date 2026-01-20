import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { THEME, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return THEME.surface;
    switch (variant) {
      case 'primary':
        return THEME.primary;
      case 'secondary':
        return THEME.surface;
      case 'danger':
        return THEME.danger;
      case 'success':
        return THEME.success;
      default:
        return THEME.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return THEME.textMuted;
    switch (variant) {
      case 'secondary':
        return THEME.text;
      default:
        return '#ffffff';
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        variant === 'secondary' && styles.secondaryButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: THEME.primary,
  },
  text: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
  },
});
