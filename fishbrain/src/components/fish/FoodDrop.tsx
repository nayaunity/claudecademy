import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { THEME } from '../../constants/theme';

interface FoodDropProps {
  isDropping: boolean;
  onEaten: () => void;
}

// Individual food pellet
function FoodPellet({ delay, startX, onComplete }: { delay: number; startX: number; onComplete: () => void }) {
  const translateY = useRef(new Animated.Value(-20)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        // Fall down
        Animated.timing(translateY, {
          toValue: 120,
          duration: 1200,
          useNativeDriver: true,
        }),
        // Slight wobble via scale
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.9,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          // Eaten - shrink and fade
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]),
    ]).start(() => {
      onComplete();
    });
  }, []);

  return (
    <Animated.View
      style={[
        styles.pellet,
        {
          left: startX,
          transform: [{ translateY }, { scale }],
          opacity,
        },
      ]}
    />
  );
}

export function FoodDrop({ isDropping, onEaten }: FoodDropProps) {
  const pelletsCompleted = useRef(0);
  const totalPellets = 3;

  const handlePelletComplete = () => {
    pelletsCompleted.current += 1;
    if (pelletsCompleted.current >= totalPellets) {
      pelletsCompleted.current = 0;
      onEaten();
    }
  };

  if (!isDropping) return null;

  // Create multiple food pellets at different positions
  const pellets = [
    { id: 1, delay: 0, startX: '35%' },
    { id: 2, delay: 150, startX: '50%' },
    { id: 3, delay: 300, startX: '60%' },
  ];

  return (
    <View style={styles.container} pointerEvents="none">
      {pellets.map((pellet) => (
        <FoodPellet
          key={pellet.id}
          delay={pellet.delay}
          startX={pellet.startX as any}
          onComplete={handlePelletComplete}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  pellet: {
    position: 'absolute',
    top: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D2691E', // Brown food pellet color
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});
