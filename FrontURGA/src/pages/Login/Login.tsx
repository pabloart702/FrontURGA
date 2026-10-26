import { useState, useEffect } from 'react';
import { getSafeErrorMessage } from '../../utils/errorMessages';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Eye, EyeOff } from 'lucide-react';
import { CofreAnimado } from '../../components/CofreAnimado';
import './Login.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(() => {
    const saved = localStorage.getItem('loginCooldownEnd');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (parsed > Date.now()) return parsed;
      localStorage.removeItem('loginCooldownEnd');
    }
    return null;
  });
  const [cooldownRemaining, setCooldownRemaining] = useState(() => {
    const saved = localStorage.getItem('loginCooldownEnd');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (parsed > Date.now()) return Math.ceil((parsed - Date.now()) / 1000);
    }
    return 0;
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (cooldownEnd) {
      interval = setInterval(() => {
        const remaining = Math.ceil((cooldownEnd - Date.now()) / 1000);
        if (remaining <= 0) {
          setCooldownEnd(null);
          setCooldownRemaining(0);
          setFailedAttempts(0); // Reseta as tentativas após o cooldown
          localStorage.removeItem('loginCooldownEnd');
        } else {
          setCooldownRemaining(remaining);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownEnd]);

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      if (err.response?.status === 429) {
        // Backend já bloqueou (rate limit ativado)
        let resetTimeMs = Date.now() + 300000; // Padrão 5 minutos

        // Tenta ler o cabeçalho 'RateLimit-Reset' ou 'Retry-After' se o backend enviar
        const resetHeader = err.response?.headers?.['ratelimit-reset'] || err.response?.headers?.['retry-after'];
        if (resetHeader) {
          const parsed = parseInt(resetHeader, 10);
          if (!isNaN(parsed) && parsed > 1000000000) {
            resetTimeMs = parsed * 1000; // É um timestamp Unix (segundos)
          } else if (!isNaN(parsed) && parsed > 0 && parsed < 3600) {
            resetTimeMs = Date.now() + (parsed * 1000); // É em segundos restantes
          }
        }

        const remainingSeconds = Math.max(1, Math.ceil((resetTimeMs - Date.now()) / 1000));
        setCooldownEnd(resetTimeMs);
        setCooldownRemaining(remainingSeconds);
        localStorage.setItem('loginCooldownEnd', resetTimeMs.toString());
        setError(`Muitas tentativas falhas. Aguarde ${remainingSeconds}s para tentar novamente.`);
        return;
      }

      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 5) {
        const timeMs = Date.now() + 300000;
        setCooldownEnd(timeMs);
        setCooldownRemaining(300);
        localStorage.setItem('loginCooldownEnd', timeMs.toString());
        setError('Muitas tentativas falhas. Aguarde 5 minutos (300s) para tentar novamente.');
      } else {
        setError(getSafeErrorMessage(err.response?.status, 'Credenciais inválidas. Tente novamente.'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split-container">

      {/* LADO ESQUERDO (Preto) */}
      <div className="login-left-panel">
        <div className="dotted-pattern-overlay"></div>

        {/* Cofre Wireframe como Background */}
        <div className="wireframe-safe-bg">
          <CofreAnimado />
        </div>

        <div className="left-content">
          <div className="urga-brand">
            <h1 className="urga-title">URGA</h1>
          </div>
          <h2 className="urga-subtitle">Unidade de Recuperação e <br /> Gestão de Ativos</h2>
        </div>

        <div className="left-footer">
          <span>▶ Acesso restrito a usuários autorizados</span>
        </div>
      </div>

      {/* LADO DIREITO (Branco) */}
      <div className="login-right-panel">
        <div className="login-form-container">
          <div className="form-header">
            <span className="env-label">AMBIENTE INSTITUCIONAL</span>
            <h2 className="form-title">Acesso ao sistema</h2>
          </div>

          {error && <div className="login-error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">

            <div className="input-wrapper">
              <label>Usuário</label>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Digite seu usuário (e-mail)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-wrapper">
              <label>Senha</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || !!cooldownEnd} className="login-submit-btn">
              {cooldownEnd ? `Aguarde ${cooldownRemaining}s...` : loading ? 'Entrando...' : 'Entrar no sistema'}
              {!loading && !cooldownEnd && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="right-footer">
            <Shield size={14} />
            <span>Ambiente monitorado e protegido</span>
          </div>
        </div>
      </div>
    </div>
  );
}
