import { useNavigate } from 'react-router-dom';
import { UNIDADES_POLICIAIS } from '../../../constants/unidades';
import { BENS } from '../../../constants/bens';
import { useAuth } from '../../../hooks/useAuth';
import { usePermissions } from '../../../hooks/usePermissions';
import { useSolicitacaoApoio } from '../hooks/useSolicitacaoApoio';
import { SolicitacaoForm } from './SolicitacaoForm';

export function SolicitacaoContainer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { canEditPrivilegedFields } = usePermissions();

  const {
    formData,
    resultados,
    tiposApreendidos,
    outrosTipos,
    submitState,
    semData,
    toggleSemData,
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
      submitState={submitState}
      userRole={user?.role}
      canChangeDepartamento={canEditPrivilegedFields}
      semData={semData}
      unidades={UNIDADES_POLICIAIS}
      bens={BENS}
      onInputChange={handleInputChange}
      onDatePickerChange={setDateFromPicker}
      onToggleSemData={toggleSemData}
      onOutrosTiposChange={setOutrosTipos}
      onToggleResultado={toggleResultado}
      onToggleTipoApreendido={toggleTipoApreendido}
      onSubmit={(e) => void handleSubmit(e)}
      onBack={handleBack}
    />
  );
}
