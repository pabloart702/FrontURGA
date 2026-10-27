import { useNavigate, useLocation } from 'react-router-dom';
import { UNIDADES_POLICIAIS } from '../../../constants/unidades';
import { useAuth } from '../../../hooks/useAuth';
import { useApoiosList } from '../hooks/useApoiosList';
import { ApoiosListView } from './ApoiosListView';
import type { Form, ApoiosLocationState } from '../types/apoios.types';

export function ApoiosContainer() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as ApoiosLocationState | null;
  const initialTab = locationState?.returnTab || 'agenda';

  const { user } = useAuth();
  const {
    forms,
    activeTab,
    departamento,
    page,
    totalPages,
    loading,
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
      activeTab={activeTab}
      departamento={departamento}
      departamentos={UNIDADES_POLICIAIS}
      page={page}
      totalPages={totalPages}
      userRole={user?.role}
      onTabChange={handleTabChange}
      onDepartamentoChange={handleDepartamentoChange}
      onPageChange={handlePageChange}
      onNewSolicitacao={handleNewSolicitacao}
      onSelectForm={handleSelectForm}
    />
  );
}
