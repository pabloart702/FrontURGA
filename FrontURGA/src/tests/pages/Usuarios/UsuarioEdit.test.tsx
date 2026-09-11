import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useNavigate, useParams } from 'react-router-dom';
import { UsuarioEdit } from '../../../pages/Usuarios/UsuarioEdit';
import { usersService } from '../../../services/users';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: vi.fn(),
  };
});

vi.mock('../../../services/users', () => ({
  usersService: {
    getUserById: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
    activateUser: vi.fn(),
  }
}));

describe('UsuarioEdit Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    vi.mocked(usersService.getUserById).mockResolvedValue({
      id: '1',
      nome: 'João Teste',
      email: 'joao@teste.com',
      cpf: '12345678900',
      matricula: '001',
      cargo: 'Agente',
      departamento: 'Delegacia-Geral da Polícia Civil (DEGEPOLI)',
      status: 'Ativo',
      role: 'Usuário'
    });
  });

  it('deve carregar e renderizar os dados do usuário', async () => {
    render(
      <MemoryRouter>
        <UsuarioEdit />
      </MemoryRouter>
    );

    // Initial loading state
    expect(screen.getByText('Carregando...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue('João Teste')).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('joao@teste.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Agente')).toBeInTheDocument();
  });

  it('deve permitir editar e salvar os dados do usuário', async () => {
    vi.mocked(usersService.updateUser).mockResolvedValueOnce({} as any);

    const { container } = render(
      <MemoryRouter>
        <UsuarioEdit />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('João Teste')).toBeInTheDocument();
    });

    const nomeInput = container.querySelector('input[name="nome"]') as HTMLInputElement;
    fireEvent.change(nomeInput, { target: { value: 'João Editado' } });

    const form = screen.getByRole('button', { name: /salvar alterações/i }).closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(usersService.updateUser).toHaveBeenCalledWith('1', expect.objectContaining({
        nome: 'João Editado'
      }));
      expect(screen.getByText('Usuário atualizado com sucesso!')).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem de erro se o salvamento falhar', async () => {
    vi.mocked(usersService.updateUser).mockRejectedValueOnce({
      response: { data: { message: 'Erro ao salvar' } }
    });

    render(
      <MemoryRouter>
        <UsuarioEdit />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('João Teste')).toBeInTheDocument();
    });

    const form = screen.getByRole('button', { name: /salvar alterações/i }).closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Erro ao salvar')).toBeInTheDocument();
    });
  });
});
