import { useState } from 'react';
import {
  HelpCircle,
  Lightbulb,
  ArrowRight,
  FileQuestion,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { CauseTreeNode } from '../types';

interface RootCauseTreeProps {
  tree: CauseTreeNode;
  isDark: boolean;
  onNavigateTab?: (tab: any) => void;
}

export default function RootCauseTree({ tree, isDark: _isDark, onNavigateTab }: RootCauseTreeProps) {
  const [selectedNode, setSelectedNode] = useState<CauseTreeNode>(tree);
  const [showHowToRead, setShowHowToRead] = useState(false);

  const renderNodeBadge = (type: CauseTreeNode['type']) => {
    switch (type) {
      case 'symptom':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#A56F5D]/10 text-[#A56F5D] border border-[#A56F5D]/20">
            Observed Symptom
          </span>
        );
      case 'primary_driver':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#6A5045]/10 text-[#6A5045] border border-[#6A5045]/20">
            Primary Driver
          </span>
        );
      case 'root_cause':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#49362F]/10 text-[#49362F] border border-[#49362F]/20">
            Systemic Root Cause
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#EEE7DE] text-[#756D65] border border-[#DDD4CA]">
            Contributing Factor
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 font-sans text-[#292522] animate-subtle-fade">
      {/* Header and Explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-[#DDD4CA] pb-5 sm:pb-6">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#A56F5D] font-semibold">
            Diagnostic ML
          </span>
          <h3 className="text-xl sm:text-3xl font-bold text-[#292522] mt-1">
            Autonomous Root-Cause Diagnostic Tree
          </h3>
          <p className="text-xs text-[#756D65] mt-1">
            Isolates structural drivers through multi-hypothesis testing and causal elimination.
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <button
            onClick={() => setShowHowToRead(!showHowToRead)}
            className="text-xs text-[#756D65] hover:text-[#292522] font-semibold flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHowToRead ? 'Hide Guide' : 'How to Read This Tree'}</span>
          </button>
          <span className="text-xs text-[#7B8570] font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8EBE1] border border-[#7B8570]/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Non-Spurious Verification</span>
          </span>
        </div>
      </div>

      {/* Expandable "How to Read This" Panel */}
      {showHowToRead && (
        <div className="p-4 sm:p-6 rounded-xl bg-white border border-[#DDD4CA] text-xs space-y-4 shadow-xs">
          <div className="text-sm font-bold text-[#292522]">The 3-Tier Causality Hierarchy:</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-3.5 sm:p-4 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC]">
              <span className="text-xs font-bold text-[#A56F5D]">1. Observed Symptom</span>
              <p className="text-[#756D65] mt-1.5 leading-relaxed">What the metrics showed (e.g. Churn divergence +4.2%). The observable consequence, not the origin.</p>
            </div>
            <div className="p-3.5 sm:p-4 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC]">
              <span className="text-xs font-bold text-[#6A5045]">2. Primary Driver</span>
              <p className="text-[#756D65] mt-1.5 leading-relaxed">Where the variance concentrates (e.g. EMEA Enterprise migration cohorts post-v4.2).</p>
            </div>
            <div className="p-3.5 sm:p-4 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC]">
              <span className="text-xs font-bold text-[#49362F]">3. Systemic Root Cause</span>
              <p className="text-[#756D65] mt-1.5 leading-relaxed">The underlying mechanism (e.g. Support escalation routing failures causing latency spike).</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Interactive Tree on Left, Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Tree Structure */}
        <div className="lg:col-span-2 p-4 sm:p-7 rounded-xl border border-[#DDD4CA] bg-white space-y-5 sm:space-y-6 shadow-xs">
          {/* Level 0: Symptom Root */}
          <div>
            <div className="text-xs uppercase font-mono tracking-wider text-[#756D65] mb-2 flex items-center justify-between">
              <span>Level 0: Empirical Symptom</span>
              <span className="text-[11px]">Click to inspect details</span>
            </div>
            <div
              onClick={() => setSelectedNode(tree)}
              className={`p-4 sm:p-5 rounded-xl border cursor-pointer transition-all ${
                selectedNode.id === tree.id
                  ? 'border-[#A56F5D] bg-[#A56F5D]/5 shadow-xs'
                  : 'border-[#DDD4CA] bg-[#F8F3EC] hover:bg-[#EEE7DE]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                {renderNodeBadge(tree.type)}
                <div className="flex items-center gap-2 font-mono text-xs tabular-nums flex-wrap">
                  <span className="text-[#A56F5D] font-bold">{tree.impactPercentage}% Impact</span>
                  <span className="text-[#DDD4CA]">&bull;</span>
                  <span className="text-[#7B8570] font-semibold">{tree.confidenceScore}% Algorithm Confidence</span>
                </div>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-[#292522]">{tree.label}</h4>
              <p className="text-xs text-[#756D65] mt-1.5 line-clamp-2 leading-relaxed">{tree.supportingEvidence}</p>
            </div>
          </div>

          {/* Level 1 & 2 Branches */}
          <div className="pl-3 sm:pl-6 border-l-2 border-[#DDD4CA] space-y-4">
            <div className="text-xs uppercase font-mono tracking-wider text-[#756D65] mb-2 font-medium">
              Level 1 &amp; 2: Contributing Drivers &amp; Systemic Causes
            </div>

            {tree.children?.map(driver => (
              <div key={driver.id} className="space-y-3">
                {/* Driver Node */}
                <div
                  onClick={() => setSelectedNode(driver)}
                  className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedNode.id === driver.id
                      ? 'border-[#49362F] bg-[#49362F]/5 shadow-xs'
                      : 'border-[#DDD4CA] bg-[#F8F3EC] hover:bg-[#EEE7DE]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                    {renderNodeBadge(driver.type)}
                    <div className="flex items-center gap-2 font-mono text-xs tabular-nums flex-wrap">
                      <span className="text-[#6A5045] font-bold">{driver.impactPercentage}% Contribution</span>
                      <span className="text-[#DDD4CA]">&bull;</span>
                      <span className="text-[#7B8570] font-semibold">{driver.confidenceScore}% Conf</span>
                    </div>
                  </div>
                  <h5 className="text-sm sm:text-base font-bold text-[#292522]">{driver.label}</h5>
                  <p className="text-xs text-[#756D65] mt-1 line-clamp-1">{driver.supportingEvidence}</p>
                </div>

                {/* Sub-drivers / Root Causes (Level 2) */}
                {driver.children && (
                  <div className="pl-3 sm:pl-6 border-l-2 border-[#DDD4CA] space-y-2.5">
                    {driver.children.map(sub => (
                      <div
                        key={sub.id}
                        onClick={() => setSelectedNode(sub)}
                        className={`p-3 sm:p-3.5 rounded-lg border cursor-pointer transition-all ${
                          selectedNode.id === sub.id
                            ? 'border-[#7B8570] bg-[#E8EBE1] shadow-xs'
                            : 'border-[#DDD4CA] bg-white hover:bg-[#F8F3EC]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                          {renderNodeBadge(sub.type)}
                          <span className="text-xs font-mono text-[#756D65] font-semibold tabular-nums">
                            {sub.impactPercentage}% Weight
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-[#292522]">{sub.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Evidence & Alternative Hypotheses Inspector */}
        <div className="p-6 sm:p-7 rounded-xl border border-[#DDD4CA] bg-white space-y-5 shadow-xs">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#49362F] font-semibold">
              Node Inspector
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-[#292522] mt-1 leading-snug">{selectedNode.label}</h4>
            <div className="flex items-center gap-3 mt-3">
              {renderNodeBadge(selectedNode.type)}
              <span className="text-xs font-mono text-[#7B8570] font-semibold tabular-nums">
                {selectedNode.confidenceScore}% Statistical Certainty
              </span>
            </div>
          </div>

          {/* Plain English Synthesis */}
          <div className="p-4 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] space-y-2 text-xs">
            <div className="font-bold text-[#292522] flex items-center gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-[#A56F5D]" />
              <span>Executive Synthesis:</span>
            </div>
            <p className="text-[#756D65] leading-relaxed">
              {selectedNode.type === 'symptom'
                ? 'This is the headline variance isolated across records. Trace connected child nodes to isolate the operational origin.'
                : selectedNode.type === 'primary_driver'
                ? `This driver directly accounts for ${selectedNode.impactPercentage}% of observed variance across the analyzed cohort.`
                : `This represents the systemic mechanism. Remediating this operational friction will resolve ${selectedNode.impactPercentage}% of the symptom.`}
            </p>
          </div>

          <div className="space-y-4 pt-1 text-xs">
            <div>
              <div className="font-semibold text-[#292522] mb-1.5 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7B8570]" />
                <span className="uppercase font-mono text-[10px] tracking-wider text-[#756D65]">Empirical Evidence</span>
              </div>
              <p className="text-[#756D65] leading-relaxed bg-[#F8F3EC] p-3.5 rounded-lg border border-[#DDD4CA]">
                {selectedNode.supportingEvidence}
              </p>
            </div>

            {selectedNode.alternativeHypothesis ? (
              <div>
                <div className="font-semibold text-[#292522] mb-1.5 flex items-center gap-2">
                  <FileQuestion className="w-3.5 h-3.5 text-[#6A5045]" />
                  <span className="uppercase font-mono text-[10px] tracking-wider text-[#756D65]">Alternative Hypotheses Ruled Out</span>
                </div>
                <p className="text-[#756D65] leading-relaxed bg-[#F8F3EC] p-3.5 rounded-lg border border-[#DDD4CA]">
                  {selectedNode.alternativeHypothesis}
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-[#F8F3EC] border border-[#DDD4CA] text-xs text-[#756D65] italic">
                Root node. Click individual sub-drivers to review specific alternative hypotheses ruled out.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Guided Next Step Banner */}
      {onNavigateTab && (
        <div className="p-6 rounded-xl border border-[#DDD4CA] bg-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div>
            <div className="text-xs font-bold text-[#292522] flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-[#EEE7DE] text-[#49362F] font-semibold">Recommended Next Step</span>
              <span className="text-base font-bold">Run What-If Counterfactual Sandbox</span>
            </div>
            <p className="text-xs text-[#756D65] mt-1">
              Simulate price revisions, SLA adjustments, and resource re-allocation before executing decisions.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('predictive')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors shadow-2xs"
          >
            <span>Launch What-If Sandbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
