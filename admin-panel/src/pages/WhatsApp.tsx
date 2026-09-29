import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import QRDisplay from '../components/whatsapp/QRDisplay';
import BroadcastForm from '../components/whatsapp/BroadcastForm';
import MessageLog from '../components/whatsapp/MessageLog';

const WhatsApp: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>WhatsApp Management</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <QRDisplay />
          <Box sx={{ mt: 3 }}>
            <BroadcastForm />
          </Box>
        </Grid>
        <Grid item xs={12} md={7}>
          <MessageLog />
        </Grid>
      </Grid>
    </Box>
  );
};

export default WhatsApp;
