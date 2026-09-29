import React, { useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import UserGrowthChart from '../components/charts/UserGrowthChart';
import ExpenseTrendsChart from '../components/charts/ExpenseTrendsChart';
import CategoryDistChart from '../components/charts/CategoryDistChart';
import { useAdminStore } from '../store/adminStore';

const StatCard = ({ title, value, icon, color }: any) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="subtitle2">
            {title}
          </Typography>
          <Typography variant="h4">
            {value}
          </Typography>
        </Box>
        <Box sx={{ bgcolor: `${color}.main`, p: 1.5, borderRadius: 2, display: 'flex', opacity: 0.8 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const { dashboardData, isLoading, fetchDashboard } = useAdminStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (isLoading || !dashboardData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Users" 
            value={dashboardData.totalUsers.toLocaleString()} 
            icon={<PeopleIcon htmlColor="#fff" />} 
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Active Users" 
            value={dashboardData.activeUsers.toLocaleString()} 
            icon={<PersonPinIcon htmlColor="#fff" />} 
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Transactions" 
            value={dashboardData.totalTransactions.toLocaleString()} 
            icon={<ReceiptIcon htmlColor="#fff" />} 
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Amount Tracked" 
            value={`$${(dashboardData.totalAmountTracked / 1000).toFixed(1)}k`} 
            icon={<AttachMoneyIcon htmlColor="#fff" />} 
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <UserGrowthChart data={dashboardData.userGrowth} />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <ExpenseTrendsChart data={dashboardData.expenseTrends} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <CategoryDistChart data={dashboardData.categoryDist} />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Activity</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {dashboardData.recentActivity.map((activity) => (
                  <Box key={activity.id} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2">{activity.description}</Typography>
                    <Typography variant="caption" color="text.secondary">{activity.time}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
