export type AnalystDashboardType =
  | 'all'
  | 'executive_board'
  | 'product_cohort'
  | 'financial_margins'
  | 'operations_sla'
  | 'customer_segmentation'
  | 'statistical_drilldown';

export interface AnalystSlideKpi {
  label: string;
  value: string;
  delta: string;
  deltaType: 'positive' | 'negative' | 'neutral';
  benchmark?: string;
  description: string;
}

export interface AnalystPresentationSlide {
  id: string;
  slideNumber: number;
  type: AnalystDashboardType;
  title: string;
  subtitle: string;
  category: string;
  audience: string;
  kpis: AnalystSlideKpi[];
  chartType: 'area' | 'bar' | 'composed' | 'line';
  chartTitle: string;
  chartDescription: string;
  chartData: Record<string, any>[];
  dataKeys: {
    key: string;
    name: string;
    color?: string;
    type?: 'bar' | 'line' | 'area';
  }[];
  xAxisKey: string;
  stakeholderTakeaways: string[];
  speakerNotes: {
    context: string;
    keyTalkingPoint: string;
    anticipatedQuestion: string;
    recommendedAnswer: string;
  };
  recommendedActions: string[];
}

export interface AnalystPresentationDeck {
  id: string;
  datasetName: string;
  generatedAt: string;
  version: string;
  totalSlides: number;
  targetAudience: string;
  slides: AnalystPresentationSlide[];
}

export interface DashboardGenerationConfig {
  selectedTypes: AnalystDashboardType[];
  targetAudience: 'Executive Board' | 'Department Leads' | 'Investors' | 'Cross-functional Teams';
  presentationFocus: 'Growth & Strategy' | 'Efficiency & Cost' | 'Risk & Anomaly Mitigation' | 'Comprehensive Overview';
  autoPlayIntervalSeconds?: number;
}
