import { useNavigate } from 'react-router-dom';
import { UNIDADES_POLICIAIS } from '../../../constants/unidades';
import { BENS } from '../../../constants/bens';
import { useAuth } from '../../../hooks/useAuth';
import { useSolicitacaoApoio } from '../hooks/useSolicitacaoApoio';
import { SolicitacaoForm } from './SolicitacaoForm';

export function SolicitacaoContainer() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    formData,
    resultados,
    tiposApreendidos,
    outrosTipos,
    loading,
    error,
    handleInputChange,
    setDateFromPicker,
    setOutrosTipos,
    toggleResultado,
    toggleTipoApreendido,
    handleSubmit,
  } = useSolicitacaoApoio({ user });

  const handleBack = () => {
    navigate('/apoios');
  };

  return (
    <SolicitacaoForm
      formData={formData}
      resultados={resultados}
      tiposApreendidos={tiposApreendidos}
      outrosTipos={outrosTipos}
      loading={loading}
      error={error}
      userRole={user?.role}
      unidades={UNIDADES_POLICIAIS}
      bens={BENS}
      onInputChange={handleInputChange}
      onDatePickerChange={setDateFromPicker}
      onOutrosTiposChange={setOutrosTipos}
      onToggleResultado={toggleResultado}
      onToggleTipoApreendido={toggleTipoApreendido}
      onSubmit={(e) => void handleSubmit(e)}
      onBack={handleBack}
    />
  );
}
