import { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  HelpCircle,
  Lightbulb,
  Presentation,
  UploadCloud,
  FileDown,
  Printer,
  X,
} from 'lucide-react';
import { PredictionPoint, DatasetProfile } from '../types';
import { ThemeId } from '../types/theme';
import { THEME_DEFINITIONS } from '../utils/themeConfig';
import ExecutivePdfExportModal from './ExecutivePdfExportModal';

interface AutonomousDashboardProps {
  profile?: DatasetProfile;
  datasetName?: string;
  datasetVersion?: string;
  qualityScore?: number;
  objective?: string;
  kpis: { label: string; value: string; delta: string; deltaType: 'positive' | 'negative' | 'neutral'; description: string }[];
  forecastData: PredictionPoint[];
  breakdownData: { label: string; value: number; metric: number }[];
  heatmapData: { row: string; col: string; value: number }[];
  geoData: { region: string; revenue: number; risk: string; performance: number }[];
  isDark: boolean;
  currentTheme?: ThemeId;
  onOpenUpload?: () => void;
  onOpenGenerateDashboards?: () => void;
  isCustomDataset?: boolean;
  isExecutiveMode?: boolean;
  onNavigateTab?: (tab: any) => void;
  onOpenGlossary?: () => void;
}

export default function AutonomousDashboard({
  profile,
  datasetName = profile?.name || 'Global Enterprise SaaS Telemetry',
  datasetVersion = profile?.version || '1.1',
  qualityScore = profile?.overallQualityScore || 94,
  objective = 'Autonomous enterprise performance diagnostic and decision summary',
  kpis,
  forecastData,
  breakdownData,
  heatmapData,
  geoData,
  isDark = false,
  currentTheme = 'indigo',
  onOpenUpload,
  onOpenGenerateDashboards,
  isCustomDataset,
  isExecutiveMode: _isExecutiveMode = true,
  onNavigateTab,
  onOpenGlossary: _onOpenGlossary,
}: AutonomousDashboardProps) {
  const [selectedSegment] = useState<string>('All');
  const [activeDrilldown, setActiveDrilldown] = useState<string | null>(null);
  const [expandedChartHelp, setExpandedChartHelp] = useState<string | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  const activeTheme = THEME_DEFINITIONS[currentTheme || 'indigo'] || THEME_DEFINITIONS.indigo;

  const toggleChartHelp = (chartId: string) => {
    setExpandedChartHelp(prev => (prev === chartId ? null : chartId));
  };

  const filteredBreakdown = selectedSegment === 'All'
    ? breakdownData
    : breakdownData.filter(b => b.label.toLowerCase() === selectedSegment.toLowerCase());

  // Derive highest impact segment
  const topSegment = [...breakdownData].sort((a, b) => b.metric - a.metric)[0] || { label: 'Primary Cohort', metric: 0, value: 0 };

  return (
    <div className={`space-y-8 font-sans animate-subtle-fade transition-colors duration-200 ${
      isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'
    }`}>
      {/* Analyst Presentation Dashboards Callout Banner */}
      <div
        className={`p-6 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs transition-colors ${
          isDark
            ? 'border-[#3E352F] bg-[#26201D] text-[#EDE6DE]'
            : 'border-[#DDD4CA] bg-white text-[#292522]'
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
              isDark ? 'bg-[#322A26] text-white' : 'bg-[#EEE7DE] text-[#49362F]'
            }`}
            style={{ color: isDark ? activeTheme.primaryColor : undefined }}
          >
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-base font-bold">
                Boardroom Analyst Presentation Deck
              </span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-mono tracking-wider font-semibold border ${
                  isDark
                    ? 'border-[#3E352F] bg-[#211C19] text-[#EDE6DE]'
                    : 'border-[#DDD4CA] bg-[#EEE7DE] text-[#49362F]'
                }`}
                style={{ color: activeTheme.primaryColor }}
              >
                Deck Ready
              </span>
            </div>
            <p className={`text-xs mt-1 leading-relaxed max-w-xl ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
              Synthesize 6 executive presentation slides, cohort unit economics, customer segmentation matrices, and speaker notes directly from this active corpus.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto justify-end flex-wrap">
          {/* Export Formatted PDF Summary Button */}
          <button
            type="button"
            id="btn-banner-export-pdf"
            onClick={() => setIsPdfModalOpen(true)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all shadow-2xs hover:brightness-105 cursor-pointer whitespace-nowrap w-full sm:w-auto ${
              isDark
                ? 'border-[#3E352F] bg-[#211C19] hover:bg-[#2D2622] text-[#EDE6DE]'
                : 'border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-[#292522]'
            }`}
            title="Export current view and KPIs as a formatted PDF summary"
          >
            <FileDown className="w-3.5 h-3.5" style={{ color: activeTheme.primaryColor }} />
            <span>Export PDF Summary</span>
          </button>

          {onOpenGenerateDashboards && (
            <button
              onClick={onOpenGenerateDashboards}
              id="btn-banner-generate-dashboards"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-white text-xs font-semibold uppercase tracking-wider transition-all w-full sm:w-auto shadow-2xs hover:brightness-110"
              style={{ backgroundColor: activeTheme.primaryColor }}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Launch Presentation</span>
            </button>
          )}
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('presentations')}
              className={`px-4 py-2.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap hidden sm:inline-block ${
                isDark
                  ? 'border-[#3E352F] bg-[#211C19] hover:bg-[#2D2622] text-[#EDE6DE]'
                  : 'border-[#DDD4CA] bg-[#F8F3EC] hover:bg-[#EEE7DE] text-[#292522]'
              }`}
            >
              View Slide Deck
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Status / Upload Notice */}
      {!isCustomDataset ? (
        <div
          id="sample-dataset-notice-banner"
          className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-colors ${
            isDark ? 'border-[#3E352F] bg-[#26201D]' : 'border-[#DDD4CA] bg-[#F8F3EC]'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: activeTheme.primaryColor }}
            />
            <div>
              <span className={`font-semibold ${isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}`}>
                Active Benchmark Corpus:{' '}
              </span>
              <span className={isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}>
                Global Enterprise SaaS Growth &amp; Attrition Telemetry. Upload your own CSV or spreadsheet anytime.
              </span>
            </div>
          </div>
          {onOpenUpload && (
            <button
              onClick={onOpenUpload}
              id="btn-dashboard-upload"
              className={`flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg border font-semibold text-xs transition-colors shrink-0 w-full sm:w-auto ${
                isDark
                  ? 'border-[#3E352F] bg-[#211C19] hover:bg-[#2D2622] text-[#EDE6DE]'
                  : 'border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-[#292522]'
              }`}
            >
              <UploadCloud className={`w-3.5 h-3.5 ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`} />
              <span>Upload Custom Data</span>
            </button>
          )}
        </div>
      ) : (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs transition-colors ${
            isDark ? 'border-[#7B8570]/30 bg-[#212620]' : 'border-[#7B8570]/30 bg-[#E8EBE1]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7B8570]" />
            <span className={`font-semibold ${isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}`}>
              Custom Telemetry Loaded:
            </span>
            <span className={isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}>
              Autonomous feature correlations, causal root-cause tree, and forward projection derived from raw records.
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#7B8570] font-semibold">Heuristics Calibrated</span>
        </div>
      )}

      {/* KPI Section Header with Export PDF Quick Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pt-2">
        <div>
          <span
            className="text-[10px] uppercase font-mono tracking-widest font-semibold"
            style={{ color: activeTheme.primaryColor }}
          >
            Executive Telemetry
          </span>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight">
            Key Performance Indicators
          </h3>
        </div>

        <button
          type="button"
          id="btn-kpi-export-pdf"
          onClick={() => setIsPdfModalOpen(true)}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer w-full sm:w-auto ${
            isDark
              ? 'border-[#3E352F] bg-[#26201D] hover:bg-[#322A26] text-[#EDE6DE]'
              : 'border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-[#292522]'
          }`}
          title="Export current view and KPIs as a formatted PDF summary"
        >
          <FileDown className="w-3.5 h-3.5" style={{ color: activeTheme.primaryColor }} />
          <span>Export PDF Summary</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {kpis.map((kpi, idx) => {
          const isNegative = kpi.deltaType === 'negative';
          const isPositive = kpi.deltaType === 'positive';

          return (
            <div
              key={idx}
              className={`p-4 sm:p-6 rounded-xl border space-y-2.5 sm:space-y-3 shadow-xs transition-colors ${
                isDark
                  ? 'border-[#3E352F] bg-[#26201D] text-[#EDE6DE]'
                  : 'border-[#DDD4CA] bg-white text-[#292522]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[11px] uppercase font-mono tracking-wider truncate font-medium ${
                  isDark ? 'text-[#A3988E]' : 'text-[#756D65]'
                }`}>
                  {kpi.label}
                </span>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md font-mono ${
                  isPositive
                    ? isDark ? 'bg-[#7B8570]/20 text-[#96A588]' : 'bg-[#E8EBE1] text-[#7B8570]'
                    : isNegative
                    ? isDark ? 'bg-[#A56F5D]/20 text-[#C48C7B]' : 'bg-[#A56F5D]/10 text-[#A56F5D]'
                    : isDark ? 'bg-[#322A26] text-[#A3988E]' : 'bg-[#EEE7DE] text-[#756D65]'
                }`}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : isNegative ? <TrendingDown className="w-3 h-3" /> : null}
                  <span className="tabular-nums">{kpi.delta}</span>
                </span>
              </div>

              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold tabular-nums tracking-tight">
                {kpi.value}
              </div>
              <p className={`text-xs leading-relaxed pt-2 border-t ${
                isDark ? 'border-[#3E352F] text-[#A3988E]' : 'border-[#DDD4CA]/60 text-[#756D65]'
              }`}>
                {kpi.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Primary Visualizations Row: Time Series & Segment Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time-Series Trend Chart (2 Cols) */}
        <div
          className={`lg:col-span-2 p-4 sm:p-7 rounded-xl border flex flex-col justify-between shadow-xs transition-colors ${
            isDark
              ? 'border-[#3E352F] bg-[#26201D] text-[#EDE6DE]'
              : 'border-[#DDD4CA] bg-white text-[#292522]'
          }`}
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <span
                  className="text-[10px] uppercase font-mono tracking-widest font-semibold"
                  style={{ color: activeTheme.primaryColor }}
                >
                  Temporal Trajectory
                </span>
                <h3 className="text-xl sm:text-2xl font-bold mt-0.5">
                  Historical Trajectory &amp; Projected Corridor
                </h3>
                <p className={`text-xs mt-1 ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                  Tracks empirical recorded actuals alongside forward autonomous confidence intervals.
                </p>
              </div>

              <button
                onClick={() => toggleChartHelp('timeseries')}
                className={`text-xs flex items-center gap-1 font-medium transition-colors self-start sm:self-auto ${
                  isDark ? 'text-[#A3988E] hover:text-[#EDE6DE]' : 'text-[#756D65] hover:text-[#292522]'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{expandedChartHelp === 'timeseries' ? 'Hide Legend' : 'Legend'}</span>
              </button>
            </div>

            {/* Expandable "How to Read This" Guide */}
            {expandedChartHelp === 'timeseries' && (
              <div
                className={`mb-5 p-4 rounded-xl border text-xs space-y-2 ${
                  isDark ? 'bg-[#211C19] border-[#3E352F] text-[#A3988E]' : 'bg-[#F8F3EC] border-[#DDD4CA] text-[#756D65]'
                }`}
              >
                <div className={`font-semibold text-xs ${isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}`}>
                  Chart Interpretation:
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-0.5 shrink-0"
                    style={{ backgroundColor: activeTheme.primaryColor }}
                  />
                  <span><strong>Solid Line:</strong> Historical ground-truth records ({activeTheme.name}).</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-0.5 border-t-2 border-dashed shrink-0"
                    style={{ borderColor: activeTheme.secondaryColor }}
                  />
                  <span><strong>Dashed Line:</strong> Projected mean slope without intervention.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-0.5 border-t shrink-0 ${isDark ? 'border-[#3E352F]' : 'border-[#DDD4CA]'}`} />
                  <span><strong>Dotted Line:</strong> 95% statistical confidence corridors.</span>
                </div>
              </div>
            )}

            {/* Key Finding Callout */}
            <div
              className={`p-3.5 rounded-xl mb-5 border flex items-start gap-3 text-xs ${
                isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#F8F3EC]'
              }`}
            >
              <Lightbulb
                className="w-4 h-4 shrink-0 mt-0.5"
                style={{ color: activeTheme.primaryColor }}
              />
              <div>
                <span className={`font-semibold ${isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}`}>
                  Analytical Takeaway:{' '}
                </span>
                <span className={`leading-relaxed ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                  Trajectory remained stable until the recent cohort shift, where an accelerated downward deviation manifested. Autonomous projection suggests compounding variance without targeted remediation.
                </span>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-72 sm:h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="themePrimaryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeTheme.primaryColor} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={activeTheme.primaryColor} stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="themeSecondaryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeTheme.secondaryColor} stopOpacity={0.18} />
                      <stop offset="95%" stopColor={activeTheme.secondaryColor} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? '#322A26' : '#EEE7DE'}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke={isDark ? '#A3988E' : '#756D65'}
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke={isDark ? '#A3988E' : '#756D65'}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={val => (val >= 1000000 ? `₹${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `₹${(val / 1000).toFixed(0)}K` : val)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#26201D' : '#FFFFFF',
                      borderColor: isDark ? '#3E352F' : '#DDD4CA',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: isDark ? '#EDE6DE' : '#292522',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                    formatter={(val: any) => [typeof val === 'number' ? val.toLocaleString() : val, 'Value']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />
                  <Area
                    type="monotone"
                    dataKey="historical"
                    name="Recorded Actuals"
                    stroke={activeTheme.primaryColor}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#themePrimaryGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="forecast"
                    name="Autonomous Projection"
                    stroke={activeTheme.secondaryColor}
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#themeSecondaryGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="confidenceUpper"
                    name="95% Upper Bound"
                    stroke={isDark ? '#4E443C' : '#DDD4CA'}
                    strokeWidth={1}
                    strokeDasharray="2 2"
                    fill="none"
                  />
                  <Area
                    type="monotone"
                    dataKey="confidenceLower"
                    name="95% Lower Bound"
                    stroke={isDark ? '#4E443C' : '#DDD4CA'}
                    strokeWidth={1}
                    strokeDasharray="2 2"
                    fill="none"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Cohort / Category Distribution Bar Chart (1 Col) */}
        <div
          className={`p-4 sm:p-7 rounded-xl border flex flex-col justify-between shadow-xs transition-colors ${
            isDark
              ? 'border-[#3E352F] bg-[#26201D] text-[#EDE6DE]'
              : 'border-[#DDD4CA] bg-white text-[#292522]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span
                  className="text-[10px] uppercase font-mono tracking-widest font-semibold"
                  style={{ color: activeTheme.primaryColor }}
                >
                  Cohort Distribution
                </span>
                <h3 className="text-xl sm:text-2xl font-bold mt-0.5">
                  Segment Weight
                </h3>
              </div>

              <button
                onClick={() => toggleChartHelp('breakdown')}
                className={`text-xs flex items-center gap-1 font-medium transition-colors ${
                  isDark ? 'text-[#A3988E] hover:text-[#EDE6DE]' : 'text-[#756D65] hover:text-[#292522]'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Guide</span>
              </button>
            </div>

            {/* Expandable Guide */}
            {expandedChartHelp === 'breakdown' && (
              <div
                className={`mb-4 p-3 rounded-lg border text-xs ${
                  isDark ? 'border-[#3E352F] bg-[#211C19] text-[#A3988E]' : 'border-[#DDD4CA] bg-[#F8F3EC] text-[#756D65]'
                }`}
              >
                <span className={`font-semibold ${isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}`}>
                  Cohort Diagnostics:{' '}
                </span>
                Click any bar to isolate and drill down into sub-segment performance.
              </div>
            )}

            {/* Takeaway Box */}
            <div
              className={`p-3.5 rounded-lg mb-5 border flex items-start gap-2.5 text-xs ${
                isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#F8F3EC]'
              }`}
            >
              <Lightbulb
                className="w-4 h-4 shrink-0 mt-0.5"
                style={{ color: activeTheme.primaryColor }}
              />
              <div>
                <span className={`font-semibold ${isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}`}>
                  {topSegment.label} Core:{' '}
                </span>
                <span className={isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}>
                  Represents dominant volume. Targeted remediation here yields maximum leverage.
                </span>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredBreakdown} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? '#322A26' : '#EEE7DE'}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    stroke={isDark ? '#A3988E' : '#756D65'}
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke={isDark ? '#A3988E' : '#756D65'}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#26201D' : '#FFFFFF',
                      borderColor: isDark ? '#3E352F' : '#DDD4CA',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: isDark ? '#EDE6DE' : '#292522',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                    formatter={(val: any, name: any) => [
                      name === 'metric' && val > 1000 ? `₹${val.toLocaleString()}` : val.toLocaleString(),
                      name === 'value' ? 'Entity Count' : 'Financial Impact (₹)',
                    ]}
                  />
                  <Bar
                    dataKey="value"
                    name="Volume Count"
                    fill={activeTheme.primaryColor}
                    radius={[4, 4, 0, 0]}
                    onClick={(data: any) => data && data.label && setActiveDrilldown(data.label)}
                    className="cursor-pointer hover:opacity-85 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Visualizations: Correlation Heatmap & Regional Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Correlation Heatmap */}
        <div
          className={`p-4 sm:p-7 rounded-xl border shadow-xs transition-colors ${
            isDark ? 'border-[#3E352F] bg-[#26201D] text-[#EDE6DE]' : 'border-[#DDD4CA] bg-white text-[#292522]'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <span
                className="text-[10px] uppercase font-mono tracking-widest font-semibold"
                style={{ color: activeTheme.primaryColor }}
              >
                Multivariate Dependencies
              </span>
              <h3 className="text-xl sm:text-2xl font-bold mt-0.5">
                Feature Correlation Matrix
              </h3>
            </div>
            <button
              onClick={() => toggleChartHelp('heatmap')}
              className={`text-xs flex items-center gap-1 font-medium transition-colors ${
                isDark ? 'text-[#A3988E] hover:text-[#EDE6DE]' : 'text-[#756D65] hover:text-[#292522]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Guide</span>
            </button>
          </div>

          <div
            className={`p-3.5 rounded-lg mb-5 border flex items-start gap-2.5 text-xs ${
              isDark ? 'border-[#3E352F] bg-[#211C19] text-[#A3988E]' : 'border-[#DDD4CA] bg-[#F8F3EC] text-[#756D65]'
            }`}
          >
            <Lightbulb
              className="w-4 h-4 shrink-0 mt-0.5"
              style={{ color: activeTheme.primaryColor }}
            />
            <div>
              <span className={`font-semibold ${isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}`}>
                Reading Correlations:{' '}
              </span>
              <span>
                Positive (+) indicates co-directional movement; Negative (-) reveals inverse trade-offs.
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            {heatmapData.map((item, idx) => {
              const isPositive = item.value >= 0;
              const absVal = Math.abs(item.value);

              return (
                <div
                  key={idx}
                  className={`flex flex-wrap sm:flex-nowrap items-center justify-between p-2.5 sm:p-3 rounded-lg border text-xs gap-2 transition-colors ${
                    isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#F8F3EC]/50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 truncate max-w-[190px] sm:max-w-none">
                    <span className={`font-semibold truncate ${isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}`}>
                      {item.row}
                    </span>
                    <span className={isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}>&harr;</span>
                    <span className={`truncate ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>{item.col}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto sm:ml-0">
                    <div className={`w-16 sm:w-24 rounded-full h-1.5 overflow-hidden ${isDark ? 'bg-[#322A26]' : 'bg-[#EEE7DE]'}`}>
                      <div
                        className={`h-full rounded-full ${isPositive ? 'bg-[#7B8570]' : 'bg-[#A56F5D]'}`}
                        style={{ width: `${absVal * 100}%` }}
                      />
                    </div>
                    <span className={`font-mono text-xs font-semibold tabular-nums w-12 text-right ${
                      isPositive ? 'text-[#7B8570]' : 'text-[#A56F5D]'
                    }`}>
                      {isPositive ? `+${item.value.toFixed(2)}` : item.value.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Regional / Geographic Performance */}
        <div
          className={`p-4 sm:p-7 rounded-xl border shadow-xs transition-colors ${
            isDark ? 'border-[#3E352F] bg-[#26201D] text-[#EDE6DE]' : 'border-[#DDD4CA] bg-white text-[#292522]'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <span
                className="text-[10px] uppercase font-mono tracking-widest font-semibold"
                style={{ color: activeTheme.primaryColor }}
              >
                Territorial Density
              </span>
              <h3 className="text-xl sm:text-2xl font-bold mt-0.5">
                Regional Performance Matrix
              </h3>
            </div>
          </div>

          <div
            className={`p-3.5 rounded-lg mb-5 border text-xs ${
              isDark ? 'border-[#3E352F] bg-[#211C19] text-[#A3988E]' : 'border-[#DDD4CA] bg-[#F8F3EC] text-[#756D65]'
            }`}
          >
            <span>Tracks regional variance distribution and associated risk postures across fulfillment zones.</span>
          </div>

          <div className="space-y-3">
            {geoData.map((geo, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border flex items-center justify-between text-xs transition-colors ${
                  isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-white'
                }`}
              >
                <div>
                  <div className={`font-bold text-sm ${isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}`}>
                    {geo.region}
                  </div>
                  <div className={`text-[11px] mt-0.5 font-mono ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                    Performance Index: {geo.performance}% &bull; Risk: {geo.risk}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold tabular-nums ${isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}`}>
                    ₹{(geo.revenue / 1000).toFixed(0)}K
                  </div>
                  <span className={`text-[10px] uppercase font-mono tracking-wider font-semibold ${
                    geo.risk === 'Low' ? 'text-[#7B8570]' : geo.risk === 'Medium' ? 'text-[#6A5045]' : 'text-[#A56F5D]'
                  }`}>
                    {geo.risk} Risk Profile
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drilldown Modal (When clicking a bar) */}
      {activeDrilldown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div
            className={`max-w-md w-full rounded-xl border p-6 shadow-xl ${
              isDark ? 'border-[#3E352F] bg-[#26201D] text-[#EDE6DE]' : 'border-[#DDD4CA] bg-white text-[#292522]'
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-3 mb-4 ${isDark ? 'border-[#3E352F]' : 'border-[#DDD4CA]'}`}>
              <h4 className="text-lg font-bold">Cohort Diagnostic: {activeDrilldown}</h4>
              <button
                onClick={() => setActiveDrilldown(null)}
                className={isDark ? 'text-[#A3988E] hover:text-[#EDE6DE]' : 'text-[#756D65] hover:text-[#292522]'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
              Detailed statistical profile for cohort '{activeDrilldown}'. Variance is isolated to response delay and SLA adherence metrics.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setActiveDrilldown(null)}
                className="px-4 py-2 rounded-lg text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs"
                style={{ backgroundColor: activeTheme.primaryColor }}
              >
                Close Diagnostic
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formatted Executive PDF Summary Export Modal */}
      <ExecutivePdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        profile={profile}
        datasetName={datasetName}
        datasetVersion={datasetVersion}
        qualityScore={qualityScore}
        objective={objective}
        kpis={kpis}
        forecastData={forecastData}
        breakdownData={breakdownData}
        heatmapData={heatmapData}
        geoData={geoData}
        isDark={isDark}
        currentTheme={currentTheme}
      />
    </div>
  );
}
