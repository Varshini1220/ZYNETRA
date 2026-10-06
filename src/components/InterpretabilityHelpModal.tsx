import { useState } from 'react';
import {
  X,
  TrendingUp,
  GitBranch,
  Database,
  Activity,
  CheckSquare,
  BookOpen,
  Search,
} from 'lucide-react';

interface InterpretabilityHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export function InterpretabilityHelpModal({
  isOpen,
  onClose,
  isDark: _isDark,
}: InterpretabilityHelpModalProps) {
  const [activeTopic, setActiveTopic] = useState<'screens' | 'glossary' | 'workflow'>('screens');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const screenGuides = [
    {
      title: 'Autonomous Dashboard',
      icon: TrendingUp,
      purpose: 'Synthesizes high-level business health without manual dashboard creation.',
      howToRead: [
        'KPI Cards: Show current metric value, change percentage vs baseline, and health direction (muted sage = positive, terracotta = warning).',
        'Time-Series Trajectory: The solid line is historical recorded actuals. The dashed terracotta line is where autonomous intelligence forecasts trajectory.',
        'Segment Contribution: Shows which customer tiers or product categories account for the primary financial weight.',
        'Feature Correlation: Positive indicates co-directional movement; negative indicates inverse trade-offs.',
      ],
    },
    {
      title: 'Root-Cause Cause Tree',
      icon: GitBranch,
      purpose: 'Answers "WHY is this happening?" using rigorous causal elimination instead of superficial correlations.',
      howToRead: [
        'Level 0 (Empirical Symptom): The top-level observed business impact (e.g. Sales dropped 4.2%).',
        'Level 1 (Primary Drivers): Where the variance is concentrated (e.g. Enterprise accounts).',
        'Level 2 (Root Cause): The underlying operational mechanism (e.g. Support ticket delays after month 6).',
        'Alternative Hypotheses: Proves why competing hypotheses (pricing, marketing) were ruled out.',
      ],
    },
    {
      title: 'Predictive & What-If Sandbox',
      icon: Activity,
      purpose: 'Simulate business interventions before committing capital or engineering resources.',
      howToRead: [
        'Interactive Sliders: Adjust price changes, growth budget, or retention squad allocation to test outcomes.',
        'Outcome Scorecards: Instantly update to show projected revenue, gross margin, and churn impact.',
        'Sensitivity Curve: Compares status quo (doing nothing) vs your simulated intervention.',
      ],
    },
    {
      title: 'Prioritized Decisions',
      icon: CheckSquare,
      purpose: 'Concrete, prioritized action roadmaps ranked by estimated ROI, time horizon, and operational risk.',
      howToRead: [
        'P1 Immediate (30 days): High urgency, targets the primary source of variance.',
        'P2 Strategic (60 days): Structural process or operational capability improvement.',
        'P3 Optimization (90 days): Long-term efficiency gain.',
        'Confidence & ROI: Quantifies estimated monetary benefit vs operational implementation risk.',
      ],
    },
    {
      title: 'Data Understanding & Cleansing',
      icon: Database,
      purpose: 'Audits data hygiene, repairs corrupted records, and enables rollback of any autonomous changes.',
      howToRead: [
        'Quality Score: Out of 100, measures missing values, duplicates, and outlier density.',
        'Audit Log: Every change has a clear explanation of "What Changed" and "Why It Changed".',
        'Reversible: Click "Revert Action" on any item if you prefer raw unaltered values.',
      ],
    },
  ];

  const glossaryTerms = [
    {
      term: 'Data Quality Index (0-100)',
      plainEnglish: 'A score representing how clean and reliable your dataset is based on completeness, uniqueness, and consistency.',
      technical: 'Composite index weighted across null-rate density, Shannon entropy, format variance, and deduplicated record counts.',
    },
    {
      term: 'Pearson Correlation (r)',
      plainEnglish: 'Measures how closely two metrics move together. +1.0 means perfect alignment, -1.0 means opposite movement, 0 means no link.',
      technical: 'Covariance of two variables divided by the product of their standard deviations. Values between -1.0 and +1.0.',
    },
    {
      term: 'Holt-Winters Time Series Forecast',
      plainEnglish: 'A forecasting model that recognizes baseline momentum, seasonal patterns, and recent trends to project trajectory.',
      technical: 'Triple exponential smoothing incorporating level (alpha), trend (beta), and seasonal (gamma) components.',
    },
    {
      term: '95% Confidence Band',
      plainEnglish: 'The shaded area on a chart where future numbers are expected to land 95% of the time based on past statistical variation.',
      technical: 'Empirical interval calculated as forecast ± 1.96 * standard error of regression residuals.',
    },
    {
      term: 'Causality vs Correlation',
      plainEnglish: 'Correlation means two things happened at the same time. Causality proves that one factor directly drove the outcome.',
      technical: 'Propensity-score matching and counterfactual testing to eliminate confounding variables and spurious collinearity.',
    },
    {
      term: 'What-If Simulation',
      plainEnglish: 'An interactive mathematical sandbox that calculates how adjusting operational levers impacts the bottom line.',
      technical: 'Multi-variable sensitivity matrix calculating marginal elasticity across pricing, retention spend, and SLA targets.',
    },
  ];

  const filteredGlossary = glossaryTerms.filter(g =>
    g.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.plainEnglish.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-2.5 sm:p-4 animate-subtle-fade font-sans text-[#292522] overflow-y-auto">
      <div className="max-w-3xl w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-xl border border-[#DDD4CA] bg-white shadow-xl overflow-hidden my-4 sm:my-8">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#DDD4CA] flex items-center justify-between gap-3 sm:gap-4 bg-[#F8F3EC]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#EEE7DE] flex items-center justify-center text-[#49362F] shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#49362F] font-semibold">
                User Documentation
              </span>
              <h3 className="text-base sm:text-xl font-bold text-[#292522] leading-tight">
                How to Read &amp; Interpret Zynetra
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg border border-[#DDD4CA] hover:bg-[#EEE7DE] text-[#756D65] hover:text-[#292522] transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-[#DDD4CA] flex items-center gap-2 overflow-x-auto bg-[#F8F3EC]/60">
          <button
            onClick={() => setActiveTopic('screens')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTopic === 'screens'
                ? 'bg-[#49362F] text-white'
                : 'text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
            }`}
          >
            Module-by-Module Guide
          </button>
          <button
            onClick={() => setActiveTopic('glossary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTopic === 'glossary'
                ? 'bg-[#49362F] text-white'
                : 'text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
            }`}
          >
            Plain-English Glossary
          </button>
          <button
            onClick={() => setActiveTopic('workflow')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTopic === 'workflow'
                ? 'bg-[#49362F] text-white'
                : 'text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
            }`}
          >
            Decision Lifecycle (5 Stages)
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: Screen-by-Screen Guide */}
          {activeTopic === 'screens' && (
            <div className="space-y-4">
              {screenGuides.map((guide, idx) => {
                const Icon = guide.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC]/50 space-y-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-white border border-[#DDD4CA] text-[#49362F]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-base font-bold text-[#292522]">{guide.title}</h4>
                    </div>
                    <p className="text-xs text-[#756D65] leading-relaxed">{guide.purpose}</p>

                    <div className="space-y-2 bg-white p-4 rounded-lg border border-[#DDD4CA] text-xs">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#A56F5D] font-semibold">
                        Interpretation Key:
                      </div>
                      {guide.howToRead.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-[#756D65] leading-relaxed">
                          <span className="text-[#49362F] font-bold">&bull;</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: Plain-English Glossary */}
          {activeTopic === 'glossary' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#756D65]" />
                <input
                  type="text"
                  placeholder="Search technical terms (e.g. Pearson, Holt-Winters, Quality Score)..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] text-[#292522] placeholder-[#756D65]/60 focus:outline-none focus:border-[#49362F] transition-colors"
                />
              </div>

              <div className="space-y-3">
                {filteredGlossary.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC]/50 space-y-1.5"
                  >
                    <div className="text-sm font-bold text-[#292522]">{item.term}</div>
                    <div className="text-xs text-[#292522] leading-relaxed">
                      <strong className="text-[#7B8570] font-semibold">In Plain English: </strong>
                      <span className="text-[#756D65]">{item.plainEnglish}</span>
                    </div>
                    <div className="text-[11px] text-[#756D65] font-mono pt-1">
                      <span>Under the hood: </span>
                      <span>{item.technical}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Decision Workflow */}
          {activeTopic === 'workflow' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#F8F3EC] border border-[#DDD4CA] text-xs text-[#756D65] leading-relaxed">
                <strong className="text-[#292522]">The Autonomous Lifecycle: </strong>
                Zynetra transforms raw data records into executive-grade actions in 5 sequential stages. Every stage maintains verifiable causal citations.
              </div>

              <div className="space-y-3">
                {[
                  { step: '01', title: 'Data Ingestion & Hygiene', desc: 'Raw CSV, Excel or SQL database records are profiled, column types inferred, anomalies quarantined, and cleaning actions cataloged.' },
                  { step: '02', title: 'Executive Synthesis & Dashboard', desc: 'Auto-generates KPIs, historical curves, segment breakdowns, and regional heatmaps without manual drag-and-drop.' },
                  { step: '03', title: 'Diagnostic Root-Cause Discovery', desc: 'Separates surface symptoms from true systemic drivers using multi-hypothesis trees and propensity analysis.' },
                  { step: '04', title: 'Predictive Scenarios & What-If', desc: 'Projects next quarter outcomes and allows interactive slider testing to see the financial outcome before taking action.' },
                  { step: '05', title: 'Prioritized Executive Decisions', desc: 'Provides ranked intervention steps with expected ROI, operational risk rating, and downloadable presentation dossiers.' },
                ].map((st, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[#DDD4CA] bg-white flex items-start gap-4 shadow-xs"
                  >
                    <div className="text-lg font-bold text-[#49362F] shrink-0 w-8 font-mono">
                      {st.step}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#292522]">{st.title}</h4>
                      <p className="text-xs text-[#756D65] mt-1 leading-relaxed">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#DDD4CA] flex items-center justify-between text-xs bg-[#F8F3EC]">
          <span className="text-[#756D65]">Tip: Switch between Plain English and Technical mode anytime in the header.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-2xs"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}

export default InterpretabilityHelpModal;
