import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography } from '@mui/material';

interface Props {
  data: { date: string; amount: number; count: number }[];
}

const ExpenseTrendsChart: React.FC<Props> = ({ data }) => {
  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <Typography variant="h6" gutterBottom>Expense Trends</Typography>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#8884d8" />
          <YAxis yAxisId="left" stroke="#2196f3" />
          <YAxis yAxisId="right" orientation="right" stroke="#9c27b0" />
          <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333' }} />
          <Legend />
          <Bar yAxisId="left" dataKey="amount" fill="#2196f3" name="Amount ($)" />
          <Line yAxisId="right" type="monotone" dataKey="count" stroke="#9c27b0" name="Transactions" />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ExpenseTrendsChart;
