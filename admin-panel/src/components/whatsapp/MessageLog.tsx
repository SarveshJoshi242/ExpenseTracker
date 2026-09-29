import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { WhatsAppMessage } from '../../types';
import { adminService } from '../../services/adminService';

const MessageLog: React.FC = () => {
  const [logs, setLogs] = useState<WhatsAppMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await adminService.getWhatsAppLogs();
        setLogs(response.data);
      } catch (error) {
        // mock data
        setLogs([
          { id: '1', to: '+1234567890', content: 'Broadcast sent', status: 'delivered', timestamp: new Date().toISOString(), type: 'broadcast' },
          { id: '2', to: '+0987654321', content: 'Weekly Report', status: 'read', timestamp: new Date(Date.now() - 86400000).toISOString(), type: 'reply' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const columns: GridColDef[] = [
    { field: 'timestamp', headerName: 'Time', width: 200, valueFormatter: (params) => new Date(params.value).toLocaleString() },
    { field: 'to', headerName: 'Recipient', width: 150 },
    { field: 'type', headerName: 'Type', width: 100 },
    { field: 'content', headerName: 'Message Preview', width: 300 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 100,
      renderCell: (params) => (
        <span style={{ 
          color: params.value === 'delivered' || params.value === 'read' ? '#4caf50' : 
                 params.value === 'failed' ? '#f44336' : '#ff9800' 
        }}>
          {params.value.toUpperCase()}
        </span>
      )
    },
  ];

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Typography variant="h6" gutterBottom>Message Logs</Typography>
      <DataGrid
        rows={logs}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
          sorting: { sortModel: [{ field: 'timestamp', sort: 'desc' }] },
        }}
        pageSizeOptions={[5, 10, 25]}
        autoHeight
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default MessageLog;
