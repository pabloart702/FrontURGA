import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formsService } from '../services/forms';
import type { Form } from '../types';
import { FileSearch, ArrowLeft } from 'lucide-react';

export function Apoios() {
  const [forms, setForms] = useState<Form[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadForms() {
      try {
        const data = await formsService.getForms();
        if (Array.isArray(data)) {
          setForms(data);
        } else if (data && typeof data === 'object') {
          const formsArray = (data as any).forms || (data as any).data || (data as any).resultados;
          if (Array.isArray(formsArray)) {
            setForms(formsArray);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar os formulários', err);
      }
    }
    loadForms();
  }, []);

  return (
    <div style={{ padding: '30px', color: 'white', fontFamily: 'sans-serif', minHeight: '100vh', background: '#0f172a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <ArrowLeft size={20} /> Voltar
          </button>
          <h2>Lista de Apoios</h2>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        {forms.length > 0 ? (
          <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
            {forms.map((form) => (
              <div 
                key={form.id || Math.random()} 
                onClick={() => navigate(`/visualizar-pedido/${form.id}`)}
                style={{ 
                  background: 'rgba(30, 41, 59, 0.6)', 
                  padding: '20px', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(30, 41, 59, 0.9)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileSearch size={18} color="#3b82f6" /> {form.operacao}
                    </h3>
                    <strong style={{ color: '#cbd5e1' }}>Departamento:</strong> <span style={{ color: '#94a3b8' }}>{form.departamento}</span> <br />
                    <strong style={{ color: '#cbd5e1' }}>Processo:</strong> <span style={{ color: '#94a3b8' }}>{form.numero_processo}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      background: form.status === 'pendente' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      color: form.status === 'pendente' ? '#f59e0b' : '#10b981',
                      border: `1px solid ${form.status === 'pendente' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                    }}>
                      {form.status ? form.status.toUpperCase() : 'PENDENTE'}
                    </span>
                    <div style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>
                      Data: {form.data_operacao}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ marginTop: '30px', padding: '40px', textAlign: 'center', background: 'rgba(30, 41, 59, 0.6)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <p style={{ color: '#94a3b8', fontSize: '16px' }}>Nenhum apoio encontrado no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
