/**
 * Help content and modal documentation for the Design System Coverage plugin
 */

import type { ModalContent } from './types';

export const HELP_MODALS: Record<string, ModalContent> = {
  MAIN: {
    title: 'HELP',
    content: `WHAT THIS PLUGIN DOES

This plugin measures how well your designs adopt your design system by tracking two key metrics: Component Coverage (are you using library components?) and Token Adoption (are those components using design tokens/variables?).

HOW METRICS ARE CALCULATED

COMPONENT COVERAGE
Library Instances ÷ Total Instances × 100
Measures what percentage of component instances come from your design system libraries.

TOKEN ADOPTION (PROPERTY-LEVEL)
Variable-bound Properties ÷ Total Properties × 100
Counts individual properties (fills, strokes, typography, radius, borders) that use design tokens. A button with 5 properties and only 1 token-bound property = 20% token adoption, not 100%.

OVERALL SCORE (FOUNDATION-FIRST)
(Token Adoption × 0.55) + (Component Coverage × 0.45)
Tokens are weighted higher (55%) because they drive 80% of design consistency. Based on research from IBM Carbon, Atlassian, and Pinterest design systems.

ORPHAN RATE
Hardcoded Properties ÷ Total Properties × 100
Tracks hardcoded values (colors, typography, radius, borders) that should be using tokens. Industry target: <20% orphans.

WHAT THIS PLUGIN IS NOT

This plugin only analyzes what you select—it cannot scan entire pages or files automatically. It measures adoption of existing components and tokens, but cannot detect which components are missing from your design system.

The plugin does not analyze spacing (padding, gaps) due to high false positive rates. It also cannot track usage over time—you'll need to export results and track them manually.

Finally, it cannot auto-fix orphaned values or enforce design system rules. It's a measurement tool, not an enforcement tool.

GETTING STARTED

1. Select the frames, components, or sections you want to analyze
2. Click "Analyze Selection" to see your metrics
3. Use the tabs to explore components and design tokens in detail
4. Mark intentional exceptions as "Ignored" to refine your metrics`,
  },

  FOUNDATION_FIRST: {
    title: 'FOUNDATION FIRST FORMULA',
    content: `FOUNDATION FIRST FORMULA

Why Tokens Are Weighted Higher (55% vs 45%)

Design tokens (variables) are the foundation that makes components consistent. Research from IBM Carbon, Atlassian, and Pinterest shows that token adoption drives 80% of design consistency value.

Here's why:
• Components can be easily replaced or updated
• Tokens affect every component and instance
• Fixing token misuse is harder than swapping components
• Token adoption prevents long-term technical debt

IBM Carbon achieved 44.8% adoption in 10 months by prioritizing tokens first. Atlassian targets 95% token adoption across all products.

This weighting ensures your score reflects what actually makes designs consistent and maintainable.`,
  },

  TOKEN_ADOPTION_FORMULA: {
    title: 'TOKEN ADOPTION FORMULA',
    content: `FORMULA

Token Adoption = Variable-bound Properties ÷ Total Properties × 100

This is calculated at the PROPERTY LEVEL, not component level.

Example: A button component has 5 properties:
• Fill: Using variable ✓
• Stroke: Hardcoded ✗
• Corner Radius: Using variable ✓
• Font Size: Hardcoded ✗
• Font Weight: Hardcoded ✗

Token Adoption = 2 ÷ 5 = 40%

This button counts as 40% token adoption, NOT 100%, even though it's a design system component.`,
  },

  COMPONENT_COVERAGE_FORMULA: {
    title: 'COMPONENT COVERAGE FORMULA',
    content: `FORMULA

Component Coverage = Library Instances ÷ Total Instances × 100

Measures what percentage of component instances come from your design system libraries.

Example: Your selection contains:
• 75 instances from team libraries
• 25 local/custom instances
• Total: 100 instances

Component Coverage = 75 ÷ 100 = 75%

This means 75% of your components are from the design system, and 25% are custom.`,
  },
};
