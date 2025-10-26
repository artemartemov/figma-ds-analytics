/**
 * UI messages, labels, and text content
 */

import type { UIMessage } from './types';

export const UI_LABELS = {
  // Button text
  ANALYZE_SELECTION: 'Analyze Selection',
  CANCEL_ANALYSIS: 'Cancel Analysis',
  VIEW_IN_CANVAS: 'View in canvas',

  // Tab labels
  TAB_OVERVIEW: 'Overview',
  TAB_COMPONENTS: 'Components',
  TAB_TOKENS: 'Tokens',

  // Section headings
  DESIGN_SYSTEM_ADOPTION: 'Design System Adoption',
  COMPONENT_COVERAGE: 'Component Coverage',
  TOKEN_ADOPTION: 'Token Adoption',
  ORPHAN_RATE: 'Orphan Rate',

  // Actions
  IGNORE: 'Ignore',
  IGNORED: 'Ignored',
  COLLAPSE: 'Collapse',
  EXPAND: 'Expand',

  // States
  LOADING: 'Loading...',
  ANALYZING: 'Analyzing',
  NO_SELECTION: 'Please select frames, components, or sections to analyze',
  NO_DATA: 'No data available',
};

export const ERROR_MESSAGES: Record<string, UIMessage> = {
  NO_SELECTION: {
    text: 'Please select frames, components, or sections to analyze',
    variant: 'warning',
  },
  ANALYSIS_FAILED: {
    text: 'Analysis failed. Please try again.',
    variant: 'error',
  },
  NO_INSTANCES: {
    text: 'No component instances found in selection',
    variant: 'info',
  },
};

export const TOOLTIP_TEXT = {
  HELP_BUTTON: 'Show help documentation',
  SETTINGS_BUTTON: 'Configure settings',
  ONBOARDING_BUTTON: 'Show onboarding guide',
  VIEW_IN_CANVAS: 'Select this item in Figma canvas',
  IGNORE_ITEM: 'Mark as ignored and exclude from metrics',
  FORMULA_INFO: 'Click to see how this is calculated',
};

export const PROGRESS_MESSAGES = {
  INITIALIZING: 'Initializing...',
  COLLECTING_INSTANCES: 'Collecting instances...',
  ANALYZING_TOKENS: 'Analyzing tokens...',
  DETECTING_ORPHANS: 'Detecting orphans...',
  CALCULATING_METRICS: 'Calculating metrics...',
  COMPLETE: 'Analysis complete',
};

// Tooltip content generators (functions that return formatted strings)
export const TOOLTIP_CONTENT = {
  overallAdoption: (tokenAdoption: number, componentCoverage: number, overall: number) =>
    `Foundation-First Formula (55/45 weighting):

Token Adoption: ${Math.round(tokenAdoption)}% × 0.55 = ${Math.round(tokenAdoption * 0.55)}%
Component Coverage: ${Math.round(componentCoverage)}% × 0.45 = ${Math.round(componentCoverage * 0.45)}%

Overall Adoption: ${Math.round(tokenAdoption * 0.55)}% + ${Math.round(componentCoverage * 0.45)}% = ${Math.round(overall)}%

Why 55/45? Research from IBM, Atlassian, and Pinterest shows that foundational elements (tokens/variables) drive 80% of consistency value. Tokens are harder to adopt but more impactful than components.`,

  componentCoverage: (libraryInstances: number, totalInstances: number, coverage: number) =>
    `Formula: Library Components ÷ Total Components

Library Components: ${libraryInstances}
Local Components: ${totalInstances - libraryInstances}
Total: ${totalInstances}

Calculation: ${libraryInstances} ÷ ${totalInstances} = ${Math.round(coverage)}%

Note: Wrapper components (local components built with DS) are excluded from this count because their nested DS components are already counted. This prevents double-counting.`,

  tokenAdoption: (tokenBound: number, totalOpportunities: number, coverage: number) =>
    `Formula: Token-Bound Properties ÷ Total Properties

Token-Bound Properties: ${tokenBound}
Hardcoded Properties: ${totalOpportunities - tokenBound}
Total Properties: ${totalOpportunities}

Calculation: ${tokenBound} ÷ ${totalOpportunities} = ${Math.round(coverage)}%

Note: This measures token adoption at the property level, not component level. Each component has multiple properties (fills, strokes, typography, radius, borders) and we count how many individual properties use design tokens.`,
};

// Modal content generators
export const MODAL_CONTENT = {
  overallAdoption: (tokenAdoption: number, componentCoverage: number, overall: number) => ({
    title: 'Overall Adoption Score',
    content: `FOUNDATION FIRST FORMULA
(55/45 weighting)

TOKEN ADOPTION
${Math.round(tokenAdoption)}% × 0.55 = ${Math.round(tokenAdoption * 0.55)}%

COMPONENT COVERAGE
${Math.round(componentCoverage)}% × 0.45 = ${Math.round(componentCoverage * 0.45)}%

OVERALL ADOPTION
${Math.round(tokenAdoption * 0.55)}% + ${Math.round(componentCoverage * 0.45)}% = ${Math.round(overall)}%

WHY 55/45
Research from IBM, Atlassian, and Pinterest shows that foundational elements (tokens/variables) drive 80% of consistency value. Tokens are harder to adopt but more impactful than components.`,
  }),

  componentCoverage: (libraryInstances: number, totalInstances: number, coverage: number) => ({
    title: 'Component Coverage',
    content: `FORMULA
Library Components ÷ Total Components

LIBRARY COMPONENTS
${libraryInstances}

LOCAL COMPONENTS
${totalInstances - libraryInstances}

TOTAL
${totalInstances}

CALCULATION
${libraryInstances} ÷ ${totalInstances} = ${Math.round(coverage)}%

NOTE
Wrapper components (local components built with DS) are excluded from this count because their nested DS components are already counted. This prevents double-counting.`,
  }),

  tokenAdoption: (tokenBound: number, totalOpportunities: number, coverage: number) => ({
    title: 'Design Token Adoption',
    content: `FORMULA
Token-Bound Properties ÷ Total Properties

TOKEN BOUND PROPERTIES
${tokenBound}

HARDCODED PROPERTIES
${totalOpportunities - tokenBound}

TOTAL PROPERTIES
${totalOpportunities}

CALCULATION
${tokenBound} ÷ ${totalOpportunities} = ${Math.round(coverage)}%

NOTE
This measures token adoption at the property level, not component level. Each component has multiple properties (fills, strokes, typography, radius, borders) and we count how many individual properties use design tokens.`,
  }),
};
