import type { Form } from '../../../types';

export type { Form };

export type TabStatus = 'agenda' | 'pendente' | 'ciente' | 'realizado';

export interface GetFormsParams {
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  departamento?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedFormsResponse {
  forms?: Form[];
  data?: Form[];
  resultados?: Form[];
  totalPages?: number;
  currentPage?: number;
}

export type CreateFormPayload = Omit<Form, 'id' | 'status' | 'criador'>;
export type UpdateFormPayload = Partial<Form>;

export interface SolicitacaoFormData {
  departamento: string;
  operacao: string;
  data_operacao: string;
  numero_processo: string;
  medida_cautelar: string;
  numero_cautelar: string;
  descricao_operacao: string;
  valor_estimado: string;
}

export interface ToastFeedback {
  type: 'error' | 'success';
  text: string;
}

export interface ApoiosLocationState {
  returnTab?: TabStatus;
}
