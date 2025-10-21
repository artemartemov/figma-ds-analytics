# Figma Design System Coverage Tracker - Claude Code Instructions

This is a Figma plugin that measures design system adoption by analyzing component usage and token adoption. Built with TypeScript, it provides research-backed metrics for design system teams.

## Project Overview

**Purpose:** Help design system teams measure and track adoption of their design systems in Figma files, providing clear metrics for leadership.

**Tech Stack:**
- TypeScript
- Figma Plugin API
- HTML/CSS/JavaScript (UI)
- No external dependencies (vanilla JS)

**Key Features:**
- Selection-based analysis (not entire page)
- Component coverage tracking (library vs. local components)
- Token adoption measurement (property-level, not component-level)
- Orphan rate detection (hardcoded values that should use tokens)
- Foundation-First weighting methodology
- Industry benchmarks from IBM, Atlassian, Pinterest

## Architecture

### Code Structure

**Main Files:**
- `code.ts` - Plugin backend logic (runs in Figma sandbox)
- `ui.html` - Plugin UI (HTML, CSS, and inline JavaScript)
- `manifest.json` - Figma plugin configuration

**Key Design Patterns:**
- Message passing between code.ts and ui.html using `postMessage`
- Recursive tree traversal for analyzing nested component structures
- Client-side storage using `figma.clientStorage` for library preferences
- Lazy loading of team library metadata

### Data Flow

1. **User Action** ’ UI sends message to code.ts
2. **Analysis** ’ code.ts scans selection, counts instances, detects tokens/orphans
3. **Results** ’ code.ts sends metrics back to UI
4. **Display** ’ UI renders metrics with breakdowns and benchmarks

## Important Implementation Details

### Selection-Based Analysis

The plugin analyzes **only what the user selects** on the canvas:
- If selection is empty, shows error: "Please select frames, components, or sections to analyze"
- For each selected node, finds all INSTANCE nodes (component instances)
- Excludes frames, text layers, shapes - only analyzes component instances

**Why:** Prevents crashes on large files with thousands of components. Allows targeted analysis of specific sections/flows.

### Token Adoption Calculation (Property-Level)

**CRITICAL:** Token Adoption is measured at the **property level**, NOT component level.

**Formula:** `Variable-bound Properties / (Variable-bound + Hardcoded Properties) × 100`

**What this means:**
- Each component has multiple properties: fills, strokes, typography, radius, borders
- We count how many individual properties use design tokens
- A component with 50 properties and only 1 token-bound property counts as 2% token adoption (not 100%)

**Implementation:**
- `countVariableBoundProperties()` - counts properties USING tokens
- `detectHardcodedValues()` - counts properties NOT using tokens (orphans)
- Both functions scan fills, strokes, typography, radius, borders
- Both skip zero values (padding:0, radius:0, etc.) to avoid false positives

**Example:**
```typescript
// Button component has:
// - 1 fill (using token) 
// - 1 stroke (hardcoded) 
// - 1 radius (using token) 
// - 1 fontSize (hardcoded) 
// Total: 2 token-bound, 2 hardcoded = 50% token adoption
```

### Orphan Rate

**Definition:** "Orphan" values are hardcoded properties that should be using design tokens.

**Formula:** `Hardcoded Properties / Total Properties × 100`

**Industry Target:** <20% orphans

**What's measured:**
-  Colors (fills, strokes) - visible only
-  Typography (fontSize, lineHeight, letterSpacing, fontFamily, fontWeight) - only if no textStyle
-  Border Radius (cornerRadius > 0)
-  Borders (strokeWeight > 0)
- L Spacing (currently excluded due to complexity)

**What's skipped:**
- Zero values (intentional design choices, not orphans)
- Invisible fills/strokes
- Text using text styles (counted as token adoption)

### Foundation-First Weighting

**Formula:** `(Token Adoption × 0.55) + (Component Coverage × 0.45)`

**Rationale:** Research from IBM, Atlassian, Pinterest shows that foundational elements (tokens/variables) drive 80% of consistency value. Components are easier to replace, but getting token adoption right is harder and more impactful.

**Source:** Industry research document showing IBM Carbon achieved 44.8% adoption in 10 months, Atlassian targets 95%, etc.

### Performance Optimizations

**Problem:** Large files with thousands of component instances can crash the plugin or freeze Figma.

**Solutions:**
1. **Instance Limit:** Analyze max 1,000 instances (configurable at code.ts:4811)
2. **Depth Limit:** Recursive traversal stops at 50 levels deep (code.ts:5395, 5421)
3. **Progress Logging:** Log every 100 instances (code.ts:4836-4838)
4. **Selection-Based:** Only analyze what user selects

### Spacing Exclusion

**Current State:** Spacing (padding, itemSpacing) is **excluded** from token adoption and orphan rate calculations.

**Why:** Too many false positives:
- padding:0 is often intentional, not an orphan
- Auto-layout defaults create noise
- Hard to distinguish between "intentional zero" vs "missing token"

**Implementation:** Lines 5222-5237 and 5318-5338 in code.ts are commented out

**Future:** May add back with smarter heuristics (e.g., only count non-zero spacing in auto-layout frames)

## Code Patterns and Conventions

### TypeScript Patterns

```typescript
// Always type Figma API nodes
const instance = node as InstanceNode;
const textNode = node as TextNode;

// Handle mixed types from Figma API
if ('fills' in node && node.fills !== figma.mixed) {
  const fills = node.fills as readonly Paint[];
  // ... work with fills
}

// Check for properties before accessing
if ('cornerRadius' in node && typeof node.cornerRadius === 'number') {
  // ... use cornerRadius
}

// Cast boundVariables to any for non-standard properties
const boundVars = node.boundVariables as any;
if (boundVars?.cornerRadius) {
  // ... has variable bound
}
```

### Recursive Patterns

```typescript
function processRecursive(node: SceneNode, depth: number = 0): Result {
  const MAX_DEPTH = 50; // Prevent stack overflow
  const result = processNode(node);

  if (depth < MAX_DEPTH && 'children' in node) {
    const children = node.children as SceneNode[];
    for (const child of children) {
      const childResult = processRecursive(child, depth + 1);
      // ... accumulate results
    }
  }

  return result;
}
```

### Message Passing Pattern

```typescript
// code.ts ’ ui.html
figma.ui.postMessage({
  type: 'results',
  data: metrics,
});

// ui.html ’ code.ts
parent.postMessage({
  pluginMessage: { type: 'analyze' }
}, '*');

// ui.html listening
window.onmessage = (event) => {
  const msg = event.data.pluginMessage;
  if (msg.type === 'results') {
    displayResults(msg.data);
  }
};
```

## Common Tasks

### Adding a New Token Type

1. **Update interfaces** (code.ts ~line 10):
```typescript
interface CoverageMetrics {
  hardcodedValues: {
    colors: number;
    typography: number;
    spacing: number;
    radius: number;
    borders: number;
    newType: number; // ADD HERE
  }
}
```

2. **Update countVariableBoundProperties()** (code.ts ~line 5129):
```typescript
const variableBound = {
  colors: 0,
  typography: 0,
  spacing: 0,
  radius: 0,
  borders: 0,
  newType: 0, // ADD HERE
};

// Add detection logic
if ('newProperty' in node && node.boundVariables?.newProperty) {
  variableBound.newType++;
}
```

3. **Update detectHardcodedValues()** (code.ts ~line 5253):
```typescript
const hardcoded = {
  colors: 0,
  typography: 0,
  spacing: 0,
  radius: 0,
  borders: 0,
  newType: 0, // ADD HERE
};

// Add detection logic (inverse of above)
if ('newProperty' in node && !node.boundVariables?.newProperty) {
  hardcoded.newType++;
}
```

4. **Update UI breakdown** (ui.html ~line 568):
```javascript
const hardcodedData = [
  { label: 'Colors', count: hv.colors, color: '#e74c3c' },
  { label: 'Typography', count: hv.typography, color: '#3498db' },
  { label: 'Spacing', count: hv.spacing, color: '#2ecc71' },
  { label: 'Radius', count: hv.radius, color: '#f39c12' },
  { label: 'Borders', count: hv.borders, color: '#9b59b6' },
  { label: 'New Type', count: hv.newType, color: '#1abc9c' }, // ADD HERE
];
```

### Adjusting Performance Limits

**Instance Limit** (code.ts:4811):
```typescript
const MAX_INSTANCES_TO_ANALYZE = 1000; // Change this number
```

**Recursion Depth** (code.ts:5395, 5421):
```typescript
const MAX_DEPTH = 50; // Change this number
```

**Progress Logging Frequency** (code.ts:4836):
```typescript
if (processedCount % 100 === 0) { // Change 100 to different interval
  console.log(`Processed ${processedCount}/${instancesToAnalyze.length} instances...`);
}
```

### Debugging

**Enable console logging:**
1. In Figma, press `Cmd+Option+I` (Mac) or `Ctrl+Shift+I` (Windows)
2. Look for console.log output from code.ts
3. Plugin already has extensive logging for:
   - Selection details
   - Instance counts
   - Variable detection
   - Hardcoded value detection

**Common issues:**
- **Empty metrics:** Check if selection contains component instances
- **Inflated orphan rate:** Check if zero values are being counted
- **Missing libraries:** Ensure libraries are enabled in Settings
- **Performance issues:** Check instance count in console, reduce selection size

## Testing Workflow

1. **Make changes** to code.ts or ui.html
2. **Build:** `npm run build`
3. **Reload plugin** in Figma (right-click plugin ’ "Reload plugin")
4. **Select components** on canvas
5. **Run plugin** and verify results
6. **Check console** (Cmd+Option+I) for detailed logs

## Research Context

This plugin implements industry-standard metrics:

**IBM Carbon Design System:**
- Achieved 44.8% adoption in 10 months
- Foundation-first approach emphasized
- Measured at property level, not component level

**Atlassian Design System:**
- Target: 95% adoption
- Focus on token adoption over component adoption
- Clear executive dashboards with transparent formulas

**Pinterest Gestalt:**
- Foundation-first methodology
- Token adoption drives consistency
- Components are easier to replace than fixing token misuse

**Key Insight:**
Tokens/variables drive 80% of consistency value because they affect every component. Getting token adoption right early prevents technical debt. Component adoption is important but secondary to getting the foundations right.

## Future Enhancements

**Planned (see roadmap in README):**
- Spacing token support with smarter heuristics
- Export to CSV/JSON for historical tracking
- Component-level drill-down view
- Auto-fix suggestions for orphans

**Technical Debt:**
- Spacing detection needs smarter logic to avoid false positives
- Library detection could be more robust (currently key-based)
- Could cache analysis results for large selections

## Getting Help

When asking Claude Code for help:

1. **Be specific about the file and line numbers**
   - "Update countVariableBoundProperties() at line 5129"
   - "Fix the orphan rate calculation in ui.html around line 480"

2. **Provide context about what you're trying to achieve**
   - "I want to add spacing back but only for non-zero values"
   - "The token adoption metric seems too low, let me show you the console output"

3. **Mention if you're seeing errors**
   - "TypeScript error at line X"
   - "Plugin crashes when selecting large frames"
   - "UI shows NaN for orphan rate"

4. **Reference the research foundation when discussing metrics**
   - "According to our research, token adoption should be property-level not component-level"
   - "IBM's methodology shows foundation-first weighting"

Claude Code has full context of:
- The entire codebase (code.ts, ui.html, manifest.json)
- This instruction file
- The README documentation
- Research foundation and methodology

## Quick Reference

**Build:** `npm run build`
**Watch Mode:** `npm run watch` (if configured)
**Console:** `Cmd+Option+I` in Figma
**Reload Plugin:** Right-click plugin in Figma ’ "Reload plugin"

**Key Line Numbers:**
- Selection analysis: code.ts:4551-4584
- Token detection: code.ts:5129-5250
- Orphan detection: code.ts:5253-5363
- UI rendering: ui.html:452-643
- Formula calculations: ui.html:475-507

**Important Concepts:**
- Property-level measurement (not component-level)
- Foundation-First weighting (55% tokens, 45% components)
- Orphan rate target: <20%
- Zero values are skipped
- Spacing is excluded

---

**Remember:** This plugin is for design system teams to measure adoption and present clear metrics to leadership. Accuracy and transparency are critical. Every formula shown in the UI must be defensible with research-backed methodology.
