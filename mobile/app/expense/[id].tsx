import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeStore } from '../../store/themeStore';
import { Colors } from '../../constants/colors';
import { Header } from '../../components/layout/Header';

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams();
  const { isDark } = useThemeStore();
  const theme = isDark ? Colors.dark : Colors.light;
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Expense Detail" showBack onBack={() => router.back()} />
      <View style={styles.content}>
        <Text style={[styles.text, { color: theme.text }]}>Detail for ID: {id}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 18 }
});
