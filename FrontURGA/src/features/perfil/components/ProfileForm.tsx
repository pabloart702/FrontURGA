import type { ChangeEvent, FormEvent } from 'react';
import { Save } from 'lucide-react';
import { UNIDADES_POLICIAIS } from '../../../constants/unidades';
import type { ProfileFormData } from '../types/perfil.types';

interface ProfileFormProps {
  formData: ProfileFormData;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  canEditPrivilegedFields: boolean;
  saving: boolean;
  onSubmit: (e: FormEvent) => Promise<void>;
}

export function ProfileForm({
  formData,
  onChange,
  canEditPrivilegedFields,
  saving,
  onSubmit,
}: ProfileFormProps) {
  return (
    <form onSubmit={onSubmit} className="perfil-form">
      <div className="form-grid">
        <div className="input-group">
          <label htmlFor="perfil-nome">Nome Completo</label>
          <input
            id="perfil-nome"
            type="text"
            name="nome"
            value={formData.nome}
            onChange={onChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="perfil-email">Email</label>
          <input
            id="perfil-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="perfil-cargo">Cargo</label>
          <input
            id="perfil-cargo"
            type="text"
            name="cargo"
            value={formData.cargo}
            onChange={onChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="perfil-password">Nova Senha (opcional)</label>
          <input
            id="perfil-password"
            type="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            placeholder="Deixe em branco para não alterar"
          />
        </div>

        <div className="input-group">
          <label htmlFor="perfil-cpf">CPF</label>
          <input
            id="perfil-cpf"
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={onChange}
            disabled={!canEditPrivilegedFields}
          />
        </div>

        <div className="input-group">
          <label htmlFor="perfil-matricula">Matrícula</label>
          <input
            id="perfil-matricula"
            type="text"
            name="matricula"
            value={formData.matricula}
            onChange={onChange}
            disabled={!canEditPrivilegedFields}
          />
        </div>

        <div className="input-group">
          <label htmlFor="perfil-departamento">Departamento</label>
          <input
            id="perfil-departamento"
            type="text"
            name="departamento"
            value={formData.departamento}
            onChange={onChange}
            disabled={!canEditPrivilegedFields}
            list="departamentos-list-perfil"
            placeholder="Ex: URGA"
          />
          <datalist id="departamentos-list-perfil">
            {UNIDADES_POLICIAIS.map((dept, idx) => (
              <option key={`${dept}-${idx}`} value={dept} />
            ))}
          </datalist>
        </div>

        <div className="input-group">
          <label htmlFor="perfil-status">Status</label>
          <input
            id="perfil-status"
            type="text"
            name="status"
            value={formData.status}
            disabled
          />
        </div>
      </div>

      <div className="perfil-form-actions">
        <button type="submit" className="submit-btn" disabled={saving}>
          <Save size={20} />
          <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
        </button>
      </div>
    </form>
  );
}
