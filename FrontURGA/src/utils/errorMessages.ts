import { isAxiosError } from 'axios';

interface ApiValidationError {
  msg: string;
}

interface ApiErrorBody {
  message?: string;
  errors?: ApiValidationError[];
}

const ERROR_MESSAGES: Record<number, string> = {
  400: 'Dados inválidos. Verifique os campos e tente novamente.',
  401: 'Sessão expirada ou credenciais inválidas. Faça login novamente.',
  403: 'Você não tem permissão para realizar esta ação.',
  404: 'Recurso não encontrado.',
  422: 'Não foi possível processar a requisição com os dados fornecidos.',
  429: 'Muitas tentativas. Aguarde um momento e tente novamente.',
  500: 'Erro interno no servidor. Contate o administrador do sistema.',
  502: 'Serviço temporariamente indisponível (Bad Gateway).',
  503: 'Serviço temporariamente indisponível.',
};

/**
 * Retorna uma mensagem de erro genérica e segura baseada no status HTTP.
 * Evita o vazamento de stack traces ou detalhes sensíveis da API.
 */
export function getSafeErrorMessage(status?: number, fallback?: string): string {
  if (status && ERROR_MESSAGES[status]) {
    return ERROR_MESSAGES[status];
  }
  return fallback || 'Ocorreu um erro inesperado. Tente novamente.';
}

/** Extrai o status HTTP de um erro desconhecido (`catch (err: unknown)`). */
export function getHttpStatus(error: unknown): number | undefined {
  return isAxiosError(error) ? error.response?.status : undefined;
}

/** Indica se o erro é falha de rede (API offline / sem conexão). */
export function isNetworkError(error: unknown): boolean {
  return isAxiosError(error) && (error.code === 'ERR_NETWORK' || error.message === 'Network Error');
}

/**
 * Extrai a mensagem de erro retornada pelo backend (validação do express-validator ou mensagem global). Retorna `fallback` quando não houver mensagem utilizável.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError<ApiErrorBody>(error)) {
    return fallback;
  }
  const body = error.response?.data;
  if (body?.errors?.length) {
    return body.errors.map((err) => err.msg).join(' | ');
  }
  if (body?.message) {
    return body.message;
  }
  return fallback;
}
