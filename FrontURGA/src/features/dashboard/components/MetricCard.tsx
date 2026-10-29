import type { CSSProperties, ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  /** Cor de destaque do ícone (o fundo usa a mesma cor com 10% de opacidade). */
  accentColor: string;
  compact?: boolean;
}

export function MetricCard({ label, value, icon, accentColor, compact = false }: MetricCardProps) {
  const accentStyle = { '--accent': accentColor } as CSSProperties;

  return (
    <div className="dashboard-panel metric-card">
      <div className="metric-card-icon" style={accentStyle}>
        {icon}
      </div>
      <div className="metric-card-content">
        <p className="metric-card-label">{label}</p>
        <h3 className={`metric-card-value${compact ? ' metric-card-value--compact' : ''}`}>{value}</h3>
      </div>
    </div>
  );
}
