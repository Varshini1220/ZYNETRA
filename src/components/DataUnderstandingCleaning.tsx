import { useState } from 'react';
import {
  Sparkles,
  Search,
  CheckCircle2,
  RotateCcw,
  Database,
  Hash,
  Type,
  Calendar,
  Key,
  MapPin,
  Check,
  BrainCircuit,
  Info,
} from 'lucide-react';
import { DatasetProfile, CleaningAction, AnalysisTechnique } from '../types';

interface DataUnderstandingCleaningProps {
  profile: DatasetProfile;
  cleaningActions: CleaningAction[];
  analysisTechniques: AnalysisTechnique[];
  isDark: boolean;
  onToggleCleaningAction: (actionId: string) => void;
  onNavigateTab?: (tab: any) => void;
}

export default function DataUnderstandingCleaning({
  profile,
  cleaningActions,
  analysisTechniques,
  isDark: _isDark,
  onToggleCleaningAction,
  onNavigateTab: _onNavigateTab,
}: DataUnderstandingCleaningProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'cleaning' | 'techniques'>('profile');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [columnSearch, setColumnSearch] = useState<string>('');

  const filteredColumns = profile.columns.filter(col => {
    const matchesType = selectedTypeFilter === 'all' || col.type.toLowerCase() === selectedTypeFilter.toLowerCase();
    const matchesSearch = col.name.toLowerCase().includes(columnSearch.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'numeric':
        return <Hash className="w-3.5 h-3.5 text-[#756D65]" />;
      case 'datetime':
        return <Calendar className="w-3.5 h-3.5 text-[#756D65]" />;
      case 'identifier':
        return <Key className="w-3.5 h-3.5 text-[#756D65]" />;
      case 'geospatial':
        return <MapPin className="w-3.5 h-3.5 text-[#756D65]" />;
      default:
        return <Type className="w-3.5 h-3.5 text-[#756D65]" />;
    }
  };

  return (
    <div className="space-y-8 font-sans text-[#292522] animate-subtle-fade">
      {/* Header and Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD4CA] pb-6">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#49362F] font-semibold">
            Autonomous Hygiene
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#292522] mt-1">
            Data Quality, Cleansing &amp; Feature Schema
          </h3>
          <p className="text-xs text-[#756D65] mt-1">
            Deterministic data profiling, reversible statistical cleaning, and algorithmic technique selection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold text-[#7B8570] flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8EBE1] border border-[#7B8570]/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="tabular-nums">{profile.overallQualityScore}/100 Quality</span>
          </span>
        </div>
      </div>

      {/* Subtab Navigation Pills */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-lg border border-[#DDD4CA] shadow-2xs w-full sm:w-fit overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
            activeSubTab === 'profile'
              ? 'bg-[#49362F] text-white font-semibold'
              : 'text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Column Signatures ({profile.columns.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('cleaning')}
          className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
            activeSubTab === 'cleaning'
              ? 'bg-[#49362F] text-white font-semibold'
              : 'text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cleansing Audit ({cleaningActions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('techniques')}
          className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
            activeSubTab === 'techniques'
              ? 'bg-[#49362F] text-white font-semibold'
              : 'text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Selected Models ({analysisTechniques.filter(t => t.selected).length})</span>
        </button>
      </div>

      {/* SUBTAB 1: Dataset Profile & Columns */}
      {activeSubTab === 'profile' && (
        <div className="space-y-6">
          {/* Health Explainer */}
          <div className="p-4 rounded-xl border border-[#DDD4CA] bg-[#F8F3EC] flex items-start gap-3 text-xs">
            <Info className="w-4 h-4 text-[#A56F5D] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#292522]">Quality Diagnosis: </span>
              <span className="text-[#756D65] leading-relaxed">
                Score of <strong>{profile.overallQualityScore}/100</strong> indicates {profile.overallQualityScore >= 80 ? 'high statistical validity suitable for executive boardroom briefings' : 'fair quality with minor anomalies'}. {profile.completenessPercentage}% of values are non-null and verified, with {profile.duplicateRows} duplicate records quarantined.
              </span>
            </div>
          </div>

          {/* Health Scorecards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            <div className="p-5 sm:p-6 rounded-xl border border-[#DDD4CA] bg-white space-y-1 shadow-xs">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#756D65]">Quality Index</div>
              <div className="text-2xl sm:text-3xl text-[#7B8570] font-bold tabular-nums">{profile.overallQualityScore}/100</div>
              <div className="text-[11px] text-[#756D65]">Statistical reliability</div>
            </div>
            <div className="p-5 sm:p-6 rounded-xl border border-[#DDD4CA] bg-white space-y-1 shadow-xs">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#756D65]">Observations</div>
              <div className="text-2xl sm:text-3xl text-[#292522] font-bold tabular-nums">{profile.totalRows.toLocaleString()}</div>
              <div className="text-[11px] text-[#756D65]">{profile.totalColumns} column dimensions</div>
            </div>
            <div className="p-5 sm:p-6 rounded-xl border border-[#DDD4CA] bg-white space-y-1 shadow-xs">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#756D65]">Completeness</div>
              <div className="text-2xl sm:text-3xl text-[#292522] font-bold tabular-nums">{profile.completenessPercentage}%</div>
              <div className="text-[11px] text-[#756D65]">Non-null density</div>
            </div>
            <div className="p-5 sm:p-6 rounded-xl border border-[#DDD4CA] bg-white space-y-1 shadow-xs">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#756D65]">Duplicates</div>
              <div className="text-2xl sm:text-3xl text-[#292522] font-bold tabular-nums">{profile.duplicateRows}</div>
              <div className="text-[11px] text-[#756D65]">Quarantined records</div>
            </div>
            <div className="p-5 sm:p-6 rounded-xl border border-[#DDD4CA] bg-white space-y-1 shadow-xs">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#756D65]">Domain</div>
              <div className="text-xl text-[#292522] font-bold uppercase mt-2 truncate">
                {profile.detectedDomain}
              </div>
              <div className="text-[11px] text-[#756D65]">Heuristic classification</div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-[#DDD4CA] bg-white shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#756D65]" />
              <input
                type="text"
                value={columnSearch}
                onChange={e => setColumnSearch(e.target.value)}
                placeholder="Search features..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] text-[#292522] placeholder-[#756D65]/60 focus:outline-none focus:border-[#49362F] transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-0.5">
              {['all', 'numeric', 'categorical', 'datetime', 'identifier', 'geospatial'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedTypeFilter(type)}
                  className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                    selectedTypeFilter === type
                      ? 'bg-[#49362F] text-white font-semibold'
                      : 'text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Column Profiles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredColumns.map(col => (
              <div
                key={col.name}
                className="p-5 sm:p-6 rounded-xl border border-[#DDD4CA] bg-white space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between gap-2 border-b border-[#DDD4CA]/60 pb-3">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(col.type)}
                    <span className="text-sm font-bold text-[#292522] truncate max-w-[170px]">{col.name}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-[#756D65] bg-[#EEE7DE] border border-[#DDD4CA]">
                    {col.type}
                  </span>
                </div>

                {/* Numerical Statistics */}
                {col.type === 'numeric' && (
                  <div className="grid grid-cols-3 gap-3 p-3 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] text-xs">
                    <div>
                      <div className="text-[#756D65] text-[10px] uppercase font-mono">Mean</div>
                      <div className="font-mono font-medium text-[#292522] tabular-nums">{col.mean?.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[#756D65] text-[10px] uppercase font-mono">Median</div>
                      <div className="font-mono font-medium text-[#292522] tabular-nums">{col.median?.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[#756D65] text-[10px] uppercase font-mono">Std Dev</div>
                      <div className="font-mono font-medium text-[#292522] tabular-nums">{col.stdDev?.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[#756D65] text-[10px] uppercase font-mono">Range</div>
                      <div className="font-mono text-[#292522] truncate tabular-nums">
                        {col.min} - {col.max}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#756D65] text-[10px] uppercase font-mono">Outliers</div>
                      <div className={`font-mono font-medium tabular-nums ${(col.outlierCount || 0) > 0 ? 'text-[#A56F5D]' : 'text-[#7B8570]'}`}>
                        {col.outlierCount || 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#756D65] text-[10px] uppercase font-mono">Missing</div>
                      <div className="font-mono text-[#292522] tabular-nums">{col.missingPercentage}%</div>
                    </div>
                  </div>
                )}

                {/* Categorical Distribution Breakdown */}
                {col.topCategories && col.topCategories.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#756D65]">Dominant Categories</div>
                    {col.topCategories.map((cat, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-[#292522] truncate max-w-[140px]">{cat.value}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[#756D65] font-mono text-[11px] tabular-nums">{cat.count}</span>
                          <span className="text-[#292522] font-semibold text-[11px] w-8 text-right tabular-nums">{cat.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-[#DDD4CA]/60 flex items-center justify-between text-[11px] text-[#756D65] font-mono">
                  <span>Unique: {col.uniqueCount.toLocaleString()}</span>
                  <span>Missing: {col.missingCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: Autonomous Cleaning Audit & Revert */}
      {activeSubTab === 'cleaning' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xl sm:text-2xl font-bold text-[#292522]">Autonomous Data Cleansing Log</h4>
              <p className="text-xs text-[#756D65] mt-1">
                Zynetra automatically applied verified statistical repairs. You can inspect the mathematical rationale and re-toggle any rule.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-[#7B8570] flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8EBE1] border border-[#7B8570]/30 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{cleaningActions.filter(a => a.applied).length} of {cleaningActions.length} Actions Active</span>
            </span>
          </div>

          <div className="space-y-4">
            {cleaningActions.map(action => (
              <div
                key={action.id}
                className={`p-6 rounded-xl border transition-all ${
                  action.applied
                    ? 'bg-white border-[#DDD8D0] shadow-xs'
                    : 'bg-[#F8F3EC] border-[#DDD8D0]/60 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-[#EEE7DE] text-[#756D65] border border-[#DDD8D0]">
                      {action.type.replace('_', ' ')}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-[#292522]">{action.title}</h4>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono font-semibold text-[#7B8570] tabular-nums">
                      {action.confidenceScore}% Confidence
                    </span>
                    <button
                      onClick={() => onToggleCleaningAction(action.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                        action.applied
                          ? 'border-[#A56F5D]/40 text-[#A56F5D] hover:bg-[#A56F5D]/10'
                          : 'border-[#7B8570]/40 text-[#7B8570] hover:bg-[#7B8570]/10'
                      }`}
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{action.applied ? 'Revert Action' : 'Re-Apply'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs p-4 rounded-lg border border-[#DDD8D0] bg-[#F8F3EC]">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#756D65] mb-1 font-semibold">What Changed</div>
                    <p className="text-[#292522] leading-relaxed">{action.whatChanged}</p>
                    <span className="text-[10px] text-[#756D65] mt-2 block font-mono tabular-nums">
                      Affected: {action.recordsAffected.toLocaleString()} records
                    </span>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#49362F] mb-1 font-semibold">
                      Statistical Rationale
                    </div>
                    <p className="text-[#756D65] leading-relaxed">{action.whyChanged}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: Selected Analytical Techniques & Reasoning */}
      {activeSubTab === 'techniques' && (
        <div className="space-y-6">
          <div>
            <h4 className="text-xl sm:text-2xl font-bold text-[#292522]">Autonomous Model Selection Heuristic</h4>
            <p className="text-xs text-[#756D65] mt-1">
              Zynetra analyzes column semantics, distributional variance, and strategic objective to assemble an optimal multi-model pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {analysisTechniques.map(tech => (
              <div
                key={tech.id}
                className={`p-6 rounded-xl border transition-all ${
                  tech.selected
                    ? 'bg-white border-[#DDD8D0] shadow-xs'
                    : 'bg-[#F8F3EC] border-[#DDD8D0]/60 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-bold ${
                      tech.selected ? 'bg-[#49362F]' : 'bg-[#DDD8D0]'
                    }`}>
                      {tech.selected ? <Check className="w-3 h-3 text-white" /> : '—'}
                    </div>
                    <h4 className="text-base font-bold text-[#292522]">{tech.name}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-[#756D65] bg-[#EEE7DE] border border-[#DDD8D0]">
                    {tech.category}
                  </span>
                </div>

                <p className="text-xs text-[#756D65] leading-relaxed pl-8">{tech.reason}</p>

                <div className="mt-4 pt-3 border-t border-[#DDD8D0]/60 flex items-center justify-between text-xs pl-8 font-mono">
                  <span className="text-[#756D65]">Heuristic Fit</span>
                  <span className="font-semibold text-[#7B8570] tabular-nums">{tech.confidence}% Confidence</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
