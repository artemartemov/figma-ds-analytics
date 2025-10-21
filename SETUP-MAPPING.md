# Library Mapping Setup Guide

Since the Figma REST API isn't available on your plan, we use a manual mapping approach to identify which library file each component comes from.

## Quick Overview

1. **Library Scanner Plugin** - Separate helper plugin to run in each library file
2. **Manual Mapping** - Copy scanner output and paste into main plugin code
3. **Main Plugin** - Uses the mapping to show granular breakdown

## Step-by-Step Instructions

### Step 1: Build Both Plugins

**Main Plugin:**
```bash
cd /Users/aartemov/dev/figma-ds-coverage
npm run build
```

**Library Scanner:**
```bash
cd /Users/aartemov/dev/figma-library-scanner
npm install  # first time only
npm run build
```

This compiles:
- Main plugin: `code.js` - Coverage tracker
- Helper plugin: `library-scanner.js` - Component key exporter

### Step 2: Load Library Scanner Plugin

1. Open **Figma Desktop App**
2. Navigate to **Plugins → Development → Import plugin from manifest...**
3. Select `/Users/aartemov/dev/figma-library-scanner/manifest.json`
4. You should see "Library Scanner (for DS Coverage)" in your dev plugins list

### Step 3: Scan Your Library Files

**For Spandex - Atomic Components:**

1. Open the file: `https://www.figma.com/design/InpIo07lJCQvldX1Bht1QP/Spandex---Atomic-Components`
2. Run: **Plugins → Development → Library Scanner (for DS Coverage)**
3. Plugin will scan all components and display results
4. Click **"Copy to Clipboard"**
5. Keep this copied - you'll paste it in the next step

**For Spandex - Global Foundations (if it has components):**

1. Open the file: `https://www.figma.com/design/Ro8uVRaYZgiPot0D6lZEmq/Spandex---Global-Foundations`
2. Run the Library Scanner plugin
3. Click **"Copy to Clipboard"**

**For any other team libraries:**

- Repeat the process for each library file

### Step 4: Update the Mapping

1. Open `/Users/aartemov/dev/figma-ds-coverage/code.ts`
2. Find the section starting at line 32:

```typescript
const COMPONENT_KEY_TO_LIBRARY: { [key: string]: string } = {
  // Paste scanner output here after running Library Scanner in each library file
  // Example format:
  // '7f4134dda7f3445fe025474c71b59f22555b9ff7': 'Spandex - Atomic Components',
};
```

3. Paste the scanner output inside the curly braces:

```typescript
const COMPONENT_KEY_TO_LIBRARY: { [key: string]: string } = {
  // Spandex - Atomic Components
  '7f4134dda7f3445fe025474c71b59f22555b9ff7': 'Spandex - Atomic Components',  // Platform=iOS
  'abc123...': 'Spandex - Atomic Components',  // Button/Primary
  // ... (all the other keys from the scanner output)

  // Spandex - Global Foundations
  'def456...': 'Spandex - Global Foundations',  // SomeComponent
  // ... (if this library has components)
};
```

4. Save the file

### Step 5: Rebuild the Main Plugin

```bash
npm run build
```

### Step 6: Reload Main Plugin in Figma

1. In Figma, right-click on "Design System Coverage" plugin
2. Select **"Reload plugin"**
3. Or close and re-run the plugin

### Step 7: Test It

1. Navigate to your handoff page
2. Run: **Plugins → Development → Design System Coverage**
3. Check the console output for mapping status:
   - ✅ "All library components are mapped!" = Success!
   - ⚠️ "Some components are not mapped" = Need to scan more libraries
4. Look at the "Component Sources" breakdown in the UI
   - You should now see "Spandex - Atomic Components", "Spandex - Global Foundations", etc.
   - Instead of just "Other Library (not mapped)"

## Troubleshooting

### "All components show as 'Other Library (not mapped)'"

**Cause**: The mapping hasn't been added to code.ts yet

**Fix**:
1. Make sure you ran the Library Scanner in your library files
2. Copy the output
3. Paste it into code.ts at line 32 (inside `COMPONENT_KEY_TO_LIBRARY`)
4. Run `npm run build`
5. Reload the plugin in Figma

### "Some components are not mapped"

**Cause**: You have components from libraries you haven't scanned yet

**Fix**:
1. Check the console to see sample unmapped keys
2. These might be from other team libraries
3. Open those library files in Figma
4. Run the Library Scanner on them
5. Add their keys to the mapping in code.ts
6. Rebuild and reload

### Library Scanner shows no components

**Cause**: The file might only contain variables/styles, not components

**Fix**: This is normal for files like "Global Foundations" which primarily hold variables. You only need to scan files that contain actual components.

### Components show as "Local Components" but they're from a library

**Cause**: The component's `remote` property is false, meaning it's not from a published library

**Fix**: Make sure the library is properly published as a team library in Figma. Local copies of library components will show as local.

## Maintenance

**When library components are added/updated:**

You may need to re-scan if:
- New components are added to libraries
- Components are renamed (keys might change)
- New library files are created

Just re-run the Library Scanner and update the mapping in code.ts.

## Example Output

After proper setup, you should see:

```
Component Sources
├─ Spandex - Atomic Components: 145 (72%)
├─ Local Components: 45 (22%)
└─ Other Library (not mapped): 12 (6%)
```

The "Other Library" entries indicate components from libraries you haven't scanned yet.
