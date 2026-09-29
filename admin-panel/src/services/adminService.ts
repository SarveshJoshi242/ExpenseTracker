import api from './api';
import { DashboardStats, User, DbStats, WhatsAppMessage, AuditLog } from '../types';

export const adminService = {
  getDashboard: () => api.get<DashboardStats>('/admin/dashboard'),
  getUsers: () => api.get<User[]>('/admin/users'),
  getUserDetail: (id: string) => api.get<{ user: User; expenses: any[] }>(`/admin/users/${id}`),
  toggleUserStatus: (id: string, status: 'active' | 'inactive') => api.put(`/admin/users/${id}/status`, { status }),
  getDbStats: () => api.get<DbStats>('/admin/db-stats'),
  sendWhatsApp: (to: string, message: string) => api.post('/admin/whatsapp/send', { to, message }),
  broadcast: (message: string, userIds?: string[]) => api.post('/admin/whatsapp/broadcast', { message, userIds }),
  getWhatsAppLogs: () => api.get<WhatsAppMessage[]>('/admin/whatsapp/logs'),
  getAuditLogs: () => api.get<AuditLog[]>('/admin/audit-logs'),
  generateReport: (type: string, startDate: string, endDate: string) => api.post('/admin/reports/generate', { type, startDate, endDate }, { responseType: 'blob' }),
};
