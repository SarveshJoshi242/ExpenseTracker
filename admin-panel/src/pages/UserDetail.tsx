import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Grid, Button, CircularProgress, Divider, Avatar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { adminService } from '../services/adminService';
import { User, Expense } from '../types';
import TransactionTable from '../components/tables/TransactionTable';
import toast from 'react-hot-toast';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await adminService.getUserDetail(id!);
        setUser(res.data.user);
        setTransactions(res.data.expenses);
      } catch (err) {
        // Mock data
        setUser({ id: id!, name: 'John Doe', email: 'john@example.com', phone: '1234567890', status: 'active', createdAt: '2023-01-01', totalExpenses: 500, lastActive: '2023-10-01' });
        setTransactions([
          { id: '1', userId: id!, amount: 50, category: 'Food', description: 'Lunch', date: '2023-10-01', type: 'expense' },
          { id: '2', userId: id!, amount: 1000, category: 'Salary', description: 'October Salary', date: '2023-10-01', type: 'income' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!user) return;
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await adminService.toggleUserStatus(user.id, newStatus);
      setUser({ ...user, status: newStatus });
      toast.success(`User marked as ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading || !user) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/users')} sx={{ mb: 2 }}>
        Back to Users
      </Button>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main' }}>
                {user.name.charAt(0)}
              </Avatar>
              <Typography variant="h5" gutterBottom>{user.name}</Typography>
              <Typography color="text.secondary" gutterBottom>{user.email}</Typography>
              <Typography color="text.secondary" gutterBottom>{user.phone}</Typography>
              <Box sx={{ mt: 2, mb: 2 }}>
                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: '16px', 
                  backgroundColor: user.status === 'active' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                  color: user.status === 'active' ? '#4caf50' : '#f44336'
                }}>
                  {user.status.toUpperCase()}
                </span>
              </Box>
              <Button 
                variant="outlined" 
                color={user.status === 'active' ? 'error' : 'success'} 
                fullWidth
                onClick={handleToggleStatus}
              >
                {user.status === 'active' ? 'Deactivate User' : 'Activate User'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Account Overview</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Joined Date</Typography>
                  <Typography variant="subtitle1">{new Date(user.createdAt).toLocaleDateString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Last Active</Typography>
                  <Typography variant="subtitle1">{new Date(user.lastActive).toLocaleDateString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Total Tracked Expenses</Typography>
                  <Typography variant="subtitle1">${user.totalExpenses.toFixed(2)}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
              <TransactionTable transactions={transactions} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDetail;
