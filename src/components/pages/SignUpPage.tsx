import React, { useState } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  Building2,
  Briefcase,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { AuthPageState, User } from '../../types/auth';
import { registerNewUser } from '../../utils/authService';
import ZynetraLogo from '../brand/ZynetraLogo';

interface SignUpPageProps {
  onNavigate: (page: AuthPageState) => void;
  onSignUpSuccess: (user: User) => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

const JOB_ROLES = [
  'Executive',
  'Business Analyst',
  'Data Analyst',
  'Product Manager',
  'Operations',
  'Finance',
  'Other',
];

export default function SignUpPage({ onNavigate, onSignUpSuccess }: SignUpPageProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [jobRole, setJobRole] = useState('Executive');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid work email address.');
      return;
    }

    if (!organization.trim()) {
      setError('Please enter your company or organization name.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both password fields.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerNewUser(fullName, email, password, organization, jobRole);
      setIsLoading(false);

      if (result.success && result.user) {
        onSignUpSuccess(result.user);
      } else {
        setError(result.error || 'Failed to create account.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Failed to create account.');
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
      <main className="max-w-lg w-full mx-auto my-6 sm:my-10 animate-subtle-fade">
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)] p-6 sm:p-10 shadow-sm">
          <div className="mb-6">
            <div className="text-xs font-mono text-[var(--theme-text)] font-semibold">
              ZYNETRA &middot; Autonomous Analytics &amp; Decision Platform
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mt-1.5 tracking-tight">
              Create your Zynetra account
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5">
              Set up your organization&apos;s autonomous analytics and decision workspace.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-[var(--terracotta)]/10 border border-[var(--terracotta)]/30 text-xs text-[var(--terracotta)] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[var(--text-primary)] font-semibold mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Vihaan Sharma"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]/60 focus:outline-none focus:border-[var(--theme-primary)] transition-colors"
                />
                <UserIcon className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-3" />
              </div>
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1.5">
                  Company / Organization
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Acme Enterprise"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]/60 focus:outline-none focus:border-[var(--theme-primary)] transition-colors"
                  />
                  <Building2 className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1.5">
                  Job Role
                </label>
                <div className="relative">
                  <select
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--theme-primary)] transition-colors"
                  >
                    {JOB_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <Briefcase className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]/60 focus:outline-none focus:border-[var(--theme-primary)] transition-colors"
                  />
                  <Lock className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]/60 focus:outline-none focus:border-[var(--theme-primary)] transition-colors"
                  />
                  <Lock className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[var(--border-subtle)]"
                  style={{ accentColor: 'var(--theme-primary)' }}
                />
                <span>
                  I agree to the Terms of Service and Privacy Policy.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg text-white text-xs font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-4 shadow-sm hover:brightness-110 cursor-pointer disabled:opacity-60"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            >
              <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        <div className="text-center mt-6 text-xs text-[var(--text-secondary)]">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-[var(--theme-text)] font-semibold hover:underline cursor-pointer"
          >
            Sign In
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

