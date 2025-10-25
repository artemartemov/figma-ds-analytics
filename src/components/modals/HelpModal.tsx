import { h } from 'preact';
import { useEffect } from 'preact/hooks';

// Help Modal (same content as onboarding, but always accessible)
interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export let helpModalRenderCount = 0;

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  helpModalRenderCount++;

  if (!isOpen) {
    return null;
  }

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--figma-color-bg)',
          borderRadius: '0',
          padding: '24px',
          maxWidth: '480px',
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            fontSize: '13px',
            fontWeight: '700',
            color: 'var(--figma-color-text)',
            marginBottom: '20px',
            paddingRight: '24px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Design System Coverage
        </div>

        {/* Content */}
        <div
          style={{
            fontSize: '11px',
            lineHeight: '1.65',
            color: 'var(--figma-color-text)',
          }}
        >
          {/* What it does */}
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--figma-color-text)',
                fontWeight: '700',
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              What This Plugin Does
            </div>
            <p style={{ margin: '0 0 12px 0', color: 'var(--figma-color-text)' }}>
              This plugin measures how well your designs adopt your design system by tracking two
              key metrics:
              <strong> Component Coverage</strong> (are you using library components?) and{' '}
              <strong>Token Adoption</strong> (are those components using design tokens/variables?).
            </p>
          </div>

          {/* How metrics are calculated */}
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--figma-color-text)',
                fontWeight: '700',
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              How Metrics Are Calculated
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div
                style={{
                  fontWeight: '600',
                  marginBottom: '6px',
                  fontSize: '11px',
                }}
              >
                Component Coverage
              </div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  color: 'var(--figma-color-text-secondary)',
                  marginBottom: '6px',
                }}
              >
                Library Instances ÷ Total Instances × 100
              </div>
              <p style={{ margin: 0, color: 'var(--figma-color-text)' }}>
                Measures what percentage of component instances come from your design system
                libraries.
              </p>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div
                style={{
                  fontWeight: '600',
                  marginBottom: '6px',
                  fontSize: '11px',
                }}
              >
                Token Adoption (Property-Level)
              </div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  color: 'var(--figma-color-text-secondary)',
                  marginBottom: '6px',
                }}
              >
                Variable-bound Properties ÷ Total Properties × 100
              </div>
              <p style={{ margin: 0, color: 'var(--figma-color-text)' }}>
                Counts individual properties (fills, strokes, typography, radius, borders) that use
                design tokens. A button with 5 properties and only 1 token-bound property = 20%
                token adoption, not 100%.
              </p>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div
                style={{
                  fontWeight: '600',
                  marginBottom: '6px',
                  fontSize: '11px',
                }}
              >
                Overall Score (Foundation-First)
              </div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  color: 'var(--figma-color-text-secondary)',
                  marginBottom: '6px',
                }}
              >
                (Token Adoption × 0.55) + (Component Coverage × 0.45)
              </div>
              <p style={{ margin: 0, color: 'var(--figma-color-text)' }}>
                Tokens are weighted higher (55%) because they drive 80% of design consistency. Based
                on research from IBM Carbon, Atlassian, and Pinterest design systems.
              </p>
            </div>

            <div>
              <div
                style={{
                  fontWeight: '600',
                  marginBottom: '6px',
                  fontSize: '11px',
                }}
              >
                Orphan Rate
              </div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  color: 'var(--figma-color-text-secondary)',
                  marginBottom: '6px',
                }}
              >
                Hardcoded Properties ÷ Total Properties × 100
              </div>
              <p style={{ margin: 0, color: 'var(--figma-color-text)' }}>
                Tracks hardcoded values (colors, typography, radius, borders) that should be using
                tokens. Industry target: &lt;20% orphans.
              </p>
            </div>
          </div>

          {/* Limitations */}
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--figma-color-text)',
                fontWeight: '700',
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              What This Plugin Is NOT
            </div>
            <p style={{ margin: '0 0 12px 0', color: 'var(--figma-color-text)' }}>
              This plugin <strong>only analyzes what you select</strong>—it cannot scan entire pages
              or files automatically. It measures adoption of existing components and tokens, but{' '}
              <strong>cannot detect which components are missing</strong> from your design system.
            </p>
            <p style={{ margin: '0 0 12px 0', color: 'var(--figma-color-text)' }}>
              The plugin <strong>does not analyze spacing</strong> (padding, gaps) due to high false
              positive rates. It also <strong>cannot track usage over time</strong>—you'll need to
              export results and track them manually.
            </p>
            <p style={{ margin: 0, color: 'var(--figma-color-text)' }}>
              Finally, it <strong>cannot auto-fix orphaned values</strong> or enforce design system
              rules. It's a measurement tool, not an enforcement tool.
            </p>
          </div>

          {/* Getting Started */}
          <div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--figma-color-text)',
                fontWeight: '700',
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              Getting Started
            </div>
            <p style={{ margin: '0 0 8px 0', color: 'var(--figma-color-text)' }}>
              1. Select the frames, components, or sections you want to analyze
              <br />
              2. Click "Analyze Selection" to see your metrics
              <br />
              3. Use the tabs to explore components and design tokens in detail
              <br />
              4. Mark intentional exceptions as "Ignored" to refine your metrics
            </p>
          </div>
        </div>

        {/* Get Started Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            height: '40px',
            marginTop: '24px',
            background: 'var(--button-bg)',
            color: 'var(--button-text)',
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '600',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Got It
        </button>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            border: 'none',
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

// Custom Checkbox Component
