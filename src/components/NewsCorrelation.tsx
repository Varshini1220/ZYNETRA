import { useState } from 'react';
import {
  ExternalLink,
  TrendingDown,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { NewsEvent } from '../types';

interface NewsCorrelationProps {
  news: NewsEvent[];
  isDark?: boolean;
}

export default function NewsCorrelation({ news, isDark: _isDark }: NewsCorrelationProps) {
  const [selectedNews, setSelectedNews] = useState<NewsEvent | null>(news[0] || null);

  return (
    <div className="space-y-8 font-sans text-[#292522] animate-subtle-fade">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-[#DDD4CA] pb-5 sm:pb-6">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#49362F] font-semibold">
            External Signals
          </span>
          <h3 className="text-xl sm:text-3xl font-bold text-[#292522] mt-1">
            Macro Environment &amp; External Wire Correlation
          </h3>
          <p className="text-xs text-[#756D65] mt-1">
            Correlates external market alerts, policy shifts, and supply events with internal dataset anomalies.
          </p>
        </div>
        <span className="text-xs font-mono font-semibold text-[#7B8570] flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8EBE1] border border-[#7B8570]/30 self-start sm:self-auto">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Ingestion Active</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* News Feed List (1 Col) */}
        <div className="space-y-3">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#756D65] mb-1 font-semibold">
            External Wire Feed
          </div>
          {news.map(item => {
            const isSelected = selectedNews?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedNews(item)}
                className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-[#49362F] bg-white shadow-xs'
                    : 'border-[#DDD4CA] bg-white/70 hover:bg-white text-[#756D65]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-[#756D65] mb-1.5 flex-wrap gap-1">
                  <span className="font-semibold text-[#49362F]">{item.source}</span>
                  <span className="font-mono tabular-nums">{item.date}</span>
                </div>
                <h4 className="text-xs font-semibold text-[#292522] line-clamp-2 leading-relaxed">{item.headline}</h4>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#DDD4CA]/60 text-xs">
                  <span className="text-[#756D65]">Correlation:</span>
                  <span className="font-mono font-semibold text-[#A56F5D] tabular-nums">{item.correlationStrength}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deep Correlation Inspector (2 Cols) */}
        {selectedNews && (
          <div className="lg:col-span-2 p-4 sm:p-7 rounded-xl border border-[#DDD4CA] bg-white space-y-5 sm:space-y-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DDD4CA]/60 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-[#EEE7DE] text-[#756D65] border border-[#DDD4CA]">
                  {selectedNews.source}
                </span>
                <span className="text-xs font-mono text-[#756D65] tabular-nums">{selectedNews.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#756D65]">Statistical Link:</span>
                <span className="text-xs font-mono font-semibold text-[#A56F5D] px-2 py-0.5 rounded-md bg-[#A56F5D]/10 border border-[#A56F5D]/20 tabular-nums">
                  {selectedNews.correlationStrength}% Match
                </span>
              </div>
            </div>

            <h3 className="text-lg sm:text-2xl font-bold text-[#292522] leading-snug">{selectedNews.headline}</h3>
            <p className="text-xs text-[#756D65] leading-relaxed bg-[#F8F3EC] p-3.5 sm:p-4 rounded-xl border border-[#DDD4CA]">
              {selectedNews.snippet}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-3.5 sm:p-4 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC]">
                <div className="text-[11px] font-mono uppercase font-semibold text-[#A56F5D] mb-1.5 flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Correlated Metric Anomaly</span>
                </div>
                <div className="text-xs font-bold text-[#292522] mb-1">
                  {selectedNews.correlatedMetric}
                </div>
                <p className="text-xs text-[#756D65] leading-relaxed">
                  Time-lagged cross-correlation confirmed an anomalous shift in enterprise metric within 48 hours of this macro wire alert.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC]">
                <div className="text-[11px] font-mono uppercase font-semibold text-[#49362F] mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Business Impact Synthesis</span>
                </div>
                <p className="text-xs text-[#756D65] leading-relaxed">
                  {selectedNews.businessImpactExplanation}
                </p>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC]/50 text-xs text-[#756D65] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span>Ingested via Global Macroeconomic Intelligence Pipeline.</span>
              <a
                href={selectedNews.url}
                target="_blank"
                rel="noreferrer"
                className="text-[#292522] hover:text-[#49362F] font-semibold flex items-center gap-1 transition-colors self-start sm:self-auto"
              >
                <span>Read Full Wire</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
