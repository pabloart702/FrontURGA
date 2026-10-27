import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { UsuariosListContainer } from '../components/UsuariosListContainer';
import { usuariosApi } from '../api/usuariosApi';
import type { User } from '../types/usuarios.types';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('../api/usuariosApi', () => ({
  usuariosApi: {
    getUsers: vi.fn(),
  },
}));

describe('UsuariosListContainer Component', () => {
  const mockNavigate = vi.fn();

  const mockUsers: User[] = [
    {
      id: '1',
      nome: 'Carlos Agente',
      email: 'carlos@teste.com',
      cpf: '11122233344',
      matricula: '101',
      cargo: 'Agente',
      departamento: 'URGA',
      status: 'Ativo',
      role: 'Usuário',
    },
    {
      id: '2',
      nome: 'Mariana Delegada',
      email: 'mariana@teste.com',
      cpf: '55566677788',
      matricula: '102',
      cargo: 'Delegado',
      departamento: 'DEGEPOLI',
      status: 'Inativo',
      role: 'Administrador',
    },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(usuariosApi.getUsers).mockResolvedValue({
      data: mockUsers,
      totalPages: 2,
      currentPage: 1,
    });
  });

  it('deve carregar e renderizar a lista de usuários e paginação', async () => {
    render(
      <MemoryRouter>
        <UsuariosListContainer />
      </MemoryRouter>
    );

    expect(screen.getByText('Carregando usuários...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Carlos Agente')).toBeInTheDocument();
      expect(screen.getByText('Mariana Delegada')).toBeInTheDocument();
    });

    expect(screen.getByText('Página 1 de 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /próxima/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /anterior/i })).toBeDisabled();
  });

  it('deve navegar para a página de detalhes ao clicar no card do usuário', async () => {
    render(
      <MemoryRouter>
        <UsuariosListContainer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Carlos Agente')).toBeInTheDocument();
    });

    const userCard = screen.getByText('Carlos Agente').closest('.usuario-card')!;
    fireEvent.click(userCard);

    expect(mockNavigate).toHaveBeenCalledWith('/usuarios/1');
  });

  it('deve permitir filtrar por pesquisa de texto', async () => {
    render(
      <MemoryRouter>
        <UsuariosListContainer />
      </MemoryRouter>
    );

    const searchInput = screen.getByLabelText(/pesquisar usuários/i);
    fireEvent.change(searchInput, { target: { value: 'Mariana' } });

    await waitFor(
      () => {
        expect(usuariosApi.getUsers).toHaveBeenCalledWith(1, 'Mariana', '');
      },
      { timeout: 1000 }
    );
  });

  it('deve exibir mensagem de estado vazio quando nenhum usuário for retornado', async () => {
    vi.mocked(usuariosApi.getUsers).mockResolvedValueOnce({
      data: [],
      totalPages: 0,
      currentPage: 1,
    });

    render(
      <MemoryRouter>
        <UsuariosListContainer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Nenhum usuário encontrado.')).toBeInTheDocument();
    });
  });

  it('deve descartar respostas atrasadas (race conditions) ao alterar a busca rapidamente', async () => {
    let resolveFirstSearch: (value: unknown) => void = () => {};
    const firstSearchPromise = new Promise((resolve) => {
      resolveFirstSearch = resolve;
    });

    vi.mocked(usuariosApi.getUsers).mockImplementation((_page, search) => {
      if (search === 'Carlos') {
        return firstSearchPromise as Promise<never>;
      }
      if (search === 'Mariana') {
        return Promise.resolve({
          data: [mockUsers[1]], // Mariana Delegada
          totalPages: 1,
          currentPage: 1,
        } as never);
      }
      return Promise.resolve({ data: mockUsers, totalPages: 1, currentPage: 1 } as never);
    });

    render(
      <MemoryRouter>
        <UsuariosListContainer />
      </MemoryRouter>
    );

    const searchInput = screen.getByLabelText(/pesquisar usuários/i);

    // Dispara primeira busca lenta ('Carlos')
    fireEvent.change(searchInput, { target: { value: 'Carlos' } });

    // Imediatamente dispara segunda busca rápida ('Mariana')
    fireEvent.change(searchInput, { target: { value: 'Mariana' } });

    // Aguarda Mariana ser exibida na tela
    expect(await screen.findByText('Mariana Delegada')).toBeInTheDocument();

    // Agora a requisição antiga de 'Carlos' finalmente resolve
    resolveFirstSearch({
      data: [mockUsers[0]], // Carlos Agente
      totalPages: 1,
      currentPage: 1,
    });

    // Confirma que a resposta atrasada de Carlos NÃO sobrescreveu a tela de Mariana
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.queryByText('Carlos Agente')).not.toBeInTheDocument();
    expect(screen.getByText('Mariana Delegada')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro se a busca falhar e recuperar atomicamente', async () => {
    vi.mocked(usuariosApi.getUsers).mockRejectedValueOnce(new Error('Erro de conexão'));

    render(
      <MemoryRouter>
        <UsuariosListContainer />
      </MemoryRouter>
    );

    // A busca inicial falhou
    expect(await screen.findByRole('alert')).toHaveTextContent(/erro ao carregar a lista de usuários/i);

    // Ao digitar na busca com sucesso, o erro é limpo atomicamente
    vi.mocked(usuariosApi.getUsers).mockResolvedValueOnce({
      data: mockUsers,
      totalPages: 1,
      currentPage: 1,
    });

    const searchInput = screen.getByLabelText(/pesquisar usuários/i);
    fireEvent.change(searchInput, { target: { value: 'Recuperado' } });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(await screen.findByText('Carlos Agente')).toBeInTheDocument();
  });
});
