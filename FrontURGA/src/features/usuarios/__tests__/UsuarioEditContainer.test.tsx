import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useNavigate, useParams } from 'react-router-dom';
import { UsuarioEditContainer } from '../components/UsuarioEditContainer';
import { usuariosApi } from '../api/usuariosApi';
import type { User } from '../types/usuarios.types';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: vi.fn(),
  };
});

vi.mock('../api/usuariosApi', () => ({
  usuariosApi: {
    getUserById: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
    activateUser: vi.fn(),
  },
}));

describe('UsuarioEditContainer Component', () => {
  const mockNavigate = vi.fn();

  const mockUser: User = {
    id: '1',
    nome: 'João Teste',
    email: 'joao@teste.com',
    cpf: '12345678900',
    matricula: '001',
    cargo: 'Agente',
    departamento: 'Delegacia-Geral da Polícia Civil (DEGEPOLI)',
    status: 'Ativo',
    role: 'Usuário',
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    vi.mocked(usuariosApi.getUserById).mockResolvedValue(mockUser);
  });

  it('deve carregar e renderizar os dados do usuário', async () => {
    render(
      <MemoryRouter>
        <UsuarioEditContainer />
      </MemoryRouter>
    );

    expect(screen.getByText('Carregando...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue('João Teste')).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('joao@teste.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Agente')).toBeInTheDocument();
  });

  it('deve permitir editar e salvar os dados do usuário', async () => {
    vi.mocked(usuariosApi.updateUser).mockResolvedValueOnce(mockUser);

    const { container } = render(
      <MemoryRouter>
        <UsuarioEditContainer />
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
      expect(usuariosApi.updateUser).toHaveBeenCalledWith('1', expect.objectContaining({
        nome: 'João Editado',
      }));
      expect(screen.getByText('Usuário atualizado com sucesso!')).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem de erro se o salvamento falhar', async () => {
    vi.mocked(usuariosApi.updateUser).mockRejectedValueOnce({
      response: { data: { message: 'Erro ao salvar' } },
    });

    render(
      <MemoryRouter>
        <UsuarioEditContainer />
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

  it('deve permitir desativar o usuário', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.mocked(usuariosApi.deleteUser).mockResolvedValueOnce({ mensagem: 'Usuário desativado' });

    render(
      <MemoryRouter>
        <UsuarioEditContainer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('João Teste')).toBeInTheDocument();
    });

    const deactivateBtn = screen.getByRole('button', { name: /desativar usuário/i });
    fireEvent.click(deactivateBtn);

    await waitFor(() => {
      expect(usuariosApi.deleteUser).toHaveBeenCalledWith('1');
      expect(screen.getByText('Usuário desativado com sucesso!')).toBeInTheDocument();
    });
  });
});
