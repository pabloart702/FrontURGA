export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CooldownState {
  isActive: boolean;
  remainingSeconds: number;
}
