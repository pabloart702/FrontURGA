import api from '../api/axios';
import type { User } from '../types';

export const usersService = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  getUserById: async (id: number | string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: Omit<User, 'id' | 'status'> & { password?: string }): Promise<User> => {
    const response = await api.post<User>('/users', userData);
    return response.data;
  },

  updateUser: async (id: number | string, userData: Partial<User>): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number | string): Promise<{ mensagem: string }> => {
    const response = await api.delete<{ mensagem: string }>(`/users/${id}`);
    return response.data;
  },
};
