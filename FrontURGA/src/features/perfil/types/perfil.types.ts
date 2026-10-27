export interface ProfileFormData {
  nome: string;
  email: string;
  cargo: string;
  password: string;
  cpf: string;
  matricula: string;
  departamento: string;
  status: string;
}

export interface ProfileMessage {
  type: 'success' | 'error' | '';
  text: string;
}

export interface ProfileUpdatePayload {
  nome: string;
  email: string;
  cargo: string;
  cpf?: string;
  matricula?: string;
  departamento?: string;
  password?: string;
}
