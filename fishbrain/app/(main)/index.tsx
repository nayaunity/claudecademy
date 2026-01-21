import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useGameState, useGameDerived, useGameActions } from '../../src/hooks/useGameState';
import { useHealthDecay } from '../../src/hooks/useHealthDecay';
import { useQuestions } from '../../src/hooks/useQuestions';
import { Fish } from '../../src/components/fish/Fish';
import { FishTank } from '../../src/components/fish/FishTank';
import { FoodDrop } from '../../src/components/fish/FoodDrop';
import { HealthBar } from '../../src/components/ui/HealthBar';
import { StreakBadge } from '../../src/components/ui/StreakBadge';
import { Button } from '../../src/components/ui/Button';
import { QuestionCard } from '../../src/components/question/QuestionCard';
import { AnswerOption } from '../../src/components/question/AnswerOption';
import { FISH_CONFIG } from '../../src/constants/fish';
import { THEME, SPACING, FONT_SIZE } from '../../src/constants/theme';

// Format category from snake_case to Title Case
const formatCategory = (category: string): string => {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function HomeScreen() {
  const { state } = useGameState();
  const { healthState, isDead } = useGameDerived();
  const { feedFish } = useGameActions();
  const { currentQuestion, selectNewQuestion, checkAnswer } = useQuestions();

  const [isDropping, setIsDropping] = useState(false);
  const [isEating, setIsEating] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useHealthDecay();

  const fishConfig = state.fishType ? FISH_CONFIG[state.fishType] : null;

  useEffect(() => {
    if (!currentQuestion) {
      selectNewQuestion();
    }
  }, []);

  useEffect(() => {
    if (isDead) {
      router.replace('/revival');
    }
  }, [isDead]);

  const handleOptionSelect = (optionIndex: number) => {
    if (hasAnswered) return;
    setSelectedOption(optionIndex);
  };

  const handleSubmit = async () => {
    if (selectedOption === null || !currentQuestion) return;

    const correct = checkAnswer(selectedOption);
    setIsCorrect(correct);
    setHasAnswered(true);

    if (correct) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsDropping(true);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleFoodEaten = () => {
    setIsDropping(false);
    setIsEating(true);

    if (currentQuestion) {
      feedFish(currentQuestion.id, true);
    }

    // Auto-advance to next question after eating animation
    setTimeout(() => {
      setIsEating(false);
      setSelectedOption(null);
      setHasAnswered(false);
      setIsCorrect(false);
      selectNewQuestion();
    }, 1500);
  };

  const handleNextQuestion = () => {
    // Only used for wrong answers now
    if (!isCorrect && currentQuestion) {
      feedFish(currentQuestion.id, false);
    }

    setSelectedOption(null);
    setHasAnswered(false);
    setIsCorrect(false);
    selectNewQuestion();
  };

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.fishName}>{fishConfig?.name || 'Your Fish'}</Text>
          <Text style={styles.statsText}>
            {state.totalCorrect}/{state.totalAnswered} correct
          </Text>
        </View>
        <StreakBadge streak={state.streak} />
      </View>

      {/* Question Section */}
      <View style={styles.questionSection}>
        <Text style={styles.category}>{formatCategory(currentQuestion.category)}</Text>
        <QuestionCard question={currentQuestion.question} />

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <AnswerOption
              key={index}
              text={option}
              isSelected={selectedOption === index}
              isCorrect={hasAnswered && index === currentQuestion.correctAnswer}
              isWrong={
                hasAnswered &&
                selectedOption === index &&
                index !== currentQuestion.correctAnswer
              }
              disabled={hasAnswered}
              onPress={() => handleOptionSelect(index)}
            />
          ))}
        </View>

        {/* Explanation - shown after answering */}
        {hasAnswered && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
          </View>
        )}

        {/* Button - hide during correct answer animation */}
        {!hasAnswered ? (
          <Button
            title="Submit"
            onPress={handleSubmit}
            disabled={selectedOption === null}
          />
        ) : !isCorrect ? (
          <Button
            title="Try Again"
            onPress={handleNextQuestion}
          />
        ) : null}
      </View>

      {/* Fish Tank - Takes remaining space */}
      <View style={styles.tankSection}>
        <HealthBar health={state.health} />
        <View style={styles.tankWrapper}>
          <FishTank>
            <Fish
              fishType={state.fishType || 'goldfish'}
              healthState={healthState}
              isEating={isEating}
            />
            <FoodDrop isDropping={isDropping} onEaten={handleFoodEaten} />
          </FishTank>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  fishName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: THEME.text,
  },
  statsText: {
    fontSize: FONT_SIZE.xs,
    color: THEME.textSecondary,
  },
  questionSection: {
    paddingHorizontal: SPACING.lg,
  },
  category: {
    fontSize: FONT_SIZE.sm,
    color: THEME.primary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  optionsContainer: {
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  explanationContainer: {
    backgroundColor: THEME.surface,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  explanationText: {
    fontSize: FONT_SIZE.sm,
    color: THEME.textSecondary,
    lineHeight: 20,
  },
  tankSection: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    marginTop: SPACING.md,
  },
  tankWrapper: {
    flex: 1,
    marginTop: SPACING.sm,
  },
});
