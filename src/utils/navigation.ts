import { MainTab } from '../types';

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
    path: '/analytics',
    label: 'Analytics Overview',
    category: 'Overview',
    description: 'High-level synthesis digest, active corpus diagnostics, and analytics module directory.',
  },
  dashboard: {
    tab: 'dashboard',
    path: '/analytics/executive-dashboard',
    label: 'Executive Dashboard',
    category: 'Core Intelligence',
    description: 'Real-time telemetry, trajectory corridors, cohort breakdowns, and regional performance.',
  },
  presentations: {
    tab: 'presentations',
    path: '/analytics/analyst-deck',
    label: 'Analyst Presentation Deck',
    category: 'Core Intelligence',
    description: 'Autonomous 6-slide boardroom deck, presentation notes, and exportable slide visuals.',
  },
  rootcause: {
    tab: 'rootcause',
    path: '/analytics/root-cause',
    label: 'Root-Cause Tree',
    category: 'Diagnostic Modeling',
    description: 'Hierarchical causal tree identifying primary systemic drivers with statistical confidence.',
  },
  insights: {
    tab: 'insights',
    path: '/analytics/natural-insights',
    label: 'Natural Insights',
    category: 'Diagnostic Modeling',
    description: 'Autonomous natural language findings, statistical anomaly detection, and empirical risk flags.',
  },
  predictive: {
    tab: 'predictive',
    path: '/analytics/predictive',
    label: 'Predictive & What-If',
    category: 'Forward Simulation',
    description: 'Forward trajectory simulation, driver sensitivity sliders, and counterfactual sandbox.',
  },
  decisions: {
    tab: 'decisions',
    path: '/analytics/prioritized-decisions',
    label: 'Prioritized Decisions',
    category: 'Forward Simulation',
    description: 'Prescriptive action plans ranked by financial ROI, implementation timeline, and feasibility.',
  },
  data: {
    tab: 'data',
    path: '/analytics/data-clean',
    label: 'Data Clean & Audit',
    category: 'Data Governance',
    description: 'Automated data hygiene audit, schema anomalies, deduplication, and cleaning rules.',
  },
  news: {
    tab: 'news',
    path: '/analytics/news',
    label: 'External Signals & News',
    category: 'Macro Intelligence',
    description: 'Macroeconomic and market signals correlated with historical metric variance.',
  },
  reports: {
    tab: 'reports',
    path: '/analytics/reports',
    label: 'Executive Reports',
    category: 'Governance & Export',
    description: 'Comprehensive exportable executive briefs, compliance documentation, and record tables.',
  },
  ingest: {
    tab: 'ingest',
    path: '/analytics/ingest',
    label: 'Data Connectors',
    category: 'Governance & Export',
    description: 'Production database connectors, dataset version management, and point-in-time restore.',
  },
};

/**
 * Maps a URL pathname to the appropriate MainTab
 */
export function pathToTab(pathname: string): MainTab {
  const clean = pathname.toLowerCase().replace(/\/$/, '') || '/';

  if (clean === '/analytics' || clean === '/analytics/overview') {
    return 'overview';
  }
  if (clean === '/analytics/executive-dashboard' || clean === '/analytics/dashboard') {
    return 'dashboard';
  }
  if (clean === '/analytics/analyst-deck' || clean === '/analytics/presentations') {
    return 'presentations';
  }
  if (clean === '/analytics/root-cause' || clean === '/analytics/rootcause') {
    return 'rootcause';
  }
  if (clean === '/analytics/natural-insights' || clean === '/analytics/insights') {
    return 'insights';
  }
  if (clean === '/analytics/predictive') {
    return 'predictive';
  }
  if (clean === '/analytics/prioritized-decisions' || clean === '/analytics/decisions') {
    return 'decisions';
  }
  if (clean === '/analytics/data-clean' || clean === '/analytics/data') {
    return 'data';
  }
  if (clean === '/analytics/news') {
    return 'news';
  }
  if (clean === '/analytics/reports') {
    return 'reports';
  }
  if (clean === '/analytics/ingest') {
    return 'ingest';
  }

  // Default fallback if unknown analytics path
  if (clean.startsWith('/analytics')) {
    return 'overview';
  }

  return 'dashboard';
}

/**
 * Returns the canonical URL path for a given MainTab
 */
export function tabToPath(tab: MainTab): string {
  return ANALYTICS_ROUTES[tab]?.path || '/analytics/executive-dashboard';
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
  } catch (e) {
    // In sandboxed environments or if history push fails, silently proceed
  }

  const tab = pathToTab(path);
  if (onNavigateCallback) {
    onNavigateCallback(tab);
  }

  // Proper scroll restoration: always reset to top of page
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}
