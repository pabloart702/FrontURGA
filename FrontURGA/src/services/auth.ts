import api from '../api/axios';
import type { User } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<void> => {
    await api.post('/auth/login', { email, password });
  },

  me: async (): Promise<User> => {
    const response = await api.get<User>('/users/perfil');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};
