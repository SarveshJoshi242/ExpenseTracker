import express from 'express';
import { getBudgets, getBudgetById, createBudget, updateBudget, deleteBudget, getBudgetProgress } from '../controllers/budgetController.js';
import { auth } from '../middleware/auth.js';
import { validate, createBudgetSchema } from '../middleware/validator.js';

const router = express.Router();

router.use(auth);

router.route('/')
  .get(getBudgets)
  .post(validate(createBudgetSchema), createBudget);

router.route('/:id')
  .get(getBudgetById)
  .put(updateBudget)
  .delete(deleteBudget);

router.get('/:id/progress', getBudgetProgress);

export default router;
