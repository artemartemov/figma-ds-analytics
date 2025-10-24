// Design System Coverage Plugin
// Calculates component and variable adoption metrics

import type {
  LibraryBreakdown,
  OrphanDetail,
  TokenBoundDetail,
  ComponentInstanceDetail,
  CoverageMetrics,
  CollectionMapping,
  DetectedCollection,
  TeamLibrary,
} from './types';
import {
  loadEnabledLibraries,
  saveEnabledLibraries,
  loadCollectionMappings,
  saveCollectionMappings,
  loadIgnoredComponents,
  saveIgnoredComponents,
  loadIgnoredOrphans,
  saveIgnoredOrphans,
  loadIgnoredInstances,
  saveIgnoredInstances,
  loadOnboardingStatus,
  saveOnboardingStatus,
} from './utils/storage';
import {
  getAvailableLibraries,
  isFromEnabledLibrary,
  getLibraryNameFromVariable,
  detectVariableCollections,
} from './utils/libraryManager';
import {
  resolveVariableId,
  collectVariableIds,
  collectVariableIdsRecursive,
  checkNodeForVariables,
  hasVariablesRecursive,
  checkInstanceForVariables,
  clearAliasResolutions,
} from './utils/variableResolver';

// ========================================
// CONFIGURATION: Component Key Mapping
// ========================================
// This mapping is populated by running the Library Scanner plugin
// in each library file and pasting the output into library-mapping.ts
// Then rebuild with: npm run build

// Import the mappings from data files
import { COMPONENT_KEY_TO_LIBRARY } from './data/componentMappings';
import { VARIABLE_ID_TO_LIBRARY } from './data/variableMappings';
// Helper function to get library name from component key
function getLibraryNameFromKey(key: string): string | null {
  return COMPONENT_KEY_TO_LIBRARY[key] || null;
}

// Helper function to get library name from variable ID (deprecated - use collection-based mapping)
function getLibraryNameFromVariableId(id: string): string | null {
  return VARIABLE_ID_TO_LIBRARY[id] || null;
}

// ========================================

import { showUI, on, emit } from '@create-figma-plugin/utilities';

// Cancellation flag for analysis (global scope)
let analysisCancelled = false;

export default function () {
  showUI({ width: 440, height: 800 });

  // Send initial selection status to UI
  function checkAndSendSelectionStatus() {
    const selection = figma.currentPage.selection;
    const hasSelection = selection.length > 0;

    emit('SELECTION_STATUS', {
      hasSelection,
      count: selection.length,
    });
  }

  // Listen for selection changes
  figma.on('selectionchange', () => {
    checkAndSendSelectionStatus();
  });

  // Check selection status after UI has time to mount and register handlers
  setTimeout(() => {
    checkAndSendSelectionStatus();
  }, 150);

  // Listen for UI events
  on('ANALYZE', async () => {
    try {
      // Reset cancellation flag when starting new analysis
      analysisCancelled = false;
      const metrics = await analyzeCoverage();
      emit('RESULTS', metrics);
    } catch (error) {
      // Don't show error if user cancelled the analysis
      if (error instanceof Error && error.message === 'Analysis cancelled by user') {
        // Silently ignore cancellation
        return;
      }
      emit('ERROR', error instanceof Error ? error.message : 'Unknown error occurred');
    }
  });

  on('CANCEL', () => {
    figma.closePlugin();
  });

  on('CANCEL_ANALYSIS', () => {
    // Set flag to stop ongoing analysis
    analysisCancelled = true;
  });

  on('SELECT_NODE', (nodeId: string) => {
    try {
      const node = figma.getNodeById(nodeId);
      if (node && 'absoluteBoundingBox' in node) {
        figma.currentPage.selection = [node as SceneNode];
        figma.viewport.scrollAndZoomIntoView([node as SceneNode]);
      }
    } catch (error) {
      console.error('Failed to select node:', error);
    }
  });

  on('IGNORE_COMPONENT', async (componentId: string) => {
    try {
      const ignoredComponents = await loadIgnoredComponents();
      ignoredComponents.add(componentId);
      await saveIgnoredComponents(ignoredComponents);
    } catch (error) {
      console.error('Failed to ignore component:', error);
    }
  });

  on('UNIGNORE_COMPONENT', async (componentId: string) => {
    try {
      const ignoredComponents = await loadIgnoredComponents();
      ignoredComponents.delete(componentId);
      await saveIgnoredComponents(ignoredComponents);
    } catch (error) {
      console.error('Failed to unignore component:', error);
    }
  });

  on('IGNORE_ORPHAN', async (nodeId: string) => {
    try {
      const ignoredOrphans = await loadIgnoredOrphans();
      ignoredOrphans.add(nodeId);
      await saveIgnoredOrphans(ignoredOrphans);
    } catch (error) {
      console.error('Failed to ignore orphan:', error);
    }
  });

  on('UNIGNORE_ORPHAN', async (nodeId: string) => {
    try {
      const ignoredOrphans = await loadIgnoredOrphans();
      ignoredOrphans.delete(nodeId);
      await saveIgnoredOrphans(ignoredOrphans);
    } catch (error) {
      console.error('Failed to unignore orphan:', error);
    }
  });

  on('IGNORE_INSTANCE', async (instanceId: string) => {
    try {
      const ignoredInstances = await loadIgnoredInstances();
      ignoredInstances.add(instanceId);
      await saveIgnoredInstances(ignoredInstances);
    } catch (error) {
      console.error('Failed to ignore instance:', error);
    }
  });

  on('UNIGNORE_INSTANCE', async (instanceId: string) => {
    try {
      const ignoredInstances = await loadIgnoredInstances();
      ignoredInstances.delete(instanceId);
      await saveIgnoredInstances(ignoredInstances);
    } catch (error) {
      console.error('Failed to unignore instance:', error);
    }
  });

  on('GET_ONBOARDING_STATUS', async () => {
    try {
      const hasSeenOnboarding = await loadOnboardingStatus();
      emit('ONBOARDING_STATUS', hasSeenOnboarding);
    } catch (error) {
      console.error('Failed to load onboarding status:', error);
      emit('ONBOARDING_STATUS', false);
    }
  });

  on('SET_ONBOARDING_SEEN', async () => {
    try {
      await saveOnboardingStatus(true);
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
    }
  });

  on('RESET_ONBOARDING', async () => {
    try {
      await saveOnboardingStatus(false);
      const hasSeenOnboarding = await loadOnboardingStatus();
      emit('ONBOARDING_STATUS', hasSeenOnboarding);
    } catch (error) {
      console.error('Failed to reset onboarding:', error);
    }
  });

  // Send onboarding status on plugin load (after UI handlers are registered)
  setTimeout(async () => {
    try {
      const hasSeenOnboarding = await loadOnboardingStatus();
      emit('ONBOARDING_STATUS', hasSeenOnboarding);
    } catch (error) {
      console.error('Failed to load onboarding status:', error);
      emit('ONBOARDING_STATUS', false);
    }
  }, 150);

  // Auto-run analysis on plugin load (only if onboarding has been seen)
  setTimeout(async () => {
    try {
      const hasSeenOnboarding = await loadOnboardingStatus();
      if (hasSeenOnboarding) {
        const metrics = await analyzeCoverage();
        emit('RESULTS', metrics);
      }
    } catch (error) {
      // Silently fail on initial load if no selection
    }
  }, 200);

}

// Helper function to send progress updates to UI with a delay for rendering
async function sendProgress(step: string, percent: number) {
  // Check if analysis was cancelled
  if (analysisCancelled) {
    throw new Error('Analysis cancelled by user');
  }
  emit('PROGRESS', { step, percent });
  // Delay to allow UI to render the update smoothly
  await new Promise(resolve => setTimeout(resolve, 200));
}

async function analyzeCoverage(): Promise<CoverageMetrics> {
  const page = figma.currentPage;
  const selection = page.selection;

  // Reset alias tracking for this analysis
  clearAliasResolutions();

  // Check if user has made a selection FIRST, before sending any progress
  if (selection.length === 0) {
    throw new Error('Please select frames, components, or sections to analyze');
  }

  await sendProgress('Initializing analysis...', 0);
  await sendProgress('Finding component instances...', 5);

  // Find all component instances within the selection
  const componentInstances: InstanceNode[] = [];
  let hiddenInstancesSkipped = 0;

  for (const selectedNode of selection) {
    // If the selected node itself is an instance, include it (if visible)
    if (selectedNode.type === 'INSTANCE') {
      const instance = selectedNode as InstanceNode;
      if (!isNodeOrAncestorHidden(instance)) {
        componentInstances.push(instance);
      } else {
        hiddenInstancesSkipped++;
      }
    }

    // Find all instances within the selected node
    if ('findAll' in selectedNode) {
      const childInstances = selectedNode.findAll(
        (node) => node.type === 'INSTANCE'
      ) as InstanceNode[];

      // Filter out hidden instances
      for (const instance of childInstances) {
        if (!isNodeOrAncestorHidden(instance)) {
          componentInstances.push(instance);
        } else {
          hiddenInstancesSkipped++;
        }
      }
    }
  }

  await sendProgress(`Categorizing ${componentInstances.length} components...`, 15);

  let libraryInstances = 0;
  let localInstances = 0;
  let componentsWithVariables = 0;
  let componentsWithoutVariables = 0;

  // Track components by library source
  const librarySourceCounts = new Map<string, number>();

  // Helper: Check if a component instance contains DS components internally
  const containsDSComponents = (instance: InstanceNode): boolean => {
    if (!('findAll' in instance)) return false;

    const internalInstances = instance.findAll(
      (node) => node.type === 'INSTANCE'
    ) as InstanceNode[];

    for (const internal of internalInstances) {
      const mainComp = internal.mainComponent;
      if (mainComp?.remote && mainComp.key) {
        const mappedLib = getLibraryNameFromKey(mainComp.key);
        if (mappedLib) {
          return true; // Contains at least one DS component
        }
      }
    }
    return false;
  };

  // Process all instances
  const localWithDSCount = { count: 0 };
  const localStandaloneCount = { count: 0 };
  const componentInstanceDetails: ComponentInstanceDetail[] = [];

  // Step 1: Identify wrapper instances (local components containing DS components)
  // We'll build a map of wrapper instance IDs that should be excluded from counts
  const wrapperInstanceIds = new Set<string>();

  for (const instance of componentInstances) {
    const mainComponent = instance.mainComponent;
    const isRemote = mainComponent?.remote === true;

    if (!isRemote) {
      // Check if this local component contains DS components
      const usesDS = containsDSComponents(instance);
      if (usesDS) {
        // This is a wrapper - mark it for exclusion from counts
        wrapperInstanceIds.add(instance.id);
      }
    }
  }

  // Step 2: Process all instances for categorization and counting
  for (const instance of componentInstances) {
    const mainComponent = instance.mainComponent;
    const isRemote = mainComponent?.remote === true;
    const isWrapper = wrapperInstanceIds.has(instance.id);

    let libraryName = 'Local Components';
    let isDesignSystemComponent = false;

    if (isRemote && mainComponent) {
      // Try to identify the specific library file using component key mapping
      const componentKey = mainComponent.key;

      if (componentKey) {
        const mappedLibrary = getLibraryNameFromKey(componentKey);

        if (mappedLibrary) {
          // Found in our mapping - this is a design system component
          libraryName = mappedLibrary;
          isDesignSystemComponent = true;
        } else {
          // Not in mapping - it's from another team library, not part of design system
          libraryName = 'Other Library (not mapped)';
          isDesignSystemComponent = false;
        }
      } else {
        libraryName = 'Other Library (no key)';
        isDesignSystemComponent = false;
      }
    } else if (!isRemote) {
      // Local component - check if it uses DS components internally
      if (isWrapper) {
        libraryName = 'Local (built with DS) - Wrapper';
        localWithDSCount.count++;
      } else {
        libraryName = 'Local (standalone)';
        localStandaloneCount.count++;
      }
    }

    // Collect instance details (keep all for UI display)
    componentInstanceDetails.push({
      instanceId: instance.id,
      instanceName: instance.name,
      componentId: mainComponent?.id || '',
      componentName: mainComponent?.name || instance.name,
      librarySource: libraryName
    });

    // NEW COUNTING LOGIC: Exclude wrappers from counts
    // Wrappers are excluded because their nested DS components are already counted
    if (isWrapper) {
      // Don't count wrappers in metrics
    } else {
      // Count only non-wrapper instances
      if (isDesignSystemComponent) {
        libraryInstances++;
      } else {
        localInstances++;
      }
    }

    // Track count by library source (for breakdown display, excluding wrappers)
    if (!isWrapper) {
      const currentCount = librarySourceCounts.get(libraryName) || 0;
      librarySourceCounts.set(libraryName, currentCount + 1);
    }

    // Count variable usage - check instance AND all children
    // Include wrappers in variable counts since they may have their own variable usage
    const hasVariables = checkInstanceForVariables(instance);
    if (hasVariables) {
      componentsWithVariables++;
    } else {
      componentsWithoutVariables++;
    }
  }

  // Calculate coverage percentages
  // NEW APPROACH: Count DS atomic components / (DS atomic + standalone local)
  // Wrappers are excluded because their nested DS components are already counted
  const totalInstances = libraryInstances + localInstances;
  const componentCoverage =
    totalInstances > 0 ? (libraryInstances / totalInstances) * 100 : 0;

  const totalComponents = componentsWithVariables + componentsWithoutVariables;
  const variableCoverage =
    totalComponents > 0 ? (componentsWithVariables / totalComponents) * 100 : 0;

  // Create library breakdown with percentages
  const libraryBreakdown: LibraryBreakdown[] = Array.from(
    librarySourceCounts.entries()
  )
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalInstances > 0 ? (count / totalInstances) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count); // Sort by count descending

  // Collect unique component keys
  const uniqueKeys = new Set<string>();
  const unmappedKeys: string[] = [];

  for (const instance of componentInstances) {
    const mainComponent = instance.mainComponent;
    if (mainComponent?.remote === true && mainComponent.key) {
      uniqueKeys.add(mainComponent.key);
      if (!getLibraryNameFromKey(mainComponent.key)) {
        unmappedKeys.push(mainComponent.key);
      }
    }
  }

  // ===================================================================
  // Variable Source Tracking (Library-Based)
  // ===================================================================
  const variableSourceCounts = new Map<string, number>();
  const allVariableIds = new Set<string>();
  const unmappedVariableIds = new Set<string>();
  const unmappedCollections = new Set<string>();

  // Collect all variable IDs from component instances
  for (const instance of componentInstances) {
    const variableIds = collectVariableIdsRecursive(instance);

    for (const id of variableIds) {
      allVariableIds.add(id);

      const variable = figma.variables.getVariableById(id);
      if (!variable) {
        unmappedVariableIds.add(id);
        continue;
      }

      const collection = figma.variables.getVariableCollectionById(variable.variableCollectionId);
      if (!collection) {
        unmappedVariableIds.add(id);
        continue;
      }

      const collectionKey = collection.key || collection.id;

      // Check if this variable is from an enabled library
      const libraryInfo = await isFromEnabledLibrary(collectionKey);

      if (libraryInfo.enabled && libraryInfo.libraryName) {
        const currentCount = variableSourceCounts.get(libraryInfo.libraryName) || 0;
        variableSourceCounts.set(libraryInfo.libraryName, currentCount + 1);
      } else {
        unmappedVariableIds.add(id);
        if (collection.remote) {
          unmappedCollections.add(`${collection.name} (from library - not enabled)`);
        }
        // Track unmapped variables as "Other Library (not enabled)"
        const currentCount = variableSourceCounts.get('Other Library (not enabled)') || 0;
        variableSourceCounts.set('Other Library (not enabled)', currentCount + 1);
      }
    }
  }

  const enabledLibraries = await loadEnabledLibraries();

  // Create variable breakdown with percentages
  const totalVariableUsages = Array.from(variableSourceCounts.values()).reduce((sum, count) => sum + count, 0);
  const variableBreakdown: LibraryBreakdown[] = Array.from(
    variableSourceCounts.entries()
  )
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalVariableUsages > 0 ? (count / totalVariableUsages) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count); // Sort by count descending

  // Count variable-bound properties (for accurate token adoption)
  // Limit processing to prevent crashes on large files
  const MAX_INSTANCES_TO_ANALYZE = 10000;
  const instancesToAnalyze = componentInstances.slice(0, MAX_INSTANCES_TO_ANALYZE);

  await sendProgress(`Analyzing tokens in ${instancesToAnalyze.length} components...`, 30);

  const variableBoundTotals = {
    colors: 0,
    typography: 0,
    spacing: 0,
    radius: 0,
  };

  let processedCount = 0;
  const updateInterval = Math.max(20, Math.floor(instancesToAnalyze.length / 5)); // Update 5 times max during this phase

  for (const instance of instancesToAnalyze) {
    const bound = countVariableBoundPropertiesRecursive(instance);
    variableBoundTotals.colors += bound.colors;
    variableBoundTotals.typography += bound.typography;
    variableBoundTotals.spacing += bound.spacing;
    variableBoundTotals.radius += bound.radius;

    processedCount++;
    // Update progress at key intervals
    if (processedCount % updateInterval === 0 || processedCount === instancesToAnalyze.length) {
      // Report progress: 30% to 60% range
      const progressPercent = 30 + (processedCount / instancesToAnalyze.length) * 30;
      await sendProgress(`Analyzing tokens (${processedCount}/${instancesToAnalyze.length})...`, progressPercent);
    }
  }

  const totalVariableBound = variableBoundTotals.colors + variableBoundTotals.typography +
                             variableBoundTotals.spacing + variableBoundTotals.radius;

  // Detect hardcoded values that should use variables
  const hardcodedTotals = {
    colors: 0,
    typography: 0,
    spacing: 0,
    radius: 0,
  };

  processedCount = 0;
  const updateInterval2 = Math.max(20, Math.floor(instancesToAnalyze.length / 4)); // Update 4 times max during this phase

  for (const instance of instancesToAnalyze) {
    const hardcoded = detectHardcodedValuesRecursive(instance);
    hardcodedTotals.colors += hardcoded.colors;
    hardcodedTotals.typography += hardcoded.typography;
    hardcodedTotals.spacing += hardcoded.spacing;
    hardcodedTotals.radius += hardcoded.radius;

    processedCount++;
    // Update progress at key intervals
    if (processedCount % updateInterval2 === 0 || processedCount === instancesToAnalyze.length) {
      // Report progress: 60% to 80% range
      const progressPercent = 60 + (processedCount / instancesToAnalyze.length) * 20;
      await sendProgress(`Detecting hardcoded values (${processedCount}/${instancesToAnalyze.length})...`, progressPercent);
    }
  }

  const totalHardcoded = hardcodedTotals.colors + hardcodedTotals.typography +
                         hardcodedTotals.spacing + hardcodedTotals.radius;

  // Collect detailed orphan information (for troubleshooting)
  const orphanDetails: OrphanDetail[] = [];
  for (const instance of instancesToAnalyze) {
    const componentId = instance.mainComponent?.id || instance.id;
    const componentName = instance.mainComponent?.name || instance.name || 'Unknown Component';
    const instanceId = instance.id;
    collectOrphanDetails(instance, orphanDetails, 0, componentId, componentName, instanceId);
    // No limit - collect details for ALL instances to ensure accurate filtering
  }

  // Collect token-bound property details
  const tokenBoundDetails: TokenBoundDetail[] = [];
  for (const instance of instancesToAnalyze) {
    const componentId = instance.mainComponent?.id || instance.id;
    const componentName = instance.mainComponent?.name || instance.name || 'Unknown Component';
    const instanceId = instance.id;
    collectTokenBoundDetails(instance, tokenBoundDetails, 0, componentId, componentName, instanceId);
    // No limit - collect details for ALL instances to ensure accurate filtering
  }

  await sendProgress('Loading ignored items...', 85);

  // Load ignored components, orphans, and instances (but don't filter - let UI handle it)
  const ignoredComponents = await loadIgnoredComponents();
  const ignoredOrphans = await loadIgnoredOrphans();
  const ignoredInstances = await loadIgnoredInstances();

  // Calculate TRUE total opportunities (variable-bound + hardcoded)
  // This is the research-backed approach: count ALL properties that could use tokens
  const totalOpportunities = totalVariableBound + totalHardcoded;

  // Calculate ACCURATE Token Adoption (research formula)
  // Token Adoption = Variable Instances / (Variable Instances + Custom Style Values) × 100
  const accurateVariableCoverage = totalOpportunities > 0
    ? (totalVariableBound / totalOpportunities) * 100
    : 0;

  await sendProgress('Finalizing results...', 95);

  return {
    componentCoverage,
    variableCoverage: accurateVariableCoverage, // Use accurate property-level token adoption
    stats: {
      totalNodes: componentInstances.length,
      libraryInstances,
      localInstances,
      nodesWithVariables: totalVariableBound, // Now showing property count, not component count
      nodesWithCustomStyles: totalHardcoded, // Now showing hardcoded property count
    },
    libraryBreakdown,
    variableBreakdown,
    componentDetails: componentInstanceDetails,
    ignoredInstances: Array.from(ignoredInstances),
    hardcodedValues: {
      colors: hardcodedTotals.colors,
      typography: hardcodedTotals.typography,
      spacing: hardcodedTotals.spacing,
      radius: hardcodedTotals.radius,
      totalHardcoded,
      totalOpportunities,
      details: orphanDetails,
      tokenBoundDetails: tokenBoundDetails,
      ignoredComponents: Array.from(ignoredComponents),
      ignoredOrphans: Array.from(ignoredOrphans),
    },
  };
}

// Check if a node should be skipped from analysis (spacers, handles, iOS-specific components)
function isSkippedNode(node: SceneNode): boolean {
  const name = (node.name || '').toLowerCase();

  // Check for layers/components to skip (case-insensitive)
  const skipPatterns = [
    'spacer',
    '.spacer value',
    '_spacervertical',
    '_spacerhorizontal',
    '_spacer',
    'handle',
    'segmentedcontrol-ios',
    'ios home affordance',
    'home indicator',
    'route builder map',
    'wip',
  ];

  return skipPatterns.some(pattern => name.includes(pattern.toLowerCase()));
}

// Check if node or any ancestor is hidden
function isNodeOrAncestorHidden(node: BaseNode): boolean {
  let current: BaseNode | null = node;

  while (current) {
    // Check if this node is hidden
    if ('visible' in current && current.visible === false) {
      return true;
    }

    // Move up to parent
    current = current.parent;

    // Stop at page level (pages can't be hidden)
    if (current && current.type === 'PAGE') {
      break;
    }
  }

  return false;
}

// Count properties using variables (for proper token adoption calculation)
function countVariableBoundProperties(node: SceneNode): {
  colors: number;
  typography: number;
  spacing: number;
  radius: number;
} {
  // Skip hidden layers (check node and all ancestors)
  if (isNodeOrAncestorHidden(node)) {
    return { colors: 0, typography: 0, spacing: 0, radius: 0 };
  }

  // Skip intentionally ignored layers (spacers, handles, iOS components)
  if (isSkippedNode(node)) {
    return { colors: 0, typography: 0, spacing: 0, radius: 0 };
  }

  const variableBound = {
    colors: 0,
    typography: 0,
    spacing: 0,
    radius: 0,
  };

  // Count fills using variables
  if ('fills' in node && node.fills !== figma.mixed) {
    const fills = node.fills as readonly Paint[];
    const hasFillVariable = node.boundVariables?.fills && Array.isArray(node.boundVariables.fills) && node.boundVariables.fills.length > 0;
    const visibleFills = fills.filter((fill: any) => fill.visible !== false);
    if (visibleFills.length > 0 && hasFillVariable) {
      variableBound.colors += visibleFills.length;
    }
  }

  // Count strokes using variables (colors only, not stroke weight)
  if ('strokes' in node && node.strokes) {
    const strokes = node.strokes;
    if (Array.isArray(strokes)) {
      const hasStrokeVariable = node.boundVariables?.strokes && Array.isArray(node.boundVariables.strokes) && node.boundVariables.strokes.length > 0;
      const visibleStrokes = strokes.filter((stroke: any) => stroke.visible !== false);

      if (visibleStrokes.length > 0 && hasStrokeVariable) {
        variableBound.colors += visibleStrokes.length;
      }
    }
  }

  // Count radius using variables
  if ('cornerRadius' in node && typeof node.cornerRadius === 'number') {
    const boundVars = node.boundVariables as any;
    const hasRadiusVariable = boundVars?.cornerRadius || boundVars?.topLeftRadius ||
                               boundVars?.topRightRadius || boundVars?.bottomLeftRadius ||
                               boundVars?.bottomRightRadius;
    if (node.cornerRadius > 0 && hasRadiusVariable) {
      variableBound.radius++;
    }
  }

  // Spacing excluded from token adoption calculation for now
  // if ('layoutMode' in node && node.layoutMode !== 'NONE') {
  //   const boundVars = node.boundVariables as any;
  //   const hasPaddingVariable = boundVars?.paddingLeft || boundVars?.paddingRight ||
  //                               boundVars?.paddingTop || boundVars?.paddingBottom ||
  //                               boundVars?.horizontalPadding || boundVars?.verticalPadding;
  //   const hasNonZeroPadding = ('paddingLeft' in node && (node as any).paddingLeft > 0) ||
  //                             ('paddingRight' in node && (node as any).paddingRight > 0) ||
  //                             ('paddingTop' in node && (node as any).paddingTop > 0) ||
  //                             ('paddingBottom' in node && (node as any).paddingBottom > 0);
  //   if (hasNonZeroPadding && hasPaddingVariable) variableBound.spacing++;
  //   const hasItemSpacingVariable = boundVars?.itemSpacing;
  //   if ('itemSpacing' in node && typeof node.itemSpacing === 'number' && node.itemSpacing > 0 && hasItemSpacingVariable) {
  //     variableBound.spacing++;
  //   }
  // }

  // Count typography using variables
  if (node.type === 'TEXT') {
    const textNode = node as TextNode;
    const hasTextStyle = textNode.textStyleId && textNode.textStyleId !== '';

    if (!hasTextStyle) {
      if (textNode.boundVariables?.fontSize) variableBound.typography++;
      if (textNode.boundVariables?.lineHeight) variableBound.typography++;
      if (textNode.boundVariables?.letterSpacing) variableBound.typography++;
      if (textNode.boundVariables?.fontFamily) variableBound.typography++;
      if (textNode.boundVariables?.fontWeight) variableBound.typography++;
    }
  }

  return variableBound;
}

// Collect token-bound property details with instance tracking
function collectTokenBoundDetails(node: SceneNode, details: TokenBoundDetail[], depth: number = 0, parentComponentId: string = '', parentComponentName: string = '', parentInstanceId: string = ''): void {
  const MAX_DEPTH = 50;
  if (depth > MAX_DEPTH) return;

  // Skip hidden layers
  if (isNodeOrAncestorHidden(node)) return;

  // Skip intentionally ignored layers
  if (isSkippedNode(node)) return;

  const nodeId = node.id;
  const nodeName = node.name || 'Unnamed';
  const nodeType = node.type;

  // Collect fills using variables
  if ('fills' in node && node.fills !== figma.mixed) {
    const fills = node.fills as readonly Paint[];
    const hasFillVariable = node.boundVariables?.fills && Array.isArray(node.boundVariables.fills) && node.boundVariables.fills.length > 0;
    const visibleFills = fills.filter((fill: any) => fill.visible !== false);
    if (visibleFills.length > 0 && hasFillVariable) {
      const properties = visibleFills.map((_, idx) => `fill[${idx}]`);
      details.push({
        nodeId,
        nodeName,
        nodeType,
        category: 'colors',
        properties,
        parentComponentId,
        parentComponentName,
        parentInstanceId
      });
    }
  }

  // Collect strokes using variables
  if ('strokes' in node && node.strokes) {
    const strokes = node.strokes;
    if (Array.isArray(strokes)) {
      const hasStrokeVariable = node.boundVariables?.strokes && Array.isArray(node.boundVariables.strokes) && node.boundVariables.strokes.length > 0;
      const visibleStrokes = strokes.filter((stroke: any) => stroke.visible !== false);
      if (visibleStrokes.length > 0 && hasStrokeVariable) {
        const properties = visibleStrokes.map((_, idx) => `stroke[${idx}]`);
        details.push({
          nodeId,
          nodeName,
          nodeType,
          category: 'colors',
          properties,
          parentComponentId,
          parentComponentName,
          parentInstanceId
        });
      }
    }
  }

  // Collect radius using variables
  if ('cornerRadius' in node && typeof node.cornerRadius === 'number') {
    const boundVars = node.boundVariables as any;
    const hasRadiusVariable = boundVars?.cornerRadius || boundVars?.topLeftRadius ||
                               boundVars?.topRightRadius || boundVars?.bottomLeftRadius ||
                               boundVars?.bottomRightRadius;
    if (node.cornerRadius > 0 && hasRadiusVariable) {
      details.push({
        nodeId,
        nodeName,
        nodeType,
        category: 'radius',
        properties: ['cornerRadius'],
        parentComponentId,
        parentComponentName,
        parentInstanceId
      });
    }
  }

  // Collect typography using variables
  if (node.type === 'TEXT') {
    const textNode = node as TextNode;
    const hasTextStyle = textNode.textStyleId && textNode.textStyleId !== '';

    if (!hasTextStyle) {
      const properties: string[] = [];
      if (textNode.boundVariables?.fontSize) properties.push('fontSize');
      if (textNode.boundVariables?.lineHeight) properties.push('lineHeight');
      if (textNode.boundVariables?.letterSpacing) properties.push('letterSpacing');
      if (textNode.boundVariables?.fontFamily) properties.push('fontFamily');
      if (textNode.boundVariables?.fontWeight) properties.push('fontWeight');

      if (properties.length > 0) {
        details.push({
          nodeId,
          nodeName,
          nodeType,
          category: 'typography',
          properties,
          parentComponentId,
          parentComponentName,
          parentInstanceId
        });
      }
    }
  }

  // Recurse into children
  if ('children' in node) {
    const children = node.children as SceneNode[];
    for (const child of children) {
      collectTokenBoundDetails(child, details, depth + 1, parentComponentId, parentComponentName, parentInstanceId);
    }
  }
}

// Detect hardcoded values that should use variables
function detectHardcodedValues(node: SceneNode): {
  colors: number;
  typography: number;
  spacing: number;
  radius: number;
} {
  // Skip hidden layers (check node and all ancestors)
  if (isNodeOrAncestorHidden(node)) {
    return { colors: 0, typography: 0, spacing: 0, radius: 0 };
  }

  // Skip intentionally ignored layers (spacers, handles, iOS components)
  if (isSkippedNode(node)) {
    return { colors: 0, typography: 0, spacing: 0, radius: 0 };
  }

  const hardcoded = {
    colors: 0,
    typography: 0,
    spacing: 0,
    radius: 0,
  };

  // Check for hardcoded fills (colors)
  if ('fills' in node && node.fills !== figma.mixed) {
    const fills = node.fills as readonly Paint[];
    const hasFillVariable = node.boundVariables?.fills && Array.isArray(node.boundVariables.fills) && node.boundVariables.fills.length > 0;

    // Count fills that are actually visible and have content
    const visibleFills = fills.filter((fill: any) => {
      // Must be explicitly visible (or undefined which defaults to visible)
      if (fill.visible === false) return false;
      // Must have opacity > 0
      if (fill.opacity !== undefined && fill.opacity <= 0) return false;
      // For solid fills, must have a color set
      if (fill.type === 'SOLID' && !fill.color) return false;
      return true;
    });

    if (visibleFills.length > 0 && !hasFillVariable) {
      hardcoded.colors += visibleFills.length;
    }
  }

  // Check for hardcoded strokes (colors only, not stroke weight)
  if ('strokes' in node && node.strokes) {
    const strokes = node.strokes;
    if (Array.isArray(strokes)) {
      const hasStrokeVariable = node.boundVariables?.strokes && Array.isArray(node.boundVariables.strokes) && node.boundVariables.strokes.length > 0;

      // Count strokes that are actually visible and have content
      const visibleStrokes = strokes.filter((stroke: any) => {
        if (stroke.visible === false) return false;
        if (stroke.opacity !== undefined && stroke.opacity <= 0) return false;
        if (stroke.type === 'SOLID' && !stroke.color) return false;
        return true;
      });

      if (visibleStrokes.length > 0 && !hasStrokeVariable) {
        hardcoded.colors += visibleStrokes.length;
      }
    }
  }

  // Check for hardcoded corner radius
  if ('cornerRadius' in node && typeof node.cornerRadius === 'number') {
    const boundVars = node.boundVariables as any;
    const hasRadiusVariable = boundVars?.cornerRadius ||
                               boundVars?.topLeftRadius ||
                               boundVars?.topRightRadius ||
                               boundVars?.bottomLeftRadius ||
                               boundVars?.bottomRightRadius;

    if (node.cornerRadius > 0 && !hasRadiusVariable) {
      hardcoded.radius++;
    }
  }

  // Spacing excluded from orphan rate calculation for now
  // if ('layoutMode' in node && node.layoutMode !== 'NONE') {
  //   const boundVars = node.boundVariables as any;
  //   const hasPaddingVariable = boundVars?.paddingLeft ||
  //                               boundVars?.paddingRight ||
  //                               boundVars?.paddingTop ||
  //                               boundVars?.paddingBottom ||
  //                               boundVars?.horizontalPadding ||
  //                               boundVars?.verticalPadding;
  //   const hasNonZeroPadding = ('paddingLeft' in node && (node as any).paddingLeft > 0) ||
  //                             ('paddingRight' in node && (node as any).paddingRight > 0) ||
  //                             ('paddingTop' in node && (node as any).paddingTop > 0) ||
  //                             ('paddingBottom' in node && (node as any).paddingBottom > 0);
  //   if (hasNonZeroPadding && !hasPaddingVariable) {
  //     hardcoded.spacing++;
  //   }
  //   const hasItemSpacingVariable = boundVars?.itemSpacing;
  //   if ('itemSpacing' in node && typeof node.itemSpacing === 'number' && node.itemSpacing > 0 && !hasItemSpacingVariable) {
  //     hardcoded.spacing++;
  //   }
  // }

  // Check for hardcoded typography
  if (node.type === 'TEXT') {
    const textNode = node as TextNode;

    const hasFontSizeVariable = textNode.boundVariables?.fontSize;
    const hasLineHeightVariable = textNode.boundVariables?.lineHeight;
    const hasLetterSpacingVariable = textNode.boundVariables?.letterSpacing;
    const hasFontFamilyVariable = textNode.boundVariables?.fontFamily;
    const hasFontWeightVariable = textNode.boundVariables?.fontWeight;

    // Check if using text styles instead of variables
    const hasTextStyle = textNode.textStyleId && textNode.textStyleId !== '';

    if (!hasTextStyle) {
      if (!hasFontSizeVariable) hardcoded.typography++;
      if (!hasLineHeightVariable) hardcoded.typography++;
      if (!hasLetterSpacingVariable) hardcoded.typography++;
      if (!hasFontFamilyVariable) hardcoded.typography++;
      if (!hasFontWeightVariable) hardcoded.typography++;
    }
  }

  return hardcoded;
}

// Detect hardcoded values WITH details for troubleshooting
function detectHardcodedValuesWithDetails(node: SceneNode, parentComponentId: string = '', parentComponentName: string = '', parentInstanceId: string = ''): OrphanDetail | null {
  // Skip hidden layers (check node and all ancestors)
  if (isNodeOrAncestorHidden(node)) {
    return null;
  }

  // Skip intentionally ignored layers (spacers, handles, iOS components)
  if (isSkippedNode(node)) {
    return null;
  }

  const properties: string[] = [];
  const values: string[] = [];
  let category: 'colors' | 'typography' | 'spacing' | 'radius' | null = null;

  // Check for hardcoded typography (most common issue)
  if (node.type === 'TEXT') {
    const textNode = node as TextNode;
    const hasTextStyle = textNode.textStyleId && textNode.textStyleId !== '';

    if (!hasTextStyle) {
      if (!textNode.boundVariables?.fontSize && textNode.fontSize !== figma.mixed) {
        properties.push('fontSize');
        values.push(`${textNode.fontSize}px`);
      }
      if (!textNode.boundVariables?.lineHeight && textNode.lineHeight !== figma.mixed) {
        const lh = textNode.lineHeight;
        properties.push('lineHeight');
        values.push(typeof lh === 'object' && 'value' in lh ? `${lh.value}${lh.unit === 'PIXELS' ? 'px' : '%'}` : String(lh));
      }
      if (!textNode.boundVariables?.letterSpacing && textNode.letterSpacing !== figma.mixed) {
        const ls = textNode.letterSpacing;
        properties.push('letterSpacing');
        values.push(typeof ls === 'object' && 'value' in ls ? `${ls.value}${ls.unit === 'PIXELS' ? 'px' : '%'}` : String(ls));
      }
      if (!textNode.boundVariables?.fontFamily && textNode.fontName !== figma.mixed) {
        properties.push('fontFamily');
        values.push(textNode.fontName ? (typeof textNode.fontName === 'object' ? textNode.fontName.family : String(textNode.fontName)) : 'mixed');
      }
      if (!textNode.boundVariables?.fontWeight && textNode.fontName !== figma.mixed) {
        properties.push('fontWeight');
        values.push(textNode.fontName ? (typeof textNode.fontName === 'object' ? textNode.fontName.style : 'mixed') : 'mixed');
      }

      if (properties.length > 0) {
        category = 'typography';
      }
    }
  }

  // Check for hardcoded colors
  if ('fills' in node && node.fills !== figma.mixed) {
    const fills = node.fills as readonly Paint[];
    const hasFillVariable = node.boundVariables?.fills && Array.isArray(node.boundVariables.fills) && node.boundVariables.fills.length > 0;

    // Count fills that are actually visible and have content
    const visibleFills = fills.filter((fill: any) => {
      // Must be explicitly visible (or undefined which defaults to visible)
      if (fill.visible === false) return false;
      // Must have opacity > 0
      if (fill.opacity !== undefined && fill.opacity <= 0) return false;
      // For solid fills, must have a color set
      if (fill.type === 'SOLID' && !fill.color) return false;
      return true;
    });

    if (visibleFills.length > 0 && !hasFillVariable) {
      if (!category) category = 'colors';
      properties.push('fill');
      visibleFills.forEach((fill: any, i) => {
        if (fill.type === 'SOLID' && fill.color) {
          const r = Math.round(fill.color.r * 255);
          const g = Math.round(fill.color.g * 255);
          const b = Math.round(fill.color.b * 255);
          values.push(`rgb(${r}, ${g}, ${b})`);
        }
      });
    }
  }

  // Check for hardcoded radius
  if ('cornerRadius' in node && typeof node.cornerRadius === 'number' && node.cornerRadius > 0) {
    const boundVars = node.boundVariables as any;
    const hasRadiusVariable = boundVars?.cornerRadius || boundVars?.topLeftRadius ||
                               boundVars?.topRightRadius || boundVars?.bottomLeftRadius ||
                               boundVars?.bottomRightRadius;

    if (!hasRadiusVariable) {
      if (!category) category = 'radius';
      properties.push('cornerRadius');
      values.push(`${node.cornerRadius}px`);
    }
  }

  if (properties.length > 0 && category) {
    return {
      nodeId: node.id,
      nodeName: node.name || 'Unnamed',
      nodeType: node.type,
      category,
      properties,
      values,
      parentComponentId,
      parentComponentName,
      parentInstanceId, // Added to connect orphans to instances
    };
  }

  return null;
}

// Recursively count variable-bound properties
function countVariableBoundPropertiesRecursive(node: SceneNode, depth: number = 0): {
  colors: number;
  typography: number;
  spacing: number;
  radius: number;
} {
  const MAX_DEPTH = 50; // Prevent stack overflow on deeply nested components

  // Early return: skip this node and ALL its descendants if it matches skip patterns or is hidden
  if (isSkippedNode(node) || isNodeOrAncestorHidden(node)) {
    return { colors: 0, typography: 0, spacing: 0, radius: 0 };
  }

  const totals = countVariableBoundProperties(node);

  if (depth < MAX_DEPTH && 'children' in node) {
    const children = node.children as SceneNode[];
    for (const child of children) {
      // Skip hidden layers and intentionally ignored layers
      if (isNodeOrAncestorHidden(child) || isSkippedNode(child)) {
        continue;
      }
      const childBound = countVariableBoundPropertiesRecursive(child, depth + 1);
      totals.colors += childBound.colors;
      totals.typography += childBound.typography;
      totals.spacing += childBound.spacing;
      totals.radius += childBound.radius;
    }
  }

  return totals;
}

// Recursively detect hardcoded values in node tree
function detectHardcodedValuesRecursive(node: SceneNode, depth: number = 0): {
  colors: number;
  typography: number;
  spacing: number;
  radius: number;
} {
  const MAX_DEPTH = 50; // Prevent stack overflow on deeply nested components

  // Early return: skip this node and ALL its descendants if it matches skip patterns or is hidden
  if (isSkippedNode(node) || isNodeOrAncestorHidden(node)) {
    return { colors: 0, typography: 0, spacing: 0, radius: 0 };
  }

  const totals = detectHardcodedValues(node);

  // Recursively check children
  if (depth < MAX_DEPTH && 'children' in node) {
    const children = node.children as SceneNode[];
    for (const child of children) {
      // Skip hidden layers and intentionally ignored layers
      if (isNodeOrAncestorHidden(child) || isSkippedNode(child)) {
        continue;
      }
      const childHardcoded = detectHardcodedValuesRecursive(child, depth + 1);
      totals.colors += childHardcoded.colors;
      totals.typography += childHardcoded.typography;
      totals.spacing += childHardcoded.spacing;
      totals.radius += childHardcoded.radius;
    }
  }

  return totals;
}

// Recursively collect detailed orphan information
function collectOrphanDetails(node: SceneNode, details: OrphanDetail[], depth: number = 0, parentComponentId: string = '', parentComponentName: string = '', parentInstanceId: string = ''): void {
  const MAX_DEPTH = 50;
  const MAX_DETAILS = 100; // Limit to prevent performance issues

  if (depth >= MAX_DEPTH || details.length >= MAX_DETAILS) return;

  // Early return: skip this node and ALL its descendants if it matches skip patterns or is hidden
  if (isSkippedNode(node) || isNodeOrAncestorHidden(node)) {
    return;
  }

  // Check this node for orphans
  const orphan = detectHardcodedValuesWithDetails(node, parentComponentId, parentComponentName, parentInstanceId);
  if (orphan) {
    details.push(orphan);
  }

  // Check children
  if ('children' in node) {
    const children = node.children as SceneNode[];
    for (const child of children) {
      if (details.length >= MAX_DETAILS) break;
      // Skip hidden layers and intentionally ignored layers
      if (isNodeOrAncestorHidden(child) || isSkippedNode(child)) {
        continue;
      }
      collectOrphanDetails(child, details, depth + 1, parentComponentId, parentComponentName, parentInstanceId);
    }
  }
}

// Listen for messages from UI
