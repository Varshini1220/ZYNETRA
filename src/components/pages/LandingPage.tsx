import React, { useState } from 'react';
import {
  ArrowRight,
  Database,
  GitBranch,
  FileText,
  Send,
} from 'lucide-react';
import ZynetraLogo from '../brand/ZynetraLogo';
import { AuthPageState } from '../../types/auth';

interface LandingPageProps {
  onNavigate: (page: AuthPageState) => void;
  onInstantDemo: () => void;
  isLoggedIn?: boolean;
}

export default function LandingPage({
  onNavigate,
  onInstantDemo,
  isLoggedIn = false,
}: LandingPageProps) {
  const [activePreviewTab, setActivePreviewTab] = useState<'brief' | 'tree' | 'decision'>('brief');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E9] text-[#292522] font-sans selection:bg-[#49362F] selection:text-white">
      {/* 1. TOP NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#DDD4CA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 sm:h-18 flex items-center justify-between gap-2">
          {/* Logo on Left */}
          <div className="flex items-center gap-4 shrink-0">
            <ZynetraLogo size="md" showSubtitle={false} />
          </div>

          {/* Simple Navigation Center/Right */}
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest text-[#756D65] font-semibold">
            <a href="#capabilities" className="hover:text-[#292522] transition-colors">
              Capabilities
            </a>
            <a href="#architecture" className="hover:text-[#292522] transition-colors">
              Architecture
            </a>
            <a href="#editorial-brief" className="hover:text-[#292522] transition-colors">
              Executive Briefing
            </a>
            <a href="#contact" className="hover:text-[#292522] transition-colors">
              Enterprise Inquiry
            </a>
          </nav>

          {/* Action CTAs on Right */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {isLoggedIn ? (
              <button
                onClick={() => onNavigate('app')}
                className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-colors shadow-2xs"
              >
                Go to Workspace &rarr;
              </button>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-[#756D65] hover:text-[#292522] transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all shadow-2xs whitespace-nowrap"
                >
                  Explore Zynetra
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="max-w-4xl">
          {/* Overline badge */}
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-md bg-[#EEE7DE] border border-[#DDD4CA] text-[11px] sm:text-xs uppercase tracking-wider font-mono text-[#49362F] font-semibold max-w-full">
            <span className="w-2 h-2 rounded-full bg-[#7B8570] shrink-0" />
            <span className="truncate">Autonomous Analytics &amp; Decision Platform</span>
          </div>

          {/* Modern Sans-Serif Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#292522] leading-[1.12]">
            Autonomous intelligence <br />
            <span className="text-[#A56F5D]">for decisions that matter.</span>
          </h1>

          {/* Subtitle with calm warm tone */}
          <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-[#756D65] leading-relaxed max-w-2xl font-normal">
            Transform raw business data into clear explanations, root-cause trees, and prioritized interventions—engineered for leadership teams who cannot afford ambiguous dashboards.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate(isLoggedIn ? 'app' : 'signup')}
              className="inline-flex items-center justify-center gap-2.5 px-5 sm:px-7 py-3 sm:py-3.5 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white text-xs font-semibold tracking-widest uppercase transition-all shadow-2xs w-full sm:w-auto min-h-[44px]"
            >
              <span>Explore Zynetra</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onInstantDemo}
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg border border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-[#292522] text-xs font-semibold tracking-widest uppercase transition-colors shadow-2xs w-full sm:w-auto min-h-[44px]"
            >
              <span>See How It Works</span>
            </button>
          </div>
        </div>

        {/* Metric Bar */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-[#DDD4CA] grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          <div className="p-3 sm:p-4 rounded-lg bg-white border border-[#DDD4CA]">
            <div className="text-xl sm:text-3xl font-bold text-[#292522]">99.4%</div>
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-[#756D65] font-semibold mt-1">Causal Resolution Rate</div>
          </div>
          <div className="p-3 sm:p-4 rounded-lg bg-white border border-[#DDD4CA]">
            <div className="text-xl sm:text-3xl font-bold text-[#292522]">0-Click</div>
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-[#756D65] font-semibold mt-1">Autonomous Synthesis</div>
          </div>
          <div className="p-3 sm:p-4 rounded-lg bg-white border border-[#DDD4CA]">
            <div className="text-xl sm:text-3xl font-bold text-[#292522]">4.2x</div>
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-[#756D65] font-semibold mt-1">Decision Cycle Velocity</div>
          </div>
          <div className="p-3 sm:p-4 rounded-lg bg-white border border-[#DDD4CA]">
            <div className="text-xl sm:text-3xl font-bold text-[#292522]">SOC2</div>
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-[#756D65] font-semibold mt-1">Tier-3 Zero-Retention</div>
          </div>
        </div>
      </section>

      {/* 3. INTELLIGENCE SHOWCASE (Interactive Preview) */}
      <section id="editorial-brief" className="py-14 sm:py-20 bg-[#EEE7DE] border-y border-[#DDD4CA] px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4 sm:gap-6">
            <div>
              <span className="text-[11px] sm:text-xs uppercase font-mono tracking-widest text-[#49362F] font-semibold">
                Executive Intelligence Briefing
              </span>
              <h2 className="text-xl sm:text-3xl font-bold text-[#292522] mt-2 tracking-tight">
                The four questions every executive needs answered.
              </h2>
            </div>

            {/* Preview switcher */}
            <div className="flex items-center gap-1 p-1 bg-[#DDD4CA] rounded-lg text-xs font-semibold overflow-x-auto max-w-full">
              <button
                onClick={() => setActivePreviewTab('brief')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-md transition-colors whitespace-nowrap text-[11px] sm:text-xs ${
                  activePreviewTab === 'brief' ? 'bg-white text-[#292522] shadow-2xs' : 'text-[#756D65] hover:text-[#292522]'
                }`}
              >
                Executive Story
              </button>
              <button
                onClick={() => setActivePreviewTab('tree')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-md transition-colors whitespace-nowrap text-[11px] sm:text-xs ${
                  activePreviewTab === 'tree' ? 'bg-white text-[#292522] shadow-2xs' : 'text-[#756D65] hover:text-[#292522]'
                }`}
              >
                Root-Cause Tree
              </button>
              <button
                onClick={() => setActivePreviewTab('decision')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-md transition-colors whitespace-nowrap text-[11px] sm:text-xs ${
                  activePreviewTab === 'decision' ? 'bg-white text-[#292522] shadow-2xs' : 'text-[#756D65] hover:text-[#292522]'
                }`}
              >
                Prioritized Action
              </button>
            </div>
          </div>

          {/* Showcase Window */}
          <div className="bg-white rounded-xl border border-[#DDD4CA] p-4 sm:p-8 shadow-sm">
            {activePreviewTab === 'brief' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Chapter 01 */}
                <div className="p-4 rounded-lg bg-[#F8F3EC] border border-[#DDD4CA] space-y-2.5">
                  <div className="text-[11px] font-mono text-[#A56F5D] tracking-wider uppercase font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A56F5D]" />
                    <span>01 &bull; What is happening?</span>
                  </div>
                  <h3 className="text-base font-bold text-[#292522] leading-snug">
                    Mid-Market Churn Spike in EMEA
                  </h3>
                  <p className="text-xs text-[#756D65] leading-relaxed">
                    Customer attrition accelerated to 16.4% in EMEA accounts, creating a $320,000 annualized net ARR leakage.
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-[#A56F5D] font-semibold border-t border-[#DDD4CA]/60">
                    Variance: +4.2% vs Plan Target
                  </div>
                </div>

                {/* Chapter 02 */}
                <div className="p-4 rounded-lg bg-[#F8F3EC] border border-[#DDD4CA] space-y-2.5">
                  <div className="text-[11px] font-mono text-[#6A5045] tracking-wider uppercase font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6A5045]" />
                    <span>02 &bull; Why did it happen?</span>
                  </div>
                  <h3 className="text-base font-bold text-[#292522] leading-snug">
                    Resolution Latency Exceeded 8.4 Hours
                  </h3>
                  <p className="text-xs text-[#756D65] leading-relaxed">
                    Tier-2 escalation queue bottlenecks caused mean resolution time to triple during the migration rollout.
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-[#6A5045] font-semibold border-t border-[#DDD4CA]/60">
                    Primary Driver: Support Backlog (68% wt)
                  </div>
                </div>

                {/* Chapter 03 */}
                <div className="p-4 rounded-lg bg-[#F8F3EC] border border-[#DDD4CA] space-y-2.5">
                  <div className="text-[11px] font-mono text-[#756D65] tracking-wider uppercase font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#756D65]" />
                    <span>03 &bull; If we do nothing?</span>
                  </div>
                  <h3 className="text-base font-bold text-[#292522] leading-snug">
                    $1.24M Cumulative Loss by Q4
                  </h3>
                  <p className="text-xs text-[#756D65] leading-relaxed">
                    Unresolved friction cascades to enterprise cohort renewals with 38% probability of contraction.
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-[#756D65] font-semibold border-t border-[#DDD4CA]/60">
                    Compound Contraction Horizon: 90 Days
                  </div>
                </div>

                {/* Chapter 04 */}
                <div className="p-4 rounded-lg bg-[#F8F3EC] border border-[#DDD4CA] space-y-2.5">
                  <div className="text-[11px] font-mono text-[#7B8570] tracking-wider uppercase font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7B8570]" />
                    <span>04 &bull; What should we do?</span>
                  </div>
                  <h3 className="text-base font-bold text-[#292522] leading-snug">
                    Deploy Dedicated EMEA Triage Pod
                  </h3>
                  <p className="text-xs text-[#756D65] leading-relaxed">
                    Restructure weekend shift coverage and auto-route high-ACV migration tickets directly to senior staff.
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-[#7B8570] font-semibold border-t border-[#DDD4CA]/60">
                    Expected ROI: +$410,000 Recovered
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'tree' && (
              <div className="space-y-4">
                <div className="border-b border-[#DDD4CA] pb-3 flex items-center justify-between">
                  <span className="text-xs font-mono text-[#756D65] uppercase">Root Symptom Analysis</span>
                  <span className="text-xs font-mono text-[#7B8570] font-semibold">Confidence Score: 94.2%</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC]">
                    <div className="font-semibold text-[#292522]">Level 1: Observable Variance</div>
                    <p className="text-[#756D65] mt-1">Gross churn divergence spike in EMEA accounts (&gt; $350k MRR cohort).</p>
                  </div>
                  <div className="p-4 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC]">
                    <div className="font-semibold text-[#292522]">Level 2: Direct Driver</div>
                    <p className="text-[#756D65] mt-1">Mean ticket resolution lengthened from 3.2 hrs to 8.4 hrs post-upgrade.</p>
                  </div>
                  <div className="p-4 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC]">
                    <div className="font-semibold text-[#292522]">Level 3: Underlying Mechanism</div>
                    <p className="text-[#756D65] mt-1">Cross-regional triage routing failed due to misconfigured escalation policy.</p>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'decision' && (
              <div className="p-5 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#7B8570] bg-[#E8EBE1] border border-[#7B8570]/30 px-2 py-0.5 rounded font-semibold">
                    Recommendation P1 &bull; 92% Confidence
                  </span>
                  <h4 className="text-sm font-bold text-[#292522] mt-2">
                    Deploy Autonomous High-Priority Routing for EMEA Migration Tickets
                  </h4>
                  <p className="text-xs text-[#756D65] mt-1">
                    Expected Impact: -$280K churn within 30 days &bull; Zero additional headcount required.
                  </p>
                </div>
                <button
                  onClick={onInstantDemo}
                  className="px-4 py-2 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 shadow-2xs"
                >
                  Simulate &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. CAPABILITIES GRID */}
      <section id="capabilities" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12">
          <span className="text-xs uppercase font-mono tracking-widest text-[#49362F] font-semibold">Core Capabilities</span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#292522] mt-2 tracking-tight">
            Designed to eliminate the gap between data and execution.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-xl border border-[#DDD4CA] bg-white space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-[#EEE7DE] flex items-center justify-center text-[#49362F]">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#292522]">01 &bull; Autonomous Ingestion &amp; Profiling</h3>
            <p className="text-xs text-[#756D65] leading-relaxed">
              Drop any CSV or Excel file. Zynetra infers column semantics, cleans corrupt values, calculates distributions, and flags data anomalies in seconds.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-xl border border-[#DDD4CA] bg-white space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-[#EEE7DE] flex items-center justify-center text-[#49362F]">
              <GitBranch className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#292522]">02 &bull; Multi-Tier Cause Trees</h3>
            <p className="text-xs text-[#756D65] leading-relaxed">
              Move beyond mere correlation. Zynetra constructs diagnostic causal chains explaining precisely why metrics shifted and which variables drove the change.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-xl border border-[#DDD4CA] bg-white space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-[#EEE7DE] flex items-center justify-center text-[#49362F]">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#292522]">03 &bull; Board-Ready Analyst Decks</h3>
            <p className="text-xs text-[#756D65] leading-relaxed">
              Auto-generates full 6-dashboard presentation decks with executive slides, speaker notes, and unit economic breakdowns formatted for leadership review.
            </p>
          </div>
        </div>
      </section>

      {/* 5. ARCHITECTURE & PHILOSOPHY */}
      <section id="architecture" className="py-20 bg-[#EEE7DE] border-t border-[#DDD4CA] px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-[#49362F] font-semibold">The Paradigm Shift</span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#292522] mt-2 tracking-tight">
              Dashboards inform. <br />
              <span className="text-[#A56F5D]">Zynetra explains.</span>
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-[#756D65] leading-relaxed">
              Legacy BI forces executives to spend hours interpreting charts, cross-referencing tabs, and guessing at causality. Zynetra operates as an autonomous intelligence officer: continuously analyzing distributions, identifying root drivers, and formulating prioritized decisions.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#DDD4CA] p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#DDD4CA] pb-3">
              <span className="text-xs uppercase tracking-wider text-[#756D65] font-semibold">Traditional BI Dashboard</span>
              <span className="text-xs uppercase tracking-wider text-[#A56F5D] font-mono font-semibold">High Human Friction</span>
            </div>
            <p className="text-xs text-[#756D65]">
              Outputs static line charts. Requires analyst to manually isolate why revenue dropped, check 12 other dashboards, and write manual memos.
            </p>

            <div className="flex items-center justify-between border-t border-b border-[#DDD4CA] py-3">
              <span className="text-xs uppercase tracking-wider text-[#292522] font-bold">Zynetra Autonomous Engine</span>
              <span className="text-xs uppercase tracking-wider text-[#7B8570] font-mono font-semibold">Immediate Clarity</span>
            </div>
            <p className="text-xs text-[#756D65]">
              Synthesizes raw records into an executive briefing answering what happened, why it happened, cost of inaction, and exact steps to resolve.
            </p>
          </div>
        </div>
      </section>

      {/* 6. ENTERPRISE CONTACT */}
      <section id="contact" className="py-20 px-6 lg:px-12 max-w-4xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase font-mono tracking-widest text-[#49362F] font-semibold">Deploy Zynetra</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#292522] mt-2 tracking-tight">
            Initiate enterprise access
          </h2>
          <p className="text-xs sm:text-sm text-[#756D65] mt-2">
            Inquire regarding on-premise partitions, custom data connectors, or tailored machine intelligence deployments.
          </p>
        </div>

        <form onSubmit={handleContactSubmit} className="bg-white rounded-xl border border-[#DDD4CA] p-6 sm:p-8 space-y-4 text-xs shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#292522] font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                Full Name <span className="text-[#A56F5D]">*</span>
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Vihaan"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F3EC] border border-[#DDD4CA] text-[#292522] focus:outline-none focus:border-[#49362F] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[#292522] font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                Work Email <span className="text-[#A56F5D]">*</span>
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="name@enterprise.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F3EC] border border-[#DDD4CA] text-[#292522] focus:outline-none focus:border-[#49362F] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#292522] font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
              Strategic Requirement or Data Volume
            </label>
            <textarea
              rows={3}
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="Describe your organization's analytics mandate, schema types, or timeline..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F3EC] border border-[#DDD4CA] text-[#292522] focus:outline-none focus:border-[#49362F] transition-colors"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[#756D65] text-[11px]">Protected under enterprise NDA.</span>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white font-semibold uppercase tracking-wider transition-colors shadow-2xs"
            >
              <span>Submit Inquiry</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {contactSubmitted && (
            <div className="p-3 rounded-lg bg-[#E8EBE1] border border-[#7B8570]/30 text-[#7B8570] text-center font-medium animate-subtle-fade">
              Inquiry transmitted. A senior analytics architect will follow up within 4 business hours.
            </div>
          )}
        </form>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-[#DDD4CA] bg-[#EEE7DE] py-10 px-6 lg:px-12 text-xs text-[#756D65]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <ZynetraLogo size="sm" showSubtitle={false} />
          <div className="flex items-center gap-4 uppercase tracking-wider text-[11px] font-semibold">
            <span>Autonomous Analytics</span>
            <span>&bull;</span>
            <span>Decision Intelligence</span>
            <span>&bull;</span>
            <span>SOC2 Type II</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Zynetra Technologies. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
