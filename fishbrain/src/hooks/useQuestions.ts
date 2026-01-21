import { useState, useCallback, useMemo } from 'react';
import { Question } from '../types';
import { useGameState } from './useGameState';
import questions from '../../data/questions.json';

// Type assertion for imported questions
const typedQuestions = questions as Question[];

// Hook for question selection and management
export function useQuestions() {
  const { state } = useGameState();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // Get available questions (not yet answered)
  const availableQuestions = useMemo(() => {
    return typedQuestions.filter(
      (q) => !state.answeredQuestionIds.includes(q.id)
    );
  }, [state.answeredQuestionIds]);

  // Check if there are questions available
  const hasQuestions = availableQuestions.length > 0;

  // Get a random question from available pool
  const getRandomQuestion = useCallback((): Question | null => {
    if (availableQuestions.length === 0) {
      // If all questions answered, reset and pick from all
      const randomIndex = Math.floor(Math.random() * typedQuestions.length);
      return typedQuestions[randomIndex];
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    return availableQuestions[randomIndex];
  }, [availableQuestions]);

  // Select a new question
  const selectNewQuestion = useCallback(() => {
    const question = getRandomQuestion();
    setCurrentQuestion(question);
    return question;
  }, [getRandomQuestion]);

  // Clear current question
  const clearQuestion = useCallback(() => {
    setCurrentQuestion(null);
  }, []);

  // Check if answer is correct (optionIndex is 0-based)
  const checkAnswer = useCallback(
    (optionIndex: number): boolean => {
      if (!currentQuestion) return false;
      return currentQuestion.correctAnswer === optionIndex;
    },
    [currentQuestion]
  );

  return {
    currentQuestion,
    availableQuestions,
    hasQuestions,
    totalQuestions: typedQuestions.length,
    answeredCount: state.answeredQuestionIds.length,
    selectNewQuestion,
    clearQuestion,
    checkAnswer,
  };
}
