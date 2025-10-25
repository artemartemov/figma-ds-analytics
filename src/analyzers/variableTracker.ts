// Variable usage tracking and breakdown for library-based analysis
import { collectVariableIdsRecursive } from '../utils/variableResolver';
import { isFromEnabledLibrary } from '../utils/libraryManager';
import type { LibraryBreakdown } from '../types';

export interface VariableTrackingResult {
  variableSourceCounts: Map<string, number>;
  allVariableIds: Set<string>;
  unmappedVariableIds: Set<string>;
  unmappedCollections: Set<string>;
  variableBreakdown: LibraryBreakdown[];
}

/**
 * Track variable usage across component instances and create library-based breakdown
 */
export async function trackVariableUsage(
  componentInstances: InstanceNode[]
): Promise<VariableTrackingResult> {
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

  return {
    variableSourceCounts,
    allVariableIds,
    unmappedVariableIds,
    unmappedCollections,
    variableBreakdown,
  };
}
