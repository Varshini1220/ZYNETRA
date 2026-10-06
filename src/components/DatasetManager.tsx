import { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Database,
  Globe,
  Clock,
  History,
  CheckCircle2,
  FileText,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { parseCSV, parseExcelFile } from '../utils/dataProcessor';
import { ENTERPRISE_DATASETS, EnterprisePreset } from '../data/sampleDatasets';
import { DatasetProfile, CleaningAction, DatasetVersion } from '../types';

interface DatasetManagerProps {
  currentProfile: DatasetProfile;
  versions: DatasetVersion[];
  onDatasetLoaded: (
    profile: DatasetProfile,
    cleaningActions: CleaningAction[],
    rawRows: Record<string, any>[],
    preset?: EnterprisePreset
  ) => void;
  onRestoreVersion: (v: DatasetVersion) => void;
  isDark?: boolean;
}

export default function DatasetManager({
  currentProfile,
  versions,
  onDatasetLoaded,
  onRestoreVersion,
  isDark: _isDark,
}: DatasetManagerProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'samples' | 'database' | 'api' | 'history'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Database Connection Form State
  const [dbType, setDbType] = useState<'postgresql' | 'mysql' | 'sqlserver'>('postgresql');
  const [dbHost, setDbHost] = useState('db.enterprise-analytics.internal');
  const [dbPort, setDbPort] = useState('5432');
  const [dbName, setDbName] = useState('production_bi_warehouse');
  const [dbUser, setDbUser] = useState('zynetra_read_replica');
  const [dbConnecting, setDbConnecting] = useState(false);
  const [dbResult, setDbResult] = useState<{ success: boolean; message: string } | null>(null);

  // REST API Form State
  const [apiUrl, setApiUrl] = useState('https://api.segment.io/v1/tracks');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST'>('GET');
  const [apiAuth, setApiAuth] = useState('Bearer sec_live_9941a8fe1023c...');
  const [apiInterval, setApiInterval] = useState('1h');
  const [apiConnecting, setApiConnecting] = useState(false);
  const [apiResult, setApiResult] = useState<{ success: boolean; message: string } | null>(null);

  // Handle local file upload
  const handleFile = async (file: File) => {
    setUploadStatus(`Parsing ${file.name}...`);
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
        throw new Error('Please upload a valid .csv, .xlsx, .xls, or .tsv file.');
      }

      if (!rows || rows.length === 0) {
        throw new Error('No readable data records found in uploaded file. Please ensure column headers are in the first row.');
      }

      setUploadStatus('Running autonomous schema profiling & anomaly diagnostics...');

      const { profileDataset, generateAutonomousCleaning } = await import('../utils/dataProcessor');
      const profile = profileDataset(file.name.replace(/\.[^/.]+$/, ''), rows);
      const cleaning = generateAutonomousCleaning(profile, rows);

      setTimeout(() => {
        setUploadStatus(null);
        onDatasetLoaded(profile, cleaning, rows);
      }, 600);
    } catch (err: any) {
      setUploadStatus(null);
      alert(err?.message || 'Error parsing file.');
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Test Database Connection Simulator
  const handleTestDatabase = () => {
    setDbConnecting(true);
    setDbResult(null);
    setTimeout(() => {
      setDbConnecting(false);
      setDbResult({
        success: true,
        message: `Connected securely to ${dbHost}:${dbPort}/${dbName}. SSL verified. Ready for streaming table ingest.`,
      });
    }, 1200);
  };

  // Test API Connection Simulator
  const handleTestApi = () => {
    setApiConnecting(true);
    setApiResult(null);
    setTimeout(() => {
      setApiConnecting(false);
      setApiResult({
        success: true,
        message: `Endpoint verified. Response: 200 OK. JSON schema mapped to 18 columnar features. Polling set to every ${apiInterval}.`,
      });
    }, 1100);
  };

  return (
    <div className="space-y-8 font-sans text-[#292522] animate-subtle-fade">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-[#DDD4CA] pb-5 sm:pb-6">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#49362F] font-semibold">
            Ingestion &amp; Connectors
          </span>
          <h3 className="text-xl sm:text-3xl font-bold text-[#292522] mt-1">
            Data Connectors &amp; Version History
          </h3>
          <p className="text-xs text-[#756D65] mt-1">
            Ingest enterprise tabular data, connect cloud warehouses, or select calibrated strategic presets.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#756D65] self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-[#49362F]" />
          <span>Scheduled Refresh: Every 24h</span>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-lg border border-[#DDD4CA] shadow-2xs w-full sm:w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'upload'
              ? 'bg-[#49362F] text-white font-semibold'
              : 'text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload CSV / Excel</span>
        </button>

        <button
          onClick={() => setActiveTab('samples')}
          className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'samples'
              ? 'bg-[#49362F] text-white font-semibold'
              : 'text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Calibrated Presets</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'database'
              ? 'bg-[#49362F] text-white font-semibold'
              : 'text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>SQL Database</span>
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'api'
              ? 'bg-[#49362F] text-white font-semibold'
              : 'text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>REST API Feed</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'history'
              ? 'bg-[#49362F] text-white font-semibold'
              : 'text-[#756D65] hover:text-[#292522] hover:bg-[#EEE7DE]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Version History ({versions.length})</span>
        </button>
      </div>

      {/* Tab 1: Upload CSV / Excel */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 sm:p-12 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-[#49362F] bg-[#49362F]/5'
                : 'border-[#DDD4CA] hover:border-[#49362F] bg-white hover:bg-[#F8F3EC]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls,.tsv,.txt"
              className="hidden"
              onChange={e => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFile(e.target.files[0]);
                  e.target.value = '';
                }
              }}
            />
            <div className="w-12 h-12 mx-auto rounded-lg bg-[#EEE7DE] flex items-center justify-center text-[#49362F] mb-4">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl text-[#292522] mb-2 font-bold">
              Select or drop your business dataset here
            </h3>
            <p className="text-xs text-[#756D65] max-w-md mx-auto mb-6 leading-relaxed">
              Supports CSV, Excel (.xlsx, .xls), or delimited TSV. Zynetra autonomously performs schema typing,
              anomaly flagging, missing value handling, and predictive generation.
            </p>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Select File from Computer</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#DDD4CA] text-xs text-[#756D65] shadow-xs">
            <span>Want to test with a clean multi-column template?</span>
            <button
              type="button"
              onClick={() => {
                const csvContent =
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
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'sample_saas_metrics.csv';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="text-[#49362F] hover:underline font-semibold transition-colors"
            >
              Download Sample CSV Template &rarr;
            </button>
          </div>

          {uploadStatus && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-[#EEE7DE] border border-[#DDD4CA] text-xs text-[#292522]">
              <Sparkles className="w-4 h-4 text-[#A56F5D] animate-spin" />
              <span>{uploadStatus}</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Enterprise Presets */}
      {activeTab === 'samples' && (
        <div className="space-y-6">
          <p className="text-xs text-[#756D65]">
            Load pre-calibrated multi-quarter enterprise datasets with pre-calculated telemetry, real-world anomalies,
            and complete root-cause cause trees:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ENTERPRISE_DATASETS.map(preset => (
              <div
                key={preset.id}
                className={`p-6 sm:p-7 rounded-xl border transition-all ${
                  currentProfile.id.includes(preset.id)
                    ? 'border-[#49362F] bg-white ring-1 ring-[#49362F] shadow-sm'
                    : 'border-[#DDD4CA] bg-white shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider bg-[#EEE7DE] text-[#756D65] border border-[#DDD4CA]">
                    {preset.domain}
                  </span>
                  <span className="text-[11px] text-[#7B8570] font-mono font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {preset.profile.totalRows.toLocaleString()} Rows &bull; 100% Calibrated
                  </span>
                </div>
                <h4 className="text-xl sm:text-2xl text-[#292522] mb-1 font-bold">{preset.name}</h4>
                <p className="text-xs text-[#756D65] mb-4 leading-relaxed line-clamp-2">{preset.description}</p>
                <div className="text-xs text-[#292522] bg-[#F8F3EC] p-3.5 rounded-lg border border-[#DDD4CA] mb-5">
                  <span className="font-mono text-[10px] uppercase text-[#A56F5D] block mb-0.5 font-semibold">Objective Directive:</span>
                  <span className="font-semibold">{preset.objective}</span>
                </div>
                <button
                  onClick={() => {
                    const rows = parseCSV(preset.rawCsv);
                    onDatasetLoaded(preset.profile, preset.cleaningActions, rows, preset);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load {preset.name}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: SQL Database Connectors */}
      {activeTab === 'database' && (
        <div className="p-6 sm:p-8 rounded-xl border border-[#DDD4CA] bg-white shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xl sm:text-2xl font-bold text-[#292522]">Enterprise Database Connector</h4>
              <p className="text-xs text-[#756D65] mt-1">Stream records directly from production read-replicas or data warehouses.</p>
            </div>
            <div className="flex gap-1.5 p-1 bg-[#F8F3EC] rounded-lg border border-[#DDD4CA]">
              {(['postgresql', 'mysql', 'sqlserver'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setDbType(type)}
                  className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                    dbType === type
                      ? 'bg-white text-[#292522] font-semibold shadow-xs'
                      : 'text-[#756D65] hover:text-[#292522]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-xs font-mono uppercase text-[#756D65] mb-1 font-semibold">Host Endpoint</label>
              <input
                type="text"
                value={dbHost}
                onChange={e => setDbHost(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] text-[#292522] focus:outline-none focus:border-[#49362F]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[#756D65] mb-1 font-semibold">Port</label>
              <input
                type="text"
                value={dbPort}
                onChange={e => setDbPort(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] text-[#292522] focus:outline-none focus:border-[#49362F]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[#756D65] mb-1 font-semibold">Database Name</label>
              <input
                type="text"
                value={dbName}
                onChange={e => setDbName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] text-[#292522] focus:outline-none focus:border-[#49362F]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[#756D65] mb-1 font-semibold">Read-Only Username</label>
              <input
                type="text"
                value={dbUser}
                onChange={e => setDbUser(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] text-[#292522] focus:outline-none focus:border-[#49362F]"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#DDD4CA]">
            <div className="text-xs text-[#7B8570] flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>TLS / SSL Encryption enforced on all queries</span>
            </div>
            <button
              onClick={handleTestDatabase}
              disabled={dbConnecting}
              className="px-5 py-2.5 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white font-semibold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 shadow-2xs"
            >
              {dbConnecting ? 'Testing Connection...' : 'Test Connection & Ingest'}
            </button>
          </div>

          {dbResult && (
            <div className="p-4 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#7B8570] shrink-0" />
              <span className="text-[#292522] font-medium">{dbResult.message}</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: REST API Connector */}
      {activeTab === 'api' && (
        <div className="p-6 sm:p-8 rounded-xl border border-[#DDD4CA] bg-white shadow-xs space-y-6">
          <div>
            <h4 className="text-xl sm:text-2xl font-bold text-[#292522]">REST API / Webhook Connector</h4>
            <p className="text-xs text-[#756D65] mt-1">Ingest real-time JSON payloads from cloud microservices, billing streams, or CRM webhooks.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex gap-2">
              <select
                value={apiMethod}
                onChange={e => setApiMethod(e.target.value as any)}
                className="px-3 py-2 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] text-[#292522] font-mono font-semibold"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
              <input
                type="text"
                value={apiUrl}
                onChange={e => setApiUrl(e.target.value)}
                placeholder="https://api.domain.com/v1/metrics"
                className="flex-1 px-3 py-2 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] text-[#292522] font-mono focus:outline-none focus:border-[#49362F]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#756D65] mb-1 font-semibold">Authorization Header</label>
              <input
                type="text"
                value={apiAuth}
                onChange={e => setApiAuth(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] text-[#292522] font-mono focus:outline-none focus:border-[#49362F]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#756D65] mb-1 font-semibold">Sync Frequency</label>
                <select
                  value={apiInterval}
                  onChange={e => setApiInterval(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] text-[#292522]"
                >
                  <option value="15m">Every 15 Minutes</option>
                  <option value="1h">Every 1 Hour</option>
                  <option value="6h">Every 6 Hours</option>
                  <option value="24h">Daily (Midnight UTC)</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleTestApi}
                  disabled={apiConnecting}
                  className="w-full py-2.5 rounded-lg bg-[#49362F] hover:bg-[#3A2B25] text-white font-semibold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 shadow-2xs"
                >
                  {apiConnecting ? 'Verifying Schema...' : 'Verify Endpoint & Connect'}
                </button>
              </div>
            </div>
          </div>

          {apiResult && (
            <div className="p-4 rounded-lg border border-[#DDD4CA] bg-[#F8F3EC] text-xs text-[#292522] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#7B8570] shrink-0" />
              <span className="font-medium">{apiResult.message}</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Version History */}
      {activeTab === 'history' && (
        <div className="p-6 sm:p-8 rounded-xl border border-[#DDD4CA] bg-white shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#DDD4CA] pb-4">
            <div>
              <h4 className="text-xl sm:text-2xl font-bold text-[#292522]">Dataset Version Audit Trail</h4>
              <p className="text-xs text-[#756D65] mt-1">Immutable snapshots of raw and autonomously transformed dataset versions.</p>
            </div>
            <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#EEE7DE] text-[#292522] border border-[#DDD4CA] font-semibold">
              Current: {currentProfile.version}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#DDD4CA] text-[#756D65] font-mono text-[11px] uppercase">
                  <th className="py-3 px-3 font-semibold">Version Tag</th>
                  <th className="py-3 px-3 font-semibold">Timestamp</th>
                  <th className="py-3 px-3 font-semibold">Transform Description</th>
                  <th className="py-3 px-3 font-semibold">Records</th>
                  <th className="py-3 px-3 font-semibold">Quality Index</th>
                  <th className="py-3 px-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD4CA]/60">
                {versions.map((ver, idx) => (
                  <tr key={idx} className={ver.active ? 'bg-[#F8F3EC]' : ''}>
                    <td className="py-3.5 px-3 font-semibold text-[#292522] flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-[#49362F]" />
                      <span>{ver.version}</span>
                      {ver.active && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-[#E8EBE1] text-[#7B8570] border border-[#7B8570]/30">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-[#756D65] font-mono">{ver.timestamp}</td>
                    <td className="py-3.5 px-3 text-[#292522]">{ver.description}</td>
                    <td className="py-3.5 px-3 font-mono text-[#292522]">{ver.rowCount.toLocaleString()}</td>
                    <td className="py-3.5 px-3">
                      <span className="font-mono font-semibold text-[#7B8570]">{ver.qualityScore}/100</span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {!ver.active ? (
                        <button
                          onClick={() => onRestoreVersion(ver)}
                          className="px-2.5 py-1 rounded-md border border-[#DDD4CA] hover:bg-[#EEE7DE] text-[#292522] text-xs font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Rollback</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#756D65] italic">In Use</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
