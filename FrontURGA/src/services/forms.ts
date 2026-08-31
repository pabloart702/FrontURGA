import api from '../api/axios';
import type { Form } from '../types';

export const formsService = {
  getForms: async (): Promise<Form[]> => {
    const response = await api.get<Form[]>('/forms');
    return response.data;
  },

  getFormById: async (id: number | string): Promise<Form> => {
    const response = await api.get<Form>(`/forms/${id}`);
    return response.data;
  },

  createForm: async (formData: Omit<Form, 'id' | 'status' | 'criador'>): Promise<Form> => {
    const response = await api.post<Form>('/forms', formData);
    return response.data;
  },

  updateForm: async (id: number | string, formData: Partial<Form>): Promise<Form> => {
    const response = await api.patch<Form>(`/forms/${id}`, formData);
    return response.data;
  },

  deleteForm: async (id: number | string): Promise<{ mensagem: string }> => {
    const response = await api.delete<{ mensagem: string }>(`/forms/${id}`);
    return response.data;
  },
};
