import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Expense } from '../../types';

interface Props {
  transactions: Expense[];
}

const TransactionTable: React.FC<Props> = ({ transactions }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredData = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const columns: GridColDef[] = [
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'description', headerName: 'Description', width: 250 },
    { field: 'category', headerName: 'Category', width: 150 },
    { 
      field: 'type', 
      headerName: 'Type', 
      width: 100,
      renderCell: (params) => (
        <span style={{ color: params.value === 'income' ? '#4caf50' : '#f44336' }}>
          {params.value.toUpperCase()}
        </span>
      )
    },
    { 
      field: 'amount', 
      headerName: 'Amount', 
      type: 'number', 
      width: 130,
      renderCell: (params) => `$${params.value.toFixed(2)}`
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Search Transactions"
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filterType}
            label="Type"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
            <MenuItem value="income">Income</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <DataGrid
        rows={filteredData}
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

export default TransactionTable;
