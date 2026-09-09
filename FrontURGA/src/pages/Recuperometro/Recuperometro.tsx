import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity } from 'lucide-react';

export function Recuperometro() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#71717a', fontWeight: '500' }}
        >
          <ArrowLeft size={20} /> Voltar
        </button>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '40px', border: '1px solid #e4e4e7', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', background: '#f4f4f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
          <Activity size={32} color="#09090b" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#09090b', marginBottom: '8px' }}>Recuperômetro</h2>
        <p style={{ color: '#71717a', fontSize: '15px' }}>Painel estatístico de recuperação de ativos. Esta página está em construção.</p>
      </div>
    </div>
  );
}
