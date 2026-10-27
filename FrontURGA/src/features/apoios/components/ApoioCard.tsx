import type { Form, TabStatus } from '../types/apoios.types';

interface ApoioCardProps {
  form: Form;
  activeTab: TabStatus;
  onClick: (form: Form) => void;
}

export function ApoioCard({ form, activeTab, onClick }: ApoioCardProps) {
  const currentStatus = form.status || activeTab;

  return (
    <div
      onClick={() => onClick(form)}
      className="apoio-card"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(form);
        }
      }}
    >
      <div className="apoio-card-content">
        <div>
          <h3 className="apoio-card-title">{form.operacao}</h3>
          <div className="apoio-card-details">
            <div>
              <strong>Departamento:</strong> <span>{form.departamento}</span>
            </div>
            <div>
              <strong>Processo:</strong> <span>{form.numero_processo || 'Não informado'}</span>
            </div>
          </div>
        </div>

        <div className="apoio-card-status-col">
          <span className={`apoio-status-badge ${currentStatus}`}>
            {currentStatus}
          </span>
          <div className="apoio-card-date">
            Data: {form.data_operacao || 'Não informada'}
          </div>
        </div>
      </div>
    </div>
  );
}
