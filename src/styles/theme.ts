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
    /* Use Figma's native theme variables and add our custom ones */
    --text-primary: var(--figma-color-text);
    --text-secondary: var(--figma-color-text-secondary);
    --text-tertiary: var(--figma-color-text-tertiary);
    --card-bg: var(--figma-color-bg-secondary);
    --border-color: var(--figma-color-border);

    /* Spacing scale (4px grid) */
    --spacing-xxs: 4px;
    --spacing-xs: 6px;
    --spacing-sm: 8px;
    --spacing-md: 10px;
    --spacing-lg: 12px;
    --spacing-xl: 16px;
    --spacing-xxl: 20px;
    --spacing-xxxl: 24px;

    /* Typography - Font sizes */
    --font-size-xs: 9px;
    --font-size-sm: 10px;
    --font-size-md: 11px;
    --font-size-lg: 12px;
    --font-size-xl: 13px;
    --font-size-xxl: 14px;
    --font-size-xxxl: 16px;

    /* Typography - Line heights */
    --line-height-tight: 1.5;
    --line-height-normal: 1.6;
    --line-height-relaxed: 1.65;

    /* Typography - Letter spacing */
    --letter-spacing-tight: 0.03em;
    --letter-spacing-normal: 0.05em;
    --letter-spacing-wide: 0.1em;

    /* Typography - Font weights */
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;

    /* Layout - Z-index */
    --z-modal: 9999;

    /* Layout - Modal dimensions */
    --modal-max-width-lg: 480px;
    --modal-max-width-sm: 400px;
    --modal-max-height: 80vh;
    --modal-overlay-bg: rgba(0, 0, 0, 0.75);

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
      --track-bg-card: #FFFFFF;
      --track-bg-tab: #F5F5F5;
      --progress-fill: #000000;
      --progress-fill-secondary: #52525B;
    }
  }

  /* Dark mode specific overrides */
  @media (prefers-color-scheme: dark) {
    :root {
      --track-bg-card: #232323;
      --track-bg-tab: #232323;
      --progress-fill: #FFFFFF;
      --progress-fill-secondary: #B8B8B8;
      --button-bg: #FFFFFF;
      --button-text: #222222;
      --button-disabled-bg: rgba(255,255,255,0.1);
      --button-disabled-text: rgba(255,255,255,0.3);
      --tab-inactive-text: #B8B8B8;
      --tab-container-bg: #242424;
    }
  }

  /* Light mode button colors */
  @media (prefers-color-scheme: light) {
    :root {
      --button-bg: #222222;
      --button-text: #ffffff;
      --button-disabled-bg: rgba(0,0,0,0.1);
      --button-disabled-text: rgba(0,0,0,0.3);
      --tab-inactive-text: #222222;
      --tab-container-bg: #F5F5F5;
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
