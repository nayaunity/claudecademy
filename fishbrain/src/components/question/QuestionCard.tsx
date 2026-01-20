import { View, Text, StyleSheet } from 'react-native';
import { THEME, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';

interface QuestionCardProps {
  question: string;
}

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: THEME.primary,
  },
  questionText: {
    fontSize: FONT_SIZE.lg,
    color: THEME.text,
    lineHeight: 28,
  },
});
