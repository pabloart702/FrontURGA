import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#09090b', display: 'flex', alignItems: 'center', gap: '12px', margin: '0 0 8px 0' }}>
          <LayoutDashboard size={28} color="#09090b" />
          Dashboard
        </h2>
        <p style={{ color: '#71717a', fontSize: '15px', margin: 0 }}>Bem-vindo ao painel de controle, {user?.departamento || 'Usuário'}.</p>
      </div>

      <div style={{ 
        background: '#ffffff', 
        padding: '60px 40px', 
        borderRadius: '12px', 
        border: '1px dashed #d4d4d8',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#09090b', fontSize: '20px', marginBottom: '10px' }}>Área de Gráficos (Em Breve)</h3>
        <p style={{ color: '#71717a' }}>Neste local serão desenvolvidos os dashboards estatísticos, visões gerenciais e relatórios consolidados.</p>
      </div>
    </div>
  );
}
