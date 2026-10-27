import { useState, useEffect } from 'react';
import { apoiosApi } from '../api/apoiosApi';
import {
  type AsyncState,
  asyncIdle,
  asyncLoading,
  asyncSuccess,
  asyncError,
} from '../../../types/async';
import { getApiErrorMessage, isNetworkError } from '../../../utils/errorMessages';
import type { Form, ToastFeedback } from '../types/apoios.types';

export function useVisualizarPedido(id?: string) {
  const isInvalidFormat = Boolean(id && !/^[a-zA-Z0-9-]+$/.test(id));

  const [loadState, setLoadState] = useState<AsyncState<Form>>(() => {
    if (!id) return asyncIdle();
    if (isInvalidFormat) return asyncError('Formato de identificador inválido.');
    return asyncLoading();
  });

  const [toastMessage, setToastMessage] = useState<ToastFeedback | null>(null);

  useEffect(() => {
    if (!id || isInvalidFormat) return;

    let isMounted = true;
    apoiosApi
      .getFormById(id)
      .then((data) => {
        if (!isMounted) return;
        setLoadState(asyncSuccess(data));
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        console.error('Erro ao carregar os detalhes do pedido:', err);
        setLoadState(asyncError(getApiErrorMessage(err, 'Erro ao carregar os detalhes do pedido.')));
      });

    return () => {
      isMounted = false;
    };
  }, [id, isInvalidFormat]);

  const showToast = (type: 'error' | 'success', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (loadState.status !== 'success') return;
    const currentForm = loadState.data;
    if (!currentForm.id) return;

    if (newStatus === 'realizado' && currentForm.data_operacao) {
      let d: string | undefined;
      let m: string | undefined;
      let y: string | undefined;

      if (currentForm.data_operacao.includes('/')) {
        [d, m, y] = currentForm.data_operacao.split('/');
      } else if (currentForm.data_operacao.includes('-')) {
        const parts = currentForm.data_operacao.split('T')[0].split('-');
        if (parts[0].length === 4) {
          [y, m, d] = parts;
        } else {
          [d, m, y] = parts;
        }
      }

      if (d && m && y) {
        const opDate = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (opDate > today) {
          showToast('error', 'Não é possível marcar como "realizado" pois a operação ainda não ocorreu.');
          return;
        }
      }
    }

    try {
      await apoiosApi.updateStatus(currentForm.id, newStatus);
      showToast('success', 'Status atualizado com sucesso.');
      setLoadState(asyncSuccess({ ...currentForm, status: newStatus }));
    } catch (err: unknown) {
      if (isNetworkError(err)) {
        showToast('error', 'Erro de conexão com o servidor. Verifique sua rede.');
      } else {
        const message = getApiErrorMessage(err, 'Ocorreu um erro ao atualizar o status.');
        showToast('error', message);
      }
    }
  };

  const form = loadState.status === 'success' ? loadState.data : null;
  const loading = loadState.status === 'loading';
  const error = loadState.status === 'error' ? loadState.message : '';

  const handlePrint = () => {
    if (!form) return;
    const originalTitle = document.title;
    document.title = `Relatorio_URGA_${form.operacao.replace(/\s+/g, '_')}`;
    window.print();
    document.title = originalTitle;
  };

  return {
    loadState,
    form,
    loading,
    error,
    toastMessage,
    handleStatusChange,
    handlePrint,
  };
}
