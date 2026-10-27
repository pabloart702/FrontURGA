import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useVisualizarPedido } from '../hooks/useVisualizarPedido';
import { VisualizarPedidoView } from './VisualizarPedidoView';
import type { ApoiosLocationState } from '../types/apoios.types';

export function VisualizarPedidoContainer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as ApoiosLocationState | null;
  const returnTab = locationState?.returnTab || 'pendente';
  const { user } = useAuth();

  const {
    form,
    loading,
    error,
    toastMessage,
    handleStatusChange,
    handlePrint,
  } = useVisualizarPedido(id);

  const handleBack = () => {
    navigate('/apoios', { state: { returnTab } });
  };

  return (
    <VisualizarPedidoView
      form={form}
      loading={loading}
      error={error}
      toastMessage={toastMessage}
      userRole={user?.role}
      onStatusChange={(status) => void handleStatusChange(status)}
      onPrint={handlePrint}
      onBack={handleBack}
    />
  );
}
