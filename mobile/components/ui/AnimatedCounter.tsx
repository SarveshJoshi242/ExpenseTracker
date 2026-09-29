import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS
} from 'react-native-reanimated';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  style?: TextStyle;
  prefix?: string;
  suffix?: string;
  isCurrency?: boolean;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  style,
  prefix = '',
  suffix = '',
  isCurrency = false
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.cubic),
    }, (finished) => {
      if (finished) {
        // Optional complete callback
      }
    });
  }, [value, duration]);

  // Use setInterval to poll the shared value if ReanimatedText isn't fully supported
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayValue(animatedValue.value);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const formattedValue = isCurrency
    ? displayValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Math.floor(displayValue).toString();

  return (
    <Text style={style}>
      {prefix}{formattedValue}{suffix}
    </Text>
  );
};
