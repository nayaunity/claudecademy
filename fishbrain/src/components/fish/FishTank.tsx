import { useEffect, useRef, ReactNode } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { THEME, RADIUS } from '../../constants/theme';

interface FishTankProps {
  children: ReactNode;
}

// Individual bubble component
function Bubble({ delay, startX }: { delay: number; startX: number }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animate = () => {
      translateY.setValue(0);
      opacity.setValue(0);
      scale.setValue(0.5 + Math.random() * 0.5);

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -180,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.5,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 2500,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start(() => animate());
    };

    animate();
  }, [delay, translateY, opacity, scale]);

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          left: startX,
          transform: [{ translateY }, { scale }],
          opacity,
        },
      ]}
    />
  );
}

export function FishTank({ children }: FishTankProps) {
  const bubbles = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    delay: i * 800,
    startX: 20 + (i * 50) % 140,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.tank}>
        {/* Subtle water background */}
        <View style={styles.waterBackground} />

        {/* Bubbles */}
        <View style={styles.bubblesContainer}>
          {bubbles.map((bubble) => (
            <Bubble
              key={bubble.id}
              delay={bubble.delay}
              startX={bubble.startX}
            />
          ))}
        </View>

        {/* Children (Fish and FoodDrop) */}
        <View style={styles.contentContainer}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tank: {
    flex: 1,
    backgroundColor: THEME.surface,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  waterBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: THEME.waterLight,
  },
  bubblesContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    position: 'absolute',
    bottom: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.bubbleColor,
  },
  contentContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
