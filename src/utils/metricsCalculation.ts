/**
 * Metrics calculation utilities
 * Handles the complex logic for calculating filtered and unfiltered metrics
 */

import { METRIC_WEIGHTS } from '../content/constants';
import { isWrapperComponent, isLibraryComponent } from './libraryHelpers';
import { isOrphanIgnoredInComponent } from './orphanHelpers';
import type { CoverageMetrics, ComponentInstanceDetail } from '../types';

export interface FilteredMetrics {
  overallScore: number;
  componentCoverage: number;
  variableCoverage: number;
  orphanRate: number;
  orphanCount: number;
  totalHardcoded: number;
  tokenBoundCount: number;
  totalOpportunities: number;
  libraryInstances: number;
  totalInstances: number;
  libraryBreakdown: Array<{ name: string; count: number; percentage: number }>;
}

interface ComponentCounts {
  libraryInstances: number;
  localInstances: number;
  totalInstances: number;
}

/**
 * Calculates component counts excluding wrappers
 */
const calculateComponentCounts = (
  componentDetails: ComponentInstanceDetail[],
  ignoredInstances: Set<string>
): ComponentCounts => {
  const filteredInstances = componentDetails.filter(
    (instance) => !ignoredInstances.has(instance.instanceId)
  );

  let libraryInstances = 0;
  let localInstances = 0;

  filteredInstances.forEach((instance) => {
    if (isWrapperComponent(instance.librarySource)) {
      return; // Skip wrappers entirely
    }

    if (isLibraryComponent(instance.librarySource)) {
      libraryInstances++;
    } else {
      localInstances++;
    }
  });

  const totalInstances = libraryInstances + localInstances;

  return { libraryInstances, localInstances, totalInstances };
};

/**
 * Calculates library breakdown excluding wrappers and ignored instances
 */
const calculateLibraryBreakdown = (
  componentDetails: ComponentInstanceDetail[],
  ignoredInstances: Set<string>,
  totalInstances: number
): Array<{ name: string; count: number; percentage: number }> => {
  const filteredInstances = componentDetails.filter(
    (instance) => !ignoredInstances.has(instance.instanceId)
  );

  const libraryBreakdown = new Map<string, number>();

  filteredInstances.forEach((instance) => {
    if (!isWrapperComponent(instance.librarySource)) {
      const source = instance.librarySource;
      libraryBreakdown.set(source, (libraryBreakdown.get(source) || 0) + 1);
    }
  });

  return Array.from(libraryBreakdown.entries())
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalInstances > 0 ? (count / totalInstances) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);
};

/**
 * Calculates unfiltered metrics (no active filters)
 */
export const calculateUnfilteredMetrics = (
  data: CoverageMetrics,
  ignoredInstances: Set<string>
): FilteredMetrics => {
  const hv = data.hardcodedValues;
  const backendTokenBound = hv.totalOpportunities - hv.totalHardcoded;

  const variableCoverage =
    hv.totalOpportunities > 0 ? (backendTokenBound / hv.totalOpportunities) * 100 : 0;

  const orphanRate =
    hv.totalOpportunities > 0 ? (hv.totalHardcoded / hv.totalOpportunities) * 100 : 0;

  const orphanCount = hv.details.length;

  const { libraryInstances, totalInstances } = calculateComponentCounts(
    data.componentDetails,
    ignoredInstances
  );

  const componentCoverage = totalInstances > 0 ? (libraryInstances / totalInstances) * 100 : 0;

  const overallScore =
    variableCoverage * METRIC_WEIGHTS.TOKEN_ADOPTION +
    componentCoverage * METRIC_WEIGHTS.COMPONENT_COVERAGE;

  const libraryBreakdown = data.libraryBreakdown
    .map((lib) => ({
      name: lib.name,
      count: lib.count,
      percentage: totalInstances > 0 ? (lib.count / totalInstances) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    overallScore,
    componentCoverage,
    variableCoverage,
    orphanRate,
    orphanCount,
    totalHardcoded: hv.totalHardcoded,
    tokenBoundCount: backendTokenBound,
    totalOpportunities: hv.totalOpportunities,
    libraryInstances,
    totalInstances,
    libraryBreakdown,
  };
};

/**
 * Calculates filtered metrics (filters are active)
 */
export const calculateFilteredMetrics = (
  data: CoverageMetrics,
  ignoredComponents: Set<string>,
  ignoredInstances: Set<string>,
  ignoredOrphanInstances: Set<string>
): FilteredMetrics => {
  const hv = data.hardcodedValues;

  // Filter orphans
  let filteredTotalHardcoded = 0;
  let filteredOrphanCount = 0;

  hv.details.forEach((detail) => {
    const isComponentIgnored = ignoredComponents.has(detail.parentComponentId);
    const isOrphanIgnored = isOrphanIgnoredInComponent(
      detail.nodeId,
      detail.parentComponentId,
      ignoredOrphanInstances
    );
    const isInstanceIgnored = ignoredInstances.has(detail.parentInstanceId);

    if (!isComponentIgnored && !isOrphanIgnored && !isInstanceIgnored) {
      filteredOrphanCount++;
      filteredTotalHardcoded += detail.properties.length;
    }
  });

  // Filter token-bound properties
  let filteredTokenBoundCount = 0;
  hv.tokenBoundDetails.forEach((detail) => {
    const isComponentIgnored = ignoredComponents.has(detail.parentComponentId);
    const isInstanceIgnored = ignoredInstances.has(detail.parentInstanceId);

    if (!isComponentIgnored && !isInstanceIgnored) {
      filteredTokenBoundCount += detail.properties.length;
    }
  });

  const filteredTotalOpportunities = filteredTokenBoundCount + filteredTotalHardcoded;

  const variableCoverage =
    filteredTotalOpportunities > 0
      ? (filteredTokenBoundCount / filteredTotalOpportunities) * 100
      : 0;

  const orphanRate =
    filteredTotalOpportunities > 0
      ? (filteredTotalHardcoded / filteredTotalOpportunities) * 100
      : 0;

  const { libraryInstances, totalInstances } = calculateComponentCounts(
    data.componentDetails,
    ignoredInstances
  );

  const componentCoverage = totalInstances > 0 ? (libraryInstances / totalInstances) * 100 : 0;

  const overallScore =
    variableCoverage * METRIC_WEIGHTS.TOKEN_ADOPTION +
    componentCoverage * METRIC_WEIGHTS.COMPONENT_COVERAGE;

  const libraryBreakdown = calculateLibraryBreakdown(
    data.componentDetails,
    ignoredInstances,
    totalInstances
  );

  return {
    overallScore,
    componentCoverage,
    variableCoverage,
    orphanRate,
    orphanCount: filteredOrphanCount,
    totalHardcoded: filteredTotalHardcoded,
    tokenBoundCount: filteredTokenBoundCount,
    totalOpportunities: filteredTotalOpportunities,
    libraryInstances,
    totalInstances,
    libraryBreakdown,
  };
};

/**
 * Main function to calculate metrics based on active filters
 */
export const getFilteredMetrics = (
  data: CoverageMetrics | null,
  ignoredComponents: Set<string>,
  ignoredInstances: Set<string>,
  ignoredOrphanInstances: Set<string>
): FilteredMetrics | null => {
  if (!data || !data.hardcodedValues) return null;

  const hasActiveFilters =
    ignoredInstances.size > 0 || ignoredComponents.size > 0 || ignoredOrphanInstances.size > 0;

  if (!hasActiveFilters) {
    return calculateUnfilteredMetrics(data, ignoredInstances);
  }

  return calculateFilteredMetrics(
    data,
    ignoredComponents,
    ignoredInstances,
    ignoredOrphanInstances
  );
};
