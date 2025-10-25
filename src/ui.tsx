import { h, Fragment } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import {
  render,
  Container,
  VerticalSpace,
  Banner,
  IconChevronDown16,
  IconChevronRight16,
} from '@create-figma-plugin/ui';
import { emit, on } from '@create-figma-plugin/utilities';
import { Checkbox, SegmentedControl } from './components/common';
import { Modal, OnboardingModal, HelpModal } from './components/modals';
import { StatCard } from './components/cards';
import { OverviewTab, ComponentsTab, TokensTab } from './components/tabs';
import { themeStyles } from './styles/theme';
import type { CoverageMetrics, OrphanDetail, ComponentInstanceDetail } from './types';
// Custom Checkbox Component
function Plugin() {
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CoverageMetrics | null>(null);
  const [hasSelection, setHasSelection] = useState(false);
  const [selectionCount, setSelectionCount] = useState(0);
  const [progress, setProgress] = useState({
    step: 'Initializing...',
    percent: 0,
  });

  // Modal state
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: string;
  } | null>(null);

  // Onboarding modal state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'tokens'>('overview');

  // Track collapsed sections (wrappers start collapsed)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  // Ignored items (used for orphans and components, but not wrappers)
  const [ignoredComponents, setIgnoredComponents] = useState<Set<string>>(new Set());
  // Track orphan instances by composite key: orphanNodeId:componentId
  // This allows ignoring an orphan in specific components or everywhere
  const [ignoredOrphanInstances, setIgnoredOrphanInstances] = useState<Set<string>>(new Set());
  const [ignoredInstances, setIgnoredInstances] = useState<Set<string>>(new Set());
  const [ignoredLibraries, setIgnoredLibraries] = useState<Set<string>>(new Set());

  // Helper functions for orphan instance tracking
  const getOrphanInstanceKey = (orphanNodeId: string, componentId: string) =>
    `${orphanNodeId}:${componentId}`;

  const isOrphanIgnoredInComponent = (orphanNodeId: string, componentId: string) =>
    ignoredOrphanInstances.has(getOrphanInstanceKey(orphanNodeId, componentId));

  const isOrphanIgnoredEverywhere = (orphanNodeId: string, componentIds: string[]) =>
    componentIds.every((compId) => isOrphanIgnoredInComponent(orphanNodeId, compId));

  // Listen for messages from plugin backend
  useEffect(() => {
    // Expose reset function for testing (accessible from console)
    const resetFn = () => {
      emit('RESET_ONBOARDING');
    };
    (window as any).resetOnboarding = resetFn;
    (globalThis as any).resetOnboarding = resetFn;

    on('RESULTS', (results: CoverageMetrics) => {
      setData(results);
      setLoading(false);
      setError(null);

      // Load ignored items from backend
      if (results.hardcodedValues) {
        setIgnoredComponents(new Set(results.hardcodedValues.ignoredComponents || []));
        // Convert old ignoredOrphans format to new composite key format
        // Old format: Set<orphanNodeId>
        // New format: Set<orphanNodeId:componentId>
        const orphanInstances = new Set<string>();
        if (results.hardcodedValues.ignoredOrphans) {
          results.hardcodedValues.ignoredOrphans.forEach((orphanId) => {
            // For backwards compatibility, if we have orphan IDs without component context,
            // we need to mark them as ignored in all components
            results.hardcodedValues.details?.forEach((detail) => {
              if (detail.nodeId === orphanId) {
                orphanInstances.add(getOrphanInstanceKey(orphanId, detail.parentComponentId));
              }
            });
          });
        }
        setIgnoredOrphanInstances(orphanInstances);
      }
      setIgnoredInstances(new Set(results.ignoredInstances || []));

      // Auto-collapse wrapper sections (they're excluded from metrics)
      const wrapperSections = new Set<string>();
      results.componentDetails.forEach((instance) => {
        if (
          instance.librarySource.includes('Wrapper') ||
          instance.librarySource.includes('Local (built with DS)')
        ) {
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
      // When we receive progress, we know analysis has started AND there's a selection
      setLoading((currentLoading) => {
        if (!currentLoading) {
          setHasSelection(true);
          return true;
        }
        return currentLoading;
      });
    });
    on('ONBOARDING_STATUS', (hasSeenOnboarding: boolean) => {
      const shouldShow = !hasSeenOnboarding;
      setShowOnboarding(shouldShow);
    });
  }, []); // Empty dependency array - handlers should only be registered once on mount

  // Helper functions
  const formatPercent = (value: number) => Math.round(value) + '%';

  // Event handlers
  const handleAnalyze = () => {
    setLoading(true);
    setError(null);
    setProgress({ step: 'Initializing...', percent: 0 });
    emit('ANALYZE');
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

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    emit('SET_ONBOARDING_SEEN');
    // Trigger analysis after closing onboarding if user has selection
    if (hasSelection) {
      emit('ANALYZE');
    }
  };

  // Toggle ignore for an orphan in ALL components
  const handleToggleIgnoreOrphanEverywhere = (orphanNodeId: string, componentIds: string[]) => {
    const newSet = new Set(ignoredOrphanInstances);
    const isCurrentlyIgnoredEverywhere = isOrphanIgnoredEverywhere(orphanNodeId, componentIds);

    if (isCurrentlyIgnoredEverywhere) {
      // Unignore in all components
      componentIds.forEach((compId) => {
        const key = getOrphanInstanceKey(orphanNodeId, compId);
        newSet.delete(key);
      });
      emit('UNIGNORE_ORPHAN', orphanNodeId);
    } else {
      // Ignore in all components
      componentIds.forEach((compId) => {
        const key = getOrphanInstanceKey(orphanNodeId, compId);
        newSet.add(key);
      });
      emit('IGNORE_ORPHAN', orphanNodeId);
    }
    setIgnoredOrphanInstances(newSet);

    // Trigger re-render
    if (data) {
      setData({ ...data });
    }
  };

  // Toggle ignore for an orphan in a SPECIFIC component
  const handleToggleIgnoreOrphanInComponent = (orphanNodeId: string, componentId: string) => {
    const newSet = new Set(ignoredOrphanInstances);
    const key = getOrphanInstanceKey(orphanNodeId, componentId);

    if (newSet.has(key)) {
      newSet.delete(key);
      emit('UNIGNORE_ORPHAN', orphanNodeId);
    } else {
      newSet.add(key);
      emit('IGNORE_ORPHAN', orphanNodeId);
    }
    setIgnoredOrphanInstances(newSet);

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

  const handleToggleIgnoreLibrary = (librarySource: string, instanceIds: string[]) => {
    const newIgnoredLibraries = new Set(ignoredLibraries);
    const newIgnoredInstances = new Set(ignoredInstances);

    if (newIgnoredLibraries.has(librarySource)) {
      // Unignore the library and all its instances
      newIgnoredLibraries.delete(librarySource);
      instanceIds.forEach((id) => {
        if (newIgnoredInstances.has(id)) {
          newIgnoredInstances.delete(id);
          emit('UNIGNORE_INSTANCE', id);
        }
      });
    } else {
      // Ignore the library and all its instances
      newIgnoredLibraries.add(librarySource);
      instanceIds.forEach((id) => {
        if (!newIgnoredInstances.has(id)) {
          newIgnoredInstances.add(id);
          emit('IGNORE_INSTANCE', id);
        }
      });
    }

    setIgnoredLibraries(newIgnoredLibraries);
    setIgnoredInstances(newIgnoredInstances);

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
      ignoredInstances.size > 0 || ignoredComponents.size > 0 || ignoredOrphanInstances.size > 0;

    // If no filters active, use accurate backend totals (calculated from ALL instances)
    if (!hasActiveFilters) {
      const backendTokenBound = hv.totalOpportunities - hv.totalHardcoded;
      const variableCoverage =
        hv.totalOpportunities > 0 ? (backendTokenBound / hv.totalOpportunities) * 100 : 0;

      const orphanRate =
        hv.totalOpportunities > 0 ? (hv.totalHardcoded / hv.totalOpportunities) * 100 : 0;

      // Count orphans from details for display
      const orphanCount = hv.details.length;

      // Filter component instances (still need this for component coverage)
      const filteredInstances = data.componentDetails.filter(
        (instance) => !ignoredInstances.has(instance.instanceId)
      );

      let filteredLibraryInstances = 0;
      let filteredTotalInstances = filteredInstances.length;

      filteredInstances.forEach((instance) => {
        const isWrapper =
          instance.librarySource.includes('Wrapper') ||
          instance.librarySource.includes('Local (built with DS)');

        if (isWrapper) {
          return;
        }

        const isLibrary =
          instance.librarySource.includes('Spandex') ||
          instance.librarySource.includes('Atomic') ||
          instance.librarySource.includes('Global Foundation') ||
          instance.librarySource.includes('Design Components');

        if (isLibrary) filteredLibraryInstances++;
      });

      const filteredComponentCoverage =
        filteredTotalInstances > 0 ? (filteredLibraryInstances / filteredTotalInstances) * 100 : 0;

      const filteredOverallScore = variableCoverage * 0.55 + filteredComponentCoverage * 0.45;

      const filteredBreakdown = data.libraryBreakdown
        .map((lib) => ({
          name: lib.name,
          count: lib.count,
          percentage: filteredTotalInstances > 0 ? (lib.count / filteredTotalInstances) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count);

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
        libraryBreakdown: filteredBreakdown,
      };
    }

    // Filtering IS active - calculate from details
    let filteredTotalHardcoded = 0;
    let filteredOrphanCount = 0;

    // Filter orphans - exclude if component ignored, orphan ignored, OR parent instance ignored
    hv.details.forEach((detail) => {
      const isComponentIgnored = ignoredComponents.has(detail.parentComponentId);
      const isOrphanIgnored = isOrphanIgnoredInComponent(detail.nodeId, detail.parentComponentId);
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

    const filteredVariableCoverage =
      filteredTotalOpportunities > 0
        ? (filteredTokenBoundCount / filteredTotalOpportunities) * 100
        : 0;

    const filteredOrphanRate =
      filteredTotalOpportunities > 0
        ? (filteredTotalHardcoded / filteredTotalOpportunities) * 100
        : 0;

    // Filter component instances
    const filteredInstances = data.componentDetails.filter(
      (instance) => !ignoredInstances.has(instance.instanceId)
    );

    // Count library vs local in filtered set
    let filteredLibraryInstances = 0;
    let filteredLocalInstances = 0;

    filteredInstances.forEach((instance) => {
      // Check if this is a wrapper (should be excluded from counts)
      const isWrapper =
        instance.librarySource.includes('Wrapper') ||
        instance.librarySource.includes('Local (built with DS)');

      // Skip wrappers entirely - they're excluded from the defensible metric
      if (isWrapper) {
        return; // Don't count wrappers at all
      }

      const isLibrary =
        instance.librarySource.includes('Spandex') ||
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
    const filteredComponentCoverage =
      filteredTotalInstances > 0 ? (filteredLibraryInstances / filteredTotalInstances) * 100 : 0;

    // Recalculate library breakdown excluding ignored instances AND wrappers
    const filteredLibraryBreakdown = new Map<string, number>();
    filteredInstances.forEach((instance) => {
      // Exclude wrappers from breakdown counts
      const isWrapper =
        instance.librarySource.includes('Wrapper') ||
        instance.librarySource.includes('Local (built with DS)');
      if (!isWrapper) {
        const source = instance.librarySource;
        filteredLibraryBreakdown.set(source, (filteredLibraryBreakdown.get(source) || 0) + 1);
      }
    });

    const filteredBreakdown = Array.from(filteredLibraryBreakdown.entries())
      .map(([name, count]) => ({
        name,
        count,
        percentage: filteredTotalInstances > 0 ? (count / filteredTotalInstances) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Foundation-First weighting: 55% token adoption, 45% component coverage
    // Rationale: Tokens drive 80% of consistency value (IBM, Atlassian research)
    const filteredOverallScore = filteredVariableCoverage * 0.55 + filteredComponentCoverage * 0.45;

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
      libraryBreakdown: filteredBreakdown,
    };
  };

  const filtered = getFilteredMetrics();

  // Category colors
  const categoryColors: { [key: string]: string } = {
    colors: '#e74c3c',
    typography: '#3498db',
    spacing: '#9b59b6',
    radius: '#f39c12',
  };

  // Eye icon SVG (16x12 with better stroke weight)
  const eyeIconSVG = (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.9812 3C6.32435 3 4.9812 4.34315 4.9812 6C4.9812 7.65685 6.32435 9 7.9812 9C9.63806 9 10.9812 7.65685 10.9812 6C10.9812 4.34315 9.63806 3 7.9812 3ZM6.2312 6C6.2312 5.0335 7.0147 4.25 7.9812 4.25C8.9477 4.25 9.7312 5.0335 9.7312 6C9.7312 6.9665 8.9477 7.75 7.9812 7.75C7.0147 7.75 6.2312 6.9665 6.2312 6Z"
        fill="currentColor"
      />
      <path
        d="M7.98114 0C5.56104 0 3.66123 1.29127 2.35726 2.59591C1.04966 3.90417 0.274346 5.29061 0.0913944 5.63519C-0.0304648 5.86471 -0.0304648 6.13529 0.0913944 6.36481C0.274346 6.70939 1.04966 8.09583 2.35726 9.40409C3.66123 10.7087 5.56104 12 7.98114 12C10.4012 12 12.301 10.7087 13.605 9.40409C14.9126 8.09583 15.6879 6.7094 15.8709 6.36481C15.9927 6.13529 15.9927 5.86471 15.8709 5.63519C15.6879 5.2906 14.9126 3.90417 13.605 2.59591C12.301 1.29127 10.4012 0 7.98114 0ZM3.24137 8.52043C2.2544 7.53296 1.59872 6.4891 1.31811 6C1.59872 5.5109 2.2544 4.46704 3.24137 3.47957C4.4285 2.29183 6.02843 1.25 7.98114 1.25C9.93384 1.25 11.5338 2.29183 12.7209 3.47956C13.7079 4.46703 14.3635 5.5109 14.6442 6C14.3635 6.48909 13.7079 7.53297 12.7209 8.52044C11.5338 9.70817 9.93384 10.75 7.98114 10.75C6.02843 10.75 4.4285 9.70817 3.24137 8.52043Z"
        fill="currentColor"
      />
    </svg>
  );

  // Render component details grouped by library source
  const renderComponentDetails = () => {
    if (!data || !data.componentDetails) return null;

    // Group instances by library source
    const instancesByLibrary = new Map<string, ComponentInstanceDetail[]>();

    data.componentDetails.forEach((instance) => {
      const source = instance.librarySource;
      if (!instancesByLibrary.has(source)) {
        instancesByLibrary.set(source, []);
      }
      instancesByLibrary.get(source)!.push(instance);
    });

    return Array.from(instancesByLibrary.entries()).map(([librarySource, instances]) => {
      const isWrapper =
        librarySource.includes('Wrapper') || librarySource.includes('Local (built with DS)');
      const isCollapsed = collapsedSections.has(librarySource);

      const instanceIds = instances.map((i) => i.instanceId);
      // Check if library is ignored OR if all instances are manually ignored
      const allInstancesIgnored =
        !isWrapper && instanceIds.length > 0 && instanceIds.every((id) => ignoredInstances.has(id));
      const isLibraryIgnored = ignoredLibraries.has(librarySource) || allInstancesIgnored;

      return (
        <div key={librarySource} style={{ marginBottom: '16px' }}>
          <div
            style={{
              padding: '8px 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              borderBottom: !isCollapsed ? '1px solid var(--figma-color-border)' : 'none',
            }}
          >
            <div
              style={{
                flex: 1,
                cursor: 'pointer',
                opacity: isLibraryIgnored ? 0.5 : 1,
                minWidth: 0,
              }}
              onClick={() => handleToggleCollapse(librarySource)}
            >
              <div
                style={{
                  fontWeight: 600,
                  color: 'var(--figma-color-text)',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textTransform: 'uppercase',
                  textDecoration: isLibraryIgnored ? 'line-through' : 'none',
                }}
              >
                {isCollapsed ? <IconChevronRight16 /> : <IconChevronDown16 />}
                {librarySource}
                {isWrapper && (
                  <span
                    style={{
                      fontSize: '9px',
                      color: 'var(--figma-color-text-tertiary)',
                      fontWeight: 400,
                      textTransform: 'lowercase',
                    }}
                  >
                    (excluded from metrics)
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: 'var(--figma-color-text-secondary)',
                  marginTop: '2px',
                }}
              >
                {instances.length} instance{instances.length > 1 ? 's' : ''}
              </div>
            </div>
            {!isWrapper && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexShrink: 0,
                }}
              >
                <Checkbox
                  checked={isLibraryIgnored}
                  onChange={() => handleToggleIgnoreLibrary(librarySource, instanceIds)}
                />
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: '500',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleIgnoreLibrary(librarySource, instanceIds);
                  }}
                >
                  Ignore All
                </span>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div style={{ paddingTop: '8px' }}>
              {instances.map((instance) => {
                const isIgnored = ignoredInstances.has(instance.instanceId);
                const instanceOpacity = isIgnored ? 0.4 : 1;

                return (
                  <div
                    key={instance.instanceId}
                    style={{
                      paddingLeft: '0px',
                      paddingTop: '8px',
                      paddingBottom: '8px',
                      fontSize: '10px',
                      borderBottom: '1px solid var(--figma-color-border)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                      }}
                    >
                      {!isWrapper && (
                        <Checkbox
                          checked={isIgnored}
                          onChange={() => handleToggleIgnoreInstance(instance.instanceId)}
                        />
                      )}
                      <div style={{ flex: 1, opacity: instanceOpacity }}>
                        <div
                          style={{
                            fontWeight: 600,
                            color: 'var(--figma-color-text)',
                            marginBottom: '2px',
                            textDecoration: isIgnored ? 'line-through' : 'none',
                          }}
                        >
                          {instance.instanceName}
                        </div>
                        <div
                          style={{
                            color: 'var(--figma-color-text-secondary)',
                            fontSize: '9px',
                          }}
                        >
                          <span
                            style={{
                              color: 'var(--figma-color-text-tertiary)',
                            }}
                          >
                            Component:
                          </span>{' '}
                          {instance.componentName}
                        </div>
                      </div>
                      <button
                        onClick={() => handleSelectNode(instance.instanceId)}
                        title="View in canvas"
                        style={{
                          width: '20px',
                          height: '20px',
                          padding: '0',
                          background: 'transparent',
                          color: 'var(--text-secondary)',
                          border: 'none',
                          borderRadius: '2px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--figma-color-bg-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        {eyeIconSVG}
                      </button>
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

  // Render orphan details grouped by unique orphan nodes
  const renderOrphanDetails = () => {
    if (!data || !data.hardcodedValues || !data.hardcodedValues.details) return null;

    // Group by unique orphan nodeId, tracking which components contain each orphan
    const orphanGroups = new Map<
      string,
      {
        orphan: OrphanDetail;
        components: Array<{ id: string; name: string }>;
      }
    >();

    data.hardcodedValues.details.forEach((detail) => {
      if (!orphanGroups.has(detail.nodeId)) {
        orphanGroups.set(detail.nodeId, {
          orphan: detail,
          components: [],
        });
      }
      const group = orphanGroups.get(detail.nodeId)!;
      // Only add component if not already in the list
      if (!group.components.some((c) => c.id === detail.parentComponentId)) {
        group.components.push({
          id: detail.parentComponentId,
          name: detail.parentComponentName,
        });
      }
    });

    return Array.from(orphanGroups.values()).map((group) => {
      const componentIds = group.components.map((c) => c.id);
      const isIgnoredEverywhere = isOrphanIgnoredEverywhere(group.orphan.nodeId, componentIds);
      const orphanOpacity = isIgnoredEverywhere ? 0.4 : 1;
      const isCollapsed = collapsedSections.has(`orphan-${group.orphan.nodeId}`);
      const color = categoryColors[group.orphan.category] || '#666';

      return (
        <div key={group.orphan.nodeId} style={{ marginBottom: '16px' }}>
          {/* Orphan header with "Ignore All" checkbox */}
          <div
            style={{
              padding: '8px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderBottom: !isCollapsed ? '1px solid var(--figma-color-border)' : 'none',
            }}
          >
            <div
              style={{
                flex: 1,
                cursor: 'pointer',
                opacity: orphanOpacity,
                minWidth: 0,
              }}
              onClick={() => handleToggleCollapse(`orphan-${group.orphan.nodeId}`)}
            >
              <div
                style={{
                  fontWeight: 600,
                  color: 'var(--figma-color-text)',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textTransform: 'uppercase',
                  textDecoration: isIgnoredEverywhere ? 'line-through' : 'none',
                  overflow: 'hidden',
                }}
              >
                {isCollapsed ? <IconChevronRight16 /> : <IconChevronDown16 />}
                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {group.orphan.nodeName}
                </span>
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: 'var(--figma-color-text-secondary)',
                  marginTop: '2px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  style={{
                    textTransform: 'uppercase',
                    fontSize: '9px',
                    color: 'var(--figma-color-text-tertiary)',
                  }}
                >
                  TYPE:
                </span>{' '}
                <span style={{ textTransform: 'capitalize' }}>
                  {group.orphan.nodeType.toLowerCase()}
                </span>
                {' • '}
                <span
                  style={{
                    textTransform: 'uppercase',
                    fontSize: '9px',
                    color: 'var(--figma-color-text-tertiary)',
                  }}
                >
                  HARDCODED:
                </span>{' '}
                {group.orphan.properties.map((prop, i) => (
                  <span key={i}>
                    <span style={{ color, fontWeight: 500 }}>{prop}</span>
                    {i < group.orphan.properties.length - 1 && ', '}
                  </span>
                ))}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexShrink: 0,
              }}
            >
              <Checkbox
                checked={isIgnoredEverywhere}
                onChange={() =>
                  handleToggleIgnoreOrphanEverywhere(group.orphan.nodeId, componentIds)
                }
              />
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: '500',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleIgnoreOrphanEverywhere(group.orphan.nodeId, componentIds);
                }}
              >
                Ignore All
              </span>
            </div>
          </div>

          {/* Expanded: Show each component as a selectable child */}
          {!isCollapsed && (
            <div style={{ paddingTop: '8px' }}>
              {group.components.map((comp) => {
                const isIgnoredInThisComponent = isOrphanIgnoredInComponent(
                  group.orphan.nodeId,
                  comp.id
                );
                const componentOpacity = isIgnoredInThisComponent ? 0.4 : 1;

                return (
                  <div
                    key={comp.id}
                    style={{
                      paddingLeft: '0px',
                      paddingTop: '8px',
                      paddingBottom: '8px',
                      fontSize: '10px',
                      borderBottom: '1px solid var(--figma-color-border)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                      }}
                    >
                      <Checkbox
                        checked={isIgnoredInThisComponent}
                        onChange={() =>
                          handleToggleIgnoreOrphanInComponent(group.orphan.nodeId, comp.id)
                        }
                      />
                      <div style={{ flex: 1, opacity: componentOpacity }}>
                        <div
                          style={{
                            fontWeight: 600,
                            color: 'var(--figma-color-text)',
                            marginBottom: '2px',
                            textDecoration: isIgnoredInThisComponent ? 'line-through' : 'none',
                          }}
                        >
                          {comp.name}
                        </div>
                        <div
                          style={{
                            fontSize: '9px',
                            color: 'var(--figma-color-text-secondary)',
                          }}
                        >
                          <span
                            style={{
                              color: 'var(--figma-color-text-tertiary)',
                            }}
                          >
                            Component variant
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSelectNode(group.orphan.nodeId)}
                        title="View in canvas"
                        style={{
                          width: '20px',
                          height: '20px',
                          padding: '0',
                          background: 'transparent',
                          color: 'var(--text-secondary)',
                          border: 'none',
                          borderRadius: '2px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--figma-color-bg-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        {eyeIconSVG}
                      </button>
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
  if (loading && hasSelection) {
    return (
      <Fragment>
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          {/* Header with help button */}
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '12px',
              zIndex: 1000,
            }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setModalContent({
                  title: 'HELP',
                  content: `WHAT THIS PLUGIN DOES

This plugin measures how well your designs adopt your design system by tracking two key metrics: Component Coverage (are you using library components?) and Token Adoption (are those components using design tokens/variables?).

HOW METRICS ARE CALCULATED

COMPONENT COVERAGE
Library Instances ÷ Total Instances × 100
Measures what percentage of component instances come from your design system libraries.

TOKEN ADOPTION (PROPERTY-LEVEL)
Variable-bound Properties ÷ Total Properties × 100
Counts individual properties (fills, strokes, typography, radius, borders) that use design tokens. A button with 5 properties and only 1 token-bound property = 20% token adoption, not 100%.

OVERALL SCORE (FOUNDATION-FIRST)
(Token Adoption × 0.55) + (Component Coverage × 0.45)
Tokens are weighted higher (55%) because they drive 80% of design consistency. Based on research from IBM Carbon, Atlassian, and Pinterest design systems.

ORPHAN RATE
Hardcoded Properties ÷ Total Properties × 100
Tracks hardcoded values (colors, typography, radius, borders) that should be using tokens. Industry target: <20% orphans.

WHAT THIS PLUGIN IS NOT

This plugin only analyzes what you select—it cannot scan entire pages or files automatically. It measures adoption of existing components and tokens, but cannot detect which components are missing from your design system.

The plugin does not analyze spacing (padding, gaps) due to high false positive rates. It also cannot track usage over time—you'll need to export results and track them manually.

Finally, it cannot auto-fix orphaned values or enforce design system rules. It's a measurement tool, not an enforcement tool.

GETTING STARTED

1. Select the frames, components, or sections you want to analyze
2. Click "Analyze Selection" to see your metrics
3. Use the tabs to explore components and design tokens in detail
4. Mark intentional exceptions as "Ignored" to refine your metrics`,
                });
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--figma-color-text)';
                setShowHelpTooltip(true);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#9D9D9D';
                setTimeout(() => {
                  setShowHelpTooltip(false);
                }, 100);
              }}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#9D9D9D',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: '300',
                cursor: 'pointer',
                padding: '4px',
                transition: 'color 0.2s',
                position: 'relative',
              }}
            >
              ?
              {showHelpTooltip && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '20px',
                    transform: 'translateY(-50%)',
                    background: 'var(--figma-color-bg-inverse)',
                    color: 'var(--figma-color-text-onbrand)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 10000,
                  }}
                >
                  Help
                </div>
              )}
            </button>
          </div>

          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '16px',
                }}
              >
                {progress.step}
              </div>
            </div>
            <div
              style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: '2px',
                  background: 'var(--track-bg-card)',
                  borderRadius: '0',
                }}
              >
                <div
                  style={{
                    width: progress.percent + '%',
                    height: '100%',
                    background: 'var(--progress-fill)',
                    borderRadius: '0',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  right: '0',
                  fontSize: '12px',
                  color: 'var(--text-tertiary)',
                  textAlign: 'right',
                  minWidth: '40px',
                  paddingLeft: '12px',
                  background: 'var(--figma-color-bg)',
                }}
              >
                {Math.round(progress.percent)}%
              </div>
            </div>
          </div>

          {/* Fixed button at bottom */}
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px 0 0 0',
              background: 'var(--figma-color-bg)',
              zIndex: 100,
            }}
          >
            <button
              onClick={handleCancelAnalysis}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--figma-color-bg-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
              style={{
                width: '100%',
                height: '52px',
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '0',
                fontSize: '11px',
                fontWeight: '300',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '8px',
                paddingLeft: '20px',
                transition: 'background 0.2s, border-color 0.2s',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
              CANCEL
            </button>
          </div>
        </div>

        {/* Onboarding Modal */}
        <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />

        {/* Help Modal */}
        <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
      </Fragment>
    );
  }

  // Render error state
  if (error) {
    return (
      <Fragment>
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          {/* Header with help button */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 1000,
            }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setModalContent({
                  title: 'HELP',
                  content: `WHAT THIS PLUGIN DOES

This plugin measures how well your designs adopt your design system by tracking two key metrics: Component Coverage (are you using library components?) and Token Adoption (are those components using design tokens/variables?).

HOW METRICS ARE CALCULATED

COMPONENT COVERAGE
Library Instances ÷ Total Instances × 100
Measures what percentage of component instances come from your design system libraries.

TOKEN ADOPTION (PROPERTY-LEVEL)
Variable-bound Properties ÷ Total Properties × 100
Counts individual properties (fills, strokes, typography, radius, borders) that use design tokens. A button with 5 properties and only 1 token-bound property = 20% token adoption, not 100%.

OVERALL SCORE (FOUNDATION-FIRST)
(Token Adoption × 0.55) + (Component Coverage × 0.45)
Tokens are weighted higher (55%) because they drive 80% of design consistency. Based on research from IBM Carbon, Atlassian, and Pinterest design systems.

ORPHAN RATE
Hardcoded Properties ÷ Total Properties × 100
Tracks hardcoded values (colors, typography, radius, borders) that should be using tokens. Industry target: <20% orphans.

WHAT THIS PLUGIN IS NOT

This plugin only analyzes what you select—it cannot scan entire pages or files automatically. It measures adoption of existing components and tokens, but cannot detect which components are missing from your design system.

The plugin does not analyze spacing (padding, gaps) due to high false positive rates. It also cannot track usage over time—you'll need to export results and track them manually.

Finally, it cannot auto-fix orphaned values or enforce design system rules. It's a measurement tool, not an enforcement tool.

GETTING STARTED

1. Select the frames, components, or sections you want to analyze
2. Click "Analyze Selection" to see your metrics
3. Use the tabs to explore components and design tokens in detail
4. Mark intentional exceptions as "Ignored" to refine your metrics`,
                });
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--figma-color-text)';
                setShowHelpTooltip(true);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#9D9D9D';
                setTimeout(() => {
                  setShowHelpTooltip(false);
                }, 100);
              }}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#9D9D9D',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: '300',
                cursor: 'pointer',
                padding: '4px',
                transition: 'color 0.2s',
                position: 'relative',
              }}
            >
              ?
              {showHelpTooltip && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '20px',
                    transform: 'translateY(-50%)',
                    background: 'var(--figma-color-bg-inverse)',
                    color: 'var(--figma-color-text-onbrand)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 10000,
                  }}
                >
                  Help
                </div>
              )}
            </button>
          </div>

          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div style={{ width: '100%', maxWidth: '320px' }}>
              <Banner icon="warning" variant="warning">
                {error}
              </Banner>
            </div>
          </div>

          {/* Fixed button at bottom */}
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '0',
              background: 'var(--figma-color-bg)',
              zIndex: 100,
            }}
          >
            <button
              onClick={handleAnalyze}
              disabled={!hasSelection}
              onMouseEnter={(e) => {
                if (hasSelection) {
                  e.currentTarget.style.opacity = '0.85';
                }
              }}
              onMouseLeave={(e) => {
                if (hasSelection) {
                  e.currentTarget.style.opacity = '1';
                }
              }}
              style={{
                width: '100%',
                height: '52px',
                background: hasSelection ? 'var(--button-bg)' : 'var(--button-disabled-bg)',
                color: hasSelection ? 'var(--button-text)' : 'var(--button-disabled-text)',
                border: 'none',
                borderRadius: '0',
                fontSize: '11px',
                fontWeight: '300',
                letterSpacing: '0.1em',
                cursor: hasSelection ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '8px',
                paddingLeft: '20px',
                transition: 'opacity 0.2s',
                opacity: 1,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="M18 17V9M13 17V5M8 17v-3" />
              </svg>
              ANALYZE SELECTION
            </button>
          </div>
        </div>

        {/* Onboarding Modal */}
        <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />

        {/* Help Modal */}
        <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
      </Fragment>
    );
  }

  // Render empty selection state
  if (!data && !hasSelection) {
    return (
      <Fragment>
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          {/* Header with help button */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 1000,
            }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setModalContent({
                  title: 'HELP',
                  content: `WHAT THIS PLUGIN DOES

This plugin measures how well your designs adopt your design system by tracking two key metrics: Component Coverage (are you using library components?) and Token Adoption (are those components using design tokens/variables?).

HOW METRICS ARE CALCULATED

COMPONENT COVERAGE
Library Instances ÷ Total Instances × 100
Measures what percentage of component instances come from your design system libraries.

TOKEN ADOPTION (PROPERTY-LEVEL)
Variable-bound Properties ÷ Total Properties × 100
Counts individual properties (fills, strokes, typography, radius, borders) that use design tokens. A button with 5 properties and only 1 token-bound property = 20% token adoption, not 100%.

OVERALL SCORE (FOUNDATION-FIRST)
(Token Adoption × 0.55) + (Component Coverage × 0.45)
Tokens are weighted higher (55%) because they drive 80% of design consistency. Based on research from IBM Carbon, Atlassian, and Pinterest design systems.

ORPHAN RATE
Hardcoded Properties ÷ Total Properties × 100
Tracks hardcoded values (colors, typography, radius, borders) that should be using tokens. Industry target: <20% orphans.

WHAT THIS PLUGIN IS NOT

This plugin only analyzes what you select—it cannot scan entire pages or files automatically. It measures adoption of existing components and tokens, but cannot detect which components are missing from your design system.

The plugin does not analyze spacing (padding, gaps) due to high false positive rates. It also cannot track usage over time—you'll need to export results and track them manually.

Finally, it cannot auto-fix orphaned values or enforce design system rules. It's a measurement tool, not an enforcement tool.

GETTING STARTED

1. Select the frames, components, or sections you want to analyze
2. Click "Analyze Selection" to see your metrics
3. Use the tabs to explore components and design tokens in detail
4. Mark intentional exceptions as "Ignored" to refine your metrics`,
                });
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--figma-color-text)';
                setShowHelpTooltip(true);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#9D9D9D';
                setTimeout(() => {
                  setShowHelpTooltip(false);
                }, 100);
              }}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#9D9D9D',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: '300',
                cursor: 'pointer',
                padding: '4px',
                transition: 'color 0.2s',
                position: 'relative',
              }}
            >
              ?
              {showHelpTooltip && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '20px',
                    transform: 'translateY(-50%)',
                    background: 'var(--figma-color-bg-inverse)',
                    color: 'var(--figma-color-text-onbrand)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 10000,
                  }}
                >
                  Help
                </div>
              )}
            </button>
          </div>

          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div style={{ textAlign: 'left', maxWidth: '320px' }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                }}
              >
                NO SELECTION
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-tertiary)',
                  lineHeight: '1.5',
                }}
              >
                Select frames, components, or sections on your canvas to analyze design system
                coverage
              </div>
            </div>
          </div>

          {/* Fixed button at bottom */}
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '0',
              background: 'var(--figma-color-bg)',
              zIndex: 100,
            }}
          >
            <button
              disabled
              style={{
                width: '100%',
                height: '52px',
                background: 'var(--button-disabled-bg)',
                color: 'var(--button-disabled-text)',
                border: 'none',
                borderRadius: '0',
                fontSize: '11px',
                fontWeight: '300',
                letterSpacing: '0.1em',
                cursor: 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '8px',
                paddingLeft: '20px',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="M18 17V9M13 17V5M8 17v-3" />
              </svg>
              ANALYZE SELECTION
            </button>
          </div>
        </div>

        {/* Onboarding Modal */}
        <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />
      </Fragment>
    );
  }

  // Render results
  if (data && filtered) {
    return (
      <Fragment>
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          {/* Header with help button */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 1000,
            }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setModalContent({
                  title: 'HELP',
                  content: `WHAT THIS PLUGIN DOES

This plugin measures how well your designs adopt your design system by tracking two key metrics: Component Coverage (are you using library components?) and Token Adoption (are those components using design tokens/variables?).

HOW METRICS ARE CALCULATED

COMPONENT COVERAGE
Library Instances ÷ Total Instances × 100
Measures what percentage of component instances come from your design system libraries.

TOKEN ADOPTION (PROPERTY-LEVEL)
Variable-bound Properties ÷ Total Properties × 100
Counts individual properties (fills, strokes, typography, radius, borders) that use design tokens. A button with 5 properties and only 1 token-bound property = 20% token adoption, not 100%.

OVERALL SCORE (FOUNDATION-FIRST)
(Token Adoption × 0.55) + (Component Coverage × 0.45)
Tokens are weighted higher (55%) because they drive 80% of design consistency. Based on research from IBM Carbon, Atlassian, and Pinterest design systems.

ORPHAN RATE
Hardcoded Properties ÷ Total Properties × 100
Tracks hardcoded values (colors, typography, radius, borders) that should be using tokens. Industry target: <20% orphans.

WHAT THIS PLUGIN IS NOT

This plugin only analyzes what you select—it cannot scan entire pages or files automatically. It measures adoption of existing components and tokens, but cannot detect which components are missing from your design system.

The plugin does not analyze spacing (padding, gaps) due to high false positive rates. It also cannot track usage over time—you'll need to export results and track them manually.

Finally, it cannot auto-fix orphaned values or enforce design system rules. It's a measurement tool, not an enforcement tool.

GETTING STARTED

1. Select the frames, components, or sections you want to analyze
2. Click "Analyze Selection" to see your metrics
3. Use the tabs to explore components and design tokens in detail
4. Mark intentional exceptions as "Ignored" to refine your metrics`,
                });
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--figma-color-text)';
                setShowHelpTooltip(true);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#9D9D9D';
                setTimeout(() => {
                  setShowHelpTooltip(false);
                }, 100);
              }}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#9D9D9D',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: '300',
                cursor: 'pointer',
                padding: '4px',
                transition: 'color 0.2s',
                position: 'relative',
              }}
            >
              ?
              {showHelpTooltip && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '20px',
                    transform: 'translateY(-50%)',
                    background: 'var(--figma-color-bg-inverse)',
                    color: 'var(--figma-color-text-onbrand)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 10000,
                  }}
                >
                  Help
                </div>
              )}
            </button>
          </div>

          {/* Scrollable content */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              paddingBottom: '76px',
            }}
          >
            <Container space="medium">
              <VerticalSpace space="medium" />
              {/* Metrics Cards - Ultra Minimal */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0',
                  marginBottom: '32px',
                }}
              >
                {/* Overall Score Card */}
                <StatCard
                  title="Overall Adoption"
                  tooltipContent={`Foundation-First Formula (55/45 weighting):\n\nToken Adoption: ${formatPercent(
                    filtered.variableCoverage
                  )} × 0.55 = ${formatPercent(
                    filtered.variableCoverage * 0.55
                  )}\nComponent Coverage: ${formatPercent(
                    filtered.componentCoverage
                  )} × 0.45 = ${formatPercent(
                    filtered.componentCoverage * 0.45
                  )}\n\nOverall Adoption: ${formatPercent(
                    filtered.variableCoverage * 0.55
                  )} + ${formatPercent(filtered.componentCoverage * 0.45)} = ${formatPercent(
                    filtered.overallScore
                  )}\n\nWhy 55/45? Research from IBM, Atlassian, and Pinterest shows that foundational elements (tokens/variables) drive 80% of consistency value. Tokens are harder to adopt but more impactful than components.`}
                  tokensLabel="Tokens"
                  tokensValue={filtered.variableCoverage}
                  componentsLabel="Components"
                  componentsValue={filtered.componentCoverage}
                  donutValue={filtered.overallScore}
                  onDonutClick={() =>
                    setModalContent({
                      title: 'Overall Adoption Score',
                      content: `FOUNDATION FIRST FORMULA
(55/45 weighting)

TOKEN ADOPTION
${formatPercent(filtered.variableCoverage)} × 0.55 = ${formatPercent(
                        filtered.variableCoverage * 0.55
                      )}

COMPONENT COVERAGE
${formatPercent(filtered.componentCoverage)} × 0.45 = ${formatPercent(
                        filtered.componentCoverage * 0.45
                      )}

OVERALL ADOPTION
${formatPercent(filtered.variableCoverage * 0.55)} + ${formatPercent(
                        filtered.componentCoverage * 0.45
                      )} = ${formatPercent(filtered.overallScore)}

WHY 55/45
Research from IBM, Atlassian, and Pinterest shows that foundational elements (tokens/variables) drive 80% of consistency value. Tokens are harder to adopt but more impactful than components.`,
                    })
                  }
                />

                {/* Component Coverage Card */}
                <div style={{ marginTop: '32px' }}>
                  <StatCard
                    title="Component Coverage"
                    tooltipContent={`Formula: Library Components ÷ Total Components\n\nLibrary Components: ${
                      filtered.libraryInstances
                    }\nLocal Components: ${
                      filtered.totalInstances - filtered.libraryInstances
                    }\nTotal: ${filtered.totalInstances}\n\nCalculation: ${
                      filtered.libraryInstances
                    } ÷ ${filtered.totalInstances} = ${formatPercent(
                      filtered.componentCoverage
                    )}\n\nNote: Wrapper components (local components built with DS) are excluded from this count because their nested DS components are already counted. This prevents double-counting.`}
                    tokensLabel="DS Components"
                    tokensValue={
                      filtered.totalInstances > 0
                        ? (filtered.libraryInstances / filtered.totalInstances) * 100
                        : 0
                    }
                    componentsLabel="Local Components"
                    componentsValue={
                      filtered.totalInstances > 0
                        ? ((filtered.totalInstances - filtered.libraryInstances) /
                            filtered.totalInstances) *
                          100
                        : 0
                    }
                    donutValue={filtered.componentCoverage}
                    onDonutClick={() =>
                      setModalContent({
                        title: 'Component Coverage',
                        content: `FORMULA
Library Components ÷ Total Components

LIBRARY COMPONENTS
${filtered.libraryInstances}

LOCAL COMPONENTS
${filtered.totalInstances - filtered.libraryInstances}

TOTAL
${filtered.totalInstances}

CALCULATION
${filtered.libraryInstances} ÷ ${filtered.totalInstances} = ${formatPercent(
                          filtered.componentCoverage
                        )}

NOTE
Wrapper components (local components built with DS) are excluded from this count because their nested DS components are already counted. This prevents double-counting.`,
                      })
                    }
                  />
                </div>

                {/* Design Token Adoption Card */}
                <div style={{ marginTop: '32px' }}>
                  <StatCard
                    title="Design Token Adoption"
                    tooltipContent={`Formula: Token-Bound Properties ÷ Total Properties\n\nToken-Bound Properties: ${
                      filtered.tokenBoundCount
                    }\nHardcoded Properties: ${
                      filtered.totalOpportunities - filtered.tokenBoundCount
                    }\nTotal Properties: ${
                      filtered.totalOpportunities
                    }\n\nCalculation: ${filtered.tokenBoundCount} ÷ ${
                      filtered.totalOpportunities
                    } = ${formatPercent(
                      filtered.variableCoverage
                    )}\n\nNote: This measures token adoption at the property level, not component level. Each component has multiple properties (fills, strokes, typography, radius, borders) and we count how many individual properties use design tokens.`}
                    tokensLabel="Token-Bound"
                    tokensValue={filtered.variableCoverage}
                    componentsLabel="Hardcoded"
                    componentsValue={100 - filtered.variableCoverage}
                    donutValue={filtered.variableCoverage}
                    onDonutClick={() =>
                      setModalContent({
                        title: 'Design Token Adoption',
                        content: `FORMULA
Token-Bound Properties ÷ Total Properties

TOKEN BOUND PROPERTIES
${filtered.tokenBoundCount}

HARDCODED PROPERTIES
${filtered.totalOpportunities - filtered.tokenBoundCount}

TOTAL PROPERTIES
${filtered.totalOpportunities}

CALCULATION
${filtered.tokenBoundCount} ÷ ${filtered.totalOpportunities} = ${formatPercent(
                          filtered.variableCoverage
                        )}

NOTE
This measures token adoption at the property level, not component level. Each component has multiple properties (fills, strokes, typography, radius, borders) and we count how many individual properties use design tokens.`,
                      })
                    }
                  />
                </div>
              </div>

              {/* Figma-style Tabs */}
              <SegmentedControl
                options={[
                  { value: 'overview', label: 'OVERVIEW' },
                  { value: 'components', label: 'COMPONENTS' },
                  { value: 'tokens', label: 'DESIGN TOKENS' },
                ]}
                activeValue={activeTab}
                onChange={(value) => setActiveTab(value)}
              />

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <OverviewTab
                  componentsCount={filtered.totalInstances}
                  designTokensCount={filtered.totalOpportunities}
                  librariesCount={filtered.libraryBreakdown.length}
                  orphansCount={filtered.orphanCount}
                />
              )}

              {activeTab === 'components' && (
                <ComponentsTab
                  libraryBreakdown={filtered.libraryBreakdown}
                  renderComponentDetails={renderComponentDetails}
                />
              )}

              {activeTab === 'tokens' && (
                <TokensTab
                  hardcodedValues={data.hardcodedValues}
                  hasOrphanDetails={
                    data.hardcodedValues.details && data.hardcodedValues.details.length > 0
                  }
                  renderOrphanDetails={renderOrphanDetails}
                />
              )}
              {/* Remove old verbose cards - they're replaced by the grid above */}
              <div style={{ display: 'none' }}>
                {/* Component Coverage OLD */}
                <div
                  style={{
                    background: '#fff',
                    padding: '20px',
                    borderRadius: '10px',
                    border: '2px solid var(--figma-color-border)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Header with score */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
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
                        flexShrink: 0,
                      }}
                    >
                      {formatPercent(data.componentCoverage)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          color: 'var(--figma-color-text)',
                          marginBottom: '2px',
                        }}
                      >
                        Component Coverage
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--figma-color-text-tertiary)',
                        }}
                      >
                        How many components use the design system
                      </div>
                    </div>
                  </div>

                  {/* Calculation breakdown */}
                  <div
                    style={{
                      background: 'var(--figma-color-bg-secondary)',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--figma-color-border)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '10px',
                        fontWeight: '600',
                        color: '#667eea',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Calculation
                    </div>

                    {/* Step 1: Raw numbers */}
                    <div style={{ marginBottom: '8px' }}>
                      <div
                        style={{
                          fontSize: '10px',
                          color: 'var(--figma-color-text-secondary)',
                          marginBottom: '4px',
                        }}
                      >
                        Library Instances
                      </div>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: 'var(--figma-color-text)',
                          fontFamily: 'monospace',
                        }}
                      >
                        {data.stats.libraryInstances}
                      </div>
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                      <div
                        style={{
                          fontSize: '10px',
                          color: 'var(--figma-color-text-secondary)',
                          marginBottom: '4px',
                        }}
                      >
                        Total Components (Library + Local)
                      </div>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: 'var(--figma-color-text)',
                          fontFamily: 'monospace',
                        }}
                      >
                        {data.stats.libraryInstances + data.stats.localInstances}
                      </div>
                    </div>

                    <div
                      style={{
                        height: '1px',
                        background: '#d0d0d0',
                        margin: '8px 0',
                      }}
                    />

                    {/* Step 2: Percentage */}
                    <div style={{ marginBottom: '8px' }}>
                      <div
                        style={{
                          fontSize: '10px',
                          color: 'var(--figma-color-text-secondary)',
                          marginBottom: '4px',
                        }}
                      >
                        Coverage Rate
                      </div>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#667eea',
                          fontFamily: 'monospace',
                        }}
                      >
                        {formatPercent(data.componentCoverage)}
                      </div>
                    </div>

                    {/* Step 3: Weighted contribution */}
                    <div style={{ marginBottom: '4px' }}>
                      <div
                        style={{
                          fontSize: '10px',
                          color: 'var(--figma-color-text-secondary)',
                          marginBottom: '4px',
                        }}
                      >
                        Weight Applied (45% of total score - Foundation-First)
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'var(--figma-color-text)',
                        }}
                      >
                        {formatPercent(data.componentCoverage)} × 0.45 ={' '}
                        <span style={{ color: '#667eea', fontWeight: '700' }}>
                          {formatPercent(data.componentCoverage * 0.45)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Variable Coverage OLD */}
                <div
                  style={{
                    background: '#fff',
                    padding: '20px',
                    borderRadius: '10px',
                    border: '2px solid var(--figma-color-border)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Header with score */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
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
                        flexShrink: 0,
                      }}
                    >
                      {formatPercent(filtered.variableCoverage)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          color: 'var(--figma-color-text)',
                          marginBottom: '2px',
                        }}
                      >
                        Variable Coverage
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--figma-color-text-tertiary)',
                        }}
                      >
                        How many properties use design tokens
                      </div>
                    </div>
                  </div>

                  {/* Calculation breakdown */}
                  <div
                    style={{
                      background: 'var(--figma-color-bg-secondary)',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--figma-color-border)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '10px',
                        fontWeight: '600',
                        color: '#f5576c',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Calculation
                    </div>

                    {(() => {
                      return (
                        <Fragment>
                          {/* Step 1: Raw numbers */}
                          <div style={{ marginBottom: '8px' }}>
                            <div
                              style={{
                                fontSize: '10px',
                                color: 'var(--figma-color-text-secondary)',
                                marginBottom: '4px',
                              }}
                            >
                              Token-Bound Properties
                            </div>
                            <div
                              style={{
                                fontSize: '18px',
                                fontWeight: '700',
                                color: 'var(--figma-color-text)',
                                fontFamily: 'monospace',
                              }}
                            >
                              {filtered.tokenBoundCount}
                            </div>
                          </div>

                          <div style={{ marginBottom: '8px' }}>
                            <div
                              style={{
                                fontSize: '10px',
                                color: 'var(--figma-color-text-secondary)',
                                marginBottom: '4px',
                              }}
                            >
                              Total Properties (Token-Bound + Hardcoded)
                            </div>
                            <div
                              style={{
                                fontSize: '18px',
                                fontWeight: '700',
                                color: 'var(--figma-color-text)',
                                fontFamily: 'monospace',
                              }}
                            >
                              {filtered.totalOpportunities}
                            </div>
                          </div>

                          <div
                            style={{
                              height: '1px',
                              background: '#d0d0d0',
                              margin: '8px 0',
                            }}
                          />

                          {/* Step 2: Percentage */}
                          <div style={{ marginBottom: '8px' }}>
                            <div
                              style={{
                                fontSize: '10px',
                                color: 'var(--figma-color-text-secondary)',
                                marginBottom: '4px',
                              }}
                            >
                              Coverage Rate
                            </div>
                            <div
                              style={{
                                fontSize: '18px',
                                fontWeight: '700',
                                color: '#f5576c',
                                fontFamily: 'monospace',
                              }}
                            >
                              {formatPercent(filtered.variableCoverage)}
                            </div>
                          </div>

                          {/* Step 3: Weighted contribution */}
                          <div style={{ marginBottom: '4px' }}>
                            <div
                              style={{
                                fontSize: '10px',
                                color: 'var(--figma-color-text-secondary)',
                                marginBottom: '4px',
                              }}
                            >
                              Weight Applied (55% of total score - Foundation-First)
                            </div>
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: 'var(--figma-color-text)',
                              }}
                            >
                              {formatPercent(filtered.variableCoverage)} × 0.55 ={' '}
                              <span style={{ color: '#f5576c', fontWeight: '700' }}>
                                {formatPercent(filtered.variableCoverage * 0.55)}
                              </span>
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

          {/* Sticky button at bottom - fixed to bottom of viewport */}
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '0',
              background: 'var(--figma-color-bg)',
              zIndex: 100,
            }}
          >
            <button
              onClick={handleAnalyze}
              disabled={!hasSelection}
              onMouseEnter={(e) => {
                if (hasSelection) {
                  e.currentTarget.style.opacity = '0.85';
                }
              }}
              onMouseLeave={(e) => {
                if (hasSelection) {
                  e.currentTarget.style.opacity = '1';
                }
              }}
              style={{
                width: '100%',
                height: '52px',
                background: hasSelection ? 'var(--button-bg)' : 'var(--button-disabled-bg)',
                color: hasSelection ? 'var(--button-text)' : 'var(--button-disabled-text)',
                border: 'none',
                borderRadius: '0',
                fontSize: '11px',
                fontWeight: '300',
                letterSpacing: '0.1em',
                cursor: hasSelection ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '8px',
                paddingLeft: '20px',
                transition: 'opacity 0.2s',
                opacity: 1,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
              {data
                ? `RE-ANALYZE ${selectionCount} ${selectionCount === 1 ? 'ITEM' : 'ITEMS'}`
                : 'ANALYZE SELECTION'}
            </button>
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={modalContent !== null}
          onClose={() => setModalContent(null)}
          title={modalContent?.title || ''}
          content={modalContent?.content || ''}
        />
      </Fragment>
    );
  }

  // Default render (when selection exists but not analyzed)
  return (
    <Fragment>
      <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Header with help button */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 1000,
          }}
        >
          <button
            onClick={() => setShowOnboarding(true)}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: '1px solid var(--figma-color-border)',
              background: 'var(--figma-color-bg)',
              color: 'var(--figma-color-text-secondary)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--figma-color-bg-hover)';
              e.currentTarget.style.borderColor = 'var(--figma-color-text-tertiary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--figma-color-bg)';
              e.currentTarget.style.borderColor = 'var(--figma-color-border)';
            }}
          >
            ?
          </button>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div style={{ textAlign: 'left', maxWidth: '320px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '8px',
              }}
            >
              {selectionCount} {selectionCount === 1 ? 'ITEM' : 'ITEMS'} SELECTED
            </div>
            <div
              style={{
                fontSize: '12px',
                color: 'var(--text-tertiary)',
                lineHeight: '1.5',
              }}
            >
              Ready to analyze design system coverage
            </div>
          </div>
        </div>

        {/* Fixed button at bottom */}
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 0 0 0',
            background: 'var(--figma-color-bg)',
            zIndex: 100,
          }}
        >
          <button
            onClick={handleAnalyze}
            onMouseEnter={(e) => {
              if (hasSelection) {
                e.currentTarget.style.opacity = '0.85';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            style={{
              width: '100%',
              height: '52px',
              background: 'var(--button-bg)',
              color: 'var(--button-text)',
              border: 'none',
              borderRadius: '0',
              fontSize: '11px',
              fontWeight: '300',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '8px',
              paddingLeft: '20px',
              transition: 'opacity 0.2s',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3v18h18" />
              <path d="M18 17V9M13 17V5M8 17v-3" />
            </svg>
            ANALYZE SELECTION
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalContent !== null}
        onClose={() => setModalContent(null)}
        title={modalContent?.title || ''}
        content={modalContent?.content || ''}
      />

      {/* Onboarding Modal */}
      <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />

      {/* Help Modal */}
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </Fragment>
  );
}

export default render(Plugin);
