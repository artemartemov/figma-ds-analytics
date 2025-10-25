// Variable resolution utilities for Figma variables and aliases

// Track alias resolutions for debugging
const aliasResolutions = new Map<string, string>();

/**
 * Resolve a variable ID to its source (following alias chain)
 * Internal helper function
 */
function resolveVariableId(id: string): string {
  try {
    const variable = figma.variables.getVariableById(id);
    if (!variable) return id;

    // Check if this variable is an alias by looking at its value
    // In Figma, if a variable value is an object with an 'id' property, it's an alias
    const modeId = Object.keys(variable.valuesByMode)[0];
    const value = variable.valuesByMode[modeId];

    if (value && typeof value === 'object' && 'id' in value) {
      // This is an alias - recursively resolve to find the source
      const aliasedId = (value as any).id;
      const resolvedId = resolveVariableId(aliasedId);
      // Track the resolution for debugging
      if (resolvedId !== id) {
        aliasResolutions.set(id, resolvedId);
      }
      return resolvedId;
    }

    return id;
  } catch {
    // If we can't resolve, return the original ID
    return id;
  }
}

/**
 * Collect all variable IDs from a node's bound variables
 * Internal helper function
 */
function collectVariableIds(node: any): Set<string> {
  const variableIds = new Set<string>();

  if (!node.boundVariables) return variableIds;

  const boundVariables = node.boundVariables;

  // Helper to extract IDs from variable bindings and resolve aliases
  const extractId = (binding: any) => {
    if (binding && binding.id) {
      // Resolve aliases to get the source variable ID
      const resolvedId = resolveVariableId(binding.id);
      variableIds.add(resolvedId);
    }
  };

  // Helper to extract IDs from arrays of bindings
  const extractFromArray = (arr: any[]) => {
    if (Array.isArray(arr)) {
      arr.forEach(extractId);
    }
  };

  // Check for variables in fills
  if (boundVariables.fills) {
    extractFromArray(boundVariables.fills);
  }

  // Check for variables in strokes
  if (boundVariables.strokes) {
    extractFromArray(boundVariables.strokes);
  }

  // Check for variables in component properties
  if (boundVariables.componentProperties) {
    const props = Object.values(boundVariables.componentProperties);
    props.forEach(extractId);
  }

  // Check for variables in effects
  if (boundVariables.effects) {
    extractFromArray(boundVariables.effects);
  }

  // Check for variables in layout grids
  if (boundVariables.layoutGrids) {
    extractFromArray(boundVariables.layoutGrids);
  }

  // Check other common bindable fields
  const fields = [
    'topLeftRadius',
    'topRightRadius',
    'bottomLeftRadius',
    'bottomRightRadius',
    'width',
    'height',
    'minWidth',
    'maxWidth',
    'minHeight',
    'maxHeight',
    'itemSpacing',
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'paddingBottom',
    'counterAxisSpacing',
    'horizontalPadding',
    'verticalPadding',
    'opacity',
    'cornerRadius',
    'fontSize',
    'fontFamily',
    'fontStyle',
    'fontWeight',
    'lineHeight',
    'letterSpacing',
    'paragraphSpacing',
    'paragraphIndent',
  ];

  for (const field of fields) {
    if (boundVariables[field]) {
      extractId(boundVariables[field]);
    }
  }

  // Check text range fills
  if (boundVariables.textRangeFills) {
    extractFromArray(boundVariables.textRangeFills);
  }

  return variableIds;
}

/**
 * Recursively collect all variable IDs from a node and its children
 */
export function collectVariableIdsRecursive(node: any): Set<string> {
  const allIds = new Set<string>();

  // Collect from this node
  const nodeIds = collectVariableIds(node);
  nodeIds.forEach((id) => allIds.add(id));

  // Recursively collect from children
  if ('children' in node) {
    const children = node.children as SceneNode[];
    for (const child of children) {
      const childIds = collectVariableIdsRecursive(child);
      childIds.forEach((id) => allIds.add(id));
    }
  }

  return allIds;
}

/**
 * Check if a single node has bound variables
 * Internal helper function
 */
function checkNodeForVariables(node: any): boolean {
  if (!node.boundVariables) return false;

  const boundVariables = node.boundVariables;

  // Check for variables in fills
  if (boundVariables.fills && Array.isArray(boundVariables.fills)) {
    if (boundVariables.fills.length > 0) return true;
  }

  // Check for variables in strokes
  if (boundVariables.strokes && Array.isArray(boundVariables.strokes)) {
    if (boundVariables.strokes.length > 0) return true;
  }

  // Check for variables in component properties
  if (boundVariables.componentProperties) {
    const props = Object.keys(boundVariables.componentProperties);
    if (props.length > 0) return true;
  }

  // Check for variables in effects
  if (boundVariables.effects && Array.isArray(boundVariables.effects)) {
    if (boundVariables.effects.length > 0) return true;
  }

  // Check for variables in layout grids
  if (boundVariables.layoutGrids && Array.isArray(boundVariables.layoutGrids)) {
    if (boundVariables.layoutGrids.length > 0) return true;
  }

  // Check other common bindable fields (spacing, sizing, radius, opacity, etc.)
  const fields = [
    'topLeftRadius',
    'topRightRadius',
    'bottomLeftRadius',
    'bottomRightRadius',
    'width',
    'height',
    'minWidth',
    'maxWidth',
    'minHeight',
    'maxHeight',
    'itemSpacing',
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'paddingBottom',
    'counterAxisSpacing',
    'horizontalPadding',
    'verticalPadding',
    'opacity',
    'cornerRadius',
  ];

  for (const field of fields) {
    if (boundVariables[field]) return true;
  }

  // Check text-specific variable bindings
  if (boundVariables.fontSize) return true;
  if (boundVariables.fontFamily) return true;
  if (boundVariables.fontStyle) return true;
  if (boundVariables.fontWeight) return true;
  if (boundVariables.lineHeight) return true;
  if (boundVariables.letterSpacing) return true;
  if (boundVariables.paragraphSpacing) return true;
  if (boundVariables.paragraphIndent) return true;

  // Check text range fills
  if (boundVariables.textRangeFills && Array.isArray(boundVariables.textRangeFills)) {
    if (boundVariables.textRangeFills.length > 0) return true;
  }

  return false;
}

/**
 * Recursively check a node and its children for variables
 * Internal helper function
 */
function hasVariablesRecursive(node: SceneNode): boolean {
  // Check this node
  if (checkNodeForVariables(node)) {
    return true;
  }

  // Check children if this node has them
  if ('children' in node) {
    const children = (node as any).children as SceneNode[];
    for (const child of children) {
      if (hasVariablesRecursive(child)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if an instance node has variables (checks instance and all children)
 */
export function checkInstanceForVariables(instance: InstanceNode): boolean {
  // Check the instance itself
  if (checkNodeForVariables(instance)) {
    return true;
  }

  // Recursively check all children
  if ('children' in instance) {
    const children = instance.children as SceneNode[];
    for (const child of children) {
      if (hasVariablesRecursive(child)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Clear alias resolutions tracking (call at start of analysis)
 */
export function clearAliasResolutions(): void {
  aliasResolutions.clear();
}
