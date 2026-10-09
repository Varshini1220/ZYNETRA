import { useState } from 'react';
import {
  X,
  SlidersHorizontal,
  CheckCircle2,
  Palette,
  Sun,
  Moon,
  Check,
  User as UserIcon,
  Building2,
  Bell,
  Database,
  Shield,
  Save,
} from 'lucide-react';
import { ThemeId } from '../types/theme';
import { THEME_LIST, THEME_DEFINITIONS } from '../utils/themeConfig';
import { User } from '../types/auth';
import { Workspace } from '../types';
import { updateUserProfile } from '../utils/authService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  currentTheme?: ThemeId;
  onSelectTheme?: (themeId: ThemeId) => void;
  onToggleDarkMode?: () => void;
  onSetDarkMode?: (isDark: boolean) => void;
  mode?: 'modal' | 'page';
  currentUser?: User | null;
  onUpdateUser?: (user: User) => void;
  currentWorkspace?: Workspace;
  onUpdateWorkspace?: (name: string, org: string) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  isDark,
  currentTheme = 'indigo',
  onSelectTheme,
  onToggleDarkMode,
  onSetDarkMode,
  mode = 'modal',
  currentUser,
  onUpdateUser,
  currentWorkspace,
  onUpdateWorkspace,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<
    'account' | 'workspace' | 'notifications' | 'appearance' | 'data' | 'security'
  >('appearance');

  // Account & Workspace state
  const [accountName, setAccountName] = useState(currentUser?.name || 'Executive User');
  const [accountRole, setAccountRole] = useState(currentUser?.role || 'Executive');
  const [wsName, setWsName] = useState(currentWorkspace?.name || 'Global SaaS Intelligence Hub');
  const [wsOrg, setWsOrg] = useState(currentWorkspace?.organization || currentUser?.organization || 'Acme Enterprise');

  // Notifications
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [causalAlerts, setCausalAlerts] = useState(true);

  // Data Preferences
  const [anomalyThreshold, setAnomalyThreshold] = useState(90);
  const [confidenceFloor, setConfidenceFloor] = useState(80);
  const [refreshSchedule, setRefreshSchedule] = useState('daily');
  const [autoCleanOnIngest, setAutoCleanOnIngest] = useState(true);

  const [isSaved, setIsSaved] = useState(false);

  const activeTheme = THEME_DEFINITIONS[currentTheme || 'indigo'] || THEME_DEFINITIONS.indigo;

  if (mode === 'modal' && !isOpen) return null;

  const handleSave = () => {
    if (currentUser) {
      const res = updateUserProfile(currentUser.id, {
        name: accountName,
        role: accountRole,
        organization: wsOrg,
      });
      if (res.success && res.user) {
        onUpdateUser?.(res.user);
      }
    }
    if (onUpdateWorkspace && wsName.trim()) {
      onUpdateWorkspace(wsName.trim(), wsOrg.trim());
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      if (mode === 'modal') onClose();
    }, 900);
  };

  const settingsBody = (
    <div
      className={`w-full rounded-2xl border transition-colors ${
        mode === 'modal'
          ? 'max-w-3xl p-4 sm:p-8 shadow-xl my-4 sm:my-8 max-h-[92vh] overflow-y-auto'
          : 'p-5 sm:p-8 shadow-xs'
      } ${
        isDark ? 'border-[#3E352F] bg-[#26201D] text-[#EDE6DE]' : 'border-[#DDD4CA] bg-white text-[#292522]'
      }`}
    >
      <div className={`flex items-center justify-between border-b pb-4 mb-5 ${isDark ? 'border-[#3E352F]' : 'border-[#DDD4CA]'}`}>
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal
            className="w-4 h-4"
            style={{ color: activeTheme.primaryColor }}
          />
          <div>
            <h3 className="text-base sm:text-lg font-bold">Zynetra Workspace &amp; Engine Settings</h3>
            <p className={`text-xs ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
              Configure account, workspace parameters, notifications, themes, data hygiene, and security.
            </p>
          </div>
        </div>
        {mode === 'modal' && (
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'text-[#A3988E] hover:text-[#EDE6DE] hover:bg-[#322A26]' : 'text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 6 Required Settings Sections Navigation */}
      <div className={`flex gap-1.5 mb-6 border-b pb-2.5 text-xs overflow-x-auto ${isDark ? 'border-[#3E352F]' : 'border-[#DDD4CA]'}`}>
        {[
          { id: 'account', label: 'Account Settings', icon: UserIcon },
          { id: 'workspace', label: 'Workspace Settings', icon: Building2 },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'appearance', label: 'Appearance / Theme', icon: Palette },
          { id: 'data', label: 'Data Preferences', icon: Database },
          { id: 'security', label: 'Security', icon: Shield },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'text-white shadow-2xs'
                  : isDark
                  ? 'text-[#A3988E] hover:text-[#EDE6DE] hover:bg-[#322A26]'
                  : 'text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
              }`}
              style={isActive ? { backgroundColor: activeTheme.primaryColor } : undefined}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section 1: Account Settings */}
      {activeTab === 'account' && (
        <div className="space-y-4 text-xs animate-subtle-fade">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border space-y-2 ${isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#F8F3EC]'}`}>
              <label className="font-semibold block">Full Name</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border text-xs ${
                  isDark ? 'border-[#3E352F] bg-[#181513] text-[#EDE6DE]' : 'border-[#DDD4CA] bg-white text-[#292522]'
                }`}
              />
            </div>
            <div className={`p-4 rounded-xl border space-y-2 ${isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#F8F3EC]'}`}>
              <label className="font-semibold block">Job Role</label>
              <select
                value={accountRole}
                onChange={(e) => setAccountRole(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border text-xs ${
                  isDark ? 'border-[#3E352F] bg-[#181513] text-[#EDE6DE]' : 'border-[#DDD4CA] bg-white text-[#292522]'
                }`}
              >
                <option value="Executive">Executive</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Operations">Operations</option>
                <option value="Founder">Founder</option>
              </select>
            </div>
          </div>

          <div className={`p-4 rounded-xl border flex items-center justify-between ${isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#F8F3EC]'}`}>
            <div>
              <div className="font-semibold">Registered Work Email</div>
              <div className={`text-[11px] mt-0.5 ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                {currentUser?.email || 'executive@zynetra.io'}
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-[#7B8570]/15 text-[#7B8570]">
              Verified Identity
            </span>
          </div>
        </div>
      )}

      {/* Section 2: Workspace Settings */}
      {activeTab === 'workspace' && (
        <div className="space-y-4 text-xs animate-subtle-fade">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border space-y-2 ${isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#F8F3EC]'}`}>
              <label className="font-semibold block">Active Workspace Name</label>
              <input
                type="text"
                value={wsName}
                onChange={(e) => setWsName(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border text-xs ${
                  isDark ? 'border-[#3E352F] bg-[#181513] text-[#EDE6DE]' : 'border-[#DDD4CA] bg-white text-[#292522]'
                }`}
              />
            </div>
            <div className={`p-4 rounded-xl border space-y-2 ${isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#F8F3EC]'}`}>
              <label className="font-semibold block">Company / Organization</label>
              <input
                type="text"
                value={wsOrg}
                onChange={(e) => setWsOrg(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border text-xs ${
                  isDark ? 'border-[#3E352F] bg-[#181513] text-[#EDE6DE]' : 'border-[#DDD4CA] bg-white text-[#292522]'
                }`}
              />
            </div>
          </div>

          <div className={`p-4 rounded-xl border flex items-center justify-between ${isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#F8F3EC]'}`}>
            <div>
              <div className="font-semibold">Workspace Isolation &amp; Role Governance</div>
              <div className={`text-[11px] mt-0.5 ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                All uploaded datasets, presentation decks, and what-if simulations are scoped to this workspace.
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold" style={{ backgroundColor: `${activeTheme.primaryColor}20`, color: activeTheme.primaryColor }}>
              Owner Access
            </span>
          </div>
        </div>
      )}

      {/* Section 3: Notification Preferences */}
      {activeTab === 'notifications' && (
        <div className="space-y-3 text-xs animate-subtle-fade">
          {[
            {
              label: 'Real-Time Metric Anomaly Alerts',
              desc: 'Trigger alert when KPI variance exceeds statistical confidence bands.',
              checked: emailAlerts,
              onChange: setEmailAlerts,
            },
            {
              label: 'Autonomous Weekly Executive Digest',
              desc: 'Deliver synthesized boardroom deck summary every Monday morning.',
              checked: weeklyDigest,
              onChange: setWeeklyDigest,
            },
            {
              label: 'Root-Cause Driver Shift Notifications',
              desc: 'Notify when primary causal drivers change across ingested datasets.',
              checked: causalAlerts,
              onChange: setCausalAlerts,
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`p-4 rounded-xl border flex items-center justify-between ${
                isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#F8F3EC]'
              }`}
            >
              <div>
                <div className="font-semibold">{item.label}</div>
                <div className={`text-[11px] mt-0.5 ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                  {item.desc}
                </div>
              </div>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => item.onChange(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
                style={{ accentColor: activeTheme.primaryColor }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Section 4: Appearance & Theme */}
      {activeTab === 'appearance' && (
        <div className="space-y-5 text-xs animate-subtle-fade">
          {/* Color Mode Toggle */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
              isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#F8F3EC]'
            }`}
          >
            <div>
              <div className={`font-bold ${isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}`}>Display Environment</div>
              <div className={`text-[11px] ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                Warm earthy cream canvas or executive high-contrast dark mode
              </div>
            </div>
            {(onToggleDarkMode || onSetDarkMode) && (
              <div
                className={`flex items-center gap-1 p-1 rounded-lg border ${
                  isDark ? 'border-[#3E352F] bg-[#181513]' : 'border-[#DDD4CA] bg-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (onSetDarkMode) onSetDarkMode(false);
                    else if (isDark && onToggleDarkMode) onToggleDarkMode();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    !isDark
                      ? 'text-white shadow-2xs font-bold'
                      : isDark
                      ? 'text-[#A3988E] hover:text-[#EDE6DE]'
                      : 'text-[#756D65] hover:text-[#292522]'
                  }`}
                  style={!isDark ? { backgroundColor: activeTheme.primaryColor } : undefined}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Cream</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onSetDarkMode) onSetDarkMode(true);
                    else if (!isDark && onToggleDarkMode) onToggleDarkMode();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    isDark
                      ? 'text-white shadow-2xs font-bold'
                      : 'text-[#756D65] hover:text-[#292522]'
                  }`}
                  style={isDark ? { backgroundColor: activeTheme.primaryColor } : undefined}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark</span>
                </button>
              </div>
            )}
          </div>

          {/* Themes Grid */}
          <div>
            <label
              className={`font-semibold block mb-2 uppercase font-mono tracking-wider text-[11px] ${
                isDark ? 'text-[#A3988E]' : 'text-[#756D65]'
              }`}
            >
              Zynetra Palette Presets
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 max-h-64 overflow-y-auto pr-1">
              {THEME_LIST.map((th) => {
                const isSelected = th.id === currentTheme;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => onSelectTheme?.(th.id)}
                    className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                      isSelected
                        ? isDark
                          ? 'bg-[#322A26] shadow-2xs'
                          : 'bg-[#F8F3EC] shadow-2xs'
                        : isDark
                        ? 'border-[#3E352F] bg-[#211C19] hover:bg-[#2D2622] text-[#EDE6DE]'
                        : 'border-[#DDD4CA] bg-[#F8F3EC]/60 hover:bg-[#EEE7DE] text-[#292522]'
                    }`}
                    style={{
                      borderColor: isSelected ? th.primaryColor : undefined,
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-4 h-4 rounded-full shrink-0 shadow-2xs border border-black/10"
                        style={{ backgroundColor: th.primaryColor }}
                      />
                      <div>
                        <div className="font-semibold text-xs leading-tight">{th.name}</div>
                        <div className={`text-[10px] leading-snug mt-0.5 ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                          {th.tag} &bull; {th.subtitle}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5"
                        style={{ backgroundColor: th.primaryColor }}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Section 5: Data Preferences */}
      {activeTab === 'data' && (
        <div className="space-y-4 text-xs animate-subtle-fade">
          <div
            className={`p-4 rounded-xl border space-y-2 ${
              isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#F8F3EC]'
            }`}
          >
            <div className="flex justify-between">
              <span className="font-semibold">Anomaly Detection Sensitivity</span>
              <span className="font-mono font-bold" style={{ color: activeTheme.primaryColor }}>
                {anomalyThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="99"
              value={anomalyThreshold}
              onChange={(e) => setAnomalyThreshold(Number(e.target.value))}
              className="w-full cursor-pointer"
              style={{ accentColor: activeTheme.primaryColor }}
            />
            <p className={`text-[11px] ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
              Higher sensitivity flags subtle micro-fluctuations; lower sensitivity isolates structural multi-period deviations.
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border space-y-2 ${
              isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#F8F3EC]'
            }`}
          >
            <div className="flex justify-between">
              <span className="font-semibold">Causal Elimination Confidence Floor</span>
              <span className="font-mono font-bold" style={{ color: activeTheme.primaryColor }}>
                {confidenceFloor}%
              </span>
            </div>
            <input
              type="range"
              min="60"
              max="95"
              value={confidenceFloor}
              onChange={(e) => setConfidenceFloor(Number(e.target.value))}
              className="w-full cursor-pointer"
              style={{ accentColor: activeTheme.primaryColor }}
            />
            <p className={`text-[11px] ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
              Hypotheses with p-values exceeding this threshold are classified as unverified in Root-Cause Trees.
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border space-y-3 ${
              isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#F8F3EC]'
            }`}
          >
            <span className="font-semibold block">Continuous Profiling Cadence</span>
            <div className="grid grid-cols-3 gap-2">
              {['hourly', 'daily', 'weekly'].map((sch) => (
                <button
                  key={sch}
                  type="button"
                  onClick={() => setRefreshSchedule(sch)}
                  className={`py-2 px-3 rounded-lg border text-center font-medium capitalize transition-colors cursor-pointer ${
                    refreshSchedule === sch
                      ? 'text-white shadow-2xs font-semibold'
                      : isDark
                      ? 'border-[#3E352F] bg-[#26201D] text-[#A3988E] hover:text-[#EDE6DE]'
                      : 'border-[#DDD4CA] bg-white text-[#756D65] hover:text-[#292522]'
                  }`}
                  style={refreshSchedule === sch ? { backgroundColor: activeTheme.primaryColor } : undefined}
                >
                  {sch}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#F8F3EC]'
            }`}
          >
            <div>
              <div className="font-semibold">Autonomous Deduplication &amp; Imputation on Upload</div>
              <div className={`text-[11px] ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                Automatically apply median imputation and duplicate removal rules during dataset ingestion.
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoCleanOnIngest}
              onChange={(e) => setAutoCleanOnIngest(e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer"
              style={{ accentColor: activeTheme.primaryColor }}
            />
          </div>
        </div>
      )}

      {/* Section 6: Security & Compliance */}
      {activeTab === 'security' && (
        <div className="space-y-3 text-xs animate-subtle-fade">
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#F8F3EC]'
            }`}
          >
            <div>
              <div className="font-semibold">Zero-Retention In-Memory Execution</div>
              <div className={`text-[11px] ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                Raw records are profiled in volatile memory and never exposed to external training pipelines.
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-[#7B8570]/15 text-[#7B8570]">
              Enforced
            </span>
          </div>

          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#F8F3EC]'
            }`}
          >
            <div>
              <div className="font-semibold">SOC2 Type II &amp; Cryptographic Audit Trail</div>
              <div className={`text-[11px] ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                All causal reasoning paths, password hashes, and cleaning modifications are signed.
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-[#7B8570]/15 text-[#7B8570]">
              Active
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={`mt-6 pt-4 border-t flex items-center justify-between ${isDark ? 'border-[#3E352F]' : 'border-[#DDD4CA]'}`}>
        <span className={`text-[11px] font-mono ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
          Zynetra Enterprise Platform v2.5
        </span>
        <div className="flex gap-2">
          {mode === 'modal' && (
            <button
              onClick={onClose}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                isDark
                  ? 'border-[#3E352F] text-[#A3988E] hover:text-[#EDE6DE] hover:bg-[#322A26]'
                  : 'border-[#DDD4CA] text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
              }`}
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-2xs hover:brightness-110 cursor-pointer"
            style={{ backgroundColor: activeTheme.primaryColor }}
          >
            {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Configuration Saved' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (mode === 'page') {
    return <div className="animate-subtle-fade font-sans">{settingsBody}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-2.5 sm:p-4 font-sans animate-subtle-fade overflow-y-auto">
      {settingsBody}
    </div>
  );
}

