export type ThemeId = 'emerald' | 'sapphire' | 'amber' | 'violet' | 'slate' | 'indigo';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  subtitle: string;
  tag: string;
  primaryColor: string;
  primaryHover: string;
  primaryLight: string;
  secondaryColor: string;
  chartColor: string;
  darkPrimaryColor: string;
  darkPrimaryHover: string;
  darkPrimaryLight: string;
  darkTextColor: string;
  darkChartColor: string;
  darkSecondaryColor: string;
  logoGradient: string;
  glowColor: string;
  swatchBg: string;
  description: string;
}
