import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

const BroadcastForm: React.FC = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      await adminService.broadcast(message);
      toast.success('Broadcast message sent successfully');
      setMessage('');
    } catch (error) {
      toast.error('Failed to send broadcast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Broadcast Message
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          This will send a message to all active users. Use cautiously.
        </Alert>
        <TextField
          label="Message Content"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ mb: 2 }}
          placeholder="Hello! Just a reminder to track your expenses today..."
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleSend}
            disabled={!message.trim() || loading}
          >
            {loading ? 'Sending...' : 'Send Broadcast'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BroadcastForm;
