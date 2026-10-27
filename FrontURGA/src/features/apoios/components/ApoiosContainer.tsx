import { useNavigate, useLocation } from 'react-router-dom';
import { UNIDADES_POLICIAIS } from '../../../constants/unidades';
import { useAuth } from '../../../hooks/useAuth';
import { usePermissions } from '../../../hooks/usePermissions';
import { useApoiosList } from '../hooks/useApoiosList';
import { ApoiosListView } from './ApoiosListView';
import type { Form, ApoiosLocationState } from '../types/apoios.types';

export function ApoiosContainer() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as ApoiosLocationState | null;
  const initialTab = locationState?.returnTab || 'agenda';

  const { user } = useAuth();
  const { canEditPrivilegedFields } = usePermissions();
  const {
    forms,
    activeTab,
    departamento,
    page,
    totalPages,
    loading,
    error,
    handleTabChange,
    handleDepartamentoChange,
    handlePageChange,
  } = useApoiosList({ initialTab });

  const handleSelectForm = (form: Form) => {
    navigate(`/visualizar-pedido/${form.id}`, { state: { returnTab: activeTab } });
  };

  const handleNewSolicitacao = () => {
    navigate('/solicitacao-apoio');
  };

  return (
    <ApoiosListView
      forms={forms}
      loading={loading}
      error={error}
      activeTab={activeTab}
      departamento={departamento}
      departamentos={UNIDADES_POLICIAIS}
      page={page}
      totalPages={totalPages}
      userRole={user?.role}
      canFilterDepartamento={canEditPrivilegedFields}
      onTabChange={handleTabChange}
      onDepartamentoChange={handleDepartamentoChange}
      onPageChange={handlePageChange}
      onNewSolicitacao={handleNewSolicitacao}
      onSelectForm={handleSelectForm}
    />
  );
}
