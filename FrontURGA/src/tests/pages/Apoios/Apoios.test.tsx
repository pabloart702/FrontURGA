import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Apoios } from '../../../pages/Apoios/Apoios';
import { formsService } from '../../../services/forms';

vi.mock('../../../services/forms', () => ({
  formsService: {
    getForms: vi.fn(),
  }
}));

describe('Apoios Component - Ordenação das abas', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(formsService.getForms).mockResolvedValue([]);
  });

  it('deve buscar solicitações pendentes com ordenação data_operacao asc', async () => {
    render(
      <MemoryRouter>
        <Apoios />
      </MemoryRouter>
    );

    // Na montagem, a aba inicial é "pendente"
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
});
