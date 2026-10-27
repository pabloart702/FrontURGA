import type { User } from '../../../types';

export type { User };

export interface UsersListResponse {
  data: User[];
  totalPages: number;
  currentPage: number;
}

export interface UserFormData {
  nome: string;
  email: string;
  password?: string;
  cpf: string;
  matricula: string;
  cargo: string;
  departamento: string;
  status: string;
  fotoPerfil?: string;
}

export interface UsuarioFeedbackMessage {
  type: 'success' | 'error' | '';
  text: string;
}

export type CreateUserPayload = Omit<User, 'id' | 'status'> & { password?: string };
export type UpdateUserPayload = Partial<User> & { password?: string };
