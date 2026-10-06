import React, { useState } from 'react';
import {
  X,
  FileDown,
  Printer,
  Check,
  TrendingUp,
  TrendingDown,
  Building2,
  Calendar,
  ShieldCheck,
  Sliders,
  Sparkles,
  FileText,
} from 'lucide-react';
import { DatasetProfile, PredictionPoint } from '../types';
import { ThemeId } from '../types/theme';
import { THEME_DEFINITIONS } from '../utils/themeConfig';
import { generateExecutiveDashboardPdf } from '../utils/executivePdfGenerator';

interface ExecutivePdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: DatasetProfile;
  datasetName?: string;
  datasetVersion?: string;
  qualityScore?: number;
  objective?: string;
  kpis: {
    label: string;
    value: string;
    delta: string;
    deltaType: 'positive' | 'negative' | 'neutral';
    description: string;
  }[];
  forecastData: PredictionPoint[];
  breakdownData: { label: string; value: number; metric: number }[];
  heatmapData: { row: string; col: string; value: number }[];
  geoData: { region: string; revenue: number; risk: string; performance: number }[];
  isDark?: boolean;
  currentTheme?: ThemeId;
}

export default function ExecutivePdfExportModal({
  isOpen,
  onClose,
  profile,
  datasetName = profile?.name || 'Enterprise Telemetry',
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
}: ExecutivePdfExportModalProps) {
  const [authorName, setAuthorName] = useState('Executive Analytics Office');
  const [includeBreakdown, setIncludeBreakdown] = useState(true);
  const [includeGeoData, setIncludeGeoData] = useState(true);
  const [includeCorrelations, setIncludeCorrelations] = useState(true);
  const [customTakeaway, setCustomTakeaway] = useState(
    'Observed trajectories indicate healthy baseline stability with isolated variance in mid-tier customer cohorts. Targeted automated remediation is projected to restore expected growth boundaries within 60 days.'
  );
  const [isExporting, setIsExporting] = useState(false);
  const [hasExported, setHasExported] = useState(false);

  const activeTheme = THEME_DEFINITIONS[currentTheme || 'indigo'] || THEME_DEFINITIONS.indigo;

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    setIsExporting(true);
    try {
      generateExecutiveDashboardPdf({
        profile,
        datasetName,
        datasetVersion,
        qualityScore,
        objective,
        kpis,
        forecastData,
        breakdownData,
        heatmapData,
        geoData,
        theme: activeTheme,
        authorName,
        includeBreakdown,
        includeGeoData,
        includeCorrelations,
        customNotes: customTakeaway,
      });

      setHasExported(true);
      setTimeout(() => setHasExported(false), 3500);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto animate-subtle-fade font-sans">
      <div
        className={`relative w-full max-w-4xl rounded-2xl border shadow-2xl flex flex-col my-4 sm:my-8 max-h-[92vh] sm:max-h-[90vh] overflow-hidden ${
          isDark
            ? 'border-[#3E352F] bg-[#211C19] text-[#EDE6DE]'
            : 'border-[#DDD4CA] bg-white text-[#292522]'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-4 sm:p-6 border-b flex items-center justify-between gap-3 sm:gap-4 ${
            isDark ? 'border-[#3E352F] bg-[#26201D]' : 'border-[#DDD4CA] bg-[#F8F3EC]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0"
              style={{ backgroundColor: activeTheme.primaryColor }}
            >
              <FileDown className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold leading-tight">
                  Export Executive PDF Summary
                </h3>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${activeTheme.primaryColor}20`,
                    color: activeTheme.primaryColor,
                  }}
                >
                  Formatted Document
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                Generate a formatted, boardroom-ready PDF summary of the current Executive Dashboard and KPIs.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-lg border transition-colors cursor-pointer shrink-0 ${
              isDark
                ? 'border-[#3E352F] hover:bg-[#322A26] text-[#A3988E]'
                : 'border-[#DDD4CA] hover:bg-[#EEE7DE] text-[#756D65]'
            }`}
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Split View (Options on Left, Live Preview on Right) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Options & Document Configuration (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div
              className={`p-4 rounded-xl border space-y-3 ${
                isDark ? 'border-[#3E352F] bg-[#26201D]' : 'border-[#DDD4CA] bg-[#F8F3EC]/70'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase font-mono tracking-wider">
                <Sliders className="w-3.5 h-3.5" style={{ color: activeTheme.primaryColor }} />
                <span>Document Parameters</span>
              </div>

              <div>
                <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                  Prepared By / Author
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className={`w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none ${
                    isDark
                      ? 'border-[#3E352F] bg-[#181513] text-[#EDE6DE]'
                      : 'border-[#DDD4CA] bg-white text-[#292522]'
                  }`}
                  placeholder="e.g. Executive Analytics Office"
                />
              </div>

              <div>
                <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                  Executive Takeaway / Commentary
                </label>
                <textarea
                  rows={3}
                  value={customTakeaway}
                  onChange={(e) => setCustomTakeaway(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none resize-none leading-relaxed ${
                    isDark
                      ? 'border-[#3E352F] bg-[#181513] text-[#EDE6DE]'
                      : 'border-[#DDD4CA] bg-white text-[#292522]'
                  }`}
                  placeholder="Add custom analytical conclusions or guidance for the board..."
                />
              </div>

              <div className="pt-2 border-t space-y-2" style={{ borderColor: isDark ? '#3E352F' : '#DDD4CA' }}>
                <span className={`block text-[11px] font-semibold ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                  Included Sections:
                </span>

                <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeBreakdown}
                    onChange={(e) => setIncludeBreakdown(e.target.checked)}
                    className="rounded accent-[#49362F] w-4 h-4 cursor-pointer"
                  />
                  <span>Cohort Segmentation & Volume Impact</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeGeoData}
                    onChange={(e) => setIncludeGeoData(e.target.checked)}
                    className="rounded accent-[#49362F] w-4 h-4 cursor-pointer"
                  />
                  <span>Territorial & Regional Performance Matrix</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeCorrelations}
                    onChange={(e) => setIncludeCorrelations(e.target.checked)}
                    className="rounded accent-[#49362F] w-4 h-4 cursor-pointer"
                  />
                  <span>Autonomous Feature Dependencies</span>
                </label>
              </div>
            </div>

            {/* Quick Export Tips */}
            <div
              className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                isDark ? 'border-[#3E352F] bg-[#181513] text-[#A3988E]' : 'border-[#DDD4CA] bg-[#F5F0E9] text-[#756D65]'
              }`}
            >
              <div className="flex items-center gap-1.5 font-semibold text-[#292522] dark:text-[#EDE6DE]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#7B8570]" />
                <span>Deterministic Attestation</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                PDF export includes 95% statistical confidence corridors, audit quality stamp, and formatted KPI cards matched to the active <strong>{activeTheme.name}</strong> palette.
              </p>
            </div>
          </div>

          {/* Live Document Preview (7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className={`font-mono uppercase tracking-wider font-semibold text-[11px] ${
                isDark ? 'text-[#A3988E]' : 'text-[#756D65]'
              }`}>
                Document Sheet Preview (A4 Formatted)
              </span>
              <span className="font-mono text-[10px] text-[#7B8570] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7B8570]" />
                Ready to Print
              </span>
            </div>

            {/* Simulated Paper Document Container */}
            <div
              className="rounded-xl border p-5 bg-[#FAF7F2] text-[#292522] shadow-inner space-y-4 max-h-[460px] overflow-y-auto text-xs"
              style={{
                borderColor: isDark ? '#3E352F' : '#DDD4CA',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              {/* Paper Top Banner */}
              <div
                className="p-3.5 rounded-lg text-white flex items-center justify-between"
                style={{ backgroundColor: activeTheme.primaryColor }}
              >
                <div>
                  <div className="font-bold text-sm tracking-wider">ZYNETRA</div>
                  <div className="text-[9px] opacity-90 tracking-tight">AUTONOMOUS EXECUTIVE INTELLIGENCE</div>
                </div>
                <div className="text-right">
                  <div className="text-[8px] font-mono uppercase tracking-wider opacity-80">CONFIDENTIAL</div>
                  <div className="text-[9px] font-mono font-bold">BOARD BRIEFING</div>
                </div>
              </div>

              {/* Title & Metadata */}
              <div>
                <h4 className="text-base font-bold text-[#292522]">Executive Performance &amp; KPI Summary</h4>
                <div className="text-[10px] text-[#756D65] flex items-center gap-2 mt-0.5 font-mono">
                  <span>Corpus: {datasetName} (v{datasetVersion})</span>
                  <span>&bull;</span>
                  <span>Quality: {qualityScore}/100</span>
                  <span>&bull;</span>
                  <span>By: {authorName}</span>
                </div>
              </div>

              {/* KPI Scorecard Preview (2x2 Grid) */}
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#756D65] mb-1.5">
                  Primary KPI Scorecard
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {kpis.slice(0, 4).map((kpi, idx) => {
                    const isPositive = kpi.deltaType === 'positive';
                    const isNegative = kpi.deltaType === 'negative';
                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-md border border-[#DDD4CA] bg-white space-y-1 relative overflow-hidden"
                      >
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1"
                          style={{ backgroundColor: activeTheme.primaryColor }}
                        />
                        <div className="flex items-center justify-between text-[9px] font-mono text-[#756D65]">
                          <span className="truncate pr-1">{kpi.label}</span>
                          <span
                            className={`font-bold ${
                              isPositive ? 'text-[#2E6F40]' : isNegative ? 'text-[#C25E3E]' : 'text-[#756D65]'
                            }`}
                          >
                            {kpi.delta}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-[#292522] tabular-nums">
                          {kpi.value}
                        </div>
                        <p className="text-[8px] text-[#756D65] line-clamp-1">
                          {kpi.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trajectory Table Preview */}
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#756D65] mb-1.5">
                  Trajectory &amp; Forward Corridor
                </div>
                <div className="border border-[#DDD4CA] rounded-md overflow-hidden text-[9px]">
                  <div className="grid grid-cols-4 bg-[#EEE7DE] p-1.5 font-bold font-mono text-[#49362F]">
                    <div>Period</div>
                    <div>Recorded</div>
                    <div>Forecast</div>
                    <div>95% CI</div>
                  </div>
                  {forecastData.slice(-3).map((pt, i) => (
                    <div key={i} className="grid grid-cols-4 p-1.5 border-t border-[#DDD4CA]/60 bg-white">
                      <div>{pt.date}</div>
                      <div>{pt.historical ? `₹${(pt.historical / 1000).toFixed(0)}K` : '—'}</div>
                      <div>{pt.forecast ? `₹${(pt.forecast / 1000).toFixed(0)}K` : '—'}</div>
                      <div className="text-[8px] text-[#756D65]">
                        {pt.confidenceLower ? `₹${(pt.confidenceLower / 1000).toFixed(0)}K+` : '—'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Executive Takeaway Box Preview */}
              <div className="p-2.5 rounded-md border border-[#DDD4CA] bg-white space-y-1">
                <span
                  className="text-[9px] font-bold font-mono uppercase tracking-wider block"
                  style={{ color: activeTheme.primaryColor }}
                >
                  Executive Analytical Takeaway
                </span>
                <p className="text-[9px] text-[#49362F] leading-relaxed">
                  {customTakeaway}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div
          className={`p-4 sm:p-5 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isDark ? 'border-[#3E352F] bg-[#26201D]' : 'border-[#DDD4CA] bg-[#F8F3EC]'
          }`}
        >
          <div className="flex items-center gap-2 text-xs">
            {hasExported ? (
              <span className="flex items-center gap-1.5 text-[#2E6F40] font-semibold animate-subtle-fade">
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>PDF summary generated and downloaded successfully!</span>
              </span>
            ) : (
              <span className={`text-[11px] ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                Includes 2-page boardroom executive performance briefing.
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handlePrint}
              className={`flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer w-full sm:w-auto ${
                isDark
                  ? 'border-[#3E352F] bg-[#211C19] hover:bg-[#2D2622] text-[#EDE6DE]'
                  : 'border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-[#292522]'
              }`}
              title="Open standard browser print dialog"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Summary</span>
            </button>

            <button
              type="button"
              id="btn-download-pdf-summary"
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="flex items-center justify-center gap-2 px-5 py-2.5 sm:py-2 rounded-xl text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:brightness-110 cursor-pointer disabled:opacity-50 w-full sm:w-auto min-h-[42px] sm:min-h-0"
              style={{ backgroundColor: activeTheme.primaryColor }}
            >
              <FileDown className="w-4 h-4" />
              <span>{isExporting ? 'Generating PDF...' : 'Download Formatted PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
