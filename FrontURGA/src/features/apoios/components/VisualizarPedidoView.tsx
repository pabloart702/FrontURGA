import { ArrowLeft, FileText, CheckCircle, Printer, AlertCircle } from 'lucide-react';
import type { Form, ToastFeedback } from '../types/apoios.types';
import './VisualizarPedido.css';

interface VisualizarPedidoViewProps {
  form: Form | null;
  loading: boolean;
  error: string;
  toastMessage: ToastFeedback | null;
  userRole?: string;
  canUpdateStatus?: boolean;
  onStatusChange: (newStatus: string) => void;
  onPrint: () => void;
  onBack: () => void;
}

function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) return 'Não informada';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function VisualizarPedidoView({
  form,
  loading,
  error,
  toastMessage,
  userRole,
  canUpdateStatus,
  onStatusChange,
  onPrint,
  onBack,
}: VisualizarPedidoViewProps) {
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
          <button type="button" onClick={onBack} className="vp-print-btn">
            Voltar para Apoios
          </button>
        </div>
      </div>
    );
  }

  const isUserOnly = canUpdateStatus !== undefined ? !canUpdateStatus : userRole === 'Usuário';
  const currentStatus = form.status || 'pendente';

  return (
    <div className="page-container" style={{ position: 'relative' }}>
      {toastMessage && (
        <div
          role="alert"
          style={{
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
            border: `1px solid ${toastMessage.type === 'error' ? '#f87171' : '#34d399'}`,
          }}
        >
          {toastMessage.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          <span style={{ fontWeight: '500' }}>{toastMessage.text}</span>
        </div>
      )}

      <div className="page-glass-card">
        <div className="vp-header">
          <button
            type="button"
            onClick={onBack}
            className="vp-back-btn"
            title="Voltar"
            aria-label="Voltar"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="vp-title">
            <div className="vp-logo-circle">
              <FileText size={24} />
            </div>
            <h2>Detalhes da Operação</h2>
          </div>
          <div className="vp-actions">
            <button type="button" className="vp-print-btn" onClick={onPrint}>
              <Printer size={18} /> Relatório da Solicitação
            </button>

            {!isUserOnly ? (
              <select
                aria-label="Atualizar status do pedido"
                value={currentStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: `1px solid ${
                    currentStatus === 'pendente'
                      ? '#fca5a5'
                      : currentStatus === 'ciente'
                        ? '#fde047'
                        : '#86efac'
                  }`,
                  background:
                    currentStatus === 'pendente'
                      ? '#fee2e2'
                      : currentStatus === 'ciente'
                        ? '#fef9c3'
                        : '#dcfce7',
                  color:
                    currentStatus === 'pendente'
                      ? '#dc2626'
                      : currentStatus === 'ciente'
                        ? '#ca8a04'
                        : '#16a34a',
                  cursor: 'pointer',
                  outline: 'none',
                  textTransform: 'uppercase',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  textAlign: 'center',
                }}
              >
                <option
                  value="pendente"
                  style={{ color: '#dc2626', fontWeight: '600', background: '#ffffff' }}
                >
                  PENDENTE
                </option>
                <option
                  value="ciente"
                  style={{ color: '#ca8a04', fontWeight: '600', background: '#ffffff' }}
                >
                  CIENTE
                </option>
                <option
                  value="realizado"
                  style={{ color: '#16a34a', fontWeight: '600', background: '#ffffff' }}
                >
                  REALIZADO
                </option>
              </select>
            ) : (
              <span
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: `1px solid ${
                    currentStatus === 'pendente'
                      ? '#fca5a5'
                      : currentStatus === 'ciente'
                        ? '#fde047'
                        : '#86efac'
                  }`,
                  background:
                    currentStatus === 'pendente'
                      ? '#fee2e2'
                      : currentStatus === 'ciente'
                        ? '#fef9c3'
                        : '#dcfce7',
                  color:
                    currentStatus === 'pendente'
                      ? '#dc2626'
                      : currentStatus === 'ciente'
                        ? '#ca8a04'
                        : '#16a34a',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                }}
              >
                {currentStatus}
              </span>
            )}
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
              <label>Data da Solicitação</label>
              <p>{formatDateTime(form.createdAt)}</p>
            </div>
            <div className="vp-info-group">
              <label>Data da Operação</label>
              <p
                style={{
                  color: form.data_operacao ? 'inherit' : '#d97706',
                  fontStyle: form.data_operacao ? 'normal' : 'italic',
                  fontWeight: form.data_operacao ? 'normal' : '500',
                }}
              >
                {form.data_operacao || 'Data da operação não informada'}
              </p>
            </div>
          </div>

          <div className="vp-section">
            <h3>Dados Jurídicos</h3>
            <div className="vp-info-group">
              <label>Número do Processo</label>
              <p>{form.numero_processo || 'Não informado'}</p>
            </div>
            <div className="vp-info-group">
              <label>Número da Cautelar</label>
              <p>{form.numero_cautelar || 'Não informado'}</p>
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
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(form.valor_estimado || 0)}
                </p>
              </div>

              <div className="vp-info-group">
                <label>Resultados da Operação</label>
                <div className="vp-tags">
                  {form.resultados?.map((r, i) => (
                    <span key={i} className="vp-tag result-tag">
                      {r}
                    </span>
                  ))}
                  {(!form.resultados || form.resultados.length === 0) && (
                    <span className="vp-empty">Nenhum</span>
                  )}
                </div>
              </div>

              <div className="vp-info-group">
                <label>Tipos Apreendidos</label>
                <div className="vp-tags">
                  {form.tipos_apreendidos?.map((t, i) => (
                    <span key={i} className="vp-tag type-tag">
                      {t}
                    </span>
                  ))}
                  {(!form.tipos_apreendidos || form.tipos_apreendidos.length === 0) && (
                    <span className="vp-empty">Nenhum</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="vp-section full-width">
            <h3>Descrição da Operação</h3>
            <div className="vp-desc-box">{form.descricao_operacao}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
