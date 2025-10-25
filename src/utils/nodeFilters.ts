// Node filtering utilities for analysis

/**
 * Check if a node should be skipped from analysis (spacers, handles, iOS-specific components)
 */
export function isSkippedNode(node: SceneNode): boolean {
  const name = (node.name || '').toLowerCase();

  // Check for layers/components to skip (case-insensitive)
  const skipPatterns = [
    'spacer',
    '.spacer value',
    '_spacervertical',
    '_spacerhorizontal',
    '_spacer',
    'handle',
    'segmentedcontrol-ios',
    'ios home affordance',
    'home indicator',
    'route builder map',
    'wip',
  ];

  return skipPatterns.some((pattern) => name.includes(pattern.toLowerCase()));
}

/**
 * Check if node or any ancestor is hidden
 */
export function isNodeOrAncestorHidden(node: BaseNode): boolean {
  let current: BaseNode | null = node;

  while (current) {
    // Check if this node is hidden
    if ('visible' in current && current.visible === false) {
      return true;
    }

    // Move up to parent
    current = current.parent;

    // Stop at page level (pages can't be hidden)
    if (current && current.type === 'PAGE') {
      break;
    }
  }

  return false;
}
