import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { formsService, type GetFormsParams } from '../../services/forms';
import type { Form } from '../../types';
import { FileSearch, PlusCircle } from 'lucide-react';
import { UNIDADES_POLICIAIS } from '../../constants/unidades';

type TabStatus = 'pendente' | 'ciente' | 'realizado';

export function Apoios() {
  const [forms, setForms] = useState<Form[]>([]);
  const [activeTab, setActiveTab] = useState<TabStatus>('pendente');
  const [departamento, setDepartamento] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const limit = 10;

  const loadForms = useCallback(async () => {
    setLoading(true);
    try {
      const params: GetFormsParams = { status: activeTab, page, limit };

      if (departamento) {
        params.departamento = departamento;
      }

      if (activeTab === 'pendente') {
        params.sortBy = 'createdAt';
        params.sortOrder = 'asc';
      } else if (activeTab === 'ciente') {
        params.sortBy = 'data_operacao';
        params.sortOrder = 'desc';
      } else if (activeTab === 'realizado') {
        params.sortBy = 'dataRealizado';
        params.sortOrder = 'desc';
      }

      const data = await formsService.getForms(params);
      if (Array.isArray(data)) {
        setForms(data);
      } else if (data && typeof data === 'object') {
        const formsArray = (data as any).forms || (data as any).data || (data as any).resultados;
        if (Array.isArray(formsArray)) {
          setForms(formsArray);
        } else {
          setForms([]);
        }
      } else {
        setForms([]);
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
    <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #e4e4e7' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#09090b', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileSearch size={28} color="#09090b" />
            Lista de Apoios
          </h2>
          <p style={{ color: '#71717a', fontSize: '15px', margin: 0 }}>Gerencie e visualize as solicitações de apoio realizadas.</p>
        </div>

        <button
          onClick={() => navigate('/solicitacao-apoio')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: '#09090b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#27272a'}
          onMouseOut={(e) => e.currentTarget.style.background = '#09090b'}
        >
          <PlusCircle size={18} /> Nova Solicitação
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', background: '#f4f4f5', padding: '4px', borderRadius: '8px' }}>
          {(['pendente', 'ciente', 'realizado'] as TabStatus[]).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setPage(1); }}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === tab ? '#ffffff' : 'transparent',
                color: activeTab === tab ? '#09090b' : '#71717a',
                fontWeight: activeTab === tab ? '600' : '500',
                cursor: 'pointer',
                boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s ease',
                textTransform: 'capitalize'
              }}
            >
              {tab}s
            </button>
          ))}
        </div>

        <div>
          <select
            value={departamento}
            onChange={(e) => { setDepartamento(e.target.value); setPage(1); }}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #e4e4e7',
              fontSize: '14px',
              outline: 'none',
              width: '250px',
              background: '#ffffff',
              color: '#09090b',
              cursor: 'pointer'
            }}
          >
            <option value="">Todos os Departamentos</option>
            {UNIDADES_POLICIAIS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#71717a' }}>Carregando...</div>
        ) : forms.length > 0 ? (
          <div style={{ display: 'grid', gap: '16px' }}>
            {forms.map((form) => (
              <div
                key={form.id || Math.random()}
                onClick={() => navigate(`/visualizar-pedido/${form.id}`)}
                style={{
                  background: '#ffffff',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid #e4e4e7',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#d4d4d8';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e4e4e7';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#09090b', fontWeight: '600' }}>
                      {form.operacao}
                    </h3>
                    <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
                      <div>
                        <strong style={{ color: '#71717a', fontWeight: '500' }}>Departamento:</strong> <span style={{ color: '#09090b', fontWeight: '500' }}>{form.departamento}</span>
                      </div>
                      <div>
                        <strong style={{ color: '#71717a', fontWeight: '500' }}>Processo:</strong> <span style={{ color: '#09090b', fontWeight: '500' }}>{form.numero_processo}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                    <span style={{ 
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '600',
                      background: form.status === 'pendente' ? '#fee2e2' : form.status === 'ciente' ? '#fef9c3' : '#dcfce7',
                      color: form.status === 'pendente' ? '#dc2626' : form.status === 'ciente' ? '#ca8a04' : '#16a34a',
                      border: `1px solid ${form.status === 'pendente' ? '#fca5a5' : form.status === 'ciente' ? '#fde047' : '#86efac'}`,
                      textTransform: 'uppercase'
                    }}>
                      {form.status ? form.status : activeTab}
                    </span>
                    <div style={{ fontSize: '13px', color: '#71717a', fontWeight: '500' }}>
                      Data: {form.data_operacao}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '60px 40px', textAlign: 'center', background: '#ffffff', borderRadius: '12px', border: '1px dashed #d4d4d8' }}>
            <p style={{ color: '#71717a', fontSize: '15px' }}>Nenhum apoio encontrado no momento.</p>
          </div>
        )}

        {(forms.length > 0 || page > 1) && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '32px', gap: '16px' }}>
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #e4e4e7',
                background: page === 1 ? '#f4f4f5' : '#ffffff',
                color: page === 1 ? '#a1a1aa' : '#09090b',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              Anterior
            </button>

            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#3f3f46',
              background: '#f4f4f5',
              padding: '6px 16px',
              borderRadius: '20px'
            }}>
              Página {page}
            </div>

            <button
              disabled={forms.length < limit}
              onClick={() => setPage(p => p + 1)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #e4e4e7',
                background: forms.length < limit ? '#f4f4f5' : '#ffffff',
                color: forms.length < limit ? '#a1a1aa' : '#09090b',
                cursor: forms.length < limit ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
