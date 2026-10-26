import api from '../../../api/axios';
import type { User } from '../../../types';
import type { DashboardMetrics } from '../types/dashboard.types';

export const dashboardApi = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    const response = await api.get<DashboardMetrics>('/forms/dashboard');
    return response.data;
  },

  getUserName: async (): Promise<string | null> => {
    const response = await api.get<Pick<User, 'nome'>>('/users/perfil');
    return response.data.nome || null;
  },
};
