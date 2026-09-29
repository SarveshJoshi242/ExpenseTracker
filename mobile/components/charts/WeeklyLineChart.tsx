import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useThemeStore } from '../../store/themeStore';
import { Colors } from '../../constants/colors';

interface LineData {
  value: number;
  label: string;
}

interface WeeklyLineChartProps {
  data: LineData[];
}

export const WeeklyLineChart: React.FC<WeeklyLineChartProps> = ({ data }) => {
  const { isDark } = useThemeStore();
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        color={theme.primary}
        thickness={3}
        dataPointsColor={theme.accent}
        hideRules
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={{ color: theme.textSecondary }}
        noOfSections={4}
        curved
        isAnimated
        areaChart
        startFillColor={theme.primary}
        endFillColor={theme.background}
        startOpacity={0.3}
        endOpacity={0.05}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
});
