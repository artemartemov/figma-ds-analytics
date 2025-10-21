# Design System Coverage Tracker

A Figma plugin that measures design system adoption by analyzing component usage and token adoption in your designs. Built with research-backed methodologies from industry leaders like IBM, Atlassian, and Pinterest.

## Features

- **Selection-Based Analysis** - Analyze specific frames, sections, or components instead of entire pages
- **Component Coverage** - Track usage of design system components vs. local/custom components
- **Token Adoption** - Measure adoption of design tokens (colors, typography, radius, borders)
- **Orphan Rate** - Identify hardcoded values that should be using design tokens (target: <20%)
- **Balanced Weighting** - Equal weight formula (Variables 50%, Components 50%)
- **Library Breakdown** - See which team libraries are being used most
- **Industry Benchmarks** - Compare your adoption against industry standards
- **Transparent Formulas** - Show executives exactly how metrics are calculated

## Installation

### For Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/artemartemov/figma-ds-analytics.git
   cd figma-ds-analytics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the plugin**
   ```bash
   npm run build
   ```

4. **Load in Figma**
   - Open Figma Desktop App
   - Go to Plugins → Development → Import plugin from manifest...
   - Select the `manifest.json` file from this directory

## Usage

### Quick Start

1. **Select** one or more frames, sections, or components on your canvas
2. **Run** the plugin from Plugins → Design System Coverage
3. **View** your metrics and insights

### Configure Team Libraries

1. Click **⚙️ Settings** in the plugin
2. Enable the team libraries you want to track
3. Click **Save & Apply**
4. Re-analyze your selection

### Understanding the Metrics

#### Design System Adoption (Overall Score)
**Formula:** `(Token Adoption × 0.5) + (Component Coverage × 0.5)`

The overall adoption score uses **balanced weighting** that treats design tokens and components equally (50% each). This provides a comprehensive view of design system adoption across both foundational elements and component usage.

**Industry Benchmarks:**
- **<40%** - Early adoption (needs intervention)
- **40-60%** - Healthy early growth (focus on education)
- **60-80%** - Strong momentum (optimize and migrate)
- **80-95%** - Mature success (sustainability focus)
- **>95%** - Exceptional achievement (industry-leading)

#### Component Coverage
**Formula:** `DS Components / (DS Components + Local Components) × 100`

Measures what percentage of component instances come from your design system libraries vs. local/custom components.

#### Token Adoption
**Formula:** `Variable-bound Properties / (Variable-bound + Hardcoded Properties) × 100`

Measures the percentage of properties (colors, typography, radius, borders) that are using design tokens instead of hardcoded values. This is calculated at the **property level**, not component level.

#### Orphan Rate
**Formula:** `Hardcoded Properties / Total Properties × 100`

The inverse of Token Adoption. Identifies "orphan" values - hardcoded colors, typography, radius, and borders that should be using design tokens. Industry target is **<20%**.

**What's measured:**
- ✅ Colors (fills, strokes)
- ✅ Typography (font size, line height, letter spacing, font family, weight)
- ✅ Border Radius (corner radius > 0)
- ✅ Borders (stroke weight > 0)
- ❌ Spacing (currently excluded)

**What's skipped:**
- Zero values (padding: 0, radius: 0, strokeWeight: 0)
- Invisible fills/strokes
- Text using text styles (counted as token adoption)

## Performance

The plugin is optimized for large files:
- **Instance Limit:** Analyzes up to 1,000 component instances for detailed token detection
- **Depth Limit:** Traverses up to 50 levels deep to prevent stack overflow
- **Progress Logging:** Shows progress every 100 instances in the console (Cmd+Option+I)

For files with thousands of components, use selection-based analysis to target specific sections.

## Development

### Project Structure

```
figma-ds-coverage/
├── code.ts           # Main plugin logic (TypeScript)
├── ui.html           # Plugin UI (HTML/CSS/JS)
├── manifest.json     # Plugin manifest
├── tsconfig.json     # TypeScript configuration
├── package.json      # Dependencies
├── .claude/          # Claude Code instructions
└── README.md         # Documentation
```

### Key Functions

**`analyzeCoverage()`** (code.ts:4551)
- Main analysis function
- Scans selected nodes for component instances
- Counts library vs. local components
- Detects variable-bound and hardcoded properties
- Returns metrics object

**`countVariableBoundProperties()`** (code.ts:5129)
- Counts properties using design tokens
- Checks fills, strokes, typography, radius, borders
- Skips zero values

**`detectHardcodedValues()`** (code.ts:5253)
- Detects hardcoded properties (orphans)
- Mirror logic of countVariableBoundProperties
- Filters out intentional zero values

**`displayResults()`** (ui.html:452)
- Renders metrics in the UI
- Calculates balanced 50/50 weighted score
- Shows breakdowns and benchmarks

### Building

```bash
# Production build
npm run build

# Watch mode for development
npm run watch
```

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch mode for development (if configured)

## Research Foundation

This plugin's methodology is based on research from:

- **IBM Carbon Design System** - 44.8% adoption in 10 months
- **Atlassian Design System** - 95% adoption target
- **Pinterest Gestalt** - Foundation-first approach
- **Airbnb Design System** - Near 100% at maturity

Key insights applied:
- Balanced weighting (tokens = components, 50/50 split)
- Orphan Rate as a quality metric (<20% target)
- Property-level token measurement (not component-level)
- Transparent formula display for executives
- Industry benchmarks for context

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development with Claude Code

This project includes Claude Code instructions in `.claude/CLAUDE.md` for AI-assisted development. If you're using Claude Code:

1. Open the project in Claude Code
2. Claude will automatically read the project instructions
3. Ask Claude to help with features, bug fixes, or refactoring

## Roadmap

- [ ] **Spacing Support** - Add spacing token detection (currently excluded due to complexity)
- [ ] **Export Reports** - CSV/JSON export of metrics for tracking over time
- [ ] **Historical Tracking** - Track adoption trends across versions
- [ ] **Component-Level Details** - Drill down into specific components
- [ ] **Figma Variables API v2** - Support for new variable features
- [ ] **Auto-Fix Orphans** - Suggest token replacements for hardcoded values
- [ ] **Team Dashboards** - Aggregate metrics across files/teams

## License

MIT License - see LICENSE file for details

## Support

- **Issues:** [GitHub Issues](https://github.com/artemartemov/figma-ds-analytics/issues)
- **Discussions:** [GitHub Discussions](https://github.com/artemartemov/figma-ds-analytics/discussions)

## Acknowledgments

- Research from IBM, Atlassian, Pinterest, and Airbnb design system teams
- Figma Plugin API and community
- Industry leaders who shared adoption metrics and methodologies

---

**Made with ❤️ for design system teams**
