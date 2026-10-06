export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  avatarUrl?: string;
  createdAt?: string;
}

export type AuthPageState = 'landing' | 'login' | 'signup' | 'forgot-password' | 'onboarding' | 'app';
