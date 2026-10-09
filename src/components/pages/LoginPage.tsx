import React, { useState } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { AuthPageState, User } from '../../types/auth';
import { authenticateUser } from '../../utils/authService';
import ZynetraLogo from '../brand/ZynetraLogo';

interface LoginPageProps {
  onNavigate: (page: AuthPageState) => void;
  onLoginSuccess: (user: User) => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export default function LoginPage({ onNavigate, onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await authenticateUser(email, password, rememberMe);
      setIsLoading(false);

      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setError(result.error || 'Authentication failed. Please verify your work email and password.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Authentication error.');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between p-4 sm:p-10 font-sans selection:bg-[var(--theme-primary)] selection:text-white transition-colors duration-200">
      {/* Top Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between border-b border-[var(--border-subtle)] pb-5 gap-2">
        <button
          type="button"
          onClick={() => onNavigate('landing')}
          className="text-left cursor-pointer focus:outline-none"
        >
          <ZynetraLogo size="md" showSubtitle={true} />
        </button>
        <button
          type="button"
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Zynetra</span>
        </button>
      </header>

      {/* Main Form Center */}
      <main className="max-w-md w-full mx-auto my-6 sm:my-12 animate-subtle-fade">
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)] p-6 sm:p-10 shadow-sm">
          <div className="mb-7">
            <div className="text-xs font-mono text-[var(--theme-text)] font-semibold">
              ZYNETRA &middot; Autonomous Analytics &amp; Decision Platform
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mt-1.5 tracking-tight">
              Sign In to Zynetra
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5">
              Enter your work email and password to access your Zynetra Workspace.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-lg bg-[var(--terracotta)]/10 border border-[var(--terracotta)]/30 text-xs text-[var(--terracotta)] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div>{error}</div>
                {error.toLowerCase().includes('create an account') && (
                  <button
                    type="button"
                    onClick={() => onNavigate('signup')}
                    className="font-semibold underline cursor-pointer"
                  >
                    Create your Zynetra account now &rarr;
                  </button>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[var(--text-primary)] font-semibold mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]/60 focus:outline-none focus:border-[var(--theme-primary)] transition-colors"
                />
                <Mail className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[var(--text-primary)] font-semibold">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-xs text-[var(--theme-text)] hover:underline font-semibold cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-16 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]/60 focus:outline-none focus:border-[var(--theme-primary)] transition-colors"
                />
                <Lock className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 text-[11px] font-medium cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[var(--border-subtle)]"
                  style={{ accentColor: 'var(--theme-primary)' }}
                />
                <span>Remember Me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg text-white text-xs font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-4 shadow-sm hover:brightness-110 cursor-pointer disabled:opacity-60"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        <div className="text-center mt-6 text-xs text-[var(--text-secondary)]">
          Don&apos;t have a Zynetra account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('signup')}
            className="text-[var(--theme-text)] font-semibold hover:underline cursor-pointer"
          >
            Create one
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto border-t border-[var(--border-subtle)] pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
        <span>ZYNETRA &middot; Autonomous Analytics &amp; Decision Platform</span>
        <span>Protected by 256-bit cryptographic session security</span>
      </footer>
    </div>
  );
}

