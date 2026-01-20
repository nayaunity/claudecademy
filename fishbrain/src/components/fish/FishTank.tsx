import { useEffect, useRef, ReactNode } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
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
      // Reset values
      translateY.setValue(0);
      opacity.setValue(0);
      scale.setValue(0.5 + Math.random() * 0.5);

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -300,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.6,
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
  // Create bubbles at different positions
  const bubbles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    delay: i * 500,
    startX: 20 + (i * 50) % 200,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.tank}>
        {/* Water gradient background */}
        <View style={styles.waterBackground}>
          <View style={styles.waterGradientTop} />
          <View style={styles.waterGradientBottom} />
        </View>

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

        {/* Fish container */}
        <View style={styles.fishContainer}>{children}</View>

        {/* Ground/sand */}
        <View style={styles.ground}>
          <View style={styles.rock} />
          <View style={[styles.rock, styles.rock2]} />
          <View style={[styles.rock, styles.rock3]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  tank: {
    flex: 1,
    backgroundColor: THEME.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 4,
    borderColor: THEME.tankBorder,
    overflow: 'hidden',
    position: 'relative',
  },
  waterBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  waterGradientTop: {
    flex: 1,
    backgroundColor: 'rgba(30, 80, 120, 0.3)',
  },
  waterGradientBottom: {
    flex: 1,
    backgroundColor: 'rgba(20, 60, 100, 0.5)',
  },
  bubblesContainer: {
    ...StyleSheet.absoluteFillObject,
    bottom: 50,
  },
  bubble: {
    position: 'absolute',
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: THEME.bubbleColor,
  },
  fishContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(194, 178, 128, 0.4)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  rock: {
    position: 'absolute',
    bottom: 5,
    left: 20,
    width: 30,
    height: 20,
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
    borderRadius: 10,
  },
  rock2: {
    left: 80,
    width: 40,
    height: 25,
  },
  rock3: {
    left: 'auto',
    right: 30,
    width: 25,
    height: 18,
  },
});
