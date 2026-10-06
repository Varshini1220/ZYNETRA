import React from 'react';

interface ZynetraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  inverted?: boolean;
}

export default function ZynetraLogo({
  className = '',
  size = 'md',
  showSubtitle = false,
  inverted = false,
}: ZynetraLogoProps) {
  const sizeMap = {
    sm: { mark: 22, text: 'text-sm', sub: 'text-[9px]' },
    md: { mark: 28, text: 'text-base', sub: 'text-[10px]' },
    lg: { mark: 36, text: 'text-xl', sub: 'text-[11px]' },
    xl: { mark: 48, text: 'text-2xl', sub: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Earthy Precision Emblem */}
      <svg
        width={currentSize.mark}
        height={currentSize.mark}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200"
      >
        {/* Subtle geometric dark earth frame */}
        <rect
          x="1"
          y="1"
          width="30"
          height="30"
          rx="6"
          fill={inverted ? '#FFFFFF' : '#292522'}
        />
        {/* Precision diagonal and diamond motif in muted terracotta */}
        <path
          d="M8 9.5H24L12 22.5H24"
          stroke={inverted ? '#49362F' : '#A56F5D'}
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="12" r="1.5" fill="#FFFFFF" opacity={inverted ? 0.3 : 0.85} />
        <circle cx="12" cy="20" r="1.5" fill="#FFFFFF" opacity={inverted ? 0.3 : 0.85} />
      </svg>

      <div className="flex flex-col">
        <span
          className={`font-bold tracking-[0.12em] uppercase transition-colors leading-none font-sans ${currentSize.text} ${
            inverted ? 'text-white' : 'text-[#292522]'
          }`}
        >
          Zynetra
        </span>
        {showSubtitle && (
          <span
            className={`font-medium tracking-[0.16em] uppercase leading-tight mt-1 text-[#756D65] ${currentSize.sub}`}
          >
            Autonomous Intelligence
          </span>
        )}
      </div>
    </div>
  );
}
