import { useState, useEffect } from 'react';
import { apoiosApi } from '../api/apoiosApi';
import type { Form, TabStatus, GetFormsParams } from '../types/apoios.types';

interface UseApoiosListOptions {
  initialTab?: TabStatus;
}

export function useApoiosList({ initialTab = 'agenda' }: UseApoiosListOptions = {}) {
  const [forms, setForms] = useState<Form[]>([]);
  const [activeTab, setActiveTabState] = useState<TabStatus>(initialTab);
  const [departamento, setDepartamentoState] = useState('');
  const [page, setPageState] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const limit = 10;

  useEffect(() => {
    let isMounted = true;

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
        if (!isMounted) return;

        if (Array.isArray(data)) {
          setForms(data);
          setTotalPages(1);
        } else if (data && typeof data === 'object') {
          const list = data.forms || data.data || data.resultados || [];
          setForms(Array.isArray(list) ? list : []);
          setTotalPages(data.totalPages || 1);
        } else {
          setForms([]);
          setTotalPages(1);
        }
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        console.error('Erro ao carregar os formulários', err);
        setForms([]);
        setTotalPages(1);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeTab, departamento, page]);

  const handleTabChange = (tab: TabStatus) => {
    setLoading(true);
    setActiveTabState(tab);
    setPageState(1);
  };

  const handleDepartamentoChange = (dept: string) => {
    setLoading(true);
    setDepartamentoState(dept);
    setPageState(1);
  };

  const handlePageChange = (newPage: number) => {
    setLoading(true);
    setPageState(newPage);
  };

  return {
    forms,
    activeTab,
    departamento,
    page,
    totalPages,
    loading,
    handleTabChange,
    handleDepartamentoChange,
    handlePageChange,
  };
}
