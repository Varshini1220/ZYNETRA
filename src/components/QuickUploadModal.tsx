import { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Database,
  Download,
} from 'lucide-react';
import { parseCSV, parseExcelFile, profileDataset, generateAutonomousCleaning } from '../utils/dataProcessor';
import { DatasetProfile, CleaningAction } from '../types';

interface QuickUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDatasetLoaded: (profile: DatasetProfile, actions: CleaningAction[], rows: Record<string, any>[]) => void;
  onNavigateToDashboard?: () => void;
  isDark?: boolean;
}

export default function QuickUploadModal({
  isOpen,
  onClose,
  onDatasetLoaded,
  onNavigateToDashboard,
  isDark: _isDark,
}: QuickUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadedSummary, setLoadedSummary] = useState<{ fileName: string; rows: number; cols: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processFile = async (file: File) => {
    setError(null);
    setIsProcessing(true);
    setStatus(`Reading ${file.name}...`);

    try {
      let rows: Record<string, any>[] = [];
      const lower = file.name.toLowerCase();

      if (lower.endsWith('.csv') || lower.endsWith('.txt') || lower.endsWith('.tsv')) {
        const text = await file.text();
        rows = parseCSV(text);
      } else if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) {
        const buffer = await file.arrayBuffer();
        rows = parseExcelFile(buffer);
      } else {
        throw new Error('Unsupported format. Please upload a .csv, .xlsx, .xls, or .tsv file.');
      }

      if (!rows || rows.length === 0) {
        throw new Error('No data rows detected. Ensure the first row has column headers.');
      }

      setStatus(`Profiling ${rows.length.toLocaleString()} rows across columns...`);

      const datasetName = file.name.replace(/\.[^/.]+$/, '');
      const profile = profileDataset(datasetName, rows);

      setStatus('Computing statistical moments & causal anomalies...');
      const cleaning = generateAutonomousCleaning(profile, rows);

      setLoadedSummary({
        fileName: file.name,
        rows: rows.length,
        cols: profile.columns.length,
      });

      onDatasetLoaded(profile, cleaning, rows);
      setIsProcessing(false);
      setStatus(null);
    } catch (err: any) {
      console.error('File parsing failed:', err);
      setError(err?.message || 'Could not parse dataset. Please check the file formatting.');
      setIsProcessing(false);
      setStatus(null);
    }
  };

  const downloadSampleCsv = () => {
    const sampleCsv =
      'Date,Customer_ID,Account_Name,Region,Tier,MRR,Support_Tickets,Resolution_Time_Hours,NPS_Score,Churned\n' +
      '2024-01-15,CUST-101,Acme Global,North America,Enterprise,4500,2,3.2,9,No\n' +
      '2024-01-18,CUST-102,TechFlow Inc,EMEA,Mid-Market,1850,5,8.4,6,Yes\n' +
      '2024-01-20,CUST-103,Apex Systems,APAC,Enterprise,5200,1,2.1,10,No\n' +
      '2024-01-22,CUST-104,Starlight Media,North America,Startup,650,4,12.5,4,Yes\n' +
      '2024-01-25,CUST-105,Nexus Robotics,EMEA,Enterprise,6100,0,1.5,9,No\n' +
      '2024-01-28,CUST-106,Beacon Financial,LATAM,Mid-Market,2200,3,6.2,7,No\n' +
      '2024-02-01,CUST-107,Vanguard Logistics,North America,Enterprise,7800,6,14.8,3,Yes\n' +
      '2024-02-04,CUST-108,Crestview Health,APAC,Enterprise,3900,1,2.8,8,No\n' +
      '2024-02-08,CUST-109,Delta Dynamics,EMEA,Startup,450,2,4.0,8,No\n' +
      '2024-02-12,CUST-110,Vertex Analytics,North America,Mid-Market,2950,4,9.1,5,Yes\n';

    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'zynetra_sample_churn_dataset.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      id="quick-upload-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/40 backdrop-blur-xs font-sans animate-subtle-fade overflow-y-auto"
      onClick={e => {
        if (e.target === e.currentTarget && !isProcessing) onClose();
      }}
    >
      <div
        id="quick-upload-modal-card"
        className="w-full max-w-xl rounded-xl border border-[#DDD4CA] p-4 sm:p-8 bg-white text-[#292522] shadow-xl relative transition-all my-4 sm:my-8 max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DDD4CA] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#EEE7DE] flex items-center justify-center text-[#49362F]">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#292522] flex items-center gap-2">
                <span>Upload Custom Telemetry Corpus</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-[#EEE7DE] text-[#49362F] font-semibold border border-[#DDD4CA]">
                  CSV / Excel
                </span>
              </h2>
              <p className="text-xs text-[#756D65]">
                Zynetra infers schema types, cleans outliers, and constructs causal decision trees.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dropzone */}
        {!loadedSummary ? (
          <div
            id="modal-dropzone"
            onDragOver={e => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={e => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                processFile(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[#49362F] bg-[#49362F]/5 scale-[0.99]'
                : 'border-[#DDD4CA] bg-[#F8F3EC] hover:bg-[#EEE7DE]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls,.tsv,.txt"
              className="hidden"
              onChange={e => {
                if (e.target.files && e.target.files.length > 0) {
                  processFile(e.target.files[0]);
                  e.target.value = '';
                }
              }}
            />

            <div className="w-12 h-12 mx-auto rounded-lg bg-white border border-[#DDD4CA] flex items-center justify-center text-[#49362F] mb-3">
              <FileSpreadsheet className="w-6 h-6" />
            </div>

            <h3 className="text-sm font-bold text-[#292522] mb-1">
              Select or drop your business dataset here
            </h3>
            <p className="text-xs text-[#756D65] max-w-sm mx-auto mb-4">
              Supports CSV, Excel (.xlsx / .xls), or TSV files. Column delimiters are inferred automatically.
            </p>

            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Select File from Computer</span>
            </button>
          </div>
        ) : (
          /* Success Card */
          <div className="p-6 rounded-xl border border-[#7B8570]/30 bg-[#E8EBE1] text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-white border border-[#7B8570]/30 flex items-center justify-center text-[#7B8570]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#292522] mb-1">
                Dataset Ingested &amp; Synthesized
              </h3>
              <p className="text-xs text-[#7B8570] font-mono font-semibold">
                {loadedSummary.fileName} &bull; {loadedSummary.rows.toLocaleString()} Rows &bull; {loadedSummary.cols} Columns
              </p>
              <p className="text-xs text-[#756D65] mt-2 max-w-md mx-auto">
                Autonomous statistical profiling complete: Generated real KPIs, feature correlations, root-cause trees, and actionable interventions.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  if (onNavigateToDashboard) onNavigateToDashboard();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs"
              >
                <span>View in Autonomous Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLoadedSummary(null)}
                className="px-4 py-2.5 rounded-lg border border-[#DDD4CA] bg-white text-[#292522] text-xs font-semibold hover:bg-[#EEE7DE] transition-colors"
              >
                Upload Another File
              </button>
            </div>
          </div>
        )}

        {/* Status / Spinner */}
        {isProcessing && (
          <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-[#EEE7DE] border border-[#DDD4CA] text-xs text-[#49362F] animate-pulse">
            <Sparkles className="w-4 h-4 text-[#A56F5D] animate-spin" />
            <span>{status || 'Processing file...'}</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 flex items-start gap-2.5 p-3 rounded-lg bg-[#A56F5D]/10 border border-[#A56F5D]/20 text-xs text-[#A56F5D]">
            <AlertCircle className="w-4 h-4 text-[#A56F5D] shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Footer with sample dataset download */}
        <div className="mt-6 pt-4 border-t border-[#DDD4CA] flex items-center justify-between text-xs text-[#756D65]">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-[#756D65]" />
            <span>Need a test file?</span>
          </div>
          <button
            onClick={downloadSampleCsv}
            className="flex items-center gap-1.5 text-[#49362F] hover:underline font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Sample CSV Template</span>
          </button>
        </div>
      </div>
    </div>
  );
}
