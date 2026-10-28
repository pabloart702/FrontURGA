import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useParams } from 'react-router-dom';
import { VisualizarPedidoContainer } from '../components/VisualizarPedidoContainer';
import * as AuthContext from '../../../hooks/useAuth';
import { apoiosApi } from '../api/apoiosApi';
import type { User, Form } from '../../../types';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../api/apoiosApi', () => ({
  apoiosApi: {
    getFormById: vi.fn(),
    updateStatus: vi.fn(),
  },
}));

describe('VisualizarPedidoContainer Component', () => {
  const mockUser: User = {
    id: '1',
    nome: 'Admin',
    email: 'admin@teste.com',
    cpf: '12345678900',
    matricula: '001',
    cargo: 'Delegado',
    role: 'Administrador',
    departamento: 'URGA',
    status: 'Ativo',
  };

  const mockForm: Form = {
    id: '10',
    departamento: 'URGA',
    operacao: 'Operação Falcão',
    data_operacao: '01/01/2026',
    numero_processo: '0001234-56.2026.8.00.0000',
    medida_cautelar: 'Busca e apreensão',
    numero_cautelar: '0004321-12.2026.8.00.0000',
    valor_estimado: 50000,
    descricao_operacao: 'Apreensão de bens ilegais',
    resultados: ['Apreensão', 'Bloqueio'],
    tipos_apreendidos: ['Veículos', 'Eletrônicos'],
    status: 'pendente',
    criador: '1',
    createdAt: '2026-05-10T10:00:00.000Z',
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useParams).mockReturnValue({ id: '10' });
    vi.mocked(apoiosApi.getFormById).mockResolvedValue(mockForm);
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: mockUser,
      login: vi.fn(),
      logout: vi.fn(),
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it('deve carregar e exibir os detalhes da operação', async () => {
    render(
      <MemoryRouter>
        <VisualizarPedidoContainer />
      </MemoryRouter>
    );

    expect(screen.getByText('Carregando detalhes...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Operação Falcão')).toBeInTheDocument();
      expect(screen.getByText('0001234-56.2026.8.00.0000')).toBeInTheDocument();
      expect(screen.getByText('Busca e apreensão')).toBeInTheDocument();
      expect(screen.getByText('Apreensão de bens ilegais')).toBeInTheDocument();
      expect(screen.getByText('Data da Solicitação')).toBeInTheDocument();
    });
  });

  it('deve permitir atualizar o status da operação quando for administrador', async () => {
    vi.mocked(apoiosApi.updateStatus).mockResolvedValueOnce({
      ...mockForm,
      status: 'ciente',
    });

    render(
      <MemoryRouter>
        <VisualizarPedidoContainer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Operação Falcão')).toBeInTheDocument();
    });

    const selectStatus = screen.getByLabelText(/atualizar status do pedido/i);
    fireEvent.change(selectStatus, { target: { value: 'ciente' } });

    await waitFor(() => {
      expect(apoiosApi.updateStatus).toHaveBeenCalledWith('10', 'ciente');
      expect(screen.getByText('Status atualizado com sucesso.')).toBeInTheDocument();
    });
  });

  it('deve acionar a impressão do relatório', async () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <VisualizarPedidoContainer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Operação Falcão')).toBeInTheDocument();
    });

    const printBtn = screen.getByRole('button', { name: /relatório da solicitação/i });
    fireEvent.click(printBtn);

    expect(printSpy).toHaveBeenCalled();
  });

  it('deve navegar de volta para /apoios ao clicar no botão voltar', async () => {
    render(
      <MemoryRouter>
        <VisualizarPedidoContainer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Operação Falcão')).toBeInTheDocument();
    });

    const backBtn = screen.getByRole('button', { name: /voltar/i });
    fireEvent.click(backBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/apoios', {
      state: { returnTab: 'pendente' },
    });
  });

  it('deve exibir mensagem de erro se a busca falhar', async () => {
    vi.mocked(apoiosApi.getFormById).mockRejectedValueOnce(new Error('Falha de rede'));

    render(
      <MemoryRouter>
        <VisualizarPedidoContainer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar os detalhes do pedido.')).toBeInTheDocument();
    });
  });
});
