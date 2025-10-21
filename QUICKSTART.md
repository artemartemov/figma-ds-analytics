# Quick Start - Get Your Number by EOD

## 3-Minute Setup

### 1. Plugin is Already Built ✓
The `code.js` file is ready to go.

### 2. Load Into Figma (2 minutes)

1. Open **Figma Desktop App** (required for plugins)
2. **Menu** → **Plugins** → **Development** → **Import plugin from manifest...**
3. Navigate to: `/Users/aartemov/dev/figma-ds-coverage`
4. Select `manifest.json`
5. Click **Open**

### 3. Run on Your Handoff Page (30 seconds)

1. Open your team file with the handoff page
2. Navigate to the page you want to measure
3. **Menu** → **Plugins** → **Development** → **Design System Coverage**
4. Plugin runs automatically and shows:
   - **Overall Adoption %** (your main number)
   - Component coverage
   - Variable coverage
   - Detailed breakdown

### 4. Get Your Number

The **Overall Adoption** percentage is your EOD number. It's calculated as:
- 60% weight on component coverage (library vs. local)
- 40% weight on variable coverage (tokens vs. custom)

## What the Numbers Mean

| Score | Meaning |
|-------|---------|
| <40% | Early adoption phase |
| 40-60% | Healthy growth |
| 60-80% | Strong momentum |
| 80-95% | Mature success |
| >95% | Exceptional |

## Troubleshooting

**Plugin won't load?**
- Make sure you're using Figma Desktop (not browser)
- Check that `code.js` exists in the directory

**Shows 0%?**
- Make sure you're on a page with designs (not an empty page)
- Component coverage requires library components (published from team libraries)
- Variable coverage requires Figma Variables (not legacy styles)

**Need different page?**
- The plugin analyzes the **current page only**
- Switch pages and click **Refresh** in the plugin

## Quick Tips

- Run on your **handoff page** for the most accurate team file metric
- **Refresh** button re-analyzes if you make changes
- Stats show exact counts (library components, local components, etc.)
- Benchmark text gives context based on your score

## Next Steps

Once you have your number, you can:
1. Report the Overall Adoption % to stakeholders
2. Use the breakdown (components vs. variables) to identify gaps
3. Track progress by running again after improvements
4. Reference your research doc for industry benchmarks and best practices
