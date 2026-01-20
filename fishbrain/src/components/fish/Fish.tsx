import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';
import { FishType, HealthState } from '../../types';
import { FISH_CONFIG } from '../../constants/fish';

interface FishProps {
  fishType: FishType;
  healthState: HealthState;
  isEating?: boolean;
}

export function Fish({ fishType, healthState, isEating = false }: FishProps) {
  const config = FISH_CONFIG[fishType];

  // Animation values
  const swimX = useRef(new Animated.Value(0)).current;
  const swimY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  // Eating animation - fish swims up to catch food
  useEffect(() => {
    if (isEating && healthState !== 'dead') {
      // Stop current animations and swim up to eat
      swimX.stopAnimation();
      swimY.stopAnimation();

      Animated.sequence([
        // Swim up eagerly
        Animated.parallel([
          Animated.timing(swimY, {
            toValue: -50,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1.15,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        // Chomp animation (quick scale pulses)
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.25,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1.1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1.25,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1.1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        // Happy wiggle and return
        Animated.parallel([
          Animated.sequence([
            Animated.timing(rotation, {
              toValue: 0.1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(rotation, {
              toValue: -0.1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(rotation, {
              toValue: 0.1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(rotation, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(swimY, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [isEating]);

  // Swimming animation based on health state
  useEffect(() => {
    if (healthState === 'dead') {
      // Dead fish floats to top, upside down
      Animated.timing(swimY, {
        toValue: -80,
        duration: 2000,
        useNativeDriver: true,
      }).start();
      Animated.timing(rotation, {
        toValue: Math.PI,
        duration: 2000,
        useNativeDriver: true,
      }).start();
      return;
    }

    if (isEating) return; // Don't override eating animation

    // Swimming speed based on health
    const swimSpeed = healthState === 'thriving' ? 2000 : healthState === 'hungry' ? 3000 : 4000;
    const swimDistance = healthState === 'thriving' ? 30 : healthState === 'hungry' ? 20 : 10;

    // Horizontal swimming
    const swimAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(swimX, {
          toValue: swimDistance,
          duration: swimSpeed,
          useNativeDriver: true,
        }),
        Animated.timing(swimX, {
          toValue: -swimDistance,
          duration: swimSpeed,
          useNativeDriver: true,
        }),
      ])
    );

    // Vertical bobbing
    const bobAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(swimY, {
          toValue: 10,
          duration: swimSpeed / 2,
          useNativeDriver: true,
        }),
        Animated.timing(swimY, {
          toValue: -10,
          duration: swimSpeed / 2,
          useNativeDriver: true,
        }),
      ])
    );

    swimAnimation.start();
    bobAnimation.start();

    return () => {
      swimAnimation.stop();
      bobAnimation.stop();
    };
  }, [healthState, isEating, swimX, swimY]);

  // Scale pulse animation for thriving state
  useEffect(() => {
    if (isEating || healthState === 'dead') return;

    if (healthState === 'thriving') {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    } else {
      scale.setValue(healthState === 'critical' ? 0.9 : 1);
    }
  }, [healthState, isEating, scale]);

  // Get fish opacity based on health
  const getOpacity = () => {
    switch (healthState) {
      case 'dead':
        return 0.4;
      case 'critical':
        return 0.6;
      case 'hungry':
        return 0.8;
      default:
        return 1;
    }
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [-1, 0, 1, Math.PI],
    outputRange: ['-30deg', '0deg', '30deg', '180deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: swimX },
            { translateY: swimY },
            { scale },
            { rotate: rotateInterpolate },
          ],
          opacity: getOpacity(),
        },
      ]}
    >
      <Text style={styles.emoji}>{config.emoji}</Text>
      {healthState === 'critical' && (
        <View style={styles.statusIndicator}>
          <Text style={styles.statusText}>!</Text>
        </View>
      )}
      {isEating && (
        <View style={styles.happyIndicator}>
          <Text style={styles.happyText}>+10</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 64,
  },
  statusIndicator: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  happyIndicator: {
    position: 'absolute',
    top: -15,
    right: -20,
    backgroundColor: '#2ecc71',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  happyText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
