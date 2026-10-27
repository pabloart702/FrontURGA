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

  it('deve descartar respostas atrasadas (race conditions) ao alternar abas rapidamente', async () => {
    let resolvePendente: (value: unknown) => void = () => {};
    const pendentePromise = new Promise((resolve) => {
      resolvePendente = resolve;
    });

    const mockRealizadoForms = [
      {
        id: 'realizado-1',
        operacao: 'Operação Concluída',
        data_operacao: '2026-10-25',
        dataRealizado: '2026-10-26',
        status: 'realizado',
        departamento: 'TI',
      },
    ];

    vi.mocked(apoiosApi.getForms).mockImplementation((params) => {
      if (params?.status === 'pendente') {
        return pendentePromise as Promise<never>;
      }
      if (params?.status === 'realizado') {
        return Promise.resolve(mockRealizadoForms as never);
      }
      return Promise.resolve([] as never);
    });

    render(
      <MemoryRouter>
        <ApoiosContainer />
      </MemoryRouter>
    );

    // Clica primeiro em pendentes (dispara requisição lenta)
    const abaPendentes = screen.getByRole('button', { name: /pendentes/i });
    fireEvent.click(abaPendentes);

    // Imediatamente clica em realizados (dispara requisição rápida)
    const abaRealizados = screen.getByRole('button', { name: /realizados/i });
    fireEvent.click(abaRealizados);

    // Aguarda os dados de realizados serem exibidos na tela
    expect(await screen.findByText('Operação Concluída')).toBeInTheDocument();

    // Agora a requisição antiga de pendente finalmente resolve com dados de pendente
    resolvePendente([
      {
        id: 'pendente-antigo',
        operacao: 'Operação Pendente Atrasada',
        status: 'pendente',
      },
    ]);

    // Confirma que a resposta atrasada NÃO sobrepôs a aba atual
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.queryByText('Operação Pendente Atrasada')).not.toBeInTheDocument();
    expect(screen.getByText('Operação Concluída')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro se a busca falhar e recuperar atomicamente na troca de aba', async () => {
    vi.mocked(apoiosApi.getForms).mockRejectedValueOnce(new Error('Falha na rede'));

    render(
      <MemoryRouter>
        <ApoiosContainer />
      </MemoryRouter>
    );

    // A busca inicial de agenda falhou
    expect(await screen.findByRole('alert')).toHaveTextContent(/erro ao carregar os formulários/i);

    // Ao alternar para pendentes com sucesso, o erro é limpo atomicamente
    vi.mocked(apoiosApi.getForms).mockResolvedValueOnce([
      {
        id: 'pendente-ok',
        operacao: 'Operação Nova',
        status: 'pendente',
      },
    ] as never);

    const abaPendentes = screen.getByRole('button', { name: /pendentes/i });
    fireEvent.click(abaPendentes);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(await screen.findByText('Operação Nova')).toBeInTheDocument();
  });
});
