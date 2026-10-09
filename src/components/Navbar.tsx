import { useState } from 'react';
import {
  Database,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  Building2,
  SlidersHorizontal,
  RefreshCw,
  UploadCloud,
  HelpCircle,
  Presentation,
  LogOut,
  Home,
  CheckCircle2,
  Menu,
  User as UserIcon,
} from 'lucide-react';
import { Workspace, MainTab } from '../types';
import { ThemeId } from '../types/theme';
import { User } from '../types/auth';
import ThemeSelector from './ThemeSelector';
import ZynetraLogo from './brand/ZynetraLogo';
import { THEME_DEFINITIONS } from '../utils/themeConfig';

interface NavbarProps {
  currentWorkspace: Workspace;
  workspaces: Workspace[];
  onSelectWorkspace: (ws: Workspace) => void;
  onCreateWorkspace: (name: string, org: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  currentTheme: ThemeId;
  onSelectTheme: (themeId: ThemeId) => void;
  onSetDarkMode?: (isDark: boolean) => void;
  datasetName: string;
  datasetVersion: string;
  qualityScore: number;
  objective: string;
  onObjectiveChange: (obj: string) => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onNavigateTab?: (tab: MainTab) => void;
  onOpenUpload?: () => void;
  onOpenGenerateDashboards?: () => void;
  isCustomDataset?: boolean;
  isExecutiveMode?: boolean;
  onToggleExecutiveMode?: () => void;
  onOpenHelp?: () => void;
  currentUser?: User | null;
  onLogout?: () => void;
  onNavigateLanding?: () => void;
  onOpenMobileMenu?: () => void;
}

export default function Navbar({
  currentWorkspace,
  workspaces,
  onSelectWorkspace,
  onCreateWorkspace,
  isDark,
  onToggleTheme,
  currentTheme,
  onSelectTheme,
  onSetDarkMode,
  datasetName,
  datasetVersion,
  qualityScore,
  objective,
  onObjectiveChange,
  onRunAnalysis,
  isAnalyzing,
  onOpenSettings,
  onOpenProfile,
  onNavigateTab,
  onOpenUpload,
  onOpenGenerateDashboards,
  isCustomDataset,
  isExecutiveMode: _isExecutiveMode,
  onToggleExecutiveMode: _onToggleExecutiveMode,
  onOpenHelp,
  currentUser,
  onLogout,
  onNavigateLanding,
  onOpenMobileMenu,
}: NavbarProps) {
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showNewWorkspaceModal, setShowNewWorkspaceModal] = useState(false);
  const [newWsName, setNewWsName] = useState('');
  const [newWsOrg, setNewWsOrg] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const activeTheme = THEME_DEFINITIONS[currentTheme] || THEME_DEFINITIONS.indigo;

  const notifications = [
    { id: 'n1', text: 'Autonomous data profiling complete (94/100 Quality)', time: '2m ago' },
    { id: 'n2', text: '5 data cleaning rules automatically applied', time: '3m ago' },
    { id: 'n3', text: 'New macro correlation identified with EU cloud directive', time: '10m ago' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-xs border-b transition-colors duration-200 ${
        isDark
          ? 'bg-[#211C19]/95 border-[#3E352F] text-[#EDE6DE]'
          : 'bg-white/95 border-[#DDD4CA] text-[#292522]'
      }`}
    >
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Workspace */}
        <div className="flex items-center gap-4">
          <ZynetraLogo size="md" showSubtitle={false} />

          <div className={`h-4 w-px hidden md:block ${isDark ? 'bg-[#3E352F]' : 'bg-[#DDD4CA]'}`} />

          {/* Workspace Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                isDark
                  ? 'border-[#3E352F] bg-[#26201D] text-[#EDE6DE] hover:bg-[#2D2622]'
                  : 'border-[#DDD4CA] bg-[#F8F3EC] text-[#292522] hover:bg-[#EEE7DE]'
              }`}
            >
              <Building2 className={`w-3.5 h-3.5 ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`} />
              <span className="font-semibold max-w-[140px] truncate">{currentWorkspace.name}</span>
              <ChevronDown className={`w-3 h-3 ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`} />
            </button>

            {showWorkspaceMenu && (
              <div
                className={`absolute left-0 mt-2 w-64 rounded-xl border shadow-md p-2 z-50 animate-subtle-fade ${
                  isDark
                    ? 'border-[#3E352F] bg-[#26201D] text-[#EDE6DE]'
                    : 'border-[#DDD4CA] bg-white text-[#292522]'
                }`}
              >
                <div className={`text-[10px] uppercase font-mono tracking-wider px-2 py-1 ${
                  isDark ? 'text-[#A3988E]' : 'text-[#756D65]'
                }`}>
                  Active Workspaces
                </div>
                <div className="space-y-1 my-1">
                  {workspaces.map(ws => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        onSelectWorkspace(ws);
                        setShowWorkspaceMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between transition-colors ${
                        ws.id === currentWorkspace.id
                          ? isDark
                            ? 'bg-[#322A26] font-semibold'
                            : 'bg-[#EEE7DE] text-[#49362F] font-semibold'
                          : isDark
                          ? 'hover:bg-[#2D2622] text-[#EDE6DE]'
                          : 'hover:bg-[#F8F3EC] text-[#292522]'
                      }`}
                      style={{
                        color: ws.id === currentWorkspace.id ? activeTheme.primaryColor : undefined,
                      }}
                    >
                      <span className="truncate">{ws.name}</span>
                      <span className={`text-[10px] font-mono ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                        {ws.role}
                      </span>
                    </button>
                  ))}
                </div>
                <div className={`border-t pt-1 mt-1 ${isDark ? 'border-[#3E352F]' : 'border-[#DDD4CA]'}`}>
                  <button
                    onClick={() => {
                      setShowWorkspaceMenu(false);
                      setShowNewWorkspaceModal(true);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs hover:underline font-semibold"
                    style={{ color: activeTheme.primaryColor }}
                  >
                    + Create New Workspace
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Quiet Dataset Indicator */}
        <div
          className={`hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs border transition-colors ${
            isDark
              ? 'border-[#3E352F] bg-[#26201D] text-[#EDE6DE]'
              : 'border-[#DDD4CA] bg-[#F8F3EC] text-[#292522]'
          }`}
        >
          <Database className={`w-3.5 h-3.5 ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`} />
          <span className={isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}>Corpus:</span>
          <span className="font-semibold truncate max-w-[180px]">{datasetName}</span>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
              isDark
                ? 'border-[#3E352F] bg-[#211C19] text-[#A3988E]'
                : 'border-[#DDD4CA] bg-[#EEE7DE] text-[#756D65]'
            }`}
          >
            {isCustomDataset ? 'Custom Ingest' : datasetVersion}
          </span>
          <div
            className={`flex items-center gap-1.5 pl-1.5 border-l text-[11px] text-[#7B8570] font-semibold ${
              isDark ? 'border-[#3E352F]' : 'border-[#DDD4CA]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#7B8570]" />
            <span>{qualityScore}/100 Quality</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Secondary Action: Generate Dashboards (Desktop / Tablet) */}
          {onOpenGenerateDashboards && (
            <button
              onClick={onOpenGenerateDashboards}
              id="btn-navbar-generate-dashboards"
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                isDark
                  ? 'border-[#3E352F] bg-[#26201D] hover:bg-[#322A26] text-[#EDE6DE]'
                  : 'border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-[#292522]'
              }`}
              title="Generate Analyst Dashboards for Immediate Presentation"
            >
              <Presentation className={`w-3.5 h-3.5 ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`} />
              <span>Generate Presentation</span>
            </button>
          )}

          {/* Secondary Action: Upload Dataset (Desktop / Tablet) */}
          {onOpenUpload && (
            <button
              onClick={onOpenUpload}
              id="btn-navbar-upload-dataset"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                isDark
                  ? 'border-[#3E352F] bg-[#26201D] hover:bg-[#322A26] text-[#EDE6DE]'
                  : 'border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-[#292522]'
              }`}
              title="Upload your own CSV or Excel dataset"
            >
              <UploadCloud className={`w-3.5 h-3.5 ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`} />
              <span>Upload Data</span>
            </button>
          )}

          {/* Theme Palette Switcher Dropdown */}
          <ThemeSelector
            currentTheme={currentTheme}
            onSelectTheme={onSelectTheme}
            isDark={isDark}
            onToggleDarkMode={onToggleTheme}
            onSetDarkMode={onSetDarkMode}
          />

          {/* Quick Light / Dark Mode Toggle Button */}
          <button
            type="button"
            id="btn-navbar-quick-mode-toggle"
            onClick={onToggleTheme}
            className={`p-2 rounded-lg border transition-all duration-200 cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center ${
              isDark
                ? 'border-[#3E352F] bg-[#26201D] hover:bg-[#322A26] text-[#EDE6DE]'
                : 'border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-[#756D65]'
            }`}
            title={isDark ? "Switch to Warm Cream Light Mode" : "Switch to Espresso Dark Mode"}
            aria-label="Toggle Theme Mode"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-[#D5BDA7] hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-[#756D65] hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* How to Read / Interpretability Help Button */}
          {onOpenHelp && (
            <button
              onClick={onOpenHelp}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                isDark
                  ? 'border-[#3E352F] bg-[#26201D] hover:bg-[#322A26] text-[#EDE6DE]'
                  : 'border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-[#292522]'
              }`}
              title="How to interpret this application and understand its charts"
            >
              <HelpCircle className={`w-3.5 h-3.5 ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`} />
              <span>Guide</span>
            </button>
          )}

          {/* Notifications (Desktop / Tablet) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-lg border transition-colors relative min-w-[36px] min-h-[36px] flex items-center justify-center ${
                isDark
                  ? 'border-[#3E352F] bg-[#26201D] hover:bg-[#322A26] text-[#A3988E]'
                  : 'border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-[#756D65]'
              }`}
              title="System Alerts & Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: activeTheme.primaryColor }}
              />
            </button>

            {showNotifications && (
              <div
                className={`absolute right-0 mt-2 w-72 rounded-xl border shadow-md p-3 z-50 animate-subtle-fade ${
                  isDark
                    ? 'border-[#3E352F] bg-[#26201D] text-[#EDE6DE]'
                    : 'border-[#DDD4CA] bg-white text-[#292522]'
                }`}
              >
                <div
                  className={`flex items-center justify-between pb-2 border-b text-xs font-semibold ${
                    isDark ? 'border-[#3E352F]' : 'border-[#DDD4CA]'
                  }`}
                >
                  <span>System Audit Log</span>
                  <span className="text-[10px] text-[#7B8570] flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                </div>
                <div className={`divide-y my-1 ${isDark ? 'divide-[#3E352F]' : 'divide-[#DDD4CA]/60'}`}>
                  {notifications.map(n => (
                    <div key={n.id} className="py-2 text-xs">
                      <div className={`font-medium ${isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}`}>{n.text}</div>
                      <div className={`text-[10px] mt-0.5 ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Engine Settings Modal Trigger */}
          <button
            onClick={onOpenSettings}
            className={`hidden sm:flex p-2 rounded-lg border transition-colors min-w-[36px] min-h-[36px] items-center justify-center ${
              isDark
                ? 'border-[#3E352F] bg-[#26201D] hover:bg-[#322A26] text-[#A3988E]'
                : 'border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-[#756D65]'
            }`}
            title="Configure System Heuristics & Theme"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* User Avatar + Name + Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className={`flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg border text-xs transition-colors min-h-[36px] cursor-pointer ${
                isDark
                  ? 'border-[#3E352F] bg-[#26201D] hover:bg-[#322A26] text-[#EDE6DE]'
                  : 'border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-[#292522]'
              }`}
              title="Zynetra User Profile & Account"
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white shrink-0"
                style={{ backgroundColor: activeTheme.primaryColor }}
              >
                {currentUser?.name ? currentUser.name[0].toUpperCase() : 'Z'}
              </div>
              <span className="font-semibold hidden xl:inline truncate max-w-[100px]">
                {currentUser?.name || 'Executive'}
              </span>
              <ChevronDown className={`w-3 h-3 ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`} />
            </button>

            {showProfileDropdown && (
              <div
                className={`absolute right-0 mt-2 w-60 rounded-xl border shadow-lg p-2 z-50 animate-subtle-fade text-xs ${
                  isDark
                    ? 'border-[#3E352F] bg-[#26201D] text-[#EDE6DE]'
                    : 'border-[#DDD4CA] bg-white text-[#292522]'
                }`}
              >
                <div className={`px-2.5 py-2 border-b mb-1 ${isDark ? 'border-[#3E352F]' : 'border-[#DDD4CA]'}`}>
                  <div className="font-bold truncate">{currentUser?.name || 'Executive User'}</div>
                  <div className={`text-[11px] truncate ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                    {currentUser?.email || 'executive@zynetra.io'}
                  </div>
                  <div
                    className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold"
                    style={{
                      backgroundColor: `${activeTheme.primaryColor}20`,
                      color: activeTheme.primaryColor,
                    }}
                  >
                    {currentUser?.role || 'Executive'} &bull; {currentUser?.organization || currentWorkspace.organization}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    if (onNavigateTab) onNavigateTab('profile');
                    else onOpenProfile();
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-[#322A26]' : 'hover:bg-[#F8F3EC]'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Zynetra Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    if (onNavigateTab) onNavigateTab('settings');
                    else onOpenSettings();
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-[#322A26]' : 'hover:bg-[#F8F3EC]'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Workspace Settings</span>
                </button>

                {onNavigateLanding && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      onNavigateLanding();
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                      isDark ? 'hover:bg-[#322A26]' : 'hover:bg-[#F8F3EC]'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Zynetra Home Page</span>
                  </button>
                )}

                {onLogout && (
                  <div className={`border-t mt-1 pt-1 ${isDark ? 'border-[#3E352F]' : 'border-[#DDD4CA]'}`}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        onLogout();
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 text-[#C48C7B] hover:bg-[#A56F5D]/10 font-semibold transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Return to Home / Landing Page */}
          {onNavigateLanding && (
            <button
              onClick={onNavigateLanding}
              className={`hidden md:flex p-2 rounded-lg border transition-colors ${
                isDark
                  ? 'border-[#3E352F] bg-[#26201D] hover:bg-[#322A26] text-[#A3988E]'
                  : 'border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-[#756D65]'
              }`}
              title="Return to Commercial Overview"
            >
              <Home className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Logout Action */}
          {onLogout && (
            <button
              onClick={onLogout}
              className={`hidden md:flex p-2 rounded-lg border transition-colors ${
                isDark
                  ? 'border-[#3E352F] bg-[#26201D] hover:bg-[#322A26] text-[#A3988E]'
                  : 'border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-[#756D65]'
              }`}
              title="Sign Out of Terminal"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Mobile Navigation Drawer Trigger (Hamburger) */}
          {onOpenMobileMenu && (
            <button
              type="button"
              id="btn-navbar-mobile-menu"
              onClick={onOpenMobileMenu}
              className={`p-2 rounded-lg border md:hidden transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center ${
                isDark
                  ? 'border-[#3E352F] bg-[#26201D] hover:bg-[#322A26] text-[#EDE6DE]'
                  : 'border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-[#292522]'
              }`}
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Autonomous Business Objective Banner & Primary Action */}
      <div
        className={`px-4 sm:px-6 lg:px-8 py-2.5 border-t text-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 transition-colors ${
          isDark ? 'border-[#3E352F] bg-[#181513]' : 'border-[#DDD4CA] bg-[#EEE7DE]/70'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <span
            className={`px-2 py-1 sm:py-0.5 rounded-md font-mono text-[10px] uppercase tracking-wider whitespace-nowrap font-semibold border text-center sm:text-left self-start sm:self-auto ${
              isDark
                ? 'border-[#3E352F] bg-[#26201D] text-[#EDE6DE]'
                : 'border-[#DDD4CA] bg-[#F8F3EC] text-[#49362F]'
            }`}
          >
            Autonomous Goal
          </span>
          <input
            type="text"
            value={objective}
            onChange={e => onObjectiveChange(e.target.value)}
            placeholder="e.g. Identify root causes of ARR churn or Forecast next quarter pipeline..."
            className={`w-full md:w-[480px] lg:w-[620px] px-3 py-2 sm:py-1.5 text-xs rounded-lg border transition-colors ${
              isDark
                ? 'border-[#3E352F] bg-[#26201D] text-[#EDE6DE] placeholder-[#A3988E]/70 focus:outline-none'
                : 'border-[#DDD4CA] bg-white text-[#292522] placeholder-[#756D65]/70 focus:outline-none'
            }`}
            style={{
              borderColor: objective ? activeTheme.primaryColor : undefined,
            }}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Primary Action Button dynamically styled with activeTheme */}
          <button
            onClick={onRunAnalysis}
            disabled={isAnalyzing}
            className="flex items-center justify-center gap-2 px-5 py-2.5 sm:py-2 rounded-lg text-white font-semibold text-xs tracking-wider uppercase transition-all disabled:opacity-50 shadow-2xs hover:brightness-110 w-full md:w-auto min-h-[42px] sm:min-h-0"
            style={{ backgroundColor: activeTheme.primaryColor }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Synthesizing...' : 'Execute Autonomous Engine'}</span>
          </button>
        </div>
      </div>

      {/* New Workspace Modal */}
      {showNewWorkspaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div
            className={`max-w-md w-full rounded-xl border p-6 shadow-xl ${
              isDark ? 'border-[#3E352F] bg-[#26201D] text-[#EDE6DE]' : 'border-[#DDD4CA] bg-white text-[#292522]'
            }`}
          >
            <h3 className="text-base font-bold mb-1">Create Analytics Workspace</h3>
            <p className={`text-xs mb-4 ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
              Workspaces isolate data ingestion sources, automated pipelines, and team reports.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Workspace Name</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Enterprise Q4"
                  value={newWsName}
                  onChange={e => setNewWsName(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border ${
                    isDark ? 'border-[#3E352F] bg-[#181513] text-[#EDE6DE]' : 'border-[#DDD4CA] bg-[#F5F0E9] text-[#292522]'
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Organization / Department</label>
                <input
                  type="text"
                  placeholder="e.g. Global Revenue Operations"
                  value={newWsOrg}
                  onChange={e => setNewWsOrg(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border ${
                    isDark ? 'border-[#3E352F] bg-[#181513] text-[#EDE6DE]' : 'border-[#DDD4CA] bg-[#F5F0E9] text-[#292522]'
                  }`}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowNewWorkspaceModal(false)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${
                  isDark ? 'border-[#3E352F] text-[#A3988E] hover:bg-[#181513]' : 'border-[#DDD4CA] text-[#756D65] hover:bg-[#F5F0E9]'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newWsName) {
                    onCreateWorkspace(newWsName, newWsOrg || 'Enterprise');
                    setShowNewWorkspaceModal(false);
                    setNewWsName('');
                    setNewWsOrg('');
                  }
                }}
                className="px-4 py-1.5 rounded-lg text-white text-xs font-semibold shadow-2xs"
                style={{ backgroundColor: activeTheme.primaryColor }}
              >
                Create Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
