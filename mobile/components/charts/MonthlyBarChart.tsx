import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useThemeStore } from '../../store/themeStore';
import { Colors } from '../../constants/colors';

interface BarData {
  value: number;
  label: string;
  frontColor?: string;
}

interface MonthlyBarChartProps {
  data: BarData[];
}

export const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({ data }) => {
  const { isDark } = useThemeStore();
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <View style={styles.container}>
      <BarChart
        data={data}
        barWidth={22}
        spacing={24}
        roundedTop
        roundedBottom
        hideRules
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={{ color: theme.textSecondary }}
        noOfSections={4}
        initialSpacing={10}
        frontColor={theme.primary}
        yAxisLabelTexts={[]}
        isAnimated
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
});
