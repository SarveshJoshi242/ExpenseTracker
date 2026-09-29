import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button, TextField, Switch } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';

interface Props {
  users: User[];
  onToggleStatus: (id: string, status: 'active' | 'inactive') => void;
}

const UserTable: React.FC<Props> = ({ users, onToggleStatus }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'totalExpenses', headerName: 'Total Tracked', type: 'number', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Switch
          checked={params.value === 'active'}
          onChange={(e) => onToggleStatus(params.row.id as string, e.target.checked ? 'active' : 'inactive')}
          color="primary"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Button size="small" variant="outlined" onClick={() => navigate(`/users/${params.row.id}`)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search Users"
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
      <DataGrid
        rows={filteredUsers}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[5, 10, 25]}
        autoHeight
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell': { borderColor: '#333' },
          '& .MuiDataGrid-columnHeaders': { borderColor: '#333', bgcolor: '#1e1e1e' },
          '& .MuiDataGrid-footerContainer': { borderColor: '#333' },
        }}
      />
    </Box>
  );
};

export default UserTable;
