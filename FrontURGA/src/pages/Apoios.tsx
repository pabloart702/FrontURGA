import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formsService } from '../services/forms';
import type { Form } from '../types';
import { FileSearch, PlusCircle } from 'lucide-react';

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
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', paddingBottom: '20px', borderBottom: '1px solid #e4e4e7' }}>
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

      <div>
        {forms.length > 0 ? (
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
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '600',
                      background: form.status === 'pendente' ? '#fef3c7' : '#d1fae5',
                      color: form.status === 'pendente' ? '#d97706' : '#059669',
                      border: `1px solid ${form.status === 'pendente' ? '#fde68a' : '#a7f3d0'}`
                    }}>
                      {form.status ? form.status.toUpperCase() : 'PENDENTE'}
                    </span>
                    <div style={{ marginTop: '12px', fontSize: '13px', color: '#71717a', fontWeight: '500' }}>
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
      </div>
    </div>
  );
}
