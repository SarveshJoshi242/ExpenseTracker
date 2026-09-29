import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../components/layout/Header';
import { AnimatedCard } from '../../components/ui/AnimatedCard';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';
import { SwipeableRow } from '../../components/ui/SwipeableRow';
import { useThemeStore } from '../../store/themeStore';
import { useExpenses } from '../../hooks/useExpenses';
import { Colors } from '../../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dateHelpers';

export default function DashboardScreen() {
  const { isDark } = useThemeStore();
  const theme = isDark ? Colors.dark : Colors.light;
  const router = useRouter();
  
  const { expenses, stats, isLoading, refresh, removeExpense } = useExpenses();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const recentTransactions = expenses.slice(0, 5);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
      >
        <AnimatedCard colors={[theme.primary, theme.secondary]} style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <AnimatedCounter 
            value={stats?.totalBalance || 0} 
            isCurrency 
            prefix="$"
            style={styles.balanceAmount}
          />
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialIcons name="arrow-downward" size={16} color="#fff" />
              <Text style={styles.statLabel}>Income</Text>
              <Text style={styles.statValue}>{formatCurrency(stats?.totalIncome || 0)}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="arrow-upward" size={16} color="#fff" />
              <Text style={styles.statLabel}>Expense</Text>
              <Text style={styles.statValue}>{formatCurrency(stats?.totalExpense || 0)}</Text>
            </View>
          </View>
        </AnimatedCard>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Transactions</Text>
          <Text 
            style={[styles.seeAll, { color: theme.primary }]}
            onPress={() => router.push('/(tabs)/transactions')}
          >
            See All
          </Text>
        </View>

        {recentTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ color: theme.textSecondary }}>No transactions yet.</Text>
          </View>
        ) : (
          recentTransactions.map((tx) => (
            <SwipeableRow 
              key={tx.id}
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
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  balanceCard: { padding: 24, marginBottom: 24 },
  balanceLabel: { color: '#fff', fontSize: 16, opacity: 0.9, marginBottom: 8 },
  balanceAmount: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginBottom: 24 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { flexDirection: 'row', alignItems: 'center' },
  statLabel: { color: '#fff', marginHorizontal: 4, opacity: 0.9 },
  statValue: { color: '#fff', fontWeight: 'bold' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  seeAll: { fontSize: 14, fontWeight: '600' },
  transactionItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 12 },
  iconContainer: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  txDetails: { flex: 1 },
  txTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  txDate: { fontSize: 12 },
  txAmount: { fontSize: 16, fontWeight: 'bold' },
  emptyState: { padding: 32, alignItems: 'center' }
});
