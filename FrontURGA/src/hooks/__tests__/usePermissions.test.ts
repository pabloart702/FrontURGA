import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { usePermissions } from '../usePermissions';
import * as AuthHook from '../useAuth';

vi.mock('../useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('usePermissions Hook', () => {
  it('deve retornar permissões corretas para Administrador', () => {
    vi.spyOn(AuthHook, 'useAuth').mockReturnValue({
      user: { id: '1', role: 'Administrador' } as never,
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    const { result } = renderHook(() => usePermissions());
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isComum).toBe(false);
    expect(result.current.canManageUsers).toBe(true);
    expect(result.current.canEditPrivilegedFields).toBe(true);
    expect(result.current.hasValidRole).toBe(true);
  });

  it('deve retornar permissões corretas para Usuário comum', () => {
    vi.spyOn(AuthHook, 'useAuth').mockReturnValue({
      user: { id: '2', role: 'Usuário' } as never,
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    const { result } = renderHook(() => usePermissions());
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isComum).toBe(true);
    expect(result.current.canManageUsers).toBe(false);
    expect(result.current.canEditPrivilegedFields).toBe(false);
    expect(result.current.hasValidRole).toBe(true);
  });

  it('deve tratar usuário sem role ou não autenticado', () => {
    vi.spyOn(AuthHook, 'useAuth').mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    const { result } = renderHook(() => usePermissions());
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isComum).toBe(false);
    expect(result.current.hasValidRole).toBe(false);
  });
});
