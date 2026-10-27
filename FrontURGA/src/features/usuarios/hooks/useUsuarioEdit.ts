import { useState, useEffect } from 'react';
import { usuariosApi } from '../api/usuariosApi';
import { getApiErrorMessage } from '../../../utils/errorMessages';
import {
  type AsyncState,
  asyncIdle,
  asyncLoading,
  asyncSuccess,
  asyncError,
} from '../../../types/async';
import type {
  User,
  UserFormData,
  UpdateUserPayload,
} from '../types/usuarios.types';

export function useUsuarioEdit(id?: string) {
  const [formData, setFormData] = useState<UserFormData>({
    nome: '',
    email: '',
    password: '',
    cpf: '',
    matricula: '',
    cargo: '',
    departamento: '',
    status: 'Ativo',
    fotoPerfil: '',
  });

  const [loadState, setLoadState] = useState<AsyncState<User>>(() =>
    id ? asyncLoading() : asyncIdle()
  );
  const [actionState, setActionState] = useState<AsyncState<string>>(asyncIdle());

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    usuariosApi
      .getUserById(id)
      .then((user) => {
        if (isMounted) {
          setFormData({
            nome: user.nome || '',
            email: user.email || '',
            password: '',
            cpf: user.cpf || '',
            matricula: user.matricula || '',
            cargo: user.cargo || '',
            departamento: user.departamento || '',
            status: user.status || 'Ativo',
            fotoPerfil: user.fotoPerfil || '',
          });
          setLoadState(asyncSuccess(user));
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          console.error('Erro ao carregar as informações do usuário:', error);
          const errorMsg = getApiErrorMessage(
            error,
            'Erro ao carregar as informações do usuário.'
          );
          setLoadState(asyncError(errorMsg));
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setActionState(asyncLoading());

    try {
      const updateData: UpdateUserPayload = {
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        matricula: formData.matricula,
        cargo: formData.cargo,
        departamento: formData.departamento,
        status: formData.status,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await usuariosApi.updateUser(id, updateData);
      setActionState(asyncSuccess('Usuário atualizado com sucesso!'));
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (error: unknown) {
      console.error('Erro ao atualizar usuário:', error);
      const errorMsg = getApiErrorMessage(error, 'Erro ao atualizar o usuário. Tente novamente.');
      setActionState(asyncError(errorMsg));
    }
  };

  const handleDeactivate = async () => {
    if (!id) return;
    if (!window.confirm('Tem certeza que deseja desativar este usuário?')) return;

    setActionState(asyncLoading());
    try {
      await usuariosApi.deleteUser(id);
      setActionState(asyncSuccess('Usuário desativado com sucesso!'));
      setFormData((prev) => ({ ...prev, status: 'Inativo' }));
    } catch (error: unknown) {
      console.error('Erro ao desativar usuário:', error);
      const errorMsg = getApiErrorMessage(error, 'Erro ao desativar usuário.');
      setActionState(asyncError(errorMsg));
    }
  };

  const handleActivate = async () => {
    if (!id) return;
    if (!window.confirm('Tem certeza que deseja ativar este usuário?')) return;

    setActionState(asyncLoading());
    try {
      await usuariosApi.activateUser(id);
      setActionState(asyncSuccess('Usuário ativado com sucesso!'));
      setFormData((prev) => ({ ...prev, status: 'Ativo' }));
    } catch (error: unknown) {
      console.error('Erro ao ativar usuário:', error);
      const errorMsg = getApiErrorMessage(error, 'Erro ao ativar usuário.');
      setActionState(asyncError(errorMsg));
    }
  };

  return {
    formData,
    loadState,
    actionState,
    loading: loadState.status === 'loading',
    saving: actionState.status === 'loading',
    message:
      actionState.status === 'success'
        ? { type: 'success', text: actionState.data }
        : actionState.status === 'error'
          ? { type: 'error', text: actionState.message }
          : loadState.status === 'error'
            ? { type: 'error', text: loadState.message }
            : { type: '', text: '' },
    handleChange,
    handleSubmit,
    handleDeactivate,
    handleActivate,
  };
}
