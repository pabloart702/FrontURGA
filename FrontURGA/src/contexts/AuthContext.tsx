import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth';
import type { User } from '../types';

export interface UserPayload {
  id?: string;
  role: string;
  departamento: string;
  nome?: string;
}

interface AuthContextType {
  user: UserPayload | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
