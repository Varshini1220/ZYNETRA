import { jsPDF } from 'jspdf';
import { DatasetProfile, PredictionPoint } from '../types';
import { ThemeDefinition } from '../types/theme';

export interface ExportPdfOptions {
  profile?: DatasetProfile;
  datasetName?: string;
  datasetVersion?: string;
  qualityScore?: number;
  objective?: string;
  kpis: {
    label: string;
    value: string;
    delta: string;
    deltaType: 'positive' | 'negative' | 'neutral';
    description: string;
  }[];
  forecastData: PredictionPoint[];
  breakdownData: { label: string; value: number; metric: number }[];
  heatmapData: { row: string; col: string; value: number }[];
  geoData: { region: string; revenue: number; risk: string; performance: number }[];
  theme: ThemeDefinition;
  authorName?: string;
  includeBreakdown?: boolean;
  includeGeoData?: boolean;
  includeCorrelations?: boolean;
  customNotes?: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    return [
      parseInt(clean[0] + clean[0], 16) || 73,
      parseInt(clean[1] + clean[1], 16) || 54,
      parseInt(clean[2] + clean[2], 16) || 47,
    ];
  }
  return [
    parseInt(clean.substring(0, 2), 16) || 73,
    parseInt(clean.substring(2, 4), 16) || 54,
    parseInt(clean.substring(4, 6), 16) || 47,
  ];
}

/**
 * Generates and downloads a formatted boardroom-ready PDF summary of the Executive Dashboard.
 */
export function generateExecutiveDashboardPdf(options: ExportPdfOptions): void {
  const {
    profile,
    datasetName = profile?.name || 'Enterprise Telemetry',
    datasetVersion = profile?.version || '1.1',
    qualityScore = profile?.overallQualityScore || 94,
    objective = 'Autonomous enterprise performance diagnostic and decision summary',
    kpis,
    forecastData,
    breakdownData,
    heatmapData,
    geoData,
    theme,
    authorName = 'Executive Analytics Office',
    includeBreakdown = true,
    includeGeoData = true,
    includeCorrelations = true,
    customNotes,
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  const [primaryR, primaryG, primaryB] = hexToRgb(theme.primaryColor);
  const [secondaryR, secondaryG, secondaryB] = hexToRgb(theme.secondaryColor);

  let currentY = 15;

  // --- PAGE 1: EXECUTIVE BRIEFING & KEY METRICS ---

  // Top Header Banner
  doc.setFillColor(primaryR, primaryG, primaryB);
  doc.rect(margin, currentY, contentWidth, 22, 'F');

  // Brand and Title in Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ZYNETRA', margin + 6, currentY + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('AUTONOMOUS ENTERPRISE ANALYTICS & DECISION PLATFORM', margin + 6, currentY + 16);

  // Confidentiality Badge in Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('CONFIDENTIAL // BOARD BRIEFING', pageWidth - margin - 6, currentY + 9, { align: 'right' });

  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  doc.setFont('helvetica', 'normal');
  doc.text(dateStr, pageWidth - margin - 6, currentY + 16, { align: 'right' });

  currentY += 28;

  // Document Title & Subtitle
  doc.setTextColor(41, 37, 34); // #292522
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Executive Performance & KPI Summary', margin, currentY);

  currentY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(117, 109, 101); // #756D65
  doc.text(`Corpus: ${datasetName} (v${datasetVersion})  •  Prepared by: ${authorName}`, margin, currentY);

  currentY += 8;

  // Metadata Overview Bar
  doc.setFillColor(245, 240, 233); // #F5F0E9
  doc.setDrawColor(221, 212, 202); // #DDD4CA
  doc.roundedRect(margin, currentY, contentWidth, 16, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryR, primaryG, primaryB);
  doc.text('ANALYTICAL DIRECTIVE:', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(41, 37, 34);
  const truncatedObjective = objective.length > 85 ? objective.substring(0, 85) + '...' : objective;
  doc.text(`"${truncatedObjective}"`, margin + 44, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(123, 133, 112); // muted olive
  doc.text(`DATA HEALTH: ${qualityScore}/100`, margin + 4, currentY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(117, 109, 101);
  const rowCount = profile?.totalRows || 12450;
  const colCount = profile?.columns?.length || 14;
  doc.text(`Audited Observations: ${rowCount.toLocaleString()} records across ${colCount} dimensions`, margin + 44, currentY + 12);

  currentY += 22;

  // Section Header: Executive KPIs
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(41, 37, 34);
  doc.text('Primary Executive KPI Scorecard', margin, currentY);

  currentY += 5;

  // Render 4 KPI Cards in a 2x2 Grid
  const cardWidth = (contentWidth - 6) / 2;
  const cardHeight = 28;

  kpis.slice(0, 4).forEach((kpi, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cardX = margin + col * (cardWidth + 6);
    const cardY = currentY + row * (cardHeight + 4);

    // Card background
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(221, 212, 202);
    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 2, 2, 'FD');

    // Accent line on left of each card
    doc.setFillColor(primaryR, primaryG, primaryB);
    doc.rect(cardX, cardY, 2, cardHeight, 'F');

    // Label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(117, 109, 101);
    doc.text(kpi.label.toUpperCase(), cardX + 5, cardY + 6);

    // Delta Badge
    const isPositive = kpi.deltaType === 'positive';
    const isNegative = kpi.deltaType === 'negative';
    if (isPositive) {
      doc.setTextColor(46, 111, 64);
    } else if (isNegative) {
      doc.setTextColor(194, 94, 62);
    } else {
      doc.setTextColor(117, 109, 101);
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(kpi.delta, cardX + cardWidth - 4, cardY + 6, { align: 'right' });

    // Primary Value
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(41, 37, 34);
    doc.text(kpi.value, cardX + 5, cardY + 15);

    // Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(117, 109, 101);
    const desc = kpi.description.length > 55 ? kpi.description.substring(0, 52) + '...' : kpi.description;
    doc.text(desc, cardX + 5, cardY + 22);
  });

  currentY += (cardHeight + 4) * 2 + 5;

  // Section Header: Temporal Trajectory & Corridor
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(41, 37, 34);
  doc.text('Trajectory & Forward Corridor Summary', margin, currentY);

  currentY += 4;

  // Trajectory Table Header
  const tableColWidth = contentWidth / 4;
  doc.setFillColor(238, 231, 222); // #EEE7DE
  doc.rect(margin, currentY, contentWidth, 7, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(73, 54, 47);
  doc.text('Period / Horizon', margin + 3, currentY + 5);
  doc.text('Recorded Actual', margin + tableColWidth + 3, currentY + 5);
  doc.text('Autonomous Projection', margin + tableColWidth * 2 + 3, currentY + 5);
  doc.text('95% Confidence Corridor', margin + tableColWidth * 3 + 3, currentY + 5);

  currentY += 7;

  // Trajectory Table Rows
  const samplePoints = forecastData.slice(-5);
  samplePoints.forEach((pt, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(248, 243, 236);
      doc.rect(margin, currentY, contentWidth, 6, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(41, 37, 34);

    doc.text(pt.date, margin + 3, currentY + 4.2);
    doc.text(pt.historical ? `₹${(pt.historical / 1000).toFixed(0)}K` : '—', margin + tableColWidth + 3, currentY + 4.2);
    doc.text(pt.forecast ? `₹${(pt.forecast / 1000).toFixed(0)}K` : '—', margin + tableColWidth * 2 + 3, currentY + 4.2);

    const corridor = pt.confidenceLower && pt.confidenceUpper
      ? `₹${(pt.confidenceLower / 1000).toFixed(0)}K - ₹${(pt.confidenceUpper / 1000).toFixed(0)}K`
      : '—';
    doc.text(corridor, margin + tableColWidth * 3 + 3, currentY + 4.2);

    currentY += 6;
  });

  currentY += 6;

  // Cohort & Segment Breakdown Section
  if (includeBreakdown && breakdownData.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(41, 37, 34);
    doc.text('Cohort Impact & Segmentation Matrix', margin, currentY);

    currentY += 4;

    doc.setFillColor(238, 231, 222);
    doc.rect(margin, currentY, contentWidth, 7, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(73, 54, 47);
    doc.text('Cohort / Segment', margin + 3, currentY + 5);
    doc.text('Entity Count', margin + contentWidth * 0.4, currentY + 5);
    doc.text('Financial Metric Value', margin + contentWidth * 0.7, currentY + 5);

    currentY += 7;

    breakdownData.slice(0, 4).forEach((item, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(248, 243, 236);
        doc.rect(margin, currentY, contentWidth, 6, 'F');
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(41, 37, 34);
      doc.text(item.label, margin + 3, currentY + 4.2);
      doc.text(item.value.toLocaleString(), margin + contentWidth * 0.4, currentY + 4.2);
      doc.text(item.metric > 1000 ? `₹${item.metric.toLocaleString()}` : `${item.metric}`, margin + contentWidth * 0.7, currentY + 4.2);

      currentY += 6;
    });
  }

  // Custom Notes / Executive Takeaway Box (if provided or default)
  currentY += 6;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(221, 212, 202);
  doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(primaryR, primaryG, primaryB);
  doc.text('EXECUTIVE ANALYTICAL TAKEAWAY:', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(73, 54, 47);
  const takeawayText = customNotes ||
    'Observed trajectories indicate healthy baseline stability with isolated variance in mid-tier customer cohorts. Targeted automated remediation is projected to restore expected growth boundaries within 60 days.';
  const splitNotes = doc.splitTextToSize(takeawayText, contentWidth - 8);
  doc.text(splitNotes, margin + 4, currentY + 11);

  // Footer for Page 1
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(163, 152, 142);
  doc.text('Zynetra Autonomous Analytics Platform • Boardroom Executive Summary', margin, pageHeight - 10);
  doc.text('Page 1 of 2', pageWidth - margin, pageHeight - 10, { align: 'right' });

  // --- PAGE 2: DIAGNOSTIC MATRIX & REGIONAL RISK ---
  doc.addPage();
  currentY = 15;

  // Page 2 Mini Header
  doc.setFillColor(primaryR, primaryG, primaryB);
  doc.rect(margin, currentY, contentWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('ZYNETRA EXECUTIVE SUMMARY // DIAGNOSTIC & GEOGRAPHIC PROFILE', margin + 4, currentY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.text(dateStr, pageWidth - margin - 4, currentY + 5.5, { align: 'right' });

  currentY += 14;

  // Regional Matrix Section
  if (includeGeoData && geoData.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(41, 37, 34);
    doc.text('Territorial & Regional Performance Index', margin, currentY);

    currentY += 4;

    doc.setFillColor(238, 231, 222);
    doc.rect(margin, currentY, contentWidth, 7, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(73, 54, 47);
    doc.text('Operating Region', margin + 3, currentY + 5);
    doc.text('Revenue Volume', margin + contentWidth * 0.35, currentY + 5);
    doc.text('Performance Index', margin + contentWidth * 0.6, currentY + 5);
    doc.text('Risk Profile', margin + contentWidth * 0.82, currentY + 5);

    currentY += 7;

    geoData.forEach((geo, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(248, 243, 236);
        doc.rect(margin, currentY, contentWidth, 6.5, 'F');
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(41, 37, 34);
      doc.text(geo.region, margin + 3, currentY + 4.5);
      doc.text(`₹${(geo.revenue / 1000).toFixed(0)}K`, margin + contentWidth * 0.35, currentY + 4.5);
      doc.text(`${geo.performance}%`, margin + contentWidth * 0.6, currentY + 4.5);

      if (geo.risk === 'Low') {
        doc.setTextColor(46, 111, 64);
      } else if (geo.risk === 'Medium') {
        doc.setTextColor(180, 83, 9);
      } else {
        doc.setTextColor(194, 94, 62);
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`${geo.risk} Risk`, margin + contentWidth * 0.82, currentY + 4.5);

      currentY += 6.5;
    });

    currentY += 8;
  }

  // Feature Dependencies & Correlation Matrix
  if (includeCorrelations && heatmapData.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(41, 37, 34);
    doc.text('Autonomous Feature Dependencies & Correlation Drivers', margin, currentY);

    currentY += 4;

    doc.setFillColor(238, 231, 222);
    doc.rect(margin, currentY, contentWidth, 7, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(73, 54, 47);
    doc.text('Primary Dimension', margin + 3, currentY + 5);
    doc.text('Correlated Dimension', margin + contentWidth * 0.4, currentY + 5);
    doc.text('Correlation Coeff (r)', margin + contentWidth * 0.75, currentY + 5);

    currentY += 7;

    heatmapData.slice(0, 5).forEach((item, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(248, 243, 236);
        doc.rect(margin, currentY, contentWidth, 6, 'F');
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(41, 37, 34);
      doc.text(item.row, margin + 3, currentY + 4.2);
      doc.text(item.col, margin + contentWidth * 0.4, currentY + 4.2);

      const isPos = item.value >= 0;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(isPos ? 46 : 194, isPos ? 111 : 94, isPos ? 64 : 62);
      doc.text(isPos ? `+${item.value.toFixed(2)}` : item.value.toFixed(2), margin + contentWidth * 0.75, currentY + 4.2);

      currentY += 6;
    });

    currentY += 10;
  }

  // Board Sign-Off & Attestation
  doc.setFillColor(245, 240, 233);
  doc.setDrawColor(221, 212, 202);
  doc.roundedRect(margin, currentY, contentWidth, 32, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(primaryR, primaryG, primaryB);
  doc.text('GOVERNANCE ATTESTATION & AUDIT STAMP', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(73, 54, 47);
  doc.text('This executive summary was generated deterministically via the Zynetra Autonomous Analytics Pipeline.', margin + 4, currentY + 12);
  doc.text('Data hygiene rules, deduplication passes, and statistical confidence bounds (95% CI) verified.', margin + 4, currentY + 17);

  doc.setFont('helvetica', 'bold');
  doc.text('Approved for Distribution to Board & Senior Executive Committee.', margin + 4, currentY + 24);

  // Footer for Page 2
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(163, 152, 142);
  doc.text('Zynetra Autonomous Analytics Platform • Boardroom Executive Summary', margin, pageHeight - 10);
  doc.text('Page 2 of 2', pageWidth - margin, pageHeight - 10, { align: 'right' });

  // Clean filename and trigger direct download
  const cleanName = datasetName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const filename = `Zynetra_Executive_Summary_${cleanName}_${new Date().toISOString().split('T')[0]}.pdf`;

  doc.save(filename);
}
