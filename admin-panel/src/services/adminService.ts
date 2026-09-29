import api from './api';

export const adminService = {
  getDashboard: () => api.get<any>('/admin/dashboard'),
  getUsers: () => api.get<any>('/admin/users'),
  getUserDetail: (id: string) => api.get<any>(`/admin/users/${id}`),
  toggleUserStatus: (id: string, status: 'active' | 'inactive') => api.put(`/admin/users/${id}/status`, { status }),
  getDbStats: () => api.get<any>('/admin/db-stats'),
  sendWhatsApp: (to: string, message: string) => api.post('/admin/whatsapp/send', { to, message }),
  broadcast: (message: string, userIds?: string[]) => api.post('/admin/whatsapp/broadcast', { message, userIds }),
  getWhatsAppLogs: () => api.get<any>('/admin/whatsapp/logs'),
  getAuditLogs: () => api.get<any>('/admin/audit-logs'),
  generateReport: (type: string, startDate: string, endDate: string) => api.post('/admin/reports/generate', { type, startDate, endDate }, { responseType: 'blob' }),
};
