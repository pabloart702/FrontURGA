import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, FileSearch, Activity, LogOut, User as UserIcon, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './MainLayout.css';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="main-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="urga-brand-sidebar">
            <h1>URGA</h1>
          </div>
          <span className="user-info">{user?.departamento || 'Usuário'}</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/documentos" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <FileText size={20} />
            <span>Documentos</span>
          </NavLink>

          <NavLink to="/apoios" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <FileSearch size={20} />
            <span>Apoios</span>
          </NavLink>

          <NavLink to="/recuperometro" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Activity size={20} />
            <span>Recuperômetro</span>
          </NavLink>

          <NavLink to="/perfil" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <UserIcon size={20} />
            <span>Perfil</span>
          </NavLink>

          {user?.role === 'Administrador' && (
            <NavLink to="/usuarios" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Users size={20} />
              <span>Usuários</span>
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
