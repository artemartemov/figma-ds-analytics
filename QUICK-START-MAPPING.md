# Quick Start: Library Mapping Workflow

## TL;DR - Get Your Number with Library Breakdown

Since REST API isn't available, we use a two-plugin approach:
1. **Library Scanner** - Helper plugin (separate directory) to extract component keys from library files
2. **Main Plugin** - Coverage tracker that uses the mapping

## Initial Setup (One-Time)

### 1. Build Library Scanner

```bash
cd /Users/aartemov/dev/figma-library-scanner
npm install
npm run build
```

### 2. Load Library Scanner in Figma

- Figma Desktop → **Plugins → Development → Import plugin from manifest**
- Select: `/Users/aartemov/dev/figma-library-scanner/manifest.json`

## Getting the Mapping (One-Time per Library)

### 1. Scan Spandex - Atomic Components

1. Open: https://www.figma.com/design/InpIo07lJCQvldX1Bht1QP/Spandex---Atomic-Components
2. Run: **Plugins → Development → Library Scanner (for DS Coverage)**
3. Watch page-by-page progress:
   - Shows "Page 3/5: Components" with page name
   - Progress bar updates as it scans each page
   - More performant and visible than component-by-component
4. When complete, click **"Copy to Clipboard"**
5. Keep this copied for next step

### 2. Paste into Main Plugin

1. Open: `/Users/aartemov/dev/figma-ds-coverage/code.ts`
2. Find line 32: `const COMPONENT_KEY_TO_LIBRARY`
3. Paste the scanner output inside the curly braces:

```typescript
const COMPONENT_KEY_TO_LIBRARY: { [key: string]: string } = {
  // Paste here - should look like:
  '7f4134dda7f3445fe025474c71b59f22555b9ff7': 'Spandex - Atomic Components',  // Platform=iOS
  'abc123...': 'Spandex - Atomic Components',  // Button/Primary
  // ... etc
};
```

### 3. Scan Other Libraries (if needed)

Repeat steps 1-2 for:
- Spandex - Global Foundations (if it has components)
- Any other team libraries

Just paste additional keys into the same object.

### 4. Rebuild Main Plugin

```bash
cd /Users/aartemov/dev/figma-ds-coverage
npm run build
```

## Running the Main Plugin

### 1. Load Main Plugin (if not already loaded)

- Figma Desktop → **Plugins → Development → Import plugin from manifest**
- Select: `/Users/aartemov/dev/figma-ds-coverage/manifest.json`

### 2. Run on Your Handoff Page

1. Navigate to your handoff page in Figma
2. **Plugins → Development → Design System Coverage**
3. Plugin shows metrics automatically

### 3. Check Mapping Status

Look at the console (Figma → Plugins → Development → Show/Hide Console):
- ✅ "All library components are mapped!" = You're good!
- ⚠️ "Some components are not mapped" = Need to scan more libraries

### 4. View Granular Breakdown

In the plugin UI, scroll to **"Component Sources"** section:

```
Component Sources
├─ Spandex - Atomic Components: 145 (72%)
├─ Local Components: 45 (22%)
└─ Other Library (not mapped): 12 (6%)
```

## Expected Results

After proper setup, you should see:
- **Overall Adoption %** - Your main metric
- **Component Coverage** - With library breakdown
- **Variable Coverage** - Design token usage
- **Component Sources** - Granular library breakdown

## Updating the Mapping

**When to update:**
- New components added to libraries
- New library files created
- Components showing as "Other Library (not mapped)"

**How to update:**
1. Run Library Scanner in the library file
2. Copy output
3. Add/update keys in code.ts
4. Rebuild main plugin: `npm run build`
5. Reload plugin in Figma (right-click → "Reload plugin")

## Directory Structure

```
/Users/aartemov/dev/
├── figma-ds-coverage/          # Main plugin
│   ├── manifest.json
│   ├── code.ts                 # Edit COMPONENT_KEY_TO_LIBRARY here
│   ├── code.js                 # Built file
│   ├── ui.html
│   └── package.json
└── figma-library-scanner/      # Helper plugin (separate)
    ├── manifest.json
    ├── library-scanner.ts
    ├── library-scanner.js      # Built file
    ├── library-scanner.html
    └── package.json
```

## Troubleshooting

**"Other Library (not mapped)" shows up**
- Components from libraries you haven't scanned yet
- Run Library Scanner in those library files
- Add keys to code.ts mapping

**Main plugin doesn't reflect changes**
- Make sure you ran `npm run build` in main plugin directory
- Right-click plugin in Figma → "Reload plugin"

**Library Scanner shows "Found 0 components"**
- Normal for files with only variables/styles (like Global Foundations)
- Only scan files with actual component definitions

## Files to Edit

**Only edit this file:**
- `/Users/aartemov/dev/figma-ds-coverage/code.ts` - Line 32, inside `COMPONENT_KEY_TO_LIBRARY`

**Don't edit:**
- Built .js files (auto-generated)
- UI HTML files (unless changing design)
- Scanner plugin files (one-time helper only)
