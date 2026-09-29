import React, { useEffect } from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/themeStore';
import { Colors } from '../../constants/colors';

interface CategoryPillProps {
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  isSelected?: boolean;
  onPress?: () => void;
  index?: number;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({
  name,
  icon,
  color,
  isSelected = false,
  onPress,
  index = 0,
}) => {
  const { isDark } = useThemeStore();
  const theme = isDark ? Colors.dark : Colors.light;

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    scale.value = withDelay(index * 50, withSpring(1));
    opacity.value = withDelay(index * 50, withSpring(1));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * pressScale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    pressScale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1);
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: isSelected ? color : theme.surface,
            borderColor: isSelected ? color : theme.border,
          },
          animatedStyle,
        ]}
      >
        <MaterialIcons
          name={icon}
          size={20}
          color={isSelected ? '#fff' : color}
        />
        <Text
          style={[
            styles.text,
            { color: isSelected ? '#fff' : theme.text },
          ]}
        >
          {name}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  text: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
});
