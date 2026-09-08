import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { SolicitacaoApoio } from './pages/SolicitacaoApoio';
import { Apoios } from './pages/Apoios';
import { VisualizarPedido } from './pages/VisualizarPedido';
import { Documentos } from './pages/Documentos';
import { Recuperometro } from './pages/Recuperometro';
import { Perfil } from './pages/Perfil';
import { UsuariosList } from './pages/UsuariosList';
import { UsuarioEdit } from './pages/UsuarioEdit';
import { MainLayout } from './components/MainLayout';
import type { ReactNode } from 'react';
import './index.css';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();

  // Regra de necessidade do token JWT
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Permissão de ser Usuário ou Administrador
  const hasValidRole = user.role === 'Usuário' || user.role === 'Administrador' || user.role === 'Admin';
  if (!hasValidRole) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
}

function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'Administrador') {
    return <Navigate to="/dashboard" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/apoios" element={<ProtectedRoute><Apoios /></ProtectedRoute>} />
      <Route path="/solicitacao-apoio" element={<ProtectedRoute><SolicitacaoApoio /></ProtectedRoute>} />
      <Route path="/visualizar-pedido/:id" element={<ProtectedRoute><VisualizarPedido /></ProtectedRoute>} />
      <Route path="/documentos" element={<ProtectedRoute><Documentos /></ProtectedRoute>} />
      <Route path="/recuperometro" element={<ProtectedRoute><Recuperometro /></ProtectedRoute>} />
      <Route path="/perfil" element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        } />
        
        <Route path="/usuarios" element={
          <AdminRoute>
            <UsuariosList />
          </AdminRoute>
        } />

        <Route path="/usuarios/:id" element={
          <AdminRoute>
            <UsuarioEdit />
          </AdminRoute>
        } />

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
