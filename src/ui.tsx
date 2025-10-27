import { h, Fragment } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { render, Container, VerticalSpace } from '@create-figma-plugin/ui';
import { emit, on } from '@create-figma-plugin/utilities';
import { SegmentedControl, Text, Button, IconButton } from './components/common';
import { LoadingState, ErrorState, EmptyState } from './components/states';
import {
  HELP_MODALS,
  TOOLTIP_TEXT,
  TOOLTIP_CONTENT,
  MODAL_CONTENT,
  CATEGORY_COLORS,
  TABS,
  SPACING,
  COLORS,
} from './content';
import { Modal, OnboardingModal, HelpModal } from './components/modals';
import { StatCard } from './components/cards';
import { OverviewTab, ComponentsTab, TokensTab } from './components/tabs';
import { themeStyles } from './styles/theme';
import {
  formatPercent,
  getOrphanInstanceKey,
  isOrphanIgnoredEverywhere,
} from './utils/orphanHelpers';
import { getFilteredMetrics } from './utils/metricsCalculation';
import type { CoverageMetrics } from './types';
import type { TabValue } from './content/constants';

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
  const [activeTab, setActiveTab] = useState<TabValue>(TABS.OVERVIEW);

  // Track collapsed sections (wrappers start collapsed)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  // Ignored items (used for orphans and components, but not wrappers)
  const [ignoredComponents, setIgnoredComponents] = useState<Set<string>>(new Set());
  // Track orphan instances by composite key: orphanNodeId:componentId
  // This allows ignoring an orphan in specific components or everywhere
  const [ignoredOrphanInstances, setIgnoredOrphanInstances] = useState<Set<string>>(new Set());
  const [ignoredInstances, setIgnoredInstances] = useState<Set<string>>(new Set());
  const [ignoredLibraries, setIgnoredLibraries] = useState<Set<string>>(new Set());

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
    const isCurrentlyIgnoredEverywhere = isOrphanIgnoredEverywhere(
      orphanNodeId,
      componentIds,
      ignoredOrphanInstances
    );

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
  const filtered = getFilteredMetrics(
    data,
    ignoredComponents,
    ignoredInstances,
    ignoredOrphanInstances
  );

  // Render loading state
  if (loading && hasSelection) {
    return (
      <LoadingState
        progress={progress}
        showOnboarding={showOnboarding}
        showHelpModal={showHelpModal}
        showHelpTooltip={showHelpTooltip}
        onCancelAnalysis={handleCancelAnalysis}
        onCloseOnboarding={handleCloseOnboarding}
        onCloseHelpModal={() => setShowHelpModal(false)}
        onShowHelpModal={setModalContent}
        onShowHelpTooltip={setShowHelpTooltip}
      />
    );
  }

  // Render error state
  if (error) {
    return (
      <ErrorState
        error={error}
        hasSelection={hasSelection}
        showOnboarding={showOnboarding}
        showHelpModal={showHelpModal}
        showHelpTooltip={showHelpTooltip}
        onAnalyze={handleAnalyze}
        onCloseOnboarding={handleCloseOnboarding}
        onCloseHelpModal={() => setShowHelpModal(false)}
        onShowHelpModal={setModalContent}
        onShowHelpTooltip={setShowHelpTooltip}
      />
    );
  }

  // Render empty selection state
  if (!data && !hasSelection) {
    return (
      <EmptyState
        showOnboarding={showOnboarding}
        showHelpTooltip={showHelpTooltip}
        onCloseOnboarding={handleCloseOnboarding}
        onShowHelpModal={setModalContent}
        onShowHelpTooltip={setShowHelpTooltip}
      />
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
                setModalContent(HELP_MODALS.MAIN);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = COLORS.HELP_BUTTON_HOVER;
                setShowHelpTooltip(true);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = COLORS.HELP_BUTTON;
                setTimeout(() => {
                  setShowHelpTooltip(false);
                }, 100);
              }}
              style={{
                border: 'none',
                background: 'transparent',
                color: COLORS.HELP_BUTTON,
                fontSize: '12px',
                fontFamily: 'var(--font-family-mono)',
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
              paddingBottom: SPACING.FIXED_BUTTON_OFFSET,
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
                  marginBottom: SPACING.CARD_GAP,
                }}
              >
                {/* Overall Score Card */}
                <StatCard
                  title="Overall Adoption"
                  tooltipContent={TOOLTIP_CONTENT.overallAdoption(
                    filtered.variableCoverage,
                    filtered.componentCoverage,
                    filtered.overallScore
                  )}
                  tokensLabel="Tokens"
                  tokensValue={filtered.variableCoverage}
                  componentsLabel="Components"
                  componentsValue={filtered.componentCoverage}
                  donutValue={filtered.overallScore}
                  onDonutClick={() =>
                    setModalContent(
                      MODAL_CONTENT.overallAdoption(
                        filtered.variableCoverage,
                        filtered.componentCoverage,
                        filtered.overallScore
                      )
                    )
                  }
                />

                {/* Component Coverage Card */}
                <div style={{ marginTop: SPACING.CARD_GAP }}>
                  <StatCard
                    title="Component Coverage"
                    tooltipContent={TOOLTIP_CONTENT.componentCoverage(
                      filtered.libraryInstances,
                      filtered.totalInstances,
                      filtered.componentCoverage
                    )}
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
                    tooltipContent={TOOLTIP_CONTENT.tokenAdoption(
                      filtered.tokenBoundCount,
                      filtered.totalOpportunities,
                      filtered.variableCoverage
                    )}
                    tokensLabel="Token-Bound"
                    tokensValue={filtered.variableCoverage}
                    componentsLabel="Hardcoded"
                    componentsValue={100 - filtered.variableCoverage}
                    donutValue={filtered.variableCoverage}
                    onDonutClick={() =>
                      setModalContent(
                        MODAL_CONTENT.tokenAdoption(
                          filtered.tokenBoundCount,
                          filtered.totalOpportunities,
                          filtered.variableCoverage
                        )
                      )
                    }
                  />
                </div>
              </div>

              {/* Figma-style Tabs */}
              <SegmentedControl
                options={[
                  { value: TABS.OVERVIEW, label: 'OVERVIEW' },
                  { value: TABS.COMPONENTS, label: 'COMPONENTS' },
                  { value: TABS.TOKENS, label: 'DESIGN TOKENS' },
                ]}
                activeValue={activeTab}
                onChange={(value) => setActiveTab(value as TabValue)}
              />

              {/* Tab Content */}
              {activeTab === TABS.OVERVIEW && (
                <OverviewTab
                  componentsCount={filtered.totalInstances}
                  designTokensCount={filtered.totalOpportunities}
                  librariesCount={filtered.libraryBreakdown.length}
                  orphansCount={filtered.orphanCount}
                />
              )}

              {activeTab === TABS.COMPONENTS && (
                <ComponentsTab
                  libraryBreakdown={filtered.libraryBreakdown}
                  componentDetails={data.componentDetails || []}
                  collapsedSections={collapsedSections}
                  ignoredInstances={ignoredInstances}
                  ignoredLibraries={ignoredLibraries}
                  onToggleCollapse={handleToggleCollapse}
                  onToggleIgnoreLibrary={handleToggleIgnoreLibrary}
                  onToggleIgnoreInstance={handleToggleIgnoreInstance}
                  onSelectNode={handleSelectNode}
                />
              )}

              {activeTab === TABS.TOKENS && (
                <TokensTab
                  hardcodedValues={data.hardcodedValues}
                  orphanDetails={data.hardcodedValues?.details || []}
                  collapsedSections={collapsedSections}
                  ignoredOrphans={ignoredOrphanInstances}
                  categoryColors={CATEGORY_COLORS}
                  onToggleCollapse={handleToggleCollapse}
                  onToggleIgnoreOrphanEverywhere={handleToggleIgnoreOrphanEverywhere}
                  onToggleIgnoreOrphanInComponent={handleToggleIgnoreOrphanInComponent}
                  onSelectNode={handleSelectNode}
                />
              )}
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
            <Button
              size="xl"
              onClick={handleAnalyze}
              disabled={!hasSelection}
              fullWidth
              style={{
                borderRadius: '0',
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
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
              {data
                ? `RE-ANALYZE ${selectionCount} ${selectionCount === 1 ? 'ITEM' : 'ITEMS'}`
                : 'ANALYZE SELECTION'}
            </Button>
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
          <IconButton
            variant="circular"
            size="lg"
            onClick={() => setShowOnboarding(true)}
            title={TOOLTIP_TEXT.ONBOARDING_BUTTON}
          >
            ?
          </IconButton>
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
            <Text
              variant="heading-subsection"
              as="div"
              style={{
                marginBottom: '8px',
              }}
            >
              {selectionCount} {selectionCount === 1 ? 'ITEM' : 'ITEMS'} SELECTED
            </Text>
            <Text
              as="div"
              style={{
                fontSize: '12px',
                color: 'var(--text-tertiary)',
                lineHeight: '1.5',
              }}
            >
              Ready to analyze design system coverage
            </Text>
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
          <Button
            size="xl"
            onClick={handleAnalyze}
            fullWidth
            style={{
              borderRadius: '0',
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
          </Button>
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
