import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as AuthContext from '../../../hooks/useAuth';
import type { User } from '../../../types';
import { perfilApi } from '../api/perfilApi';
import { PerfilContainer } from '../components/PerfilContainer';

vi.mock('../api/perfilApi', () => ({
  perfilApi: {
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
    updateUserProfile: vi.fn(),
    updateProfilePicture: vi.fn(),
    deleteProfilePicture: vi.fn(),
  },
}));

const mockUser: User = {
  id: 'user-123',
  nome: 'Agente Silva',
  email: 'silva@policiacivil.rn.gov.br',
  cpf: '12345678900',
  matricula: 'PC12345',
  cargo: 'Agente de Polícia',
  role: 'Usuário',
  departamento: 'URGA',
  status: 'Ativo',
  fotoPerfil: '',
};

describe('PerfilContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { id: 'user-123', role: 'Usuário', departamento: 'URGA', nome: 'Agente Silva' },
      login: vi.fn(),
      logout: vi.fn(),
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it('deve carregar e renderizar os dados do perfil do usuário', async () => {
    vi.mocked(perfilApi.getProfile).mockResolvedValueOnce(mockUser);

    render(<PerfilContainer />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Agente Silva')).toBeInTheDocument();
      expect(screen.getByDisplayValue('silva@policiacivil.rn.gov.br')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Agente de Polícia')).toBeInTheDocument();
    });

    // Usuário comum deve ter CPF e Matrícula desabilitados para edição
    expect(screen.getByDisplayValue('12345678900')).toBeDisabled();
    expect(screen.getByDisplayValue('PC12345')).toBeDisabled();
  });

  it('deve permitir editar e salvar as alterações do perfil', async () => {
    vi.mocked(perfilApi.getProfile).mockResolvedValueOnce(mockUser);
    vi.mocked(perfilApi.updateProfile).mockResolvedValueOnce({
      ...mockUser,
      cargo: 'Agente Especial',
    });

    render(<PerfilContainer />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Agente de Polícia')).toBeInTheDocument();
    });

    const cargoInput = screen.getByDisplayValue('Agente de Polícia');
    fireEvent.change(cargoInput, { target: { value: 'Agente Especial' } });

    const submitBtn = screen.getByRole('button', { name: /salvar alterações/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(perfilApi.updateProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: 'Agente Silva',
          email: 'silva@policiacivil.rn.gov.br',
          cargo: 'Agente Especial',
        }),
      );
      expect(screen.getByText('Perfil atualizado com sucesso!')).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem de erro se a atualização falhar', async () => {
    vi.mocked(perfilApi.getProfile).mockResolvedValueOnce(mockUser);
    vi.mocked(perfilApi.updateProfile).mockRejectedValueOnce(new Error('Erro de validação'));

    render(<PerfilContainer />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Agente Silva')).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole('button', { name: /salvar alterações/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Erro ao atualizar o perfil. Tente novamente.',
      );
    });
  });

  it('deve limpar mensagem de erro atomicamente ao tentar salvar o perfil novamente (Discriminated Union)', async () => {
    vi.mocked(perfilApi.getProfile).mockResolvedValueOnce(mockUser);
    vi.mocked(perfilApi.updateProfile).mockRejectedValueOnce(new Error('Erro inicial'));

    render(<PerfilContainer />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Agente Silva')).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole('button', { name: /salvar alterações/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    let resolvePromise: (value: User) => void;
    const pendingPromise = new Promise<User>((resolve) => {
      resolvePromise = resolve;
    });
    vi.mocked(perfilApi.updateProfile).mockReturnValueOnce(pendingPromise);

    fireEvent.click(submitBtn);

    // O alerta de erro anterior deve sumir no instante do novo submit
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvando\.\.\./i })).toBeDisabled();

    resolvePromise!(mockUser);
    await waitFor(() => {
      expect(screen.getByText('Perfil atualizado com sucesso!')).toBeInTheDocument();
    });
  });

  it('deve habilitar campos privilegiados se o usuário for Administrador', async () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { id: 'admin-1', role: 'Administrador', departamento: 'DIESP', nome: 'Delegado Chefe' },
      login: vi.fn(),
      logout: vi.fn(),
      isAuthenticated: true,
      isLoading: false,
    });

    vi.mocked(perfilApi.getProfile).mockResolvedValueOnce({
      ...mockUser,
      role: 'Administrador',
    });

    render(<PerfilContainer />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('12345678900')).toBeEnabled();
      expect(screen.getByDisplayValue('PC12345')).toBeEnabled();
      expect(screen.getByDisplayValue('URGA')).toBeEnabled();
    });
  });
});
