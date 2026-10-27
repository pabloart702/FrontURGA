import { useRef } from 'react';
import { FileText, Save, ArrowLeft, Calendar } from 'lucide-react';
import type { SolicitacaoFormData } from '../types/apoios.types';
import './SolicitacaoApoio.css';

interface SolicitacaoFormProps {
  formData: SolicitacaoFormData;
  resultados: string[];
  tiposApreendidos: string[];
  outrosTipos: string;
  loading: boolean;
  error: string;
  userRole?: string;
  unidades: string[];
  bens: string[];
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onDatePickerChange: (value: string) => void;
  onOutrosTiposChange: (value: string) => void;
  onToggleResultado: (value: string) => void;
  onToggleTipoApreendido: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const RESULTADOS_OPCOES = [
  'Apreensão',
  'Bloqueio',
  'Depósito',
  'Indisponibilidades',
  'Sequestro',
  'Uso',
];

export function SolicitacaoForm({
  formData,
  resultados,
  tiposApreendidos,
  outrosTipos,
  loading,
  error,
  userRole,
  unidades,
  bens,
  onInputChange,
  onDatePickerChange,
  onOutrosTiposChange,
  onToggleResultado,
  onToggleTipoApreendido,
  onSubmit,
  onBack,
}: SolicitacaoFormProps) {
  const datePickerRef = useRef<HTMLInputElement>(null);

  const handleOpenDatePicker = () => {
    if (datePickerRef.current) {
      if (typeof datePickerRef.current.showPicker === 'function') {
        datePickerRef.current.showPicker();
      } else {
        datePickerRef.current.focus();
        datePickerRef.current.click();
      }
    }
  };
  return (
    <div className="solicitacao-card">
      <div className="apoio-header">
        <button
          type="button"
          onClick={onBack}
          className="back-btn"
          title="Voltar"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="header-title">
          <div className="logo-circle">
            <FileText size={20} className="logo-icon" />
          </div>
          <h2>Nova Solicitação de Apoio</h2>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={onSubmit} className="apoio-form">
        <div className="form-grid">
          <div className="input-group">
            <label htmlFor="sol-departamento">Departamento</label>
            <input
              id="sol-departamento"
              type="text"
              name="departamento"
              list="departamentos-list"
              value={formData.departamento}
              onChange={onInputChange}
              required
              placeholder="Ex: Homicídios"
              disabled={userRole === 'Usuário'}
            />
            {userRole !== 'Usuário' && (
              <datalist id="departamentos-list">
                {unidades.map((unidade, idx) => (
                  <option key={`${unidade}-${idx}`} value={unidade} />
                ))}
              </datalist>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="sol-operacao">Nome da Operação</label>
            <input
              id="sol-operacao"
              type="text"
              name="operacao"
              value={formData.operacao}
              onChange={onInputChange}
              required
              placeholder="Ex: Operação Limpeza"
            />
          </div>

          <div className="input-group">
            <label htmlFor="sol-data-operacao">Data da Operação</label>
            <div className="date-input-wrapper">
              <input
                id="sol-data-operacao"
                type="text"
                name="data_operacao"
                value={formData.data_operacao}
                onChange={onInputChange}
                placeholder="DD/MM/AAAA"
                maxLength={10}
                aria-label="Data da operação"
              />
              <button
                type="button"
                className="date-picker-btn"
                onClick={handleOpenDatePicker}
                title="Abrir calendário"
                aria-label="Abrir calendário"
              >
                <Calendar className="date-picker-icon" size={20} />
              </button>
              <input
                ref={datePickerRef}
                type="date"
                className="hidden-date-picker"
                tabIndex={-1}
                aria-hidden="true"
                onChange={(e) => onDatePickerChange(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="sol-numero-processo">Nº do Processo</label>
            <input
              id="sol-numero-processo"
              type="text"
              name="numero_processo"
              value={formData.numero_processo}
              onChange={onInputChange}
              placeholder="Ex: 1234567-89.2026.8.00.0000"
              maxLength={25}
            />
          </div>

          <div className="input-group">
            <label htmlFor="sol-medida-cautelar">Medida Cautelar</label>
            <select
              id="sol-medida-cautelar"
              name="medida_cautelar"
              value={formData.medida_cautelar}
              onChange={onInputChange}
              required
            >
              <option value="">Selecione...</option>
              <option value="Auto de prisão em flagrante">Auto de prisão em flagrante</option>
              <option value="Bloqueio">Bloqueio</option>
              <option value="Busca e apreensão">Busca e apreensão</option>
              <option value="Sequestro">Sequestro de bens</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="sol-numero-cautelar">Nº Cautelar</label>
            <input
              id="sol-numero-cautelar"
              type="text"
              name="numero_cautelar"
              value={formData.numero_cautelar}
              onChange={onInputChange}
              placeholder="Ex: 1234567-89.2026.8.00.0000"
              maxLength={25}
            />
          </div>

          <div className="input-group">
            <label htmlFor="sol-valor-estimado">Valor Estimado (R$)</label>
            <input
              id="sol-valor-estimado"
              type="text"
              name="valor_estimado"
              value={formData.valor_estimado}
              onChange={onInputChange}
              required
              placeholder="Ex: R$ 150.000,00"
            />
          </div>
        </div>

        <div className="form-grid-checkboxes">
          <div className="checkbox-group-container">
            <label>Resultados da Operação</label>
            <div className="checkbox-list">
              {RESULTADOS_OPCOES.map((res) => (
                <label key={res} className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={resultados.includes(res)}
                    onChange={() => onToggleResultado(res)}
                  />
                  <span>{res}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="checkbox-group-container">
            <label>Tipos Apreendidos</label>
            <div className="checkbox-list">
              {bens.map((tipo) => (
                <label key={tipo} className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={tiposApreendidos.includes(tipo)}
                    onChange={() => onToggleTipoApreendido(tipo)}
                  />
                  <span>{tipo}</span>
                </label>
              ))}
              <label key="Outros" className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={tiposApreendidos.includes('Outros')}
                  onChange={() => onToggleTipoApreendido('Outros')}
                />
                <span>Outros</span>
              </label>
              {tiposApreendidos.includes('Outros') && (
                <div>
                  <textarea
                    value={outrosTipos}
                    onChange={(e) => onOutrosTiposChange(e.target.value)}
                    placeholder="Os tipos devem ser separados por vírgula"
                    className="outros-tipos-textarea"
                    aria-label="Outros tipos apreendidos"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="input-group full-width">
          <label htmlFor="sol-descricao-operacao">Descrição da Operação</label>
          <textarea
            id="sol-descricao-operacao"
            name="descricao_operacao"
            value={formData.descricao_operacao}
            onChange={onInputChange}
            required
            rows={4}
            placeholder="Descreva os detalhes da operação (no máximo 500 caracteres)"
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            <Save size={20} /> {loading ? 'Salvando...' : 'Salvar Formulário'}
          </button>
        </div>
      </form>
    </div>
  );
}
