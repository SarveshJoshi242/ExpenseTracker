import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeStore } from '../../store/themeStore';
import { useExpenses } from '../../hooks/useExpenses';
import { Colors } from '../../constants/colors';
import { SearchBar } from '../../components/ui/SearchBar';
import { SwipeableRow } from '../../components/ui/SwipeableRow';
import { EmptyState } from '../../components/ui/EmptyState';
import { MaterialIcons } from '@expo/vector-icons';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dateHelpers';

export default function TransactionsScreen() {
  const { isDark } = useThemeStore();
  const theme = isDark ? Colors.dark : Colors.light;
  const router = useRouter();
  
  const { expenses, removeExpense } = useExpenses();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExpenses = expenses.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Transactions</Text>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      </View>
      
      <FlatList
        data={filteredExpenses}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<EmptyState title="No transactions" description="Try adjusting filters or add a new expense." />}
        renderItem={({ item: tx }) => (
          <SwipeableRow 
            onDelete={() => removeExpense(tx.id)}
            onEdit={() => router.push(`/expense/${tx.id}`)}
          >
            <View style={[styles.transactionItem, { backgroundColor: theme.surface }]}>
              <View style={[styles.iconContainer, { backgroundColor: tx.type === 'income' ? theme.income + '20' : theme.expense + '20' }]}>
                <MaterialIcons name="receipt" size={24} color={tx.type === 'income' ? theme.income : theme.expense} />
              </View>
              <View style={styles.txDetails}>
                <Text style={[styles.txTitle, { color: theme.text }]}>{tx.title}</Text>
                <Text style={[styles.txDate, { color: theme.textSecondary }]}>{formatDate(tx.date)}</Text>
              </View>
              <Text style={[styles.txAmount, { color: tx.type === 'income' ? theme.income : theme.text }]}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </Text>
            </View>
          </SwipeableRow>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  listContainer: { padding: 16, paddingBottom: 100 },
  transactionItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 12 },
  iconContainer: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  txDetails: { flex: 1 },
  txTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  txDate: { fontSize: 12 },
  txAmount: { fontSize: 16, fontWeight: 'bold' }
});
