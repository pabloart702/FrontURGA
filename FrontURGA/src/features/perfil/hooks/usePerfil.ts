import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { getApiErrorMessage } from '../../../utils/errorMessages';
import { logger } from '../../../utils/logger';
import { perfilApi } from '../api/perfilApi';
import type { ProfileFormData, ProfileMessage, ProfileUpdatePayload } from '../types/perfil.types';
import { validateProfileImage } from '../utils/imageValidation';

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState<string>('');
  const [message, setMessage] = useState<ProfileMessage>({ type: '', text: '' });

  const canEditPrivilegedFields = user?.role !== 'Usuário';

  useEffect(() => {
    let ignore = false;

    async function load() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
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
      } catch (error) {
        if (ignore) return;
        logger.error('Erro ao carregar perfil:', error);
        setMessage({ type: 'error', text: 'Erro ao carregar as informações do perfil.' });
      } finally {
        if (!ignore) {
          setLoading(false);
        }
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
    setSaving(true);
    setMessage({ type: '', text: '' });

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

      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      // Limpar campo de nova senha após salvar com sucesso
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (error: unknown) {
      logger.error('Erro ao atualizar perfil:', error);
      const errorMsg = getApiErrorMessage(error, 'Erro ao atualizar o perfil. Tente novamente.');
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = await validateProfileImage(file);
    if (!validation.valid) {
      setMessage({ type: 'error', text: validation.error || 'Arquivo de imagem inválido.' });
      e.target.value = '';
      return;
    }

    setUploadingImage(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await perfilApi.updateProfilePicture(file);
      setFotoPerfil(response.user.fotoPerfil || '');
      setMessage({
        type: 'success',
        text: response.mensagem || 'Foto de perfil atualizada com sucesso!',
      });
      e.target.value = '';
    } catch (error: unknown) {
      logger.error('Erro ao atualizar foto de perfil:', error);
      const errorMsg = getApiErrorMessage(error, 'Erro ao atualizar a foto de perfil.');
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!window.confirm('Tem certeza que deseja remover sua foto de perfil?')) return;

    setUploadingImage(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await perfilApi.deleteProfilePicture();
      setFotoPerfil('');
      setMessage({
        type: 'success',
        text: response.mensagem || 'Foto de perfil removida com sucesso!',
      });
    } catch (error: unknown) {
      logger.error('Erro ao remover foto de perfil:', error);
      const errorMsg = getApiErrorMessage(error, 'Erro ao remover a foto de perfil.');
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setUploadingImage(false);
    }
  };

  return {
    formData,
    handleChange,
    loading,
    saving,
    uploadingImage,
    fotoPerfil,
    message,
    canEditPrivilegedFields,
    handleSubmit,
    handleImageUpload,
    handleRemoveImage,
  };
}
