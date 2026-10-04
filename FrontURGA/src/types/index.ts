export interface User {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  matricula: string;
  cargo: string;
  role: string;
  departamento: string;
  status: string;
  fotoPerfil?: string;
}

export interface Form {
  id: string;
  departamento: string;
  operacao: string;
  data_operacao?: string | null;
  numero_processo?: string | null;
  medida_cautelar: string;
  numero_cautelar?: string | null;
  resultados: string[];
  tipos_apreendidos: string[];
  descricao_operacao: string;
  valor_estimado: number;
  status: string;
  criador: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
}
