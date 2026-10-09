import React, { useState } from 'react';
import {
  ArrowRight,
  Database,
  GitBranch,
  FileText,
  Send,
  Activity,
  CheckSquare,
  Sparkles,
  LayoutDashboard,
  TrendingUp,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  Sun,
  Moon,
  ChevronRight,
  BarChart3,
  Layers,
  X,
} from 'lucide-react';
import ZynetraLogo from '../brand/ZynetraLogo';
import { AuthPageState } from '../../types/auth';

interface LandingPageProps {
  onNavigate: (page: AuthPageState) => void;
  onInstantDemo?: () => void;
  isLoggedIn?: boolean;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export default function LandingPage({
  onNavigate,
  isLoggedIn = false,
  isDark = false,
  onToggleTheme,
}: LandingPageProps) {
  const [activePreviewTab, setActivePreviewTab] = useState<'dashboard' | 'brief' | 'tree' | 'predictive' | 'decision'>('dashboard');
  const [activePipelineStage, setActivePipelineStage] = useState<number>(0);
  const [whatIfRetentionDelta, setWhatIfRetentionDelta] = useState<number>(12);
  const [whatIfPricingDelta, setWhatIfPricingDelta] = useState<number>(5);

  // Modals for Contact, Privacy, Terms so footer links are 100% functional
  const [activeLegalModal, setActiveLegalModal] = useState<'contact' | 'privacy' | 'terms' | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim()) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactCompany('');
      setContactMessage('');
    }, 3500);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const pipelineStages = [
    {
      step: '01',
      id: 'DATA',
      title: 'DATA',
      subtitle: 'Autonomous Ingestion & Hygiene',
      description:
        'Connect enterprise databases or upload CSV/Excel telemetry. Zynetra profiles column semantics, detects missingness, deduplicates records, and computes a real-time Data Hygiene Score.',
      input: 'Raw CSV / Excel / Production SQL Streams (4,820 rows × 10 columns)',
      output: 'Validated Schema Profile · 94/100 Quality Score · 38 Duplicates Resolved',
      metric: '98.4% Completeness',
    },
    {
      step: '02',
      id: 'ANALYZE',
      title: 'ANALYZE',
      subtitle: 'Multi-Dimensional Statistical Synthesis',
      description:
        'Zynetra autonomously selects descriptive, diagnostic, predictive, and prescriptive modeling techniques matched to your schema structure and business objective.',
      input: 'Cleaned Cohort & Time-Series Telemetry',
      output: 'Executive KPIs · Cohort Breakdowns · Correlation Heatmaps · Geo Variance',
      metric: '6-Stage Pipeline',
    },
    {
      step: '03',
      id: 'UNDERSTAND',
      title: 'UNDERSTAND',
      subtitle: 'Root-Cause Discovery & Natural Insights',
      description:
        'Instead of leaving analysts to guess why metrics moved, Zynetra constructs a multi-tier Root-Cause Tree isolating primary systemic drivers and ruling out weak hypotheses.',
      input: 'Observed EMEA Mid-Market ARR Churn Surge (+4.2% vs Plan)',
      output: 'Primary Driver Isolated: Tier-2 Support Resolution Latency (>8.4h · 68% Weight)',
      metric: '94.2% Causal Confidence',
    },
    {
      step: '04',
      id: 'PREDICT',
      title: 'PREDICT',
      subtitle: 'Trajectory Corridors & Counterfactual What-Ifs',
      description:
        'Simulate forward trajectories with 95% confidence bounds and adjust sensitivity levers—pricing, retention effort, SLA targets, and marketing spend—to test outcomes before committing capital.',
      input: 'Historical 12-Quarter ARR & Churn Elasticity',
      output: '90-Day Forecast Corridor · Real-Time Counterfactual Revenue Delta',
      metric: '±3.1% Forecast Error',
    },
    {
      step: '05',
      id: 'DECIDE',
      title: 'DECIDE',
      subtitle: 'Prioritized Prescriptive Action Roadmaps',
      description:
        'Receive P1, P2, and P3 executive interventions ranked by expected financial ROI, implementation timeline, risk profile, and 5-pillar explainability.',
      input: 'Causal Drivers + Counterfactual Simulation Bounds',
      output: 'P1 Action: Deploy EMEA Escalation Pod → +$410,000 Annualized ARR Recovery',
      metric: '4.2x Decision Velocity',
    },
  ];

  const capabilities = [
    {
      num: '01',
      title: 'Autonomous Analytics',
      desc: 'Zero-touch ingestion, schema inference, automated data cleaning, and multi-dimensional KPI generation from raw enterprise datasets.',
      outcome: '94/100 average data quality after autonomous deduplication and imputation.',
      icon: Database,
    },
    {
      num: '02',
      title: 'Root-Cause Discovery',
      desc: 'Hierarchical causal trees that isolate primary and secondary drivers of metric variance while documenting ruled-out hypotheses.',
      outcome: 'Pinpoints exact operational bottlenecks with statistical confidence scores.',
      icon: GitBranch,
    },
    {
      num: '03',
      title: 'Natural-Language Insights',
      desc: 'Dual Plain-English Executive and Technical statistical narratives explaining trends, anomalies, and cross-column relationships.',
      outcome: 'Answers what is happening, why it happened, and the cost of inaction.',
      icon: Sparkles,
    },
    {
      num: '04',
      title: 'Predictive & What-If Analysis',
      desc: 'Forward trajectory forecasting with confidence corridors and interactive driver sliders to stress-test strategic scenarios.',
      outcome: 'Model revenue, retention, and SLA sensitivity in real time before execution.',
      icon: Activity,
    },
    {
      num: '05',
      title: 'Decision Prioritization',
      desc: 'Prescriptive P1/P2/P3 recommendations ranked by quantified financial ROI, implementation horizon, and execution risk.',
      outcome: 'Every recommendation includes 5-pillar explainability and step-by-step playbooks.',
      icon: CheckSquare,
    },
    {
      num: '06',
      title: 'Executive Reporting',
      desc: 'Auto-generated 6-slide Analyst Presentation Decks and exportable PDF executive briefings formatted for boardroom review.',
      outcome: 'Instant board-ready decks with speaker notes and audit provenance.',
      icon: FileText,
    },
  ];

  const useCases = [
    {
      category: '01 · Revenue & Growth',
      title: 'Revenue & Growth',
      description:
        'Diagnose pipeline conversion velocity, expansion ARR drivers, regional quota attainment, and pricing elasticity across enterprise and mid-market segments.',
      metric: '+$1.42M Net Expansion Identified',
    },
    {
      category: '02 · Customer Retention',
      title: 'Customer Retention',
      description:
        'Detect early churn precursors across support ticket latency, NPS contraction, and seat utilization drops—and trigger prioritized retention interventions.',
      metric: '-34% Logo Attrition in 60 Days',
    },
    {
      category: '03 · Operations',
      title: 'Operations',
      description:
        'Isolate supply chain lead-time volatility, carrier dispatch bottlenecks, fulfillment SLA breaches, and warehouse throughput constraints.',
      metric: '99.1% SLA Adherence Restored',
    },
    {
      category: '04 · Product Analytics',
      title: 'Product Analytics',
      description:
        'Correlate feature adoption depth with long-term cohort retention, onboarding completion rates, and account expansion propensity.',
      metric: '3.8x Feature-to-Renewal Lift',
    },
    {
      category: '05 · Financial Analysis',
      title: 'Financial Analysis',
      description:
        'Audit unit economics, gross margin compression, CAC payback horizons, and cloud infrastructure cost anomalies across business units.',
      metric: '+420 bps Gross Margin Recovery',
    },
    {
      category: '06 · Executive Decision Support',
      title: 'Executive Decision Support',
      description:
        'Unify fragmented departmental metrics into a single 4-chapter Executive Story Brief and 6-slide boardroom presentation deck.',
      metric: 'Zero Manual Slide Preparation',
    },
  ];

  const simulatedProjectedArr = (4.82 + whatIfRetentionDelta * 0.045 + whatIfPricingDelta * 0.032).toFixed(2);
  const simulatedChurnRate = Math.max(4.2, (16.4 - whatIfRetentionDelta * 0.35 + whatIfPricingDelta * 0.12)).toFixed(1);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-[var(--theme-primary)] selection:text-white transition-colors duration-200">
      {/* 1. TOP BAR CONTRACT: 3 Zones (Brand, 5 Nav Links, Primary Actions) */}
      <header className="sticky top-0 z-40 bg-[var(--bg-card)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Title */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center shrink-0 cursor-pointer text-left focus:outline-none"
          >
            <ZynetraLogo size="md" showSubtitle={false} />
          </button>

          {/* Zone 2: 5 Single-Line Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[var(--text-secondary)]">
            <button
              type="button"
              onClick={() => scrollToSection('product')}
              className="hover:text-[var(--text-primary)] transition-colors whitespace-nowrap cursor-pointer"
            >
              Product
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('capabilities')}
              className="hover:text-[var(--text-primary)] transition-colors whitespace-nowrap cursor-pointer"
            >
              Capabilities
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[var(--text-primary)] transition-colors whitespace-nowrap cursor-pointer"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('solutions')}
              className="hover:text-[var(--text-primary)] transition-colors whitespace-nowrap cursor-pointer"
            >
              Solutions
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="hover:text-[var(--text-primary)] transition-colors whitespace-nowrap cursor-pointer"
            >
              About
            </button>
          </nav>

          {/* Zone 3: Right Actions (Log In + Get Started + Theme Toggle) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme Mode"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => onNavigate('app')}
                className="px-4 py-2 rounded-lg text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-2xs whitespace-nowrap cursor-pointer"
                style={{ backgroundColor: 'var(--theme-primary)' }}
              >
                Open Workspace &rarr;
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors whitespace-nowrap cursor-pointer"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('signup')}
                  className="px-4 py-2 rounded-lg text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-2xs hover:brightness-110 whitespace-nowrap cursor-pointer"
                  style={{ backgroundColor: 'var(--theme-primary)' }}
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Brand Proposition & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--theme-text)] font-semibold tracking-wider">
              <span>ZYNETRA</span>
              <span aria-hidden="true">&middot;</span>
              <span>Autonomous Analytics &amp; Decision Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.08]">
              Turn Data Into{' '}
              <span style={{ color: 'var(--theme-secondary)' }}>Decisions.</span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
              Zynetra transforms enterprise data into actionable insights, root-cause intelligence, predictive scenarios, and prioritized decisions.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => onNavigate(isLoggedIn ? 'app' : 'signup')}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-sm hover:brightness-110 cursor-pointer whitespace-nowrap min-h-[44px]"
                style={{ backgroundColor: 'var(--theme-primary)' }}
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('product-preview')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer whitespace-nowrap min-h-[44px]"
              >
                <span>Explore Zynetra</span>
              </button>
            </div>

            {/* Key Quantitative Proof Bar */}
            <div className="pt-6 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-4 text-xs">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[var(--text-primary)]">99.4%</div>
                <div className="text-[var(--text-secondary)] mt-0.5">Causal Resolution</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[var(--text-primary)]">6-Stage</div>
                <div className="text-[var(--text-secondary)] mt-0.5">Autonomous Engine</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[var(--text-primary)]">4.2x</div>
                <div className="text-[var(--text-secondary)] mt-0.5">Faster Decisions</div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Visual Preview of the Zynetra Analytics Workspace */}
          <div className="lg:col-span-6">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-lg overflow-hidden">
              {/* Simulated Zynetra Workspace Top Bar */}
              <div className="px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-2.5">
                  <ZynetraLogo size="sm" showSubtitle={false} />
                  <span className="text-[var(--text-secondary)] hidden sm:inline">&middot;</span>
                  <span className="font-mono text-[10px] text-[var(--text-secondary)] hidden sm:inline truncate">
                    Global SaaS Intelligence Hub
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="text-[var(--muted-sage)] font-semibold">94/100 Hygiene</span>
                  <span aria-hidden="true">&middot;</span>
                  <span className="text-[var(--theme-text)] font-semibold">Engine Active</span>
                </div>
              </div>

              {/* Workspace Preview Body */}
              <div className="p-4 sm:p-5 space-y-4 bg-[var(--bg-primary)]">
                {/* KPI Strip from actual Zynetra preset */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)]">
                    <div className="text-[10px] text-[var(--text-secondary)] truncate">Net ARR Portfolio</div>
                    <div className="text-sm sm:text-base font-bold font-mono tabular-nums mt-0.5">$4.82M</div>
                    <div className="text-[10px] font-mono text-[var(--muted-sage)] font-semibold mt-0.5">+14.2% YoY</div>
                  </div>
                  <div className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)]">
                    <div className="text-[10px] text-[var(--text-secondary)] truncate">EMEA Mid-Mkt Churn</div>
                    <div className="text-sm sm:text-base font-bold font-mono tabular-nums mt-0.5">16.4%</div>
                    <div className="text-[10px] font-mono text-[var(--terracotta)] font-semibold mt-0.5">+4.2% Spike</div>
                  </div>
                  <div className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)]">
                    <div className="text-[10px] text-[var(--text-secondary)] truncate">Recoverable ARR</div>
                    <div className="text-sm sm:text-base font-bold font-mono tabular-nums mt-0.5">+$410K</div>
                    <div className="text-[10px] font-mono text-[var(--theme-text)] font-semibold mt-0.5">92% Conf.</div>
                  </div>
                </div>

                {/* Live Causal Chain + Trajectory Preview */}
                <div className="p-3.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-2.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[var(--text-primary)]">Autonomous Root-Cause Synthesis</span>
                    <span className="font-mono text-[10px] text-[var(--muted-sage)] font-semibold">p &lt; 0.004 &middot; Verified</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
                      <div className="text-[10px] font-mono text-[var(--terracotta)] font-semibold">01. Symptom</div>
                      <div className="font-semibold mt-0.5">EMEA ARR Attrition</div>
                      <div className="text-[10px] text-[var(--text-secondary)]">$320K annualized risk</div>
                    </div>
                    <div className="p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
                      <div className="text-[10px] font-mono text-[var(--theme-text)] font-semibold">02. Root Driver</div>
                      <div className="font-semibold mt-0.5">Ticket Latency &gt; 8.4h</div>
                      <div className="text-[10px] text-[var(--text-secondary)]">68% causal weight</div>
                    </div>
                    <div className="p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
                      <div className="text-[10px] font-mono text-[var(--muted-sage)] font-semibold">03. P1 Decision</div>
                      <div className="font-semibold mt-0.5">EMEA Escalation Pod</div>
                      <div className="text-[10px] text-[var(--text-secondary)]">+$410K ROI in 30d</div>
                    </div>
                  </div>
                </div>

                {/* Simulated Forecast Bars */}
                <div className="p-3.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)]">
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="font-semibold">Predictive ARR Trajectory Corridor (Q1–Q4)</span>
                    <span className="font-mono text-[10px] text-[var(--text-secondary)]">95% Confidence Band</span>
                  </div>
                  <div className="grid grid-cols-8 gap-1.5 items-end h-16 pt-2">
                    {[42, 48, 51, 49, 58, 66, 74, 86].map((val, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end">
                        <div
                          className="w-full rounded-t transition-all duration-300"
                          style={{
                            height: `${val}%`,
                            backgroundColor: idx >= 5 ? 'var(--muted-sage)' : 'var(--theme-primary)',
                            opacity: idx >= 5 ? 0.85 : 1,
                          }}
                        />
                        <span className="text-[9px] font-mono text-[var(--text-secondary)]">
                          {idx < 5 ? `M${idx + 1}` : `F${idx - 4}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PRODUCT OVERVIEW */}
      <section id="product" className="py-16 sm:py-24 bg-[var(--bg-secondary)] border-y border-[var(--border-subtle)] px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-mono text-[var(--theme-text)] font-semibold tracking-wider">
                01. Product Overview
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight leading-tight">
                Dashboards only show what changed. Zynetra explains why—and what to do next.
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Traditional business intelligence tools stop at static charts, forcing teams to manually cross-reference tables, clean broken schemas, and debate causality. Zynetra unifies data hygiene, causal discovery, counterfactual simulation, and executive decision roadmaps in one autonomous workspace.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-3">
                <div className="text-xs font-mono text-[var(--terracotta)] font-semibold">
                  Legacy BI Workflow
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Fragmented &amp; Reactive
                </h3>
                <ul className="space-y-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                  <li>&bull; Days spent cleaning CSVs and fixing schema mismatches manually</li>
                  <li>&bull; Static charts show metric drops without isolating root causes</li>
                  <li>&bull; No counterfactual simulator to test pricing or retention levers</li>
                  <li>&bull; Analysts spend hours building board slide decks from scratch</li>
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-3">
                <div className="text-xs font-mono text-[var(--muted-sage)] font-semibold">
                  Zynetra Autonomous Platform
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Self-Explaining &amp; Prescriptive
                </h3>
                <ul className="space-y-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                  <li>&bull; Instant schema profiling, deduplication, and outlier imputation</li>
                  <li>&bull; Multi-tier Root-Cause Trees with statistical confidence weights</li>
                  <li>&bull; Interactive What-If Sandbox projecting revenue &amp; churn impact</li>
                  <li>&bull; 1-click 6-slide Analyst Presentation Deck &amp; Executive PDF Brief</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ZYNETRA CAPABILITIES */}
      <section id="capabilities" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12 space-y-3">
          <div className="text-xs font-mono text-[var(--theme-text)] font-semibold tracking-wider">
            02. Zynetra Capabilities
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
            Six core engines working as one autonomous system.
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Every capability inside the Zynetra Workspace is connected to the same underlying statistical and causal engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.num}
                className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] flex flex-col justify-between space-y-4 transition-transform duration-150 hover:-translate-y-0.5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-[var(--theme-text)]">
                      {cap.num}. {cap.title}
                    </span>
                    <Icon className="w-4 h-4 text-[var(--text-secondary)]" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">{cap.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{cap.desc}</p>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--muted-sage)] font-semibold">
                  {cap.outcome}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: HOW ZYNETRA WORKS (DATA -> ANALYZE -> UNDERSTAND -> PREDICT -> DECIDE) */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-[var(--bg-secondary)] border-y border-[var(--border-subtle)] px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="max-w-2xl space-y-3">
            <div className="text-xs font-mono text-[var(--theme-text)] font-semibold tracking-wider">
              03. How Zynetra Works
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
              From raw enterprise telemetry to prioritized decisions in five stages.
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Select any stage in the Zynetra pipeline below to inspect how data flows from ingestion to executive action.
            </p>
          </div>

          {/* 5-Stage Pipeline Selector: DATA -> ANALYZE -> UNDERSTAND -> PREDICT -> DECIDE */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {pipelineStages.map((st, idx) => {
              const isSelected = activePipelineStage === idx;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setActivePipelineStage(idx)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-[var(--bg-card)] border-[var(--theme-primary)] shadow-sm'
                      : 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] hover:bg-[var(--bg-card)]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                    <span className="font-bold text-[var(--theme-text)]">{st.step}</span>
                    {idx < 4 && (
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--text-secondary)] hidden sm:inline" />
                    )}
                  </div>
                  <div className="text-sm font-bold tracking-wider text-[var(--text-primary)]">
                    {st.title}
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)] mt-1 line-clamp-1">
                    {st.subtitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Detail Panel */}
          <div className="p-6 sm:p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="text-xs font-mono text-[var(--theme-text)] font-semibold">
                Stage {pipelineStages[activePipelineStage].step} &middot; {pipelineStages[activePipelineStage].title}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                {pipelineStages[activePipelineStage].subtitle}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {pipelineStages[activePipelineStage].description}
              </p>
            </div>

            <div className="lg:col-span-5 p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] space-y-3 text-xs font-mono">
              <div>
                <div className="text-[10px] text-[var(--text-secondary)]">STAGE INPUT</div>
                <div className="text-[var(--text-primary)] font-semibold mt-0.5">
                  {pipelineStages[activePipelineStage].input}
                </div>
              </div>
              <div className="border-t border-[var(--border-subtle)] pt-2.5">
                <div className="text-[10px] text-[var(--text-secondary)]">AUTONOMOUS OUTPUT</div>
                <div className="text-[var(--muted-sage)] font-semibold mt-0.5">
                  {pipelineStages[activePipelineStage].output}
                </div>
              </div>
              <div className="border-t border-[var(--border-subtle)] pt-2.5 flex items-center justify-between">
                <span className="text-[10px] text-[var(--text-secondary)]">BENCHMARK METRIC</span>
                <span className="text-[var(--theme-text)] font-bold">
                  {pipelineStages[activePipelineStage].metric}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: PRODUCT PREVIEW (Interactive Live Zynetra Workspace Preview) */}
      <section id="product-preview" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-mono text-[var(--theme-text)] font-semibold tracking-wider">
              04. Interactive Product Preview
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
              Experience the Zynetra Workspace before you sign in.
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Explore live modules from the core Zynetra application below—including the Executive Dashboard, 4-Chapter Story Brief, Root-Cause Tree, What-If Simulator, and Prioritized Decisions.
            </p>
          </div>

          {/* Interactive Module Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-xs font-semibold overflow-x-auto max-w-full">
            {[
              { id: 'dashboard', label: 'Executive Dashboard' },
              { id: 'brief', label: 'Executive Story' },
              { id: 'tree', label: 'Root-Cause Tree' },
              { id: 'predictive', label: 'Predictive What-If' },
              { id: 'decision', label: 'Prioritized Decisions' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActivePreviewTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activePreviewTab === tab.id
                    ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-2xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Preview Frame */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 sm:p-8 shadow-sm">
          {activePreviewTab === 'dashboard' && (
            <div className="space-y-6 animate-subtle-fade">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
                <div>
                  <div className="text-xs font-mono text-[var(--text-secondary)]">
                    Active Corpus: Enterprise SaaS Retention &amp; ARR Performance &middot; v1.1
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mt-0.5">
                    Executive Telemetry &amp; Cohort Breakdown
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate(isLoggedIn ? 'app' : 'signup')}
                  className="px-3.5 py-2 rounded-lg text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  style={{ backgroundColor: 'var(--theme-primary)' }}
                >
                  Open Full Dashboard &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
                  <div className="text-xs text-[var(--text-secondary)]">Total Tracked ARR</div>
                  <div className="text-2xl font-bold font-mono tabular-nums mt-1">$4.82M</div>
                  <div className="text-xs font-mono text-[var(--muted-sage)] font-semibold mt-1">+14.2% vs Prior Year</div>
                </div>
                <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
                  <div className="text-xs text-[var(--text-secondary)]">Mid-Market Churn Rate</div>
                  <div className="text-2xl font-bold font-mono tabular-nums mt-1">16.4%</div>
                  <div className="text-xs font-mono text-[var(--terracotta)] font-semibold mt-1">+4.2% Anomaly Flagged</div>
                </div>
                <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
                  <div className="text-xs text-[var(--text-secondary)]">Mean Ticket Resolution</div>
                  <div className="text-2xl font-bold font-mono tabular-nums mt-1">8.4 hrs</div>
                  <div className="text-xs font-mono text-[var(--terracotta)] font-semibold mt-1">SLA Target: 3.2 hrs</div>
                </div>
                <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
                  <div className="text-xs text-[var(--text-secondary)]">Enterprise Net Retention</div>
                  <div className="text-2xl font-bold font-mono tabular-nums mt-1">118.6%</div>
                  <div className="text-xs font-mono text-[var(--muted-sage)] font-semibold mt-1">Top Decile Benchmark</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] space-y-2">
                  <div className="text-xs font-semibold">North America Cohort</div>
                  <div className="text-lg font-bold font-mono tabular-nums">$2.45M ARR</div>
                  <div className="text-xs text-[var(--text-secondary)]">Low Risk &middot; 96% SLA Adherence &middot; NPS 64</div>
                </div>
                <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] space-y-2">
                  <div className="text-xs font-semibold">EMEA Cohort (Primary Focus)</div>
                  <div className="text-lg font-bold font-mono tabular-nums">$1.52M ARR</div>
                  <div className="text-xs text-[var(--terracotta)] font-semibold">Elevated Risk &middot; Support Escalation Bottleneck</div>
                </div>
                <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] space-y-2">
                  <div className="text-xs font-semibold">APAC Cohort</div>
                  <div className="text-lg font-bold font-mono tabular-nums">$0.85M ARR</div>
                  <div className="text-xs text-[var(--text-secondary)]">Moderate Growth &middot; +19.4% Expansion Velocity</div>
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === 'brief' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 animate-subtle-fade">
              <div className="p-4 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2.5">
                <div className="text-[11px] font-mono text-[var(--terracotta)] font-semibold">
                  01. What is happening?
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)] leading-snug">
                  Mid-Market Churn Spike in EMEA
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Customer attrition accelerated to 16.4% in EMEA accounts, creating a $320,000 annualized net ARR leakage.
                </p>
                <div className="pt-2 text-[11px] font-mono text-[var(--terracotta)] font-semibold border-t border-[var(--border-subtle)]">
                  Variance: +4.2% vs Plan Target
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2.5">
                <div className="text-[11px] font-mono text-[var(--theme-text)] font-semibold">
                  02. Why did it happen?
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)] leading-snug">
                  Resolution Latency Exceeded 8.4 Hours
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Tier-2 escalation queue bottlenecks caused mean resolution time to triple during the migration rollout.
                </p>
                <div className="pt-2 text-[11px] font-mono text-[var(--theme-text)] font-semibold border-t border-[var(--border-subtle)]">
                  Primary Driver: Support Backlog (68% wt)
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2.5">
                <div className="text-[11px] font-mono text-[var(--text-secondary)] font-semibold">
                  03. If we do nothing?
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)] leading-snug">
                  $1.24M Cumulative Loss by Q4
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Unresolved friction cascades to enterprise cohort renewals with 38% probability of contraction.
                </p>
                <div className="pt-2 text-[11px] font-mono text-[var(--text-secondary)] font-semibold border-t border-[var(--border-subtle)]">
                  Compound Contraction Horizon: 90 Days
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2.5">
                <div className="text-[11px] font-mono text-[var(--muted-sage)] font-semibold">
                  04. What should we do?
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)] leading-snug">
                  Deploy Dedicated EMEA Triage Pod
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Restructure weekend shift coverage and auto-route high-ACV migration tickets directly to senior staff.
                </p>
                <div className="pt-2 text-[11px] font-mono text-[var(--muted-sage)] font-semibold border-t border-[var(--border-subtle)]">
                  Expected ROI: +$410,000 Recovered
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === 'tree' && (
            <div className="space-y-4 animate-subtle-fade">
              <div className="border-b border-[var(--border-subtle)] pb-3 flex items-center justify-between">
                <span className="text-xs font-mono text-[var(--text-secondary)]">
                  Hierarchical Causal Decomposition
                </span>
                <span className="text-xs font-mono text-[var(--muted-sage)] font-semibold">
                  Statistical Confidence: 94.2%
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] space-y-1.5">
                  <div className="text-[10px] font-mono text-[var(--terracotta)] font-semibold">
                    Level 1 &middot; Observable Symptom (100% Scope)
                  </div>
                  <div className="font-bold text-sm text-[var(--text-primary)]">
                    EMEA Mid-Market ARR Attrition Surge
                  </div>
                  <p className="text-[var(--text-secondary)]">
                    Gross churn divergence spike in EMEA accounts (&gt; $350K MRR cohort) during Q2–Q3.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] space-y-1.5">
                  <div className="text-[10px] font-mono text-[var(--theme-text)] font-semibold">
                    Level 2 &middot; Primary Driver (68% Impact Weight)
                  </div>
                  <div className="font-bold text-sm text-[var(--text-primary)]">
                    Support Ticket Resolution Latency (&gt;8.4h)
                  </div>
                  <p className="text-[var(--text-secondary)]">
                    Accounts experiencing &gt;4 open tickets had a 4.1x higher churn probability within 45 days.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] space-y-1.5">
                  <div className="text-[10px] font-mono text-[var(--muted-sage)] font-semibold">
                    Level 3 &middot; Root Systemic Cause (Verified)
                  </div>
                  <div className="font-bold text-sm text-[var(--text-primary)]">
                    Escalation Routing Policy Misconfiguration
                  </div>
                  <p className="text-[var(--text-secondary)]">
                    Ruled out hypothesis: Pricing tier change (p = 0.41, statistically insignificant).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === 'predictive' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-subtle-fade">
              <div className="lg:col-span-6 space-y-4">
                <div className="text-xs font-mono text-[var(--theme-text)] font-semibold">
                  Interactive Counterfactual What-If Sandbox
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  Test retention &amp; pricing levers in real time
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">Retention SLA Improvement Effort</span>
                      <span className="font-mono font-bold text-[var(--theme-text)]">+{whatIfRetentionDelta}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={30}
                      value={whatIfRetentionDelta}
                      onChange={(e) => setWhatIfRetentionDelta(Number(e.target.value))}
                      className="w-full cursor-pointer"
                      style={{ accentColor: 'var(--theme-primary)' }}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">Enterprise Tier Price Adjustment</span>
                      <span className="font-mono font-bold text-[var(--theme-text)]">+{whatIfPricingDelta}%</span>
                    </div>
                    <input
                      type="range"
                      min={-5}
                      max={15}
                      value={whatIfPricingDelta}
                      onChange={(e) => setWhatIfPricingDelta(Number(e.target.value))}
                      className="w-full cursor-pointer"
                      style={{ accentColor: 'var(--theme-primary)' }}
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
                  <div className="text-xs text-[var(--text-secondary)]">Simulated Q4 ARR</div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[var(--muted-sage)] mt-1">
                    ${simulatedProjectedArr}M
                  </div>
                  <div className="text-[11px] font-mono text-[var(--text-secondary)] mt-1">
                    Baseline: $4.82M ARR
                  </div>
                </div>
                <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
                  <div className="text-xs text-[var(--text-secondary)]">Simulated EMEA Churn</div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[var(--theme-text)] mt-1">
                    {simulatedChurnRate}%
                  </div>
                  <div className="text-[11px] font-mono text-[var(--text-secondary)] mt-1">
                    Baseline: 16.4% Churn
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === 'decision' && (
            <div className="p-5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-subtle-fade">
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-[var(--muted-sage)] font-semibold">
                  Priority P1 &middot; 92% Statistical Confidence &middot; Low Execution Risk
                </div>
                <h4 className="text-base font-bold text-[var(--text-primary)]">
                  Deploy Autonomous High-Priority Routing for EMEA Migration Tickets
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  Expected Impact: +$410,000 Annualized ARR Recovery within 30 days &middot; Zero additional headcount required.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(isLoggedIn ? 'app' : 'signup')}
                className="px-5 py-2.5 rounded-lg text-white text-xs font-semibold uppercase tracking-wider transition-all shrink-0 cursor-pointer"
                style={{ backgroundColor: 'var(--theme-primary)' }}
              >
                Launch Decision Center &rarr;
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 6: USE CASES / SOLUTIONS */}
      <section id="solutions" className="py-16 sm:py-24 bg-[var(--bg-secondary)] border-y border-[var(--border-subtle)] px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12 space-y-3">
            <div className="text-xs font-mono text-[var(--theme-text)] font-semibold tracking-wider">
              05. Enterprise Solutions &amp; Use Cases
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
              Built for high-stakes decisions across every function.
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Zynetra adapts its domain heuristics, KPI synthesis, and causal trees to your organization&apos;s functional mandate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((uc) => (
              <div
                key={uc.title}
                className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="text-xs font-mono text-[var(--theme-text)] font-semibold">
                    {uc.category}
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">{uc.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {uc.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--muted-sage)] font-semibold">{uc.metric}</span>
                  <button
                    type="button"
                    onClick={() => onNavigate(isLoggedIn ? 'app' : 'signup')}
                    className="text-[var(--theme-text)] hover:underline font-sans font-semibold cursor-pointer"
                  >
                    Explore &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: ABOUT & FINAL CTA */}
      <section id="about" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs font-mono text-[var(--theme-text)] font-semibold tracking-wider">
              06. About Zynetra
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
              Explainable autonomous intelligence engineered for enterprise trust.
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Zynetra was architected on a foundational premise: executives should never have to choose between black-box AI predictions and static legacy spreadsheets. Every insight, root-cause node, and recommendation in Zynetra is backed by empirical citations, statistical confidence scores, explicit assumptions, and documented limitations.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-2">
              <ShieldCheck className="w-5 h-5 text-[var(--muted-sage)]" />
              <div className="text-sm font-bold text-[var(--text-primary)]">5-Pillar Explainability</div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Every decision includes Why It Was Produced, Supporting Data, Confidence Rationale, Assumptions, and Boundary Limitations.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-2">
              <Layers className="w-5 h-5 text-[var(--theme-text)]" />
              <div className="text-sm font-bold text-[var(--text-primary)]">Zero-Retention Security</div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Enterprise datasets are profiled with full version history, point-in-time rollback, and SOC2 Type II governance controls.
              </p>
            </div>
          </div>
        </div>

        {/* FINAL CTA BANNER */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-8 sm:p-14 text-center space-y-6">
          <div className="text-xs font-mono text-[var(--theme-text)] font-semibold tracking-wider">
            ZYNETRA &middot; AUTONOMOUS ANALYTICS &amp; DECISION PLATFORM
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-[var(--text-primary)] tracking-tight max-w-2xl mx-auto">
            Make every decision data-driven.
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto">
            Launch your Zynetra Workspace in seconds. Upload your own CSV or Excel dataset or explore enterprise benchmark telemetry immediately.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate(isLoggedIn ? 'app' : 'signup')}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-lg text-white text-xs font-semibold tracking-widest uppercase transition-all shadow-sm hover:brightness-110 cursor-pointer"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {!isLoggedIn && (
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] text-xs font-semibold tracking-widest uppercase transition-colors cursor-pointer"
              >
                <span>Sign In to Workspace</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 8: FOOTER */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-card)] py-12 px-4 sm:px-6 lg:px-12 text-xs text-[var(--text-secondary)]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-2 space-y-3">
              <ZynetraLogo size="md" showSubtitle={true} />
              <p className="text-xs text-[var(--text-secondary)] max-w-sm leading-relaxed">
                Zynetra transforms enterprise data into actionable insights, root-cause intelligence, predictive scenarios, and prioritized decisions.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="font-bold text-[var(--text-primary)]">Platform</div>
              <ul className="space-y-2">
                <li>
                  <button type="button" onClick={() => scrollToSection('product')} className="hover:text-[var(--text-primary)] cursor-pointer">
                    Product
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollToSection('capabilities')} className="hover:text-[var(--text-primary)] cursor-pointer">
                    Capabilities
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollToSection('how-it-works')} className="hover:text-[var(--text-primary)] cursor-pointer">
                    How It Works
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollToSection('solutions')} className="hover:text-[var(--text-primary)] cursor-pointer">
                    Solutions
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <div className="font-bold text-[var(--text-primary)]">Company &amp; Legal</div>
              <ul className="space-y-2">
                <li>
                  <button type="button" onClick={() => scrollToSection('about')} className="hover:text-[var(--text-primary)] cursor-pointer">
                    About
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setActiveLegalModal('contact')} className="hover:text-[var(--text-primary)] cursor-pointer">
                    Contact
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setActiveLegalModal('privacy')} className="hover:text-[var(--text-primary)] cursor-pointer">
                    Privacy
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setActiveLegalModal('terms')} className="hover:text-[var(--text-primary)] cursor-pointer">
                    Terms
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <div className="font-bold text-[var(--text-primary)]">Access</div>
              <ul className="space-y-2">
                <li>
                  <button type="button" onClick={() => onNavigate('login')} className="hover:text-[var(--text-primary)] cursor-pointer">
                    Login
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigate('signup')} className="hover:text-[var(--text-primary)] cursor-pointer">
                    Sign Up
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>&copy; {new Date().getFullYear()} Zynetra. Autonomous Analytics &amp; Decision Platform.</div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span>SOC2 Type II</span>
              <span>&middot;</span>
              <span>Explainable AI Standard</span>
              <span>&middot;</span>
              <span>Zero-Retention Ready</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Modal for Contact / Privacy / Terms */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-subtle-fade">
          <div className="max-w-lg w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] p-6 sm:p-8 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <h3 className="text-base font-bold">
                {activeLegalModal === 'contact' && 'Contact Zynetra Enterprise Team'}
                {activeLegalModal === 'privacy' && 'Zynetra Privacy Policy'}
                {activeLegalModal === 'terms' && 'Zynetra Terms of Service'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveLegalModal(null)}
                className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeLegalModal === 'contact' && (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={contactCompany}
                    onChange={(e) => setContactCompany(e.target.value)}
                    placeholder="Enterprise Inc."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Inquiry Details</label>
                  <textarea
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="How can Zynetra support your analytics and decision workflows?"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveLegalModal(null)}
                    className="px-4 py-2 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-white font-semibold uppercase tracking-wider cursor-pointer"
                    style={{ backgroundColor: 'var(--theme-primary)' }}
                  >
                    <span>Send Inquiry</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                {contactSubmitted && (
                  <div className="p-3 rounded-lg bg-[var(--very-light-sage)] text-[var(--muted-sage)] font-semibold text-center">
                    Thank you. Your inquiry has been received by the Zynetra team.
                  </div>
                )}
              </form>
            )}

            {activeLegalModal === 'privacy' && (
              <div className="space-y-3 text-xs text-[var(--text-secondary)] leading-relaxed">
                <p className="text-[var(--text-primary)] font-semibold">
                  Effective Date: January 1, 2026 &middot; Zero-Retention Enterprise Data Standard
                </p>
                <p>
                  Zynetra processes uploaded datasets strictly within your isolated workspace session to perform schema profiling, automated cleaning, root-cause decomposition, predictive modeling, and executive report generation.
                </p>
                <p>
                  We do not sell, rent, or train external public foundation models on your proprietary business telemetry. Authentication credentials are salted and cryptographically hashed before storage.
                </p>
                <div className="pt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveLegalModal(null)}
                    className="px-4 py-2 rounded-lg text-white font-semibold cursor-pointer"
                    style={{ backgroundColor: 'var(--theme-primary)' }}
                  >
                    Understood
                  </button>
                </div>
              </div>
            )}

            {activeLegalModal === 'terms' && (
              <div className="space-y-3 text-xs text-[var(--text-secondary)] leading-relaxed">
                <p className="text-[var(--text-primary)] font-semibold">
                  Zynetra Autonomous Analytics &amp; Decision Platform — Terms of Service
                </p>
                <p>
                  By creating a Zynetra account or accessing the Zynetra Workspace, you agree to use the platform in accordance with applicable enterprise data governance policies.
                </p>
                <p>
                  All autonomous recommendations, causal confidence scores, and counterfactual simulations are provided as decision-support intelligence alongside explicit statistical assumptions and boundary limitations.
                </p>
                <div className="pt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveLegalModal(null)}
                    className="px-4 py-2 rounded-lg text-white font-semibold cursor-pointer"
                    style={{ backgroundColor: 'var(--theme-primary)' }}
                  >
                    Accept &amp; Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

