import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { SolicitacaoApoio } from './pages/SolicitacaoApoio';
import { Apoios } from './pages/Apoios';
import { VisualizarPedido } from './pages/VisualizarPedido';
import type { ReactNode } from 'react';
import './index.css';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apoios"
        element={
          <ProtectedRoute>
            <Apoios />
          </ProtectedRoute>
        }
      />
      <Route
        path="/solicitacao-apoio"
        element={
          <ProtectedRoute>
            <SolicitacaoApoio />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visualizar-pedido/:id"
        element={
          <ProtectedRoute>
            <VisualizarPedido />
          </ProtectedRoute>
        }
      />
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
