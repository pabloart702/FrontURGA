import { useEffect, useState } from 'react';
import { getSafeErrorMessage } from '../../utils/errorMessages';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { formsService } from '../../services/forms';
import type { Form } from '../../types';
import { ArrowLeft, FileText, CheckCircle, Printer, AlertCircle } from 'lucide-react';
import axios from 'axios';
import './VisualizarPedido.css';

export function VisualizarPedido() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTab = (location.state as any)?.returnTab || 'pendente';
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  useEffect(() => {
    async function loadForm() {
      if (!id) return;

      const isValidId = /^[a-zA-Z0-9\-]+$/.test(id);
      if (!isValidId) {
        setError('Formato de identificador inválido.');
        setLoading(false);
        return;
      }

      try {
        const data = await formsService.getFormById(id);
        if (data.id) {
          setForm(data);
        } else if ((data as any).form || (data as any).data) {
          setForm((data as any).form || (data as any).data);
        } else {
          setForm(data);
        }
      } catch (err: any) {
        console.error(err);
        setError('Erro ao carregar os detalhes do pedido.');
      } finally {
        setLoading(false);
      }
    }
    loadForm();
  }, [id]);

  const showToast = (type: 'error' | 'success', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!form || !form.id) return;
    const newStatus = e.target.value;

    if (newStatus === 'realizado' && form.data_operacao) {
      let d, m, y;
      if (form.data_operacao.includes('/')) {
        [d, m, y] = form.data_operacao.split('/');
      } else if (form.data_operacao.includes('-')) {
        const parts = form.data_operacao.split('T')[0].split('-');
        if (parts[0].length === 4) {
          [y, m, d] = parts;
        } else {
          [d, m, y] = parts;
        }
      }

      if (d && m && y) {
        const opDate = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (opDate > today) {
          showToast('error', 'Não é possível marcar como "realizado" pois a operação ainda não ocorreu.');
          return;
        }
      }
    }

    try {
      await formsService.updateStatus(form.id, newStatus);
      showToast('success', 'Status atualizado com sucesso.');
      setForm({ ...form, status: newStatus });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        showToast('error', getSafeErrorMessage(err.response.status, 'Ocorreu um erro ao atualizar o status.'));
      } else if (axios.isAxiosError(err) && err.request) {
        showToast('error', 'Erro de conexão com o servidor. Verifique sua rede.');
      } else {
        showToast('error', err instanceof Error ? err.message : 'Ocorreu um erro inesperado.');
      }
    }
  };

  if (loading) {
    return (
      <div className="vp-container">
        <div className="vp-loading">Carregando detalhes...</div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="vp-container">
        <div className="vp-error">
          <p>{error || 'Pedido não encontrado.'}</p>
          <button onClick={() => navigate('/apoios', { state: { returnTab } })} className="vp-print-btn">Voltar para Apoios</button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    const originalTitle = document.title;
    // Define o título que o navegador usará como nome padrão do arquivo PDF
    document.title = `Relatorio_URGA_${form.operacao.replace(/\s+/g, '_')}`;
    window.print();
    // Restaura o título original após abrir a janela de impressão
    document.title = originalTitle;
  };

  return (
    <div className="vp-container" style={{ position: 'relative' }}>
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: toastMessage.type === 'error' ? '#fee2e2' : '#d1fae5',
          color: toastMessage.type === 'error' ? '#991b1b' : '#065f46',
          padding: '16px 24px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          border: `1px solid ${toastMessage.type === 'error' ? '#f87171' : '#34d399'}`
        }}>
          {toastMessage.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          <span style={{ fontWeight: '500' }}>{toastMessage.text}</span>
        </div>
      )}

      <div className="vp-glass-card">
        <div className="vp-header">
          <button onClick={() => navigate('/apoios', { state: { returnTab } })} className="vp-back-btn">
            <ArrowLeft size={20} /> Voltar
          </button>
          <div className="vp-title">
            <div className="vp-logo-circle">
              <FileText size={24} />
            </div>
            <h2>Detalhes da Operação</h2>
          </div>
          <div className="vp-actions">
            <button className="vp-print-btn" onClick={handlePrint}>
              <Printer size={18} /> Relatório da Solicitação
            </button>

            <select
              value={form.status || 'pendente'}
              onChange={handleStatusChange}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                border: `1px solid ${form.status === 'pendente' ? '#fca5a5' : form.status === 'ciente' ? '#fde047' : '#86efac'}`,
                background: form.status === 'pendente' ? '#fee2e2' : form.status === 'ciente' ? '#fef9c3' : '#dcfce7',
                color: form.status === 'pendente' ? '#dc2626' : form.status === 'ciente' ? '#ca8a04' : '#16a34a',
                cursor: 'pointer',
                outline: 'none',
                textTransform: 'uppercase',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                textAlign: 'center'
              }}
            >
              <option value="pendente" style={{ color: '#dc2626', fontWeight: '600', background: '#ffffff' }}>PENDENTE</option>
              <option value="ciente" style={{ color: '#ca8a04', fontWeight: '600', background: '#ffffff' }}>CIENTE</option>
              <option value="realizado" style={{ color: '#16a34a', fontWeight: '600', background: '#ffffff' }}>REALIZADO</option>
            </select>
          </div>
        </div>

        <div className="vp-content-grid">
          <div className="vp-section">
            <h3>Informações Básicas</h3>
            <div className="vp-info-group">
              <label>Nome da Operação</label>
              <p>{form.operacao}</p>
            </div>
            <div className="vp-info-group">
              <label>Departamento</label>
              <p>{form.departamento}</p>
            </div>
            <div className="vp-info-group">
              <label>Data da Operação</label>
              <p>{form.data_operacao}</p>
            </div>
          </div>

          <div className="vp-section">
            <h3>Dados Jurídicos</h3>
            <div className="vp-info-group">
              <label>Número do Processo</label>
              <p>{form.numero_processo}</p>
            </div>
            <div className="vp-info-group">
              <label>Número Cautelar</label>
              <p>{form.numero_cautelar}</p>
            </div>
            <div className="vp-info-group">
              <label>Medida Cautelar</label>
              <p>{form.medida_cautelar}</p>
            </div>
          </div>

          <div className="vp-section full-width">
            <h3>Resultados e Apreensões</h3>
            <div className="vp-results-grid">
              <div className="vp-info-group">
                <label>Valor Estimado</label>
                <p className="vp-valor">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(form.valor_estimado || 0)}
                </p>
              </div>

              <div className="vp-info-group">
                <label>Resultados da Operação</label>
                <div className="vp-tags">
                  {form.resultados?.map((r, i) => (
                    <span key={i} className="vp-tag result-tag">{r}</span>
                  ))}
                  {(!form.resultados || form.resultados.length === 0) && <span className="vp-empty">Nenhum</span>}
                </div>
              </div>

              <div className="vp-info-group">
                <label>Tipos Apreendidos</label>
                <div className="vp-tags">
                  {form.tipos_apreendidos?.map((t, i) => (
                    <span key={i} className="vp-tag type-tag">{t}</span>
                  ))}
                  {(!form.tipos_apreendidos || form.tipos_apreendidos.length === 0) && <span className="vp-empty">Nenhum</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="vp-section full-width">
            <h3>Descrição da Operação</h3>
            <div className="vp-desc-box">
              {form.descricao_operacao}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
