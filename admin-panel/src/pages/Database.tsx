import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, LinearProgress } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import { adminService } from '../services/adminService';
import { DbStats } from '../types';

const Database: React.FC = () => {
  const [stats, setStats] = useState<DbStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getDbStats();
        setStats(res.data);
      } catch (err) {
        // mock
        setStats({
          collections: [
            { name: 'users', documentCount: 1542, avgSize: 250, totalSize: 385500 },
            { name: 'expenses', documentCount: 45231, avgSize: 150, totalSize: 6784650 }
          ],
          totalStorage: 7170150,
          connected: true,
          uptime: 86400 * 5
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return <CircularProgress />;
  }

  const maxStorage = 500 * 1024 * 1024; // 500MB free tier for example
  const storageUsagePercent = (stats.totalStorage / maxStorage) * 100;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>Database Overview</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: stats.connected ? '#4caf50' : '#f44336' }} />
          <Typography color={stats.connected ? 'success.main' : 'error.main'}>
            {stats.connected ? 'Connected' : 'Disconnected'}
          </Typography>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Storage Usage</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <LinearProgress variant="determinate" value={storageUsagePercent} sx={{ height: 10, borderRadius: 5 }} />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {(stats.totalStorage / 1024 / 1024).toFixed(2)} MB / 500 MB
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>Collections</Typography>
      <Grid container spacing={3}>
        {stats.collections.map((col) => (
          <Grid item xs={12} sm={6} md={4} key={col.name}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <StorageIcon color="primary" />
                  <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>{col.name}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">Documents: {col.documentCount}</Typography>
                <Typography variant="body2" color="text.secondary">Avg Size: {col.avgSize} bytes</Typography>
                <Typography variant="body2" color="text.secondary">Total Size: {(col.totalSize / 1024).toFixed(2)} KB</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Database;
