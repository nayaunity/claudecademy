import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';
import { FishType, HealthState } from '../../types';
import { FISH_CONFIG } from '../../constants/fish';
import { THEME } from '../../constants/theme';

interface FishProps {
  fishType: FishType;
  healthState: HealthState;
  isEating?: boolean;
}

export function Fish({ fishType, healthState, isEating = false }: FishProps) {
  const config = FISH_CONFIG[fishType];

  const swimX = useRef(new Animated.Value(0)).current;
  const swimY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  // Eating animation
  useEffect(() => {
    if (isEating && healthState !== 'dead') {
      swimX.stopAnimation();
      swimY.stopAnimation();

      Animated.sequence([
        Animated.parallel([
          Animated.timing(swimY, {
            toValue: -40,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1.15,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
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

  // Swimming animation
  useEffect(() => {
    if (healthState === 'dead') {
      Animated.timing(swimY, {
        toValue: -60,
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

    if (isEating) return;

    const swimSpeed = healthState === 'thriving' ? 2000 : healthState === 'hungry' ? 3000 : 4000;
    const swimDistance = healthState === 'thriving' ? 25 : healthState === 'hungry' ? 15 : 8;

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

    const bobAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(swimY, {
          toValue: 8,
          duration: swimSpeed / 2,
          useNativeDriver: true,
        }),
        Animated.timing(swimY, {
          toValue: -8,
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

  // Scale pulse for thriving
  useEffect(() => {
    if (isEating || healthState === 'dead') return;

    if (healthState === 'thriving') {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.08,
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

  const getOpacity = () => {
    switch (healthState) {
      case 'dead':
        return 0.3;
      case 'critical':
        return 0.6;
      case 'hungry':
        return 0.85;
      default:
        return 1;
    }
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [-1, 0, 1, Math.PI],
    outputRange: ['-20deg', '0deg', '20deg', '180deg'],
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
  happyIndicator: {
    position: 'absolute',
    top: -12,
    right: -16,
    backgroundColor: THEME.success,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  happyText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
});
