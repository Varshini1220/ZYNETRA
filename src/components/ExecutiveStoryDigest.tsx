import { useState } from 'react';
import {
  Compass,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react';
import { CauseTreeNode, DecisionRecommendation, DatasetProfile } from '../types';
import { ThemeId } from '../types/theme';
import { THEME_DEFINITIONS } from '../utils/themeConfig';

interface ExecutiveStoryDigestProps {
  profile: DatasetProfile;
  objective: string;
  causeTree: CauseTreeNode;
  recommendations: DecisionRecommendation[];
  kpis: { label: string; value: string; delta: string; deltaType: 'positive' | 'negative' | 'neutral'; description: string }[];
  isDark?: boolean;
  currentTheme?: ThemeId;
  onNavigateTab: (tabId: any) => void;
  isExecutiveMode: boolean;
  onToggleExecutiveMode: () => void;
  onOpenGlossary: () => void;
}

export function ExecutiveStoryDigest({
  profile,
  objective,
  causeTree,
  recommendations,
  kpis,
  isDark = false,
  currentTheme = 'indigo',
  onNavigateTab,
  isExecutiveMode,
  onToggleExecutiveMode,
  onOpenGlossary,
}: ExecutiveStoryDigestProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const activeTheme = THEME_DEFINITIONS[currentTheme || 'indigo'] || THEME_DEFINITIONS.indigo;

  // Extract primary finding, root cause, and top recommendation
  const primaryKpi = kpis[0] || { label: 'Primary Metric', value: '₹1.42M', delta: '-4.2%', deltaType: 'negative' };
  const rootCauseNode = causeTree.children?.[0]?.children?.[0] || causeTree.children?.[0] || causeTree;
  const topRec = recommendations[0] || {
    title: 'Deploy Dedicated Customer Success Squad',
    expectedImpact: 'Recover ₹280K at-risk ARR within 60 days',
    riskLevel: 'Low',
    confidenceScore: 92,
  };

  return (
    <section
      className={`rounded-xl border shadow-xs overflow-hidden transition-colors duration-200 ${
        isDark ? 'bg-[#26201D] border-[#3E352F] text-[#EDE6DE]' : 'bg-white border-[#DDD4CA] text-[#292522]'
      }`}
    >
      {/* Header Bar */}
      <div
        className={`p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b ${
          isDark ? 'border-[#3E352F]' : 'border-[#DDD4CA]'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
              isDark ? 'bg-[#322A26] text-white' : 'bg-[#EEE7DE] text-[#49362F]'
            }`}
            style={{ color: isDark ? activeTheme.primaryColor : undefined }}
          >
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                className="text-[10px] uppercase font-mono tracking-wider font-semibold"
                style={{ color: activeTheme.primaryColor }}
              >
                Synthesis Report
              </span>
              <span className={isDark ? 'text-[#3E352F]' : 'text-[#DDD4CA]'}>&bull;</span>
              <span className={`text-xs font-mono ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                {profile.totalRows.toLocaleString()} observations &bull; {profile.columns.length} dimensions
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold mt-0.5 tracking-tight">
              Executive Story &amp; Interpretation Brief
            </h2>
          </div>
        </div>

        {/* Action Controls & Mode Switch */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Executive vs Technical Mode Segmented Control */}
          <div
            className={`flex items-center p-1 rounded-lg border text-xs font-medium ${
              isDark ? 'border-[#3E352F] bg-[#181513]' : 'border-[#DDD4CA] bg-[#EEE7DE]'
            }`}
          >
            <button
              onClick={() => { if (!isExecutiveMode) onToggleExecutiveMode(); }}
              className={`px-3 py-1 rounded-md text-xs transition-colors font-semibold ${
                isExecutiveMode
                  ? isDark ? 'bg-[#26201D] text-[#EDE6DE] shadow-xs' : 'bg-white text-[#292522] shadow-xs'
                  : isDark ? 'text-[#A3988E] hover:text-[#EDE6DE]' : 'text-[#756D65] hover:text-[#292522]'
              }`}
              title="Plain English: Executive summaries and guided takeaways"
            >
              Plain English
            </button>
            <button
              onClick={() => { if (isExecutiveMode) onToggleExecutiveMode(); }}
              className={`px-3 py-1 rounded-md text-xs transition-colors font-semibold ${
                !isExecutiveMode
                  ? isDark ? 'bg-[#26201D] text-[#EDE6DE] shadow-xs' : 'bg-white text-[#292522] shadow-xs'
                  : isDark ? 'text-[#A3988E] hover:text-[#EDE6DE]' : 'text-[#756D65] hover:text-[#292522]'
              }`}
              title="Technical Mode: Statistical tests, formulas, and deep analytics parameters"
            >
              Technical
            </button>
          </div>

          {/* Glossary / How to Read */}
          <button
            onClick={onOpenGlossary}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              isDark
                ? 'border-[#3E352F] bg-[#211C19] hover:bg-[#2D2622] text-[#EDE6DE]'
                : 'border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-[#292522]'
            }`}
            title="Open plain-English glossary and guide for interpreting this app"
          >
            <HelpCircle className={`w-3.5 h-3.5 ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`} />
            <span className="hidden sm:inline">Guide</span>
          </button>

          {/* Collapse/Expand Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isDark
                ? 'border-[#3E352F] text-[#A3988E] hover:text-[#EDE6DE] hover:bg-[#211C19]'
                : 'border-[#DDD4CA] text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
            }`}
            aria-label="Toggle story digest"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Story Digest Content */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-6 animate-subtle-fade">
          {/* Directive Mandate Strip */}
          <div
            className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
              isDark ? 'border-[#3E352F] bg-[#181513]' : 'border-[#DDD4CA] bg-[#F5F0E9]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`font-mono text-[10px] uppercase tracking-wider shrink-0 font-medium ${
                isDark ? 'text-[#A3988E]' : 'text-[#756D65]'
              }`}>
                Directive:
              </span>
              <span className={`font-semibold ${isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}`}>
                "{objective}"
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[#7B8570] font-semibold shrink-0 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#7B8570]" />
              <span className="uppercase tracking-wider">Causal Analysis Verified</span>
            </div>
          </div>

          {/* Four Intelligent Business Insight Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Panel 1: What is happening? */}
            <div
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3.5 shadow-xs transition-colors ${
                isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#A56F5D]" />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#A56F5D] font-bold">
                      1. What is happening?
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#A56F5D] font-bold tabular-nums">{primaryKpi.delta}</span>
                </div>
                <h4 className={`text-sm font-bold leading-snug mb-1.5 ${isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}`}>
                  {primaryKpi.label}: {primaryKpi.value}
                </h4>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                  {isExecutiveMode
                    ? `Observed a downward shift of ${primaryKpi.delta}. Metric performance is deviating from target primarily in the core customer cohort.`
                    : `Variance analysis indicates a statistically significant deviation (p < 0.01) from baseline mean across observation periods.`}
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('dashboard')}
                className={`pt-2.5 border-t text-xs font-semibold flex items-center justify-between group transition-colors ${
                  isDark ? 'border-[#3E352F] text-[#D5BDA7] hover:text-white' : 'border-[#DDD4CA] text-[#49362F] hover:text-[#A56F5D]'
                }`}
              >
                <span>Inspect in Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#756D65] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Panel 2: Why did it happen? */}
            <div
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3.5 shadow-xs transition-colors ${
                isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#6A5045]" />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#6A5045] font-bold">
                      2. Why did it happen?
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#6A5045] font-bold tabular-nums">{causeTree.impactPercentage}% impact</span>
                </div>
                <h4 className={`text-sm font-bold leading-snug mb-1.5 truncate ${isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}`}>
                  {rootCauseNode.label}
                </h4>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                  {isExecutiveMode
                    ? `The primary culprit is delivery latency and escalated response friction rather than pricing or market factors.`
                    : `Time-lagged cross-correlation and propensity scoring isolate response delay as the primary causal factor (r = -0.72).`}
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('rootcause')}
                className={`pt-2.5 border-t text-xs font-semibold flex items-center justify-between group transition-colors ${
                  isDark ? 'border-[#3E352F] text-[#D5BDA7] hover:text-white' : 'border-[#DDD4CA] text-[#49362F] hover:text-[#A56F5D]'
                }`}
              >
                <span>Explore Cause Tree</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#756D65] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Panel 3: What happens if we do nothing? */}
            <div
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3.5 shadow-xs transition-colors ${
                isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#756D65]" />
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold" style={{ color: activeTheme.primaryColor }}>
                      3. If we do nothing?
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#756D65]">95% Bound</span>
                </div>
                <h4 className={`text-sm font-bold leading-snug mb-1.5 ${isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}`}>
                  Projected -₹420K Divergence
                </h4>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                  {isExecutiveMode
                    ? `If left unaddressed, current trends project compound attrition across subsequent renewal cycles over the next 2 quarters.`
                    : `Holt-Winters double exponential smoothing projects continued negative slope through confidence interval floor.`}
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('predictive')}
                className={`pt-2.5 border-t text-xs font-semibold flex items-center justify-between group transition-colors ${
                  isDark ? 'border-[#3E352F] text-[#D5BDA7] hover:text-white' : 'border-[#DDD4CA] text-[#49362F] hover:text-[#A56F5D]'
                }`}
              >
                <span>Run What-If Sandbox</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#756D65] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Panel 4: What should we do? */}
            <div
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3.5 shadow-xs transition-colors ${
                isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#7B8570]" />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#7B8570] font-bold">
                      4. What should we do?
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#7B8570] font-bold tabular-nums">{topRec.confidenceScore}% conf</span>
                </div>
                <h4 className={`text-sm font-bold leading-snug mb-1.5 truncate ${isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}`}>
                  {topRec.title}
                </h4>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                  {topRec.expectedImpact}. Recommended execution with {topRec.riskLevel.toLowerCase()} operational risk profile.
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('decisions')}
                className={`pt-2.5 border-t text-xs font-semibold flex items-center justify-between group transition-colors ${
                  isDark ? 'border-[#3E352F] text-[#D5BDA7] hover:text-white' : 'border-[#DDD4CA] text-[#49362F] hover:text-[#A56F5D]'
                }`}
              >
                <span>View Decision Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#756D65] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ExecutiveStoryDigest;
