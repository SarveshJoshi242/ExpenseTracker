import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'bank'],
    required: true,
  },
  note: {
    type: String,
    trim: true,
  },
  receiptUrl: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurringFreq: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly', null],
    default: null,
  },
  tags: [{
    type: String,
    trim: true,
  }]
}, { timestamps: true });

expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, type: 1 });

export default mongoose.model('Expense', expenseSchema);
