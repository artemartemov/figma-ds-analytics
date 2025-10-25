// Variable usage tracking and breakdown for library-based analysis
import { collectVariableIdsRecursive } from '../utils/variableResolver';
import { VARIABLE_ID_TO_LIBRARY } from '../data/variableMappings';
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

      // Look up variable in static mapping
      const libraryName = VARIABLE_ID_TO_LIBRARY[id];

      if (libraryName) {
        // Variable mapped to a known library
        const currentCount = variableSourceCounts.get(libraryName) || 0;
        variableSourceCounts.set(libraryName, currentCount + 1);
      } else {
        // Variable not in mapping - try to get collection info for debugging
        unmappedVariableIds.add(id);
        const variable = figma.variables.getVariableById(id);
        if (variable) {
          const collection = figma.variables.getVariableCollectionById(
            variable.variableCollectionId
          );
          if (collection && collection.remote) {
            unmappedCollections.add(`${collection.name} (not in mapping)`);
          }
        }
        // Track unmapped variables as "Other Library (not mapped)"
        const currentCount = variableSourceCounts.get('Other Library (not mapped)') || 0;
        variableSourceCounts.set('Other Library (not mapped)', currentCount + 1);
      }
    }
  }

  // Create variable breakdown with percentages
  const totalVariableUsages = Array.from(variableSourceCounts.values()).reduce(
    (sum, count) => sum + count,
    0
  );
  const variableBreakdown: LibraryBreakdown[] = Array.from(variableSourceCounts.entries())
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
