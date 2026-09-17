import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, AlertCircle, FileCheck, FileSearch, DollarSign } from 'lucide-react';
import { formsService } from '../../services/forms';
import { usersService } from '../../services/users';
import type { DashboardMetrics } from '../../services/forms';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        const [metrics, profileData] = await Promise.all([
          formsService.getDashboardMetrics(),
          user?.id ? usersService.getProfile().catch(() => null) : Promise.resolve(null)
        ]);

        setData(metrics);
        if (profileData && profileData.nome) {
          setUserName(profileData.nome);
        }
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar métricas:', err);
        setError('Não foi possível carregar os dados do dashboard.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatCustomTooltip = (value: any) => [value, 'Total'];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ color: '#71717a', fontSize: '16px' }}>Carregando estatísticas...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
        <AlertCircle size={48} color="#ef4444" />
        <p style={{ color: '#ef4444', fontSize: '16px', fontWeight: '500' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#09090b', display: 'flex', alignItems: 'center', gap: '12px', margin: '0 0 8px 0' }}>
          <LayoutDashboard size={28} color="#09090b" />
          Dashboard Global
        </h2>
        <p style={{ color: '#71717a', fontSize: '15px', margin: 0 }}>
          Bem-vindo, {userName || 'Usuário'}. Visão geral consolidada do sistema.
        </p>
      </div>

      {/* Resumo em Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {/* Card 1 */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
            <FileSearch size={28} />
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#71717a', fontWeight: '500' }}>Apoios Solicitados</p>
            <h3 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#09090b' }}>{data.apoiosSolicitados}</h3>
          </div>
        </div>

        {/* Card 2 */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
            <FileCheck size={28} />
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#71717a', fontWeight: '500' }}>Apoios Prestados</p>
            <h3 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#09090b' }}>{data.apoiosPrestados}</h3>
          </div>
        </div>

        {/* Card 3 */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>
            <DollarSign size={28} />
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#71717a', fontWeight: '500' }}>Valor Total Estimado</p>
            <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#09090b' }}>{formatCurrency(data.totalValorEstimado)}</h3>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>

        {/* Gráfico 1: Delegacias */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e4e4e7' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '600', color: '#09090b' }}>Top Delegacias Solicitantes</h3>
          <div style={{ height: '300px' }}>
            {data.delegaciasMaisSolicitam.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.delegaciasMaisSolicitam} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} angle={-25} textAnchor="end" />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'rgba(212, 175, 55, 0.05)' }} formatter={formatCustomTooltip} labelStyle={{ color: '#09090b', fontWeight: 'bold' }} />
                  <Bar dataKey="count" fill="#d4af37" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ textAlign: 'center', color: '#a1a1aa', marginTop: '100px' }}>Nenhum dado disponível.</p>
            )}
          </div>
        </div>

        {/* Gráfico 2: Tipos Apreendidos */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e4e4e7' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '600', color: '#09090b' }}>Tipos Mais Apreendidos</h3>
          <div style={{ height: '300px' }}>
            {data.tiposMaisApreendidos.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.tiposMaisApreendidos} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} angle={-25} textAnchor="end" />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} formatter={formatCustomTooltip} labelStyle={{ color: '#09090b', fontWeight: 'bold' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ textAlign: 'center', color: '#a1a1aa', marginTop: '100px' }}>Nenhum dado disponível.</p>
            )}
          </div>
        </div>

        {/* Gráfico 3: Resultados Mais Comuns */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e4e4e7', gridColumn: '1 / -1' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '600', color: '#09090b' }}>Resultados Mais Comuns</h3>
          <div style={{ height: '300px' }}>
            {data.resultadosMaisComuns.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.resultadosMaisComuns} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'rgba(34, 197, 94, 0.05)' }} formatter={formatCustomTooltip} labelStyle={{ color: '#09090b', fontWeight: 'bold' }} />
                  <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={80} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ textAlign: 'center', color: '#a1a1aa', marginTop: '100px' }}>Nenhum dado disponível.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
