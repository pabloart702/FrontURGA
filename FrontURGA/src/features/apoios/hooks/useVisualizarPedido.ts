import { useState, useEffect } from 'react';
import { apoiosApi } from '../api/apoiosApi';
import { getApiErrorMessage, isNetworkError } from '../../../utils/errorMessages';
import type { Form, ToastFeedback } from '../types/apoios.types';

export function useVisualizarPedido(id?: string) {
  const isInvalidFormat = Boolean(id && !/^[a-zA-Z0-9-]+$/.test(id));
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(() => Boolean(id && !isInvalidFormat));
  const [error, setError] = useState(() => (isInvalidFormat ? 'Formato de identificador inválido.' : ''));
  const [toastMessage, setToastMessage] = useState<ToastFeedback | null>(null);

  useEffect(() => {
    if (!id || isInvalidFormat) return;

    let isMounted = true;
    apoiosApi
      .getFormById(id)
      .then((data) => {
        if (!isMounted) return;
        setForm(data);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        console.error('Erro ao carregar os detalhes do pedido:', err);
        setError('Erro ao carregar os detalhes do pedido.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
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
    if (!form || !form.id) return;

    if (newStatus === 'realizado' && form.data_operacao) {
      let d: string | undefined;
      let m: string | undefined;
      let y: string | undefined;

      if (form.data_operacao.includes('/')) {
        [d, m, y] = form.data_operacao.split('/');
      } else if (form.data_operacao.includes('-')) {
        const parts = form.data_operacao.split('T')[0].split('-');
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
      await apoiosApi.updateStatus(form.id, newStatus);
      showToast('success', 'Status atualizado com sucesso.');
      setForm((prev) => (prev ? { ...prev, status: newStatus } : null));
    } catch (err: unknown) {
      if (isNetworkError(err)) {
        showToast('error', 'Erro de conexão com o servidor. Verifique sua rede.');
      } else {
        const message = getApiErrorMessage(err, 'Ocorreu um erro ao atualizar o status.');
        showToast('error', message);
      }
    }
  };

  const handlePrint = () => {
    if (!form) return;
    const originalTitle = document.title;
    document.title = `Relatorio_URGA_${form.operacao.replace(/\s+/g, '_')}`;
    window.print();
    document.title = originalTitle;
  };

  return {
    form,
    loading,
    error,
    toastMessage,
    handleStatusChange,
    handlePrint,
  };
}
