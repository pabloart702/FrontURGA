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
  data_operacao: string;
  numero_processo: string;
  medida_cautelar: string;
  numero_cautelar: string;
  resultados: string[];
  tipos_apreendidos: string[];
  descricao_operacao: string;
  valor_estimado: number;
  status: string;
  criador: string;
}

export interface AuthResponse {
  token: string;
}
