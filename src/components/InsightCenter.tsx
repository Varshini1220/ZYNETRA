import { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  GitMerge,
  ShieldAlert,
  Lightbulb,
  FileCheck2,
  ArrowRight,
} from 'lucide-react';
import { NaturalInsight } from '../types';

interface InsightCenterProps {
  insights: NaturalInsight[];
  isDark: boolean;
  onNavigateTab?: (tab: any) => void;
}

export default function InsightCenter({ insights, isDark: _isDark, onNavigateTab }: InsightCenterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Anomaly', 'Trend', 'Relationship', 'Risk', 'Opportunity'];

  const filteredInsights = selectedCategory === 'all'
    ? insights
    : insights.filter(i => i.category.toLowerCase() === selectedCategory.toLowerCase());

  const getCategoryIcon = (cat: NaturalInsight['category']) => {
    switch (cat) {
      case 'Anomaly':
        return <AlertTriangle className="w-3.5 h-3.5 text-[#A56F5D]" />;
      case 'Trend':
        return <TrendingUp className="w-3.5 h-3.5 text-[#49362F]" />;
      case 'Relationship':
        return <GitMerge className="w-3.5 h-3.5 text-[#6A5045]" />;
      case 'Risk':
        return <ShieldAlert className="w-3.5 h-3.5 text-[#A56F5D]" />;
      case 'Opportunity':
        return <Lightbulb className="w-3.5 h-3.5 text-[#7B8570]" />;
    }
  };

  const getSeverityBadge = (sev: NaturalInsight['severity']) => {
    switch (sev) {
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#A56F5D]/10 text-[#A56F5D] border border-[#A56F5D]/20">
            Critical
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#6A5045]/10 text-[#6A5045] border border-[#6A5045]/20">
            Attention
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#EEE7DE] text-[#756D65]">
            Informational
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 font-sans text-[#292522] animate-subtle-fade">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-[#DDD4CA] pb-5 sm:pb-6">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#49362F] font-semibold">
            Autonomous Synthesis
          </span>
          <h3 className="text-xl sm:text-3xl font-bold text-[#292522] mt-1">
            Natural Language Intelligence Syntheses
          </h3>
          <p className="text-xs text-[#756D65] mt-1">
            Auditable insights, mathematical confidence scores, and columnar ground-truth citations.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-white rounded-lg border border-[#DDD4CA] shadow-2xs max-w-full">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#49362F] text-white shadow-2xs font-semibold'
                  : 'text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredInsights.map(insight => (
          <div
            key={insight.id}
            className="p-4 sm:p-6 rounded-xl border border-[#DDD4CA] bg-white space-y-4 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#F8F3EC] flex items-center justify-center">
                    {getCategoryIcon(insight.category)}
                  </div>
                  <span className="text-xs font-semibold text-[#292522]">{insight.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getSeverityBadge(insight.severity)}
                  <span className="text-xs font-mono font-semibold text-[#7B8570] tabular-nums">
                    {insight.confidenceScore}% Certainty
                  </span>
                </div>
              </div>

              <h4 className="text-base sm:text-lg font-bold text-[#292522] leading-snug">{insight.title}</h4>
              <p className="text-xs text-[#756D65] mt-2 leading-relaxed">{insight.description}</p>
            </div>

            <div className="pt-4 border-t border-[#DDD4CA]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#756D65]">
                <FileCheck2 className="w-3.5 h-3.5 text-[#7B8570]" />
                <span>Field: </span>
                <span className="text-[#292522] font-semibold">{insight.relatedColumn}</span>
              </div>
              <div className="text-[11px] font-mono text-[#756D65]">
                Methodology: <span className="text-[#49362F] font-semibold">Causal Elimination</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Strip */}
      {onNavigateTab && (
        <div className="p-4 sm:p-6 rounded-xl border border-[#DDD4CA] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <div className="text-xs font-bold text-[#292522] flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-[#EEE7DE] text-[#49362F] font-semibold">Prescriptive Phase</span>
              <span className="text-sm sm:text-base font-bold">Review Prioritized Decision Roadmap</span>
            </div>
            <p className="text-xs text-[#756D65] mt-1">
              Convert these empirical observations into ROI-ranked executive interventions.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('decisions')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors shadow-2xs w-full sm:w-auto min-h-[42px] sm:min-h-0"
          >
            <span>Prioritized Decisions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
