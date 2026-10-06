import { useState } from 'react';
import {
  X,
  SlidersHorizontal,
  CheckCircle2,
  Palette,
  Sun,
  Moon,
  Check,
} from 'lucide-react';
import { ThemeId } from '../types/theme';
import { THEME_LIST, THEME_DEFINITIONS } from '../utils/themeConfig';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  currentTheme?: ThemeId;
  onSelectTheme?: (themeId: ThemeId) => void;
  onToggleDarkMode?: () => void;
  onSetDarkMode?: (isDark: boolean) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  isDark,
  currentTheme = 'indigo',
  onSelectTheme,
  onToggleDarkMode,
  onSetDarkMode,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'appearance' | 'pipeline' | 'refresh' | 'security'>('appearance');
  const [anomalyThreshold, setAnomalyThreshold] = useState(90);
  const [confidenceFloor, setConfidenceFloor] = useState(80);
  const [refreshSchedule, setRefreshSchedule] = useState('daily');
  const [isSaved, setIsSaved] = useState(false);

  const activeTheme = THEME_DEFINITIONS[currentTheme || 'indigo'] || THEME_DEFINITIONS.indigo;

  if (!isOpen) return null;

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-2.5 sm:p-4 font-sans animate-subtle-fade overflow-y-auto">
      <div
        className={`max-w-xl w-full rounded-xl border p-4 sm:p-8 shadow-xl transition-colors my-4 sm:my-8 max-h-[92vh] overflow-y-auto ${
          isDark ? 'border-[#3E352F] bg-[#26201D] text-[#EDE6DE]' : 'border-[#DDD4CA] bg-white text-[#292522]'
        }`}
      >
        <div className={`flex items-center justify-between border-b pb-4 mb-5 ${isDark ? 'border-[#3E352F]' : 'border-[#DDD4CA]'}`}>
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal
              className="w-4 h-4"
              style={{ color: activeTheme.primaryColor }}
            />
            <h3 className="text-base font-bold">Zynetra Engine Settings</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-[#A3988E] hover:text-[#EDE6DE] hover:bg-[#322A26]' : 'text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className={`flex gap-2 mb-6 border-b pb-2 text-xs overflow-x-auto ${isDark ? 'border-[#3E352F]' : 'border-[#DDD4CA]'}`}>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'appearance'
                ? 'text-white shadow-2xs'
                : isDark
                ? 'text-[#A3988E] hover:text-[#EDE6DE] hover:bg-[#322A26]'
                : 'text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
            }`}
            style={activeTab === 'appearance' ? { backgroundColor: activeTheme.primaryColor } : undefined}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme &amp; Appearance</span>
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'pipeline'
                ? 'text-white shadow-2xs'
                : isDark
                ? 'text-[#A3988E] hover:text-[#EDE6DE] hover:bg-[#322A26]'
                : 'text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
            }`}
            style={activeTab === 'pipeline' ? { backgroundColor: activeTheme.primaryColor } : undefined}
          >
            Pipeline Parameters
          </button>
          <button
            onClick={() => setActiveTab('refresh')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'refresh'
                ? 'text-white shadow-2xs'
                : isDark
                ? 'text-[#A3988E] hover:text-[#EDE6DE] hover:bg-[#322A26]'
                : 'text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
            }`}
            style={activeTab === 'refresh' ? { backgroundColor: activeTheme.primaryColor } : undefined}
          >
            Scheduled Refresh
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'security'
                ? 'text-white shadow-2xs'
                : isDark
                ? 'text-[#A3988E] hover:text-[#EDE6DE] hover:bg-[#322A26]'
                : 'text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
            }`}
            style={activeTab === 'security' ? { backgroundColor: activeTheme.primaryColor } : undefined}
          >
            Compliance &amp; Security
          </button>
        </div>

        {/* Tab 0: Theme & Appearance */}
        {activeTab === 'appearance' && (
          <div className="space-y-5 text-xs animate-subtle-fade">
            {/* Color Mode Toggle */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#F8F3EC]'
              }`}
            >
              <div>
                <div className={`font-bold ${isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}`}>Display Environment</div>
                <div className={`text-[11px] ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                  Warm earthy cream canvas or executive high-contrast dark mode
                </div>
              </div>
              {(onToggleDarkMode || onSetDarkMode) && (
                <div
                  className={`flex items-center gap-1 p-1 rounded-lg border ${
                    isDark ? 'border-[#3E352F] bg-[#181513]' : 'border-[#DDD4CA] bg-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (onSetDarkMode) onSetDarkMode(false);
                      else if (isDark && onToggleDarkMode) onToggleDarkMode();
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      !isDark
                        ? 'text-white shadow-2xs font-bold'
                        : isDark
                        ? 'text-[#A3988E] hover:text-[#EDE6DE]'
                        : 'text-[#756D65] hover:text-[#292522]'
                    }`}
                    style={!isDark ? { backgroundColor: activeTheme.primaryColor } : undefined}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Cream</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSetDarkMode) onSetDarkMode(true);
                      else if (!isDark && onToggleDarkMode) onToggleDarkMode();
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      isDark
                        ? 'text-white shadow-2xs font-bold'
                        : 'text-[#756D65] hover:text-[#292522]'
                    }`}
                    style={isDark ? { backgroundColor: activeTheme.primaryColor } : undefined}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark</span>
                  </button>
                </div>
              )}
            </div>

            {/* Themes Grid */}
            <div>
              <label
                className={`font-semibold block mb-2 uppercase font-mono tracking-wider text-[11px] ${
                  isDark ? 'text-[#A3988E]' : 'text-[#756D65]'
                }`}
              >
                Earthy Palette Presets
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 max-h-56 overflow-y-auto pr-1">
                {THEME_LIST.map(th => {
                  const isSelected = th.id === currentTheme;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => onSelectTheme?.(th.id)}
                      className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                        isSelected
                          ? isDark
                            ? 'bg-[#322A26] shadow-2xs'
                            : 'bg-[#F8F3EC] shadow-2xs'
                          : isDark
                          ? 'border-[#3E352F] bg-[#211C19] hover:bg-[#2D2622] text-[#EDE6DE]'
                          : 'border-[#DDD4CA] bg-[#F8F3EC]/60 hover:bg-[#EEE7DE] text-[#292522]'
                      }`}
                      style={{
                        borderColor: isSelected ? th.primaryColor : undefined,
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-4 h-4 rounded-full shrink-0 shadow-2xs border border-black/10"
                          style={{ backgroundColor: th.primaryColor }}
                        />
                        <div>
                          <div className="font-semibold text-xs leading-tight">{th.name}</div>
                          <div className={`text-[10px] leading-snug mt-0.5 ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                            {th.tag} &bull; {th.subtitle}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5"
                          style={{ backgroundColor: th.primaryColor }}
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Pipeline Parameters */}
        {activeTab === 'pipeline' && (
          <div className="space-y-5 text-xs animate-subtle-fade">
            <div
              className={`p-4 rounded-xl border space-y-2 ${
                isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#F8F3EC]'
              }`}
            >
              <div className="flex justify-between">
                <span className="font-semibold">Anomaly Detection Sensitivity</span>
                <span className="font-mono font-bold" style={{ color: activeTheme.primaryColor }}>
                  {anomalyThreshold}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={anomalyThreshold}
                onChange={e => setAnomalyThreshold(Number(e.target.value))}
                className="w-full cursor-pointer"
                style={{ accentColor: activeTheme.primaryColor }}
              />
              <p className={`text-[11px] ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                Higher sensitivity flags subtle micro-fluctuations; lower sensitivity isolates structural multi-period deviations.
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border space-y-2 ${
                isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#F8F3EC]'
              }`}
            >
              <div className="flex justify-between">
                <span className="font-semibold">Causal Elimination Confidence Floor</span>
                <span className="font-mono font-bold" style={{ color: activeTheme.primaryColor }}>
                  {confidenceFloor}%
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="95"
                value={confidenceFloor}
                onChange={e => setConfidenceFloor(Number(e.target.value))}
                className="w-full cursor-pointer"
                style={{ accentColor: activeTheme.primaryColor }}
              />
              <p className={`text-[11px] ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                Hypotheses with p-values exceeding this threshold will be classified as unverified and excluded from Root-Cause Trees.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Scheduled Refresh */}
        {activeTab === 'refresh' && (
          <div className="space-y-4 text-xs animate-subtle-fade">
            <div
              className={`p-4 rounded-xl border space-y-3 ${
                isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#F8F3EC]'
              }`}
            >
              <span className="font-semibold block">Continuous Profiling Cadence</span>
              <div className="grid grid-cols-3 gap-2">
                {['hourly', 'daily', 'weekly'].map(sch => (
                  <button
                    key={sch}
                    type="button"
                    onClick={() => setRefreshSchedule(sch)}
                    className={`py-2 px-3 rounded-lg border text-center font-medium capitalize transition-colors ${
                      refreshSchedule === sch
                        ? 'text-white shadow-2xs font-semibold'
                        : isDark
                        ? 'border-[#3E352F] bg-[#26201D] text-[#A3988E] hover:text-[#EDE6DE]'
                        : 'border-[#DDD4CA] bg-white text-[#756D65] hover:text-[#292522]'
                    }`}
                    style={refreshSchedule === sch ? { backgroundColor: activeTheme.primaryColor } : undefined}
                  >
                    {sch}
                  </button>
                ))}
              </div>
              <p className={`text-[11px] ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                Automated background runs rebuild time-series forecasts, check for data drift, and update prioritized decision queues.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Security & Compliance */}
        {activeTab === 'security' && (
          <div className="space-y-3 text-xs animate-subtle-fade">
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#F8F3EC]'
              }`}
            >
              <div>
                <div className="font-semibold">Zero-Retention In-Memory Execution</div>
                <div className={`text-[11px] ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                  Raw records are profiled in volatile memory and never stored unencrypted.
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-[#E8EBE1] text-[#7B8570]">
                Enforced
              </span>
            </div>

            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                isDark ? 'border-[#3E352F] bg-[#211C19]' : 'border-[#DDD4CA] bg-[#F8F3EC]'
              }`}
            >
              <div>
                <div className="font-semibold">SOC2 Type II Attestation</div>
                <div className={`text-[11px] ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                  All causal reasoning paths and cleaning modifications are signed.
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-[#E8EBE1] text-[#7B8570]">
                Active
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={`mt-6 pt-4 border-t flex items-center justify-between ${isDark ? 'border-[#3E352F]' : 'border-[#DDD4CA]'}`}>
          <span className={`text-[11px] font-mono ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
            Zynetra Core Build v2.4
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                isDark
                  ? 'border-[#3E352F] text-[#A3988E] hover:text-[#EDE6DE] hover:bg-[#322A26]'
                  : 'border-[#DDD4CA] text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-2xs hover:brightness-110"
              style={{ backgroundColor: activeTheme.primaryColor }}
            >
              {isSaved && <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Saved' : 'Save Configuration'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
