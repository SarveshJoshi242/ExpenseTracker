import React, { useEffect } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UserTable from '../components/tables/UserTable';
import { useAdminStore } from '../store/adminStore';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';

const Users: React.FC = () => {
  const { users, isLoading, fetchUsers } = useAdminStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async (id: string, status: 'active' | 'inactive') => {
    try {
      await adminService.toggleUserStatus(id, status);
      toast.success(`User status updated to ${status}`);
      fetchUsers(); // Refresh
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleExport = () => {
    // Basic export functionality mock
    toast.success('Export started');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">User Management</Typography>
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport}>
          Export CSV
        </Button>
      </Box>

      <Card>
        <CardContent>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <UserTable users={users} onToggleStatus={handleToggleStatus} />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Users;
