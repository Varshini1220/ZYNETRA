import { useEffect, useState } from 'react';
import ZynetraLogo from './ZynetraLogo';

interface StartupAnimationProps {
  onComplete: () => void;
}

export default function StartupAnimation({ onComplete }: StartupAnimationProps) {
  const [phase, setPhase] = useState<'entering' | 'present' | 'exiting'>('entering');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase('present');
    }, 150);

    const t2 = setTimeout(() => {
      setPhase('exiting');
    }, 1100);

    const t3 = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F5F0E9] cursor-pointer transition-opacity duration-400 ${
        phase === 'exiting' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div
        className={`flex flex-col items-center text-center transition-all duration-500 ease-out transform ${
          phase === 'entering'
            ? 'opacity-0 scale-98 translate-y-1.5'
            : phase === 'present'
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-[1.01] -translate-y-1'
        }`}
      >
        <ZynetraLogo size="xl" showSubtitle={false} />

        <p className="mt-4 font-sans text-sm font-medium text-[#756D65] tracking-tight">
          Autonomous intelligence for decisions that matter.
        </p>

        <div className="mt-7 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#A56F5D]" />
          <span className="text-[11px] uppercase tracking-[0.18em] text-[#756D65] font-mono">
            Initializing Intelligence Platform
          </span>
        </div>
      </div>

      <div className="absolute bottom-8 text-[11px] text-[#756D65] tracking-wider uppercase opacity-60 hover:opacity-100 transition-opacity">
        Press anywhere to skip
      </div>
    </div>
  );
}
