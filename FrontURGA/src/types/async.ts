/**
 * Estado de uma operação assíncrona modelado como Discriminated Union.
 * Substitui o uso combinado de `loading` + `error` + `data` em estados separados,
 * tornando impossíveis combinações inválidas (ex: carregando E com erro ao mesmo tempo).
 */
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };

export const asyncIdle = <T>(): AsyncState<T> => ({ status: 'idle' });
export const asyncLoading = <T>(): AsyncState<T> => ({ status: 'loading' });
export const asyncSuccess = <T>(data: T): AsyncState<T> => ({ status: 'success', data });
export const asyncError = <T>(message: string): AsyncState<T> => ({ status: 'error', message });
