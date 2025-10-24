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
