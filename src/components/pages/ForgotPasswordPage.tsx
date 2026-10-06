import React, { useState } from 'react';
import {
  ArrowRight,
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { AuthPageState } from '../../types/auth';
import { requestPasswordReset } from '../../utils/authService';
import ZynetraLogo from '../brand/ZynetraLogo';

interface ForgotPasswordPageProps {
  onNavigate: (page: AuthPageState) => void;
}

export default function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await requestPasswordReset(email);
    if (result.success) {
      setIsSubmitted(true);
      setMessage(result.message);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E9] text-[#292522] flex flex-col justify-between p-4 sm:p-12 font-sans selection:bg-[#49362F] selection:text-white">
      {/* Top Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between border-b border-[#DDD4CA] pb-5 sm:pb-6 gap-2">
        <ZynetraLogo size="md" />
        <button
          onClick={() => onNavigate('login')}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#756D65] hover:text-[#292522] transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </button>
      </header>

      {/* Main Form Center */}
      <main className="max-w-md w-full mx-auto my-6 sm:my-12 animate-subtle-fade">
        <div className="bg-white rounded-xl border border-[#DDD4CA] p-5 sm:p-10 shadow-sm">
          <div className="mb-8">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#49362F] font-semibold">
              Credential Recovery
            </span>
            <h1 className="text-2xl font-bold text-[#292522] mt-1 tracking-tight">
              Reset Your Password
            </h1>
            <p className="text-xs text-[#756D65] mt-2">
              Enter your enterprise email to receive an authorized security reset link.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-[#A56F5D]/10 border border-[#A56F5D]/30 text-xs text-[#A56F5D] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#292522] font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                  Registered Work Email
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

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white text-xs font-semibold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#E8EBE1] border border-[#7B8570]/30 text-xs text-[#292522]">
                <div className="flex items-center gap-2 font-semibold text-[#7B8570] mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Reset Instructions Dispatched</span>
                </div>
                <p className="text-[#756D65]">{message}</p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="w-full py-2.5 rounded-lg border border-[#DDD4CA] hover:bg-[#EEE7DE] text-[#292522] text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Return to Login
              </button>
            </div>
          )}
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
