import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { SolicitacaoApoio } from './pages/Apoios/SolicitacaoApoio';
import { Apoios } from './pages/Apoios/Apoios';
import { VisualizarPedido } from './pages/Apoios/VisualizarPedido';
import { Documentos } from './pages/Documentos/Documentos';
import { Recuperometro } from './pages/Recuperometro/Recuperometro';
import { Perfil } from './pages/Perfil/Perfil';
import { UsuariosList } from './pages/Usuarios/UsuariosList';
import { UsuarioEdit } from './pages/Usuarios/UsuarioEdit';
import { MainLayout } from './components/MainLayout';
import './index.css';

function ProtectedRoute() {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Aguarda a validação da sessão com o servidor antes de redirecionar.
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#71717a', fontSize: '15px' }}>
        Verificando sessão...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const hasValidRole = user.role === 'Usuário' || user.role === 'Administrador' || user.role === 'Admin';
  if (!hasValidRole) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

function AdminRoute() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#71717a', fontSize: '15px' }}>
        Verificando sessão...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'Administrador') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Rotas Protegidas (Compartilham o mesmo MainLayout) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/apoios" element={<Apoios />} />
        <Route path="/solicitacao-apoio" element={<SolicitacaoApoio />} />
        <Route path="/visualizar-pedido/:id" element={<VisualizarPedido />} />
        <Route path="/documentos" element={<Documentos />} />
        <Route path="/recuperometro" element={<Recuperometro />} />
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      {/* Rotas de Admin (Compartilham o mesmo MainLayout) */}
      <Route element={<AdminRoute />}>
        <Route path="/usuarios" element={<UsuariosList />} />
        <Route path="/usuarios/:id" element={<UsuarioEdit />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
