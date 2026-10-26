import { useEffect, useState, type FormEvent } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { getSafeErrorMessage } from '../../../utils/errorMessages';

const COOLDOWN_KEY = 'loginCooldownEnd';
const DEFAULT_COOLDOWN_MS = 300000; // 5 minutos (300 segundos)
const MAX_ATTEMPTS = 5;

export interface UseLoginReturn {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
  error: string;
  loading: boolean;
  cooldownRemaining: number;
  isCooldownActive: boolean;
  handleSubmit: (e: FormEvent) => Promise<void>;
}

/**
 * Hook de domínio da feature de autenticação.
 * Encapsula formulário de login, contagem de tentativas falhas,
 * rate limit (HTTP 429) e temporizador de cooldown com persistência no localStorage.
 */
export function useLogin(): UseLoginReturn {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const [cooldownEnd, setCooldownEnd] = useState<number | null>(() => {
    const saved = localStorage.getItem(COOLDOWN_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (parsed > Date.now()) return parsed;
      localStorage.removeItem(COOLDOWN_KEY);
    }
    return null;
  });

  const [cooldownRemaining, setCooldownRemaining] = useState<number>(() => {
    const saved = localStorage.getItem(COOLDOWN_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (parsed > Date.now()) return Math.ceil((parsed - Date.now()) / 1000);
    }
    return 0;
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  // Temporizador regressivo de cooldown
  useEffect(() => {
    if (!cooldownEnd) return;

    const interval = setInterval(() => {
      const remaining = Math.ceil((cooldownEnd - Date.now()) / 1000);
      if (remaining <= 0) {
        setCooldownEnd(null);
        setCooldownRemaining(0);
        setFailedAttempts(0);
        localStorage.removeItem(COOLDOWN_KEY);
      } else {
        setCooldownRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldownEnd]);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (cooldownEnd) {
      setError(`Muitas tentativas falhas. Tente novamente em ${cooldownRemaining}s.`);
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      setFailedAttempts(0);
      navigate('/dashboard');
    } catch (err: unknown) {
      const isAxios = isAxiosError(err);
      const status = isAxios ? err.response?.status : undefined;

      if (status === 429) {
        // Backend ativou o rate limit (HTTP 429)
        let resetTimeMs = Date.now() + DEFAULT_COOLDOWN_MS;

        const headers = isAxios ? err.response?.headers : undefined;
        const resetHeader = headers?.['ratelimit-reset'] || headers?.['retry-after'];

        if (typeof resetHeader === 'string' || typeof resetHeader === 'number') {
          const parsed = parseInt(String(resetHeader), 10);
          if (!isNaN(parsed) && parsed > 1000000000) {
            resetTimeMs = parsed * 1000; // Timestamp Unix em segundos
          } else if (!isNaN(parsed) && parsed > 0 && parsed < 3600) {
            resetTimeMs = Date.now() + parsed * 1000; // Segundos relativos
          }
        }

        const remainingSeconds = Math.max(1, Math.ceil((resetTimeMs - Date.now()) / 1000));
        setCooldownEnd(resetTimeMs);
        setCooldownRemaining(remainingSeconds);
        localStorage.setItem(COOLDOWN_KEY, resetTimeMs.toString());
        setError(`Muitas tentativas falhas. Aguarde ${remainingSeconds}s para tentar novamente.`);
        return;
      }

      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);

      if (nextAttempts >= MAX_ATTEMPTS) {
        const timeMs = Date.now() + DEFAULT_COOLDOWN_MS;
        setCooldownEnd(timeMs);
        setCooldownRemaining(300);
        localStorage.setItem(COOLDOWN_KEY, timeMs.toString());
        setError('Muitas tentativas falhas. Aguarde 5 minutos (300s) para tentar novamente.');
      } else {
        setError(getSafeErrorMessage(status, 'Credenciais inválidas. Tente novamente.'));
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    error,
    loading,
    cooldownRemaining,
    isCooldownActive: !!cooldownEnd,
    handleSubmit,
  };
}
