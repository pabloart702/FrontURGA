import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { CofreAnimado } from '../../components/CofreAnimado';
import './Login.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.status === 403 && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.response?.data?.message || 'Credenciais inválidas. Tente novamente.');
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
            <div className="shield-icon-wrapper">
              <ShieldCheck size={50} strokeWidth={1.5} color="#d4af37" fill="rgba(212, 175, 55, 0.1)" />
            </div>
          </div>
          <h2 className="urga-subtitle">ADMINISTRAÇÃO INTEGRADA<br/>DE BENS E VALORES</h2>
          <p className="urga-description">Controle, Custódia e Destinação</p>
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

            <button type="submit" disabled={loading} className="login-submit-btn">
              {loading ? 'Entrando...' : 'Entrar no sistema'}
              {!loading && <ArrowRight size={18} />}
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
