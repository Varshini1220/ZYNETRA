import { MainTab } from '../types';
import { AuthPageState } from '../types/auth';

export interface RouteMeta {
  tab: MainTab;
  path: string;
  label: string;
  category: string;
  description: string;
}

export const ANALYTICS_ROUTES: Record<MainTab, RouteMeta> = {
  overview: {
    tab: 'overview',
    path: '/app',
    label: 'Workspace Overview',
    category: 'Overview',
    description: 'High-level synthesis digest, active corpus diagnostics, and analytics module directory.',
  },
  analytics: {
    tab: 'analytics',
    path: '/app/analytics',
    label: 'Analytics & Synthesis',
    category: 'Overview',
    description: 'Executive story brief, autonomous analytical techniques matrix, and macro intelligence.',
  },
  dashboard: {
    tab: 'dashboard',
    path: '/app/dashboards',
    label: 'Executive Dashboard',
    category: 'Core Intelligence',
    description: 'Real-time telemetry, trajectory corridors, cohort breakdowns, and regional performance.',
  },
  presentations: {
    tab: 'presentations',
    path: '/app/presentations',
    label: 'Presentation Decks',
    category: 'Workspace',
    description: 'Autonomous 6-slide boardroom deck, presentation notes, and exportable slide visuals.',
  },
  rootcause: {
    tab: 'rootcause',
    path: '/app/root-cause',
    label: 'Root-Cause Analysis',
    category: 'Diagnostic Modeling',
    description: 'Hierarchical causal tree identifying primary systemic drivers with statistical confidence.',
  },
  insights: {
    tab: 'insights',
    path: '/app/insights',
    label: 'Natural Insights',
    category: 'Diagnostic Modeling',
    description: 'Autonomous natural language findings, statistical anomaly detection, and empirical risk flags.',
  },
  predictive: {
    tab: 'predictive',
    path: '/app/predictive',
    label: 'Predictive & What-If',
    category: 'Forward Simulation',
    description: 'Forward trajectory simulation, driver sensitivity sliders, and counterfactual sandbox.',
  },
  decisions: {
    tab: 'decisions',
    path: '/app/decisions',
    label: 'Prioritized Decisions',
    category: 'Forward Simulation',
    description: 'Prescriptive action plans ranked by financial ROI, implementation timeline, and feasibility.',
  },
  data: {
    tab: 'data',
    path: '/app/data',
    label: 'Data Clean & Audit',
    category: 'Data Governance',
    description: 'Automated data hygiene audit, schema anomalies, deduplication, and cleaning rules.',
  },
  news: {
    tab: 'news',
    path: '/app/signals',
    label: 'External Signals & News',
    category: 'Macro Intelligence',
    description: 'Macroeconomic and market signals correlated with historical metric variance.',
  },
  reports: {
    tab: 'reports',
    path: '/app/reports',
    label: 'Executive Reports',
    category: 'Workspace',
    description: 'Comprehensive exportable executive briefs, compliance documentation, and record tables.',
  },
  ingest: {
    tab: 'ingest',
    path: '/app/datasets',
    label: 'Datasets & Connectors',
    category: 'Workspace',
    description: 'Production database connectors, dataset version management, and point-in-time restore.',
  },
  profile: {
    tab: 'profile',
    path: '/app/profile',
    label: 'Zynetra Profile',
    category: 'Account',
    description: 'Manage your executive identity, security credentials, notifications, and workspace defaults.',
  },
  settings: {
    tab: 'settings',
    path: '/app/settings',
    label: 'Workspace Settings',
    category: 'Account',
    description: 'Configure account, workspace parameters, appearance themes, data hygiene rules, and security.',
  },
};

/**
 * Maps a URL pathname to top-level AuthPageState
 */
export function pathToAuthPage(pathname: string, isAuthenticated: boolean): AuthPageState {
  const clean = pathname.toLowerCase().replace(/\/$/, '') || '/';

  if (clean === '/login') return 'login';
  if (clean === '/signup' || clean === '/register') return 'signup';
  if (clean === '/forgot-password' || clean === '/reset-password') return 'forgot-password';
  if (clean === '/onboarding') return isAuthenticated ? 'onboarding' : 'signup';

  if (clean === '/app' || clean.startsWith('/app/') || clean === '/analytics' || clean.startsWith('/analytics/')) {
    return isAuthenticated ? 'app' : 'landing';
  }

  return 'landing';
}

/**
 * Returns the canonical URL path for a top-level AuthPageState
 */
export function authPageToPath(page: AuthPageState, activeTab: MainTab = 'overview'): string {
  switch (page) {
    case 'landing':
      return '/';
    case 'login':
      return '/login';
    case 'signup':
      return '/signup';
    case 'forgot-password':
      return '/forgot-password';
    case 'onboarding':
      return '/onboarding';
    case 'app':
      return tabToPath(activeTab);
    default:
      return '/';
  }
}

/**
 * Maps a URL pathname to the appropriate MainTab
 */
export function pathToTab(pathname: string): MainTab {
  const clean = pathname.toLowerCase().replace(/\/$/, '') || '/';

  if (clean === '/app' || clean === '/app/overview' || clean === '/analytics/overview') {
    return 'overview';
  }
  if (clean === '/app/analytics' || clean === '/analytics') {
    return 'analytics';
  }
  if (
    clean === '/app/dashboards' ||
    clean === '/app/dashboard' ||
    clean === '/analytics/executive-dashboard' ||
    clean === '/analytics/dashboard'
  ) {
    return 'dashboard';
  }
  if (
    clean === '/app/presentations' ||
    clean === '/app/analyst-deck' ||
    clean === '/analytics/analyst-deck' ||
    clean === '/analytics/presentations'
  ) {
    return 'presentations';
  }
  if (
    clean === '/app/root-cause' ||
    clean === '/app/rootcause' ||
    clean === '/analytics/root-cause' ||
    clean === '/analytics/rootcause'
  ) {
    return 'rootcause';
  }
  if (
    clean === '/app/insights' ||
    clean === '/app/natural-insights' ||
    clean === '/analytics/natural-insights' ||
    clean === '/analytics/insights'
  ) {
    return 'insights';
  }
  if (clean === '/app/predictive' || clean === '/analytics/predictive') {
    return 'predictive';
  }
  if (
    clean === '/app/decisions' ||
    clean === '/app/prioritized-decisions' ||
    clean === '/analytics/prioritized-decisions' ||
    clean === '/analytics/decisions'
  ) {
    return 'decisions';
  }
  if (
    clean === '/app/data' ||
    clean === '/app/data-clean' ||
    clean === '/analytics/data-clean' ||
    clean === '/analytics/data'
  ) {
    return 'data';
  }
  if (clean === '/app/signals' || clean === '/app/news' || clean === '/analytics/news') {
    return 'news';
  }
  if (clean === '/app/reports' || clean === '/analytics/reports') {
    return 'reports';
  }
  if (clean === '/app/datasets' || clean === '/app/ingest' || clean === '/analytics/ingest') {
    return 'ingest';
  }
  if (clean === '/app/profile') {
    return 'profile';
  }
  if (clean === '/app/settings') {
    return 'settings';
  }

  return 'overview';
}

/**
 * Returns the canonical URL path for a given MainTab
 */
export function tabToPath(tab: MainTab): string {
  return ANALYTICS_ROUTES[tab]?.path || '/app';
}

/**
 * Safely navigates to a new URL path using standard HTML5 History API and resets scroll
 */
export function navigateToRoute(
  path: string,
  onNavigateCallback?: (tab: MainTab) => void
): void {
  try {
    if (window.location.pathname !== path) {
      window.history.pushState({ path }, '', path);
    }
  } catch {
    // In sandboxed environments or if history push fails, silently proceed
  }

  const tab = pathToTab(path);
  if (onNavigateCallback) {
    onNavigateCallback(tab);
  }

  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

