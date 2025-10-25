// Library management utilities for team library operations
import { loadEnabledLibraries } from './storage';

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
