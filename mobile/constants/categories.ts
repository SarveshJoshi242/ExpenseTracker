import { MaterialIcons } from '@expo/vector-icons';

export type IconName = keyof typeof MaterialIcons.glyphMap;

export interface CategoryItem {
  id: string;
  name: string;
  icon: IconName;
  color: string;
  type: 'expense' | 'income';
}

export const defaultExpenseCategories: CategoryItem[] = [
  { id: 'e1', name: 'Food', icon: 'restaurant', color: '#f59e0b', type: 'expense' },
  { id: 'e2', name: 'Transport', icon: 'directions-car', color: '#3b82f6', type: 'expense' },
  { id: 'e3', name: 'Shopping', icon: 'shopping-cart', color: '#ec4899', type: 'expense' },
  { id: 'e4', name: 'Entertainment', icon: 'movie', color: '#8b5cf6', type: 'expense' },
  { id: 'e5', name: 'Bills', icon: 'receipt', color: '#ef4444', type: 'expense' },
  { id: 'e6', name: 'Health', icon: 'favorite', color: '#f43f5e', type: 'expense' },
  { id: 'e7', name: 'Education', icon: 'school', color: '#10b981', type: 'expense' },
  { id: 'e8', name: 'Other', icon: 'more-horiz', color: '#64748b', type: 'expense' }
];

export const defaultIncomeCategories: CategoryItem[] = [
  { id: 'i1', name: 'Salary', icon: 'attach-money', color: '#10b981', type: 'income' },
  { id: 'i2', name: 'Freelance', icon: 'laptop-mac', color: '#3b82f6', type: 'income' },
  { id: 'i3', name: 'Investment', icon: 'trending-up', color: '#8b5cf6', type: 'income' },
  { id: 'i4', name: 'Gift', icon: 'card-giftcard', color: '#f59e0b', type: 'income' },
  { id: 'i5', name: 'Other', icon: 'more-horiz', color: '#64748b', type: 'income' }
];
