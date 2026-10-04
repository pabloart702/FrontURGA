import { useState, useEffect } from 'react';
import { getSafeErrorMessage } from '../../utils/errorMessages';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { formsService } from '../../services/forms';
import { FileText, Save, ArrowLeft, Calendar } from 'lucide-react';
import { BENS } from '../../constants/bens';
import { UNIDADES_POLICIAIS } from '../../constants/unidades';
import './SolicitacaoApoio.css';

export function SolicitacaoApoio() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    departamento: '',
    operacao: '',
    data_operacao: '',
    numero_processo: '',
    medida_cautelar: '',
    numero_cautelar: '',
    descricao_operacao: '',
    valor_estimado: ''
  });

  const [resultados, setResultados] = useState<string[]>([]);
  const [tiposApreendidos, setTiposApreendidos] = useState<string[]>([]);
  const [outrosTipos, setOutrosTipos] = useState('');

  useEffect(() => {
    if (user && user.role === 'Usuário' && user.departamento) {
      setFormData(prev => ({ ...prev, departamento: user.departamento }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'data_operacao') {
      let v = value.replace(/\D/g, '');
      if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2);
      if (v.length > 5) v = v.substring(0, 5) + '/' + v.substring(5, 9);
      setFormData(prev => ({ ...prev, [name]: v }));
      return;
    }

    if (name === 'numero_processo' || name === 'numero_cautelar') {
      let v = value.replace(/\D/g, '');
      if (v.length > 20) v = v.substring(0, 20); // 20 digits max

      if (v.length > 7) v = v.substring(0, 7) + '-' + v.substring(7);
      if (v.length > 10) v = v.substring(0, 10) + '.' + v.substring(10);
      if (v.length > 15) v = v.substring(0, 15) + '.' + v.substring(15);
      if (v.length > 17) v = v.substring(0, 17) + '.' + v.substring(17);
      if (v.length > 20) v = v.substring(0, 20) + '.' + v.substring(20);

      setFormData(prev => ({ ...prev, [name]: v }));
      return;
    }

    if (name === 'valor_estimado') {
      let v = value.replace(/\D/g, '');
      if (v) {
        const amount = Number(v) / 100;
        v = amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      } else {
        v = '';
      }
      setFormData(prev => ({ ...prev, [name]: v }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleCheckbox = (setList: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setList(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      if (!UNIDADES_POLICIAIS.includes(formData.departamento)) {
        setError('Por favor, selecione um departamento válido da lista.');
        setLoading(false);
        return;
      }

      let finalTiposApreendidos = [...tiposApreendidos];
      if (finalTiposApreendidos.includes('Outros')) {
        finalTiposApreendidos = finalTiposApreendidos.filter(t => t !== 'Outros');
        if (outrosTipos.trim()) {
          const customTipos = outrosTipos.split(',').map(t => t.trim());
          finalTiposApreendidos.push(...customTipos);
        }
      }

      const payload = {
        departamento: formData.departamento,
        operacao: formData.operacao,
        data_operacao: formData.data_operacao.trim() || undefined,
        numero_processo: formData.numero_processo.trim() || undefined,
        medida_cautelar: formData.medida_cautelar,
        numero_cautelar: formData.numero_cautelar.trim() || undefined,
        descricao_operacao: formData.descricao_operacao,
        valor_estimado: Number(formData.valor_estimado.replace(/\D/g, '')) / 100,
        resultados,
        tipos_apreendidos: finalTiposApreendidos
      };

      await formsService.createForm(payload);
      alert('Formulário cadastrado com sucesso!');
      navigate('/apoios');
    } catch (err: any) {
      if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
        setError('Erro de conexão. A API pode estar offline.');
      } else {
        setError(getSafeErrorMessage(err.response?.status, 'Erro ao criar formulário. Verifique os dados e tente novamente.'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-glass-card">
        <div className="apoio-header">
          <button onClick={() => navigate('/apoios')} className="back-btn">
            <ArrowLeft size={20} /> Voltar
          </button>
          <div className="header-title" style={{ flex: 1, justifyContent: 'center' }}>
            <div className="logo-circle">
              <FileText size={24} className="logo-icon" />
            </div>
            <h2>Nova Solicitação de Apoio</h2>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="apoio-form">
          <div className="form-grid">

            <div className="input-group">
              <label>Departamento</label>
              <input
                type="text"
                name="departamento"
                list="departamentos-list"
                value={formData.departamento}
                onChange={handleInputChange}
                required
                placeholder="Ex: Homicídios"
                disabled={user?.role === 'Usuário'}
              />
              {user?.role !== 'Usuário' && (
                <datalist id="departamentos-list">
                  {UNIDADES_POLICIAIS.map(unidade => (
                    <option key={unidade} value={unidade} />
                  ))}
                </datalist>
              )}
            </div>

            <div className="input-group">
              <label>Nome da Operação</label>
              <input type="text" name="operacao" value={formData.operacao} onChange={handleInputChange} required placeholder="Ex: Operação Limpeza" />
            </div>

            <div className="input-group">
              <label>Data da Operação</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  name="data_operacao"
                  value={formData.data_operacao}
                  onChange={handleInputChange}
                  placeholder="DD/MM/AAAA"
                  maxLength={10}
                />
                <input
                  type="date"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    width: '50px',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val) {
                      const [y, m, d] = val.split('-');
                      setFormData(prev => ({ ...prev, data_operacao: `${d}/${m}/${y}` }));
                    }
                  }}
                />
                <Calendar
                  style={{
                    position: 'absolute',
                    right: 12,
                    pointerEvents: 'none',
                    color: '#94a3b8'
                  }}
                  size={20}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Nº do Processo</label>
              <input type="text" name="numero_processo" value={formData.numero_processo} onChange={handleInputChange} placeholder="Ex: 1234567-89.2026.8.00.0000" maxLength={25} />
            </div>

            <div className="input-group">
              <label>Medida Cautelar</label>
              <select name="medida_cautelar" value={formData.medida_cautelar} onChange={handleInputChange} required>
                <option value="">Selecione...</option>
                <option value="Auto de prisão em flagrante">Auto de prisão em flagrante</option>
                <option value="Bloqueio">Bloqueio</option>
                <option value="Busca e apreensão">Busca e apreensão</option>
                <option value="Sequestro">Sequestro de bens</option>
              </select>
            </div>

            <div className="input-group">
              <label>Nº Cautelar</label>
              <input type="text" name="numero_cautelar" value={formData.numero_cautelar} onChange={handleInputChange} placeholder="Ex: 1234567-89.2026.8.00.0000" maxLength={25} />
            </div>

            <div className="input-group">
              <label>Valor Estimado (R$)</label>
              <input type="text" name="valor_estimado" value={formData.valor_estimado} onChange={handleInputChange} required placeholder="Ex: R$ 150.000,00" />
            </div>

          </div>

          <div className="form-grid-checkboxes">
            <div className="checkbox-group-container">
              <label>Resultados da Operação</label>
              <div className="checkbox-list">
                {['Apreensão', 'Bloqueio', 'Depósito', 'Indisponibilidades', 'Sequestro', 'Uso'].map(res => (
                  <label key={res} className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={resultados.includes(res)}
                      onChange={() => toggleCheckbox(setResultados, res)}
                    />
                    <span>{res}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="checkbox-group-container">
              <label>Tipos Apreendidos</label>
              <div className="checkbox-list">
                {BENS.map(tipo => (
                  <label key={tipo} className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={tiposApreendidos.includes(tipo)}
                      onChange={() => toggleCheckbox(setTiposApreendidos, tipo)}
                    />
                    <span>{tipo}</span>
                  </label>
                ))}
                <label key="Outros" className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={tiposApreendidos.includes('Outros')}
                    onChange={() => toggleCheckbox(setTiposApreendidos, 'Outros')}
                  />
                  <span>Outros</span>
                </label>
                {tiposApreendidos.includes('Outros') && (
                  <div style={{}}>
                    <textarea
                      value={outrosTipos}
                      onChange={(e) => setOutrosTipos(e.target.value)}
                      placeholder="Os tipos devem ser separados por vírgula"
                      style={{
                        width: '100%',
                        height: '60px',
                        padding: '9px 16px',
                        background: '#ffffff',
                        border: '1px solid #e4e4e7',
                        borderRadius: '8px',
                        color: '#09090b',
                        outline: 'none',
                        fontSize: '13px',
                        marginTop: '4px',
                        resize: 'none',
                        overflow: 'hidden',
                        lineHeight: '1.5',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="input-group full-width">
            <label>Descrição da Operação</label>
            <textarea
              name="descricao_operacao"
              value={formData.descricao_operacao}
              onChange={handleInputChange}
              required
              rows={4}
              style={{
                width: '100%',
                height: '60px',
                padding: '9px 16px',
                background: '#ffffff',
                border: '1px solid #e4e4e7',
                borderRadius: '8px',
                color: '#09090b',
                outline: 'none',
                fontSize: '15px',
                marginTop: '4px',
                resize: 'none',
                lineHeight: '1.5',
                fontFamily: 'inherit'
              }}
              placeholder="Descreva os detalhes da operação (no máximo 500 caracteres)"
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="submit-btn">
              <Save size={20} /> {loading ? 'Salvando...' : 'Salvar Formulário'}
            </button>
          </div>
        </form>
      </div>
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>
    </div>
  );
}
