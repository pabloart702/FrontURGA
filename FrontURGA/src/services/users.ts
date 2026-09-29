import api from '../api/axios';
import type { User } from '../types';

export const usersService = {
  getUsers: async (page: number = 1, search?: string, departamento?: string): Promise<{ data: User[], totalPages: number, currentPage: number }> => {
    let url = `/users?page=${page}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (departamento) url += `&departamento=${encodeURIComponent(departamento)}`;
    const response = await api.get<{ data: User[], totalPages: number, currentPage: number }>(url);
    return response.data;
  },

  getUserById: async (id: number | string): Promise<User> => {
    const response = await api.get<User>(`/users/id/${id}`);
    return response.data;
  },

  createUser: async (userData: Omit<User, 'id' | 'status'> & { password?: string }): Promise<User> => {
    const response = await api.post<User>('/users', userData);
    return response.data;
  },

  updateUser: async (id: number | string, userData: Partial<User>): Promise<User> => {
    const response = await api.patch<User>(`/users/id/${id}`, userData);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/users/perfil');
    return response.data;
  },

  updateProfile: async (userData: Partial<User> & { password?: string }): Promise<User> => {
    const response = await api.patch<User>('/users/perfil', userData);
    return response.data;
  },

  updateProfilePicture: async (file: File): Promise<{ mensagem: string, user: User }> => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await api.patch<{ mensagem: string, user: User }>('/users/profile-picture', formData);

    return response.data;
  },

  deleteProfilePicture: async (): Promise<{ mensagem: string, user: User }> => {
    const response = await api.delete<{ mensagem: string, user: User }>('/users/profile-picture');
    return response.data;
  },

  deleteUser: async (id: number | string): Promise<{ mensagem: string }> => {
    const response = await api.delete<{ mensagem: string }>(`/users/id/${id}`);
    return response.data;
  },

  activateUser: async (id: number | string): Promise<{ mensagem: string, user: User }> => {
    const response = await api.patch<{ mensagem: string, user: User }>(`/users/id/${id}/ativar`);
    return response.data;
  },
};
