import { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  IndianRupee,
  FileQuestion,
  ArrowRight,
} from 'lucide-react';
import { DecisionRecommendation } from '../types';

interface DecisionCenterProps {
  recommendations: DecisionRecommendation[];
  isDark: boolean;
  onNavigateTab?: (tab: any) => void;
}

export default function DecisionCenter({ recommendations, isDark: _isDark, onNavigateTab }: DecisionCenterProps) {
  const [selectedRec, setSelectedRec] = useState<DecisionRecommendation | null>(null);
  const [activeActions, setActiveActions] = useState<Record<string, boolean>>({});

  const toggleActionStep = (key: string) => {
    setActiveActions(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getPriorityBadge = (priority: DecisionRecommendation['priority']) => {
    switch (priority) {
      case 'P1 - Immediate':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#A56F5D]/10 text-[#A56F5D] border border-[#A56F5D]/20">
            P1 Immediate (30d)
          </span>
        );
      case 'P2 - Strategic':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#6A5045]/10 text-[#6A5045] border border-[#6A5045]/20">
            P2 Strategic (60d)
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#EEE7DE] text-[#756D65] border border-[#DDD4CA]">
            P3 Optimization (90d)
          </span>
        );
    }
  };

  const getRiskBadge = (risk: DecisionRecommendation['riskLevel']) => {
    const r = (risk || 'low').toLowerCase();
    if (r.includes('high')) {
      return (
        <span className="text-xs font-semibold text-[#A56F5D] flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" /> High Risk Profile
        </span>
      );
    } else if (r.includes('med')) {
      return (
        <span className="text-xs font-semibold text-[#6A5045] flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" /> Moderate Risk
        </span>
      );
    } else {
      return (
        <span className="text-xs font-semibold text-[#7B8570] flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Low Operational Risk
        </span>
      );
    }
  };

  return (
    <div className="space-y-8 font-sans text-[#292522] animate-subtle-fade">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-[#DDD4CA] pb-5 sm:pb-6">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#49362F] font-semibold">
            Prescriptive ML
          </span>
          <h3 className="text-xl sm:text-3xl font-bold text-[#292522] mt-1">
            Autonomous Prioritized Decision Recommendations
          </h3>
          <p className="text-xs text-[#756D65] mt-1">
            Intervention roadmap ranked by net benefit, operational risk, and algorithmic certainty.
          </p>
        </div>
        <span className="text-xs uppercase font-mono tracking-wider px-3 py-1.5 rounded-lg bg-white text-[#292522] border border-[#DDD4CA] shadow-2xs font-semibold self-start sm:self-auto">
          Ranked by ROI &amp; Feasibility
        </span>
      </div>

      {/* Decision Cards List */}
      <div className="space-y-5 sm:space-y-6">
        {recommendations.map(rec => (
          <div
            key={rec.id}
            className="p-4 sm:p-7 rounded-xl border border-[#DDD4CA] bg-white space-y-4 sm:space-y-5 shadow-xs"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 border-b border-[#DDD4CA]/60 pb-4">
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                {getPriorityBadge(rec.priority)}
                <h4 className="text-base sm:text-xl font-bold text-[#292522]">{rec.title}</h4>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 text-xs text-[#756D65] flex-wrap">
                {getRiskBadge(rec.riskLevel)}
                <span className="font-mono font-semibold text-[#7B8570] text-xs tabular-nums">
                  {rec.confidenceScore}% Certainty
                </span>
                <span className="font-mono text-[11px] text-[#756D65]">Timeline: {rec.timeline || rec.timeframe}</span>
              </div>
            </div>

            <p className="text-xs text-[#756D65] leading-relaxed max-w-3xl">{rec.description || rec.why}</p>

            {/* Benefit & Impact Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC] flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white text-[#7B8570] border border-[#DDD4CA] shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-[#756D65]">Expected Impact</div>
                  <div className="text-sm sm:text-base font-bold text-[#292522] mt-0.5">{rec.expectedImpact}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC] flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white text-[#49362F] border border-[#DDD4CA] shrink-0">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-[#756D65]">Estimated Net Benefit</div>
                  <div className="text-sm sm:text-base font-bold text-[#292522] mt-0.5 tabular-nums">
                    {rec.estimatedBenefit || rec.estimatedBenefitROI}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Steps Checklist */}
            <div className="space-y-3 pt-2">
              <div className="text-xs uppercase font-mono tracking-wider text-[#756D65] font-semibold">
                Execution Roadmap &amp; Milestones
              </div>
              <div className="space-y-2">
                {rec.actionSteps.map((step, sIdx) => {
                  const stepKey = `${rec.id}-${sIdx}`;
                  const isChecked = !!activeActions[stepKey];
                  return (
                    <div
                      key={sIdx}
                      onClick={() => toggleActionStep(stepKey)}
                      className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-[#F8F3EC] border-[#DDD4CA] text-[#756D65] line-through'
                          : 'bg-white hover:bg-[#F8F3EC] border-[#DDD4CA] text-[#292522]'
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded-md flex items-center justify-center border text-[10px] font-bold ${
                        isChecked ? 'bg-[#7B8570] border-[#7B8570] text-white' : 'border-[#DDD4CA] bg-white text-transparent'
                      }`}>
                        ✓
                      </div>
                      <span className="flex-1 leading-snug">{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explainability Trigger Button */}
            <div className="pt-4 border-t border-[#DDD4CA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#756D65]">
              <div>
                Zynetra Explainability Protocol: Every parameter and calculation is mathematically auditable.
              </div>
              <button
                onClick={() => setSelectedRec(rec)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] hover:bg-[#EEE7DE] text-[#292522] font-semibold transition-colors self-start sm:self-auto"
              >
                <FileQuestion className="w-3.5 h-3.5 text-[#756D65]" />
                <span>Explainability Dossier</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Guided Next Step Banner */}
      {onNavigateTab && (
        <div className="p-6 rounded-xl border border-[#DDD4CA] bg-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div>
            <div className="text-xs font-bold text-[#292522] flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-[#EEE7DE] text-[#49362F] font-semibold">Next Action</span>
              <span className="text-base font-bold">Generate Executive Reports &amp; Exports</span>
            </div>
            <p className="text-xs text-[#756D65] mt-1">
              Generate boardroom dossiers, slide presentations, and auditable data logs.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('reports')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors shadow-2xs"
          >
            <span>Generate Executive Reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Deep Explainability Dossier Modal */}
      {selectedRec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="max-w-2xl w-full rounded-xl border border-[#DDD4CA] p-6 sm:p-8 bg-white text-[#292522] shadow-xl my-8 animate-subtle-fade">
            <div className="flex items-center justify-between border-b border-[#DDD4CA] pb-4 mb-5">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#A56F5D] font-semibold">
                  Transparent Algorithmic Audit
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#292522] mt-1">
                  Explainability Dossier: {selectedRec.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRec(null)}
                className="rounded-lg border border-[#DDD4CA] hover:bg-[#EEE7DE] text-[#756D65] text-xs px-3 py-1 font-medium transition-colors"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC] space-y-1">
                <div className="font-bold text-[#49362F] text-xs uppercase font-mono tracking-wider">
                  1. Rationale &amp; Optimization Target
                </div>
                <p className="text-[#292522] leading-relaxed">
                  {selectedRec.explainability?.whyProduced || selectedRec.why}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC] space-y-1">
                <div className="font-bold text-[#7B8570] text-xs uppercase font-mono tracking-wider">
                  2. Empirical Telemetry Evidence
                </div>
                <p className="text-[#292522] leading-relaxed font-mono">
                  {selectedRec.explainability?.supportingData || selectedRec.supportingData}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC] space-y-1.5">
                <div className="font-bold text-[#6A5045] text-xs uppercase font-mono tracking-wider">
                  3. Model Assumptions
                </div>
                {Array.isArray(selectedRec.assumptions) ? (
                  <ul className="list-disc pl-4 space-y-1 text-[#756D65]">
                    {selectedRec.assumptions.map((ass: string, i: number) => (
                      <li key={i}>{ass}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#756D65] leading-relaxed">{selectedRec.assumptions}</p>
                )}
              </div>

              <div className="p-4 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC] space-y-1.5">
                <div className="font-bold text-[#A56F5D] text-xs uppercase font-mono tracking-wider">
                  4. Boundary Limitations &amp; Contingencies
                </div>
                {Array.isArray(selectedRec.limitations) ? (
                  <ul className="list-disc pl-4 space-y-1 text-[#756D65]">
                    {selectedRec.limitations.map((lim: string, i: number) => (
                      <li key={i}>{lim}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#756D65] leading-relaxed">{selectedRec.limitations}</p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#DDD4CA] flex justify-end">
              <button
                onClick={() => setSelectedRec(null)}
                className="px-5 py-2 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-2xs"
              >
                Return to Roadmap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
