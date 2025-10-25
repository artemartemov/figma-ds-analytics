// Orphan detection for hardcoded values that should use design tokens
import { isNodeOrAncestorHidden, isSkippedNode } from '../utils/nodeFilters';
import type { OrphanDetail } from '../types';

/**
 * Detect hardcoded values in a single node
 * Internal helper function
 */
function detectHardcodedValues(node: SceneNode): {
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

  const hardcoded = {
    colors: 0,
    typography: 0,
    spacing: 0,
    radius: 0,
  };

  // Check for hardcoded fills (colors)
  if ('fills' in node && node.fills !== figma.mixed) {
    const fills = node.fills as readonly Paint[];
    const hasFillVariable =
      node.boundVariables?.fills &&
      Array.isArray(node.boundVariables.fills) &&
      node.boundVariables.fills.length > 0;

    // Count fills that are actually visible and have content
    const visibleFills = fills.filter((fill: any) => {
      // Must be explicitly visible (or undefined which defaults to visible)
      if (fill.visible === false) return false;
      // Must have opacity > 0
      if (fill.opacity !== undefined && fill.opacity <= 0) return false;
      // For solid fills, must have a color set
      if (fill.type === 'SOLID' && !fill.color) return false;
      return true;
    });

    if (visibleFills.length > 0 && !hasFillVariable) {
      hardcoded.colors += visibleFills.length;
    }
  }

  // Check for hardcoded strokes (colors only, not stroke weight)
  if ('strokes' in node && node.strokes) {
    const strokes = node.strokes;
    if (Array.isArray(strokes)) {
      const hasStrokeVariable =
        node.boundVariables?.strokes &&
        Array.isArray(node.boundVariables.strokes) &&
        node.boundVariables.strokes.length > 0;

      // Count strokes that are actually visible and have content
      const visibleStrokes = strokes.filter((stroke: any) => {
        if (stroke.visible === false) return false;
        if (stroke.opacity !== undefined && stroke.opacity <= 0) return false;
        if (stroke.type === 'SOLID' && !stroke.color) return false;
        return true;
      });

      if (visibleStrokes.length > 0 && !hasStrokeVariable) {
        hardcoded.colors += visibleStrokes.length;
      }
    }
  }

  // Check for hardcoded corner radius
  if ('cornerRadius' in node && typeof node.cornerRadius === 'number') {
    const boundVars = node.boundVariables as any;
    const hasRadiusVariable =
      boundVars?.cornerRadius ||
      boundVars?.topLeftRadius ||
      boundVars?.topRightRadius ||
      boundVars?.bottomLeftRadius ||
      boundVars?.bottomRightRadius;

    if (node.cornerRadius > 0 && !hasRadiusVariable) {
      hardcoded.radius++;
    }
  }

  // Spacing excluded from orphan rate calculation for now
  // if ('layoutMode' in node && node.layoutMode !== 'NONE') {
  //   const boundVars = node.boundVariables as any;
  //   const hasPaddingVariable = boundVars?.paddingLeft ||
  //                               boundVars?.paddingRight ||
  //                               boundVars?.paddingTop ||
  //                               boundVars?.paddingBottom ||
  //                               boundVars?.horizontalPadding ||
  //                               boundVars?.verticalPadding;
  //   const hasNonZeroPadding = ('paddingLeft' in node && (node as any).paddingLeft > 0) ||
  //                             ('paddingRight' in node && (node as any).paddingRight > 0) ||
  //                             ('paddingTop' in node && (node as any).paddingTop > 0) ||
  //                             ('paddingBottom' in node && (node as any).paddingBottom > 0);
  //   if (hasNonZeroPadding && !hasPaddingVariable) {
  //     hardcoded.spacing++;
  //   }
  //   const hasItemSpacingVariable = boundVars?.itemSpacing;
  //   if ('itemSpacing' in node && typeof node.itemSpacing === 'number' && node.itemSpacing > 0 && !hasItemSpacingVariable) {
  //     hardcoded.spacing++;
  //   }
  // }

  // Check for hardcoded typography
  if (node.type === 'TEXT') {
    const textNode = node as TextNode;

    const hasFontSizeVariable = textNode.boundVariables?.fontSize;
    const hasLineHeightVariable = textNode.boundVariables?.lineHeight;
    const hasLetterSpacingVariable = textNode.boundVariables?.letterSpacing;
    const hasFontFamilyVariable = textNode.boundVariables?.fontFamily;
    const hasFontWeightVariable = textNode.boundVariables?.fontWeight;

    // Check if using text styles instead of variables
    const hasTextStyle = textNode.textStyleId && textNode.textStyleId !== '';

    if (!hasTextStyle) {
      if (!hasFontSizeVariable) hardcoded.typography++;
      if (!hasLineHeightVariable) hardcoded.typography++;
      if (!hasLetterSpacingVariable) hardcoded.typography++;
      if (!hasFontFamilyVariable) hardcoded.typography++;
      if (!hasFontWeightVariable) hardcoded.typography++;
    }
  }

  return hardcoded;
}

/**
 * Detect hardcoded values WITH details for troubleshooting
 * Internal helper function
 */
function detectHardcodedValuesWithDetails(
  node: SceneNode,
  parentComponentId: string = '',
  parentComponentName: string = '',
  parentInstanceId: string = ''
): OrphanDetail | null {
  // Skip hidden layers (check node and all ancestors)
  if (isNodeOrAncestorHidden(node)) {
    return null;
  }

  // Skip intentionally ignored layers (spacers, handles, iOS components)
  if (isSkippedNode(node)) {
    return null;
  }

  const properties: string[] = [];
  const values: string[] = [];
  let category: 'colors' | 'typography' | 'spacing' | 'radius' | null = null;

  // Check for hardcoded typography (most common issue)
  if (node.type === 'TEXT') {
    const textNode = node as TextNode;
    const hasTextStyle = textNode.textStyleId && textNode.textStyleId !== '';

    if (!hasTextStyle) {
      if (!textNode.boundVariables?.fontSize && textNode.fontSize !== figma.mixed) {
        properties.push('fontSize');
        values.push(`${textNode.fontSize}px`);
      }
      if (!textNode.boundVariables?.lineHeight && textNode.lineHeight !== figma.mixed) {
        const lh = textNode.lineHeight;
        properties.push('lineHeight');
        values.push(
          typeof lh === 'object' && 'value' in lh
            ? `${lh.value}${lh.unit === 'PIXELS' ? 'px' : '%'}`
            : String(lh)
        );
      }
      if (!textNode.boundVariables?.letterSpacing && textNode.letterSpacing !== figma.mixed) {
        const ls = textNode.letterSpacing;
        properties.push('letterSpacing');
        values.push(
          typeof ls === 'object' && 'value' in ls
            ? `${ls.value}${ls.unit === 'PIXELS' ? 'px' : '%'}`
            : String(ls)
        );
      }
      if (!textNode.boundVariables?.fontFamily && textNode.fontName !== figma.mixed) {
        properties.push('fontFamily');
        values.push(
          textNode.fontName
            ? typeof textNode.fontName === 'object'
              ? textNode.fontName.family
              : String(textNode.fontName)
            : 'mixed'
        );
      }
      if (!textNode.boundVariables?.fontWeight && textNode.fontName !== figma.mixed) {
        properties.push('fontWeight');
        values.push(
          textNode.fontName
            ? typeof textNode.fontName === 'object'
              ? textNode.fontName.style
              : 'mixed'
            : 'mixed'
        );
      }

      if (properties.length > 0) {
        category = 'typography';
      }
    }
  }

  // Check for hardcoded colors
  if ('fills' in node && node.fills !== figma.mixed) {
    const fills = node.fills as readonly Paint[];
    const hasFillVariable =
      node.boundVariables?.fills &&
      Array.isArray(node.boundVariables.fills) &&
      node.boundVariables.fills.length > 0;

    // Count fills that are actually visible and have content
    const visibleFills = fills.filter((fill: any) => {
      // Must be explicitly visible (or undefined which defaults to visible)
      if (fill.visible === false) return false;
      // Must have opacity > 0
      if (fill.opacity !== undefined && fill.opacity <= 0) return false;
      // For solid fills, must have a color set
      if (fill.type === 'SOLID' && !fill.color) return false;
      return true;
    });

    if (visibleFills.length > 0 && !hasFillVariable) {
      if (!category) category = 'colors';
      properties.push('fill');
      visibleFills.forEach((fill: any, i) => {
        if (fill.type === 'SOLID' && fill.color) {
          const r = Math.round(fill.color.r * 255);
          const g = Math.round(fill.color.g * 255);
          const b = Math.round(fill.color.b * 255);
          values.push(`rgb(${r}, ${g}, ${b})`);
        }
      });
    }
  }

  // Check for hardcoded radius
  if ('cornerRadius' in node && typeof node.cornerRadius === 'number' && node.cornerRadius > 0) {
    const boundVars = node.boundVariables as any;
    const hasRadiusVariable =
      boundVars?.cornerRadius ||
      boundVars?.topLeftRadius ||
      boundVars?.topRightRadius ||
      boundVars?.bottomLeftRadius ||
      boundVars?.bottomRightRadius;

    if (!hasRadiusVariable) {
      if (!category) category = 'radius';
      properties.push('cornerRadius');
      values.push(`${node.cornerRadius}px`);
    }
  }

  if (properties.length > 0 && category) {
    return {
      nodeId: node.id,
      nodeName: node.name || 'Unnamed',
      nodeType: node.type,
      category,
      properties,
      values,
      parentComponentId,
      parentComponentName,
      parentInstanceId, // Added to connect orphans to instances
    };
  }

  return null;
}

// Recursively detect hardcoded values in node tree
export function detectHardcodedValuesRecursive(
  node: SceneNode,
  depth: number = 0
): {
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

  const totals = detectHardcodedValues(node);

  // Recursively check children
  if (depth < MAX_DEPTH && 'children' in node) {
    const children = node.children as SceneNode[];
    for (const child of children) {
      // Skip hidden layers and intentionally ignored layers
      if (isNodeOrAncestorHidden(child) || isSkippedNode(child)) {
        continue;
      }
      const childHardcoded = detectHardcodedValuesRecursive(child, depth + 1);
      totals.colors += childHardcoded.colors;
      totals.typography += childHardcoded.typography;
      totals.spacing += childHardcoded.spacing;
      totals.radius += childHardcoded.radius;
    }
  }

  return totals;
}

// Recursively collect detailed orphan information
export function collectOrphanDetails(
  node: SceneNode,
  details: OrphanDetail[],
  depth: number = 0,
  parentComponentId: string = '',
  parentComponentName: string = '',
  parentInstanceId: string = ''
): void {
  const MAX_DEPTH = 50;
  const MAX_DETAILS = 100; // Limit to prevent performance issues

  if (depth >= MAX_DEPTH || details.length >= MAX_DETAILS) return;

  // Early return: skip this node and ALL its descendants if it matches skip patterns or is hidden
  if (isSkippedNode(node) || isNodeOrAncestorHidden(node)) {
    return;
  }

  // Check this node for orphans
  const orphan = detectHardcodedValuesWithDetails(
    node,
    parentComponentId,
    parentComponentName,
    parentInstanceId
  );
  if (orphan) {
    details.push(orphan);
  }

  // Check children
  if ('children' in node) {
    const children = node.children as SceneNode[];
    for (const child of children) {
      if (details.length >= MAX_DETAILS) break;
      // Skip hidden layers and intentionally ignored layers
      if (isNodeOrAncestorHidden(child) || isSkippedNode(child)) {
        continue;
      }
      collectOrphanDetails(
        child,
        details,
        depth + 1,
        parentComponentId,
        parentComponentName,
        parentInstanceId
      );
    }
  }
}
