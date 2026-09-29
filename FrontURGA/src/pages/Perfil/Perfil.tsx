import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usersService } from '../../services/users';
import { User as UserIcon, Save, Camera, Trash2 } from 'lucide-react';
import { SecureImage } from '../../components/SecureImage';
import './Perfil.css';

export function Perfil() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cargo: '',
    password: '',
    cpf: '',
    matricula: '',
    departamento: '',
    status: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState<string>('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    async function loadProfile() {
      if (user?.id) {
        try {
          const userData = await usersService.getProfile();
          setFormData({
            nome: userData.nome || '',
            email: userData.email || '',
            cargo: userData.cargo || '',
            password: '',
            cpf: userData.cpf ? String(userData.cpf) : '',
            matricula: userData.matricula || '',
            departamento: userData.departamento || '',
            status: userData.status || ''
          });
          setFotoPerfil(userData.fotoPerfil || '');
        } catch (error) {
          console.error("Erro ao carregar perfil:", error);
          setMessage({ type: 'error', text: 'Erro ao carregar as informações do perfil.' });
        } finally {
          setLoading(false);
        }
      }
    }
    loadProfile();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const updateData: any = {
        nome: formData.nome,
        email: formData.email,
        cargo: formData.cargo,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await usersService.updateProfile(updateData);
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });

      // Limpar a senha após salvar
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);

      let errorMsg = 'Erro ao atualizar o perfil. Tente novamente.';

      if (error.response?.data?.errors) {
        // Erros de validação (express-validator)
        errorMsg = error.response.data.errors.map((err: any) => err.msg).join(' | ');
      } else if (error.response?.data?.message) {
        // Erros globais do backend
        errorMsg = error.response.data.message;
      }

      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const MAX_FILE_SIZE_MB = 5;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setMessage({ type: 'error', text: 'Formato inválido. Envie apenas JPEG, PNG ou WebP.' });
      e.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setMessage({ type: 'error', text: `A imagem deve ter no máximo ${MAX_FILE_SIZE_MB}MB.` });
      e.target.value = '';
      return;
    }

    const MAGIC_BYTES: Record<string, number[][]> = {
      'image/jpeg': [[0xFF, 0xD8, 0xFF]],
      'image/png': [[0x89, 0x50, 0x4E, 0x47]],
      'image/webp': [[0x52, 0x49, 0x46, 0x46]],
    };

    try {
      const buffer = await file.slice(0, 8).arrayBuffer();
      const bytes = Array.from(new Uint8Array(buffer));
      const expectedMagic = MAGIC_BYTES[file.type];

      const isValidMagic = expectedMagic.some(magic =>
        magic.every((byte, i) => bytes[i] === byte)
      );

      if (!isValidMagic) {
        setMessage({ type: 'error', text: 'Arquivo corrompido.' });
        e.target.value = '';
        return;
      }
    } catch (err) {
      console.error("Erro ao ler arquivo:", err);
      setMessage({ type: 'error', text: 'Erro ao processar o arquivo.' });
      e.target.value = '';
      return;
    }

    setUploadingImage(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await usersService.updateProfilePicture(file);
      setFotoPerfil(response.user.fotoPerfil || '');
      setMessage({ type: 'success', text: response.mensagem || 'Foto de perfil atualizada com sucesso!' });
      e.target.value = '';
    } catch (error: any) {
      console.error("Erro ao atualizar foto de perfil:", error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erro ao atualizar a foto de perfil.' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!window.confirm('Tem certeza que deseja remover sua foto de perfil?')) return;

    setUploadingImage(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await usersService.deleteProfilePicture();
      setFotoPerfil('');
      setMessage({ type: 'success', text: response.mensagem || 'Foto de perfil removida com sucesso!' });
    } catch (error: any) {
      console.error("Erro ao remover foto de perfil:", error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erro ao remover a foto de perfil.' });
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return <div className="perfil-container"><p>Carregando...</p></div>;
  }

  return (
    <div className="page-container">
      <div className="page-glass-card">
        <div className="perfil-header">
          <div className="header-title">
            <div className="profile-picture-container">
              {fotoPerfil ? (
                <SecureImage
                  src={`/uploads/profiles/${fotoPerfil}`}
                  alt="Profile"
                  className="profile-picture"
                  zoomable={true}
                  fallback={<div className="usuario-avatar-placeholder">{formData.nome ? formData.nome.charAt(0).toUpperCase() : <UserIcon size={24} className="logo-icon" />}</div>}
                />
              ) : (
                <div className="usuario-avatar-placeholder">
                  {formData.nome ? formData.nome.charAt(0).toUpperCase() : <UserIcon size={24} className="logo-icon" />}
                </div>
              )}
              <label className="upload-btn" title="Alterar foto">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  style={{ display: 'none' }}
                />
                <Camera size={14} />
              </label>

              {fotoPerfil && (
                <button
                  type="button"
                  className="remove-photo-btn"
                  title="Remover foto"
                  onClick={handleRemoveImage}
                  disabled={uploadingImage}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <h2>Meu Perfil</h2>
          </div>
        </div>

        {message.text && (
          <div className={`message-banner ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="perfil-form">
          <div className="form-grid">
            <div className="input-group">
              <label>Nome Completo</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Cargo</label>
              <input
                type="text"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Nova Senha (opcional)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Deixe em branco para não alterar"
              />
            </div>

            <div className="input-group">
              <label>CPF</label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                disabled
              />
            </div>

            <div className="input-group">
              <label>Matrícula</label>
              <input
                type="text"
                name="matricula"
                value={formData.matricula}
                disabled
              />
            </div>

            <div className="input-group">
              <label>Departamento</label>
              <input
                type="text"
                name="departamento"
                value={formData.departamento}
                disabled
              />
            </div>

            <div className="input-group">
              <label>Status</label>
              <input
                type="text"
                name="status"
                value={formData.status}
                disabled
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
            <button type="submit" className="submit-btn" disabled={saving}>
              <Save size={20} />
              <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
