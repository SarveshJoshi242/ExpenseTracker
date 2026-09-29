import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Card, CardContent } from '@mui/material';

const QRDisplay: React.FC = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'connected' | 'disconnected'>('loading');

  useEffect(() => {
    // In a real app, this would fetch from the WhatsApp service API
    // For now, simulate fetching
    const fetchStatus = async () => {
      try {
        const response = await fetch('http://localhost:5001/status');
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'connected') {
            setStatus('connected');
          } else {
            const qrRes = await fetch('http://localhost:5001/qr');
            if (qrRes.ok) {
              const qrData = await qrRes.json();
              setQrCode(qrData.qr);
            }
            setStatus('disconnected');
          }
        }
      } catch (err) {
        setStatus('disconnected');
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
        <Typography variant="h6" gutterBottom>
          WhatsApp Connection Status: {status.toUpperCase()}
        </Typography>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          {status === 'loading' && <CircularProgress />}
          {status === 'connected' && (
            <Typography color="success.main" variant="h5">
              Successfully Connected!
            </Typography>
          )}
          {status === 'disconnected' && qrCode && (
            <Box>
              <Typography gutterBottom align="center">Scan QR code to connect:</Typography>
              <Box 
                sx={{ p: 2, bgcolor: 'white', borderRadius: 2 }}
                dangerouslySetInnerHTML={{ __html: qrCode }} 
              />
            </Box>
          )}
          {status === 'disconnected' && !qrCode && (
            <Typography color="error">Waiting for QR code generation...</Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default QRDisplay;
