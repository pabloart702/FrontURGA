import api from '../../../utils/httpClient';
import type { Form } from '../../../types';
import type {
  GetFormsParams,
  CreateFormPayload,
  UpdateFormPayload,
  PaginatedFormsResponse,
} from '../types/apoios.types';

export const apoiosApi = {
  getForms: async (params?: GetFormsParams): Promise<Form[] | PaginatedFormsResponse> => {
    const response = await api.get<Form[] | PaginatedFormsResponse>('/forms', { params });
    return response.data;
  },

  getFormById: async (id: number | string): Promise<Form> => {
    const response = await api.get<Form | { form?: Form; data?: Form }>(`/forms/${id}`);
    const data = response.data;
    if ('form' in data && data.form) {
      return data.form;
    }
    if ('data' in data && data.data && !Array.isArray(data.data)) {
      return data.data;
    }
    return data as Form;
  },

  createForm: async (formData: CreateFormPayload): Promise<Form> => {
    const response = await api.post<Form>('/forms', formData);
    return response.data;
  },

  updateForm: async (id: number | string, formData: UpdateFormPayload): Promise<Form> => {
    const response = await api.patch<Form>(`/forms/${id}`, formData);
    return response.data;
  },

  updateStatus: async (id: number | string, status: string): Promise<Form> => {
    const response = await api.patch<Form>(`/forms/${id}`, { status });
    return response.data;
  },

  deleteForm: async (id: number | string): Promise<{ mensagem: string }> => {
    const response = await api.delete<{ mensagem: string }>(`/forms/${id}`);
    return response.data;
  },
};
