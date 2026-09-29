import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeStore } from '../../store/themeStore';
import { Colors } from '../../constants/colors';
import { GradientButton } from '../../components/ui/GradientButton';
import { Header } from '../../components/layout/Header';

export default function AddExpenseScreen() {
  const { isDark } = useThemeStore();
  const theme = isDark ? Colors.dark : Colors.light;
  const router = useRouter();

  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');

  const handleSave = () => {
    // Add logic to save expense via useExpenses hook
    router.back();
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: theme.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title="Add Expense" showBack onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Amount</Text>
          <TextInput
            style={[styles.input, styles.amountInput, { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border }]}
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Title</Text>
          <TextInput
            style={[styles.input, { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border }]}
            placeholder="What was this for?"
            value={title}
            onChangeText={setTitle}
          />
        </View>
        
        {/* Simplified for brevity. Full implementation includes segment control, category pill list, date picker. */}
        
        <GradientButton title="Save Transaction" onPress={handleSave} style={styles.saveButton} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, height: 50, fontSize: 16 },
  amountInput: { fontSize: 32, height: 80, textAlign: 'center', fontWeight: 'bold' },
  saveButton: { marginTop: 24 }
});
