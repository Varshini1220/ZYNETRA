import React, { useState } from 'react';
import {
  ArrowRight,
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { AuthPageState } from '../../types/auth';
import { requestPasswordReset } from '../../utils/authService';
import ZynetraLogo from '../brand/ZynetraLogo';

interface ForgotPasswordPageProps {
  onNavigate: (page: AuthPageState) => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export default function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showDirectReset, setShowDirectReset] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await requestPasswordReset(
      email,
      showDirectReset && newPassword ? newPassword : undefined
    );
    setIsLoading(false);

    if (result.success) {
      setIsSubmitted(true);
      setMessage(result.message);
    } else {
      setError(result.message);
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
          onClick={() => onNavigate('login')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </button>
      </header>

      {/* Main Form Center */}
      <main className="max-w-md w-full mx-auto my-6 sm:my-12 animate-subtle-fade">
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)] p-6 sm:p-10 shadow-sm">
          <div className="mb-7">
            <div className="text-xs font-mono text-[var(--theme-text)] font-semibold">
              ZYNETRA &middot; Account Recovery
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mt-1.5 tracking-tight">
              Forgot your password?
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5">
              Enter your registered work email to receive a password reset link.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-lg bg-[var(--terracotta)]/10 border border-[var(--terracotta)]/30 text-xs text-[var(--terracotta)] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isSubmitted ? (
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

              {showDirectReset && (
                <div>
                  <label className="block text-[var(--text-primary)] font-semibold mb-1.5">
                    New Password (min. 8 characters)
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]/60 focus:outline-none focus:border-[var(--theme-primary)] transition-colors"
                    />
                    <Lock className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-3" />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowDirectReset(!showDirectReset)}
                  className="text-[11px] text-[var(--text-secondary)] hover:text-[var(--theme-text)] underline cursor-pointer"
                >
                  {showDirectReset ? 'Send email link only' : 'Reset password directly for registered account'}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg text-white text-xs font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-4 shadow-sm hover:brightness-110 cursor-pointer disabled:opacity-60"
                style={{ backgroundColor: 'var(--theme-primary)' }}
              >
                <span>{isLoading ? 'Processing...' : 'Send Reset Link'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="pt-3 text-center">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-xs font-semibold text-[var(--theme-text)] hover:underline cursor-pointer"
                >
                  &larr; Back to Login
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5 animate-subtle-fade">
              <div className="p-4 rounded-lg bg-[var(--very-light-sage)] border border-[var(--muted-sage)]/30 text-xs">
                <div className="flex items-center gap-2 font-bold text-[var(--muted-sage)] mb-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Recovery Instructions Dispatched</span>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed">{message}</p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="w-full py-3 rounded-lg text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                style={{ backgroundColor: 'var(--theme-primary)' }}
              >
                Back to Login
              </button>
            </div>
          )}
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

