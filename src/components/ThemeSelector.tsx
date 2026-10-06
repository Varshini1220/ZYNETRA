import { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sun, Moon, Sparkles } from 'lucide-react';
import { ThemeId, ThemeDefinition } from '../types/theme';
import { THEME_DEFINITIONS, THEME_LIST } from '../utils/themeConfig';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onSelectTheme: (themeId: ThemeId) => void;
  isDark: boolean;
  onToggleDarkMode: () => void;
  onSetDarkMode?: (dark: boolean) => void;
}

export default function ThemeSelector({
  currentTheme,
  onSelectTheme,
  isDark,
  onToggleDarkMode,
  onSetDarkMode,
}: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeTheme = THEME_DEFINITIONS[currentTheme] || THEME_DEFINITIONS.indigo;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSetLightMode = () => {
    if (onSetDarkMode) {
      onSetDarkMode(false);
    } else if (isDark) {
      onToggleDarkMode();
    }
  };

  const handleSetDarkMode = () => {
    if (onSetDarkMode) {
      onSetDarkMode(true);
    } else if (!isDark) {
      onToggleDarkMode();
    }
  };

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      {/* Theme Trigger Button */}
      <button
        type="button"
        id="btn-theme-selector"
        onClick={() => setIsOpen(prev => !prev)}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-200 cursor-pointer ${
          isOpen
            ? 'ring-2 shadow-sm'
            : isDark
            ? 'border-[#3E352F] bg-[#26201D] hover:bg-[#322A26] text-[#EDE6DE]'
            : 'border-[#DDD4CA] bg-white hover:bg-[#EEE7DE] text-[#292522]'
        }`}
        style={
          isOpen
            ? {
                borderColor: activeTheme.primaryColor,
                backgroundColor: isDark ? '#2D2622' : '#F8F3EC',
              }
            : undefined
        }
        title="Theme and Appearances - Change application palette & display mode"
        aria-expanded={isOpen}
      >
        <Palette
          className="w-3.5 h-3.5 transition-colors"
          style={{ color: activeTheme.primaryColor }}
        />
        <span
          className="w-3 h-3 rounded-full shrink-0 shadow-2xs border border-black/15 transition-transform"
          style={{ backgroundColor: activeTheme.primaryColor }}
        />
        <span className="hidden sm:inline font-semibold">{activeTheme.name}</span>
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-88 rounded-2xl border p-4 shadow-2xl z-50 divide-y animate-subtle-fade ${
            isDark
              ? 'border-[#3E352F] bg-[#211C19] text-[#EDE6DE] divide-[#3E352F]'
              : 'border-[#DDD4CA] bg-white text-[#292522] divide-[#DDD4CA]'
          }`}
          style={{
            boxShadow: isDark
              ? '0 20px 40px -10px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)'
              : '0 20px 40px -10px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
          }}
        >
          {/* Header */}
          <div className="pb-3.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs transition-colors"
                style={{ backgroundColor: activeTheme.primaryColor }}
              >
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">Theme &amp; Appearance</h4>
                <p className={`text-[11px] ${isDark ? 'text-[#A3988E]' : 'text-[#756D65]'}`}>
                  Select palette &amp; color mode
                </p>
              </div>
            </div>

            {/* Quick Light / Dark Toggle Switch */}
            <div
              className={`flex items-center gap-1 p-1 rounded-xl border transition-colors ${
                isDark ? 'bg-[#181513] border-[#3E352F]' : 'bg-[#F8F3EC] border-[#DDD4CA]'
              }`}
            >
              <button
                type="button"
                id="btn-theme-cream-mode"
                onClick={handleSetLightMode}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  !isDark
                    ? 'text-white shadow-xs font-bold'
                    : 'text-[#A3988E] hover:text-[#EDE6DE]'
                }`}
                style={!isDark ? { backgroundColor: activeTheme.primaryColor } : undefined}
                title="Switch to Warm Cream Light Mode"
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="text-[11px]">Cream</span>
              </button>
              <button
                type="button"
                id="btn-theme-dark-mode"
                onClick={handleSetDarkMode}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isDark
                    ? 'text-white shadow-xs font-bold'
                    : 'text-[#756D65] hover:text-[#292522]'
                }`}
                style={isDark ? { backgroundColor: activeTheme.primaryColor } : undefined}
                title="Switch to Espresso Dark Mode"
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="text-[11px]">Dark</span>
              </button>
            </div>
          </div>

          {/* Theme Options Grid */}
          <div className="py-3 space-y-2 max-h-80 overflow-y-auto pr-1">
            <div className={`text-[10px] font-mono uppercase tracking-wider font-semibold px-1 mb-1 ${
              isDark ? 'text-[#A3988E]' : 'text-[#756D65]'
            }`}>
              Color Palette Presets
            </div>
            {THEME_LIST.map((th: ThemeDefinition) => {
              const isSelected = th.id === currentTheme;
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => {
                    onSelectTheme(th.id);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? isDark
                        ? 'bg-[#322A26] shadow-sm font-semibold'
                        : 'bg-[#F8F3EC] shadow-sm font-semibold'
                      : isDark
                      ? 'border-[#3E352F] bg-[#211C19] hover:bg-[#2D2622] hover:border-[#4E443C]'
                      : 'border-[#DDD4CA] bg-[#F8F3EC]/50 hover:bg-[#EEE7DE] hover:border-[#C4B9AE]'
                  }`}
                  style={{
                    borderColor: isSelected ? th.primaryColor : undefined,
                    borderWidth: isSelected ? '2px' : '1px',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs transition-transform"
                      style={{ backgroundColor: th.primaryColor }}
                    >
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold leading-tight">{th.name}</span>
                        {th.tag && (
                          <span
                            className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider"
                            style={{
                              backgroundColor: `${th.primaryColor}22`,
                              color: th.primaryColor,
                              border: `1px solid ${th.primaryColor}55`,
                            }}
                          >
                            {th.tag}
                          </span>
                        )}
                      </div>
                      <p className={`text-[10px] leading-snug line-clamp-1 mt-0.5 ${
                        isDark ? 'text-[#A3988E]' : 'text-[#756D65]'
                      }`}>
                        {th.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="w-4 h-4 rounded-full border border-black/15 shadow-2xs shrink-0"
                      style={{ backgroundColor: th.primaryColor }}
                    />
                    {isSelected ? (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white shadow-2xs"
                        style={{ backgroundColor: th.primaryColor }}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-dashed border-gray-400/40" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Palette Preview Footer */}
          <div className={`pt-3 flex items-center justify-between text-[11px] ${
            isDark ? 'text-[#A3988E]' : 'text-[#756D65]'
          }`}>
            <span>
              Active: <strong className={isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}>{activeTheme.name}</strong>
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold">
              <span className="w-2.5 h-2.5 rounded-full shadow-2xs" style={{ backgroundColor: activeTheme.primaryColor }} />
              {activeTheme.primaryColor}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
