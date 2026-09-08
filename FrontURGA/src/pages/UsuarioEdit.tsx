import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersService } from '../services/users';
import { User as UserIcon, ArrowLeft, Trash2, Save, UserCheck } from 'lucide-react';
import { UNIDADES_POLICIAIS } from '../constants/unidades';
import './Perfil.css';

export function UsuarioEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    cpf: '',
    matricula: '',
    cargo: '',
    departamento: '',
    status: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const cargos = ['Delegado', 'Agente', 'Escrivão'];
  const departamentos = UNIDADES_POLICIAIS;

  useEffect(() => {
    async function loadUser() {
      if (!id) return;
      try {
        const user = await usersService.getUserById(id);
        setFormData({
          nome: user.nome || '',
          email: user.email || '',
          password: '',
          cpf: user.cpf || '',
          matricula: user.matricula || '',
          cargo: user.cargo || '',
          departamento: user.departamento || '',
          status: user.status || 'Ativo'
        });
      } catch (error) {
        console.error("Erro ao carregar as informações do usuário:", error);
        setMessage({ type: 'error', text: 'Erro ao carregar as informações do usuário.' });
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const updateData: Partial<User> & { password?: string } = {
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        matricula: formData.matricula,
        cargo: formData.cargo,
        departamento: formData.departamento,
        status: formData.status
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await usersService.updateUser(id, updateData);
      setMessage({ type: 'success', text: 'Usuário atualizado com sucesso!' });
      
      // Limpar a senha após salvar
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (error: any) {
      console.error("Erro ao atualizar usuário:", error);
      let errorMsg = 'Erro ao atualizar o usuário. Tente novamente.';
      
      if (error.response?.data?.errors) {
        errorMsg = error.response.data.errors.map((err: any) => err.msg).join(' | ');
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }

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
      await usersService.deleteUser(id);
      setMessage({ type: 'success', text: 'Usuário desativado com sucesso!' });
      setFormData(prev => ({ ...prev, status: 'Inativo' }));
    } catch (error: any) {
      console.error("Erro ao desativar usuário:", error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erro ao desativar usuário.' });
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async () => {
    if (!id) return;
    if (!window.confirm('Tem certeza que deseja ativar este usuário?')) return;
    
    setSaving(true);
    try {
      await usersService.activateUser(id);
      setMessage({ type: 'success', text: 'Usuário ativado com sucesso!' });
      setFormData(prev => ({ ...prev, status: 'Ativo' }));
    } catch (error: any) {
      console.error("Erro ao ativar usuário:", error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erro ao ativar usuário.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="perfil-container"><p>Carregando...</p></div>;
  }

  return (
    <div className="perfil-container">
      <div className="perfil-glass-card">
        <div className="perfil-header">
          <div className="header-title">
            <button type="button" className="back-btn" onClick={() => navigate('/usuarios')} title="Voltar">
              <ArrowLeft size={20} />
            </button>
            <div className="logo-circle">
              <UserIcon size={24} className="logo-icon" />
            </div>
            <h2>Editar Usuário</h2>
          </div>
          {formData.status?.toLowerCase() === 'inativo' ? (
            <button 
              type="button"
              className="btn-deactivate"
              onClick={handleActivate}
              disabled={saving}
              style={{ backgroundColor: '#10b981', color: 'white', border: 'none' }}
            >
              <UserCheck size={18} />
              Ativar Usuário
            </button>
          ) : (
            <button 
              type="button"
              className="btn-deactivate"
              onClick={handleDeactivate}
              disabled={saving}
            >
              <Trash2 size={18} />
              Desativar Usuário
            </button>
          )}
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
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>CPF</label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Matrícula</label>
              <input
                type="text"
                name="matricula"
                value={formData.matricula}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Departamento</label>
              <select
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um departamento</option>
                {departamentos.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Cargo</label>
              <select
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um cargo</option>
                {cargos.map(cargo => (
                  <option key={cargo} value={cargo}>{cargo}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>

            <div className="input-group">
              <label>Nova Senha</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Deixe em branco para não alterar"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button type="submit" className="submit-btn" disabled={saving}>
              <Save size={20} />
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
