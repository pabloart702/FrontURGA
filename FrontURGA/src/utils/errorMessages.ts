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
