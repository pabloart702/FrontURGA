import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth';
import type { User } from '../types';
import { AuthContext, type UserPayload } from './authContext';

function mapUserToPayload(serverUser: User): UserPayload {
  return {
    id: serverUser.id,
    role: serverUser.role,
    departamento: serverUser.departamento,
    nome: serverUser.nome,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initSession = async () => {
      try {
        const serverUser = await authService.me();
        setUser(mapUserToPayload(serverUser));
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initSession();
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => logout();
    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, [logout]);

  const login = async (email: string, pass: string): Promise<void> => {
    await authService.login(email, pass); // backend emite o cookie HttpOnly
    const serverUser = await authService.me();
    setUser(mapUserToPayload(serverUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
