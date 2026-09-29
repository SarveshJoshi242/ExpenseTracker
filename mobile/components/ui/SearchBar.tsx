import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/themeStore';
import { Colors } from '../../constants/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
}) => {
  const { isDark } = useThemeStore();
  const theme = isDark ? Colors.dark : Colors.light;
  const [isFocused, setIsFocused] = useState(false);

  const focusAnim = useSharedValue(0);

  const handleFocus = () => {
    setIsFocused(true);
    focusAnim.value = withSpring(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      focusAnim.value = withSpring(0);
    }
  };

  const animatedContainerStyle = useAnimatedStyle(() => ({
    borderColor: isFocused ? theme.primary : theme.border,
    shadowOpacity: interpolate(focusAnim.value, [0, 1], [0, 0.1]),
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.surface },
        animatedContainerStyle,
      ]}
    >
      <MaterialIcons name="search" size={24} color={isFocused ? theme.primary : theme.textSecondary} />
      <TextInput
        style={[styles.input, { color: theme.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} style={styles.clearButton}>
          <MaterialIcons name="close" size={20} color={theme.textSecondary} />
        </Pressable>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    marginVertical: 8,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
});
