import React from 'react';
import {
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
  ArrowRight,
  Database as DatabaseIcon,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  DatasetProfile,
  CauseTreeNode,
  DecisionRecommendation,
  NaturalInsight,
  CleaningAction,
  MainTab,
} from '../../types';
import { ThemeId } from '../../types/theme';
import { THEME_DEFINITIONS } from '../../utils/themeConfig';
import { ExecutiveStoryDigest } from '../ExecutiveStoryDigest';
import { ANALYTICS_ROUTES } from '../../utils/navigation';

interface AnalyticsOverviewPageProps {
  profile: DatasetProfile;
  objective: string;
  causeTree: CauseTreeNode;
  recommendations: DecisionRecommendation[];
  kpis: {
    label: string;
    value: string;
    delta: string;
    deltaType: 'positive' | 'negative' | 'neutral';
    description: string;
  }[];
  insightsCount: number;
  recommendationsCount: number;
  cleaningCount: number;
  presentationCount: number;
  isDark?: boolean;
  currentTheme?: ThemeId;
  onNavigateTab: (tab: MainTab) => void;
  isExecutiveMode: boolean;
  onToggleExecutiveMode: () => void;
  onOpenGlossary: () => void;
  onOpenUpload?: () => void;
  onOpenGenerateDashboards?: () => void;
}

export default function AnalyticsOverviewPage({
  profile,
  objective,
  causeTree,
  recommendations,
  kpis,
  insightsCount,
  recommendationsCount,
  cleaningCount,
  presentationCount,
  isDark = false,
  currentTheme = 'indigo',
  onNavigateTab,
  isExecutiveMode,
  onToggleExecutiveMode,
  onOpenGlossary,
  onOpenUpload,
  onOpenGenerateDashboards,
}: AnalyticsOverviewPageProps) {
  const activeTheme = THEME_DEFINITIONS[currentTheme || 'indigo'] || THEME_DEFINITIONS.indigo;

  const moduleCards: {
    id: MainTab;
    title: string;
    description: string;
    icon: React.ElementType;
    badge: string;
    badgeCount?: number;
    category: string;
  }[] = [
    {
      id: 'dashboard',
      title: 'Executive Dashboard',
      description: 'Historical trajectory corridor, revenue impact breakdown, and regional performance density.',
      icon: LayoutDashboard,
      badge: 'Live Telemetry',
      category: 'Core Analysis',
    },
    {
      id: 'presentations',
      title: 'Analyst Presentation Deck',
      description: 'Autonomous 6-slide boardroom deck with unit economics, speaker notes, and presentation mode.',
      icon: Presentation,
      badge: 'Deck Ready',
      badgeCount: presentationCount,
      category: 'Core Analysis',
    },
    {
      id: 'rootcause',
      title: 'Root-Cause Tree',
      description: 'Diagnostic tree isolating primary causal drivers and statistical variance propagation.',
      icon: GitBranch,
      badge: 'Causal Model',
      category: 'Diagnostic',
    },
    {
      id: 'insights',
      title: 'Natural Insights',
      description: 'Autonomous natural language findings with empirical citations and anomaly detection.',
      icon: Sparkles,
      badge: 'Discovered',
      badgeCount: insightsCount,
      category: 'Diagnostic',
    },
    {
      id: 'predictive',
      title: 'Predictive & What-If',
      description: 'Interactive counterfactual simulation sandbox with driver sensitivity and variance forecast.',
      icon: Activity,
      badge: '95% Confidence',
      category: 'Forward Modeling',
    },
    {
      id: 'decisions',
      title: 'Prioritized Decisions',
      description: 'Prescriptive action plans ranked by financial ROI, execution complexity, and feasibility.',
      icon: CheckSquare,
      badge: 'Decisions',
      badgeCount: recommendationsCount,
      category: 'Forward Modeling',
    },
    {
      id: 'data',
      title: 'Data Clean & Audit',
      description: 'Comprehensive data hygiene report, schema anomalies, and autonomous deduplication rules.',
      icon: Database,
      badge: 'Cleaned',
      badgeCount: cleaningCount,
      category: 'Data Governance',
    },
    {
      id: 'news',
      title: 'External Signals & News',
      description: 'Macroeconomic news and market disruptions correlated with observed telemetry variance.',
      icon: Radio,
      badge: 'Macro Signals',
      category: 'Macro Intelligence',
    },
    {
      id: 'reports',
      title: 'Executive Reports & Exports',
      description: 'Comprehensive exportable analytical briefs, executive summaries, and record tables.',
      icon: FileText,
      badge: 'Export Hub',
      category: 'Governance & Export',
    },
    {
      id: 'ingest',
      title: 'Data Connectors',
      description: 'Production database connectors, dataset version management, and point-in-time restore.',
      icon: UploadCloud,
      badge: 'Pipeline Online',
      category: 'Governance & Export',
    },
  ];

  return (
    <div className="space-y-6 animate-subtle-fade font-sans">
      {/* Top Banner: Analytics Hub Header */}
      <div
        className={`p-4 sm:p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
          isDark
            ? 'border-[#3E352F] bg-[#26201D] text-[#EDE6DE]'
            : 'border-[#DDD4CA] bg-white text-[#292522]'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] font-mono uppercase tracking-widest font-bold px-2 py-0.5 rounded-md"
              style={{
                backgroundColor: `${activeTheme.primaryColor}20`,
                color: activeTheme.primaryColor,
              }}
            >
              Enterprise Terminal
            </span>
            <span className={isDark ? 'text-[#3E352F]' : 'text-[#DDD4CA]'}>&bull;</span>
            <span className={`text-xs font-mono ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
              {profile.name} &bull; v{profile.version}
            </span>
            <span className={isDark ? 'text-[#3E352F]' : 'text-[#DDD4CA]'}>&bull;</span>
            <span className="text-[#7B8570] font-semibold font-mono text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7B8570]" />
              {profile.overallQualityScore}/100 Quality
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Analytics Intelligence Hub
          </h1>
          <p className={`text-xs max-w-2xl leading-relaxed ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
            Autonomous data-to-decision architecture. Each module operates as a dedicated analytics surface. Select any module below or use the sidebar navigation.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 w-full sm:w-auto justify-end flex-wrap sm:flex-nowrap">
          {onOpenGenerateDashboards && (
            <button
              onClick={onOpenGenerateDashboards}
              className="px-4 py-2.5 sm:py-2 rounded-xl text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-2xs hover:brightness-110 w-full sm:w-auto text-center justify-center min-h-[40px] sm:min-h-0"
              style={{ backgroundColor: activeTheme.primaryColor }}
            >
              Generate Presentation
            </button>
          )}
          {onOpenUpload && (
            <button
              onClick={onOpenUpload}
              className={`px-3.5 py-2.5 sm:py-2 rounded-xl border text-xs font-semibold transition-colors w-full sm:w-auto text-center justify-center min-h-[40px] sm:min-h-0 ${
                isDark
                  ? 'border-[#3E352F] bg-[#211C19] hover:bg-[#2D2622] text-[#EDE6DE]'
                  : 'border-[#DDD4CA] bg-[#F8F3EC] hover:bg-[#EEE7DE] text-[#292522]'
              }`}
            >
              Upload Data
            </button>
          )}
        </div>
      </div>

      {/* Concise Executive Story & Interpretation Digest */}
      <ExecutiveStoryDigest
        profile={profile}
        objective={objective}
        causeTree={causeTree}
        recommendations={recommendations}
        kpis={kpis}
        isDark={isDark}
        currentTheme={currentTheme}
        onNavigateTab={onNavigateTab}
        isExecutiveMode={isExecutiveMode}
        onToggleExecutiveMode={onToggleExecutiveMode}
        onOpenGlossary={onOpenGlossary}
      />

      {/* Analytics Module Navigation Directory Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold tracking-tight uppercase font-mono text-[11px] text-[#756D65]">
              Analytics Module Directory
            </h3>
            <p className={`text-xs ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
              Select a dedicated page to examine specific analytical models and diagnostics.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {moduleCards.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition-all duration-200 group ${
                  isDark
                    ? 'border-[#3E352F] bg-[#26201D] hover:border-[#4E443C]'
                    : 'border-[#DDD4CA] bg-white hover:border-[#C4B9AE]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                        isDark ? 'bg-[#322A26]' : 'bg-[#EEE7DE]'
                      }`}
                      style={{ color: activeTheme.primaryColor }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {mod.badgeCount !== undefined ? (
                        <span
                          className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold"
                          style={{
                            backgroundColor: `${activeTheme.primaryColor}20`,
                            color: activeTheme.primaryColor,
                          }}
                        >
                          {mod.badgeCount} {mod.badge}
                        </span>
                      ) : (
                        <span
                          className={`px-2 py-0.5 rounded-md font-mono text-[10px] border ${
                            isDark
                              ? 'border-[#3E352F] bg-[#211C19] text-[#A3988E]'
                              : 'border-[#DDD4CA] bg-[#F8F3EC] text-[#756D65]'
                          }`}
                        >
                          {mod.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold group-hover:underline">
                      {mod.title}
                    </h4>
                    <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                      {mod.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t flex items-center justify-between"
                  style={{ borderColor: isDark ? '#3E352F' : '#DDD4CA' }}
                >
                  <span className={`text-[10px] font-mono uppercase tracking-wider ${
                    isDark ? 'text-[#A3988E]' : 'text-[#756D65]'
                  }`}>
                    {mod.category}
                  </span>
                  <button
                    onClick={() => onNavigateTab(mod.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold group-hover:translate-x-1 transition-transform cursor-pointer"
                    style={{ color: activeTheme.primaryColor }}
                  >
                    <span>Open Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
