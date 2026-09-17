import { Activity } from 'lucide-react';

export function Recuperometro() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>


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
