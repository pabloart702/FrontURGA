import { useState, useEffect, useRef } from 'react';
import { apoiosApi } from '../api/apoiosApi';
import {
  type AsyncState,
  asyncLoading,
  asyncSuccess,
  asyncError,
} from '../../../types/async';
import { getApiErrorMessage } from '../../../utils/errorMessages';
import type { Form, TabStatus, GetFormsParams } from '../types/apoios.types';

export interface ApoiosListData {
  forms: Form[];
  totalPages: number;
}

interface UseApoiosListOptions {
  initialTab?: TabStatus;
}

export function useApoiosList({ initialTab = 'agenda' }: UseApoiosListOptions = {}) {
  const [listState, setListState] = useState<AsyncState<ApoiosListData>>(() => asyncLoading());
  const [activeTab, setActiveTabState] = useState<TabStatus>(initialTab);
  const [departamento, setDepartamentoState] = useState('');
  const [page, setPageState] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Previne race conditions de requisições concorrentes em conexões instáveis
  const requestIdRef = useRef(0);
  const limit = 10;

  useEffect(() => {
    let isMounted = true;
    const currentRequestId = ++requestIdRef.current;

    const params: GetFormsParams = {
      page,
      limit: activeTab === 'agenda' ? 100 : limit,
    };

    if (activeTab !== 'agenda') {
      params.status = activeTab;
    }

    if (departamento) {
      params.departamento = departamento;
    }

    // Regras estritas de ordenação por aba:
    // - Pendente: mais antigas/próximas primeiro (data_operacao asc)
    // - Agenda: ordem decrescente (data_operacao desc)
    // - Ciente: mais antigas/próximas primeiro (data_operacao asc)
    // - Realizado: mais recentemente concluídas primeiro (dataRealizado desc)
    if (activeTab === 'pendente') {
      params.sortBy = 'data_operacao';
      params.sortOrder = 'asc';
    } else if (activeTab === 'agenda') {
      params.sortBy = 'data_operacao';
      params.sortOrder = 'desc';
    } else if (activeTab === 'ciente') {
      params.sortBy = 'data_operacao';
      params.sortOrder = 'asc';
    } else if (activeTab === 'realizado') {
      params.sortBy = 'dataRealizado';
      params.sortOrder = 'desc';
    }

    apoiosApi
      .getForms(params)
      .then((data) => {
        if (!isMounted || currentRequestId !== requestIdRef.current) {
          return;
        }

        let list: Form[] = [];
        let total = 1;

        if (Array.isArray(data)) {
          list = data;
          total = 1;
        } else if (data && typeof data === 'object') {
          const rawList = data.forms || data.data || data.resultados || [];
          list = Array.isArray(rawList) ? rawList : [];
          total = data.totalPages || 1;
        }

        setTotalPages(total);
        setListState(asyncSuccess({ forms: list, totalPages: total }));
      })
      .catch((err: unknown) => {
        if (!isMounted || currentRequestId !== requestIdRef.current) {
          return;
        }
        console.error('Erro ao carregar os formulários', err);
        setTotalPages(1);
        setListState(asyncError(getApiErrorMessage(err, 'Erro ao carregar os formulários.')));
      });

    return () => {
      isMounted = false;
    };
  }, [activeTab, departamento, page]);

  const handleTabChange = (tab: TabStatus) => {
    setListState(asyncLoading());
    setActiveTabState(tab);
    setPageState(1);
  };

  const handleDepartamentoChange = (dept: string) => {
    setListState(asyncLoading());
    setDepartamentoState(dept);
    setPageState(1);
  };

  const handlePageChange = (newPage: number) => {
    setListState(asyncLoading());
    setPageState(newPage);
  };

  const refetch = () => {
    setListState(asyncLoading());
    setActiveTabState((prev) => prev);
  };

  const forms = listState.status === 'success' ? listState.data.forms : [];
  const loading = listState.status === 'loading';
  const error = listState.status === 'error' ? listState.message : null;

  return {
    listState,
    forms,
    activeTab,
    departamento,
    page,
    totalPages: listState.status === 'success' ? listState.data.totalPages : totalPages,
    loading,
    error,
    refetch,
    handleTabChange,
    handleDepartamentoChange,
    handlePageChange,
  };
}
