import { useState, useEffect, useCallback } from 'react';
import { usuariosApi } from '../api/usuariosApi';
import type { User } from '../types/usuarios.types';

export function useUsuariosList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [departamento, setDepartamento] = useState('');

  const fetchUsers = useCallback(async (p: number, search: string, dept: string) => {
    setLoading(true);
    try {
      const result = await usuariosApi.getUsers(p, search, dept);
      if (result && Array.isArray(result.data)) {
        setUsers(result.data);
        setTotalPages(result.totalPages || 1);
      } else if (Array.isArray(result)) {
        setUsers(result as unknown as User[]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchUsers(page, searchTerm, departamento);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [page, searchTerm, departamento, fetchUsers]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleDeptChange = (value: string) => {
    setDepartamento(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return {
    users,
    loading,
    page,
    totalPages,
    searchTerm,
    departamento,
    handleSearchChange,
    handleDeptChange,
    handlePageChange,
  };
}
