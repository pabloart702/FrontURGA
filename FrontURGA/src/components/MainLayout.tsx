import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, FileSearch, Activity, LogOut, User as UserIcon, Users, ChevronLeft, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './MainLayout.css';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1000);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1000) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleNavClick = () => {
    if (window.innerWidth < 1000) {
      setIsOpen(false);
    }
  };

  return (
    <div className={`main-layout ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      
      {/* Barra superior no mobile */}
      <div className="mobile-top-bar">
        <button onClick={toggleSidebar} className="mobile-menu-btn">
          <Menu size={24} />
        </button>
        <h1 className="mobile-brand">URGA</h1>
      </div>

      {/* Overlay para mobile */}
      {!isOpen && window.innerWidth < 1000 ? null : (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>
      )}

      <aside className="sidebar">
        <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
          <ChevronLeft size={20} className={`toggle-icon ${!isOpen ? 'rotated' : ''}`} />
        </button>
        <div className="sidebar-header">
          <div className="urga-brand-sidebar">
            <h1>URGA</h1>
          </div>
          <span className="user-info">{user?.departamento || 'Usuário'}</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" onClick={handleNavClick} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/documentos" onClick={handleNavClick} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <FileText size={20} />
            <span>Documentos</span>
          </NavLink>

          <NavLink to="/apoios" onClick={handleNavClick} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <FileSearch size={20} />
            <span>Apoios</span>
          </NavLink>

          <NavLink to="/recuperometro" onClick={handleNavClick} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Activity size={20} />
            <span>Recuperômetro</span>
          </NavLink>

          <NavLink to="/perfil" onClick={handleNavClick} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <UserIcon size={20} />
            <span>Perfil</span>
          </NavLink>

          {user?.role === 'Administrador' && (
            <NavLink to="/usuarios" onClick={handleNavClick} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
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
