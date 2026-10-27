import api from '../../../api/axios';
import type { User } from '../../../types';
import type { ProfileUpdatePayload } from '../types/perfil.types';

export const perfilApi = {
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/users/perfil');
    return response.data;
  },

  updateProfile: async (payload: ProfileUpdatePayload): Promise<User> => {
    const response = await api.patch<User>('/users/perfil', payload);
    return response.data;
  },

  updateUserProfile: async (id: string, payload: ProfileUpdatePayload): Promise<User> => {
    const response = await api.patch<User>(`/users/id/${id}`, payload);
    return response.data;
  },

  updateProfilePicture: async (file: File): Promise<{ mensagem: string; user: User }> => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    const response = await api.patch<{ mensagem: string; user: User }>(
      '/users/profile-picture',
      formData,
    );
    return response.data;
  },

  deleteProfilePicture: async (): Promise<{ mensagem: string; user: User }> => {
    const response = await api.delete<{ mensagem: string; user: User }>(
      '/users/profile-picture',
    );
    return response.data;
  },
};
