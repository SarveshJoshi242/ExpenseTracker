import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDark: Appearance.getColorScheme() === 'dark',
  toggleTheme: async () => {
    const newIsDark = !get().isDark;
    set({ isDark: newIsDark });
    await AsyncStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  },
  loadTheme: async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        set({ isDark: savedTheme === 'dark' });
      }
    } catch (e) {
      console.error(e);
    }
  }
}));
