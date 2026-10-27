import type { FormEvent } from 'react';
import { ArrowRight, Eye, EyeOff, Shield } from 'lucide-react';
import type { AsyncState } from '../../../types/async';

interface LoginFormProps {
  email: string;
  onEmailChange: (val: string) => void;
  password: string;
  onPasswordChange: (val: string) => void;
  showPassword: boolean;
  onToggleShowPassword: () => void;
  loginState?: AsyncState<void>;
  error?: string;
  loading?: boolean;
  cooldownRemaining: number;
  isCooldownActive: boolean;
  onSubmit: (e: FormEvent) => Promise<void>;
}

/**
 * Formulário de login institucional (Presentational Component).
 */
export function LoginForm({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  showPassword,
  onToggleShowPassword,
  loginState,
  error,
  loading,
  cooldownRemaining,
  isCooldownActive,
  onSubmit,
}: LoginFormProps) {
  const isSubmitting = loginState ? loginState.status === 'loading' : Boolean(loading);
  const errorMessage = loginState
    ? loginState.status === 'error'
      ? loginState.message
      : null
    : error || null;

  return (
    <div className="login-right-panel">
      <div className="login-form-container">
        <div className="form-header">
          <span className="env-label">AMBIENTE INSTITUCIONAL</span>
          <h2 className="form-title">Acesso ao sistema</h2>
        </div>

        {errorMessage && (
          <div className="login-error-message" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={onSubmit} className="login-form">
          <div className="input-wrapper">
            <label htmlFor="login-email">Usuário</label>
            <div className="input-group">
              <input
                id="login-email"
                type="email"
                placeholder="Digite seu usuário (e-mail)"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                required
                disabled={isSubmitting || isCooldownActive}
              />
            </div>
          </div>

          <div className="input-wrapper">
            <label htmlFor="login-password">Senha</label>
            <div className="input-group">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                required
                disabled={isSubmitting || isCooldownActive}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={onToggleShowPassword}
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isCooldownActive}
            className="login-submit-btn"
          >
            {isCooldownActive
              ? `Aguarde ${cooldownRemaining}s...`
              : isSubmitting
                ? 'Entrando...'
                : 'Entrar no sistema'}
            {!isSubmitting && !isCooldownActive && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="right-footer">
          <Shield size={14} />
          <span>Ambiente monitorado e protegido</span>
        </div>
      </div>
    </div>
  );
}
