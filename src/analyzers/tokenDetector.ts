// Token detection and counting for variable-bound properties
import { isNodeOrAncestorHidden, isSkippedNode } from '../utils/nodeFilters';
import type { TokenBoundDetail } from '../types';

/**
 * Count properties using variables (for proper token adoption calculation)
 * Internal helper function
 */
function countVariableBoundProperties(node: SceneNode): {
  colors: number;
  typography: number;
  spacing: number;
  radius: number;
} {
  // Skip hidden layers (check node and all ancestors)
  if (isNodeOrAncestorHidden(node)) {
    return { colors: 0, typography: 0, spacing: 0, radius: 0 };
  }

  // Skip intentionally ignored layers (spacers, handles, iOS components)
  if (isSkippedNode(node)) {
    return { colors: 0, typography: 0, spacing: 0, radius: 0 };
  }

  const variableBound = {
    colors: 0,
    typography: 0,
    spacing: 0,
    radius: 0,
  };

  // Count fills using variables
  if ('fills' in node && node.fills !== figma.mixed) {
    const fills = node.fills as readonly Paint[];
    const hasFillVariable = node.boundVariables?.fills && Array.isArray(node.boundVariables.fills) && node.boundVariables.fills.length > 0;
    const visibleFills = fills.filter((fill: any) => fill.visible !== false);
    if (visibleFills.length > 0 && hasFillVariable) {
      variableBound.colors += visibleFills.length;
    }
  }

  // Count strokes using variables (colors only, not stroke weight)
  if ('strokes' in node && node.strokes) {
    const strokes = node.strokes;
    if (Array.isArray(strokes)) {
      const hasStrokeVariable = node.boundVariables?.strokes && Array.isArray(node.boundVariables.strokes) && node.boundVariables.strokes.length > 0;
      const visibleStrokes = strokes.filter((stroke: any) => stroke.visible !== false);

      if (visibleStrokes.length > 0 && hasStrokeVariable) {
        variableBound.colors += visibleStrokes.length;
      }
    }
  }

  // Count radius using variables
  if ('cornerRadius' in node && typeof node.cornerRadius === 'number') {
    const boundVars = node.boundVariables as any;
    const hasRadiusVariable = boundVars?.cornerRadius || boundVars?.topLeftRadius ||
                               boundVars?.topRightRadius || boundVars?.bottomLeftRadius ||
                               boundVars?.bottomRightRadius;
    if (node.cornerRadius > 0 && hasRadiusVariable) {
      variableBound.radius++;
    }
  }

  // Spacing excluded from token adoption calculation for now
  // if ('layoutMode' in node && node.layoutMode !== 'NONE') {
  //   const boundVars = node.boundVariables as any;
  //   const hasPaddingVariable = boundVars?.paddingLeft || boundVars?.paddingRight ||
  //                               boundVars?.paddingTop || boundVars?.paddingBottom ||
  //                               boundVars?.horizontalPadding || boundVars?.verticalPadding;
  //   const hasNonZeroPadding = ('paddingLeft' in node && (node as any).paddingLeft > 0) ||
  //                             ('paddingRight' in node && (node as any).paddingRight > 0) ||
  //                             ('paddingTop' in node && (node as any).paddingTop > 0) ||
  //                             ('paddingBottom' in node && (node as any).paddingBottom > 0);
  //   if (hasNonZeroPadding && hasPaddingVariable) variableBound.spacing++;
  //   const hasItemSpacingVariable = boundVars?.itemSpacing;
  //   if ('itemSpacing' in node && typeof node.itemSpacing === 'number' && node.itemSpacing > 0 && hasItemSpacingVariable) {
  //     variableBound.spacing++;
  //   }
  // }

  // Count typography using variables
  if (node.type === 'TEXT') {
    const textNode = node as TextNode;
    const hasTextStyle = textNode.textStyleId && textNode.textStyleId !== '';

    if (!hasTextStyle) {
      if (textNode.boundVariables?.fontSize) variableBound.typography++;
      if (textNode.boundVariables?.lineHeight) variableBound.typography++;
      if (textNode.boundVariables?.letterSpacing) variableBound.typography++;
      if (textNode.boundVariables?.fontFamily) variableBound.typography++;
      if (textNode.boundVariables?.fontWeight) variableBound.typography++;
    }
  }

  return variableBound;
}

/**
 * Collect token-bound property details with instance tracking
 */
export function collectTokenBoundDetails(node: SceneNode, details: TokenBoundDetail[], depth: number = 0, parentComponentId: string = '', parentComponentName: string = '', parentInstanceId: string = ''): void {
  const MAX_DEPTH = 50;
  if (depth > MAX_DEPTH) return;

  // Skip hidden layers
  if (isNodeOrAncestorHidden(node)) return;

  // Skip intentionally ignored layers
  if (isSkippedNode(node)) return;

  const nodeId = node.id;
  const nodeName = node.name || 'Unnamed';
  const nodeType = node.type;

  // Collect fills using variables
  if ('fills' in node && node.fills !== figma.mixed) {
    const fills = node.fills as readonly Paint[];
    const hasFillVariable = node.boundVariables?.fills && Array.isArray(node.boundVariables.fills) && node.boundVariables.fills.length > 0;
    const visibleFills = fills.filter((fill: any) => fill.visible !== false);
    if (visibleFills.length > 0 && hasFillVariable) {
      const properties = visibleFills.map((_, idx) => `fill[${idx}]`);
      details.push({
        nodeId,
        nodeName,
        nodeType,
        category: 'colors',
        properties,
        parentComponentId,
        parentComponentName,
        parentInstanceId
      });
    }
  }

  // Collect strokes using variables
  if ('strokes' in node && node.strokes) {
    const strokes = node.strokes;
    if (Array.isArray(strokes)) {
      const hasStrokeVariable = node.boundVariables?.strokes && Array.isArray(node.boundVariables.strokes) && node.boundVariables.strokes.length > 0;
      const visibleStrokes = strokes.filter((stroke: any) => stroke.visible !== false);
      if (visibleStrokes.length > 0 && hasStrokeVariable) {
        const properties = visibleStrokes.map((_, idx) => `stroke[${idx}]`);
        details.push({
          nodeId,
          nodeName,
          nodeType,
          category: 'colors',
          properties,
          parentComponentId,
          parentComponentName,
          parentInstanceId
        });
      }
    }
  }

  // Collect radius using variables
  if ('cornerRadius' in node && typeof node.cornerRadius === 'number') {
    const boundVars = node.boundVariables as any;
    const hasRadiusVariable = boundVars?.cornerRadius || boundVars?.topLeftRadius ||
                               boundVars?.topRightRadius || boundVars?.bottomLeftRadius ||
                               boundVars?.bottomRightRadius;
    if (node.cornerRadius > 0 && hasRadiusVariable) {
      details.push({
        nodeId,
        nodeName,
        nodeType,
        category: 'radius',
        properties: ['cornerRadius'],
        parentComponentId,
        parentComponentName,
        parentInstanceId
      });
    }
  }

  // Collect typography using variables
  if (node.type === 'TEXT') {
    const textNode = node as TextNode;
    const hasTextStyle = textNode.textStyleId && textNode.textStyleId !== '';

    if (!hasTextStyle) {
      const properties: string[] = [];
      if (textNode.boundVariables?.fontSize) properties.push('fontSize');
      if (textNode.boundVariables?.lineHeight) properties.push('lineHeight');
      if (textNode.boundVariables?.letterSpacing) properties.push('letterSpacing');
      if (textNode.boundVariables?.fontFamily) properties.push('fontFamily');
      if (textNode.boundVariables?.fontWeight) properties.push('fontWeight');

      if (properties.length > 0) {
        details.push({
          nodeId,
          nodeName,
          nodeType,
          category: 'typography',
          properties,
          parentComponentId,
          parentComponentName,
          parentInstanceId
        });
      }
    }
  }

  // Recurse into children
  if ('children' in node) {
    const children = node.children as SceneNode[];
    for (const child of children) {
      collectTokenBoundDetails(child, details, depth + 1, parentComponentId, parentComponentName, parentInstanceId);
    }
  }
}

/**
 * Recursively count variable-bound properties in node tree
 */
export function countVariableBoundPropertiesRecursive(node: SceneNode, depth: number = 0): {
  colors: number;
  typography: number;
  spacing: number;
  radius: number;
} {
  const MAX_DEPTH = 50; // Prevent stack overflow on deeply nested components

  // Early return: skip this node and ALL its descendants if it matches skip patterns or is hidden
  if (isSkippedNode(node) || isNodeOrAncestorHidden(node)) {
    return { colors: 0, typography: 0, spacing: 0, radius: 0 };
  }

  const totals = countVariableBoundProperties(node);

  if (depth < MAX_DEPTH && 'children' in node) {
    const children = node.children as SceneNode[];
    for (const child of children) {
      // Skip hidden layers and intentionally ignored layers
      if (isNodeOrAncestorHidden(child) || isSkippedNode(child)) {
        continue;
      }
      const childBound = countVariableBoundPropertiesRecursive(child, depth + 1);
      totals.colors += childBound.colors;
      totals.typography += childBound.typography;
      totals.spacing += childBound.spacing;
      totals.radius += childBound.radius;
    }
  }

  return totals;
}
