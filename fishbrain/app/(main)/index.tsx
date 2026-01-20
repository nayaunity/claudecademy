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

  const [isDropping, setIsDropping] = useState(false);
  const [isEating, setIsEating] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
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

    setTimeout(() => {
      setIsEating(false);
    }, 1500);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setHasAnswered(false);
    setIsCorrect(false);

    if (!isCorrect && currentQuestion) {
      feedFish(currentQuestion.id, false);
    }

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
        <Text style={styles.category}>{currentQuestion.category}</Text>
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

        <View style={styles.buttonContainer}>
          {!hasAnswered ? (
            <Button
              title="Submit"
              onPress={handleSubmit}
              disabled={!selectedOption}
            />
          ) : (
            <Button
              title="Next"
              onPress={handleNextQuestion}
              variant={isCorrect ? 'success' : 'primary'}
              disabled={isDropping || isEating}
            />
          )}
        </View>
      </View>

      {/* Fish Tank */}
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
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  category: {
    fontSize: FONT_SIZE.sm,
    color: THEME.primary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  optionsScroll: {
    flex: 1,
  },
  optionsContainer: {
    gap: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  buttonContainer: {
    paddingVertical: SPACING.sm,
  },
  tankSection: {
    height: 200,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  tankWrapper: {
    flex: 1,
    marginTop: SPACING.sm,
  },
});
