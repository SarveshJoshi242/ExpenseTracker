export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  createdAt: string;
  totalExpenses: number;
  lastActive: string;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  totalAmountTracked: number;
  userGrowth: { date: string; users: number }[];
  expenseTrends: { date: string; amount: number; count: number }[];
  categoryDist: { name: string; value: number }[];
  recentActivity: { id: string; type: string; description: string; time: string }[];
}

export interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export interface WhatsAppMessage {
  id: string;
  to: string;
  content: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  type: 'broadcast' | 'reply' | 'alert';
}

export interface DbStats {
  collections: {
    name: string;
    documentCount: number;
    avgSize: number;
    totalSize: number;
  }[];
  totalStorage: number;
  connected: boolean;
  uptime: number;
}
