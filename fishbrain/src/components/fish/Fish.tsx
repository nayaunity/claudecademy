import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';
import { FishType, HealthState } from '../../types';
import { FISH_CONFIG } from '../../constants/fish';

interface FishProps {
  fishType: FishType;
  healthState: HealthState;
}

export function Fish({ fishType, healthState }: FishProps) {
  const config = FISH_CONFIG[fishType];

  // Animation values
  const swimX = useRef(new Animated.Value(0)).current;
  const swimY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // Swimming animation based on health state
  useEffect(() => {
    if (healthState === 'dead') {
      // Dead fish floats to top, upside down
      Animated.timing(swimY, {
        toValue: -100,
        duration: 2000,
        useNativeDriver: true,
      }).start();
      return;
    }

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
  }, [healthState, swimX, swimY]);

  // Scale pulse animation for thriving state
  useEffect(() => {
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
  }, [healthState, scale]);

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

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: swimX },
            { translateY: swimY },
            { scale },
            { rotate: healthState === 'dead' ? '180deg' : '0deg' },
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 80,
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
});
