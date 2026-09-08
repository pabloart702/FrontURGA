import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formsService } from '../services/forms';
import type { Form } from '../types';
import { ArrowLeft, FileText, CheckCircle, Clock, Printer } from 'lucide-react';
import './VisualizarPedido.css';

export function VisualizarPedido() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadForm() {
      if (!id) return;
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
          <button onClick={() => navigate('/apoios')} className="vp-print-btn">Voltar para Apoios</button>
        </div>
      </div>
    );
  }

  const isPendente = form.status === 'pendente';

  const handlePrint = () => {
    const originalTitle = document.title;
    // Define o título que o navegador usará como nome padrão do arquivo PDF
    document.title = `Relatorio_URGA_${form.operacao.replace(/\s+/g, '_')}`;
    window.print();
    // Restaura o título original após abrir a janela de impressão
    document.title = originalTitle;
  };

  return (
    <div className="vp-container">
      <div className="vp-glass-card">
        <div className="vp-header">
          <button onClick={() => navigate('/apoios')} className="vp-back-btn">
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
            <div className={`vp-status-badge ${isPendente ? 'status-pendente' : 'status-concluido'}`}>
              {isPendente ? <Clock size={16} /> : <CheckCircle size={16} />}
              {form.status ? form.status.toUpperCase() : 'PENDENTE'}
            </div>
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
