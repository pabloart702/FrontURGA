import { CofreAnimado } from '../../../components/CofreAnimado';

/**
 * Painel institucional esquerdo (apresentação visual e identidade de marca).
 */
export function LoginBrandPanel() {
  return (
    <div className="login-left-panel">
      <div className="dotted-pattern-overlay" aria-hidden="true" />

      {/* Cofre Wireframe como Background */}
      <div className="wireframe-safe-bg" aria-hidden="true">
        <CofreAnimado />
      </div>

      <div className="left-content">
        <div className="urga-brand">
          <h1 className="urga-title">URGA</h1>
        </div>
        <h2 className="urga-subtitle">
          Unidade de Recuperação e <br /> Gestão de Ativos
        </h2>
      </div>

      <div className="left-footer">
        <span>▶ Acesso restrito a usuários autorizados</span>
      </div>
    </div>
  );
}
