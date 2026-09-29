import express from 'express';
import authRoutes from './auth.routes.js';
import expenseRoutes from './expense.routes.js';
import categoryRoutes from './category.routes.js';
import budgetRoutes from './budget.routes.js';
import adminRoutes from './admin.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/expenses', expenseRoutes);
router.use('/categories', categoryRoutes);
router.use('/budgets', budgetRoutes);
router.use('/admin', adminRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'API is healthy' });
});

export default router;
