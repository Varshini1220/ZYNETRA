import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Database,
  GitBranch,
  Activity,
  CheckSquare,
  Radio,
  FileText,
  UploadCloud,
  Sparkles,
  RefreshCw,
  Info,
  ShieldCheck,
  Presentation,
  ChevronRight,
} from 'lucide-react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DatasetManager from './components/DatasetManager';
import PipelineProgress from './components/PipelineProgress';
import DataUnderstandingCleaning from './components/DataUnderstandingCleaning';
import AutonomousDashboard from './components/AutonomousDashboard';
import RootCauseTree from './components/RootCauseTree';
import InsightCenter from './components/InsightCenter';
import PredictiveWhatIf from './components/PredictiveWhatIf';
import DecisionCenter from './components/DecisionCenter';
import NewsCorrelation from './components/NewsCorrelation';
import ReportGenerator from './components/ReportGenerator';
import SettingsModal from './components/SettingsModal';
import UserProfileModal from './components/UserProfileModal';
import AnalystDashboardPresentation from './components/AnalystDashboardPresentation';
import DashboardGenerationModal from './components/DashboardGenerationModal';
import StartupAnimation from './components/brand/StartupAnimation';
import OnboardingPage from './components/pages/OnboardingPage';
import { generateAnalystPresentationDeck } from './utils/dashboardGenerator';
import { AnalystPresentationDeck, DashboardGenerationConfig } from './types/analystDashboard';

import {
  Workspace,
  DatasetProfile,
  CleaningAction,
  AnalysisTechnique,
  PredictionPoint,
  CauseTreeNode,
  NaturalInsight,
  DecisionRecommendation,
  NewsEvent,
  DatasetVersion,
  MainTab,
} from './types';

import { ENTERPRISE_DATASETS, EnterprisePreset } from './data/sampleDatasets';
import QuickUploadModal from './components/QuickUploadModal';
import ExecutiveStoryDigest from './components/ExecutiveStoryDigest';
import InterpretabilityHelpModal from './components/InterpretabilityHelpModal';
import { ThemeId } from './types/theme';
import { THEME_DEFINITIONS } from './utils/themeConfig';
import LandingPage from './components/pages/LandingPage';
import LoginPage from './components/pages/LoginPage';
import SignUpPage from './components/pages/SignUpPage';
import ForgotPasswordPage from './components/pages/ForgotPasswordPage';
import AnalyticsOverviewPage from './components/pages/AnalyticsOverviewPage';
import { pathToTab, tabToPath, ANALYTICS_ROUTES } from './utils/navigation';
import { AuthPageState, User } from './types/auth';
import { getStoredSessionUser, logoutUser, DEFAULT_USER } from './utils/authService';
import {
  parseCSV,
  profileDataset,
  generateAutonomousCleaning,
  selectAnalysisTechniques,
  generateKpisFromData,
  generateForecastData,
  generateBreakdownFromData,
  generateHeatmapFromData,
  generateGeoDataFromData,
  generateCauseTree,
  generateNaturalInsights,
  generateRecommendations,
  generateNewsEvents,
} from './utils/dataProcessor';

export default function App() {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    const saved = (localStorage.getItem('zynetra_theme_id') || localStorage.getItem('aura_theme_id')) as ThemeId;
    return saved && THEME_DEFINITIONS[saved] ? saved : 'indigo';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    const savedMode = localStorage.getItem('zynetra_theme_mode') || localStorage.getItem('aura_theme_mode');
    if (savedMode !== null) return savedMode === 'dark';
    return false;
  });

  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isCustomDataset, setIsCustomDataset] = useState<boolean>(false);
  const [isExecutiveMode, setIsExecutiveMode] = useState<boolean>(true);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Top-Level Page Navigation: Default to core platform workspace
  const [hasSeenStartup, setHasSeenStartup] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<AuthPageState>(() => {
    return (localStorage.getItem('zynetra_current_page') as AuthPageState) || 'app';
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredSessionUser() || DEFAULT_USER);

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setIsProfileOpen(false);
    setCurrentPage('landing');
  };

  const handleToggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const handleSetDarkMode = (darkMode: boolean) => {
    setIsDark(darkMode);
  };

  const handleSelectTheme = (themeId: ThemeId) => {
    setCurrentTheme(themeId);
  };

  const activeTheme = THEME_DEFINITIONS[currentTheme] || THEME_DEFINITIONS.indigo;

  // Workspaces
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: 'ws-1',
      name: 'Global SaaS Intelligence Hub',
      organization: 'Acme Enterprise',
      createdAt: '2026-01-10',
      datasetCount: 4,
      role: 'Owner',
    },
    {
      id: 'ws-2',
      name: 'Omnichannel Logistics & Retail',
      organization: 'Apex Supply Chain',
      createdAt: '2026-02-14',
      datasetCount: 2,
      role: 'Editor',
    },
  ]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>(workspaces[0]);

  // Initial enterprise dataset preset
  const defaultPreset = ENTERPRISE_DATASETS[0];
  const [activePreset, setActivePreset] = useState<EnterprisePreset>(defaultPreset);

  // Core Data State
  const [profile, setProfile] = useState<DatasetProfile>(defaultPreset.profile);
  const [cleaningActions, setCleaningActions] = useState<CleaningAction[]>(defaultPreset.cleaningActions);
  const [analysisTechniques, setAnalysisTechniques] = useState<AnalysisTechnique[]>(
    selectAnalysisTechniques(defaultPreset.profile, defaultPreset.objective)
  );
  const [rawRows, setRawRows] = useState<Record<string, any>[]>(() => parseCSV(defaultPreset.rawCsv));

  // Analyst Presentation Deck State
  const [presentationDeck, setPresentationDeck] = useState<AnalystPresentationDeck>(() =>
    generateAnalystPresentationDeck(defaultPreset.profile, parseCSV(defaultPreset.rawCsv), activeTheme)
  );

  // Version History
  const [versions, setVersions] = useState<DatasetVersion[]>([
    {
      version: '1.0',
      timestamp: '2026-03-01 09:30 UTC',
      description: 'Raw Enterprise Ingestion via Production DB',
      rowCount: defaultPreset.profile.totalRows,
      qualityScore: 82,
      active: false,
    },
    {
      version: '1.1',
      timestamp: '2026-03-01 09:34 UTC',
      description: 'Autonomous Deduplication & Imputation Applied',
      rowCount: defaultPreset.profile.totalRows - 38,
      qualityScore: 94,
      active: true,
    },
  ]);

  // Visual & Analytical State
  const [kpis, setKpis] = useState(defaultPreset.kpis);
  const [forecastData, setForecastData] = useState<PredictionPoint[]>(defaultPreset.forecastData);
  const [breakdownData, setBreakdownData] = useState(defaultPreset.breakdownData);
  const [heatmapData, setHeatmapData] = useState(defaultPreset.heatmapData);
  const [geoData, setGeoData] = useState(defaultPreset.geoData);
  const [causeTree, setCauseTree] = useState<CauseTreeNode>(defaultPreset.causeTree);
  const [insights, setInsights] = useState<NaturalInsight[]>(defaultPreset.insights);
  const [recommendations, setRecommendations] = useState<DecisionRecommendation[]>(defaultPreset.recommendations);
  const [news, setNews] = useState<NewsEvent[]>(defaultPreset.newsEvents);

  // Objective & Pipeline State
  const [objective, setObjective] = useState<string>(defaultPreset.objective);
  const [isPipelineRunning, setIsPipelineRunning] = useState<boolean>(false);

  // Active Main Navigation Tab synchronized with real URL paths
  const [activeTab, setActiveTab] = useState<MainTab>(() => {
    return pathToTab(window.location.pathname);
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const mainScrollRef = useRef<HTMLDivElement>(null);

  // Synchronize route changes with browser back/forward and History API
  useEffect(() => {
    const handlePopState = () => {
      const tab = pathToTab(window.location.pathname);
      setActiveTab(tab);
      if (mainScrollRef.current) {
        mainScrollRef.current.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Proper scroll restoration: whenever activeTab changes, reset scroll position to top
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [activeTab]);

  // Navigate to an analytics module page and update URL route
  const handleNavigateTab = (tab: MainTab) => {
    const targetPath = tabToPath(tab);
    try {
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ tab }, '', targetPath);
      }
    } catch (e) {
      // Ignore sandboxed iframe history errors
    }
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  };

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Theme synchronization with document, localStorage & presentationDeck
  useEffect(() => {
    try {
      localStorage.setItem('zynetra_theme_id', currentTheme);
      localStorage.setItem('zynetra_theme_mode', isDark ? 'dark' : 'light');
    } catch (e) {
      // Ignore localStorage failure in sandboxed iframes
    }
    document.documentElement.setAttribute('data-theme', currentTheme);

    const themeDef = THEME_DEFINITIONS[currentTheme] || THEME_DEFINITIONS.indigo;
    const root = document.documentElement;

    // Set dynamic theme CSS variables so the whole app colors change immediately
    root.style.setProperty('--theme-primary', isDark ? themeDef.darkPrimaryColor : themeDef.primaryColor);
    root.style.setProperty('--theme-primary-hover', isDark ? themeDef.darkPrimaryHover : themeDef.primaryHover);
    root.style.setProperty('--theme-primary-subtle', isDark ? themeDef.darkPrimaryLight : themeDef.primaryLight);
    root.style.setProperty('--theme-text', isDark ? themeDef.darkTextColor : themeDef.primaryColor);
    root.style.setProperty('--theme-secondary', isDark ? themeDef.darkSecondaryColor : themeDef.secondaryColor);
    root.style.setProperty('--theme-chart', isDark ? themeDef.darkChartColor : themeDef.chartColor);

    if (isDark) {
      document.documentElement.classList.add('dark');
      root.style.setProperty('--bg-primary', '#181513');
      root.style.setProperty('--bg-secondary', '#211C19');
      root.style.setProperty('--bg-card', '#26201D');
      root.style.setProperty('--bg-elevated', '#211C19');
      root.style.setProperty('--bg-input', '#181513');
      root.style.setProperty('--cream', '#211C19');
      root.style.setProperty('--text-primary', '#EDE6DE');
      root.style.setProperty('--text-secondary', '#A3988E');
      root.style.setProperty('--border-subtle', '#3E352F');
      root.style.setProperty('--dark-earth', '#D5BDA7');
      root.style.setProperty('--warm-brown', '#C4A494');
      root.style.setProperty('--terracotta', '#C48C7B');
      root.style.setProperty('--muted-sage', '#96A588');
      root.style.setProperty('--very-light-sage', 'rgba(123, 133, 112, 0.18)');
      document.body.className = 'bg-[#181513] text-[#EDE6DE] min-h-screen selection:text-white transition-colors duration-200';
    } else {
      document.documentElement.classList.remove('dark');
      root.style.setProperty('--bg-primary', '#F5F0E9');
      root.style.setProperty('--bg-secondary', '#EEE7DE');
      root.style.setProperty('--bg-card', '#FFFFFF');
      root.style.setProperty('--bg-elevated', '#F8F3EC');
      root.style.setProperty('--bg-input', '#F8F3EC');
      root.style.setProperty('--cream', '#F8F3EC');
      root.style.setProperty('--text-primary', '#292522');
      root.style.setProperty('--text-secondary', '#756D65');
      root.style.setProperty('--border-subtle', '#DDD4CA');
      root.style.setProperty('--dark-earth', '#49362F');
      root.style.setProperty('--warm-brown', '#6A5045');
      root.style.setProperty('--terracotta', '#A56F5D');
      root.style.setProperty('--muted-sage', '#7B8570');
      root.style.setProperty('--very-light-sage', '#E8EBE1');
      document.body.className = 'bg-[#F5F0E9] text-[#292522] min-h-screen selection:text-white transition-colors duration-200';
    }

    setPresentationDeck(prev => generateAnalystPresentationDeck(profile, rawRows, themeDef));
  }, [currentTheme, isDark]);

  // Execute Pipeline (Triggers autonomous 6-stage engine)
  const handleRunAnalysis = async () => {
    setIsPipelineRunning(true);

    try {
      // Call server-side autonomous analysis endpoint if available
      const sampleSampleRows = rawRows.slice(0, 15);
      const res = await fetch('/api/autonomous-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetName: profile.name,
          objective,
          columns: profile.columns,
          sampleRows: sampleSampleRows,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.insights && Array.isArray(data.insights) && data.insights.length > 0) {
          setInsights(data.insights);
        }
        if (data.recommendations && Array.isArray(data.recommendations) && data.recommendations.length > 0) {
          setRecommendations(data.recommendations);
        }
        if (data.causeTree) {
          setCauseTree(data.causeTree);
        }
      }
    } catch (err) {
      console.log('Using optimized local heuristics for pipeline:', err);
    }
  };

  const handlePipelineComplete = () => {
    setIsPipelineRunning(false);
  };

  // Handle Dataset Load (from upload or sample preset)
  const handleDatasetLoaded = (
    newProfile: DatasetProfile,
    newCleaning: CleaningAction[],
    rows: Record<string, any>[],
    preset?: EnterprisePreset
  ) => {
    setProfile(newProfile);
    setCleaningActions(newCleaning);
    setRawRows(rows);

    if (preset) {
      setIsCustomDataset(false);
      setActivePreset(preset);
      setObjective(preset.objective);
      setKpis(preset.kpis);
      setForecastData(preset.forecastData);
      setBreakdownData(preset.breakdownData);
      setHeatmapData(preset.heatmapData);
      setGeoData(preset.geoData);
      setCauseTree(preset.causeTree);
      setInsights(preset.insights);
      setRecommendations(preset.recommendations);
      setNews(preset.newsEvents);
      const techs = selectAnalysisTechniques(newProfile, preset.objective);
      setAnalysisTechniques(techs);
    } else {
      // Custom uploaded file
      setIsCustomDataset(true);
      const customObjective = `Analyze performance, detect anomalies, and forecast drivers for ${newProfile.name}`;
      setObjective(customObjective);
      const techs = selectAnalysisTechniques(newProfile, customObjective);
      setAnalysisTechniques(techs);

      // Autonomously synthesize all visual and decision components from uploaded data
      const dynamicKpis = generateKpisFromData(newProfile, rows);
      setKpis(dynamicKpis);

      const dynamicForecast = generateForecastData(newProfile);
      setForecastData(dynamicForecast);

      const dynamicBreakdown = generateBreakdownFromData(newProfile, rows);
      setBreakdownData(dynamicBreakdown);

      const dynamicHeatmap = generateHeatmapFromData(newProfile, rows);
      setHeatmapData(dynamicHeatmap);

      const dynamicGeo = generateGeoDataFromData(newProfile, rows);
      setGeoData(dynamicGeo);

      const dynamicTree = generateCauseTree(newProfile, customObjective);
      setCauseTree(dynamicTree);

      const dynamicInsights = generateNaturalInsights(newProfile, rows);
      setInsights(dynamicInsights);

      const dynamicRecs = generateRecommendations(newProfile);
      setRecommendations(dynamicRecs);

      const dynamicNews = generateNewsEvents(newProfile);
      setNews(dynamicNews);
    }

    // Autonomously synthesize the analyst presentation deck for the loaded dataset
    const dynamicDeck = generateAnalystPresentationDeck(newProfile, rows, activeTheme);
    setPresentationDeck(dynamicDeck);

    // Add to version history
    setVersions(prev => [
      {
        version: `1.${prev.length}`,
        timestamp: new Date().toLocaleTimeString() + ' UTC',
        description: `Autonomous ingestion & profiling of ${newProfile.name}`,
        rowCount: newProfile.totalRows,
        qualityScore: newProfile.overallQualityScore,
        active: true,
      },
      ...prev.map(v => ({ ...v, active: false })),
    ]);

    setActiveTab('dashboard');
  };

  // Toggle individual cleaning action (Undo / Reapply)
  const handleToggleCleaningAction = (actionId: string) => {
    setCleaningActions(prev =>
      prev.map(act => {
        if (act.id === actionId) {
          return { ...act, applied: !act.applied };
        }
        return act;
      })
    );
  };

  // Rollback to previous version
  const handleRestoreVersion = (ver: DatasetVersion) => {
    setVersions(prev =>
      prev.map(v => ({
        ...v,
        active: v.version === ver.version,
      }))
    );
    setProfile(p => ({
      ...p,
      version: ver.version,
      overallQualityScore: ver.qualityScore,
    }));
  };

  // Workspace creation
  const handleCreateWorkspace = (name: string, org: string) => {
    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name,
      organization: org,
      createdAt: new Date().toISOString().split('T')[0],
      datasetCount: 1,
      role: 'Owner',
    };
    setWorkspaces(prev => [...prev, newWs]);
    setCurrentWorkspace(newWs);
  };

  // STARTUP ANIMATION (Plays on initial app open, very subtle & elegant)
  if (!hasSeenStartup) {
    return <StartupAnimation onComplete={() => setHasSeenStartup(true)} />;
  }

  // PAGE 1: Commercial Landing & Home Page
  if (currentPage === 'landing') {
    return (
      <LandingPage
        onNavigate={setCurrentPage}
        onInstantDemo={() => {
          setCurrentUser(DEFAULT_USER);
          setCurrentPage('onboarding');
        }}
        isLoggedIn={!!currentUser}
      />
    );
  }

  // PAGE 2: User Login Page
  if (currentPage === 'login') {
    return (
      <LoginPage
        onNavigate={setCurrentPage}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setCurrentPage('app');
        }}
      />
    );
  }

  // PAGE 3: User Sign Up Page
  if (currentPage === 'signup') {
    return (
      <SignUpPage
        onNavigate={setCurrentPage}
        onSignUpSuccess={(user) => {
          setCurrentUser(user);
          setCurrentPage('onboarding');
        }}
      />
    );
  }

  // PAGE 4: Forgot Password Page
  if (currentPage === 'forgot-password') {
    return (
      <ForgotPasswordPage
        onNavigate={setCurrentPage}
      />
    );
  }

  // PAGE 5: Executive Onboarding Step
  if (currentPage === 'onboarding') {
    return (
      <OnboardingPage
        user={currentUser}
        onComplete={() => setCurrentPage('app')}
        onSkip={() => setCurrentPage('app')}
      />
    );
  }

  // PAGE 6: Core Main Application (Full existing platform)
  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark ? 'bg-[#181513] text-[#EDE6DE]' : 'bg-[#F5F0E9] text-[#292522]'
    }`}>
      {/* Top Navbar */}
      <Navbar
        currentWorkspace={currentWorkspace}
        workspaces={workspaces}
        onSelectWorkspace={setCurrentWorkspace}
        onCreateWorkspace={handleCreateWorkspace}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onSetDarkMode={handleSetDarkMode}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        datasetName={profile.name}
        datasetVersion={profile.version}
        qualityScore={profile.overallQualityScore}
        objective={objective}
        onObjectiveChange={setObjective}
        onRunAnalysis={handleRunAnalysis}
        isAnalyzing={isPipelineRunning}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenGenerateDashboards={() => setIsGenerateModalOpen(true)}
        isCustomDataset={isCustomDataset}
        isExecutiveMode={isExecutiveMode}
        onToggleExecutiveMode={() => setIsExecutiveMode(!isExecutiveMode)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigateLanding={() => setCurrentPage('landing')}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Main Workspace Layout with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Warm Elegant Analytics Sidebar - Primary Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleNavigateTab}
          presentationCount={presentationDeck?.totalSlides || 6}
          insightCount={insights.length}
          recommendationCount={recommendations.length}
          cleaningCount={cleaningActions.length}
          qualityScore={profile.overallQualityScore}
          datasetName={profile.name}
          isAnalyzing={isPipelineRunning}
          onRunAnalysis={handleRunAnalysis}
          onOpenHelp={() => setIsHelpModalOpen(true)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isDark={isDark}
          currentTheme={currentTheme}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          onOpenUpload={() => setIsUploadModalOpen(true)}
          onOpenGenerateDashboards={() => setIsGenerateModalOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Scrollable Main Area with automatic scroll-to-top on route change */}
        <div
          ref={mainScrollRef}
          className={`flex-1 overflow-y-auto transition-colors duration-200 ${
            isDark ? 'bg-[#181513]' : 'bg-[#F5F0E9]'
          }`}
        >
          <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5">
            {/* Pipeline Execution Banner (when running) */}
            <PipelineProgress
              isRunning={isPipelineRunning}
              onComplete={handlePipelineComplete}
              isDark={isDark}
            />

            {/* Dedicated Page Breadcrumb Navigation (shown on individual module pages) */}
            {activeTab !== 'overview' && (
              <div
                className={`flex flex-wrap items-center justify-between text-xs py-2 px-3 sm:px-3.5 rounded-xl border gap-2 transition-colors ${
                  isDark ? 'border-[#3E352F] bg-[#26201D]' : 'border-[#DDD4CA] bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <button
                    onClick={() => handleNavigateTab('overview')}
                    className={`font-mono text-[11px] uppercase tracking-wider hover:underline cursor-pointer font-medium ${
                      isDark ? 'text-[#A3988E]' : 'text-[#756D65]'
                    }`}
                  >
                    Analytics
                  </button>
                  <ChevronRight className={`w-3.5 h-3.5 ${isDark ? 'text-[#4E443C]' : 'text-[#C4B9AE]'}`} />
                  <span className={`font-bold ${isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}`}>
                    {ANALYTICS_ROUTES[activeTab]?.label || 'Module'}
                  </span>
                  <span
                    className="ml-1 sm:ml-2 text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase tracking-wider hidden sm:inline"
                    style={{
                      backgroundColor: 'var(--theme-primary-subtle)',
                      color: 'var(--theme-text)',
                    }}
                  >
                    {ANALYTICS_ROUTES[activeTab]?.category || 'Module Page'}
                  </span>
                </div>

                <button
                  onClick={() => handleNavigateTab('overview')}
                  className="text-xs font-semibold hover:underline cursor-pointer flex items-center gap-1"
                  style={{ color: 'var(--theme-text)' }}
                >
                  <span>&larr; Overview</span>
                </button>
              </div>
            )}

            {/* Active Route View Rendering: Each module gets its own dedicated page starting at the top */}
            {activeTab === 'overview' && (
              <AnalyticsOverviewPage
                profile={profile}
                objective={objective}
                causeTree={causeTree}
                recommendations={recommendations}
                kpis={kpis}
                insightsCount={insights.length}
                recommendationsCount={recommendations.length}
                cleaningCount={cleaningActions.length}
                presentationCount={presentationDeck?.totalSlides || 6}
                isDark={isDark}
                currentTheme={currentTheme}
                onNavigateTab={handleNavigateTab}
                isExecutiveMode={isExecutiveMode}
                onToggleExecutiveMode={() => setIsExecutiveMode(!isExecutiveMode)}
                onOpenGlossary={() => setIsHelpModalOpen(true)}
                onOpenUpload={() => setIsUploadModalOpen(true)}
                onOpenGenerateDashboards={() => setIsGenerateModalOpen(true)}
              />
            )}

            {activeTab === 'dashboard' && (
              <AutonomousDashboard
                kpis={kpis}
                forecastData={forecastData}
                breakdownData={breakdownData}
                heatmapData={heatmapData}
                geoData={geoData}
                isDark={isDark}
                currentTheme={currentTheme}
                onOpenUpload={() => setIsUploadModalOpen(true)}
                onOpenGenerateDashboards={() => setIsGenerateModalOpen(true)}
                isCustomDataset={isCustomDataset}
                isExecutiveMode={isExecutiveMode}
                onNavigateTab={handleNavigateTab}
                onOpenGlossary={() => setIsHelpModalOpen(true)}
              />
            )}

            {activeTab === 'presentations' && (
              <AnalystDashboardPresentation
                deck={presentationDeck}
                profile={profile}
                rawRows={rawRows}
                isDark={isDark}
                currentTheme={currentTheme}
                onRegenerateDeck={(type) => {
                  const newDeck = generateAnalystPresentationDeck(
                    profile,
                    rawRows,
                    activeTheme,
                    type ? { selectedTypes: [type] } : undefined
                  );
                  setPresentationDeck(newDeck);
                }}
                onOpenUpload={() => setIsUploadModalOpen(true)}
              />
            )}

            {activeTab === 'data' && (
              <DataUnderstandingCleaning
                profile={profile}
                cleaningActions={cleaningActions}
                analysisTechniques={analysisTechniques}
                onToggleCleaningAction={handleToggleCleaningAction}
                isDark={isDark}
              />
            )}

            {activeTab === 'rootcause' && (
              <RootCauseTree
                tree={causeTree}
                isDark={isDark}
                onNavigateTab={handleNavigateTab}
              />
            )}

            {activeTab === 'insights' && (
              <InsightCenter
                insights={insights}
                isDark={isDark}
                onNavigateTab={handleNavigateTab}
              />
            )}

            {activeTab === 'predictive' && (
              <PredictiveWhatIf
                forecastData={forecastData}
                kpis={kpis}
                isDark={isDark}
                currentTheme={currentTheme}
                onNavigateTab={handleNavigateTab}
              />
            )}

            {activeTab === 'decisions' && (
              <DecisionCenter
                recommendations={recommendations}
                isDark={isDark}
                onNavigateTab={handleNavigateTab}
              />
            )}

            {activeTab === 'news' && (
              <NewsCorrelation
                news={news}
                isDark={isDark}
              />
            )}

            {activeTab === 'reports' && (
              <ReportGenerator
                profile={profile}
                recommendations={recommendations}
                insights={insights}
                kpis={kpis}
                rawRows={rawRows}
                isDark={isDark}
              />
            )}

            {activeTab === 'ingest' && (
              <DatasetManager
                currentProfile={profile}
                versions={versions}
                onDatasetLoaded={handleDatasetLoaded}
                onRestoreVersion={handleRestoreVersion}
                isDark={isDark}
              />
            )}
          </main>

          {/* Footer */}
          <footer className={`border-t py-4 text-xs transition-colors duration-200 ${
            isDark ? 'border-[#3E352F] bg-[#211C19] text-[#A3988E]' : 'border-[#DDD4CA] bg-[#EEE7DE] text-[#756D65]'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`font-bold ${isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}`}>Zynetra</span>
                <span>&bull; Autonomous Enterprise Analytics &amp; Decision Platform</span>
                <span className="hidden sm:inline">&bull; Zero-Touch Self-Explaining AI</span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span>Active Dataset: <strong className={isDark ? 'text-[#EDE6DE]' : 'text-[#292522]'}>{profile.name}</strong></span>
                <span>Version: <strong style={{ color: 'var(--theme-text)' }}>v{profile.version}</strong></span>
                <span className="flex items-center gap-1.5 text-[var(--muted-sage)] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--muted-sage)] animate-pulse" />
                  Engine Online
                </span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Modals */}
      <QuickUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDatasetLoaded={handleDatasetLoaded}
        onNavigateToDashboard={() => handleNavigateTab('dashboard')}
        isDark={isDark}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDark={isDark}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        onToggleDarkMode={handleToggleTheme}
        onSetDarkMode={handleSetDarkMode}
      />
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        isDark={isDark}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <InterpretabilityHelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        isDark={isDark}
      />
      <DashboardGenerationModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        profile={profile}
        rawRowCount={rawRows.length > 0 ? rawRows.length : profile.totalRows}
        currentTheme={currentTheme}
        isDark={isDark}
        onGenerate={(config) => {
          const newDeck = generateAnalystPresentationDeck(
            profile,
            rawRows,
            activeTheme,
            config
          );
          setPresentationDeck(newDeck);
          handleNavigateTab('presentations');
        }}
      />
    </div>
  );
}
