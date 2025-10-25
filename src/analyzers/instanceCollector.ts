// Instance collection and categorization for component analysis
import { isNodeOrAncestorHidden } from '../utils/nodeFilters';
import type { ComponentInstanceDetail } from '../types';

export interface InstanceCollectionResult {
  componentInstances: InstanceNode[];
  hiddenInstancesSkipped: number;
}

export interface CategorizationResult {
  libraryInstances: number;
  localInstances: number;
  librarySourceCounts: Map<string, number>;
  componentInstanceDetails: ComponentInstanceDetail[];
  wrapperInstanceIds: Set<string>;
  localWithDSCount: number;
  localStandaloneCount: number;
}

/**
 * Helper: Check if a component instance contains DS components internally
 */
function containsDSComponents(
  instance: InstanceNode,
  getLibraryNameFromKey: (key: string) => string | null
): boolean {
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
}

/**
 * Collect all component instances from selection, filtering out hidden ones
 */
export function collectComponentInstances(
  selection: readonly SceneNode[]
): InstanceCollectionResult {
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

  return {
    componentInstances,
    hiddenInstancesSkipped,
  };
}

/**
 * Categorize component instances into library, local, and wrapper types
 */
export function categorizeInstances(
  componentInstances: InstanceNode[],
  getLibraryNameFromKey: (key: string) => string | null
): CategorizationResult {
  let libraryInstances = 0;
  let localInstances = 0;

  // Track components by library source
  const librarySourceCounts = new Map<string, number>();

  // Process all instances
  let localWithDSCount = 0;
  let localStandaloneCount = 0;
  const componentInstanceDetails: ComponentInstanceDetail[] = [];

  // Step 1: Identify wrapper instances (local components containing DS components)
  // We'll build a map of wrapper instance IDs that should be excluded from counts
  const wrapperInstanceIds = new Set<string>();

  for (const instance of componentInstances) {
    const mainComponent = instance.mainComponent;
    const isRemote = mainComponent?.remote === true;

    if (!isRemote) {
      // Check if this local component contains DS components
      const usesDS = containsDSComponents(instance, getLibraryNameFromKey);
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
        localWithDSCount++;
      } else {
        libraryName = 'Local (standalone)';
        localStandaloneCount++;
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
  }

  return {
    libraryInstances,
    localInstances,
    librarySourceCounts,
    componentInstanceDetails,
    wrapperInstanceIds,
    localWithDSCount,
    localStandaloneCount,
  };
}
