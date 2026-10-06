import { useState } from 'react';
import {
  Presentation,
  Sparkles,
  Building2,
  Layers,
  IndianRupee,
  Cpu,
  Users,
  Activity,
  X,
  Check,
} from 'lucide-react';
import { DatasetProfile } from '../types';
import { AnalystDashboardType, DashboardGenerationConfig } from '../types/analystDashboard';
import { ThemeId } from '../types/theme';

interface DashboardGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: DatasetProfile;
  rawRowCount: number;
  currentTheme: ThemeId;
  isDark: boolean;
  onGenerate: (config: DashboardGenerationConfig) => void;
}

export default function DashboardGenerationModal({
  isOpen,
  onClose,
  profile,
  rawRowCount,
  currentTheme: _currentTheme,
  isDark: _isDark,
  onGenerate,
}: DashboardGenerationModalProps) {
  const [selectedTypes, setSelectedTypes] = useState<AnalystDashboardType[]>(['all']);
  const [targetAudience, setTargetAudience] = useState<DashboardGenerationConfig['targetAudience']>('Executive Board');
  const [presentationFocus, setPresentationFocus] = useState<DashboardGenerationConfig['presentationFocus']>('Growth & Strategy');

  if (!isOpen) return null;

  const dashboardOptions: {
    id: AnalystDashboardType;
    title: string;
    subtitle: string;
    icon: any;
    recommendedFor: string;
  }[] = [
    {
      id: 'all',
      title: 'Complete Presentation Deck (All 6 Dashboards)',
      subtitle: 'Generates the full comprehensive boardroom slide deck ready for live executive presentation.',
      icon: Presentation,
      recommendedFor: 'Board Meetings & Leadership Reviews',
    },
    {
      id: 'executive_board',
      title: 'Executive C-Suite Board Briefing',
      subtitle: 'Top-line growth trajectory, run-rate velocity, variance vs budget targets, and strategic risks.',
      icon: Building2,
      recommendedFor: 'CEO, CRO & Board of Directors',
    },
    {
      id: 'product_cohort',
      title: 'Product, Funnel & Cohort Retention',
      subtitle: 'Multi-cohort retention curves, feature adoption depth, churn velocity, and user engagement tiers.',
      icon: Layers,
      recommendedFor: 'Head of Product & Growth Analytics',
    },
    {
      id: 'financial_margins',
      title: 'Financial Unit Economics & Margins',
      subtitle: 'LTV to CAC ratios, payback periods, direct servicing costs, and contribution margin breakdown.',
      icon: IndianRupee,
      recommendedFor: 'CFO, Finance Committee & Investors',
    },
    {
      id: 'operations_sla',
      title: 'Operations, Throughput & SLA Tracking',
      subtitle: 'Peak throughput load, latency distribution, contractual SLA compliance %, and capacity ceilings.',
      icon: Cpu,
      recommendedFor: 'VP Operations & Infrastructure Leads',
    },
    {
      id: 'customer_segmentation',
      title: 'Customer Segmentation & RFM Matrix',
      subtitle: 'Pareto champions vs dormant accounts, geographic density, and lifetime advocacy correlation.',
      icon: Users,
      recommendedFor: 'Marketing & Account Management',
    },
    {
      id: 'statistical_drilldown',
      title: 'Statistical Deep Drilldown & Outliers',
      subtitle: 'Parametric distributions, p-value sensitivity tests, and anomalous outlier isolation.',
      icon: Activity,
      recommendedFor: 'Data Scientists & Strategic Operations',
    },
  ];

  const handleToggleType = (typeId: AnalystDashboardType) => {
    if (typeId === 'all') {
      setSelectedTypes(['all']);
      return;
    }

    if (selectedTypes.includes('all')) {
      setSelectedTypes([typeId]);
      return;
    }

    if (selectedTypes.includes(typeId)) {
      const next = selectedTypes.filter(t => t !== typeId);
      setSelectedTypes(next.length === 0 ? ['all'] : next);
    } else {
      setSelectedTypes([...selectedTypes, typeId]);
    }
  };

  const isAllSelected = selectedTypes.includes('all');

  const handleExecuteGenerate = () => {
    onGenerate({
      selectedTypes,
      targetAudience,
      presentationFocus,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/40 backdrop-blur-xs font-sans animate-subtle-fade overflow-y-auto">
      <div className="w-full max-w-3xl rounded-xl border border-[#DDD4CA] bg-white text-[#292522] shadow-xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] my-4 sm:my-8">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#DDD4CA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#EEE7DE] flex items-center justify-center text-[#49362F] shrink-0">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#292522]">
                Generate Analyst Presentation Dashboards
              </h3>
              <p className="text-xs text-[#756D65] mt-0.5">
                Active Corpus: {profile.name} &bull; {rawRowCount.toLocaleString()} Records Profiling
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE] transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 text-xs flex-1">
          {/* Dashboard Type Selection */}
          <div>
            <label className="text-xs uppercase font-mono tracking-wider text-[#756D65] block mb-3 font-semibold">
              1. Select Presentation Modules:
            </label>

            <div className="space-y-2">
              {dashboardOptions.map(option => {
                const isSelected = isAllSelected || selectedTypes.includes(option.id);
                return (
                  <div
                    key={option.id}
                    onClick={() => handleToggleType(option.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-colors flex items-start gap-3 ${
                      isSelected
                        ? 'border-[#49362F] bg-[#49362F]/5 text-[#292522]'
                        : 'border-[#DDD4CA] bg-white hover:bg-[#F8F3EC] text-[#756D65]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                        isSelected
                          ? 'bg-[#49362F] border-[#49362F] text-white'
                          : 'border-[#DDD4CA] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#292522]">
                          {option.title}
                        </span>
                        <span className="text-[10px] text-[#756D65] font-mono hidden sm:inline">
                          {option.recommendedFor}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#756D65] mt-0.5">
                        {option.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#DDD4CA]">
            <div>
              <label className="text-xs uppercase font-mono tracking-wider text-[#756D65] block mb-1.5 font-semibold">
                2. Target Presentation Audience:
              </label>
              <select
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] text-[#292522] text-xs font-semibold focus:outline-none focus:border-[#49362F]"
              >
                <option value="Executive Board">Board of Directors & C-Suite</option>
                <option value="Department Leads">Department & Product Leads</option>
                <option value="Investors">Investors & Stakeholders</option>
                <option value="Cross-functional Teams">Cross-Functional Team All-Hands</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase font-mono tracking-wider text-[#756D65] block mb-1.5 font-semibold">
                3. Strategic Presentation Focus:
              </label>
              <select
                value={presentationFocus}
                onChange={e => setPresentationFocus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] text-[#292522] text-xs font-semibold focus:outline-none focus:border-[#49362F]"
              >
                <option value="Growth & Strategy">Growth Velocity & Trajectory</option>
                <option value="Efficiency & Cost">Cost Reduction & Unit Economics</option>
                <option value="Risk & Anomaly Mitigation">Risk, Outliers & Anomaly Mitigation</option>
                <option value="Comprehensive Overview">Comprehensive 360° Analyst Overview</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-[#DDD4CA] bg-[#F8F3EC] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#756D65] text-center sm:text-left">
            <span>Generates interactive presentation slides, charts &amp; speaker notes.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-lg border border-[#DDD4CA] text-xs font-semibold text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE] transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleExecuteGenerate}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Presentation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
