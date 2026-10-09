import React, { useState, useEffect } from 'react';
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
  Mail,
  Briefcase,
  Target,
  Layers,
  Edit3,
  KeyRound,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { User, NotificationPreferences, WorkspacePreferences } from '../types/auth';
import { updateUserProfile, changeUserPassword } from '../utils/authService';
import { Workspace, MainTab } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  currentUser?: User | null;
  onUpdateUser?: (updated: User) => void;
  onLogout: () => void;
  mode?: 'modal' | 'page';
  currentWorkspace?: Workspace;
  onNavigateTab?: (tab: MainTab) => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  isDark,
  currentUser,
  onUpdateUser,
  onLogout,
  mode = 'modal',
  currentWorkspace,
  onNavigateTab,
}: UserProfileModalProps) {
  const [activeSection, setActiveSection] = useState<'overview' | 'edit' | 'password' | 'notifications' | 'preferences'>('overview');

  const user: User = currentUser || {
    id: 'usr-default-01',
    name: 'Executive User',
    email: 'executive@zynetra.io',
    role: 'Executive',
    organization: 'Zynetra Enterprise Intelligence',
    industry: 'SaaS',
    primaryObjective: 'Revenue Growth',
    createdAt: '2026-01-15',
  };

  // Edit profile form state
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editOrg, setEditOrg] = useState(user.organization);
  const [editRole, setEditRole] = useState(user.role);
  const [editIndustry, setEditIndustry] = useState(user.industry || 'SaaS');
  const [editObjective, setEditObjective] = useState(user.primaryObjective || 'Revenue Growth');
  const [profileNotice, setProfileNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Notification preferences state
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences>(
    user.notificationPrefs || {
      emailAlerts: true,
      weeklyDigest: true,
      rootCauseAlerts: true,
      thresholdBreach: true,
      slackIntegration: false,
    }
  );

  // Default analytics preferences state
  const [wsPrefs, setWsPrefs] = useState<WorkspacePreferences>(
    user.workspacePrefs || {
      defaultView: 'overview',
      narrativeMode: 'executive',
      autoRunOnUpload: true,
      currencyFormat: 'USD',
    }
  );

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditEmail(currentUser.email);
      setEditOrg(currentUser.organization);
      setEditRole(currentUser.role);
      setEditIndustry(currentUser.industry || 'SaaS');
      setEditObjective(currentUser.primaryObjective || 'Revenue Growth');
      if (currentUser.notificationPrefs) setNotifPrefs(currentUser.notificationPrefs);
      if (currentUser.workspacePrefs) setWsPrefs(currentUser.workspacePrefs);
    }
  }, [currentUser]);

  if (mode === 'modal' && !isOpen) return null;

  const getInitials = (name: string) => {
    return (name || 'ZY')
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileNotice(null);
    if (!editName.trim()) {
      setProfileNotice({ type: 'error', text: 'Full name cannot be empty.' });
      return;
    }
    if (!editEmail.trim() || !editEmail.includes('@')) {
      setProfileNotice({ type: 'error', text: 'Please enter a valid work email.' });
      return;
    }

    const res = updateUserProfile(user.id, {
      name: editName,
      email: editEmail,
      organization: editOrg,
      role: editRole,
      industry: editIndustry,
      primaryObjective: editObjective,
    });

    if (res.success && res.user) {
      onUpdateUser?.(res.user);
      setProfileNotice({ type: 'success', text: 'Zynetra profile updated and synchronized across workspace.' });
      setTimeout(() => setProfileNotice(null), 3000);
    } else {
      setProfileNotice({ type: 'error', text: res.error || 'Could not update profile.' });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordNotice(null);
    if (!currentPassword) {
      setPasswordNotice({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordNotice({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordNotice({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    const res = await changeUserPassword(user.id, currentPassword, newPassword);
    if (res.success) {
      setPasswordNotice({ type: 'success', text: res.message });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      setPasswordNotice({ type: 'error', text: res.message });
    }
  };

  const handleSavePreferences = () => {
    const res = updateUserProfile(user.id, {
      notificationPrefs: notifPrefs,
      workspacePrefs: wsPrefs,
    });
    if (res.success && res.user) {
      onUpdateUser?.(res.user);
    }
    setProfileNotice({ type: 'success', text: 'Notification & analytics preferences saved.' });
    setTimeout(() => setProfileNotice(null), 2500);
  };

  const contentBody = (
    <div
      className={`w-full rounded-2xl border transition-colors ${
        mode === 'modal'
          ? 'max-w-3xl p-5 sm:p-8 shadow-2xl my-4 sm:my-8 max-h-[92vh] overflow-y-auto'
          : 'p-5 sm:p-8 shadow-xs'
      }`}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 mb-6"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white shadow-sm shrink-0"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          >
            {getInitials(user.name)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">{user.name}</h2>
              <span
                className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-bold"
                style={{
                  backgroundColor: 'var(--theme-primary-subtle)',
                  color: 'var(--theme-text)',
                }}
              >
                {user.role}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-[#7B8570]/15 text-[#7B8570] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Active Account
              </span>
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {user.email} &bull; {user.organization}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {mode === 'page' && onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('settings')}
              className="px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Workspace Settings</span>
            </button>
          )}
          {mode === 'modal' && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border transition-colors cursor-pointer"
              style={{
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)',
              }}
              aria-label="Close profile modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div
        className="flex items-center gap-1.5 p-1.5 rounded-xl border mb-6 overflow-x-auto text-xs"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        {[
          { id: 'overview', label: 'Profile Overview', icon: UserIcon },
          { id: 'edit', label: 'Edit Profile', icon: Edit3 },
          { id: 'password', label: 'Change Password', icon: KeyRound },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'preferences', label: 'Analytics Defaults', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveSection(tab.id as any);
                setProfileNotice(null);
                setPasswordNotice(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive ? 'text-white shadow-2xs' : 'hover:opacity-90'
              }`}
              style={{
                backgroundColor: isActive ? 'var(--theme-primary)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Global Feedback Banner */}
      {profileNotice && (
        <div
          className={`mb-5 p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
            profileNotice.type === 'success'
              ? 'border-[#7B8570]/40 bg-[#7B8570]/10 text-[#7B8570]'
              : 'border-[#A56F5D]/40 bg-[#A56F5D]/10 text-[#C48C7B]'
          }`}
        >
          {profileNotice.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span className="font-medium">{profileNotice.text}</span>
        </div>
      )}

      {/* TAB 1: PROFILE OVERVIEW */}
      {activeSection === 'overview' && (
        <div className="space-y-6 animate-subtle-fade text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Identity & Role Card */}
            <div
              className="p-5 rounded-xl border space-y-3.5"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] font-mono uppercase tracking-wider font-bold"
                  style={{ color: 'var(--theme-text)' }}
                >
                  Executive Identity
                </span>
                <button
                  type="button"
                  onClick={() => setActiveSection('edit')}
                  className="text-[11px] font-semibold hover:underline cursor-pointer flex items-center gap-1"
                  style={{ color: 'var(--theme-text)' }}
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <UserIcon className="w-3.5 h-3.5" /> Full Name
                  </span>
                  <span className="font-semibold">{user.name}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <Mail className="w-3.5 h-3.5" /> Work Email
                  </span>
                  <span className="font-semibold">{user.email}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <Building2 className="w-3.5 h-3.5" /> Company / Org
                  </span>
                  <span className="font-semibold">{user.organization}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <Briefcase className="w-3.5 h-3.5" /> Job Role
                  </span>
                  <span className="font-semibold">{user.role}</span>
                </div>
              </div>
            </div>

            {/* Workspace & Onboarding Calibration Card */}
            <div
              className="p-5 rounded-xl border space-y-3.5"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] font-mono uppercase tracking-wider font-bold"
                  style={{ color: 'var(--theme-text)' }}
                >
                  Workspace Intelligence Profile
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#7B8570]/15 text-[#7B8570]">
                  SOC2 Tier-3
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <Layers className="w-3.5 h-3.5" /> Active Workspace
                  </span>
                  <span className="font-semibold">{currentWorkspace?.name || `${user.organization} Hub`}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <Sparkles className="w-3.5 h-3.5" /> Industry Sector
                  </span>
                  <span className="font-semibold">{user.industry || 'SaaS'}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <Target className="w-3.5 h-3.5" /> Primary Objective
                  </span>
                  <span className="font-semibold" style={{ color: 'var(--theme-text)' }}>
                    {user.primaryObjective || 'Revenue Growth'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <Shield className="w-3.5 h-3.5" /> Account Status
                  </span>
                  <span className="font-mono text-[11px] font-semibold">
                    Enterprise Admin &bull; Since {user.createdAt || '2026'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EDIT PROFILE */}
      {activeSection === 'edit' && (
        <form onSubmit={handleSaveProfile} className="space-y-4 animate-subtle-fade text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1.5">Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1.5">Work Email</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1.5">Company / Organization</label>
              <input
                type="text"
                value={editOrg}
                onChange={(e) => setEditOrg(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1.5">Job Role</label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="Executive">Executive</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Operations">Operations</option>
                <option value="Founder">Founder</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1.5">Industry Sector</label>
              <select
                value={editIndustry}
                onChange={(e) => setEditIndustry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="SaaS">SaaS</option>
                <option value="FinTech">FinTech</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1.5">Primary Analytics Objective</label>
              <select
                value={editObjective}
                onChange={(e) => setEditObjective(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="Revenue Growth">Revenue Growth</option>
                <option value="Customer Retention">Customer Retention</option>
                <option value="Operational Efficiency">Operational Efficiency</option>
                <option value="Forecasting & Planning">Forecasting &amp; Planning</option>
                <option value="Data Quality & Cleaning">Data Quality &amp; Cleaning</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-xs uppercase tracking-wider transition-all hover:brightness-110 cursor-pointer"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: CHANGE PASSWORD */}
      {activeSection === 'password' && (
        <form onSubmit={handleChangePassword} className="space-y-4 animate-subtle-fade text-xs max-w-md">
          {passwordNotice && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                passwordNotice.type === 'success'
                  ? 'border-[#7B8570]/40 bg-[#7B8570]/10 text-[#7B8570]'
                  : 'border-[#A56F5D]/40 bg-[#A56F5D]/10 text-[#C48C7B]'
              }`}
            >
              {passwordNotice.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{passwordNotice.text}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none"
              style={{
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none"
              style={{
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none"
              style={{
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-xs uppercase tracking-wider transition-all hover:brightness-110 cursor-pointer"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: NOTIFICATION PREFERENCES */}
      {activeSection === 'notifications' && (
        <div className="space-y-4 animate-subtle-fade text-xs">
          <div
            className="p-4 rounded-xl border divide-y"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            {[
              {
                key: 'emailAlerts',
                title: 'Email Anomaly Alerts',
                desc: 'Receive immediate alerts when KPI trajectory diverges by more than 5%.',
              },
              {
                key: 'weeklyDigest',
                title: 'Weekly Executive Story Digest',
                desc: 'Autonomous 6-slide presentation brief delivered every Monday at 08:00 UTC.',
              },
              {
                key: 'rootCauseAlerts',
                title: 'Causal Root-Cause Shift Alerts',
                desc: 'Notify when primary statistical drivers shift in the Root-Cause Tree.',
              },
              {
                key: 'thresholdBreach',
                title: 'Data Hygiene & Schema Drift Warnings',
                desc: 'Alert when ingested datasets score below 85/100 quality threshold.',
              },
            ].map((item, idx) => (
              <div
                key={item.key}
                className={`flex items-center justify-between ${idx === 0 ? 'pb-3' : idx === 3 ? 'pt-3' : 'py-3'}`}
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <div className="pr-4">
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {item.desc}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={(notifPrefs as any)[item.key]}
                  onChange={(e) =>
                    setNotifPrefs((prev) => ({ ...prev, [item.key]: e.target.checked }))
                  }
                  className="w-4 h-4 rounded cursor-pointer"
                  style={{ accentColor: 'var(--theme-primary)' }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSavePreferences}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-xs uppercase tracking-wider transition-all hover:brightness-110 cursor-pointer"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Notification Preferences</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: DEFAULT ANALYTICS PREFERENCES */}
      {activeSection === 'preferences' && (
        <div className="space-y-4 animate-subtle-fade text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className="p-4 rounded-xl border space-y-2"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <label className="block font-semibold">Default Narrative Mode</label>
              <select
                value={wsPrefs.narrativeMode}
                onChange={(e) =>
                  setWsPrefs((prev) => ({
                    ...prev,
                    narrativeMode: e.target.value as 'executive' | 'technical',
                  }))
                }
                className="w-full px-3 py-2 rounded-lg border text-xs"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="executive">Plain English (Executive Brief)</option>
                <option value="technical">Technical Statistical Mode</option>
              </select>
            </div>

            <div
              className="p-4 rounded-xl border space-y-2"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <label className="block font-semibold">Default Currency Display</label>
              <select
                value={wsPrefs.currencyFormat}
                onChange={(e) =>
                  setWsPrefs((prev) => ({
                    ...prev,
                    currencyFormat: e.target.value as 'USD' | 'EUR' | 'GBP' | 'INR',
                  }))
                }
                className="w-full px-3 py-2 rounded-lg border text-xs"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (&euro;)</option>
                <option value="GBP">GBP (&pound;)</option>
                <option value="INR">INR (&#8377;)</option>
              </select>
            </div>
          </div>

          <div
            className="p-4 rounded-xl border flex items-center justify-between"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div>
              <div className="font-semibold">Auto-Run Autonomous Engine on Dataset Upload</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Automatically execute profiling, cleaning, causal modeling, and forecasting when new CSV/XLSX data is uploaded.
              </div>
            </div>
            <input
              type="checkbox"
              checked={wsPrefs.autoRunOnUpload}
              onChange={(e) =>
                setWsPrefs((prev) => ({ ...prev, autoRunOnUpload: e.target.checked }))
              }
              className="w-4 h-4 rounded cursor-pointer"
              style={{ accentColor: 'var(--theme-primary)' }}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSavePreferences}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-xs uppercase tracking-wider transition-all hover:brightness-110 cursor-pointer"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Analytics Preferences</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer with Sign Out */}
      <div
        className="mt-6 pt-4 border-t flex items-center justify-between"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <button
          type="button"
          onClick={() => {
            if (mode === 'modal') onClose();
            onLogout();
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#A56F5D]/40 bg-[#A56F5D]/10 hover:bg-[#A56F5D]/20 text-[#C48C7B] text-xs font-semibold transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out of Zynetra</span>
        </button>

        {mode === 'modal' && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          >
            Done
          </button>
        )}
      </div>
    </div>
  );

  if (mode === 'page') {
    return <div className="animate-subtle-fade font-sans">{contentBody}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-2.5 sm:p-4 font-sans animate-subtle-fade overflow-y-auto">
      {contentBody}
    </div>
  );
}

