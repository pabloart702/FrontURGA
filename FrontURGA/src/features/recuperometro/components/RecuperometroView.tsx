import { Activity } from 'lucide-react';
import './Recuperometro.css';

export function RecuperometroView() {
  return (
    <div className="recuperometro-container">
      <div className="recuperometro-card">
        <div className="recuperometro-icon-wrapper">
          <Activity size={32} color="#09090b" />
        </div>
        <h2 className="recuperometro-title">Recuperômetro</h2>
        <p className="recuperometro-description">
          Painel estatístico de recuperação de ativos. Esta página está em construção.
        </p>
      </div>
    </div>
  );
}
