import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { DashboardMetricItem } from '../types/dashboard.types';

interface MetricBarChartProps {
  title: string;
  data: DashboardMetricItem[];
  /** Cor das barras em hexadecimal (ex: "#3b82f6"). */
  color: string;
  maxBarSize?: number;
  /** Inclina os rótulos do eixo X (útil para nomes longos). */
  tiltLabels?: boolean;
  /** Ocupa a linha inteira do grid. */
  fullWidth?: boolean;
}

const AXIS_TICK = { fill: '#71717a', fontSize: 12 };
const CHART_MARGIN = { top: 10, right: 10, left: -20, bottom: 20 };
const BAR_RADIUS: [number, number, number, number] = [4, 4, 0, 0];

export function MetricBarChart({
  title,
  data,
  color,
  maxBarSize = 50,
  tiltLabels = false,
  fullWidth = false,
}: MetricBarChartProps) {
  return (
    <div className={`dashboard-panel metric-chart${fullWidth ? ' metric-chart--full' : ''}`}>
      <h3 className="metric-chart-title">{title}</h3>
      <div className="metric-chart-body">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={CHART_MARGIN}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
              <XAxis
                dataKey="_id"
                axisLine={false}
                tickLine={false}
                tick={AXIS_TICK}
                {...(tiltLabels && { angle: -25, textAnchor: 'end' })}
              />
              <YAxis axisLine={false} tickLine={false} tick={AXIS_TICK} />
              <Tooltip
                cursor={{ fill: color, fillOpacity: 0.05 }}
                formatter={(value) => [value, 'Total']}
                labelStyle={{ color: '#09090b', fontWeight: 'bold' }}
              />
              <Bar dataKey="count" fill={color} radius={BAR_RADIUS} maxBarSize={maxBarSize} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="metric-chart-empty">Nenhum dado disponível.</p>
        )}
      </div>
    </div>
  );
}
