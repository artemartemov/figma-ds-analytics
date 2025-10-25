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
import {
  isSkippedNode,
  isNodeOrAncestorHidden,
} from './utils/nodeFilters';
import {
  countVariableBoundProperties,
  collectTokenBoundDetails,
  countVariableBoundPropertiesRecursive,
} from './analyzers/tokenDetector';
import {
  detectHardcodedValues,
  detectHardcodedValuesWithDetails,
  detectHardcodedValuesRecursive,
  collectOrphanDetails,
} from './analyzers/orphanDetector';
import {
  collectComponentInstances,
  categorizeInstances,
} from './analyzers/instanceCollector';
import {
  trackVariableUsage,
} from './analyzers/variableTracker';
import {
  calculateVariableUsage,
  calculateCoverage,
  createLibraryBreakdown,
  analyzeTokens,
  analyzeOrphans,
  calculateTokenAdoption,
} from './analyzers/metricsCalculator';

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

  // Step 1: Collect all component instances from selection
  const { componentInstances } = collectComponentInstances(selection);

  await sendProgress(`Categorizing ${componentInstances.length} components...`, 15);

  // Step 2: Categorize instances into library, local, and wrapper types
  const {
    libraryInstances,
    localInstances,
    librarySourceCounts,
    componentInstanceDetails,
    wrapperInstanceIds,
  } = categorizeInstances(componentInstances, getLibraryNameFromKey);

  // Step 3: Calculate variable usage (component-level)
  const { componentsWithVariables, componentsWithoutVariables } = calculateVariableUsage(
    componentInstances,
    wrapperInstanceIds
  );

  // Step 4: Calculate coverage percentages
  const coverage = calculateCoverage(
    libraryInstances,
    localInstances,
    componentsWithVariables,
    componentsWithoutVariables
  );

  // Step 5: Create library breakdown
  const libraryBreakdown = createLibraryBreakdown(librarySourceCounts, coverage.totalInstances);

  // Step 6: Track variable usage by library source
  const { variableBreakdown } = await trackVariableUsage(componentInstances);

  // Step 7: Analyze token-bound properties (property-level)
  const MAX_INSTANCES_TO_ANALYZE = 10000;
  const instancesToAnalyze = componentInstances.slice(0, MAX_INSTANCES_TO_ANALYZE);

  await sendProgress(`Analyzing tokens in ${instancesToAnalyze.length} components...`, 30);

  const tokenAnalysis = await analyzeTokens(instancesToAnalyze, async (processed, total) => {
    const progressPercent = 30 + (processed / total) * 30;
    await sendProgress(`Analyzing tokens (${processed}/${total})...`, progressPercent);
  });

  // Step 8: Detect hardcoded (orphan) values
  const orphanAnalysis = await analyzeOrphans(instancesToAnalyze, async (processed, total) => {
    const progressPercent = 60 + (processed / total) * 20;
    await sendProgress(`Detecting hardcoded values (${processed}/${total})...`, progressPercent);
  });

  await sendProgress('Loading ignored items...', 85);

  // Step 9: Load ignored items
  const ignoredComponents = await loadIgnoredComponents();
  const ignoredOrphans = await loadIgnoredOrphans();
  const ignoredInstances = await loadIgnoredInstances();

  // Step 10: Calculate accurate token adoption (property-level)
  const totalOpportunities = tokenAnalysis.totalVariableBound + orphanAnalysis.totalHardcoded;
  const accurateVariableCoverage = calculateTokenAdoption(
    tokenAnalysis.totalVariableBound,
    orphanAnalysis.totalHardcoded
  );

  await sendProgress('Finalizing results...', 95);

  return {
    componentCoverage: coverage.componentCoverage,
    variableCoverage: accurateVariableCoverage,
    stats: {
      totalNodes: componentInstances.length,
      libraryInstances,
      localInstances,
      nodesWithVariables: tokenAnalysis.totalVariableBound,
      nodesWithCustomStyles: orphanAnalysis.totalHardcoded,
    },
    libraryBreakdown,
    variableBreakdown,
    componentDetails: componentInstanceDetails,
    ignoredInstances: Array.from(ignoredInstances),
    hardcodedValues: {
      colors: orphanAnalysis.hardcodedTotals.colors,
      typography: orphanAnalysis.hardcodedTotals.typography,
      spacing: orphanAnalysis.hardcodedTotals.spacing,
      radius: orphanAnalysis.hardcodedTotals.radius,
      totalHardcoded: orphanAnalysis.totalHardcoded,
      totalOpportunities,
      details: orphanAnalysis.orphanDetails,
      tokenBoundDetails: tokenAnalysis.tokenBoundDetails,
      ignoredComponents: Array.from(ignoredComponents),
      ignoredOrphans: Array.from(ignoredOrphans),
    },
  };
}

// Listen for messages from UI
