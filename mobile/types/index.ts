export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  currency: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  type: 'expense' | 'income';
  category: string;
  date: string;
  paymentMethod: string;
  note?: string;
  receiptImage?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income';
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ExpenseFilters {
  type?: 'all' | 'expense' | 'income';
  dateRange?: { start: string; end: string };
  category?: string;
}

export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  savings: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
