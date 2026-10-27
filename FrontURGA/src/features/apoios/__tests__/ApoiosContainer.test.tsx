import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ApoiosContainer } from '../components/ApoiosContainer';
import { apoiosApi } from '../api/apoiosApi';
import * as AuthContext from '../../../hooks/useAuth';
import type { User } from '../../../types';

vi.mock('../api/apoiosApi', () => ({
  apoiosApi: {
    getForms: vi.fn(),
  },
}));

describe('ApoiosContainer Component - Ordenação das abas', () => {
  const mockUser: User = {
    id: '1',
    nome: 'Admin',
    email: 'admin@teste.com',
    cpf: '12345678900',
    matricula: '001',
    cargo: 'Delegado',
    role: 'Administrador',
    departamento: 'TI',
    status: 'Ativo',
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(apoiosApi.getForms).mockResolvedValue([]);
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: mockUser,
      login: vi.fn(),
      logout: vi.fn(),
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it('deve buscar solicitações pendentes com ordenação data_operacao asc', async () => {
    render(
      <MemoryRouter>
        <ApoiosContainer />
      </MemoryRouter>
    );

    const abaPendentes = screen.getByRole('button', { name: /pendentes/i });
    fireEvent.click(abaPendentes);

    await waitFor(() => {
      expect(apoiosApi.getForms).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'pendente',
          sortBy: 'data_operacao',
          sortOrder: 'asc',
        })
      );
    });
  });

  it('deve buscar solicitações cientes com ordenação data_operacao asc', async () => {
    render(
      <MemoryRouter>
        <ApoiosContainer />
      </MemoryRouter>
    );

    const abaCientes = screen.getByRole('button', { name: /cientes/i });
    fireEvent.click(abaCientes);

    await waitFor(() => {
      expect(apoiosApi.getForms).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'ciente',
          sortBy: 'data_operacao',
          sortOrder: 'asc',
        })
      );
    });
  });

  it('deve buscar solicitações realizadas com ordenação dataRealizado desc', async () => {
    render(
      <MemoryRouter>
        <ApoiosContainer />
      </MemoryRouter>
    );

    const abaRealizados = screen.getByRole('button', { name: /realizados/i });
    fireEvent.click(abaRealizados);

    await waitFor(() => {
      expect(apoiosApi.getForms).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'realizado',
          sortBy: 'dataRealizado',
          sortOrder: 'desc',
        })
      );
    });
  });

  it('deve buscar todas as solicitações (sem status) na aba agenda com ordenação data_operacao desc', async () => {
    render(
      <MemoryRouter>
        <ApoiosContainer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(apoiosApi.getForms).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 100,
          page: 1,
          sortBy: 'data_operacao',
          sortOrder: 'desc',
        })
      );
    });
  });
});
