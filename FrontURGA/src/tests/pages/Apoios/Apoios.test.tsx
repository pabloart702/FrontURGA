import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Apoios } from '../../../pages/Apoios/Apoios';
import { formsService } from '../../../services/forms';
import * as AuthContext from '../../../contexts/AuthContext';

vi.mock('../../../services/forms', () => ({
  formsService: {
    getForms: vi.fn(),
  }
}));

describe('Apoios Component - Ordenação das abas', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(formsService.getForms).mockResolvedValue([]);
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { departamento: 'TI', role: 'Administrador' },
      login: vi.fn(),
      logout: vi.fn(),
      isAuthenticated: true,
      isLoading: false
    } as any);
  });

  it('deve buscar solicitações pendentes com ordenação data_operacao asc', async () => {
    render(
      <MemoryRouter>
        <Apoios />
      </MemoryRouter>
    );

    // Clica na aba pendentes (já que a inicial agora é agenda)
    const abaPendentes = screen.getByRole('button', { name: /pendentes/i });
    fireEvent.click(abaPendentes);

    await waitFor(() => {
      expect(formsService.getForms).toHaveBeenCalledWith(expect.objectContaining({
        status: 'pendente',
        sortBy: 'data_operacao',
        sortOrder: 'asc'
      }));
    });
  });

  it('deve buscar solicitações cientes com ordenação data_operacao asc', async () => {
    render(
      <MemoryRouter>
        <Apoios />
      </MemoryRouter>
    );

    // Clica na aba cientes
    const abaCientes = screen.getByRole('button', { name: /cientes/i });
    fireEvent.click(abaCientes);

    await waitFor(() => {
      expect(formsService.getForms).toHaveBeenCalledWith(expect.objectContaining({
        status: 'ciente',
        sortBy: 'data_operacao',
        sortOrder: 'asc'
      }));
    });
  });

  it('deve buscar solicitações realizadas com ordenação dataRealizado desc', async () => {
    render(
      <MemoryRouter>
        <Apoios />
      </MemoryRouter>
    );

    // Clica na aba realizados
    const abaRealizados = screen.getByRole('button', { name: /realizados/i });
    fireEvent.click(abaRealizados);

    await waitFor(() => {
      expect(formsService.getForms).toHaveBeenCalledWith(expect.objectContaining({
        status: 'realizado',
        sortBy: 'dataRealizado',
        sortOrder: 'desc'
      }));
    });
  });

  it('deve buscar todas as solicitações (sem status) na aba agenda com ordenação data_operacao asc', async () => {
    render(
      <MemoryRouter>
        <Apoios />
      </MemoryRouter>
    );

    // Na montagem, a aba inicial é "agenda"
    await waitFor(() => {
      expect(formsService.getForms).toHaveBeenCalledWith(expect.objectContaining({
        limit: 100,
        page: 1,
        sortBy: 'data_operacao',
        sortOrder: 'desc'
      }));
    });
  });
});
