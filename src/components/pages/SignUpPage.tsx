import React, { useState } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { AuthPageState, User } from '../../types/auth';
import { registerNewUser } from '../../utils/authService';
import ZynetraLogo from '../brand/ZynetraLogo';

interface SignUpPageProps {
  onNavigate: (page: AuthPageState) => void;
  onSignUpSuccess: (user: User) => void;
}

export default function SignUpPage({ onNavigate, onSignUpSuccess }: SignUpPageProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerNewUser(fullName, email, password);
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
    <div className="min-h-screen bg-[#F5F0E9] text-[#292522] flex flex-col justify-between p-4 sm:p-12 font-sans selection:bg-[#49362F] selection:text-white">
      {/* Top Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between border-b border-[#DDD4CA] pb-5 sm:pb-6 gap-2">
        <ZynetraLogo size="md" />
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#756D65] hover:text-[#292522] transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </button>
      </header>

      {/* Main Form Center */}
      <main className="max-w-md w-full mx-auto my-6 sm:my-12 animate-subtle-fade">
        <div className="bg-white rounded-xl border border-[#DDD4CA] p-5 sm:p-10 shadow-sm">
          <div className="mb-8">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#49362F] font-semibold">
              Workspace Provisioning
            </span>
            <h1 className="text-2xl font-bold text-[#292522] mt-1 tracking-tight">
              Create Enterprise Account
            </h1>
            <p className="text-xs text-[#756D65] mt-2">
              Provision autonomous analytics for your organization's telemetry.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-[#A56F5D]/10 border border-[#A56F5D]/30 text-xs text-[#A56F5D] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#292522] font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Vihaan Sharma"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#F8F3EC] border border-[#DDD4CA] text-[#292522] placeholder-[#756D65]/60 focus:outline-none focus:border-[#49362F] transition-colors"
                />
                <UserIcon className="w-4 h-4 text-[#756D65] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[#292522] font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                Work Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@enterprise.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#F8F3EC] border border-[#DDD4CA] text-[#292522] placeholder-[#756D65]/60 focus:outline-none focus:border-[#49362F] transition-colors"
                />
                <Mail className="w-4 h-4 text-[#756D65] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[#292522] font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                Enterprise Organization (Optional)
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Acme Global Corp"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F3EC] border border-[#DDD4CA] text-[#292522] placeholder-[#756D65]/60 focus:outline-none focus:border-[#49362F] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[#292522] font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-[#F8F3EC] border border-[#DDD4CA] text-[#292522] placeholder-[#756D65]/60 focus:outline-none focus:border-[#49362F] transition-colors"
                />
                <Lock className="w-4 h-4 text-[#756D65] absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#756D65] hover:text-[#292522]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[#292522] font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-[#F8F3EC] border border-[#DDD4CA] text-[#292522] placeholder-[#756D65]/60 focus:outline-none focus:border-[#49362F] transition-colors"
                />
                <Lock className="w-4 h-4 text-[#756D65] absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white text-xs font-semibold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm"
            >
              <span>{isLoading ? 'Creating Workspace...' : 'Create Account & Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        <div className="text-center mt-6 text-xs text-[#756D65]">
          Already have an enterprise account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-[#49362F] font-semibold hover:underline"
          >
            Sign in
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto border-t border-[#DDD4CA] pt-6 flex items-center justify-between text-xs text-[#756D65]">
        <span>Protected by enterprise 256-bit encryption</span>
        <span>Zynetra Security Standard</span>
      </footer>
    </div>
  );
}
