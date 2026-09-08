import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usersService } from '../services/users';
import { User as UserIcon, Save, ArrowLeft } from 'lucide-react';
import './Perfil.css';

export function Perfil() {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  if (loading) {
    return <div className="perfil-container"><p>Carregando...</p></div>;
  }

  return (
    <div className="perfil-container">
      <div className="perfil-glass-card">
        <div className="perfil-header">
          <div className="header-title">
            <button type="button" className="back-btn" onClick={() => navigate('/dashboard')} title="Voltar">
              <ArrowLeft size={20} />
            </button>
            <div className="logo-circle">
              <UserIcon size={24} className="logo-icon" />
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
