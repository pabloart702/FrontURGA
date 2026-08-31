import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PlusCircle, LogOut, LayoutDashboard, FileSearch } from 'lucide-react';

export function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '30px', color: 'white', fontFamily: 'sans-serif', minHeight: '100vh', background: '#0f172a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '20px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <LayoutDashboard size={24} color="#3b82f6" />
          Dashboard
        </h2>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => navigate('/apoios')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            <FileSearch size={18} /> Ver Apoios
          </button>

          <button 
            onClick={() => navigate('/solicitacao-apoio')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            <PlusCircle size={18} /> Nova Solicitação
          </button>
          
          <button 
            onClick={logout}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <div style={{ 
          background: 'rgba(30, 41, 59, 0.6)', 
          padding: '60px 40px', 
          borderRadius: '16px', 
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#cbd5e1', fontSize: '20px', marginBottom: '10px' }}>Área de Gráficos (Em Breve)</h3>
          <p style={{ color: '#64748b' }}>Neste local serão desenvolvidos os dashboards estatísticos, visões gerenciais e relatórios consolidados.</p>
        </div>
      </div>
    </div>
  );
}
