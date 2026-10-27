import { Users, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import type { User } from '../types/usuarios.types';
import { UsuarioCard } from './UsuarioCard';
import './UsuariosList.css';

interface UsuariosListViewProps {
  users: User[];
  loading: boolean;
  page: number;
  totalPages: number;
  searchTerm: string;
  departamento: string;
  departamentos: string[];
  onSearchChange: (value: string) => void;
  onDeptChange: (value: string) => void;
  onPageChange: (newPage: number) => void;
  onSelectUser: (user: User) => void;
}

export function UsuariosListView({
  users,
  loading,
  page,
  totalPages,
  searchTerm,
  departamento,
  departamentos,
  onSearchChange,
  onDeptChange,
  onPageChange,
  onSelectUser,
}: UsuariosListViewProps) {
  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <div className="header-title">
          <Users size={28} className="header-icon" />
          <div>
            <h2>Gestão de Usuários</h2>
            <p>Gerencie os usuários do sistema</p>
          </div>
        </div>
      </div>

      <div className="usuarios-filters">
        <div className="filter-group">
          <Filter size={18} className="usuarios-icon" />
          <input
            type="text"
            list="filter-departamentos-list-usuarios"
            value={departamento}
            onChange={(e) => onDeptChange(e.target.value)}
            className="filter-select"
            placeholder="Todos os Departamentos"
            aria-label="Filtrar por departamento"
          />
          <datalist id="filter-departamentos-list-usuarios">
            {departamentos.map((dept, idx) => (
              <option key={`${dept}-${idx}`} value={dept} />
            ))}
          </datalist>
        </div>

        <div className="search-group">
          <Search size={18} className="usuarios-icon" />
          <input
            type="text"
            placeholder="Pesquisar por nome, CPF ou matrícula..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
            aria-label="Pesquisar usuários"
          />
        </div>
      </div>

      <div className="usuarios-list-card">
        {loading && users.length === 0 ? (
          <div className="loading-state">Carregando usuários...</div>
        ) : users.length === 0 ? (
          <div className="empty-state">Nenhum usuário encontrado.</div>
        ) : (
          <div
            className="usuarios-grid"
            style={{
              opacity: loading ? 0.6 : 1,
              pointerEvents: loading ? 'none' : 'auto',
              transition: 'opacity 0.2s ease',
            }}
          >
            {users.map((user) => (
              <UsuarioCard key={user.id} user={user} onClick={onSelectUser} />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            className="pagination-btn"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft size={18} /> Anterior
          </button>

          <span className="pagination-info">
            Página {page} de {totalPages}
          </span>

          <button
            type="button"
            className="pagination-btn"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Próxima <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
