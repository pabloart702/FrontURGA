import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { MainLayout } from '../MainLayout';
import * as AuthContext from '../../hooks/useAuth';

describe('MainLayout Component', () => {
    it('deve renderizar a sidebar e o conteúdo', () => {
        // Mock do useAuth
        vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
            user: { departamento: 'TI', role: 'Administrador' },
            logout: vi.fn(),
            login: vi.fn(),
            isAuthenticated: true,
            isLoading: false
        });

        render(
            <MemoryRouter>
                <MainLayout>
                    <div data-testid="child-content">Conteúdo de Teste</div>
                </MainLayout>
            </MemoryRouter>
        );

        // Verifica a brand
        expect(screen.getAllByText('URGA')[0]).toBeInTheDocument();
        // Verifica o departamento do usuário
        expect(screen.getByText('TI')).toBeInTheDocument();
        
        // Verifica os links (básico)
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Documentos')).toBeInTheDocument();
        
        // Verifica o link de administradores
        expect(screen.getByText('Usuários')).toBeInTheDocument();

        // Verifica se o children foi renderizado
        expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    it('não deve mostrar link de Usuários se não for Administrador', () => {
        vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
            user: { departamento: 'TI', role: 'Comum' },
            logout: vi.fn(),
            login: vi.fn(),
            isAuthenticated: true,
            isLoading: false
        });

        render(
            <MemoryRouter>
                <MainLayout>
                    <div>Conteúdo</div>
                </MainLayout>
            </MemoryRouter>
        );

        expect(screen.queryByText('Usuários')).not.toBeInTheDocument();
    });
});
