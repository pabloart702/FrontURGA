import api from '../../../api/axios';
import type { User } from '../../../types';
import type {
  UsersListResponse,
  CreateUserPayload,
  UpdateUserPayload,
} from '../types/usuarios.types';

export const usuariosApi = {
  getUsers: async (
    page: number = 1,
    search?: string,
    departamento?: string
  ): Promise<UsersListResponse> => {
    let url = `/users?page=${page}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (departamento) url += `&departamento=${encodeURIComponent(departamento)}`;
    const response = await api.get<UsersListResponse>(url);
    return response.data;
  },

  getUserById: async (id: number | string): Promise<User> => {
    const response = await api.get<User>(`/users/id/${id}`);
    return response.data;
  },

  createUser: async (userData: CreateUserPayload): Promise<User> => {
    const response = await api.post<User>('/users', userData);
    return response.data;
  },

  updateUser: async (id: number | string, userData: UpdateUserPayload): Promise<User> => {
    const response = await api.patch<User>(`/users/id/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number | string): Promise<{ mensagem: string }> => {
    const response = await api.delete<{ mensagem: string }>(`/users/id/${id}`);
    return response.data;
  },

  activateUser: async (id: number | string): Promise<{ mensagem: string; user: User }> => {
    const response = await api.patch<{ mensagem: string; user: User }>(`/users/id/${id}/ativar`);
    return response.data;
  },
};
