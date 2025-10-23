import { h, Fragment } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import {
  render,
  Container,
  Text,
  Button,
  VerticalSpace,
  Checkbox,
  Divider,
  Banner,
  IconButton,
  IconChevronDown16,
  IconChevronRight16
} from '@create-figma-plugin/ui';
import { emit, on } from '@create-figma-plugin/utilities';

// TypeScript interfaces
interface CoverageMetrics {
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
  hardcodedValues: HardcodedValues;
}

interface LibraryBreakdown {
  name: string;
  count: number;
  percentage: number;
}

interface HardcodedValues {
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

interface OrphanDetail {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  parentComponentId: string;
  parentComponentName: string;
  parentInstanceId: string;
  category: string;
  properties: string[];
}

interface TokenBoundDetail {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  parentComponentId: string;
  parentComponentName: string;
  parentInstanceId: string;
  category: string;
  properties: string[];
}

interface ComponentInstanceDetail {
  instanceId: string;
  instanceName: string;
  componentId: string;
  componentName: string;
  librarySource: string;
}

interface ProgressMessage {
  step: string;
  percent: number;
}

// Centered layout wrapper for consistent states
function CenteredLayout({ children }: { children: any }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px',
      minHeight: '400px'
    }}>
      {children}
    </div>
  );
}

// Custom Tooltip component
function Tooltip({ content, dark = false }: { content: string; dark?: boolean }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: dark ? 'rgba(255,255,255,0.2)' : '#e8e8e8',
          color: dark ? 'rgba(255,255,255,0.9)' : '#666',
          fontSize: '8px',
          fontWeight: '600',
          cursor: 'help',
          flexShrink: 0
        }}
      >
        i
      </span>
      {isVisible && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '20px',
            transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.9)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '10px',
            whiteSpace: 'pre-line',
            zIndex: 1000,
            minWidth: '200px',
            maxWidth: '280px',
            lineHeight: '1.4',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            pointerEvents: 'none'
          }}
        >
          {content}
          <div
            style={{
              position: 'absolute',
              left: '-4px',
              top: '50%',
              width: '8px',
              height: '8px',
              background: 'rgba(0,0,0,0.9)',
              transform: 'translateY(-50%) rotate(45deg)'
            }}
          />
        </div>
      )}
    </div>
  );
}

function Plugin() {
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CoverageMetrics | null>(null);
  const [hasSelection, setHasSelection] = useState(false);
  const [selectionCount, setSelectionCount] = useState(0);
  const [progress, setProgress] = useState({ step: 'Initializing...', percent: 0 });

  // Tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'tokens'>('overview');

  // Track collapsed sections (wrappers start collapsed)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  // Ignored items (used for orphans and components, but not wrappers)
  const [ignoredComponents, setIgnoredComponents] = useState<Set<string>>(new Set());
  const [ignoredOrphans, setIgnoredOrphans] = useState<Set<string>>(new Set());
  const [ignoredInstances, setIgnoredInstances] = useState<Set<string>>(new Set());

  // Listen for messages from plugin backend
  useEffect(() => {
    on('RESULTS', (results: CoverageMetrics) => {
      setData(results);
      setLoading(false);
      setError(null);

      // Load ignored items from backend
      if (results.hardcodedValues) {
        setIgnoredComponents(new Set(results.hardcodedValues.ignoredComponents || []));
        setIgnoredOrphans(new Set(results.hardcodedValues.ignoredOrphans || []));
      }
      setIgnoredInstances(new Set(results.ignoredInstances || []));

      // Auto-collapse wrapper sections (they're excluded from metrics)
      const wrapperSections = new Set<string>();
      results.componentDetails.forEach(instance => {
        if (instance.librarySource.includes('Wrapper') || instance.librarySource.includes('Local (built with DS)')) {
          wrapperSections.add(instance.librarySource);
        }
      });
      setCollapsedSections(wrapperSections);
    });

    on('ERROR', (message: string) => {
      setError(message);
      setLoading(false);
    });

    on('SELECTION_STATUS', (data: { hasSelection: boolean; count: number }) => {
      setHasSelection(data.hasSelection);
      setSelectionCount(data.count);
    });

    on('PROGRESS', (data: { step: string; percent: number }) => {
      setProgress({ step: data.step, percent: data.percent });
    });
  }, []);

  // Helper functions
  const formatPercent = (value: number) => Math.round(value) + '%';

  const getBenchmark = (score: number) => {
    if (score < 40) {
      return 'Early adoption or struggling system. Requires intervention—likely missing key components, poor documentation, or lack of organizational support.';
    } else if (score < 60) {
      return 'Healthy early growth (Industry: 40-60%). Focus on education, adding missing components, and gathering feedback.';
    } else if (score < 80) {
      return 'Strong momentum (Industry: 60-80%). Focus on remaining holdouts, migration from legacy, and optimization.';
    } else if (score < 95) {
      return 'Mature success (Industry: 80-95%). Focus on sustainability, continuous improvement, and quality metrics beyond adoption.';
    } else {
      return 'Exceptional achievement (>95%)! You\'re at industry-leading adoption levels. Note: 100% adoption is neither realistic nor desirable.';
    }
  };

  // Event handlers
  const handleAnalyze = () => {
    setLoading(true);
    setError(null);
    setProgress({ step: 'Initializing...', percent: 0 });
    emit('ANALYZE');
  };

  const handleClose = () => {
    emit('CANCEL');
  };

  const handleCancelAnalysis = () => {
    setLoading(false);
    setError(null);
    // Emit event to backend to stop the analysis
    emit('CANCEL_ANALYSIS');
    // Keep hasSelection and selectionCount - just stop the loading UI
  };

  const handleSelectNode = (nodeId: string) => {
    emit('SELECT_NODE', nodeId);
  };

  const handleToggleIgnoreComponent = (componentId: string) => {
    const newSet = new Set(ignoredComponents);
    if (newSet.has(componentId)) {
      newSet.delete(componentId);
      emit('UNIGNORE_COMPONENT', componentId);
    } else {
      newSet.add(componentId);
      emit('IGNORE_COMPONENT', componentId);
    }
    setIgnoredComponents(newSet);

    // Trigger re-render with updated ignore state
    if (data) {
      setData({ ...data });
    }
  };

  const handleToggleIgnoreOrphan = (nodeId: string) => {
    const newSet = new Set(ignoredOrphans);
    if (newSet.has(nodeId)) {
      newSet.delete(nodeId);
      emit('UNIGNORE_ORPHAN', nodeId);
    } else {
      newSet.add(nodeId);
      emit('IGNORE_ORPHAN', nodeId);
    }
    setIgnoredOrphans(newSet);

    // Trigger re-render
    if (data) {
      setData({ ...data });
    }
  };

  const handleToggleIgnoreInstance = (instanceId: string) => {
    const newSet = new Set(ignoredInstances);
    if (newSet.has(instanceId)) {
      newSet.delete(instanceId);
      emit('UNIGNORE_INSTANCE', instanceId);
    } else {
      newSet.add(instanceId);
      emit('IGNORE_INSTANCE', instanceId);
    }
    setIgnoredInstances(newSet);

    // Trigger re-render
    if (data) {
      setData({ ...data });
    }
  };

  const handleToggleCollapse = (sectionName: string) => {
    const newSet = new Set(collapsedSections);
    if (newSet.has(sectionName)) {
      newSet.delete(sectionName);
    } else {
      newSet.add(sectionName);
    }
    setCollapsedSections(newSet);
  };

  // Calculate filtered metrics based on ignored items
  const getFilteredMetrics = () => {
    if (!data || !data.hardcodedValues) return null;

    const hv = data.hardcodedValues;

    // Check if ANY filtering is active
    const hasActiveFilters =
      ignoredInstances.size > 0 ||
      ignoredComponents.size > 0 ||
      ignoredOrphans.size > 0;

    // If no filters active, use accurate backend totals (calculated from ALL instances)
    if (!hasActiveFilters) {
      const backendTokenBound = hv.totalOpportunities - hv.totalHardcoded;
      console.log('Using backend totals (no filters active):');
      console.log('  Token-bound:', backendTokenBound);
      console.log('  Hardcoded:', hv.totalHardcoded);
      console.log('  Total Opportunities:', hv.totalOpportunities);
      console.log('  Coverage:', (backendTokenBound / hv.totalOpportunities * 100).toFixed(2) + '%');

      const variableCoverage = hv.totalOpportunities > 0
        ? (backendTokenBound / hv.totalOpportunities) * 100
        : 0;

      const orphanRate = hv.totalOpportunities > 0
        ? (hv.totalHardcoded / hv.totalOpportunities) * 100
        : 0;

      // Count orphans from details for display
      const orphanCount = hv.details.length;

      // Filter component instances (still need this for component coverage)
      const filteredInstances = data.componentDetails.filter(
        instance => !ignoredInstances.has(instance.instanceId)
      );

      let filteredLibraryInstances = 0;
      let filteredTotalInstances = filteredInstances.length;

      filteredInstances.forEach(instance => {
        const isWrapper = instance.librarySource.includes('Wrapper') ||
                          instance.librarySource.includes('Local (built with DS)');

        if (isWrapper) {
          return;
        }

        const isLibrary = instance.librarySource.includes('Spandex') ||
                          instance.librarySource.includes('Atomic') ||
                          instance.librarySource.includes('Global Foundation') ||
                          instance.librarySource.includes('Design Components');

        if (isLibrary) filteredLibraryInstances++;
      });

      const filteredComponentCoverage = filteredTotalInstances > 0
        ? (filteredLibraryInstances / filteredTotalInstances) * 100
        : 0;

      const filteredOverallScore = (variableCoverage * 0.55) + (filteredComponentCoverage * 0.45);

      const filteredBreakdown = data.libraryBreakdown.map(lib => ({
        name: lib.name,
        count: lib.count,
        percentage: filteredTotalInstances > 0 ? (lib.count / filteredTotalInstances) * 100 : 0
      })).sort((a, b) => b.count - a.count);

      return {
        overallScore: filteredOverallScore,
        componentCoverage: filteredComponentCoverage,
        variableCoverage: variableCoverage,
        orphanRate: orphanRate,
        orphanCount: orphanCount,
        totalHardcoded: hv.totalHardcoded,
        tokenBoundCount: backendTokenBound,
        totalOpportunities: hv.totalOpportunities,
        libraryInstances: filteredLibraryInstances,
        totalInstances: filteredTotalInstances,
        libraryBreakdown: filteredBreakdown
      };
    }

    // Filtering IS active - calculate from details
    console.log('Using filtered details (filters active):');
    console.log('  Ignored instances:', ignoredInstances.size);
    console.log('  Ignored components:', ignoredComponents.size);
    console.log('  Ignored orphans:', ignoredOrphans.size);

    let filteredTotalHardcoded = 0;
    let filteredOrphanCount = 0;

    // Filter orphans - exclude if component ignored, orphan ignored, OR parent instance ignored
    hv.details.forEach((detail) => {
      const isComponentIgnored = ignoredComponents.has(detail.parentComponentId);
      const isOrphanIgnored = ignoredOrphans.has(detail.nodeId);
      const isInstanceIgnored = ignoredInstances.has(detail.parentInstanceId);

      // Only count if NOT ignored at any level
      if (!isComponentIgnored && !isOrphanIgnored && !isInstanceIgnored) {
        filteredOrphanCount++;
        filteredTotalHardcoded += detail.properties.length;
      }
    });

    // Filter token-bound properties - exclude if component ignored OR parent instance ignored
    let filteredTokenBoundCount = 0;
    hv.tokenBoundDetails.forEach((detail) => {
      const isComponentIgnored = ignoredComponents.has(detail.parentComponentId);
      const isInstanceIgnored = ignoredInstances.has(detail.parentInstanceId);

      // Only count if NOT ignored at any level
      if (!isComponentIgnored && !isInstanceIgnored) {
        filteredTokenBoundCount += detail.properties.length;
      }
    });

    const filteredTotalOpportunities = filteredTokenBoundCount + filteredTotalHardcoded;

    console.log('  Filtered token-bound:', filteredTokenBoundCount);
    console.log('  Filtered hardcoded:', filteredTotalHardcoded);
    console.log('  Filtered total opportunities:', filteredTotalOpportunities);
    console.log('  Filtered coverage:', (filteredTokenBoundCount / filteredTotalOpportunities * 100).toFixed(2) + '%');

    const filteredVariableCoverage = filteredTotalOpportunities > 0
      ? (filteredTokenBoundCount / filteredTotalOpportunities) * 100
      : 0;

    const filteredOrphanRate = filteredTotalOpportunities > 0
      ? (filteredTotalHardcoded / filteredTotalOpportunities) * 100
      : 0;

    // Filter component instances
    const filteredInstances = data.componentDetails.filter(
      instance => !ignoredInstances.has(instance.instanceId)
    );

    // Count library vs local in filtered set
    let filteredLibraryInstances = 0;
    let filteredLocalInstances = 0;

    filteredInstances.forEach(instance => {
      // Check if this is a wrapper (should be excluded from counts)
      const isWrapper = instance.librarySource.includes('Wrapper') ||
                        instance.librarySource.includes('Local (built with DS)');

      // Skip wrappers entirely - they're excluded from the defensible metric
      if (isWrapper) {
        return; // Don't count wrappers at all
      }

      const isLibrary = instance.librarySource.includes('Spandex') ||
                        instance.librarySource.includes('Atomic') ||
                        instance.librarySource.includes('Global Foundation') ||
                        instance.librarySource.includes('Design Components');

      if (isLibrary) {
        filteredLibraryInstances++;
      } else {
        filteredLocalInstances++;
      }
    });

    const filteredTotalInstances = filteredLibraryInstances + filteredLocalInstances;
    const filteredComponentCoverage = filteredTotalInstances > 0
      ? (filteredLibraryInstances / filteredTotalInstances) * 100
      : 0;

    // Recalculate library breakdown excluding ignored instances AND wrappers
    const filteredLibraryBreakdown = new Map<string, number>();
    filteredInstances.forEach(instance => {
      // Exclude wrappers from breakdown counts
      const isWrapper = instance.librarySource.includes('Wrapper') ||
                        instance.librarySource.includes('Local (built with DS)');
      if (!isWrapper) {
        const source = instance.librarySource;
        filteredLibraryBreakdown.set(source, (filteredLibraryBreakdown.get(source) || 0) + 1);
      }
    });

    const filteredBreakdown = Array.from(filteredLibraryBreakdown.entries()).map(([name, count]) => ({
      name,
      count,
      percentage: filteredTotalInstances > 0 ? (count / filteredTotalInstances) * 100 : 0
    })).sort((a, b) => b.count - a.count);

    // Foundation-First weighting: 55% token adoption, 45% component coverage
    // Rationale: Tokens drive 80% of consistency value (IBM, Atlassian research)
    const filteredOverallScore = (filteredVariableCoverage * 0.55) + (filteredComponentCoverage * 0.45);

    return {
      overallScore: filteredOverallScore,
      componentCoverage: filteredComponentCoverage,
      variableCoverage: filteredVariableCoverage,
      orphanRate: filteredOrphanRate,
      orphanCount: filteredOrphanCount,
      totalHardcoded: filteredTotalHardcoded,
      tokenBoundCount: filteredTokenBoundCount,
      totalOpportunities: filteredTotalOpportunities,
      libraryInstances: filteredLibraryInstances,
      totalInstances: filteredTotalInstances,
      libraryBreakdown: filteredBreakdown
    };
  };

  const filtered = getFilteredMetrics();

  // Category colors
  const categoryColors: { [key: string]: string } = {
    colors: '#e74c3c',
    typography: '#3498db',
    spacing: '#9b59b6',
    radius: '#f39c12'
  };

  // Eye icon SVG
  const eyeIconSVG = (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 3C3.5 3 1.5 5 1.5 6s2 3 4.5 3 4.5-2 4.5-3-2-3-4.5-3zm0 5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="currentColor"/>
      <circle cx="6" cy="6" r="1" fill="currentColor"/>
    </svg>
  );

  // Render component details grouped by library source
  const renderComponentDetails = () => {
    if (!data || !data.componentDetails) return null;

    // Group instances by library source
    const instancesByLibrary = new Map<string, ComponentInstanceDetail[]>();

    data.componentDetails.forEach(instance => {
      const source = instance.librarySource;
      if (!instancesByLibrary.has(source)) {
        instancesByLibrary.set(source, []);
      }
      instancesByLibrary.get(source)!.push(instance);
    });

    const colorMap: { [key: string]: string } = {
      'Spandex - Atomic Components': '#18A0FB',
      'Spandex - Design Components': '#5B9BD5', // Blue variant for Design Components
      'Spandex - Global Foundations': '#4A90E2', // Blue variant for Global Foundations
      'Local (built with DS) - Wrapper': '#95a5a6', // Gray for wrappers (excluded from count)
      'Local (built with DS)': '#95a5a6', // Gray for wrappers (excluded from count)
      'Local (standalone)': '#f39c12',
      'Other Library (not mapped)': '#9b59b6',
      'Local Components': '#f39c12'
    };

    return Array.from(instancesByLibrary.entries()).map(([librarySource, instances]) => {
      const color = colorMap[librarySource] || '#666';
      const isWrapper = librarySource.includes('Wrapper') || librarySource.includes('Local (built with DS)');
      const isCollapsed = collapsedSections.has(librarySource);

      return (
        <div key={librarySource} style={{ marginBottom: '16px' }}>
          <div
            style={{
              padding: '8px 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              borderBottom: !isCollapsed ? '1px solid #e0e0e0' : 'none'
            }}
            onClick={() => handleToggleCollapse(librarySource)}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#333', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isCollapsed ? <IconChevronRight16 /> : <IconChevronDown16 />}
                {librarySource}
                {isWrapper && <span style={{ fontSize: '9px', color: '#999', fontWeight: 400 }}>(excluded from metrics)</span>}
              </div>
              <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                {instances.length} instance{instances.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>
          {!isCollapsed && (
            <div style={{ paddingTop: '8px' }}>
              {instances.map(instance => {
                const isIgnored = ignoredInstances.has(instance.instanceId);
                const instanceOpacity = isIgnored ? 0.4 : 1;

                return (
                  <div key={instance.instanceId} style={{ paddingLeft: '20px', paddingTop: '8px', paddingBottom: '8px', fontSize: '10px', opacity: instanceOpacity, borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#333', marginBottom: '2px' }}>{instance.instanceName}</div>
                        <div style={{ color: '#666', fontSize: '9px' }}>
                          <span style={{ opacity: 0.7 }}>Component:</span> {instance.componentName}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {!isWrapper && (
                          <Checkbox
                            value={isIgnored}
                            onValueChange={() => handleToggleIgnoreInstance(instance.instanceId)}
                          >
                            <Text style={{ fontSize: '9px' }}>Ignore</Text>
                          </Checkbox>
                        )}
                      <button
                        onClick={() => handleSelectNode(instance.instanceId)}
                        title="View in canvas"
                        style={{
                          padding: '4px 6px',
                          background: '#18A0FB',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {eyeIconSVG}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>
      );
    });
  };

  // Render orphan details grouped by component
  const renderOrphanDetails = () => {
    if (!data || !data.hardcodedValues || !data.hardcodedValues.details) return null;

    // Group orphans by parent component
    const orphansByComponent = new Map<string, { name: string; id: string; orphans: OrphanDetail[] }>();

    data.hardcodedValues.details.forEach(detail => {
      const compId = detail.parentComponentId;
      if (!orphansByComponent.has(compId)) {
        orphansByComponent.set(compId, {
          name: detail.parentComponentName,
          id: compId,
          orphans: []
        });
      }
      orphansByComponent.get(compId)!.orphans.push(detail);
    });

    return Array.from(orphansByComponent.values()).map(component => {
      const isComponentIgnored = ignoredComponents.has(component.id);
      const opacityStyle = isComponentIgnored ? 0.5 : 1;
      const isCollapsed = collapsedSections.has(`orphan-${component.id}`);

      return (
        <div key={component.id} style={{ marginBottom: '16px', opacity: opacityStyle }}>
          <div
            style={{
              padding: '8px 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              borderBottom: !isCollapsed ? '1px solid #e0e0e0' : 'none'
            }}
            onClick={() => handleToggleCollapse(`orphan-${component.id}`)}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#333', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isCollapsed ? <IconChevronRight16 /> : <IconChevronDown16 />}
                {component.name} {isComponentIgnored && '(Ignored)'}
              </div>
              <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                {component.orphans.length} orphan{component.orphans.length > 1 ? 's' : ''}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Checkbox
                value={isComponentIgnored}
                onValueChange={() => handleToggleIgnoreComponent(component.id)}
              >
                <Text style={{ fontSize: '10px' }}>Ignore</Text>
              </Checkbox>
              <button
                onClick={() => handleSelectNode(component.id)}
                title="View in canvas"
                style={{
                  padding: '4px 6px',
                  background: '#18A0FB',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {eyeIconSVG}
              </button>
            </div>
          </div>
          {!isCollapsed && (
            <div style={{ paddingTop: '8px' }}>
              {component.orphans.map(detail => {
              const isOrphanIgnored = ignoredOrphans.has(detail.nodeId);
              const orphanOpacity = isOrphanIgnored ? 0.4 : 1;
              const color = categoryColors[detail.category] || '#666';

              return (
                <div key={detail.nodeId} style={{ paddingLeft: '20px', paddingTop: '8px', paddingBottom: '8px', fontSize: '10px', opacity: orphanOpacity, borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#333', marginBottom: '2px' }}>{detail.nodeName}</div>
                      <div style={{ color: '#666', fontSize: '9px', marginBottom: '2px' }}>
                        <span style={{ opacity: 0.7 }}>Type:</span> {detail.nodeType}
                      </div>
                      <div style={{ color: '#666', fontSize: '9px' }}>
                        <span style={{ opacity: 0.7 }}>Hardcoded:</span>{' '}
                        {detail.properties.map((prop, i) => (
                          <span key={i}>
                            <span style={{ color, fontWeight: 500 }}>{prop}</span>
                            {i < detail.properties.length - 1 && ', '}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Checkbox
                        value={isOrphanIgnored}
                        onValueChange={() => handleToggleIgnoreOrphan(detail.nodeId)}
                      >
                        <Text style={{ fontSize: '9px' }}>Ignore</Text>
                      </Checkbox>
                      <button
                        onClick={() => handleSelectNode(detail.nodeId)}
                        title="View in canvas"
                        style={{
                          padding: '4px 6px',
                          background: '#18A0FB',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {eyeIconSVG}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      );
    });
  };

  // Render loading state
  if (loading) {
    return (
      <CenteredLayout>
        <Text align="center">
          <strong>{progress.step}</strong>
        </Text>
        <VerticalSpace space="medium" />
        <div style={{ width: '240px', height: '4px', background: '#e0e0e0', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: progress.percent + '%', height: '100%', background: '#18A0FB', transition: 'width 0.4s ease' }} />
        </div>
        <VerticalSpace space="small" />
        <Text align="center" style={{ color: 'var(--figma-color-text-secondary, #999)' }}>
          {Math.round(progress.percent)}%
        </Text>
        <VerticalSpace space="extraLarge" />
        <div style={{ width: '180px' }}>
          <Button fullWidth secondary onClick={handleCancelAnalysis}>
            Cancel
          </Button>
        </div>
      </CenteredLayout>
    );
  }

  // Render error state
  if (error) {
    return (
      <CenteredLayout>
        <div style={{ width: '100%', maxWidth: '320px' }}>
          <Banner icon="warning" variant="warning">{error}</Banner>
        </div>
        <VerticalSpace space="large" />
        <div style={{ width: '180px' }}>
          <Button fullWidth onClick={handleAnalyze} disabled={!hasSelection}>
            Analyze Selection
          </Button>
        </div>
      </CenteredLayout>
    );
  }

  // Render empty selection state
  if (!data && !hasSelection) {
    return (
      <CenteredLayout>
        <Text align="center">
          <strong>No Selection</strong>
        </Text>
        <VerticalSpace space="small" />
        <Text align="center" style={{ color: 'var(--figma-color-text-secondary, #999)' }}>
          Select frames, components, or sections on your canvas to analyze design system coverage
        </Text>
        <VerticalSpace space="extraLarge" />
        <div style={{ width: '180px' }}>
          <Button fullWidth disabled>
            Analyze Selection
          </Button>
        </div>
      </CenteredLayout>
    );
  }

  // Render results
  if (data && filtered) {
    // Render compact stats header for orphans tab
    const renderCompactStatsHeader = () => (
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          {/* Overall Score */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#fff', lineHeight: '1' }}>
              {formatPercent(filtered.overallScore)}
            </div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.85)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Overall
            </div>
          </div>

          {/* Component Coverage */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff', lineHeight: '1' }}>
              {formatPercent(filtered.componentCoverage)}
            </div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.85)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Components
            </div>
          </div>

          {/* Design Token Adoption */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff', lineHeight: '1' }}>
              {formatPercent(filtered.variableCoverage)}
            </div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.85)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tokens
            </div>
          </div>

          {/* Orphan Rate */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: filtered.orphanRate < 20 ? '#2ecc71' : filtered.orphanRate < 40 ? '#f39c12' : '#e74c3c', lineHeight: '1' }}>
              {formatPercent(filtered.orphanRate)}
            </div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.85)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Orphan Rate
            </div>
          </div>
        </div>
      </div>
    );
    const overallFormula = `(Vars ${Math.round(filtered.variableCoverage)}% × 0.55) + (Comps ${Math.round(data.componentCoverage)}% × 0.45) = ${Math.round(filtered.overallScore)}%`;
    const benchmark = getBenchmark(filtered.overallScore);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <Container space="medium">
            <VerticalSpace space="medium" />
        {/* Metrics Cards - Compact with Info Icons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>

          {/* Overall Score Card */}
          <div style={{
            background: 'linear-gradient(135deg, #c900b5 0%, #7b64ef 50%, #008cff 100%)',
            padding: '16px 20px',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.95)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
                Overall Adoption
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.4', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Foundation-First weighted score
                <Tooltip
                  dark={true}
                  content={`Foundation-First Formula (55/45 weighting):\n\nToken Adoption: ${formatPercent(filtered.variableCoverage)} × 0.55 = ${formatPercent(filtered.variableCoverage * 0.55)}\nComponent Coverage: ${formatPercent(filtered.componentCoverage)} × 0.45 = ${formatPercent(filtered.componentCoverage * 0.45)}\n\nOverall Adoption: ${formatPercent(filtered.variableCoverage * 0.55)} + ${formatPercent(filtered.componentCoverage * 0.45)} = ${formatPercent(filtered.overallScore)}\n\nWhy 55/45? Research from IBM, Atlassian, and Pinterest shows that foundational elements (tokens/variables) drive 80% of consistency value. Tokens are harder to adopt but more impactful than components.`}
                />
              </div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#fff', lineHeight: '1', letterSpacing: '-1.5px', fontFeatureSettings: '"tnum"' }}>
              {formatPercent(filtered.overallScore)}
            </div>
          </div>

          {/* Component Coverage Card */}
          <div style={{
            background: '#f8f9fa',
            padding: '16px 20px',
            borderRadius: '12px',
            border: '1px solid #e8e8e8',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
                Component Coverage
              </div>
              <div style={{ fontSize: '9px', color: '#999', lineHeight: '1.4', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {filtered.libraryInstances} of {filtered.totalInstances} components
                <Tooltip
                  content={`DS Atomic Components: ${filtered.libraryInstances}\nStandalone Local: ${filtered.totalInstances - filtered.libraryInstances}\nTotal: ${filtered.totalInstances}\n\nFormula: DS Atomic ÷ (DS Atomic + Standalone Local)\nCalculation: ${filtered.libraryInstances} ÷ ${filtered.totalInstances} = ${formatPercent(filtered.componentCoverage)}\n\nNote: Wrapper components (local components built with DS) are excluded from this count because their nested DS components are already counted. This prevents double-counting.`}
                />
              </div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#333', lineHeight: '1', letterSpacing: '-1.5px', fontFeatureSettings: '"tnum"' }}>
              {formatPercent(filtered.componentCoverage)}
            </div>
          </div>

          {/* Design Token Adoption Card */}
          <div style={{
            background: '#f8f9fa',
            padding: '16px 20px',
            borderRadius: '12px',
            border: '1px solid #e8e8e8',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
                Design Token Adoption
              </div>
              <div style={{ fontSize: '9px', color: '#999', lineHeight: '1.4', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {filtered.tokenBoundCount} of {filtered.totalOpportunities} properties
                <Tooltip
                  content={`Token-Bound Properties: ${filtered.tokenBoundCount}\nTotal Properties: ${filtered.totalOpportunities}\nCalculation: ${filtered.tokenBoundCount} ÷ ${filtered.totalOpportunities} = ${formatPercent(filtered.variableCoverage)}`}
                />
              </div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#333', lineHeight: '1', letterSpacing: '-1.5px', fontFeatureSettings: '"tnum"' }}>
              {formatPercent(filtered.variableCoverage)}
            </div>
          </div>
        </div>

        {/* Custom Tabs - Exact match to create-figma-plugin styling */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          borderBottom: '1px solid var(--figma-color-border, #e6e6e6)',
          marginBottom: '16px',
          overflowX: 'auto'
        }}>
          {(['overview', 'components', 'tokens'] as const).map((tab, index) => {
            const isActive = activeTab === tab;
            const labels = {
              overview: 'Overview',
              components: 'Components',
              tokens: `Design Tokens`
            };

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 4px',
                  paddingLeft: index === 0 ? '8px' : '4px',
                  paddingRight: index === 3 ? '8px' : '4px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 'inherit',
                  color: 'var(--figma-color-text-secondary, #999)',
                  fontFamily: 'inherit',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onMouseOver={(e) => {
                  const span = e.currentTarget.querySelector('span');
                  if (span && !isActive) {
                    (span as HTMLElement).style.backgroundColor = 'var(--figma-color-bg-secondary, #f5f5f5)';
                  }
                }}
                onMouseOut={(e) => {
                  const span = e.currentTarget.querySelector('span');
                  if (span && !isActive) {
                    (span as HTMLElement).style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={{
                  height: '24px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: isActive ? 'var(--figma-color-bg-secondary, #f5f5f5)' : 'transparent',
                  color: isActive ? 'var(--figma-color-text, #000)' : 'inherit',
                  fontWeight: isActive ? '600' : 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'background-color 0.1s',
                  whiteSpace: 'nowrap'
                }}>
                  {labels[tab]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            <Text style={{ fontSize: '11px', color: 'var(--figma-color-text-secondary, #999)', marginBottom: '16px' }}>
              Quick summary of analysis results
            </Text>

            {/* Mini summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#f8f9fa', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e8e8e8', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)' }}>
                <div style={{ fontSize: '9px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
                  Components
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#333', letterSpacing: '-0.5px', fontFeatureSettings: '"tnum"' }}>
                  {filtered.totalInstances}
                </div>
                <div style={{ fontSize: '9px', color: '#999', marginTop: '4px' }}>
                  analyzed
                </div>
              </div>

              <div style={{ background: '#f8f9fa', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e8e8e8', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)' }}>
                <div style={{ fontSize: '9px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
                  Design Tokens
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#333', letterSpacing: '-0.5px', fontFeatureSettings: '"tnum"' }}>
                  {filtered.totalOpportunities}
                </div>
                <div style={{ fontSize: '9px', color: '#999', marginTop: '4px' }}>
                  properties
                </div>
              </div>

              <div style={{ background: '#f8f9fa', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e8e8e8', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)' }}>
                <div style={{ fontSize: '9px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
                  Libraries
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#333', letterSpacing: '-0.5px', fontFeatureSettings: '"tnum"' }}>
                  {filtered.libraryBreakdown.length}
                </div>
                <div style={{ fontSize: '9px', color: '#999', marginTop: '4px' }}>
                  sources
                </div>
              </div>

              <div style={{ background: '#f8f9fa', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e8e8e8', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)' }}>
                <div style={{ fontSize: '9px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
                  Orphans
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: filtered.orphanRate < 20 ? '#16a34a' : filtered.orphanRate < 40 ? '#f59e0b' : '#dc2626', letterSpacing: '-0.5px', fontFeatureSettings: '"tnum"' }}>
                  {filtered.orphanCount}
                </div>
                <div style={{ fontSize: '9px', color: '#999', marginTop: '4px' }}>
                  hardcoded
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div>
            <Text style={{ fontSize: '13px', fontWeight: '600', letterSpacing: '-0.2px', marginBottom: '16px' }}>Component Sources Overview</Text>

            {/* Minimal bar charts */}
            {filtered.libraryBreakdown && filtered.libraryBreakdown.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                {filtered.libraryBreakdown.map((lib, index) => {
                  // Assign colors from palette based on index
                  const colors = ['#c900b5', '#7b64ef', '#008cff', '#00a5f4', '#00b6d2', '#14c1b0'];
                  const startColor = colors[index % colors.length];
                  const endColor = colors[(index + 1) % colors.length];

                  return (
                    <div key={lib.name} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <Text style={{ fontSize: '11px', fontWeight: '500' }}>{lib.name}</Text>
                        <Text style={{ color: "#999", fontSize: '11px' }}>
                          {lib.count} ({formatPercent(lib.percentage)})
                        </Text>
                      </div>
                      <div style={{ width: '100%', height: '4px', background: '#f0f0f0', borderRadius: '20px', overflow: 'hidden' }}>
                        <div style={{
                          width: lib.percentage + '%',
                          height: '100%',
                          background: `linear-gradient(90deg, ${startColor} 0%, ${startColor}dd 50%, ${endColor}aa 100%)`,
                          borderRadius: '20px',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <Divider />
            <VerticalSpace space="medium" />

            {renderComponentDetails()}
          </div>
        )}

        {activeTab === 'tokens' && (
          <div>
            {/* Hardcoded Values Breakdown */}
            <Text style={{ fontSize: '13px', fontWeight: '600', letterSpacing: '-0.2px', marginBottom: '16px' }}>Hardcoded by Type</Text>
            {data.hardcodedValues && data.hardcodedValues.totalHardcoded > 0 ? (
              <Fragment>
                {[
                  { label: 'Colors', count: data.hardcodedValues.colors },
                  { label: 'Typography', count: data.hardcodedValues.typography },
                  { label: 'Spacing', count: data.hardcodedValues.spacing },
                  { label: 'Radius', count: data.hardcodedValues.radius }
                ].filter(item => item.count > 0).map((item, index) => {
                  const percentage = data.hardcodedValues.totalHardcoded > 0 ? (item.count / data.hardcodedValues.totalHardcoded) * 100 : 0;
                  const colors = ['#c900b5', '#7b64ef', '#008cff', '#00a5f4', '#00b6d2', '#14c1b0'];
                  const startColor = colors[index % colors.length];
                  const endColor = colors[(index + 1) % colors.length];

                  return (
                    <div key={item.label} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <Text style={{ fontSize: '11px', fontWeight: '500' }}>{item.label}</Text>
                        <Text style={{ color: "#999", fontSize: '11px' }}>
                          {item.count} ({formatPercent(percentage)})
                        </Text>
                      </div>
                      <div style={{ width: '100%', height: '4px', background: '#f0f0f0', borderRadius: '20px', overflow: 'hidden' }}>
                        <div style={{
                          width: percentage + '%',
                          height: '100%',
                          background: `linear-gradient(90deg, ${startColor} 0%, ${startColor}dd 50%, ${endColor}aa 100%)`,
                          borderRadius: '20px',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </Fragment>
            ) : (
              <Text style={{ color: "#999", fontSize: '11px', marginBottom: '16px' }}>No hardcoded values detected</Text>
            )}

            <VerticalSpace space="medium" />
            <Divider />
            <VerticalSpace space="medium" />

            {/* Token Sources with Orphan Rate Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Text style={{ fontSize: '13px', fontWeight: '600', letterSpacing: '-0.2px' }}>Token Sources</Text>
              {/* Orphan Rate Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '12px',
                background: filtered.orphanRate < 20 ? '#f0fdf4' : filtered.orphanRate < 40 ? '#fef3c7' : '#fef2f2',
                border: `1px solid ${filtered.orphanRate < 20 ? '#bbf7d0' : filtered.orphanRate < 40 ? '#fde68a' : '#fecaca'}`
              }}>
                <Text style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  color: '#999',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Orphan Rate</Text>
                <Text style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: filtered.orphanRate < 20 ? '#16a34a' : filtered.orphanRate < 40 ? '#f59e0b' : '#dc2626'
                }}>{formatPercent(filtered.orphanRate)}</Text>
              </div>
            </div>
            {data.variableBreakdown && data.variableBreakdown.length > 0 ? (
              data.variableBreakdown.map((lib, index) => {
                // Assign colors from palette based on index
                const colors = ['#c900b5', '#7b64ef', '#008cff', '#00a5f4', '#00b6d2', '#14c1b0'];
                const startColor = colors[index % colors.length];
                const endColor = colors[(index + 1) % colors.length];

                return (
                  <div key={lib.name} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <Text style={{ fontSize: '11px', fontWeight: '500' }}>{lib.name}</Text>
                      <Text style={{ color: "#999", fontSize: '11px' }}>
                        {lib.count} ({formatPercent(lib.percentage)})
                      </Text>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: '#f0f0f0', borderRadius: '20px', overflow: 'hidden' }}>
                      <div style={{
                        width: lib.percentage + '%',
                        height: '100%',
                        background: `linear-gradient(90deg, ${startColor} 0%, ${startColor}dd 50%, ${endColor}aa 100%)`,
                        borderRadius: '20px',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <Text style={{ color: "#999", fontSize: '11px' }}>No design tokens found</Text>
            )}

            <VerticalSpace space="medium" />
            <Divider />
            <VerticalSpace space="medium" />

            {/* Orphan Details */}
            <Text style={{ fontSize: '13px', fontWeight: '600', letterSpacing: '-0.2px', marginBottom: '16px' }}>Orphan Details by Component</Text>
            {data.hardcodedValues.details && data.hardcodedValues.details.length > 0 ? (
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {renderOrphanDetails()}
              </div>
            ) : (
              <div style={{
                padding: '32px',
                textAlign: 'center',
                background: '#f8f9fa',
                borderRadius: '8px',
                border: '2px dashed #e0e0e0'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎉</div>
                <Text style={{ fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                  No Orphans Found
                </Text>
                <Text style={{ fontSize: '11px', color: '#999' }}>
                  All properties are using design tokens
                </Text>
              </div>
            )}
          </div>
        )}

        {/* Remove old verbose cards - they're replaced by the grid above */}
        <div style={{ display: 'none' }}>
          {/* Component Coverage OLD */}
          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '10px',
            border: '2px solid #e0e0e0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            {/* Header with score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: '700',
                color: '#fff',
                flexShrink: 0
              }}>
                {formatPercent(data.componentCoverage)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#333', marginBottom: '2px' }}>Component Coverage</div>
                <div style={{ fontSize: '11px', color: '#999' }}>
                  How many components use the design system
                </div>
              </div>
            </div>

            {/* Calculation breakdown */}
            <div style={{
              background: '#f8f9fa',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #e8e8e8'
            }}>
              <div style={{ fontSize: '10px', fontWeight: '600', color: '#667eea', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Calculation
              </div>

              {/* Step 1: Raw numbers */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '10px', color: '#666', marginBottom: '4px' }}>Library Instances</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#333', fontFamily: 'monospace' }}>
                  {data.stats.libraryInstances}
                </div>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '10px', color: '#666', marginBottom: '4px' }}>Total Components (Library + Local)</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#333', fontFamily: 'monospace' }}>
                  {data.stats.libraryInstances + data.stats.localInstances}
                </div>
              </div>

              <div style={{ height: '1px', background: '#d0d0d0', margin: '8px 0' }} />

              {/* Step 2: Percentage */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '10px', color: '#666', marginBottom: '4px' }}>Coverage Rate</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#667eea', fontFamily: 'monospace' }}>
                  {formatPercent(data.componentCoverage)}
                </div>
              </div>

              {/* Step 3: Weighted contribution */}
              <div style={{ marginBottom: '4px' }}>
                <div style={{ fontSize: '10px', color: '#666', marginBottom: '4px' }}>Weight Applied (45% of total score - Foundation-First)</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                  {formatPercent(data.componentCoverage)} × 0.45 = <span style={{ color: '#667eea', fontWeight: '700' }}>{formatPercent(data.componentCoverage * 0.45)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Variable Coverage OLD */}
          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '10px',
            border: '2px solid #e0e0e0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            {/* Header with score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: '700',
                color: '#fff',
                flexShrink: 0
              }}>
                {formatPercent(filtered.variableCoverage)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#333', marginBottom: '2px' }}>Variable Coverage</div>
                <div style={{ fontSize: '11px', color: '#999' }}>
                  How many properties use design tokens
                </div>
              </div>
            </div>

            {/* Calculation breakdown */}
            <div style={{
              background: '#f8f9fa',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #e8e8e8'
            }}>
              <div style={{ fontSize: '10px', fontWeight: '600', color: '#f5576c', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Calculation
              </div>

              {(() => {
                return (
                  <Fragment>
                    {/* Step 1: Raw numbers */}
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '10px', color: '#666', marginBottom: '4px' }}>Token-Bound Properties</div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#333', fontFamily: 'monospace' }}>
                        {filtered.tokenBoundCount}
                      </div>
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '10px', color: '#666', marginBottom: '4px' }}>Total Properties (Token-Bound + Hardcoded)</div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#333', fontFamily: 'monospace' }}>
                        {filtered.totalOpportunities}
                      </div>
                    </div>

                    <div style={{ height: '1px', background: '#d0d0d0', margin: '8px 0' }} />

                    {/* Step 2: Percentage */}
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '10px', color: '#666', marginBottom: '4px' }}>Coverage Rate</div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#f5576c', fontFamily: 'monospace' }}>
                        {formatPercent(filtered.variableCoverage)}
                      </div>
                    </div>

                    {/* Step 3: Weighted contribution */}
                    <div style={{ marginBottom: '4px' }}>
                      <div style={{ fontSize: '10px', color: '#666', marginBottom: '4px' }}>Weight Applied (55% of total score - Foundation-First)</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                        {formatPercent(filtered.variableCoverage)} × 0.55 = <span style={{ color: '#f5576c', fontWeight: '700' }}>{formatPercent(filtered.variableCoverage * 0.55)}</span>
                      </div>
                    </div>
                  </Fragment>
                );
              })()}
            </div>
          </div>
        </div>

        <VerticalSpace space="medium" />
      </Container>
    </div>

    {/* Sticky button at bottom */}
    <div style={{
      borderTop: '1px solid var(--figma-color-border, #e6e6e6)',
      padding: '12px 16px',
      background: 'var(--figma-color-bg, #fff)'
    }}>
      <Button fullWidth onClick={handleAnalyze} disabled={!hasSelection}>
        {data ? `Re-analyze ${selectionCount} ${selectionCount === 1 ? 'item' : 'items'}` : 'Analyze Selection'}
      </Button>
    </div>
  </div>
    );
  }

  // Default render (when selection exists but not analyzed)
  return (
    <CenteredLayout>
      <Text align="center">
        <strong>{selectionCount} {selectionCount === 1 ? 'item' : 'items'} selected</strong>
      </Text>
      <VerticalSpace space="small" />
      <Text align="center" style={{ color: 'var(--figma-color-text-secondary, #999)' }}>
        Ready to analyze design system coverage
      </Text>
      <VerticalSpace space="extraLarge" />
      <div style={{ width: '180px' }}>
        <Button fullWidth onClick={handleAnalyze}>
          Analyze Selection
        </Button>
      </div>
    </CenteredLayout>
  );
}

export default render(Plugin);
