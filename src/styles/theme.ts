// Theme-aware CSS using Figma's native CSS variables
export const themeStyles = `
  /* Normalize plugin header spacing */
  * {
    box-sizing: border-box;
  }

  body, html {
    margin: 0 !important;
    padding: 0 !important;
  }

  #app {
    margin: 0 !important;
    padding: 0 !important;
  }

  :root {
    /* ===========================
       PRIMITIVE COLOR TOKENS
       ========================== */

    /* Grayscale */
    --color-white: #FFFFFF;
    --color-gray-50: #f0f0f0;
    --color-gray-100: #F5F5F5;
    --color-gray-150: #e8e8e8;
    --color-gray-200: #E5E5E5;
    --color-gray-500: #B8B8B8;
    --color-gray-700: #666;
    --color-gray-800: #52525B;
    --color-gray-850: #242424;
    --color-gray-875: #232323;
    --color-gray-900: #222222;
    --color-black: #000000;

    /* Transparency primitives */
    --alpha-black-10: rgba(0, 0, 0, 0.1);
    --alpha-black-30: rgba(0, 0, 0, 0.3);
    --alpha-black-75: rgba(0, 0, 0, 0.75);
    --alpha-black-90: rgba(0, 0, 0, 0.9);
    --alpha-white-10: rgba(255, 255, 255, 0.1);
    --alpha-white-20: rgba(255, 255, 255, 0.2);
    --alpha-white-30: rgba(255, 255, 255, 0.3);
    --alpha-white-90: rgba(255, 255, 255, 0.9);

    /* ===========================
       SEMANTIC COLOR TOKENS
       ========================== */

    /* Text colors - use Figma's semantic tokens */
    --text-primary: var(--figma-color-text);
    --text-secondary: var(--figma-color-text-secondary);
    --text-tertiary: var(--figma-color-text-tertiary);

    /* Background colors */
    --card-bg: var(--figma-color-bg-secondary);

    /* Border colors */
    --border-color: var(--figma-color-border);

    /* Spacing scale (2px base grid) */
    --spacing-xxxs: 2px;
    --spacing-xxs: 4px;
    --spacing-xs: 6px;
    --spacing-sm: 8px;
    --spacing-md: 10px;
    --spacing-lg: 12px;
    --spacing-xl: 16px;
    --spacing-xxl: 20px;
    --spacing-xxxl: 24px;
    --spacing-xxxxl: 32px;

    /* Typography - Font sizes */
    --font-size-xxs: 7px;
    --font-size-xs: 9px;
    --font-size-sm: 10px;
    --font-size-md: 11px;
    --font-size-lg: 12px;
    --font-size-xl: 13px;
    --font-size-xxl: 14px;
    --font-size-xxxl: 16px;
    --font-size-xxxxl: 18px;

    /* Typography - Line heights */
    --line-height-tight: 1.5;
    --line-height-normal: 1.6;
    --line-height-relaxed: 1.65;

    /* Typography - Letter spacing */
    --letter-spacing-tight: 0.03em;
    --letter-spacing-normal: 0.05em;
    --letter-spacing-wide: 0.1em;
    --letter-spacing-label: 0.5px;

    /* Typography - Font weights */
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    --font-weight-black: 900;

    /* Typography - Font families */
    --font-family-mono: 'JetBrains Mono', 'Monaco', 'Courier New', monospace;

    /* ===========================
       TYPE STYLE TOKENS
       Composite typography tokens for common patterns
       ========================== */

    /* Headings */
    --type-heading-section-font-size: var(--font-size-md);
    --type-heading-section-font-weight: var(--font-weight-bold);
    --type-heading-section-letter-spacing: var(--letter-spacing-tight);
    --type-heading-section-text-transform: uppercase;

    --type-heading-subsection-font-size: var(--font-size-md);
    --type-heading-subsection-font-weight: var(--font-weight-semibold);

    /* Body text */
    --type-body-font-size: var(--font-size-md);
    --type-body-line-height: var(--line-height-relaxed);

    /* Code/Formula text */
    --type-code-font-family: var(--font-family-mono);
    --type-code-font-size: var(--font-size-sm);

    /* ===========================
       SEMANTIC COMPONENT TOKENS
       Common patterns across components
       ========================== */

    /* Card headings (uppercase labels above cards) */
    --card-heading-font-size: var(--font-size-lg);
    --card-heading-font-weight: var(--font-weight-medium);
    --card-heading-text-transform: uppercase;
    --card-heading-margin-bottom: var(--spacing-xl);

    /* Card content */
    --card-padding: var(--spacing-xxl);
    --card-border-radius: var(--border-radius-sm);
    --card-gap: var(--spacing-xxxl);

    /* Section labels (within cards) */
    --section-label-font-size: var(--font-size-lg);
    --section-label-font-weight: var(--font-weight-medium);
    --section-label-color: var(--text-secondary);
    --section-label-margin-bottom: var(--spacing-xs);

    /* Section values (metric numbers) */
    --section-value-font-size: var(--font-size-lg);
    --section-value-font-weight: var(--font-weight-medium);
    --section-value-color: var(--text-tertiary);

    /* Large metric display */
    --metric-large-font-size: var(--font-size-xxxxl);
    --metric-large-font-weight: var(--font-weight-bold);
    --metric-large-color: var(--text-primary);

    /* Progress bars */
    --progress-bar-height: 2px;
    --progress-bar-border-radius: var(--border-radius-sm);
    --progress-bar-gap: var(--spacing-xl);

    /* List items */
    --list-item-margin-bottom: var(--spacing-lg);
    --list-item-gap: var(--spacing-xs);

    /* Layout - Z-index */
    --z-modal: 9999;

    /* Layout - Modal dimensions */
    --modal-max-width-lg: 480px;
    --modal-max-width-sm: 400px;
    --modal-max-height: 80vh;
    --modal-overlay-bg: var(--alpha-black-75);

    /* Components - Buttons */
    --button-height-md: 40px;

    /* Components - Icons */
    --icon-size: 12px;

    /* Components - Border radius */
    --border-radius-none: 0;
    --border-radius-sm: 4px;
    --border-radius-full: 50%;

    /* Components - Max line length */
    --max-line-length: 80;
  }

  /* Light mode specific overrides */
  @media (prefers-color-scheme: light) {
    :root {
      --track-bg-card: var(--color-white);
      --track-bg-tab: var(--color-gray-100);
      --progress-fill: var(--color-black);
      --progress-fill-secondary: var(--color-gray-800);
      --button-bg: var(--color-gray-900);
      --button-text: var(--color-white);
      --button-disabled-bg: var(--alpha-black-10);
      --button-disabled-text: var(--alpha-black-30);
      --tab-inactive-text: var(--color-gray-900);
      --tab-container-bg: var(--color-gray-100);
    }
  }

  /* Dark mode specific overrides */
  @media (prefers-color-scheme: dark) {
    :root {
      --track-bg-card: var(--color-gray-875);
      --track-bg-tab: var(--color-gray-875);
      --progress-fill: var(--color-white);
      --progress-fill-secondary: var(--color-gray-500);
      --button-bg: var(--color-white);
      --button-text: var(--color-gray-900);
      --button-disabled-bg: var(--alpha-white-10);
      --button-disabled-text: var(--alpha-white-30);
      --tab-inactive-text: var(--color-gray-500);
      --tab-container-bg: var(--color-gray-850);
    }
  }


  * {
    font-family: 'JetBrains Mono', 'Monaco', 'Courier New', monospace !important;
  }

  /* Animations */
  @keyframes barGrow {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }

  @keyframes donutFill {
    from {
      stroke-dasharray: 0 1000;
    }
    to {
      stroke-dasharray: var(--stroke-length) 1000;
    }
  }
`;
