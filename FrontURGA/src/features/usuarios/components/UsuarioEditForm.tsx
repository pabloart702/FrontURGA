import { User as UserIcon, ArrowLeft, Trash2, Save, UserCheck } from 'lucide-react';
import type { UserFormData, UsuarioFeedbackMessage } from '../types/usuarios.types';
import { SecureImage } from '../../../components/SecureImage';
import './UsuarioEdit.css';

interface UsuarioEditFormProps {
  formData: UserFormData;
  loading: boolean;
  saving: boolean;
  message: UsuarioFeedbackMessage;
  cargos: string[];
  departamentos: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDeactivate: () => void;
  onActivate: () => void;
  onBack: () => void;
}

export function UsuarioEditForm({
  formData,
  loading,
  saving,
  message,
  cargos,
  departamentos,
  onChange,
  onSubmit,
  onDeactivate,
  onActivate,
  onBack,
}: UsuarioEditFormProps) {
  if (loading) {
    return (
      <div className="perfil-card" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#71717a', margin: 0 }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="perfil-card">
      <div className="perfil-header">
        <button
          type="button"
          className="back-btn"
          onClick={onBack}
          title="Voltar"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="header-title">
          <div className="profile-picture-container">
            {formData.fotoPerfil ? (
              <SecureImage
                src={`/uploads/profiles/${formData.fotoPerfil}`}
                alt="Profile"
                className="profile-picture"
                zoomable={true}
                fallback={
                  <div className="usuario-avatar-placeholder">
                    {formData.nome ? (
                      formData.nome.charAt(0).toUpperCase()
                    ) : (
                      <UserIcon size={24} className="logo-icon" />
                    )}
                  </div>
                }
              />
            ) : (
              <div className="usuario-avatar-placeholder">
                {formData.nome ? (
                  formData.nome.charAt(0).toUpperCase()
                ) : (
                  <UserIcon size={24} className="logo-icon" />
                )}
              </div>
            )}
          </div>
          <h2>Editar Usuário</h2>
        </div>
      </div>

      {message.text && (
        <div className={`message-banner ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={onSubmit} className="perfil-form">
        <div className="form-grid">
          <div className="input-group">
            <label htmlFor="user-nome">Nome Completo</label>
            <input
              id="user-nome"
              type="text"
              name="nome"
              value={formData.nome}
              onChange={onChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="user-email">E-mail</label>
            <input
              id="user-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="user-cpf">CPF</label>
            <input
              id="user-cpf"
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={onChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="user-matricula">Matrícula</label>
            <input
              id="user-matricula"
              type="text"
              name="matricula"
              value={formData.matricula}
              onChange={onChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="user-departamento">Departamento</label>
            <input
              id="user-departamento"
              type="text"
              name="departamento"
              value={formData.departamento}
              onChange={onChange}
              required
              list="departamentos-list-usuario"
              placeholder="Ex: URGA"
            />
            <datalist id="departamentos-list-usuario">
              {departamentos.map((dept, idx) => (
                <option key={`${dept}-${idx}`} value={dept} />
              ))}
            </datalist>
          </div>

          <div className="input-group">
            <label htmlFor="user-cargo">Cargo</label>
            <select
              id="user-cargo"
              name="cargo"
              value={formData.cargo}
              onChange={onChange}
              required
            >
              <option value="">Selecione um cargo</option>
              {cargos.map((cargo) => (
                <option key={cargo} value={cargo}>
                  {cargo}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="user-status">Status</label>
            <select
              id="user-status"
              name="status"
              value={formData.status}
              onChange={onChange}
              required
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="user-password">Nova Senha</label>
            <input
              id="user-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              placeholder="Deixe em branco para não alterar"
            />
          </div>
        </div>

        <div className="perfil-form-actions">
          {formData.status === 'Inativo' ? (
            <button
              type="button"
              className="btn-deactivate btn-activate"
              onClick={onActivate}
              disabled={saving}
            >
              <UserCheck size={18} />
              <span>Ativar Usuário</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn-deactivate"
              onClick={onDeactivate}
              disabled={saving}
            >
              <Trash2 size={18} />
              <span>Desativar Usuário</span>
            </button>
          )}

          <button type="submit" className="submit-btn" disabled={saving}>
            <Save size={20} />
            <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
