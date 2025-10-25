// Metrics calculation for component coverage and token adoption
import { countVariableBoundPropertiesRecursive, collectTokenBoundDetails } from './tokenDetector';
import { detectHardcodedValuesRecursive, collectOrphanDetails } from './orphanDetector';
import { checkInstanceForVariables } from '../utils/variableResolver';
import type { OrphanDetail, TokenBoundDetail, LibraryBreakdown } from '../types';

export interface TokenAnalysisResult {
  variableBoundTotals: {
    colors: number;
    typography: number;
    spacing: number;
    radius: number;
  };
  totalVariableBound: number;
  tokenBoundDetails: TokenBoundDetail[];
}

export interface OrphanAnalysisResult {
  hardcodedTotals: {
    colors: number;
    typography: number;
    spacing: number;
    radius: number;
  };
  totalHardcoded: number;
  orphanDetails: OrphanDetail[];
}

export interface VariableUsageResult {
  componentsWithVariables: number;
  componentsWithoutVariables: number;
}

export interface CoverageCalculationResult {
  componentCoverage: number;
  variableCoverage: number;
  totalInstances: number;
  totalComponents: number;
}

/**
 * Count variable usage across instances (for old variable coverage metric)
 */
export function calculateVariableUsage(
  componentInstances: InstanceNode[],
  _wrapperInstanceIds: Set<string>
): VariableUsageResult {
  let componentsWithVariables = 0;
  let componentsWithoutVariables = 0;

  for (const instance of componentInstances) {
    // Include wrappers in variable counts since they may have their own variable usage
    const hasVariables = checkInstanceForVariables(instance);
    if (hasVariables) {
      componentsWithVariables++;
    } else {
      componentsWithoutVariables++;
    }
  }

  return {
    componentsWithVariables,
    componentsWithoutVariables,
  };
}

/**
 * Calculate component and variable coverage percentages
 */
export function calculateCoverage(
  libraryInstances: number,
  localInstances: number,
  componentsWithVariables: number,
  componentsWithoutVariables: number
): CoverageCalculationResult {
  // Component coverage: DS atomic components / (DS atomic + standalone local)
  const totalInstances = libraryInstances + localInstances;
  const componentCoverage = totalInstances > 0 ? (libraryInstances / totalInstances) * 100 : 0;

  // Old variable coverage metric (component-level)
  const totalComponents = componentsWithVariables + componentsWithoutVariables;
  const variableCoverage =
    totalComponents > 0 ? (componentsWithVariables / totalComponents) * 100 : 0;

  return {
    componentCoverage,
    variableCoverage,
    totalInstances,
    totalComponents,
  };
}

/**
 * Create library breakdown with percentages
 */
export function createLibraryBreakdown(
  librarySourceCounts: Map<string, number>,
  totalInstances: number
): LibraryBreakdown[] {
  return Array.from(librarySourceCounts.entries())
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalInstances > 0 ? (count / totalInstances) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count); // Sort by count descending
}

/**
 * Analyze token-bound properties across instances with progress updates
 */
export async function analyzeTokens(
  instancesToAnalyze: InstanceNode[],
  onProgress?: (processed: number, total: number) => Promise<void>
): Promise<TokenAnalysisResult> {
  const variableBoundTotals = {
    colors: 0,
    typography: 0,
    spacing: 0,
    radius: 0,
  };

  let processedCount = 0;
  const updateInterval = Math.max(20, Math.floor(instancesToAnalyze.length / 5));

  for (const instance of instancesToAnalyze) {
    const bound = countVariableBoundPropertiesRecursive(instance);
    variableBoundTotals.colors += bound.colors;
    variableBoundTotals.typography += bound.typography;
    variableBoundTotals.spacing += bound.spacing;
    variableBoundTotals.radius += bound.radius;

    processedCount++;
    if (
      onProgress &&
      (processedCount % updateInterval === 0 || processedCount === instancesToAnalyze.length)
    ) {
      await onProgress(processedCount, instancesToAnalyze.length);
    }
  }

  const totalVariableBound =
    variableBoundTotals.colors +
    variableBoundTotals.typography +
    variableBoundTotals.spacing +
    variableBoundTotals.radius;

  // Collect token-bound property details
  const tokenBoundDetails: TokenBoundDetail[] = [];
  for (const instance of instancesToAnalyze) {
    const componentId = instance.mainComponent?.id || instance.id;
    const componentName = instance.mainComponent?.name || instance.name || 'Unknown Component';
    const instanceId = instance.id;
    collectTokenBoundDetails(
      instance,
      tokenBoundDetails,
      0,
      componentId,
      componentName,
      instanceId
    );
  }

  return {
    variableBoundTotals,
    totalVariableBound,
    tokenBoundDetails,
  };
}

/**
 * Analyze hardcoded (orphan) values across instances with progress updates
 */
export async function analyzeOrphans(
  instancesToAnalyze: InstanceNode[],
  onProgress?: (processed: number, total: number) => Promise<void>
): Promise<OrphanAnalysisResult> {
  const hardcodedTotals = {
    colors: 0,
    typography: 0,
    spacing: 0,
    radius: 0,
  };

  let processedCount = 0;
  const updateInterval = Math.max(20, Math.floor(instancesToAnalyze.length / 4));

  for (const instance of instancesToAnalyze) {
    const hardcoded = detectHardcodedValuesRecursive(instance);
    hardcodedTotals.colors += hardcoded.colors;
    hardcodedTotals.typography += hardcoded.typography;
    hardcodedTotals.spacing += hardcoded.spacing;
    hardcodedTotals.radius += hardcoded.radius;

    processedCount++;
    if (
      onProgress &&
      (processedCount % updateInterval === 0 || processedCount === instancesToAnalyze.length)
    ) {
      await onProgress(processedCount, instancesToAnalyze.length);
    }
  }

  const totalHardcoded =
    hardcodedTotals.colors +
    hardcodedTotals.typography +
    hardcodedTotals.spacing +
    hardcodedTotals.radius;

  // Collect detailed orphan information
  const orphanDetails: OrphanDetail[] = [];
  for (const instance of instancesToAnalyze) {
    const componentId = instance.mainComponent?.id || instance.id;
    const componentName = instance.mainComponent?.name || instance.name || 'Unknown Component';
    const instanceId = instance.id;
    collectOrphanDetails(instance, orphanDetails, 0, componentId, componentName, instanceId);
  }

  return {
    hardcodedTotals,
    totalHardcoded,
    orphanDetails,
  };
}

/**
 * Calculate accurate token adoption using property-level measurement
 */
export function calculateTokenAdoption(totalVariableBound: number, totalHardcoded: number): number {
  const totalOpportunities = totalVariableBound + totalHardcoded;
  return totalOpportunities > 0 ? (totalVariableBound / totalOpportunities) * 100 : 0;
}
