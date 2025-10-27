/**
 * Helper functions for managing orphan instance tracking
 * These track orphans by composite key: orphanNodeId:componentId
 * This allows ignoring an orphan in specific components or everywhere
 */

/**
 * Generate a composite key for tracking orphan instances
 */
export const getOrphanInstanceKey = (orphanNodeId: string, componentId: string): string =>
  `${orphanNodeId}:${componentId}`;

/**
 * Check if an orphan is ignored in a specific component
 */
export const isOrphanIgnoredInComponent = (
  orphanNodeId: string,
  componentId: string,
  ignoredSet: Set<string>
): boolean => ignoredSet.has(getOrphanInstanceKey(orphanNodeId, componentId));

/**
 * Check if an orphan is ignored everywhere (in all its component instances)
 */
export const isOrphanIgnoredEverywhere = (
  orphanNodeId: string,
  componentIds: string[],
  ignoredSet: Set<string>
): boolean =>
  componentIds.every((compId) => isOrphanIgnoredInComponent(orphanNodeId, compId, ignoredSet));

/**
 * Format a number as a percentage string
 */
export const formatPercent = (value: number): string => Math.round(value) + '%';
