import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersService } from '../../services/users';
import type { User } from '../../types';
import { Users, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { UNIDADES_POLICIAIS } from '../../constants/unidades';
import { SecureImage } from '../../components/SecureImage';
import './UsuariosList.css';

export function UsuariosList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination and Filter state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [departamento, setDepartamento] = useState('');

  const navigate = useNavigate();

  // Departamentos disponíveis vindos do arquivo de constantes
  const departamentos = UNIDADES_POLICIAIS;

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await usersService.getUsers(page, searchTerm, departamento);
      if (result && Array.isArray(result.data)) {
        setUsers(result.data);
        setTotalPages(result.totalPages || 1);
      } else if (Array.isArray(result)) {
        setUsers(result);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Timeout para debounce da pesquisa
    const timeoutId = setTimeout(() => {
      loadUsers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [page, searchTerm, departamento]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset page on new search
  };

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartamento(e.target.value);
    setPage(1); // Reset page on new filter
  };

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
          <select value={departamento} onChange={handleDeptChange} className="filter-select">
            <option value="">Todos os Departamentos</option>
            {departamentos.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="search-group">
          <Search size={18} className="usuarios-icon" />
          <input
            type="text"
            placeholder="Pesquisar por nome, CPF ou matrícula..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      <div className="usuarios-list-card">
        {loading && users.length === 0 ? (
          <div className="loading-state">Carregando usuários...</div>
        ) : users.length === 0 ? (
          <div className="empty-state">Nenhum usuário encontrado.</div>
        ) : (
          <div className="usuarios-grid" style={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? "none" : "auto", transition: "opacity 0.2s ease" }}>
            {users.map(user => (
              <div 
                key={user.id} 
                className="usuario-card" 
                onClick={() => navigate(`/usuarios/${user.id}`)}
              >
                <div className="usuario-card-header">
                  {user.fotoPerfil ? (
                    <SecureImage 
                      src={`/uploads/profiles/${user.fotoPerfil}`} 
                      alt={user.nome} 
                      className="usuario-card-img" 
                      fallback={<div className="usuario-card-avatar-placeholder">{user.nome.charAt(0).toUpperCase()}</div>}
                    />
                  ) : (
                    <div className="usuario-card-avatar-placeholder">
                      {user.nome.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="usuario-card-body">
                  <h3 className="usuario-card-name" title={user.nome}>{user.nome}</h3>
                  <p className="usuario-card-role">{user.cargo || 'Sem Cargo'}</p>
                  
                  <div className="usuario-card-details">
                    {user.departamento && (
                      <span className="usuario-card-dept" title={user.departamento}>
                        {user.departamento}
                      </span>
                    )}
                  </div>
                  
                  <div className="usuario-card-footer">
                    <span className={`status-badge ${user.status?.toLowerCase() === 'ativo' ? 'status-active' : 'status-inactive'}`}>
                      {user.status || 'ATIVO'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            <ChevronLeft size={18} /> Anterior
          </button>

          <span className="pagination-info">
            Página {page} de {totalPages}
          </span>

          <button
            className="pagination-btn"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Próxima <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
