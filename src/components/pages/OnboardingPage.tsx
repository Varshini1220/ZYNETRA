import { useState } from 'react';
import { ArrowRight, Check, Database, Sliders, Shield } from 'lucide-react';
import ZynetraLogo from '../brand/ZynetraLogo';
import { User } from '../../types/auth';

interface OnboardingPageProps {
  user: User | null;
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingPage({ user, onComplete, onSkip }: OnboardingPageProps) {
  const [step, setStep] = useState<number>(1);
  const [selectedObjective, setSelectedObjective] = useState<string>('growth_retention');
  const [selectedPreset, setSelectedPreset] = useState<string>('saas_mrr');

  const objectives = [
    {
      id: 'growth_retention',
      title: 'Customer Retention & Revenue Protection',
      desc: 'Identify early churn signals, root causes of attrition, and high-impact retention interventions.',
      icon: Shield,
    },
    {
      id: 'margin_optimization',
      title: 'Unit Economics & Contribution Margin',
      desc: 'Diagnose cost leaks across tiers, CAC payback delays, and regional margin variances.',
      icon: Sliders,
    },
    {
      id: 'supply_throughput',
      title: 'Operational Throughput & Fulfillment SLAs',
      desc: 'Detect bottleneck nodes, lead-time volatility, and autonomous mitigation workflows.',
      icon: Database,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F0E9] text-[#292522] flex flex-col justify-between p-4 sm:p-12 font-sans selection:bg-[#49362F] selection:text-white">
      {/* Top Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between border-b border-[#DDD4CA] pb-5 sm:pb-6 gap-2">
        <ZynetraLogo size="md" />
        <button
          onClick={onSkip}
          className="text-xs uppercase tracking-widest text-[#756D65] hover:text-[#292522] transition-colors font-semibold shrink-0"
        >
          Skip Setup &rarr;
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl w-full mx-auto py-6 sm:py-12">
        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8 text-xs font-mono tracking-wider text-[#756D65]">
          <span className="text-[#49362F] font-bold">0{step}</span>
          <span>/</span>
          <span>02</span>
          <span className="ml-3 uppercase tracking-widest text-[11px] font-sans font-semibold text-[#292522]">
            {step === 1 ? 'Strategic Focus' : 'Intelligence Baseline'}
          </span>
        </div>

        {step === 1 ? (
          <div className="space-y-6 sm:space-y-8 animate-subtle-fade">
            <div>
              <h1 className="text-2xl sm:text-4xl text-[#292522] font-bold tracking-tight leading-tight">
                Welcome, {user?.name || 'Partner'}. What is your primary objective?
              </h1>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-[#756D65] leading-relaxed max-w-xl">
                Zynetra configures diagnostic heuristics, anomaly sensitivity, and predictive cause trees tailored to your strategic mandate.
              </p>
            </div>

            <div className="space-y-3">
              {objectives.map((obj) => {
                const isSelected = selectedObjective === obj.id;
                const Icon = obj.icon;
                return (
                  <div
                    key={obj.id}
                    onClick={() => setSelectedObjective(obj.id)}
                    className={`p-4 sm:p-5 rounded-xl border cursor-pointer transition-all duration-200 flex items-start justify-between gap-3 sm:gap-4 ${
                      isSelected
                        ? 'bg-white border-[#49362F] shadow-sm ring-1 ring-[#49362F]/20'
                        : 'bg-white/70 hover:bg-white border-[#DDD4CA] text-[#292522]'
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'bg-[#49362F] text-white' : 'bg-[#EEE7DE] text-[#756D65]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#292522]">{obj.title}</h3>
                        <p className="text-xs text-[#756D65] mt-1 leading-relaxed">{obj.desc}</p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                        isSelected ? 'border-[#49362F] bg-[#49362F] text-white' : 'border-[#DDD4CA]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-xs text-[#756D65]">You can change this anytime in workspace settings.</span>
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-2xs w-full sm:w-auto min-h-[42px] sm:min-h-0"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8 animate-subtle-fade">
            <div>
              <h1 className="text-2xl sm:text-4xl text-[#292522] font-bold tracking-tight leading-tight">
                Select your starting intelligence corpus
              </h1>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-[#756D65] leading-relaxed max-w-xl">
                Choose an enterprise-scale benchmark dataset or ingest custom raw CSV/Excel telemetry once inside the workspace.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setSelectedPreset('saas_mrr')}
                className={`p-4 sm:p-5 rounded-xl border cursor-pointer transition-all ${
                  selectedPreset === 'saas_mrr'
                    ? 'bg-white border-[#49362F] shadow-sm ring-1 ring-[#49362F]/20'
                    : 'bg-white/70 hover:bg-white border-[#DDD4CA]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#49362F] bg-[#EEE7DE] px-2 py-0.5 rounded font-semibold border border-[#DDD4CA]">
                    Featured Benchmark
                  </span>
                  {selectedPreset === 'saas_mrr' && <Check className="w-4 h-4 text-[#49362F]" />}
                </div>
                <h3 className="text-sm font-bold text-[#292522]">Global B2B SaaS ARR &amp; Churn</h3>
                <p className="text-xs text-[#756D65] mt-1.5 leading-relaxed">
                  2,840 account rows across Enterprise, Mid-Market &amp; SMB cohorts with support ticket resolution telemetry.
                </p>
              </div>

              <div
                onClick={() => setSelectedPreset('retail_supply')}
                className={`p-4 sm:p-5 rounded-xl border cursor-pointer transition-all ${
                  selectedPreset === 'retail_supply'
                    ? 'bg-white border-[#49362F] shadow-sm ring-1 ring-[#49362F]/20'
                    : 'bg-white/70 hover:bg-white border-[#DDD4CA]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#756D65] bg-[#EEE7DE] px-2 py-0.5 rounded font-semibold border border-[#DDD4CA]">
                    Operations
                  </span>
                  {selectedPreset === 'retail_supply' && <Check className="w-4 h-4 text-[#49362F]" />}
                </div>
                <h3 className="text-sm font-bold text-[#292522]">Omnichannel Supply &amp; Delivery</h3>
                <p className="text-xs text-[#756D65] mt-1.5 leading-relaxed">
                  Carrier dispatch latency, port congestion variance, and SLA adherence tracking.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                onClick={() => setStep(1)}
                className="text-xs uppercase tracking-widest text-[#756D65] hover:text-[#292522] font-semibold text-center sm:text-left py-2"
              >
                &larr; Back
              </button>

              <button
                onClick={onComplete}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-2xs w-full sm:w-auto min-h-[42px] sm:min-h-0"
              >
                <span>Enter Zynetra Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto border-t border-[#DDD4CA] pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#756D65] gap-2 text-center sm:text-left">
        <span>Zynetra Autonomous Analytics &amp; Decision Platform</span>
        <span>SOC2 Tier-3 &bull; Enterprise Partition</span>
      </footer>
    </div>
  );
}
