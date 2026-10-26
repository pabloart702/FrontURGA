import { createContext } from 'react';

export interface UserPayload {
  id?: string;
  role: string;
  departamento: string;
  nome?: string;
}

export interface AuthContextType {
  user: UserPayload | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
