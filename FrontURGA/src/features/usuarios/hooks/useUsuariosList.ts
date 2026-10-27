import { useState, useEffect, useRef } from 'react';
import { usuariosApi } from '../api/usuariosApi';
import {
  type AsyncState,
  asyncLoading,
  asyncSuccess,
  asyncError,
} from '../../../types/async';
import { getApiErrorMessage } from '../../../utils/errorMessages';
import type { User } from '../types/usuarios.types';

export interface UsuariosListData {
  users: User[];
  totalPages: number;
}

export function useUsuariosList() {
  const [listState, setListState] = useState<AsyncState<UsuariosListData>>(() => asyncLoading());
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [departamento, setDepartamento] = useState('');

  // Previne race conditions de requisições concorrentes em conexões instáveis
  const requestIdRef = useRef(0);

  useEffect(() => {
    let isMounted = true;
    const currentRequestId = ++requestIdRef.current;

    const timeoutId = setTimeout(() => {
      usuariosApi
        .getUsers(page, searchTerm, departamento)
        .then((result) => {
          if (!isMounted || currentRequestId !== requestIdRef.current) {
            return;
          }

          let list: User[] = [];
          let total = 1;

          if (result && Array.isArray(result.data)) {
            list = result.data;
            total = result.totalPages || 1;
          } else if (Array.isArray(result)) {
            list = result as unknown as User[];
            total = 1;
          }

          setTotalPages(total);
          setListState(asyncSuccess({ users: list, totalPages: total }));
        })
        .catch((error: unknown) => {
          if (!isMounted || currentRequestId !== requestIdRef.current) {
            return;
          }
          console.error('Erro ao carregar usuários:', error);
          setTotalPages(1);
          setListState(asyncError(getApiErrorMessage(error, 'Erro ao carregar a lista de usuários.')));
        });
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [page, searchTerm, departamento]);

  const handleSearchChange = (value: string) => {
    setListState(asyncLoading());
    setSearchTerm(value);
    setPage(1);
  };

  const handleDeptChange = (value: string) => {
    setListState(asyncLoading());
    setDepartamento(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setListState(asyncLoading());
    setPage(newPage);
  };

  const refetch = () => {
    setListState(asyncLoading());
    setPage((prev) => prev);
  };

  const users = listState.status === 'success' ? listState.data.users : [];
  const loading = listState.status === 'loading';
  const error = listState.status === 'error' ? listState.message : null;

  return {
    listState,
    users,
    loading,
    error,
    page,
    totalPages: listState.status === 'success' ? listState.data.totalPages : totalPages,
    searchTerm,
    departamento,
    refetch,
    handleSearchChange,
    handleDeptChange,
    handlePageChange,
  };
}
