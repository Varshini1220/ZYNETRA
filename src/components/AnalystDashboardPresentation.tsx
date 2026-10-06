import { useState, useEffect, useRef } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Presentation,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Printer,
  Download,
  Copy,
  Check,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Building2,
  Layers,
  Activity,
  IndianRupee,
  Users,
  Cpu,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import { DatasetProfile } from '../types';
import { ThemeId } from '../types/theme';
import { THEME_DEFINITIONS } from '../utils/themeConfig';
import { AnalystPresentationDeck, AnalystPresentationSlide, AnalystDashboardType } from '../types/analystDashboard';

interface AnalystDashboardPresentationProps {
  deck: AnalystPresentationDeck;
  profile: DatasetProfile;
  rawRows?: Record<string, any>[];
  isDark?: boolean;
  currentTheme?: ThemeId;
  onRegenerateDeck: (type?: AnalystDashboardType) => void;
  onOpenUpload?: () => void;
}

export default function AnalystDashboardPresentation({
  deck,
  profile,
  rawRows: _rawRows = [],
  isDark: _isDark,
  currentTheme = 'indigo',
  onRegenerateDeck,
  onOpenUpload: _onOpenUpload,
}: AnalystDashboardPresentationProps) {
  const activeTheme = THEME_DEFINITIONS[currentTheme] || THEME_DEFINITIONS.indigo;

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(true);
  const [copiedNotes, setCopiedNotes] = useState(false);
  const [selectedDashboardFilter, setSelectedDashboardFilter] = useState<AnalystDashboardType>('all');
  const [customChartType, setCustomChartType] = useState<'default' | 'area' | 'bar' | 'line'>('default');

  // Presentation Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const presentationContainerRef = useRef<HTMLDivElement>(null);

  // Filter slides if specific persona is chosen
  const filteredSlides = selectedDashboardFilter === 'all'
    ? deck.slides
    : deck.slides.filter(s => s.type === selectedDashboardFilter);

  // Guard against index out of range
  const activeSlide: AnalystPresentationSlide =
    filteredSlides[currentSlideIndex] || filteredSlides[0] || deck.slides[0];

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, filteredSlides.length, isFullscreen]);

  const handleNextSlide = () => {
    if (currentSlideIndex < filteredSlides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    } else {
      setCurrentSlideIndex(0);
    }
    setCustomChartType('default');
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    } else {
      setCurrentSlideIndex(filteredSlides.length - 1);
    }
    setCustomChartType('default');
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (presentationContainerRef.current?.requestFullscreen) {
        presentationContainerRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
      setIsTimerRunning(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Copy Speaker Notes & Key Takeaways
  const handleCopySpeakerNotes = () => {
    if (!activeSlide) return;
    const textToCopy = `PRESENTATION SLIDE ${activeSlide.slideNumber}: ${activeSlide.title}
Audience: ${activeSlide.audience}
Dataset: ${profile.name} (v${profile.version})

KEY STAKEHOLDER TAKEAWAYS:
${activeSlide.stakeholderTakeaways.map(t => `• ${t}`).join('\n')}

PRESENTER TALKING POINTS (What to say):
${activeSlide.speakerNotes.keyTalkingPoint}

ANTICIPATED LEADERSHIP QUESTION:
Q: ${activeSlide.speakerNotes.anticipatedQuestion}
A: ${activeSlide.speakerNotes.recommendedAnswer}

RECOMMENDED ACTIONS:
${activeSlide.recommendedActions.map(a => `• ${a}`).join('\n')}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedNotes(true);
    setTimeout(() => setCopiedNotes(false), 2500);
  };

  // Standalone HTML Presentation Download
  const handleDownloadStandaloneHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${profile.name} - Executive Analyst Presentation</title>
  <style>
    body { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; background: #F5F0E9; color: #292522; padding: 40px; margin: 0; }
    .slide { max-width: 1000px; margin: 0 auto 60px auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #DDD4CA; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); page-break-after: always; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; background: #EEE7DE; color: #49362F; margin-right: 8px; font-family: monospace; }
    h1 { font-size: 26px; margin: 16px 0 6px 0; color: #292522; font-weight: bold; }
    .subtitle { color: #756D65; font-size: 14px; margin-bottom: 24px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
    .kpi-card { background: #F8F3EC; border: 1px solid #DDD4CA; border-radius: 8px; padding: 16px; }
    .kpi-label { font-size: 11px; text-transform: uppercase; color: #756D65; font-family: monospace; }
    .kpi-val { font-size: 24px; font-weight: bold; color: #292522; margin: 4px 0; }
    .takeaways { background: #E8EBE1; border-left: 3px solid #7B8570; padding: 16px; border-radius: 6px; margin-top: 20px; font-size: 13px; }
    .notes { background: #F8F3EC; border: 1px solid #DDD4CA; border-radius: 8px; padding: 16px; margin-top: 16px; font-size: 13px; font-style: italic; }
  </style>
</head>
<body>
  <div style="text-align: center; margin-bottom: 40px;">
    <h2 style="font-size: 28px; margin-bottom: 8px; color: #292522;">${profile.name} — Executive Analyst Presentation Deck</h2>
    <p style="color: #756D65; font-size: 13px;">Autonomously generated for ${deck.targetAudience} • Quality Score: ${profile.overallQualityScore}/100</p>
  </div>
  ${deck.slides.map(s => `
    <div class="slide">
      <span class="badge">Slide ${s.slideNumber} of ${deck.slides.length}</span>
      <span class="badge">${s.category}</span>
      <h1>${s.title}</h1>
      <div class="subtitle">${s.subtitle}</div>
      <div class="kpi-grid">
        ${s.kpis.map(k => `
          <div class="kpi-card">
            <div class="kpi-label">${k.label}</div>
            <div class="kpi-val">${k.value}</div>
            <div style="font-size: 12px; color: ${k.deltaType === 'positive' ? '#7B8570' : '#A56F5D'}; font-weight: 600;">${k.delta}</div>
          </div>
        `).join('')}
      </div>
      <div class="takeaways">
        <strong>Executive Takeaways:</strong>
        <ul>
          ${s.stakeholderTakeaways.map(t => `<li>${t}</li>`).join('')}
        </ul>
      </div>
      <div class="notes">
        <strong>Presenter Script:</strong> "${s.speakerNotes.keyTalkingPoint}"
      </div>
    </div>
  `).join('')}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Zynetra_Presentation_${profile.name.replace(/\s+/g, '_')}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine effective chart type (custom override or slide default)
  const effectiveChartType = customChartType !== 'default' ? customChartType : activeSlide.chartType;

  // Custom Chart Renderer with warm earthy tones
  const renderSlideChart = () => {
    const data = activeSlide.chartData;
    const xAxisKey = activeSlide.xAxisKey;
    const dataKeys = activeSlide.dataKeys;

    if (effectiveChartType === 'area') {
      return (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="analystAreaGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#49362F" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#49362F" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#EEE7DE" vertical={false} />
            <XAxis dataKey={xAxisKey} stroke="#756D65" fontSize={11} tickLine={false} />
            <YAxis stroke="#756D65" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#DDD4CA',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#292522',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            {dataKeys.map((dk, idx) => (
              <Area
                key={dk.key}
                type="monotone"
                dataKey={dk.key}
                name={dk.name}
                stroke={idx === 0 ? '#49362F' : '#A56F5D'}
                strokeWidth={2}
                fill={idx === 0 ? 'url(#analystAreaGrad1)' : 'transparent'}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    if (effectiveChartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EEE7DE" vertical={false} />
            <XAxis dataKey={xAxisKey} stroke="#756D65" fontSize={11} tickLine={false} />
            <YAxis stroke="#756D65" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#DDD4CA',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#292522',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            {dataKeys.map((dk, idx) => (
              <Line
                key={dk.key}
                type="monotone"
                dataKey={dk.key}
                name={dk.name}
                stroke={idx === 0 ? '#49362F' : '#A56F5D'}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    // Default: BarChart
    return (
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EEE7DE" vertical={false} />
          <XAxis dataKey={xAxisKey} stroke="#756D65" fontSize={11} tickLine={false} />
          <YAxis stroke="#756D65" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderColor: '#DDD4CA',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#292522',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          {dataKeys.map((dk, idx) => (
            <Bar
              key={dk.key}
              dataKey={dk.key}
              name={dk.name}
              fill={idx === 0 ? '#49362F' : '#A56F5D'}
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const personaOptions: { id: AnalystDashboardType; label: string; icon: any }[] = [
    { id: 'all', label: 'All Slides (Deck)', icon: Presentation },
    { id: 'executive_board', label: 'C-Suite Briefing', icon: Building2 },
    { id: 'product_cohort', label: 'Product & Cohorts', icon: Layers },
    { id: 'financial_margins', label: 'Finance & Unit Econ', icon: IndianRupee },
    { id: 'operations_sla', label: 'Ops & SLA Tracking', icon: Cpu },
    { id: 'customer_segmentation', label: 'Customer Clusters', icon: Users },
    { id: 'statistical_drilldown', label: 'Statistical Drilldown', icon: Activity },
  ];

  return (
    <div
      ref={presentationContainerRef}
      className={`space-y-8 font-sans text-[#292522] animate-subtle-fade ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#F5F0E9] p-8 overflow-y-auto'
          : ''
      }`}
    >
      {/* Top Banner / Generator Controls */}
      <div className="p-4 sm:p-7 rounded-xl border border-[#DDD4CA] bg-white shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#EEE7DE] flex items-center justify-center text-[#49362F] shrink-0 mt-0.5">
              <Presentation className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                <h2 className="text-lg sm:text-2xl font-bold text-[#292522]">
                  Boardroom Analyst Presentation Deck
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-mono tracking-wider text-[#49362F] bg-[#EEE7DE] border border-[#DDD4CA] font-semibold">
                  {deck.slides.length} Ready Slides
                </span>
                <span className="text-xs text-[#756D65]">
                  &bull; Corpus: <strong className="text-[#292522]">{profile.name}</strong>
                </span>
              </div>
              <p className="text-xs text-[#756D65] mt-1 leading-relaxed max-w-xl">
                Autonomously synthesized for immediate executive briefings, product reviews, and investor presentations.
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-start sm:justify-end">
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs"
              title="Launch Fullscreen Presentation Mode (Kiosk / Boardroom)"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isFullscreen ? 'Exit Mode' : 'Boardroom Mode'}</span>
            </button>

            <button
              onClick={handleCopySpeakerNotes}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-xs font-semibold text-[#292522] transition-colors"
              title="Copy current slide talking points & executive answers to clipboard"
            >
              {copiedNotes ? <Check className="w-3.5 h-3.5 text-[#7B8570]" /> : <Copy className="w-3.5 h-3.5 text-[#756D65]" />}
              <span>{copiedNotes ? 'Copied!' : 'Copy Script'}</span>
            </button>

            <button
              onClick={handleDownloadStandaloneHTML}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-xs font-semibold text-[#292522] transition-colors"
              title="Download offline-compatible HTML presentation deck"
            >
              <Download className="w-3.5 h-3.5 text-[#756D65]" />
              <span className="hidden sm:inline">Export HTML</span>
            </button>

            <button
              onClick={() => window.print()}
              className="p-2 rounded-lg border border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-[#756D65] transition-colors"
              title="Print / Save as PDF Presentation"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onRegenerateDeck()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-xs font-semibold text-[#292522] transition-colors"
              title="Re-synthesize presentation with updated statistics"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#756D65]" />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        {/* Persona Filter Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 sm:pt-5 mt-4 sm:mt-5 border-t border-[#DDD4CA] pb-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#756D65] pr-2 shrink-0">
            Analyst Lens:
          </span>
          {personaOptions.map(p => {
            const Icon = p.icon;
            const isSelected = selectedDashboardFilter === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedDashboardFilter(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#49362F] text-white font-semibold'
                    : 'text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Presentation View Container */}
      <div className="rounded-xl border border-[#DDD4CA] bg-white shadow-xs overflow-hidden">
        {/* Slide Navigation Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#DDD4CA] bg-[#F8F3EC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          {/* Slide Indicator & Metadata */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-[#EEE7DE] text-[#292522] border border-[#DDD4CA]">
              Slide {activeSlide.slideNumber} of {filteredSlides.length}
            </span>
            <div className="flex items-center gap-2 text-xs text-[#756D65] flex-wrap">
              <span className="uppercase font-mono tracking-wider font-semibold text-[#292522]">
                {activeSlide.category}
              </span>
              <span>&bull;</span>
              <span>
                Audience: <strong className="text-[#292522]">{activeSlide.audience}</strong>
              </span>
            </div>
          </div>

          {/* Slide Controls (Prev / Next & Presenter Timer) */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Timer */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg border border-[#DDD4CA] bg-white text-xs font-mono text-[#292522]">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="hover:text-[#49362F] transition-colors"
                title={isTimerRunning ? 'Pause timer' : 'Start timer'}
              >
                {isTimerRunning ? <Pause className="w-3 h-3 text-[#A56F5D]" /> : <Play className="w-3 h-3 text-[#7B8570]" />}
              </button>
              <span>{formatTimer(timerSeconds)}</span>
              <button
                onClick={() => { setTimerSeconds(0); setIsTimerRunning(false); }}
                className="text-[#756D65] hover:text-[#A56F5D] transition-colors ml-1"
                title="Reset timer"
              >
                <RotateCcw className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Slide Navigation Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevSlide}
                className="p-1.5 rounded-lg border border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-[#292522] transition-colors"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNextSlide}
                className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs"
                title="Next Slide"
              >
                <span>Next Slide</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Slide Body */}
        <div className="p-6 sm:p-8 space-y-7">
          {/* Slide Title & Subtitle */}
          <div>
            <h1 className="text-2xl sm:text-3xl text-[#292522] font-bold leading-tight tracking-tight">
              {activeSlide.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#756D65] mt-1.5">
              {activeSlide.subtitle}
            </p>
          </div>

          {/* KPI Stat Cards (4-column grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {activeSlide.kpis.map((kpi, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC] space-y-2 shadow-2xs"
              >
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#756D65]">
                  {kpi.label}
                </div>
                <div className="text-2xl sm:text-3xl text-[#292522] font-bold tabular-nums">
                  {kpi.value}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#DDD4CA]/60 text-xs">
                  <span
                    className={`font-semibold font-mono ${
                      kpi.deltaType === 'positive'
                        ? 'text-[#7B8570]'
                        : kpi.deltaType === 'negative'
                        ? 'text-[#A56F5D]'
                        : 'text-[#49362F]'
                    }`}
                  >
                    {kpi.delta}
                  </span>
                  {kpi.benchmark && (
                    <span className="text-[10px] text-[#756D65] font-mono">
                      {kpi.benchmark}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#756D65] leading-snug">
                  {kpi.description}
                </div>
              </div>
            ))}
          </div>

          {/* Main Chart Area */}
          <div className="p-6 rounded-xl border border-[#DDD4CA] bg-white shadow-2xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#292522]">
                  {activeSlide.chartTitle}
                </h3>
                <p className="text-xs text-[#756D65] mt-0.5">
                  {activeSlide.chartDescription}
                </p>
              </div>

              {/* Chart Switcher */}
              <div className="flex items-center gap-1 self-end sm:self-auto p-1 bg-[#F8F3EC] rounded-lg border border-[#DDD4CA]">
                <span className="text-[10px] font-mono text-[#756D65] uppercase px-1">View:</span>
                {(['bar', 'area', 'line'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setCustomChartType(type)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium uppercase transition-colors ${
                      effectiveChartType === type
                        ? 'bg-white text-[#292522] font-semibold shadow-xs'
                        : 'text-[#756D65] hover:text-[#292522]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts chart */}
            {renderSlideChart()}
          </div>

          {/* Two-Column Grid: Stakeholder Takeaways & Recommended Action Roadmap */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Executive Takeaways */}
            <div className="p-5 sm:p-6 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC] text-[#292522]">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-[#7B8570]" />
                <h4 className="text-base font-bold text-[#292522]">
                  Executive Stakeholder Takeaways
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-[#756D65] leading-relaxed">
                {activeSlide.stakeholderTakeaways.map((takeaway, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7B8570] mt-1.5 shrink-0" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Decisions & Next Steps */}
            <div className="p-5 sm:p-6 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC] text-[#292522]">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-[#A56F5D]" />
                <h4 className="text-base font-bold text-[#292522]">
                  Recommended Immediate Decision Actions
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-[#756D65] leading-relaxed">
                {activeSlide.recommendedActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A56F5D] mt-1.5 shrink-0" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Presenter Speaker Notes Drawer */}
          <div className="rounded-xl border border-[#DDD4CA] bg-white overflow-hidden shadow-2xs">
            <button
              onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#F8F3EC] transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-[#49362F]" />
                <span className="text-sm font-bold text-[#292522]">
                  Presenter Talking Points &amp; Boardroom Q&amp;A
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#EEE7DE] text-[#49362F] font-mono uppercase font-semibold">
                  Confidential Guidance
                </span>
              </div>
              <span className="text-xs text-[#756D65] font-medium">
                {showSpeakerNotes ? 'Hide Guide ▲' : 'Show Guide ▼'}
              </span>
            </button>

            {showSpeakerNotes && (
              <div className="px-6 pb-6 pt-2 border-t border-[#DDD4CA] space-y-4 text-xs leading-relaxed">
                <div>
                  <span className="font-semibold text-[#292522] block mb-1">
                    What to Say to Stakeholders (Exact Verbatim Script):
                  </span>
                  <p className="text-[#756D65] bg-[#F8F3EC] p-4 rounded-lg border border-[#DDD4CA]">
                    "{activeSlide.speakerNotes.keyTalkingPoint}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="bg-[#F8F3EC] p-4 rounded-lg border border-[#DDD4CA]">
                    <div className="text-[10px] font-mono uppercase text-[#A56F5D] mb-1 flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3 h-3" />
                      Anticipated Question from Leadership:
                    </div>
                    <p className="text-[#292522] font-medium">
                      "{activeSlide.speakerNotes.anticipatedQuestion}"
                    </p>
                  </div>

                  <div className="bg-[#F8F3EC] p-4 rounded-lg border border-[#DDD4CA]">
                    <div className="text-[10px] font-mono uppercase text-[#7B8570] mb-1 flex items-center gap-1 font-semibold">
                      <Check className="w-3 h-3" />
                      Recommended Evidence-Based Answer:
                    </div>
                    <p className="text-[#756D65]">
                      "{activeSlide.speakerNotes.recommendedAnswer}"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Slide Thumbnail Navigation Strip */}
        <div className="p-4 border-t border-[#DDD4CA] bg-[#F8F3EC] overflow-x-auto flex items-center gap-3">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#756D65] shrink-0 font-medium">
            Slide Index:
          </div>
          {filteredSlides.map((slide, idx) => {
            const isCurrent = idx === currentSlideIndex;
            return (
              <button
                key={slide.id}
                onClick={() => {
                  setCurrentSlideIndex(idx);
                  setCustomChartType('default');
                }}
                className={`px-3 py-2 rounded-lg text-left border transition-colors shrink-0 min-w-[140px] max-w-[180px] ${
                  isCurrent
                    ? 'bg-[#49362F] text-white border-[#49362F]'
                    : 'bg-white border-[#DDD4CA] text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
                }`}
              >
                <div className="text-[10px] font-mono opacity-70">
                  Slide {slide.slideNumber}
                </div>
                <div className="text-xs font-semibold truncate">
                  {slide.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
