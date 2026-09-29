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

  // Safe access with fallbacks — API returns data nested in response.data.data
  const totalUsers = dashboardData.totalUsers ?? 0;
  const activeUsers = dashboardData.activeUsers ?? dashboardData.newUsersThisMonth ?? 0;
  const totalTransactions = dashboardData.totalTransactions ?? dashboardData.totalExpensesCount ?? 0;
  const totalAmountTracked = dashboardData.totalAmountTracked ?? 0;
  const userGrowth = dashboardData.userGrowth ?? [];
  const expenseTrends = dashboardData.expenseTrends ?? [];
  const topCategories = dashboardData.topCategories ?? [];
  const categoryDist = dashboardData.categoryDist ?? topCategories.map((c: any) => ({ name: c.name, value: c.total }));
  const recentActivity = dashboardData.recentActivity ?? [];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Users" 
            value={totalUsers.toLocaleString()} 
            icon={<PeopleIcon htmlColor="#fff" />} 
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="New This Month" 
            value={activeUsers.toLocaleString()} 
            icon={<PersonPinIcon htmlColor="#fff" />} 
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Transactions" 
            value={totalTransactions.toLocaleString()} 
            icon={<ReceiptIcon htmlColor="#fff" />} 
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Amount Tracked" 
            value={`₹${totalAmountTracked.toLocaleString()}`} 
            icon={<AttachMoneyIcon htmlColor="#fff" />} 
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          {userGrowth.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <UserGrowthChart data={userGrowth} />
              </CardContent>
            </Card>
          )}
          {expenseTrends.length > 0 && (
            <Card>
              <CardContent>
                <ExpenseTrendsChart data={expenseTrends} />
              </CardContent>
            </Card>
          )}
          {userGrowth.length === 0 && expenseTrends.length === 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Analytics</Typography>
                <Typography color="text.secondary">
                  Charts will appear here as users start adding expenses.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Top Categories</Typography>
              {categoryDist.length > 0 ? (
                <CategoryDistChart data={categoryDist} />
              ) : (
                <Typography color="text.secondary">No category data yet.</Typography>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Activity</Typography>
              {recentActivity.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {recentActivity.map((activity: any, index: number) => (
                    <Box key={activity.id || index} sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2">{activity.description}</Typography>
                      <Typography variant="caption" color="text.secondary">{activity.time}</Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">No recent activity yet.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
