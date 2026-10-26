import { AlertCircle } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardView } from './DashboardView';
import './Dashboard.css';

/** Container: obtém o estado via hook e decide o que renderizar em cada fase. */
export function DashboardContainer() {
  const state = useDashboard();

  switch (state.status) {
    case 'idle':
    case 'loading':
      return (
        <div className="dashboard-status">
          <p className="dashboard-status-text">Carregando estatísticas...</p>
        </div>
      );
    case 'error':
      return (
        <div className="dashboard-status" role="alert">
          <AlertCircle size={48} color="#ef4444" />
          <p className="dashboard-status-text dashboard-status-text--error">{state.message}</p>
        </div>
      );
    case 'success':
      return <DashboardView data={state.data} />;
  }
}
