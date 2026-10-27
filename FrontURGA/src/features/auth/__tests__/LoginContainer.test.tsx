import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import * as AuthContext from '../../../hooks/useAuth';
import { LoginContainer } from '../components/LoginContainer';

// Mock do react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('LoginContainer', () => {
  const mockLogin = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      login: mockLogin,
      user: null,
      logout: vi.fn(),
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('deve renderizar o formulário de login e a identidade visual', () => {
    render(
      <MemoryRouter>
        <LoginContainer />
      </MemoryRouter>,
    );

    expect(screen.getByPlaceholderText('Digite seu usuário (e-mail)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar no sistema/i })).toBeInTheDocument();
    expect(screen.getByText('URGA')).toBeInTheDocument();
  });

  it('deve alternar a visibilidade da senha ao clicar no botão de exibir/ocultar', () => {
    render(
      <MemoryRouter>
        <LoginContainer />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByPlaceholderText('Digite sua senha');
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByRole('button', { name: /exibir senha/i });
    fireEvent.click(toggleBtn);

    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByRole('button', { name: /ocultar senha/i }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('deve realizar login com sucesso e redirecionar para o dashboard', async () => {
    mockLogin.mockResolvedValueOnce(undefined);

    render(
      <MemoryRouter>
        <LoginContainer />
      </MemoryRouter>,
    );

    const emailInput = screen.getByPlaceholderText('Digite seu usuário (e-mail)');
    const passwordInput = screen.getByPlaceholderText('Digite sua senha');
    const submitButton = screen.getByRole('button', { name: /entrar no sistema/i });

    fireEvent.change(emailInput, { target: { value: 'teste@urga.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senha123' } });
    fireEvent.click(submitButton);

    expect(submitButton).toHaveTextContent('Entrando...');

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('teste@urga.com', 'senha123');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('deve exibir mensagem de erro se o login falhar', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Credenciais inválidas'));

    render(
      <MemoryRouter>
        <LoginContainer />
      </MemoryRouter>,
    );

    const emailInput = screen.getByPlaceholderText('Digite seu usuário (e-mail)');
    const passwordInput = screen.getByPlaceholderText('Digite sua senha');
    const submitButton = screen.getByRole('button', { name: /entrar no sistema/i });

    fireEvent.change(emailInput, { target: { value: 'teste@urga.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senha123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas. Tente novamente.')).toBeInTheDocument();
    });
  });

  it('deve limpar a mensagem de erro atomicamente ao tentar logar novamente (Discriminated Union)', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Credenciais inválidas'));

    render(
      <MemoryRouter>
        <LoginContainer />
      </MemoryRouter>,
    );

    const emailInput = screen.getByPlaceholderText('Digite seu usuário (e-mail)');
    const passwordInput = screen.getByPlaceholderText('Digite sua senha');
    const submitButton = screen.getByRole('button', { name: /entrar no sistema/i });

    fireEvent.change(emailInput, { target: { value: 'teste@urga.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senha123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas. Tente novamente.')).toBeInTheDocument();
    });

    let resolvePromise: (value: void) => void;
    const pendingPromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    mockLogin.mockReturnValueOnce(pendingPromise);

    fireEvent.click(submitButton);

    // O erro anterior é limpo atomicamente durante o carregamento
    expect(screen.queryByText('Credenciais inválidas. Tente novamente.')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrando\.\.\./i })).toBeDisabled();

    resolvePromise!();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
