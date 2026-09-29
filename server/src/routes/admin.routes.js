import express from 'express';
import {
  getDashboard,
  getAllUsers,
  getUserDetail,
  toggleUserStatus,
  getDbStats,
  getAuditLogs,
  sendWhatsAppMessage,
  broadcastMessage
} from '../controllers/adminController.js';
import { auth } from '../middleware/auth.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

router.use(auth, adminAuth);

router.get('/dashboard', getDashboard);
router.get('/db-stats', getDbStats);
router.get('/audit-logs', getAuditLogs);
router.post('/whatsapp', sendWhatsAppMessage);
router.post('/broadcast', broadcastMessage);

router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetail);
router.put('/users/:id/toggle-status', toggleUserStatus);

export default router;
