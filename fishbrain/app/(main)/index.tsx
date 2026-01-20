import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
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
import { THEME, SPACING, FONT_SIZE, RADIUS } from '../../src/constants/theme';

export default function HomeScreen() {
  const { state } = useGameState();
  const { healthState, isDead } = useGameDerived();
  const { feedFish } = useGameActions();
  const { currentQuestion, selectNewQuestion, checkAnswer } = useQuestions();

  // Animation states
  const [isDropping, setIsDropping] = useState(false);
  const [isEating, setIsEating] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Initialize health decay tracking
  useHealthDecay();

  const fishConfig = state.fishType ? FISH_CONFIG[state.fishType] : null;

  // Load initial question
  useEffect(() => {
    if (!currentQuestion) {
      selectNewQuestion();
    }
  }, []);

  // Redirect to revival if dead
  useEffect(() => {
    if (isDead) {
      router.replace('/revival');
    }
  }, [isDead]);

  const handleOptionSelect = (optionId: string) => {
    if (hasAnswered) return;
    setSelectedOption(optionId);
  };

  const handleSubmit = async () => {
    if (!selectedOption || !currentQuestion) return;

    const correct = checkAnswer(selectedOption);
    setIsCorrect(correct);
    setHasAnswered(true);

    if (correct) {
      // Trigger food drop animation
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsDropping(true);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleFoodEaten = () => {
    // Food animation complete, trigger eating animation
    setIsDropping(false);
    setIsEating(true);

    // Update game state after eating animation
    if (currentQuestion) {
      feedFish(currentQuestion.id, true);
    }

    // Reset eating state after animation
    setTimeout(() => {
      setIsEating(false);
    }, 1500);
  };

  const handleNextQuestion = () => {
    // Reset states and load next question
    setSelectedOption(null);
    setHasAnswered(false);
    setIsCorrect(false);

    // If wrong answer, update game state now
    if (!isCorrect && currentQuestion) {
      feedFish(currentQuestion.id, false);
    }

    selectNewQuestion();
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

      {/* Question Section - Top Half */}
      <View style={styles.questionSection}>
        <View style={styles.questionHeader}>
          <Text style={styles.category}>{currentQuestion.category}</Text>
          <Text style={styles.difficulty}>{currentQuestion.difficulty}</Text>
        </View>

        <QuestionCard question={currentQuestion.question} />

        <ScrollView
          style={styles.optionsScroll}
          contentContainerStyle={styles.optionsContainer}
          showsVerticalScrollIndicator={false}
        >
          {currentQuestion.options.map((option) => (
            <AnswerOption
              key={option.id}
              option={option}
              isSelected={selectedOption === option.id}
              isCorrect={hasAnswered && option.id === currentQuestion.correctOptionId}
              isWrong={
                hasAnswered &&
                selectedOption === option.id &&
                option.id !== currentQuestion.correctOptionId
              }
              disabled={hasAnswered}
              onPress={() => handleOptionSelect(option.id)}
            />
          ))}
        </ScrollView>

        {/* Submit / Next Button */}
        <View style={styles.buttonContainer}>
          {!hasAnswered ? (
            <Button
              title="Submit Answer"
              onPress={handleSubmit}
              disabled={!selectedOption}
              variant={healthState === 'critical' ? 'danger' : 'primary'}
            />
          ) : (
            <Button
              title={isCorrect ? 'Next Question' : 'Try Another'}
              onPress={handleNextQuestion}
              variant={isCorrect ? 'success' : 'primary'}
              disabled={isDropping || isEating}
            />
          )}
        </View>
      </View>

      {/* Fish Tank Section - Bottom Half */}
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

      {/* Feedback overlay - only show for correct answers */}
      {hasAnswered && isCorrect && !isDropping && !isEating && (
        <View style={styles.feedbackOverlay} pointerEvents="none">
          <Text style={[styles.feedbackText, styles.correctText]}>
            Correct! Feeding time!
          </Text>
        </View>
      )}
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
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  fishName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: THEME.text,
  },
  statsText: {
    fontSize: FONT_SIZE.xs,
    color: THEME.textSecondary,
  },
  questionSection: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
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
  optionsScroll: {
    flex: 1,
    marginTop: SPACING.sm,
  },
  optionsContainer: {
    gap: SPACING.xs,
    paddingBottom: SPACING.sm,
  },
  buttonContainer: {
    paddingVertical: SPACING.sm,
  },
  tankSection: {
    height: 220,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  tankWrapper: {
    flex: 1,
    marginTop: SPACING.xs,
  },
  feedbackOverlay: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  correctText: {
    color: THEME.success,
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
  },
  wrongText: {
    color: THEME.warning,
    backgroundColor: 'rgba(255, 217, 61, 0.2)',
  },
});
