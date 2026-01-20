import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useGameActions } from '../../src/hooks/useGameState';
import { useQuestions } from '../../src/hooks/useQuestions';
import { QuestionCard } from '../../src/components/question/QuestionCard';
import { AnswerOption } from '../../src/components/question/AnswerOption';
import { Button } from '../../src/components/ui/Button';
import { THEME, SPACING, FONT_SIZE } from '../../src/constants/theme';

export default function QuestionScreen() {
  const { feedFish } = useGameActions();
  const { currentQuestion, selectNewQuestion, checkAnswer } = useQuestions();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Select a question when screen mounts
  useEffect(() => {
    selectNewQuestion();
  }, []);

  const handleOptionSelect = (optionId: string) => {
    if (hasAnswered) return;
    setSelectedOption(optionId);
  };

  const handleSubmit = async () => {
    if (!selectedOption || !currentQuestion) return;

    const correct = checkAnswer(selectedOption);
    setIsCorrect(correct);
    setHasAnswered(true);

    // Haptic feedback
    if (correct) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    // Update game state
    feedFish(currentQuestion.id, correct);
  };

  const handleContinue = () => {
    router.back();
  };

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading question...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.category}>{currentQuestion.category}</Text>
          <Text style={styles.difficulty}>{currentQuestion.difficulty}</Text>
        </View>

        <QuestionCard question={currentQuestion.question} />

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => (
            <AnswerOption
              key={option.id}
              option={option}
              isSelected={selectedOption === option.id}
              isCorrect={
                hasAnswered && option.id === currentQuestion.correctOptionId
              }
              isWrong={
                hasAnswered &&
                selectedOption === option.id &&
                option.id !== currentQuestion.correctOptionId
              }
              disabled={hasAnswered}
              onPress={() => handleOptionSelect(option.id)}
            />
          ))}
        </View>

        {hasAnswered && (
          <View style={styles.feedbackContainer}>
            <Text
              style={[
                styles.feedbackText,
                isCorrect ? styles.correctText : styles.wrongText,
              ]}
            >
              {isCorrect
                ? '+10% Health! Your fish is happy!'
                : 'Not quite right. Try again next time!'}
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {!hasAnswered ? (
          <Button
            title="Submit Answer"
            onPress={handleSubmit}
            disabled={!selectedOption}
          />
        ) : (
          <Button
            title="Continue"
            onPress={handleContinue}
            variant={isCorrect ? 'success' : 'primary'}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONT_SIZE.md,
    color: THEME.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  category: {
    fontSize: FONT_SIZE.sm,
    color: THEME.primary,
    fontWeight: '600',
  },
  difficulty: {
    fontSize: FONT_SIZE.xs,
    color: THEME.textMuted,
    textTransform: 'uppercase',
  },
  optionsContainer: {
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  feedbackContainer: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    borderRadius: 8,
    backgroundColor: THEME.surface,
  },
  feedbackText: {
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
    fontWeight: '600',
  },
  correctText: {
    color: THEME.success,
  },
  wrongText: {
    color: THEME.warning,
  },
  buttonContainer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
});
