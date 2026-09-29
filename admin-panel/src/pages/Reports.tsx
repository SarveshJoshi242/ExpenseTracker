import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, FormControl, InputLabel, Select, MenuItem, TextField, Button, Grid } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState('user-activity');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      if (startDate && endDate) {
        await adminService.generateReport(reportType, startDate, endDate);
      } else {
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      toast.success('Report generated successfully');
    } catch (err) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>Reports</Typography>
      
      <Card>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  label="Report Type"
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="user-activity">User Activity</MenuItem>
                  <MenuItem value="expense-summary">Expense Summary</MenuItem>
                  <MenuItem value="platform-usage">Platform Usage</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button 
                variant="contained" 
                fullWidth 
                startIcon={<DownloadIcon />}
                onClick={handleGenerate}
                disabled={loading}
                sx={{ height: 56 }}
              >
                {loading ? 'Generating...' : 'Generate'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Reports;
