import React from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { Colors } from '../../constants/colors';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  notificationCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack,
  onBack,
  notificationCount = 0,
}) => {
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.surface }]}>
      {showBack ? (
        <Pressable onPress={onBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.text} />
        </Pressable>
      ) : (
        <View style={styles.userSection}>
          <Image
            source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=' + (user?.name || 'User') }}
            style={styles.avatar}
          />
          <View style={styles.greeting}>
            <Text style={[styles.greetingText, { color: theme.textSecondary }]}>Good Morning,</Text>
            <Text style={[styles.nameText, { color: theme.text }]}>{user?.name || 'User'}</Text>
          </View>
        </View>
      )}

      {title && (
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      )}

      <Pressable style={styles.notificationButton}>
        <MaterialIcons name="notifications-none" size={26} color={theme.text} />
        {notificationCount > 0 && (
          <View style={[styles.badge, { backgroundColor: theme.error }]}>
            <Text style={styles.badgeText}>
              {notificationCount > 9 ? '9+' : notificationCount}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  greeting: {
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 12,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: -1,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  notificationButton: {
    padding: 8,
    marginRight: -8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
