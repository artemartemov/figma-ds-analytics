// Library management utilities for team library operations
import { loadEnabledLibraries, loadCollectionMappings } from './storage';
import type { TeamLibrary, DetectedCollection } from '../types';

/**
 * Get all available team libraries with their variables and components
 */
export async function getAvailableLibraries(): Promise<TeamLibrary[]> {
  const libraries = new Map<string, TeamLibrary>();

  try {
    // Get all available variable collections from team libraries
    const variableCollections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();

    for (const collection of variableCollections) {
      // Use the collection key as the library identifier for now
      const libraryKey = collection.key;
      const libraryName = collection.name || 'Unknown Library';

      if (!libraries.has(libraryKey)) {
        libraries.set(libraryKey, {
          key: libraryKey,
          name: libraryName,
          enabled: false,
          hasVariables: false,
          hasComponents: false,
        });
      }
      const lib = libraries.get(libraryKey)!;
      lib.hasVariables = true;
    }
  } catch (error) {
    console.warn('Could not fetch library variable collections:', error);
  }

  // Detect component libraries from currently used components
  try {
    const page = figma.currentPage;
    const componentInstances = page.findAll((node) => node.type === 'INSTANCE') as InstanceNode[];

    const componentLibraries = new Set<string>();

    for (const instance of componentInstances) {
      const mainComponent = instance.mainComponent;
      if (mainComponent && mainComponent.remote) {
        const componentKey = mainComponent.key;
        // Try to get the parent library name
        const parentKey = mainComponent.parent?.name || componentKey;

        componentLibraries.add(componentKey);
      }
    }
  } catch (error) {
    console.warn('Could not detect component libraries:', error);
  }

  return Array.from(libraries.values());
}

/**
 * Check if a variable collection belongs to an enabled library
 */
export async function isFromEnabledLibrary(collectionKey: string): Promise<{ enabled: boolean; libraryName: string | null }> {
  try {
    const enabledLibraries = await loadEnabledLibraries();
    const variableCollections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();

    for (const collection of variableCollections) {
      if (collection.key === collectionKey) {
        const libraryKey = collection.key;
        const libraryName = collection.name || 'Unknown Library';

        if (enabledLibraries.has(libraryKey)) {
          return { enabled: true, libraryName };
        }
      }
    }
  } catch (error) {
    console.warn('Error checking library status:', error);
  }

  return { enabled: false, libraryName: null };
}

/**
 * Get library name from variable by checking its collection (Legacy/Deprecated)
 */
export async function getLibraryNameFromVariable(variable: Variable): Promise<string | null> {
  const mappings = await loadCollectionMappings();
  const collection = figma.variables.getVariableCollectionById(variable.variableCollectionId);

  if (!collection) return null;

  // Check if this collection is mapped
  if (collection.key && mappings.has(collection.key)) {
    return mappings.get(collection.key) || null;
  }

  return null;
}

/**
 * Detect all variable collections currently in use on the page
 * NOTE: This function depends on collectVariableIdsRecursive which must be imported/available
 */
export function detectVariableCollections(
  componentInstances: InstanceNode[],
  collectVariableIdsRecursive: (node: SceneNode) => Set<string>
): Map<string, DetectedCollection> {
  const collections = new Map<string, DetectedCollection>();
  const collectionVariableCounts = new Map<string, Set<string>>();

  for (const instance of componentInstances) {
    const variableIds = collectVariableIdsRecursive(instance);

    for (const id of variableIds) {
      const variable = figma.variables.getVariableById(id);
      if (!variable) continue;

      const collection = figma.variables.getVariableCollectionById(variable.variableCollectionId);
      if (!collection) continue;

      const key = collection.key || collection.id;

      if (!collections.has(key)) {
        collections.set(key, {
          key: key,
          name: collection.name,
          remote: collection.remote,
          variableCount: 0
        });
        collectionVariableCounts.set(key, new Set());
      }

      // Track unique variables per collection
      collectionVariableCounts.get(key)?.add(id);
    }
  }

  // Update variable counts
  for (const [key, variableSet] of collectionVariableCounts.entries()) {
    const collection = collections.get(key);
    if (collection) {
      collection.variableCount = variableSet.size;
    }
  }

  return collections;
}
