// Shared TypeScript interfaces for the Figma Design System Coverage Plugin

export interface LibraryBreakdown {
  name: string;
  count: number;
  percentage: number;
}

export interface OrphanDetail {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  category: 'colors' | 'typography' | 'spacing' | 'radius';
  properties: string[];
  values?: string[];
  parentComponentId: string;
  parentComponentName: string;
  parentInstanceId: string; // Added to connect orphans to component instances
}

export interface TokenBoundDetail {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  category: 'colors' | 'typography' | 'spacing' | 'radius' | 'borders';
  properties: string[];
  parentComponentId: string;
  parentComponentName: string;
  parentInstanceId: string;
}

export interface ComponentInstanceDetail {
  instanceId: string;
  instanceName: string;
  componentId: string;
  componentName: string;
  librarySource: string;
}

export interface CoverageMetrics {
  componentCoverage: number;
  variableCoverage: number;
  stats: {
    totalNodes: number;
    libraryInstances: number;
    localInstances: number;
    nodesWithVariables: number;
    nodesWithCustomStyles: number;
  };
  libraryBreakdown: LibraryBreakdown[];
  variableBreakdown: LibraryBreakdown[];
  componentDetails: ComponentInstanceDetail[];
  ignoredInstances: string[];
  hardcodedValues: {
    colors: number;
    typography: number;
    spacing: number;
    radius: number;
    totalHardcoded: number;
    totalOpportunities: number;
    details: OrphanDetail[];
    tokenBoundDetails: TokenBoundDetail[];
    ignoredComponents: string[];
    ignoredOrphans: string[];
  };
}

export interface CollectionMapping {
  collectionKey: string;
  collectionName: string;
  libraryName: string;
}

export interface DetectedCollection {
  key: string;
  name: string;
  remote: boolean;
  variableCount: number;
}

export interface TeamLibrary {
  key: string;
  name: string;
  enabled: boolean;
  hasVariables?: boolean;
  hasComponents?: boolean;
}

export interface HardcodedValues {
  colors: number;
  typography: number;
  spacing: number;
  radius: number;
  totalHardcoded: number;
  totalOpportunities: number;
  details: OrphanDetail[];
  tokenBoundDetails: TokenBoundDetail[];
  ignoredComponents: string[];
  ignoredOrphans: string[];
}

export interface ProgressMessage {
  step: string;
  percent: number;
}
