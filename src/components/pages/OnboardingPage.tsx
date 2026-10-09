import React, { useState } from 'react';
import { ArrowRight, Check, Building2, Target, Briefcase, Layers } from 'lucide-react';
import ZynetraLogo from '../brand/ZynetraLogo';
import { User, OnboardingConfig } from '../../types/auth';

interface OnboardingPageProps {
  user: User | null;
  onComplete: (config: OnboardingConfig) => void;
  onSkip: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

const INDUSTRIES = [
  'SaaS',
  'FinTech',
  'E-commerce',
  'Healthcare',
  'Manufacturing',
  'Other',
];

const PRIMARY_OBJECTIVES = [
  {
    id: 'Revenue Growth',
    desc: 'Accelerate pipeline conversion, expansion ARR, and regional quota performance.',
  },
  {
    id: 'Customer Retention',
    desc: 'Detect early churn precursors, support latency drivers, and retention interventions.',
  },
  {
    id: 'Operational Efficiency',
    desc: 'Isolate fulfillment bottlenecks, supply lead-time variance, and SLA adherence.',
  },
  {
    id: 'Financial Performance',
    desc: 'Optimize unit economics, contribution margin, and CAC payback horizons.',
  },
  {
    id: 'Product Analytics',
    desc: 'Connect feature adoption cohorts with long-term retention and expansion.',
  },
  {
    id: 'Executive Decision Support',
    desc: 'Synthesize board-ready executive briefings, root-cause trees, and P1 decisions.',
  },
];

const ROLES = [
  'Executive',
  'Business Analyst',
  'Data Analyst',
  'Product Manager',
  'Operations',
  'Finance',
  'Other',
];

export default function OnboardingPage({ user, onComplete, onSkip }: OnboardingPageProps) {
  const [company, setCompany] = useState<string>(user?.organization || 'Acme Enterprise');
  const [industry, setIndustry] = useState<string>(user?.industry || 'SaaS');
  const [primaryObjective, setPrimaryObjective] = useState<string>(
    user?.primaryObjective || 'Customer Retention'
  );
  const [role, setRole] = useState<string>(user?.role || 'Executive');

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      company: company.trim() || 'Enterprise Workspace',
      industry,
      primaryObjective,
      role,
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between p-4 sm:p-10 font-sans selection:bg-[var(--theme-primary)] selection:text-white transition-colors duration-200">
      {/* Top Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between border-b border-[var(--border-subtle)] pb-5 gap-2">
        <ZynetraLogo size="md" showSubtitle={true} />
        <button
          type="button"
          onClick={onSkip}
          className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0 cursor-pointer"
        >
          Skip to Workspace &rarr;
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl w-full mx-auto py-8 animate-subtle-fade">
        <div className="mb-8 space-y-2">
          <div className="text-xs font-mono text-[var(--theme-text)] font-semibold">
            WORKSPACE CONFIGURATION &middot; STEP 1 OF 1
          </div>
          <h1 className="text-2xl sm:text-4xl text-[var(--text-primary)] font-bold tracking-tight">
            Welcome to Zynetra{user?.name ? `, ${user.name}` : ''}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Let&apos;s configure your analytics workspace. Zynetra uses these parameters to calibrate causal heuristics, anomaly thresholds, and benchmark datasets.
          </p>
        </div>

        <form onSubmit={handleFinish} className="space-y-7 text-xs">
          {/* 1. Company / Organization & Role */}
          <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-[var(--text-primary)] font-semibold mb-2">
                  <Building2 className="w-3.5 h-3.5 text-[var(--theme-text)]" />
                  <span>Company / Organization</span>
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Global Corp"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--theme-primary)] transition-colors"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[var(--text-primary)] font-semibold mb-2">
                  <Briefcase className="w-3.5 h-3.5 text-[var(--theme-text)]" />
                  <span>Your Role</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--theme-primary)] transition-colors"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Industry Selection */}
            <div>
              <label className="flex items-center gap-1.5 text-[var(--text-primary)] font-semibold mb-2.5">
                <Layers className="w-3.5 h-3.5 text-[var(--theme-text)]" />
                <span>Industry</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {INDUSTRIES.map((ind) => {
                  const isSelected = industry === ind;
                  return (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => setIndustry(ind)}
                      className={`px-3.5 py-2.5 rounded-lg border text-left font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--bg-elevated)] border-[var(--theme-primary)] text-[var(--text-primary)] shadow-2xs'
                          : 'bg-[var(--bg-input)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span>{ind}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[var(--theme-text)]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Primary Objective */}
            <div>
              <label className="flex items-center gap-1.5 text-[var(--text-primary)] font-semibold mb-2.5">
                <Target className="w-3.5 h-3.5 text-[var(--theme-text)]" />
                <span>Primary Objective</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRIMARY_OBJECTIVES.map((obj) => {
                  const isSelected = primaryObjective === obj.id;
                  return (
                    <button
                      key={obj.id}
                      type="button"
                      onClick={() => setPrimaryObjective(obj.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-[var(--bg-elevated)] border-[var(--theme-primary)] shadow-2xs'
                          : 'bg-[var(--bg-input)] border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)]'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-[var(--text-primary)]">{obj.id}</div>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                          {obj.desc}
                        </p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'border-[var(--theme-primary)] bg-[var(--theme-primary)] text-white'
                            : 'border-[var(--border-subtle)]'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="text-xs text-[var(--text-secondary)]">
              You can update workspace parameters anytime in Zynetra Settings.
            </span>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-sm hover:brightness-110 cursor-pointer w-full sm:w-auto"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            >
              <span>Enter Zynetra Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto border-t border-[var(--border-subtle)] pt-5 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-secondary)] gap-2">
        <span>ZYNETRA &middot; Autonomous Analytics &amp; Decision Platform</span>
        <span>SOC2 Type II &middot; Explainable Decision Intelligence</span>
      </footer>
    </div>
  );
}

