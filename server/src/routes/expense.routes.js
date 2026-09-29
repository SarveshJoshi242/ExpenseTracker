import express from 'express';
import { getExpenses, getExpenseById, createExpense, updateExpense, deleteExpense, getStats, exportExpenses } from '../controllers/expenseController.js';
import { auth } from '../middleware/auth.js';
import { validate, createExpenseSchema, updateExpenseSchema } from '../middleware/validator.js';

const router = express.Router();

router.use(auth);

router.get('/stats', getStats);
router.get('/export', exportExpenses);

router.route('/')
  .get(getExpenses)
  .post(validate(createExpenseSchema), createExpense);

router.route('/:id')
  .get(getExpenseById)
  .put(validate(updateExpenseSchema), updateExpense)
  .delete(deleteExpense);

export default router;
