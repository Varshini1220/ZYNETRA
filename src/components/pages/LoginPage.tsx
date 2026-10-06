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
        setError(result.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Authentication error.');
    }
  };

  const handleQuickDemoLogin = () => {
    setEmail('varshini1662006@gmail.com');
    setPassword('password123');
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
              Enterprise Access
            </span>
            <h1 className="text-2xl font-bold text-[#292522] mt-1 tracking-tight">
              Sign In to Zynetra
            </h1>
            <p className="text-xs text-[#756D65] mt-2">
              Enter your credentials to access your autonomous analytics workspace.
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[#292522] font-semibold uppercase tracking-wider text-[11px]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-[11px] text-[#49362F] hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
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

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#756D65]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#DDD4CA] text-[#49362F] focus:ring-[#49362F]"
                />
                <span>Remember this terminal</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white text-xs font-semibold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Fill button */}
          <div className="mt-6 pt-6 border-t border-[#DDD4CA] text-center">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="text-[11px] uppercase tracking-wider text-[#756D65] hover:text-[#49362F] font-semibold"
            >
              Auto-fill sample executive credentials &rarr;
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-[#756D65]">
          Do not have an enterprise account?{' '}
          <button
            onClick={() => onNavigate('signup')}
            className="text-[#49362F] font-semibold hover:underline"
          >
            Create an account
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
