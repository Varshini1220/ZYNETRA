import React from 'react';
import {
  Compass,
  LayoutDashboard,
  Presentation,
  GitBranch,
  Sparkles,
  Activity,
  CheckSquare,
  Database,
  Radio,
  FileText,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  Play,
  RotateCw,
  X,
  SlidersHorizontal,
  User as UserIcon,
  LogOut,
  Layers,
} from 'lucide-react';
import { MainTab } from '../types';
import { ThemeId } from '../types/theme';
import { THEME_DEFINITIONS } from '../utils/themeConfig';

interface SidebarProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  presentationCount?: number;
  insightCount?: number;
  recommendationCount?: number;
  cleaningCount?: number;
  qualityScore: number;
  datasetName: string;
  isAnalyzing: boolean;
  onRunAnalysis: () => void;
  onOpenHelp: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isDark?: boolean;
  currentTheme?: ThemeId;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenUpload?: () => void;
  onOpenGenerateDashboards?: () => void;
  onOpenSettings?: () => void;
  onLogout?: () => void;
}

export default function Sidebar({
  activeTab,
  onSelectTab,
  presentationCount = 6,
  insightCount = 0,
  recommendationCount = 0,
  cleaningCount = 0,
  qualityScore,
  datasetName,
  isAnalyzing,
  onRunAnalysis,
  onOpenHelp,
  isCollapsed,
  onToggleCollapse,
  isDark = false,
  currentTheme = 'indigo',
  isMobileOpen = false,
  onCloseMobile,
  onOpenUpload,
  onOpenGenerateDashboards,
  onOpenSettings,
  onLogout,
}: SidebarProps) {
  const activeTheme = THEME_DEFINITIONS[currentTheme] || THEME_DEFINITIONS.indigo;

  const navItems: {
    id: MainTab;
    label: string;
    icon: React.ElementType;
    count?: number;
    group: 'core' | 'modeling' | 'governance' | 'account';
  }[] = [
    { id: 'overview', label: 'Overview', icon: Compass, group: 'core' },
    { id: 'analytics', label: 'Analytics', icon: Layers, group: 'core' },
    { id: 'dashboard', label: 'Dashboards', icon: LayoutDashboard, group: 'core' },
    { id: 'presentations', label: 'Presentations', icon: Presentation, count: presentationCount, group: 'core' },
    { id: 'rootcause', label: 'Root-Cause Analysis', icon: GitBranch, group: 'core' },
    { id: 'insights', label: 'Natural Insights', icon: Sparkles, count: insightCount, group: 'core' },
    { id: 'predictive', label: 'Predictive & What-If', icon: Activity, group: 'modeling' },
    { id: 'decisions', label: 'Prioritized Decisions', icon: CheckSquare, count: recommendationCount, group: 'modeling' },
    { id: 'data', label: 'Data Clean', icon: Database, count: cleaningCount, group: 'governance' },
    { id: 'ingest', label: 'Datasets', icon: UploadCloud, group: 'governance' },
    { id: 'reports', label: 'Reports', icon: FileText, group: 'governance' },
    { id: 'news', label: 'External Signals', icon: Radio, group: 'governance' },
    { id: 'profile', label: 'Profile', icon: UserIcon, group: 'account' },
    { id: 'settings', label: 'Settings', icon: SlidersHorizontal, group: 'account' },
  ];

  return (
    <>
      {/* Desktop Aside Navigation (Permanent on md: and up) */}
      <aside
        className={`hidden md:flex shrink-0 transition-all duration-300 ease-in-out border-r flex-col justify-between select-none ${
          isCollapsed ? 'w-16' : 'w-64'
        } ${
          isDark ? 'border-[#3E352F] bg-[#211C19] text-[#EDE6DE]' : 'border-[#DDD4CA] bg-[#EEE7DE] text-[#292522]'
        }`}
        style={{ minHeight: 'calc(100vh - 4rem)' }}
      >
        {/* Top Section */}
        <div className="p-3 space-y-3 overflow-y-auto">
          {/* Workspace / Corpus Quick Card */}
          {!isCollapsed ? (
            <div
              className={`p-3 rounded-xl border space-y-1.5 shadow-2xs transition-colors ${
                isDark ? 'border-[#3E352F] bg-[#26201D]' : 'border-[#DDD4CA] bg-[#F8F3EC]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#756D65]">
                <span className={isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}>Active Corpus</span>
                <span className="text-[#7B8570] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7B8570]" />
                  {qualityScore}/100
                </span>
              </div>
              <div className={`text-xs font-semibold truncate ${isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}`} title={datasetName}>
                {datasetName}
              </div>
              <div
                className={`flex items-center justify-between text-[10px] pt-1 border-t ${
                  isDark ? 'border-[#3E352F] text-[#A3988E]' : 'border-[#DDD4CA]/70 text-[#756D65]'
                }`}
              >
                <span>Zynetra Engine</span>
                <span className="font-semibold" style={{ color: activeTheme.primaryColor }}>
                  Autonomous
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title={`${datasetName} (${qualityScore}/100 Quality)`}>
              <div
                className={`w-9 h-9 rounded-lg border flex flex-col items-center justify-center text-[10px] font-bold ${
                  isDark ? 'border-[#3E352F] bg-[#26201D] text-[#EDE6DE]' : 'border-[#DDD4CA] bg-[#F8F3EC] text-[#292522]'
                }`}
              >
                <span>{qualityScore}</span>
              </div>
            </div>
          )}

          {/* Navigation List */}
          <nav className="space-y-0.5">
            {!isCollapsed && (
              <div
                className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 ${
                  isDark ? 'text-[#A3988E]' : 'text-[#756D65]'
                }`}
              >
                Zynetra Workspace
              </div>
            )}

            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const showAccountDivider = item.id === 'profile' && !isCollapsed;

              return (
                <React.Fragment key={item.id}>
                  {showAccountDivider && (
                    <div
                      className={`text-[10px] font-mono uppercase tracking-wider px-2.5 pt-2.5 pb-1 border-t mt-2 ${
                        isDark ? 'border-[#3E352F] text-[#A3988E]' : 'border-[#DDD4CA] text-[#756D65]'
                      }`}
                    >
                      Account &amp; System
                    </div>
                  )}
                  <button
                    onClick={() => onSelectTab(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all duration-150 text-left relative cursor-pointer ${
                      isActive
                        ? isDark
                          ? 'text-[#EDE6DE] font-semibold shadow-2xs'
                          : 'text-[#292522] font-semibold shadow-2xs'
                        : isDark
                        ? 'text-[#A3988E] hover:text-[#EDE6DE] hover:bg-[#26201D] border border-transparent'
                        : 'text-[#756D65] hover:text-[#292522] hover:bg-[#F8F3EC]/60 border border-transparent'
                    }`}
                    style={
                      isActive
                        ? {
                            backgroundColor: isDark ? `${activeTheme.primaryColor}30` : `${activeTheme.primaryColor}18`,
                            borderColor: activeTheme.primaryColor,
                            borderWidth: '1px',
                          }
                        : undefined
                    }
                  >
                    {/* Active Dynamic indicator strip */}
                    {isActive && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r"
                        style={{ backgroundColor: activeTheme.primaryColor }}
                      />
                    )}

                    <Icon
                      className="w-4 h-4 shrink-0 transition-colors"
                      style={{ color: isActive ? activeTheme.primaryColor : undefined }}
                    />

                    {!isCollapsed && <span className="truncate flex-1">{item.label}</span>}

                    {!isCollapsed && item.count !== undefined && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono tabular-nums ${
                          isActive
                            ? isDark
                              ? 'bg-[#322A26] text-white font-bold'
                              : 'bg-[#E8EBE1] text-[#292522] font-bold'
                            : isDark
                            ? 'bg-[#26201D] text-[#A3988E]'
                            : 'bg-[#DDD4CA]/60 text-[#756D65]'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div
          className={`p-3 border-t space-y-2 transition-colors ${
            isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#EEE7DE]'
          }`}
        >
          {/* Quick Run Engine button styled with activeTheme.primaryColor */}
          {!isCollapsed ? (
            <button
              onClick={onRunAnalysis}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white text-xs font-semibold tracking-wider uppercase transition-all disabled:opacity-50 shadow-2xs cursor-pointer"
              style={{ backgroundColor: activeTheme.primaryColor }}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Running...' : 'Run Engine'}</span>
            </button>
          ) : (
            <button
              onClick={onRunAnalysis}
              disabled={isAnalyzing}
              title="Execute Autonomous Engine"
              className="w-full flex items-center justify-center p-2 rounded-lg text-white transition-all disabled:opacity-50 shadow-2xs cursor-pointer"
              style={{ backgroundColor: activeTheme.primaryColor }}
            >
              <Play className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            </button>
          )}

          {/* Guide / Interpretation button */}
          <button
            onClick={onOpenHelp}
            title="Interpretability & Reading Guide"
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center' : 'justify-between'
            } ${
              isDark
                ? 'border-[#3E352F] bg-[#26201D] text-[#A3988E] hover:text-[#EDE6DE] hover:bg-[#2D2622]'
                : 'border-[#DDD4CA] bg-[#F8F3EC] text-[#756D65] hover:text-[#292522] hover:bg-[#FFFFFF]'
            }`}
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5" />
              {!isCollapsed && <span>Methodology Guide</span>}
            </div>
            {!isCollapsed && <ShieldCheck className="w-3.5 h-3.5 text-[#7B8570]" />}
          </button>

          {/* Logout & Collapse Row */}
          <div className="flex items-center justify-between pt-1">
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                title="Log Out of Zynetra"
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  isDark
                    ? 'text-[#C48C7B] hover:bg-[#26201D]'
                    : 'text-[#A56F5D] hover:bg-[#F8F3EC]'
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
                {!isCollapsed && <span>Logout</span>}
              </button>
            )}

            <button
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                isDark ? 'text-[#A3988E] hover:text-[#EDE6DE] hover:bg-[#26201D]' : 'text-[#756D65] hover:text-[#292522] hover:bg-[#F8F3EC]'
              }`}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <div className="flex items-center gap-1 text-[11px] px-1 py-0.5">
                  <span>Collapse</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Slide-Over Drawer Navigation (Visible on md:hidden when isMobileOpen) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-subtle-fade select-none">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={onCloseMobile}
            aria-label="Close navigation overlay"
          />

          {/* Slide-over panel */}
          <div
            className={`relative w-72 max-w-[85vw] h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 border-r animate-slide-right ${
              isDark ? 'border-[#3E352F] bg-[#211C19] text-[#EDE6DE]' : 'border-[#DDD4CA] bg-[#EEE7DE] text-[#292522]'
            }`}
          >
            {/* Top Section */}
            <div className="p-4 space-y-4">
              {/* Header with Close Button */}
              <div
                className="flex items-center justify-between pb-3 border-b"
                style={{ borderColor: isDark ? '#3E352F' : '#DDD4CA' }}
              >
                <div>
                  <span
                    className="text-[10px] uppercase font-mono tracking-wider font-semibold"
                    style={{ color: activeTheme.primaryColor }}
                  >
                    Zynetra Workspace
                  </span>
                  <h3 className="text-sm font-bold">Analytics Navigation</h3>
                </div>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className={`p-2 rounded-lg border transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center ${
                    isDark ? 'border-[#3E352F] hover:bg-[#2D2622] text-[#A3988E]' : 'border-[#DDD4CA] hover:bg-[#F8F3EC] text-[#756D65]'
                  }`}
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Active Corpus Card */}
              <div
                className={`p-3 rounded-xl border space-y-1.5 shadow-2xs transition-colors ${
                  isDark ? 'border-[#3E352F] bg-[#26201D]' : 'border-[#DDD4CA] bg-[#F8F3EC]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#756D65]">
                  <span className={isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}>Active Corpus</span>
                  <span className="text-[#7B8570] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7B8570]" />
                    {qualityScore}/100
                  </span>
                </div>
                <div className={`text-xs font-semibold truncate ${isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}`} title={datasetName}>
                  {datasetName}
                </div>
              </div>

              {/* Mobile Navigation List */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        onCloseMobile?.();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all duration-150 text-left relative cursor-pointer min-h-[42px] ${
                        isActive
                          ? isDark
                            ? 'text-[#EDE6DE] font-semibold shadow-2xs'
                            : 'text-[#292522] font-semibold shadow-2xs'
                          : isDark
                          ? 'text-[#A3988E] hover:text-[#EDE6DE] hover:bg-[#26201D] border border-transparent'
                          : 'text-[#756D65] hover:text-[#292522] hover:bg-[#F8F3EC]/60 border border-transparent'
                      }`}
                      style={
                        isActive
                          ? {
                              backgroundColor: isDark ? `${activeTheme.primaryColor}30` : `${activeTheme.primaryColor}18`,
                              borderColor: activeTheme.primaryColor,
                              borderWidth: '1px',
                            }
                          : undefined
                      }
                    >
                      {isActive && (
                        <span
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r"
                          style={{ backgroundColor: activeTheme.primaryColor }}
                        />
                      )}

                      <Icon
                        className="w-4 h-4 shrink-0 transition-colors"
                        style={{ color: isActive ? activeTheme.primaryColor : undefined }}
                      />

                      <span className="truncate flex-1">{item.label}</span>

                      {item.count !== undefined && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono tabular-nums ${
                            isActive
                              ? isDark
                                ? 'bg-[#322A26] text-white font-bold'
                                : 'bg-[#E8EBE1] text-[#292522] font-bold'
                              : isDark
                              ? 'bg-[#26201D] text-[#A3988E]'
                              : 'bg-[#DDD4CA]/60 text-[#756D65]'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions Section */}
            <div
              className={`p-4 border-t space-y-2.5 transition-colors ${
                isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#EEE7DE]'
              }`}
            >
              {/* Quick Run Engine button */}
              <button
                onClick={() => {
                  onRunAnalysis();
                  onCloseMobile?.();
                }}
                disabled={isAnalyzing}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-white text-xs font-semibold tracking-wider uppercase transition-all disabled:opacity-50 shadow-2xs min-h-[44px]"
                style={{ backgroundColor: activeTheme.primaryColor }}
              >
                <RotateCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Running...' : 'Execute Autonomous Engine'}</span>
              </button>

              {/* Upload Data Quick Link */}
              {onOpenUpload && (
                <button
                  onClick={() => {
                    onOpenUpload();
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors min-h-[40px] ${
                    isDark
                      ? 'border-[#3E352F] bg-[#26201D] text-[#EDE6DE] hover:bg-[#2D2622]'
                      : 'border-[#DDD4CA] bg-[#F8F3EC] text-[#292522] hover:bg-[#FFFFFF]'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5 text-[#756D65]" />
                  <span>Upload Custom Dataset</span>
                </button>
              )}

              {/* Generate Presentation Deck */}
              {onOpenGenerateDashboards && (
                <button
                  onClick={() => {
                    onOpenGenerateDashboards();
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors min-h-[40px] ${
                    isDark
                      ? 'border-[#3E352F] bg-[#26201D] text-[#EDE6DE] hover:bg-[#2D2622]'
                      : 'border-[#DDD4CA] bg-[#F8F3EC] text-[#292522] hover:bg-[#FFFFFF]'
                  }`}
                >
                  <Presentation className="w-3.5 h-3.5 text-[#756D65]" />
                  <span>Generate Presentation</span>
                </button>
              )}

              {/* Guide button */}
              <button
                onClick={() => {
                  onOpenHelp();
                  onCloseMobile?.();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs transition-colors min-h-[40px] ${
                  isDark
                    ? 'border-[#3E352F] bg-[#26201D] text-[#A3988E] hover:text-[#EDE6DE]'
                    : 'border-[#DDD4CA] bg-[#F8F3EC] text-[#756D65] hover:text-[#292522]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Methodology Guide</span>
                </div>
                <ShieldCheck className="w-3.5 h-3.5 text-[#7B8570]" />
              </button>

              {/* Logout button */}
              {onLogout && (
                <button
                  onClick={() => {
                    onCloseMobile?.();
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[#A56F5D]/40 bg-[#A56F5D]/10 text-[#C48C7B] text-xs font-semibold min-h-[40px]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of Zynetra</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

