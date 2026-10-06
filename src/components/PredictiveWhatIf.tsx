import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Sliders,
  RotateCcw,
  HelpCircle,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { PredictionPoint, WhatIfScenario } from '../types';
import { ThemeId } from '../types/theme';
import { calculateWhatIf } from '../utils/dataProcessor';

interface PredictiveWhatIfProps {
  forecastData: PredictionPoint[];
  kpis: { label: string; value: string; delta: string; deltaType: 'positive' | 'negative' | 'neutral'; description: string }[];
  isDark?: boolean;
  currentTheme?: ThemeId;
  onNavigateTab?: (tab: any) => void;
}

export default function PredictiveWhatIf({
  forecastData,
  kpis,
  isDark: _isDark,
  currentTheme: _currentTheme = 'indigo',
  onNavigateTab,
}: PredictiveWhatIfProps) {
  const [scenario, setScenario] = useState<WhatIfScenario>({
    priceAdjustment: 0,
    marketingSpend: 15,
    retentionEffort: 40,
    slaTarget: 95,
  });
  const [showHowToRead, setShowHowToRead] = useState(false);

  const simulation = useMemo(() => {
    return calculateWhatIf(kpis, scenario);
  }, [kpis, scenario]);

  const resetScenario = () => {
    setScenario({
      priceAdjustment: 0,
      marketingSpend: 0,
      retentionEffort: 0,
      slaTarget: 90,
    });
  };

  // Generate comparison simulation data points for the chart
  const simulatedChartData = useMemo(() => {
    return forecastData.map(pt => {
      if (!pt.forecast) return pt;
      const boost = (scenario.retentionEffort * 0.003) + (scenario.marketingSpend * 0.002) + (scenario.priceAdjustment * 0.004);
      return {
        ...pt,
        simulated: Math.round(pt.forecast * (1 + boost)),
      };
    });
  }, [forecastData, scenario]);

  return (
    <div className="space-y-8 font-sans text-[#292522] animate-subtle-fade">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-[#DDD4CA] pb-5 sm:pb-6">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#49362F] font-semibold">
            Prescriptive Simulation
          </span>
          <h3 className="text-xl sm:text-3xl font-bold text-[#292522] mt-1">
            Predictive Sandbox &amp; What-If Scenario Simulator
          </h3>
          <p className="text-xs text-[#756D65] mt-1">
            Test the financial and operational impact of business adjustments prior to capital allocation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <button
            onClick={() => setShowHowToRead(!showHowToRead)}
            className="text-xs text-[#756D65] hover:text-[#292522] font-semibold flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHowToRead ? 'Hide Guide' : 'How this works'}</span>
          </button>
          <button
            onClick={resetScenario}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDD4CA] hover:bg-[#EEE7DE] bg-white text-xs font-semibold text-[#292522] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#756D65]" />
            <span>Reset Levers</span>
          </button>
        </div>
      </div>

      {/* Expandable Guide */}
      {showHowToRead && (
        <div className="p-4 sm:p-6 rounded-xl bg-white border border-[#DDD4CA] text-xs space-y-2 shadow-xs">
          <div className="text-sm font-bold text-[#292522]">How to use the What-If Sandbox:</div>
          <p className="text-[#756D65] leading-relaxed">
            Adjust the calibrated sliders on the left to simulate strategic decisions (e.g. allocating retention capital, testing price elasticity, or speeding up customer service SLAs). The scorecards and chart update in real time to show projected revenues and cohort retention.
          </p>
        </div>
      )}

      {/* Reactive Simulation Outcome Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        <div className="p-4 sm:p-6 rounded-xl border border-[#DDD4CA] bg-white space-y-2 shadow-xs">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#756D65]">Simulated Revenue</div>
          <div className="text-2xl sm:text-3xl text-[#292522] font-bold tabular-nums">{simulation.projectedRevenue}</div>
          <div className="text-xs font-mono font-semibold text-[#7B8570] tabular-nums">
            {simulation.projectedRevenueDelta} vs baseline
          </div>
        </div>

        <div className="p-4 sm:p-6 rounded-xl border border-[#DDD4CA] bg-white space-y-2 shadow-xs">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#756D65]">Simulated Churn Rate</div>
          <div className="text-2xl sm:text-3xl text-[#292522] font-bold tabular-nums">{simulation.projectedChurnRate}</div>
          <div className="text-xs font-mono font-semibold text-[#7B8570] tabular-nums">
            {simulation.projectedChurnDelta} improvement
          </div>
        </div>

        <div className="p-4 sm:p-6 rounded-xl border border-[#DDD4CA] bg-white space-y-2 shadow-xs">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#756D65]">Simulated Gross Margin</div>
          <div className="text-2xl sm:text-3xl text-[#292522] font-bold tabular-nums">{simulation.projectedGrossMargin}</div>
          <div className="text-xs text-[#756D65]">Includes operational cost</div>
        </div>

        <div className="p-4 sm:p-6 rounded-xl border border-[#DDD4CA] bg-white space-y-2 shadow-xs">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#756D65]">Estimated ROI Multiple</div>
          <div className="text-2xl sm:text-3xl text-[#292522] font-bold tabular-nums">{simulation.estimatedRoiRatio}</div>
          <div className="text-xs text-[#756D65]">Payback in 45 days</div>
        </div>
      </div>

      {/* Simulation Takeaway */}
      <div className="p-4 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC] flex items-start gap-3 text-xs">
        <Lightbulb className="w-4 h-4 text-[#A56F5D] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#292522]">Simulation Takeaway: </span>
          <span className="text-[#756D65] leading-relaxed">
            With <strong>Retention Effort set to +{scenario.retentionEffort}%</strong> and <strong>SLA target at {scenario.slaTarget}%</strong>, the model projects recovering <strong>{simulation.projectedRevenueDelta}</strong> in annual value while driving churn down to <strong>{simulation.projectedChurnRate}</strong>.
          </span>
        </div>
      </div>

      {/* Sliders and Visual Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders Controls (1 Col) */}
        <div className="p-6 rounded-xl border border-[#DDD4CA] bg-white space-y-6 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-[#DDD4CA]">
            <Sliders className="w-4 h-4 text-[#756D65]" />
            <h4 className="text-base font-bold text-[#292522]">Simulation Levers</h4>
          </div>

          {/* Lever 1: Price Adjustment */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[#292522]">Price Adjustment (%):</span>
              <span className="font-mono font-semibold text-[#292522] tabular-nums">
                {scenario.priceAdjustment > 0 ? `+${scenario.priceAdjustment}%` : `${scenario.priceAdjustment}%`}
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="30"
              step="1"
              value={scenario.priceAdjustment}
              onChange={e => setScenario(prev => ({ ...prev, priceAdjustment: Number(e.target.value) }))}
              className="w-full accent-[#49362F] cursor-pointer"
            />
            <p className="text-[11px] text-[#756D65]">Tests price elasticity vs customer churn risk.</p>
          </div>

          {/* Lever 2: Marketing Spend */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[#292522]">Growth Budget (%):</span>
              <span className="font-mono font-semibold text-[#292522] tabular-nums">+{scenario.marketingSpend}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={scenario.marketingSpend}
              onChange={e => setScenario(prev => ({ ...prev, marketingSpend: Number(e.target.value) }))}
              className="w-full accent-[#49362F] cursor-pointer"
            />
            <p className="text-[11px] text-[#756D65]">Expands top-of-funnel customer acquisition.</p>
          </div>

          {/* Lever 3: Retention Effort */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[#292522]">Retention &amp; CSM Squad (%):</span>
              <span className="font-mono font-semibold text-[#292522] tabular-nums">+{scenario.retentionEffort}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="5"
              value={scenario.retentionEffort}
              onChange={e => setScenario(prev => ({ ...prev, retentionEffort: Number(e.target.value) }))}
              className="w-full accent-[#49362F] cursor-pointer"
            />
            <p className="text-[11px] text-[#756D65]">Dedicated onboarding and proactive account intervention.</p>
          </div>

          {/* Lever 4: SLA Target */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[#292522]">Support SLA Target (%):</span>
              <span className="font-mono font-semibold text-[#292522] tabular-nums">{scenario.slaTarget}%</span>
            </div>
            <input
              type="range"
              min="80"
              max="99"
              step="1"
              value={scenario.slaTarget}
              onChange={e => setScenario(prev => ({ ...prev, slaTarget: Number(e.target.value) }))}
              className="w-full accent-[#49362F] cursor-pointer"
            />
            <p className="text-[11px] text-[#756D65]">Guarantees faster response times to reduce customer friction.</p>
          </div>
        </div>

        {/* Chart Comparison (2 Cols) */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-xl border border-[#DDD4CA] bg-white flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#49362F] font-semibold">
                  Sensitivity Curve
                </span>
                <h4 className="text-xl sm:text-2xl font-bold text-[#292522] mt-0.5">
                  Status Quo vs Simulated Intervention Trajectory
                </h4>
                <p className="text-xs text-[#756D65] mt-1">
                  Muted sage line reflects simulated outcomes based on adjusted operational levers.
                </p>
              </div>
            </div>

            <div className="h-72 sm:h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={simulatedChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEE7DE" vertical={false} />
                  <XAxis dataKey="date" stroke="#756D65" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#756D65"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={val => (val >= 1000000 ? `₹${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `₹${(val / 1000).toFixed(0)}K` : val)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#DDD4CA',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#292522',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    }}
                    formatter={(val: any) => [typeof val === 'number' ? `₹${val.toLocaleString()}` : val, 'Trajectory']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line
                    type="monotone"
                    dataKey="historical"
                    name="Actual Recorded"
                    stroke="#49362F"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    name="Status Quo (No Action)"
                    stroke="#A56F5D"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="simulated"
                    name="Simulated Outcome"
                    stroke="#7B8570"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Guided Next Step Banner */}
      {onNavigateTab && (
        <div className="p-6 rounded-xl border border-[#DDD4CA] bg-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div>
            <div className="text-xs font-bold text-[#292522] flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-mono tracking-wider bg-[#EEE7DE] text-[#49362F] font-semibold border border-[#DDD4CA]">
                Prescriptive Next Step
              </span>
              <span>Review prioritized action recommendations</span>
            </div>
            <p className="text-xs text-[#756D65] mt-1">
              Turn simulated projections into concrete, assigned implementation roadmaps.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('decisions')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 shadow-2xs"
          >
            <span>Review Prioritized Decisions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
