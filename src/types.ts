export type DataType = 'numeric' | 'categorical' | 'datetime' | 'identifier' | 'boolean' | 'geospatial';

export interface ColumnProfile {
  name: string;
  type: DataType;
  sampleValues: any[];
  missingCount: number;
  missingPercentage: number;
  uniqueCount: number;
  isIdentifier: boolean;
  // Numerical stats
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  stdDev?: number;
  outlierCount?: number;
  // Categorical stats
  topCategories?: { value: string; count: number; percentage: number }[];
}

export interface DatasetProfile {
  id: string;
  name: string;
  version: string;
  totalRows: number;
  totalColumns: number;
  duplicateRows: number;
  overallQualityScore: number; // 0-100
  completenessPercentage: number;
  cleanlinessPercentage: number;
  columns: ColumnProfile[];
  primaryIdentifierCol?: string;
  datetimeCol?: string;
  targetMetricCol?: string;
  detectedDomain: 'saas' | 'retail' | 'finance' | 'general';
}

export interface CleaningAction {
  id: string;
  title: string;
  type: 'deduplicate' | 'impute' | 'standardize_date' | 'clip_outliers' | 'normalize_text' | 'format_fix';
  columnAffected?: string;
  whatChanged: string;
  whyChanged: string;
  recordsAffected: number;
  confidenceScore: number; // 0-100
  applied: boolean;
  timestamp: string;
}

export interface AnalysisTechnique {
  id: string;
  name: string;
  category: 'Descriptive' | 'Diagnostic' | 'Predictive' | 'Prescriptive';
  selected: boolean;
  reason: string;
  confidence: number;
}

export interface CauseTreeNode {
  id: string;
  label: string;
  type: 'symptom' | 'primary_driver' | 'sub_driver' | 'root_cause';
  impactPercentage: number;
  confidenceScore: number;
  supportingEvidence: string;
  alternativeHypothesis?: string;
  status: 'critical' | 'warning' | 'neutral';
  children?: CauseTreeNode[];
}

export interface PredictionPoint {
  date: string;
  historical?: number;
  forecast?: number;
  confidenceLower?: number;
  confidenceUpper?: number;
  anomaly?: boolean;
}

export interface WhatIfScenario {
  priceAdjustment: number; // % change e.g. -5% to +20%
  marketingSpend: number; // % change
  retentionEffort: number; // % change
  slaTarget: number; // % target
}

export interface DecisionRecommendation {
  id: string;
  priority: 'P1 - Immediate' | 'P2 - Strategic' | 'P3 - Optimization' | 'P3 - Long-term';
  title: string;
  expectedImpact: string;
  estimatedBenefitROI: string;
  estimatedBenefit?: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'low' | 'medium' | 'high';
  confidenceScore: number; // 0-100
  timeframe: string;
  timeline?: string;
  description?: string;
  // Explainability 5 Pillars
  why: string;
  supportingData: string;
  confidenceRationale: string;
  assumptions: string | string[];
  limitations: string | string[];
  actionSteps: string[];
  explainability?: {
    whyProduced: string;
    supportingData: string;
    confidenceScore?: number;
    assumptions: string[];
    limitations: string[];
  };
}

export interface NaturalInsight {
  id: string;
  category: 'Trend' | 'Anomaly' | 'Relationship' | 'Risk' | 'Opportunity';
  title: string;
  description: string;
  evidenceCitation: string;
  severity: 'high' | 'medium' | 'info';
  timestamp: string;
  confidenceScore?: number;
  relatedColumn?: string;
}

export interface ExternalNewsEvent {
  id: string;
  headline: string;
  source: string;
  publishedDate?: string;
  date?: string;
  category?: string;
  correlationScore?: number; // 0-100
  correlationStrength?: number;
  impactExplanation?: string;
  businessImpactExplanation?: string;
  correlatedMetric: string;
  sentiment?: 'negative' | 'neutral' | 'positive';
  snippet?: string;
  url?: string;
}

export type NewsEvent = ExternalNewsEvent;

export interface DatasetVersion {
  version: string;
  timestamp: string;
  description: string;
  rowCount: number;
  qualityScore: number;
  active: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  organization: string;
  role: string;
  datasetsCount?: number;
  datasetCount?: number;
  createdAt?: string;
}

export type MainTab =
  | 'overview'
  | 'dashboard'
  | 'presentations'
  | 'data'
  | 'rootcause'
  | 'insights'
  | 'predictive'
  | 'decisions'
  | 'news'
  | 'reports'
  | 'ingest';

