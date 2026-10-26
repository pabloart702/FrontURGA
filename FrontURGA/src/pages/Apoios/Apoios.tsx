import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { formsService, type GetFormsParams } from '../../services/forms';
import type { Form } from '../../types';
import { FileSearch, PlusCircle } from 'lucide-react';
import { UNIDADES_POLICIAIS } from '../../constants/unidades';
import { useAuth } from '../../hooks/useAuth';

import { AgendaCalendar } from './AgendaCalendar';
import './Apoios.css';

type TabStatus = 'agenda' | 'pendente' | 'ciente' | 'realizado';

export function Apoios() {
  const [forms, setForms] = useState<Form[]>([]);
  const location = useLocation();
  const initialTab = (location.state as any)?.returnTab || 'agenda';
  const [activeTab, setActiveTab] = useState<TabStatus>(initialTab);
  const [departamento, setDepartamento] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const navigate = useNavigate();
  const limit = 10;

  const loadForms = useCallback(async () => {
    setLoading(true);
    try {
      const params: GetFormsParams = { page, limit: activeTab === 'agenda' ? 100 : limit };

      if (activeTab !== 'agenda') {
        params.status = activeTab;
      }

      if (departamento) {
        params.departamento = departamento;
      }

      if (activeTab === 'pendente') {
        params.sortBy = 'data_operacao';
        params.sortOrder = 'asc';
      } else if (activeTab === 'agenda') {
        params.sortBy = 'data_operacao';
        params.sortOrder = 'desc';
      } else if (activeTab === 'ciente') {
        params.sortBy = 'data_operacao';
        params.sortOrder = 'asc';
      } else if (activeTab === 'realizado') {
        params.sortBy = 'dataRealizado';
        params.sortOrder = 'desc';
      }

      const data = await formsService.getForms(params);
      if (Array.isArray(data)) {
        setForms(data);
        setTotalPages(1);
      } else if (data && typeof data === 'object') {
        const formsArray = (data as any).forms || (data as any).data || (data as any).resultados;
        if (Array.isArray(formsArray)) {
          setForms(formsArray);
        } else {
          setForms([]);
        }
        setTotalPages((data as any).totalPages || 1);
      } else {
        setForms([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Erro ao carregar os formulários', err);
      setForms([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, departamento, page]);

  useEffect(() => {
    loadForms();
  }, [loadForms]);

  return (
    <div className="apoios-page-container">
      <div className="apoios-header">
        <div className="apoios-header-info">
          <h2 className="apoios-title">
            <FileSearch size={26} color="#09090b" className="apoios-title-icon" />
            Lista de Apoios
          </h2>
          <p className="apoios-subtitle">Gerencie e visualize as solicitações de apoio realizadas.</p>
        </div>

        <button
          onClick={() => navigate('/solicitacao-apoio')}
          className="btn-nova-solicitacao"
        >
          <PlusCircle size={18} /> Nova Solicitação
        </button>
      </div>

      <div className="apoios-controls-container">
        <div className="apoios-tabs-container">
          {(['agenda', 'pendente', 'ciente', 'realizado'] as TabStatus[]).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setPage(1); }}
              className={`apoios-tab-btn ${activeTab === tab ? 'active' : ''}`}
            >
              {tab === 'agenda' ? 'Agendas' : `${tab}s`}
            </button>
          ))}
        </div>

        {user?.role !== 'Usuário' && (
          <div className="apoios-filter-container">
            <input
              type="text"
              list="filter-departamentos-list-apoios"
              value={departamento}
              onChange={(e) => { setDepartamento(e.target.value); setPage(1); }}
              placeholder="Todos os Departamentos"
              className="apoios-dept-input"
            />
            <datalist id="filter-departamentos-list-apoios">
              {UNIDADES_POLICIAIS.map((dept, idx) => (
                <option key={`${dept}-${idx}`} value={dept} />
              ))}
            </datalist>
          </div>
        )}
      </div>

      <div>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#71717a' }}>Carregando...</div>
        ) : activeTab === 'agenda' ? (
          <AgendaCalendar forms={forms} />
        ) : forms.length > 0 ? (
          <div className="apoios-list-container">
            {forms.map((form) => (
              <div
                key={form.id || Math.random()}
                onClick={() => navigate(`/visualizar-pedido/${form.id}`, { state: { returnTab: activeTab } })}
                className="apoio-card"
              >
                <div className="apoio-card-content">
                  <div>
                    <h3 className="apoio-card-title">
                      {form.operacao}
                    </h3>
                    <div className="apoio-card-details">
                      <div>
                        <strong>Departamento:</strong> <span>{form.departamento}</span>
                      </div>
                      <div>
                        <strong>Processo:</strong> <span>{form.numero_processo}</span>
                      </div>
                    </div>
                  </div>
                  <div className="apoio-card-status-col">
                    <span className={`apoio-status-badge ${form.status || activeTab}`}>
                      {form.status ? form.status : activeTab}
                    </span>
                    <div className="apoio-card-date">
                      Data: {form.data_operacao || "Não informada"}
                    </div>
                  </div>
                </div>
              </div>
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
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="pagination-btn"
            >
              Anterior
            </button>

            <div className="pagination-info">
              Página <span>{page}</span> de <span>{totalPages}</span>
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
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
