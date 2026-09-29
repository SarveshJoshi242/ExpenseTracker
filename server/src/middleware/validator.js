import Joi from 'joi';
import { errorResponse } from '../utils/responseHelper.js';

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return errorResponse(res, 400, 'Validation Error', errors);
  }
  next();
};

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().optional().allow(''),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const createExpenseSchema = Joi.object({
  title: Joi.string().required(),
  amount: Joi.number().positive().required(),
  type: Joi.string().valid('income', 'expense').required(),
  categoryId: Joi.string().required(),
  paymentMethod: Joi.string().valid('cash', 'card', 'upi', 'bank').required(),
  note: Joi.string().optional().allow(''),
  date: Joi.date().optional(),
  isRecurring: Joi.boolean().optional(),
  recurringFreq: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').optional().allow(null),
  tags: Joi.array().items(Joi.string()).optional(),
});

export const updateExpenseSchema = createExpenseSchema.fork(
  Object.keys(createExpenseSchema.describe().keys),
  (schema) => schema.optional()
);

export const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  icon: Joi.string().required(),
  color: Joi.string().required(),
  type: Joi.string().valid('income', 'expense').required(),
});

export const createBudgetSchema = Joi.object({
  categoryId: Joi.string().required(),
  limitAmount: Joi.number().positive().required(),
  period: Joi.string().valid('weekly', 'monthly', 'yearly').required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref('startDate')).required(),
});
