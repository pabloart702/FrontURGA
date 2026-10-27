import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { usePermissions } from '../../../hooks/usePermissions';
import { getApiErrorMessage } from '../../../utils/errorMessages';
import { logger } from '../../../utils/logger';
import { perfilApi } from '../api/perfilApi';
import {
  type AsyncState,
  asyncIdle,
  asyncLoading,
  asyncSuccess,
  asyncError,
} from '../../../types/async';
import type { ProfileFormData, ProfileMessage, ProfileUpdatePayload } from '../types/perfil.types';
import { validateProfileImage } from '../utils/imageValidation';
import type { User } from '../../../types';

const INITIAL_FORM: ProfileFormData = {
  nome: '',
  email: '',
  cargo: '',
  password: '',
  cpf: '',
  matricula: '',
  departamento: '',
  status: '',
};

export interface UsePerfilReturn {
  formData: ProfileFormData;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  loadState: AsyncState<User>;
  actionState: AsyncState<string>;
  loading: boolean;
  saving: boolean;
  uploadingImage: boolean;
  fotoPerfil: string;
  message: ProfileMessage;
  canEditPrivilegedFields: boolean;
  handleSubmit: (e: FormEvent) => Promise<void>;
  handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveImage: () => Promise<void>;
}

export function usePerfil(): UsePerfilReturn {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>(INITIAL_FORM);
  const [loadState, setLoadState] = useState<AsyncState<User>>(() =>
    user?.id ? asyncLoading() : asyncIdle()
  );
  const [actionState, setActionState] = useState<AsyncState<string>>(asyncIdle());
  const [fotoPerfil, setFotoPerfil] = useState<string>('');

  const { canEditPrivilegedFields } = usePermissions();

  useEffect(() => {
    let ignore = false;

    async function load() {
      if (!user?.id) {
        setLoadState(asyncIdle());
        return;
      }

      try {
        setLoadState(asyncLoading());
        const userData = await perfilApi.getProfile();
        if (ignore) return;
        setFormData({
          nome: userData.nome || '',
          email: userData.email || '',
          cargo: userData.cargo || '',
          password: '',
          cpf: userData.cpf ? String(userData.cpf) : '',
          matricula: userData.matricula || '',
          departamento: userData.departamento || '',
          status: userData.status || '',
        });
        setFotoPerfil(userData.fotoPerfil || '');
        setLoadState(asyncSuccess(userData));
      } catch (error) {
        if (ignore) return;
        logger.error('Erro ao carregar perfil:', error);
        setLoadState(asyncError('Erro ao carregar as informações do perfil.'));
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [user?.id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setActionState(asyncLoading());

    try {
      const updateData: ProfileUpdatePayload = {
        nome: formData.nome,
        email: formData.email,
        cargo: formData.cargo,
      };

      if (canEditPrivilegedFields) {
        updateData.cpf = formData.cpf;
        updateData.matricula = formData.matricula;
        updateData.departamento = formData.departamento;
      }

      if (formData.password) {
        updateData.password = formData.password;
      }

      if (canEditPrivilegedFields && user?.id) {
        await perfilApi.updateUserProfile(user.id, updateData);
      } else {
        await perfilApi.updateProfile(updateData);
      }

      setActionState(asyncSuccess('Perfil atualizado com sucesso!'));
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (error: unknown) {
      logger.error('Erro ao atualizar perfil:', error);
      const errorMsg = getApiErrorMessage(error, 'Erro ao atualizar o perfil. Tente novamente.');
      setActionState(asyncError(errorMsg));
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = await validateProfileImage(file);
    if (!validation.valid) {
      setActionState(asyncError(validation.error || 'Arquivo de imagem inválido.'));
      e.target.value = '';
      return;
    }

    setActionState(asyncLoading());

    try {
      const response = await perfilApi.updateProfilePicture(file);
      setFotoPerfil(response.user.fotoPerfil || '');
      setActionState(
        asyncSuccess(response.mensagem || 'Foto de perfil atualizada com sucesso!')
      );
      e.target.value = '';
    } catch (error: unknown) {
      logger.error('Erro ao atualizar foto de perfil:', error);
      const errorMsg = getApiErrorMessage(error, 'Erro ao atualizar a foto de perfil.');
      setActionState(asyncError(errorMsg));
    }
  };

  const handleRemoveImage = async () => {
    if (!window.confirm('Tem certeza que deseja remover sua foto de perfil?')) return;

    setActionState(asyncLoading());

    try {
      const response = await perfilApi.deleteProfilePicture();
      setFotoPerfil('');
      setActionState(
        asyncSuccess(response.mensagem || 'Foto de perfil removida com sucesso!')
      );
    } catch (error: unknown) {
      logger.error('Erro ao remover foto de perfil:', error);
      const errorMsg = getApiErrorMessage(error, 'Erro ao remover a foto de perfil.');
      setActionState(asyncError(errorMsg));
    }
  };

  const isActionLoading = actionState.status === 'loading';

  return {
    formData,
    handleChange,
    loadState,
    actionState,
    loading: loadState.status === 'loading',
    saving: isActionLoading,
    uploadingImage: isActionLoading,
    fotoPerfil,
    message:
      actionState.status === 'success'
        ? { type: 'success', text: actionState.data }
        : actionState.status === 'error'
          ? { type: 'error', text: actionState.message }
          : loadState.status === 'error'
            ? { type: 'error', text: loadState.message }
            : { type: '', text: '' },
    canEditPrivilegedFields,
    handleSubmit,
    handleImageUpload,
    handleRemoveImage,
  };
}
