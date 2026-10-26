import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { Login } from '../../../pages/Login/Login';
import * as AuthContext from '../../../hooks/useAuth';

// Mock do react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Login Component', () => {
  const mockLogin = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      login: mockLogin,
      user: null,
      logout: vi.fn(),
      isAuthenticated: false,
      isLoading: false
    });
  });

  it('deve renderizar o formulário de login', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Digite seu usuário (e-mail)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar no sistema/i })).toBeInTheDocument();
  });

  it('deve realizar login com sucesso e redirecionar', async () => {
    mockLogin.mockResolvedValueOnce(undefined);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
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
        <Login />
      </MemoryRouter>
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
});
