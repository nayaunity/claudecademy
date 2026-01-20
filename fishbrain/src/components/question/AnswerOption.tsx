import { Pressable, Text, StyleSheet, View } from 'react-native';
import { QuestionOption } from '../../types';
import { THEME, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';

interface AnswerOptionProps {
  option: QuestionOption;
  isSelected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  disabled: boolean;
  onPress: () => void;
}

export function AnswerOption({
  option,
  isSelected,
  isCorrect,
  isWrong,
  disabled,
  onPress,
}: AnswerOptionProps) {
  const getBackgroundColor = () => {
    if (isCorrect) return THEME.success;
    if (isWrong) return THEME.error;
    if (isSelected) return THEME.primary;
    return THEME.surface;
  };

  const getTextColor = () => {
    if (isCorrect || isWrong || isSelected) return '#FFFFFF';
    return THEME.text;
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          opacity: disabled && !isSelected && !isCorrect ? 0.5 : 1,
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.content}>
        <Text style={[styles.optionText, { color: getTextColor() }]}>
          {option.text}
        </Text>
        {isCorrect && <Text style={styles.indicator}>✓</Text>}
        {isWrong && <Text style={styles.indicator}>✗</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: FONT_SIZE.md,
    flex: 1,
    paddingRight: SPACING.sm,
  },
  indicator: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
