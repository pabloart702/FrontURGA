import { FileSearch, PlusCircle } from 'lucide-react';
import type { Form, TabStatus } from '../types/apoios.types';
import { ApoioCard } from './ApoioCard';
import { AgendaCalendar } from './AgendaCalendar';
import './Apoios.css';

interface ApoiosListViewProps {
  forms: Form[];
  loading: boolean;
  error?: string | null;
  activeTab: TabStatus;
  departamento: string;
  departamentos: string[];
  page: number;
  totalPages: number;
  userRole?: string;
  onTabChange: (tab: TabStatus) => void;
  onDepartamentoChange: (dept: string) => void;
  onPageChange: (newPage: number) => void;
  onNewSolicitacao: () => void;
  onSelectForm: (form: Form) => void;
}

const TABS: TabStatus[] = ['agenda', 'pendente', 'ciente', 'realizado'];

export function ApoiosListView({
  forms,
  loading,
  error,
  activeTab,
  departamento,
  departamentos,
  page,
  totalPages,
  userRole,
  onTabChange,
  onDepartamentoChange,
  onPageChange,
  onNewSolicitacao,
  onSelectForm,
}: ApoiosListViewProps) {
  return (
    <div className="apoios-page-container">
      <div className="apoios-header">
        <div className="apoios-header-info">
          <h2 className="apoios-title">
            <FileSearch size={26} color="#09090b" className="apoios-title-icon" />
            Lista de Apoios
          </h2>
          <p className="apoios-subtitle">
            Gerencie e visualize as solicitações de apoio realizadas.
          </p>
        </div>

        <button
          type="button"
          onClick={onNewSolicitacao}
          className="btn-nova-solicitacao"
        >
          <PlusCircle size={18} /> Nova Solicitação
        </button>
      </div>

      <div className="apoios-controls-container">
        <div className="apoios-tabs-container">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`apoios-tab-btn ${activeTab === tab ? 'active' : ''}`}
            >
              {tab === 'agenda' ? 'Agendas' : `${tab}s`}
            </button>
          ))}
        </div>

        {userRole !== 'Usuário' && (
          <div className="apoios-filter-container">
            <input
              type="text"
              list="filter-departamentos-list-apoios"
              value={departamento}
              onChange={(e) => onDepartamentoChange(e.target.value)}
              placeholder="Todos os Departamentos"
              className="apoios-dept-input"
              aria-label="Filtrar por departamento"
            />
            <datalist id="filter-departamentos-list-apoios">
              {departamentos.map((dept, idx) => (
                <option key={`${dept}-${idx}`} value={dept} />
              ))}
            </datalist>
          </div>
        )}
      </div>

      <div>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#71717a' }}>
            Carregando...
          </div>
        ) : error ? (
          <div className="apoios-empty-state" role="alert" style={{ color: '#ef4444' }}>
            <p>{error}</p>
          </div>
        ) : activeTab === 'agenda' ? (
          <AgendaCalendar forms={forms} onSelectForm={onSelectForm} />
        ) : forms.length > 0 ? (
          <div className="apoios-list-container">
            {forms.map((form, idx) => (
              <ApoioCard
                key={form.id || `form-item-${idx}`}
                form={form}
                activeTab={activeTab}
                onClick={onSelectForm}
              />
            ))}
          </div>
        ) : (
          <div className="apoios-empty-state">
            <p>Nenhum apoio encontrado no momento.</p>
          </div>
        )}

        {activeTab !== 'agenda' && totalPages > 1 && (
          <div className="apoios-pagination">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => onPageChange(Math.max(1, page - 1))}
              className="pagination-btn"
            >
              Anterior
            </button>

            <div className="pagination-info">
              Página <span>{page}</span> de <span>{totalPages}</span>
            </div>

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
              className="pagination-btn"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
