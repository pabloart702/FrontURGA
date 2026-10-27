import { useState, useEffect } from 'react';
import { usuariosApi } from '../api/usuariosApi';
import { getApiErrorMessage } from '../../../utils/errorMessages';
import type {
  UserFormData,
  UsuarioFeedbackMessage,
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<UsuarioFeedbackMessage>({ type: '', text: '' });

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

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
          setLoading(false);
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          console.error('Erro ao carregar as informações do usuário:', error);
          setMessage({ type: 'error', text: 'Erro ao carregar as informações do usuário.' });
          setLoading(false);
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

    setSaving(true);
    setMessage({ type: '', text: '' });

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
      setMessage({ type: 'success', text: 'Usuário atualizado com sucesso!' });
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (error: unknown) {
      console.error('Erro ao atualizar usuário:', error);
      const errorMsg = getApiErrorMessage(error, 'Erro ao atualizar o usuário. Tente novamente.');
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!id) return;
    if (!window.confirm('Tem certeza que deseja desativar este usuário?')) return;

    setSaving(true);
    try {
      await usuariosApi.deleteUser(id);
      setMessage({ type: 'success', text: 'Usuário desativado com sucesso!' });
      setFormData((prev) => ({ ...prev, status: 'Inativo' }));
    } catch (error: unknown) {
      console.error('Erro ao desativar usuário:', error);
      const errorMsg = getApiErrorMessage(error, 'Erro ao desativar usuário.');
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async () => {
    if (!id) return;
    if (!window.confirm('Tem certeza que deseja ativar este usuário?')) return;

    setSaving(true);
    try {
      await usuariosApi.activateUser(id);
      setMessage({ type: 'success', text: 'Usuário ativado com sucesso!' });
      setFormData((prev) => ({ ...prev, status: 'Ativo' }));
    } catch (error: unknown) {
      console.error('Erro ao ativar usuário:', error);
      const errorMsg = getApiErrorMessage(error, 'Erro ao ativar usuário.');
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  return {
    formData,
    loading,
    saving,
    message,
    handleChange,
    handleSubmit,
    handleDeactivate,
    handleActivate,
  };
}
