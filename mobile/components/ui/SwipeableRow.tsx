import React from 'react';
import { StyleSheet, View, Animated as RNAnimated, Dimensions } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/themeStore';
import { Colors } from '../../constants/colors';

interface SwipeableRowProps {
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
}

const { width } = Dimensions.get('window');

export const SwipeableRow: React.FC<SwipeableRowProps> = ({ children, onEdit, onDelete }) => {
  const { isDark } = useThemeStore();
  const theme = isDark ? Colors.dark : Colors.light;

  const renderLeftActions = (progress: RNAnimated.AnimatedInterpolation<number>, dragX: RNAnimated.AnimatedInterpolation<number>) => {
    if (!onEdit) return null;
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <View style={[styles.leftAction, { backgroundColor: theme.primary }]}>
        <RNAnimated.View
          style={[styles.actionIcon, { transform: [{ translateX: trans }] }]}
        >
          <MaterialIcons name="edit" size={24} color="#fff" />
        </RNAnimated.View>
      </View>
    );
  };

  const renderRightActions = (progress: RNAnimated.AnimatedInterpolation<number>, dragX: RNAnimated.AnimatedInterpolation<number>) => {
    if (!onDelete) return null;
    const trans = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [0, 0, 20],
    });
    return (
      <View style={[styles.rightAction, { backgroundColor: theme.error }]}>
        <RNAnimated.View
          style={[styles.actionIcon, { transform: [{ translateX: trans }] }]}
        >
          <MaterialIcons name="delete" size={24} color="#fff" />
        </RNAnimated.View>
      </View>
    );
  };

  return (
    <Swipeable
      renderLeftActions={onEdit ? renderLeftActions : undefined}
      renderRightActions={onDelete ? renderRightActions : undefined}
      onSwipeableLeftOpen={onEdit}
      onSwipeableRightOpen={onDelete}
    >
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 8,
    borderRadius: 12,
  },
  rightAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 8,
    borderRadius: 12,
  },
  actionIcon: {
    width: 64,
    alignItems: 'center',
  },
});
