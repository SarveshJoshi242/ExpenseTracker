import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // null means it's a default system category
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

categorySchema.statics.seedDefaultCategories = async function (userId) {
  const defaultCategories = [
    { name: 'Food', icon: 'utensils', color: '#ff6b6b', type: 'expense', isDefault: true },
    { name: 'Transport', icon: 'car', color: '#4ecdc4', type: 'expense', isDefault: true },
    { name: 'Housing', icon: 'home', color: '#45b7d1', type: 'expense', isDefault: true },
    { name: 'Salary', icon: 'wallet', color: '#96ceb4', type: 'income', isDefault: true },
    { name: 'Investment', icon: 'chart-line', color: '#ffeead', type: 'income', isDefault: true }
  ];

  const categories = defaultCategories.map(cat => ({ ...cat, userId }));
  return await this.insertMany(categories);
};

export default mongoose.model('Category', categorySchema);
