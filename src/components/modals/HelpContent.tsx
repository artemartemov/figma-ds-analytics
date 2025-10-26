import { h } from 'preact';

/**
 * Shared help content used in both HelpModal and OnboardingModal
 * Contains: What the plugin does, metric calculations, limitations, getting started
 */
export function HelpContent() {
  return (
    <div
      style={{
        fontSize: 'var(--type-body-font-size)',
        lineHeight: 'var(--type-body-line-height)',
        color: 'var(--text-primary)',
      }}
    >
      {/* What it does */}
      <div style={{ marginBottom: 'var(--spacing-xxxl)' }}>
        <div
          style={{
            fontSize: 'var(--type-heading-section-font-size)',
            color: 'var(--text-primary)',
            fontWeight: 'var(--type-heading-section-font-weight)',
            letterSpacing: 'var(--type-heading-section-letter-spacing)',
            textTransform: 'var(--type-heading-section-text-transform)',
            marginBottom: 'var(--spacing-md)',
          }}
        >
          What This Plugin Does
        </div>
        <p style={{ margin: '0 0 var(--spacing-lg) 0', color: 'var(--text-primary)' }}>
          This plugin measures how well your designs adopt your design system by tracking two key
          metrics:
          <strong> Component Coverage</strong> (are you using library components?) and{' '}
          <strong>Token Adoption</strong> (are those components using design tokens/variables?).
        </p>
      </div>

      {/* How metrics are calculated */}
      <div style={{ marginBottom: 'var(--spacing-xxxl)' }}>
        <div
          style={{
            fontSize: 'var(--type-heading-section-font-size)',
            color: 'var(--text-primary)',
            fontWeight: 'var(--type-heading-section-font-weight)',
            letterSpacing: 'var(--type-heading-section-letter-spacing)',
            textTransform: 'var(--type-heading-section-text-transform)',
            marginBottom: 'var(--spacing-md)',
          }}
        >
          How Metrics Are Calculated
        </div>

        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div
            style={{
              fontWeight: 'var(--type-heading-subsection-font-weight)',
              marginBottom: 'var(--spacing-xs)',
              fontSize: 'var(--type-heading-subsection-font-size)',
            }}
          >
            Component Coverage
          </div>
          <div
            style={{
              fontFamily: 'var(--type-code-font-family)',
              fontSize: 'var(--type-code-font-size)',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--spacing-xs)',
            }}
          >
            Library Instances ÷ Total Instances × 100
          </div>
          <p style={{ margin: 0, color: 'var(--text-primary)' }}>
            Measures what percentage of component instances come from your design system libraries.
          </p>
        </div>

        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div
            style={{
              fontWeight: 'var(--type-heading-subsection-font-weight)',
              marginBottom: 'var(--spacing-xs)',
              fontSize: 'var(--type-heading-subsection-font-size)',
            }}
          >
            Token Adoption (Property-Level)
          </div>
          <div
            style={{
              fontFamily: 'var(--type-code-font-family)',
              fontSize: 'var(--type-code-font-size)',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--spacing-xs)',
            }}
          >
            Variable-bound Properties ÷ Total Properties × 100
          </div>
          <p style={{ margin: 0, color: 'var(--text-primary)' }}>
            Counts individual properties (fills, strokes, typography, radius, borders) that use
            design tokens. A button with 5 properties and only 1 token-bound property = 20% token
            adoption, not 100%.
          </p>
        </div>

        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div
            style={{
              fontWeight: 'var(--type-heading-subsection-font-weight)',
              marginBottom: 'var(--spacing-xs)',
              fontSize: 'var(--type-heading-subsection-font-size)',
            }}
          >
            Overall Score (Foundation-First)
          </div>
          <div
            style={{
              fontFamily: 'var(--type-code-font-family)',
              fontSize: 'var(--type-code-font-size)',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--spacing-xs)',
            }}
          >
            (Token Adoption × 0.55) + (Component Coverage × 0.45)
          </div>
          <p style={{ margin: 0, color: 'var(--text-primary)' }}>
            Tokens are weighted higher (55%) because they drive 80% of design consistency. Based on
            research from IBM Carbon, Atlassian, and Pinterest design systems.
          </p>
        </div>

        <div>
          <div
            style={{
              fontWeight: 'var(--type-heading-subsection-font-weight)',
              marginBottom: 'var(--spacing-xs)',
              fontSize: 'var(--type-heading-subsection-font-size)',
            }}
          >
            Orphan Rate
          </div>
          <div
            style={{
              fontFamily: 'var(--type-code-font-family)',
              fontSize: 'var(--type-code-font-size)',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--spacing-xs)',
            }}
          >
            Hardcoded Properties ÷ Total Properties × 100
          </div>
          <p style={{ margin: 0, color: 'var(--text-primary)' }}>
            Tracks hardcoded values (colors, typography, radius, borders) that should be using
            tokens. Industry target: &lt;20% orphans.
          </p>
        </div>
      </div>

      {/* Limitations */}
      <div style={{ marginBottom: 'var(--spacing-xxxl)' }}>
        <div
          style={{
            fontSize: 'var(--type-heading-section-font-size)',
            color: 'var(--text-primary)',
            fontWeight: 'var(--type-heading-section-font-weight)',
            letterSpacing: 'var(--type-heading-section-letter-spacing)',
            textTransform: 'var(--type-heading-section-text-transform)',
            marginBottom: 'var(--spacing-md)',
          }}
        >
          What This Plugin Is NOT
        </div>
        <p style={{ margin: '0 0 var(--spacing-lg) 0', color: 'var(--text-primary)' }}>
          This plugin <strong>only analyzes what you select</strong>—it cannot scan entire pages or
          files automatically. It measures adoption of existing components and tokens, but{' '}
          <strong>cannot detect which components are missing</strong> from your design system.
        </p>
        <p style={{ margin: '0 0 var(--spacing-lg) 0', color: 'var(--text-primary)' }}>
          The plugin <strong>does not analyze spacing</strong> (padding, gaps) due to high false
          positive rates. It also <strong>cannot track usage over time</strong>—you'll need to
          export results and track them manually.
        </p>
        <p style={{ margin: 0, color: 'var(--text-primary)' }}>
          Finally, it <strong>cannot auto-fix orphaned values</strong> or enforce design system
          rules. It's a measurement tool, not an enforcement tool.
        </p>
      </div>

      {/* Getting Started */}
      <div>
        <div
          style={{
            fontSize: 'var(--type-heading-section-font-size)',
            color: 'var(--text-primary)',
            fontWeight: 'var(--type-heading-section-font-weight)',
            letterSpacing: 'var(--type-heading-section-letter-spacing)',
            textTransform: 'var(--type-heading-section-text-transform)',
            marginBottom: 'var(--spacing-md)',
          }}
        >
          Getting Started
        </div>
        <p style={{ margin: '0 0 var(--spacing-sm) 0', color: 'var(--text-primary)' }}>
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
  );
}
