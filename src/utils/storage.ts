// Storage utilities for Figma client storage
// All functions that interact with figma.clientStorage

// Storage keys
const ENABLED_LIBRARIES_KEY = 'enabledLibraries';
const COLLECTION_MAPPINGS_KEY = 'collectionMappings';
const IGNORED_COMPONENTS_KEY = 'ignoredComponents';
const IGNORED_ORPHANS_KEY = 'ignoredOrphans';
const IGNORED_INSTANCES_KEY = 'ignoredInstances';
const ONBOARDING_SEEN_KEY = 'onboardingSeen';

// ========================================
// Enabled Libraries
// ========================================

export async function loadEnabledLibraries(): Promise<Set<string>> {
  const stored = await figma.clientStorage.getAsync(ENABLED_LIBRARIES_KEY);
  if (stored && Array.isArray(stored)) {
    return new Set(stored);
  }
  return new Set();
}

// ========================================
// Collection Mappings (Legacy/Deprecated)
// ========================================

export async function loadCollectionMappings(): Promise<Map<string, string>> {
  const stored = await figma.clientStorage.getAsync(COLLECTION_MAPPINGS_KEY);
  if (stored) {
    return new Map(Object.entries(stored));
  }
  return new Map();
}

// ========================================
// Ignored Components
// ========================================

export async function loadIgnoredComponents(): Promise<Set<string>> {
  const stored = await figma.clientStorage.getAsync(IGNORED_COMPONENTS_KEY);
  if (stored && Array.isArray(stored)) {
    return new Set(stored);
  }
  return new Set();
}

export async function saveIgnoredComponents(
  componentIds: Set<string>
): Promise<void> {
  await figma.clientStorage.setAsync(
    IGNORED_COMPONENTS_KEY,
    Array.from(componentIds)
  );
}

// ========================================
// Ignored Orphans
// ========================================

export async function loadIgnoredOrphans(): Promise<Set<string>> {
  const stored = await figma.clientStorage.getAsync(IGNORED_ORPHANS_KEY);
  if (stored && Array.isArray(stored)) {
    return new Set(stored);
  }
  return new Set();
}

export async function saveIgnoredOrphans(nodeIds: Set<string>): Promise<void> {
  await figma.clientStorage.setAsync(
    IGNORED_ORPHANS_KEY,
    Array.from(nodeIds)
  );
}

// ========================================
// Ignored Instances
// ========================================

export async function loadIgnoredInstances(): Promise<Set<string>> {
  const stored = await figma.clientStorage.getAsync(IGNORED_INSTANCES_KEY);
  if (stored && Array.isArray(stored)) {
    return new Set(stored);
  }
  return new Set();
}

export async function saveIgnoredInstances(
  instanceIds: Set<string>
): Promise<void> {
  await figma.clientStorage.setAsync(
    IGNORED_INSTANCES_KEY,
    Array.from(instanceIds)
  );
}

// ========================================
// Onboarding Status
// ========================================

export async function loadOnboardingStatus(): Promise<boolean> {
  const stored = await figma.clientStorage.getAsync(ONBOARDING_SEEN_KEY);
  return stored === true;
}

export async function saveOnboardingStatus(seen: boolean): Promise<void> {
  await figma.clientStorage.setAsync(ONBOARDING_SEEN_KEY, seen);
}
