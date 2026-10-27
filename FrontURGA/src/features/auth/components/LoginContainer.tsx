import { useLogin } from '../hooks/useLogin';
import { LoginBrandPanel } from './LoginBrandPanel';
import { LoginForm } from './LoginForm';
import './Login.css';

/**
 * Container principal da feature de Autenticação.
 * Orquestra o hook `useLogin` e renderiza os painéis correspondentes.
 */
export function LoginContainer() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    loginState,
    cooldownRemaining,
    isCooldownActive,
    handleSubmit,
  } = useLogin();

  return (
    <div className="login-split-container">
      <LoginBrandPanel />
      <LoginForm
        email={email}
        onEmailChange={setEmail}
        password={password}
        onPasswordChange={setPassword}
        showPassword={showPassword}
        onToggleShowPassword={toggleShowPassword}
        loginState={loginState}
        cooldownRemaining={cooldownRemaining}
        isCooldownActive={isCooldownActive}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
