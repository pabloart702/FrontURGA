import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apoiosApi } from '../api/apoiosApi';
import { UNIDADES_POLICIAIS } from '../../../constants/unidades';
import { getApiErrorMessage, isNetworkError } from '../../../utils/errorMessages';
import type { SolicitacaoFormData } from '../types/apoios.types';
import type { UserPayload } from '../../../providers/authContext';

interface UseSolicitacaoApoioProps {
  user: UserPayload | null;
}

export function useSolicitacaoApoio({ user }: UseSolicitacaoApoioProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<SolicitacaoFormData>(() => ({
    departamento: user && user.role === 'Usuário' && user.departamento ? user.departamento : '',
    operacao: '',
    data_operacao: '',
    numero_processo: '',
    medida_cautelar: '',
    numero_cautelar: '',
    descricao_operacao: '',
    valor_estimado: '',
  }));

  const [resultados, setResultados] = useState<string[]>([]);
  const [tiposApreendidos, setTiposApreendidos] = useState<string[]>([]);
  const [outrosTipos, setOutrosTipos] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'data_operacao') {
      let v = value.replace(/\D/g, '');
      if (v.length > 8) v = v.substring(0, 8);
      if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2);
      if (v.length > 5) v = v.substring(0, 5) + '/' + v.substring(5, 9);
      setFormData((prev) => ({ ...prev, [name]: v }));
      return;
    }

    if (name === 'numero_processo' || name === 'numero_cautelar') {
      let v = value.replace(/\D/g, '');
      if (v.length > 20) v = v.substring(0, 20);

      if (v.length > 7) v = v.substring(0, 7) + '-' + v.substring(7);
      if (v.length > 10) v = v.substring(0, 10) + '.' + v.substring(10);
      if (v.length > 15) v = v.substring(0, 15) + '.' + v.substring(15);
      if (v.length > 17) v = v.substring(0, 17) + '.' + v.substring(17);
      if (v.length > 20) v = v.substring(0, 20) + '.' + v.substring(20);

      setFormData((prev) => ({ ...prev, [name]: v }));
      return;
    }

    if (name === 'valor_estimado') {
      const v = value.replace(/\D/g, '');
      if (v) {
        const amount = Number(v) / 100;
        const formatted = amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        setFormData((prev) => ({ ...prev, [name]: formatted }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: '' }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const setDateFromPicker = (dateValue: string) => {
    if (!dateValue) return;
    const [y, m, d] = dateValue.split('-');
    setFormData((prev) => ({ ...prev, data_operacao: `${d}/${m}/${y}` }));
  };

  const toggleResultado = (value: string) => {
    setResultados((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const toggleTipoApreendido = (value: string) => {
    setTiposApreendidos((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
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
        finalTiposApreendidos = finalTiposApreendidos.filter((t) => t !== 'Outros');
        if (outrosTipos.trim()) {
          const customTipos = outrosTipos.split(',').map((t) => t.trim());
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
        tipos_apreendidos: finalTiposApreendidos,
      };

      await apoiosApi.createForm(payload);
      alert('Formulário cadastrado com sucesso!');
      navigate('/apoios');
    } catch (err: unknown) {
      if (isNetworkError(err)) {
        setError('Erro de conexão. A API pode estar offline.');
      } else {
        setError(
          getApiErrorMessage(
            err,
            'Erro ao criar formulário. Verifique os dados e tente novamente.'
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    resultados,
    tiposApreendidos,
    outrosTipos,
    loading,
    error,
    handleInputChange,
    setDateFromPicker,
    setOutrosTipos,
    toggleResultado,
    toggleTipoApreendido,
    handleSubmit,
  };
}
