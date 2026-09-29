import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './src/utils/logger.js';
import { connectToWhatsApp, getConnectionStatus, getQR, sendMessage, sendBroadcast } from './src/client.js';
import { broadcastTemplate } from './src/templates/broadcast.js';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error('MongoDB connection error:', err));

// Start Baileys
connectToWhatsApp();

// API Endpoints
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/status', (req, res) => {
  res.json({ status: getConnectionStatus() });
});

app.get('/qr', async (req, res) => {
  try {
    const qrStr = getQR();
    if (!qrStr) {
      return res.status(404).json({ error: 'QR code not available (may be already connected)' });
    }
    // Very basic QR representation for API, real client would parse it to image
    res.json({ qr: qrStr });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/send', async (req, res) => {
  const { to, message } = req.body;
  if (!to || !message) return res.status(400).json({ error: 'Missing to or message' });
  
  try {
    // Format JID
    const jid = to.includes('@s.whatsapp.net') ? to : `${to}@s.whatsapp.net`;
    await sendMessage(jid, message);
    res.json({ success: true, message: 'Message sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/broadcast', async (req, res) => {
  const { message, userIds } = req.body; // userIds is optional, if missing send to all (mock logic here)
  if (!message) return res.status(400).json({ error: 'Missing message' });

  try {
    const broadcastMsg = broadcastTemplate(message);
    let targetJids = [];
    
    if (userIds && userIds.length > 0) {
      // Find these users' phones
      const users = await mongoose.model('User').find({ _id: { $in: userIds } });
      targetJids = users.map(u => `${u.phone}@s.whatsapp.net`);
    } else {
      // Find all users with phone
      const users = await mongoose.model('User').find({ phone: { $exists: true, $ne: null } });
      targetJids = users.map(u => `${u.phone}@s.whatsapp.net`);
    }

    if (targetJids.length === 0) {
      return res.status(404).json({ error: 'No users found with phone numbers' });
    }

    // Send asynchronously in background to not block response for many users
    sendBroadcast(targetJids, broadcastMsg).catch(err => logger.error('Broadcast failed:', err));
    
    res.json({ success: true, message: `Broadcast started for ${targetJids.length} users` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  logger.info(`WhatsApp service running on port ${PORT}`);
});
