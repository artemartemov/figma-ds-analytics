/**
 * Application constants and configuration values
 */

// Category colors for orphan visualization
export const CATEGORY_COLORS: { [key: string]: string } = {
  colors: '#e74c3c',
  typography: '#3498db',
  spacing: '#9b59b6',
  radius: '#f39c12',
};

// Foundation-First weighting constants
export const METRIC_WEIGHTS = {
  TOKEN_ADOPTION: 0.55,
  COMPONENT_COVERAGE: 0.45,
} as const;

// Library source identifiers
export const LIBRARY_SOURCES = {
  WRAPPER_INDICATORS: ['Wrapper', 'Local (built with DS)'],
  LIBRARY_INDICATORS: ['Spandex', 'Atomic', 'Global Foundation', 'Design Components'],
} as const;

// Tab values
export const TABS = {
  OVERVIEW: 'overview',
  COMPONENTS: 'components',
  TOKENS: 'tokens',
} as const;

export type TabValue = (typeof TABS)[keyof typeof TABS];

// Spacing constants
export const SPACING = {
  FIXED_BUTTON_OFFSET: '76px', // Height offset for fixed bottom button in scrollable content
  CARD_GAP: '32px',
} as const;

// Color constants
export const COLORS = {
  HELP_BUTTON: '#9D9D9D',
  HELP_BUTTON_HOVER: 'var(--figma-color-text)',
} as const;
