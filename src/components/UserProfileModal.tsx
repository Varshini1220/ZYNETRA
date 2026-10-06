import { useState } from 'react';
import {
  X,
  User as UserIcon,
  Shield,
  Building2,
  CheckCircle2,
  LogOut,
  Sliders,
  Bell,
  Lock,
  Save,
} from 'lucide-react';
import { User } from '../types/auth';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  currentUser?: User | null;
  onLogout: () => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  isDark: _isDark,
  currentUser,
  onLogout,
}: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [anomalyDigests, setAnomalyDigests] = useState(true);
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  if (!isOpen) return null;

  const user = currentUser || {
    id: 'usr-default',
    name: 'Vihaan',
    email: 'varshini1662006@gmail.com',
    role: 'Lead Data Strategist & VP Analytics',
    organization: 'Acme Global Intelligence Corp',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleSaveSettings = () => {
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-2.5 sm:p-4 font-sans animate-subtle-fade overflow-y-auto">
      <div className="max-w-md w-full rounded-xl border border-[#DDD4CA] p-4 sm:p-8 bg-white text-[#292522] shadow-xl my-4 sm:my-8 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#DDD4CA] pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <UserIcon className="w-4 h-4 text-[#49362F]" />
            <h3 className="text-base font-bold text-[#292522]">User Profile &amp; Account</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] mb-6 text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'profile'
                ? 'bg-white text-[#292522] shadow-2xs'
                : 'text-[#756D65] hover:text-[#292522]'
            }`}
          >
            User Details
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'settings'
                ? 'bg-white text-[#292522] shadow-2xs'
                : 'text-[#756D65] hover:text-[#292522]'
            }`}
          >
            Account Settings
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="space-y-5 animate-subtle-fade text-xs">
            {/* User Avatar & Headline */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#49362F] flex items-center justify-center text-sm font-bold text-white">
                {getInitials(user.name)}
              </div>
              <div className="truncate">
                <h4 className="text-sm font-bold text-[#292522] truncate">{user.name}</h4>
                <p className="text-xs text-[#49362F] font-semibold">{user.role}</p>
                <p className="text-[11px] text-[#756D65] truncate mt-0.5">{user.email}</p>
              </div>
            </div>

            {/* Profile Attributes */}
            <div className="space-y-2 pt-2">
              <div className="p-3 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#756D65]" />
                  <span className="text-[#756D65]">Organization:</span>
                </div>
                <span className="font-semibold text-[#292522]">{user.organization}</span>
              </div>

              <div className="p-3 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#756D65]" />
                  <span className="text-[#756D65]">Access Tier:</span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-[#EEE7DE] text-[#49362F] border border-[#DDD4CA]">
                  Workspace Admin &amp; Approver
                </span>
              </div>

              <div className="p-3 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7B8570]" />
                  <span className="text-[#756D65]">Security Attestation:</span>
                </div>
                <span className="text-[#292522] font-mono text-[11px] font-semibold">SOC2 Tier-3 Certified</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4 animate-subtle-fade text-xs">
            <div className="p-4 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#756D65]" />
                  <div>
                    <div className="font-semibold text-[#292522]">Email Anomaly Alerts</div>
                    <div className="text-[10px] text-[#756D65]">Receive alerts when revenue divergences exceed 5%</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded border-[#DDD4CA] text-[#49362F] focus:ring-[#49362F]"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#DDD4CA]">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#756D65]" />
                  <div>
                    <div className="font-semibold text-[#292522]">Weekly Executive Digest</div>
                    <div className="text-[10px] text-[#756D65]">Autonomous slide deck brief delivered Monday 08:00 UTC</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={anomalyDigests}
                  onChange={(e) => setAnomalyDigests(e.target.checked)}
                  className="rounded border-[#DDD4CA] text-[#49362F] focus:ring-[#49362F]"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#756D65]" />
                <div>
                  <div className="font-semibold text-[#292522]">Two-Factor Authentication</div>
                  <div className="text-[10px] text-[#756D65]">Hardware token or Authenticator app</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#E8EBE1] text-[#7B8570]">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleSaveSettings}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Preferences</span>
              </button>
              {savedSettingsNotice && (
                <span className="text-[11px] text-[#7B8570] font-semibold animate-subtle-fade">
                  Preferences updated
                </span>
              )}
            </div>
          </div>
        )}

        {/* Modal Footer with explicit LOGOUT Button */}
        <div className="mt-6 pt-4 border-t border-[#DDD4CA] flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#A56F5D]/30 bg-[#A56F5D]/5 hover:bg-[#A56F5D]/10 text-[#A56F5D] text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-[#DDD4CA] hover:bg-[#EEE7DE] text-[#292522] text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
