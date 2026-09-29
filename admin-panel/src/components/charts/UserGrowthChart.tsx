import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Typography } from '@mui/material';

interface Props {
  data: { date: string; users: number }[];
}

const UserGrowthChart: React.FC<Props> = ({ data }) => {
  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <Typography variant="h6" gutterBottom>User Growth</Typography>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2196f3" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#2196f3" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="#8884d8" />
          <YAxis stroke="#8884d8" />
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333' }} />
          <Area type="monotone" dataKey="users" stroke="#2196f3" fillOpacity={1} fill="url(#colorUsers)" />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default UserGrowthChart;
