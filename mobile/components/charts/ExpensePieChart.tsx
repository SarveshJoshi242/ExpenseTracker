import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useThemeStore } from '../../store/themeStore';
import { Colors } from '../../constants/colors';

interface PieChartData {
  value: number;
  color: string;
  text?: string;
  label?: string;
}

interface ExpensePieChartProps {
  data: PieChartData[];
  centerLabel?: string;
}

export const ExpensePieChart: React.FC<ExpensePieChartProps> = ({ data, centerLabel }) => {
  const { isDark } = useThemeStore();
  const theme = isDark ? Colors.dark : Colors.light;

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PieChart
        data={data}
        donut
        showText
        textColor="#fff"
        radius={120}
        innerRadius={80}
        innerCircleColor={theme.card}
        centerLabelComponent={() => {
          return (
            <View style={styles.centerLabelContainer}>
              <Text style={[styles.centerLabelText, { color: theme.text }]}>
                {centerLabel || 'Total'}
              </Text>
            </View>
          );
        }}
      />
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={[styles.legendText, { color: theme.text }]}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  emptyContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  centerLabelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLabelText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
});
