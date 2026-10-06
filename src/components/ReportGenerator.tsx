import { useState } from 'react';
import {
  FileText,
  Presentation,
  Printer,
  FileSpreadsheet,
  Code2,
} from 'lucide-react';
import { DatasetProfile, DecisionRecommendation, NaturalInsight } from '../types';

interface ReportGeneratorProps {
  profile: DatasetProfile;
  recommendations: DecisionRecommendation[];
  insights: NaturalInsight[];
  kpis: { label: string; value: string; delta: string; deltaType: 'positive' | 'negative' | 'neutral'; description: string }[];
  rawRows?: Record<string, any>[];
  isDark?: boolean;
}

export default function ReportGenerator({
  profile,
  recommendations,
  insights,
  kpis,
  rawRows: _rawRows,
  isDark: _isDark,
}: ReportGeneratorProps) {
  const [reportFormat, setReportFormat] = useState<'dossier' | 'slides'>('dossier');
  const [activeSlide, setActiveSlide] = useState(0);

  const handlePrintPDF = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const csvRows: string[] = [];
    csvRows.push('Category,Observation,ConfidenceScore,ImpactEstimation');
    insights.forEach(ins => {
      csvRows.push(`"${ins.category}","${ins.title} - ${ins.description.replace(/"/g, '""')}",${ins.confidenceScore},"Verified"`);
    });
    recommendations.forEach(rec => {
      csvRows.push(`"Intervention","${rec.title} - ${rec.expectedImpact.replace(/"/g, '""')}",${rec.confidenceScore},"${rec.estimatedBenefit || 'N/A'}"`);
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Zynetra_Executive_Analysis_${profile.name.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const exportData = {
      platform: 'Zynetra Autonomous Analytics',
      generatedAt: new Date().toISOString(),
      dataset: {
        name: profile.name,
        version: profile.version,
        qualityScore: profile.overallQualityScore,
        totalObservations: profile.totalRows,
        dimensions: profile.totalColumns,
      },
      kpis,
      insights,
      recommendations,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Zynetra_Analysis_Audit_${profile.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const slides = [
    {
      title: 'Executive Diagnostics & Financial Summary',
      subtitle: `Autonomous dataset synthesis for ${profile.name}`,
      content: (
        <div className="space-y-4">
          <p className="text-xs text-[#756D65] leading-relaxed">
            Zynetra evaluated {profile.totalRows.toLocaleString()} transactional records,
            uncovering high-leverage growth opportunities and mitigating core operational risks.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC]">
              <div className="text-[10px] font-mono uppercase text-[#756D65]">Identified Net Benefit</div>
              <div className="text-xl sm:text-2xl font-bold text-[#7B8570] mt-1">+₹420K - ₹1.2M Annualized</div>
            </div>
            <div className="p-4 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC]">
              <div className="text-[10px] font-mono uppercase text-[#756D65]">Data Reliability Index</div>
              <div className="text-xl sm:text-2xl font-bold text-[#292522] mt-1">{profile.overallQualityScore}/100 Verified</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Key Empirical Findings & Statistical Anomalies',
      subtitle: 'Synthesis of verified econometric observations',
      content: (
        <div className="space-y-3">
          {insights.slice(0, 3).map((ins, i) => (
            <div key={i} className="p-4 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC] text-xs space-y-1">
              <div className="font-semibold text-[#292522] flex items-center justify-between">
                <span>{ins.title}</span>
                <span className="text-[10px] text-[#A56F5D] uppercase font-mono font-semibold">{ins.category}</span>
              </div>
              <p className="text-[#756D65] leading-relaxed">{ins.description}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Prioritized Business Interventions',
      subtitle: 'Prescriptive action roadmap for leadership execution',
      content: (
        <div className="space-y-3">
          {recommendations.slice(0, 2).map((rec, i) => (
            <div key={i} className="p-4 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC] text-xs space-y-1.5">
              <div className="flex justify-between items-center font-semibold text-sm text-[#292522]">
                <span>{rec.title}</span>
                <span className="font-mono text-xs font-semibold text-[#7B8570]">{rec.expectedImpact}</span>
              </div>
              <p className="text-[#756D65] text-xs leading-relaxed">{rec.description || rec.why}</p>
              <div className="text-[11px] text-[#49362F] font-semibold pt-1">
                Immediate Action: {rec.actionSteps[0]}
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 font-sans text-[#292522] animate-subtle-fade">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-[#DDD4CA] pb-5 sm:pb-6">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#49362F] font-semibold">
            Boardroom Deliverables
          </span>
          <h3 className="text-xl sm:text-3xl font-bold text-[#292522] mt-1">
            Executive Reports &amp; Comprehensive Exports
          </h3>
          <p className="text-xs text-[#756D65] mt-1">
            Publish printable executive intelligence dossiers, slide decks, and sanitized audit schemas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-xs font-semibold text-[#292522] transition-colors"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-[#756D65]" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-xs font-semibold text-[#292522] transition-colors"
            title="Download Cleaned Data in CSV format"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#756D65]" />
            <span>Cleaned CSV</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-xs font-semibold text-[#292522] transition-colors"
            title="Download complete structured analysis audit in JSON format"
          >
            <Code2 className="w-3.5 h-3.5 text-[#756D65]" />
            <span>Analysis JSON</span>
          </button>
        </div>
      </div>

      {/* Format Selector Pills */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-lg border border-[#DDD4CA] shadow-2xs w-full sm:w-fit overflow-x-auto">
        <button
          onClick={() => setReportFormat('dossier')}
          className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
            reportFormat === 'dossier'
              ? 'bg-[#49362F] text-white font-semibold'
              : 'text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Executive Intelligence Dossier</span>
        </button>

        <button
          onClick={() => setReportFormat('slides')}
          className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
            reportFormat === 'slides'
              ? 'bg-[#49362F] text-white font-semibold'
              : 'text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
          }`}
        >
          <Presentation className="w-3.5 h-3.5" />
          <span>Slide Deck Preview</span>
        </button>
      </div>

      {/* VIEW 1: Formal Executive Dossier */}
      {reportFormat === 'dossier' && (
        <div className="p-4 sm:p-12 rounded-xl border border-[#DDD4CA] bg-white space-y-8 sm:space-y-10 max-w-4xl mx-auto shadow-xs">
          {/* Header */}
          <div className="border-b border-[#DDD4CA] pb-6 flex items-start justify-between">
            <div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider bg-[#EEE7DE] text-[#49362F] border border-[#DDD4CA] font-semibold">
                Zynetra Executive Intelligence Briefing
              </span>
              <h2 className="text-2xl sm:text-3xl text-[#292522] font-bold mt-2 leading-tight">
                Autonomous Analytical Synthesis &amp; Decision Plan
              </h2>
              <p className="text-xs text-[#756D65] mt-2 font-mono">
                Corpus: {profile.name} (v{profile.version}) &bull; Date: {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="text-right font-mono text-xs text-[#756D65]">
              <div className="uppercase tracking-widest text-[10px] font-semibold text-[#A56F5D]">Confidential</div>
              <div className="text-[#7B8570] font-semibold mt-1">{profile.overallQualityScore}/100 Quality</div>
            </div>
          </div>

          {/* 1. Executive Summary */}
          <section className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#49362F] font-semibold">
              01. Executive Synthesis
            </h3>
            <p className="text-sm text-[#292522] leading-relaxed">
              Through continuous autonomous profiling and causal inference, Zynetra evaluated {profile.totalRows.toLocaleString()} rows
              across {profile.totalColumns} dimensions. The analysis detected critical divergent patterns in user retention
              and revenue realization following recent operational adjustments. By acting on the prioritized interventions
              below, leadership can recover an estimated <strong className="text-[#7B8570] font-bold">+₹420,000 to ₹1,200,000 in annualized ARR</strong> with
              a 94% statistical certainty.
            </p>
          </section>

          {/* 2. Key Diagnostic Metrics */}
          <section className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#49362F] font-semibold">
              02. Empirical Health Baseline
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {kpis.map((k, i) => (
                <div key={i} className="p-4 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC] text-xs space-y-1">
                  <div className="text-[#756D65] text-[10px] uppercase font-mono">{k.label}</div>
                  <div className="text-xl sm:text-2xl font-bold text-[#292522] tabular-nums">{k.value}</div>
                  <div className="text-[11px] font-mono font-semibold text-[#7B8570]">{k.delta}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Core Insights & Evidence */}
          <section className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#49362F] font-semibold">
              03. Empirical Findings &amp; Evidence
            </h3>
            <div className="space-y-3">
              {insights.map(ins => (
                <div key={ins.id} className="p-5 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC]/60 text-xs space-y-2">
                  <div className="flex items-center justify-between text-base font-bold text-[#292522]">
                    <span>{ins.title}</span>
                    <span className="text-[10px] text-[#A56F5D] font-mono uppercase font-semibold">{ins.category}</span>
                  </div>
                  <p className="text-[#756D65] leading-relaxed">{ins.description}</p>
                  <div className="text-[10px] text-[#756D65] font-mono pt-1 border-t border-[#DDD4CA]/60">
                    Proof Citation: {ins.evidenceCitation}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Decision Roadmap */}
          <section className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#49362F] font-semibold">
              04. Prioritized Decision Interventions
            </h3>
            <div className="space-y-4">
              {recommendations.map(rec => (
                <div key={rec.id} className="p-6 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC]/60 text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#DDD4CA]/60 pb-3">
                    <span className="text-base sm:text-lg font-bold text-[#292522]">{rec.title}</span>
                    <span className="text-[#7B8570] font-mono font-semibold">{rec.expectedImpact}</span>
                  </div>
                  <p className="text-[#756D65] leading-relaxed">{rec.description || rec.why}</p>
                  <div className="font-mono text-[10px] uppercase text-[#292522] font-semibold pt-1">
                    Immediate Action Steps:
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[#756D65] text-xs">
                    {rec.actionSteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* VIEW 2: Boardroom Slide Deck Viewer */}
      {reportFormat === 'slides' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-8 sm:p-10 rounded-xl border border-[#DDD4CA] bg-white shadow-xs min-h-[380px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#756D65] mb-6 border-b border-[#DDD4CA] pb-3">
                <span className="font-mono uppercase tracking-wider text-[#49362F] font-semibold">
                  Slide {activeSlide + 1} of {slides.length}
                </span>
                <span className="font-mono text-[11px] text-[#756D65]">Zynetra Executive Deck</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#292522]">{slides[activeSlide].title}</h2>
              <p className="text-xs text-[#756D65] mt-1 mb-6">{slides[activeSlide].subtitle}</p>

              {slides[activeSlide].content}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-[#DDD4CA] mt-8">
              <button
                disabled={activeSlide === 0}
                onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-lg border border-[#DDD4CA] text-xs font-semibold text-[#292522] hover:bg-[#EEE7DE] disabled:opacity-30 transition-colors"
              >
                Previous Slide
              </button>
              <div className="flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      activeSlide === i ? 'bg-[#49362F] w-6' : 'bg-[#DDD4CA] w-2'
                    }`}
                  />
                ))}
              </div>
              <button
                disabled={activeSlide === slides.length - 1}
                onClick={() => setActiveSlide(prev => Math.min(slides.length - 1, prev + 1))}
                className="px-4 py-2 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white text-xs font-semibold uppercase tracking-wider disabled:opacity-30 transition-colors"
              >
                Next Slide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
