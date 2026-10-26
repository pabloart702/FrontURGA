import { DollarSign, FileCheck, FileSearch, LayoutDashboard } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import type { DashboardData } from '../types/dashboard.types';
import { MetricBarChart } from './MetricBarChart';
import { MetricCard } from './MetricCard';

interface DashboardViewProps {
  data: DashboardData;
}

/** Componente de apresentação: apenas renderiza os dados recebidos. */
export function DashboardView({ data }: DashboardViewProps) {
  const { metrics, userName } = data;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2 className="dashboard-title">
          <LayoutDashboard size={28} color="#09090b" />
          Dashboard dos apoios prestados
        </h2>
        <p className="dashboard-subtitle">Bem-vindo, {userName || 'Usuário'}.</p>
      </header>

      <section className="dashboard-cards">
        <MetricCard
          label="Apoios solicitados"
          value={metrics.apoiosSolicitados}
          icon={<FileSearch size={28} />}
          accentColor="#3b82f6"
        />
        <MetricCard
          label="Apoios prestados"
          value={metrics.apoiosPrestados}
          icon={<FileCheck size={28} />}
          accentColor="#22c55e"
        />
        <MetricCard
          label="Valor total estimado"
          value={formatCurrency(metrics.totalValorEstimado)}
          icon={<DollarSign size={28} />}
          accentColor="#d4af37"
          compact
        />
      </section>

      <section className="dashboard-charts">
        <MetricBarChart
          title="Ranking de unidades por solicitações"
          data={metrics.delegaciasMaisSolicitam}
          color="#d4af37"
          tiltLabels
        />
        <MetricBarChart
          title="Tipos de bens mais apreendidos"
          data={metrics.tiposMaisApreendidos}
          color="#3b82f6"
          tiltLabels
        />
        <MetricBarChart
          title="Principais resultados de operações"
          data={metrics.resultadosMaisComuns}
          color="#22c55e"
          maxBarSize={80}
          fullWidth
        />
      </section>
    </div>
  );
}
