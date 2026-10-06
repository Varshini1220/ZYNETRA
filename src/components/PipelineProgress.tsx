import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Loader2,
  Cpu,
  Database,
  Search,
  Sparkles,
  GitBranch,
  TrendingUp,
  FastForward,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PipelineProgressProps {
  isRunning: boolean;
  onComplete: () => void;
  isDark: boolean;
}

interface Step {
  id: number;
  name: string;
  category: string;
  icon: any;
  log: string;
}

const PIPELINE_STEPS: Step[] = [
  {
    id: 1,
    name: 'Ingestion & Dynamic Schema Typing',
    category: 'Ingestion',
    icon: Database,
    log: 'Scanning columnar signatures... 10 features detected: 5 numerical, 3 categorical, 1 datetime, 1 identifier.',
  },
  {
    id: 2,
    name: 'Autonomous Profiling & Anomaly Detection',
    category: 'Profiling',
    icon: Search,
    log: 'Computing parametric moments (mean, stdDev, IQR). Flagged 38 duplicate rows and 94 temporal boundary anomalies.',
  },
  {
    id: 3,
    name: 'Intelligent Cleansing & Imputation',
    category: 'Cleansing',
    icon: Sparkles,
    log: 'Executing 5 cleaning rules. Applied mode imputation for PlanTier and Winsorization on LastActiveDays.',
  },
  {
    id: 4,
    name: 'Analytical Technique Selection',
    category: 'Selection',
    icon: Cpu,
    log: 'Objective analyzed. Activated Diagnostic Variance, Pearson Correlation, and Holt-Winters Time-Series models.',
  },
  {
    id: 5,
    name: 'Root-Cause Cause Tree Decomposition',
    category: 'Diagnostic ML',
    icon: GitBranch,
    log: 'Synthesizing evidence-backed cause tree. Isolated 48% deviation driver to support latency post-v4.2 release.',
  },
  {
    id: 6,
    name: 'Predictive Forecast & Decision Synthesis',
    category: 'Prescriptive',
    icon: TrendingUp,
    log: 'Computed 4-quarter forecast with 95% confidence intervals. Prioritized 3 high-ROI recommendations.',
  },
];

export default function PipelineProgress({ isRunning, onComplete }: PipelineProgressProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!isRunning) {
      setCurrentStep(1);
      setLogs([]);
      return;
    }

    let step = 1;
    setLogs([`[ZYNETRA ENGINE INITIALIZED] Ingesting telemetry pipeline at ${new Date().toLocaleTimeString()}...`]);

    const interval = setInterval(() => {
      step++;
      if (step <= PIPELINE_STEPS.length) {
        setCurrentStep(step);
        const currentStepObj = PIPELINE_STEPS[step - 1];
        setLogs(prev => [...prev, `[STAGE ${step}/${PIPELINE_STEPS.length}] ${currentStepObj.log}`]);
      } else {
        clearInterval(interval);
        setLogs(prev => [...prev, `[COMPLETE] Autonomous analytics pipeline finished in 3.4s. Dashboards and reports ready!`]);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        setTimeout(() => {
          onComplete();
        }, 800);
      }
    }, 650);

    return () => clearInterval(interval);
  }, [isRunning, onComplete]);

  if (!isRunning) return null;

  const handleFastForward = () => {
    setCurrentStep(PIPELINE_STEPS.length);
    setLogs(prev => [
      ...prev,
      `[USER FAST-FORWARD] Instant compilation completed. Rendering all analytical surfaces.`,
    ]);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    setTimeout(() => onComplete(), 300);
  };

  return (
    <div className="p-6 rounded-xl border border-[#DDD4CA] bg-white text-[#292522] shadow-xs space-y-5 animate-subtle-fade font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#49362F] flex items-center justify-center text-white shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              <span>Autonomous Analytics Pipeline Executing</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] bg-[#EEE7DE] text-[#49362F] border border-[#DDD4CA] font-mono font-semibold">
                Stage {currentStep} of {PIPELINE_STEPS.length}
              </span>
            </h3>
            <p className="text-xs text-[#756D65]">
              Synthesizing diagnostics, statistical correlations, and prescriptive cause trees.
            </p>
          </div>
        </div>

        <button
          onClick={handleFastForward}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] hover:bg-[#EEE7DE] text-xs font-semibold text-[#292522] transition-colors self-start sm:self-auto"
        >
          <FastForward className="w-3.5 h-3.5 text-[#756D65]" />
          <span>Instant Complete</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#EEE7DE] rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full bg-[#49362F] transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / PIPELINE_STEPS.length) * 100}%` }}
        />
      </div>

      {/* Step Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        {PIPELINE_STEPS.map((s) => {
          const isDone = currentStep > s.id;
          const isCurrent = currentStep === s.id;
          const Icon = s.icon;

          return (
            <div
              key={s.id}
              className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-colors ${
                isDone
                  ? 'border-[#7B8570]/30 bg-[#E8EBE1] text-[#7B8570]'
                  : isCurrent
                  ? 'border-[#49362F] bg-[#EEE7DE] text-[#49362F] font-semibold'
                  : 'border-[#DDD4CA] bg-[#F8F3EC] text-[#756D65]'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#7B8570]" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 shrink-0 animate-spin text-[#49362F]" />
              ) : (
                <Icon className="w-4 h-4 shrink-0 text-[#756D65]" />
              )}
              <span className="truncate text-[11px] font-medium">{s.category}</span>
            </div>
          );
        })}
      </div>

      {/* Live Log Terminal */}
      <div className="p-3.5 rounded-lg bg-[#F8F3EC] border border-[#DDD4CA] font-mono text-[11px] text-[#756D65] max-h-28 overflow-y-auto space-y-1">
        {logs.map((log, idx) => (
          <div key={idx} className="leading-snug">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
