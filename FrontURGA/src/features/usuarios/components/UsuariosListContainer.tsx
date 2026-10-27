import { useNavigate } from 'react-router-dom';
import { UNIDADES_POLICIAIS } from '../../../constants/unidades';
import { useUsuariosList } from '../hooks/useUsuariosList';
import { UsuariosListView } from './UsuariosListView';
import type { User } from '../types/usuarios.types';

export function UsuariosListContainer() {
  const navigate = useNavigate();
  const {
    users,
    loading,
    page,
    totalPages,
    searchTerm,
    departamento,
    handleSearchChange,
    handleDeptChange,
    handlePageChange,
  } = useUsuariosList();

  const handleSelectUser = (user: User) => {
    navigate(`/usuarios/${user.id}`);
  };

  return (
    <UsuariosListView
      users={users}
      loading={loading}
      page={page}
      totalPages={totalPages}
      searchTerm={searchTerm}
      departamento={departamento}
      departamentos={UNIDADES_POLICIAIS}
      onSearchChange={handleSearchChange}
      onDeptChange={handleDeptChange}
      onPageChange={handlePageChange}
      onSelectUser={handleSelectUser}
    />
  );
}
