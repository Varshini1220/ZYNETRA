export interface OnboardingConfig {
  company: string;
  industry: 'SaaS' | 'FinTech' | 'E-commerce' | 'Healthcare' | 'Manufacturing' | 'Other' | string;
  primaryObjective:
    | 'Revenue Growth'
    | 'Customer Retention'
    | 'Operational Efficiency'
    | 'Financial Performance'
    | 'Product Analytics'
    | 'Executive Decision Support'
    | string;
  role:
    | 'Executive'
    | 'Business Analyst'
    | 'Data Analyst'
    | 'Product Manager'
    | 'Operations'
    | 'Finance'
    | 'Other'
    | string;
  completedAt?: string;
}

export interface NotificationPreferences {
  emailAlerts: boolean;
  weeklyDigest: boolean;
  rootCauseAlerts: boolean;
  thresholdBreach: boolean;
  slackIntegration: boolean;
}

export interface WorkspacePreferences {
  defaultView: 'overview' | 'dashboard' | 'presentations';
  narrativeMode: 'executive' | 'technical';
  autoRunOnUpload: boolean;
  currencyFormat: 'USD' | 'EUR' | 'GBP' | 'INR';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  industry?: string;
  primaryObjective?: string;
  department?: string;
  avatarUrl?: string;
  createdAt?: string;
  onboarded?: boolean;
  onboardingConfig?: OnboardingConfig;
  notificationPrefs?: NotificationPreferences;
  workspacePrefs?: WorkspacePreferences;
}

export type AuthPageState = 'landing' | 'login' | 'signup' | 'forgot-password' | 'onboarding' | 'app';

