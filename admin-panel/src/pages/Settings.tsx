import React from 'react';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, ListItemSecondaryAction, Switch, Divider, Button } from '@mui/material';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 800 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Settings</Typography>
        <Button variant="contained" onClick={handleSave}>Save Changes</Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>System Notifications</Typography>
          <List>
            <ListItem>
              <ListItemText primary="New User Registration" secondary="Receive alerts when new users join" />
              <ListItemSecondaryAction>
                <Switch defaultChecked />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary="System Errors" secondary="Receive alerts for critical system errors" />
              <ListItemSecondaryAction>
                <Switch defaultChecked />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary="Database Alerts" secondary="Receive alerts when database usage is high" />
              <ListItemSecondaryAction>
                <Switch />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>WhatsApp Configurations</Typography>
          <List>
            <ListItem>
              <ListItemText primary="Auto-reply to unknown commands" secondary="Send help menu automatically" />
              <ListItemSecondaryAction>
                <Switch defaultChecked />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary="Enable Broadcasts" secondary="Allow sending broadcast messages" />
              <ListItemSecondaryAction>
                <Switch defaultChecked />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;
