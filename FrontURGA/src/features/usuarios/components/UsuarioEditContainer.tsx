import { useParams, useNavigate } from 'react-router-dom';
import { UNIDADES_POLICIAIS } from '../../../constants/unidades';
import { useUsuarioEdit } from '../hooks/useUsuarioEdit';
import { UsuarioEditForm } from './UsuarioEditForm';

const CARGOS = ['Delegado', 'Agente', 'Escrivão'];

export function UsuarioEditContainer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    formData,
    loading,
    saving,
    message,
    handleChange,
    handleSubmit,
    handleDeactivate,
    handleActivate,
  } = useUsuarioEdit(id);

  const handleBack = () => {
    navigate('/usuarios');
  };

  return (
    <UsuarioEditForm
      formData={formData}
      loading={loading}
      saving={saving}
      message={message}
      cargos={CARGOS}
      departamentos={UNIDADES_POLICIAIS}
      onChange={handleChange}
      onSubmit={(e) => void handleSubmit(e)}
      onDeactivate={() => void handleDeactivate()}
      onActivate={() => void handleActivate()}
      onBack={handleBack}
    />
  );
}
