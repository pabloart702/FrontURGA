import type { User } from '../types/usuarios.types';
import { SecureImage } from '../../../components/SecureImage';

interface UsuarioCardProps {
  user: User;
  onClick: (user: User) => void;
}

export function UsuarioCard({ user, onClick }: UsuarioCardProps) {
  const initial = user.nome ? user.nome.charAt(0).toUpperCase() : '?';

  return (
    <div
      className="usuario-card"
      onClick={() => onClick(user)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(user);
        }
      }}
    >
      <div className="usuario-card-header">
        {user.fotoPerfil ? (
          <SecureImage
            src={`/uploads/profiles/${user.fotoPerfil}`}
            alt={user.nome}
            className="usuario-card-img"
            fallback={<div className="usuario-card-avatar-placeholder">{initial}</div>}
          />
        ) : (
          <div className="usuario-card-avatar-placeholder">{initial}</div>
        )}
      </div>

      <div className="usuario-card-body">
        <h3 className="usuario-card-name" title={user.nome}>
          {user.nome}
        </h3>
        <p className="usuario-card-role">{user.cargo || 'Sem Cargo'}</p>

        <div className="usuario-card-details">
          {user.departamento && (
            <span className="usuario-card-dept" title={user.departamento}>
              {user.departamento}
            </span>
          )}
        </div>

        <div className="usuario-card-footer">
          <span
            className={`status-badge ${
              user.status === 'Ativo' ? 'status-active' : 'status-inactive'
            }`}
          >
            {user.status || 'Ativo'}
          </span>
        </div>
      </div>
    </div>
  );
}
