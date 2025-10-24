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
  IconChevronRight16,
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

// Custom Tooltip component
function Tooltip({
  content,
  dark = false,
  position = 'right',
}: {
  content: string;
  dark?: boolean;
  position?: 'right' | 'bottom';
}) {
  const [isVisible, setIsVisible] = useState(false);

  // Positioning styles based on position prop
  const tooltipStyles =
    position === 'bottom'
      ? {
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
        }
      : {
          top: '50%',
          left: '20px',
          transform: 'translateY(-50%)',
        };

  const arrowStyles =
    position === 'bottom'
      ? {
          left: '50%',
          top: '-4px',
          transform: 'translateX(-50%) rotate(45deg)',
        }
      : {
          left: '-4px',
          top: '50%',
          transform: 'translateY(-50%) rotate(45deg)',
        };

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
      }}
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
          flexShrink: 0,
        }}
      >
        ?
      </span>
      {isVisible && (
        <div
          style={{
            position: 'absolute',
            ...tooltipStyles,
            background: 'rgba(0,0,0,0.9)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '10px',
            whiteSpace: 'pre-line',
            zIndex: 1000,
            minWidth: '200px',
            maxWidth: '280px',
            lineHeight: '1.4',
            pointerEvents: 'none',
          }}
        >
          {content}
          <div
            style={{
              position: 'absolute',
              ...arrowStyles,
              width: '8px',
              height: '8px',
              background: 'rgba(0,0,0,0.9)',
            }}
          />
        </div>
      )}
    </div>
  );
}

// Donut Chart Component
interface DonutChartProps {
  segments: Array<{ value: number; color: string; label?: string }>;
  size?: number;
  strokeWidth?: number;
  centerValue?: string;
  centerLabel?: string;
  gapDegrees?: number;
  tooltipContent?: string;
}

function DonutChart({
  segments,
  size = 64,
  strokeWidth = 4,
  centerValue,
  centerLabel,
  gapDegrees = 0,
  tooltipContent,
}: DonutChartProps) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  // Chart dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calculate gap between segments
  const gapLength = (gapDegrees / 360) * circumference;

  // Calculate total value for percentage calculations
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);

  // Generate progress arcs
  // Note: These use stroke-dasharray for animation-ready rendering
  let currentOffset = 0;
  const progressArcs = segments.map((segment, index) => {
    const percentage = segment.value / total;
    const strokeLength = circumference * percentage - gapLength;
    const offset = currentOffset;
    currentOffset += strokeLength + gapLength;

    return (
      <circle
        key={`progress-${index}`}
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={segment.color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${strokeLength} ${circumference}`}
        strokeDashoffset={-offset}
        strokeLinecap="butt"
        transform={`rotate(-90 ${center} ${center})`}
      />
    );
  });

  return (
    <div
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        cursor: tooltipContent ? 'help' : 'default',
      }}
      onMouseEnter={() => tooltipContent && setIsTooltipVisible(true)}
      onMouseLeave={() => tooltipContent && setIsTooltipVisible(false)}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ display: 'block' }}
      >
        {/* Background track circle - adapts to theme */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          style={{
            stroke: 'var(--track-bg)',
            strokeWidth: `${strokeWidth}px`,
          }}
        />

        {/* Progress segments group - rendered on top */}
        <g>{progressArcs}</g>
      </svg>

      {/* Center value display */}
      {centerValue && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontSize: '18px',
              fontWeight: '700',
              lineHeight: '1',
              fontFeatureSettings: '"tnum"',
              color: 'var(--text-primary)',
            }}
          >
            {centerValue}
          </div>
          {centerLabel && (
            <div
              style={{
                fontSize: '7px',
                marginTop: '2px',
                opacity: 0.6,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--text-primary)',
              }}
            >
              {centerLabel}
            </div>
          )}
        </div>
      )}

      {/* Tooltip */}
      {tooltipContent && isTooltipVisible && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '100%',
            transform: 'translateY(-50%)',
            marginRight: '12px',
            background: 'rgba(0,0,0,0.9)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '10px',
            whiteSpace: 'pre-line',
            zIndex: 1000,
            width: '320px',
            lineHeight: '1.4',
            pointerEvents: 'none',
          }}
        >
          {tooltipContent}
          <div
            style={{
              position: 'absolute',
              right: '-4px',
              top: '50%',
              transform: 'translateY(-50%) rotate(45deg)',
              width: '8px',
              height: '8px',
              background: 'rgba(0,0,0,0.9)',
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
  const [progress, setProgress] = useState({
    step: 'Initializing...',
    percent: 0,
  });

  // Theme-aware CSS using Figma's native CSS variables
  const themeStyles = `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');

    /* Normalize plugin header spacing */
    * {
      box-sizing: border-box;
    }

    body, html {
      margin: 0 !important;
      padding: 0 !important;
    }

    #app {
      margin: 0 !important;
      padding: 0 !important;
    }

    :root {
      /* Use Figma's native theme variables and add our custom ones */
      --text-primary: var(--figma-color-text);
      --text-secondary: var(--figma-color-text-secondary);
      --text-tertiary: var(--figma-color-text-tertiary);
      --card-bg: var(--figma-color-bg-secondary);
      --border-color: var(--figma-color-border);
    }

    /* Light mode specific overrides */
    @media (prefers-color-scheme: light) {
      :root {
        --track-bg: #ffffff;
        --progress-fill: #222222;
        --progress-fill-secondary: #52525B;
      }
    }

    /* Dark mode specific overrides */
    @media (prefers-color-scheme: dark) {
      :root {
        --track-bg: #505050;
        --progress-fill: #FFFFFF;
        --progress-fill-secondary: #B8B8B8;
        --button-bg: #FFFFFF;
        --button-text: #222222;
        --button-disabled-bg: rgba(255,255,255,0.1);
        --button-disabled-text: rgba(255,255,255,0.3);
        --tab-inactive-text: #B8B8B8;
        --tab-container-bg: #242424;
      }
    }

    /* Light mode button colors */
    @media (prefers-color-scheme: light) {
      :root {
        --button-bg: #222222;
        --button-text: #ffffff;
        --button-disabled-bg: rgba(0,0,0,0.1);
        --button-disabled-text: rgba(0,0,0,0.3);
        --tab-inactive-text: #222222;
        --tab-container-bg: #F5F5F5;
      }
    }

    /* Custom checkbox styling to match Figma design patterns */
    input[type="checkbox"] {
      width: 10px !important;
      height: 10px !important;
      min-width: 10px !important;
      min-height: 10px !important;
      margin: 0 !important;
      margin-right: 6px !important;
      border-radius: 2px !important;
      border: 1px solid var(--border-color) !important;
      background: transparent !important;
      cursor: pointer !important;
    }

    input[type="checkbox"]:checked {
      background: var(--figma-color-text) !important;
      border-color: var(--figma-color-text) !important;
    }

    /* Checkbox label styling */
    label {
      display: flex !important;
      align-items: center !important;
      gap: 0 !important;
      cursor: pointer !important;
    }

    * {
      font-family: 'JetBrains Mono', 'Monaco', 'Courier New', monospace !important;
    }
  `;

  // Tab state
  const [activeTab, setActiveTab] = useState<
    'overview' | 'components' | 'tokens'
  >('overview');

  // Track collapsed sections (wrappers start collapsed)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set()
  );

  // Ignored items (used for orphans and components, but not wrappers)
  const [ignoredComponents, setIgnoredComponents] = useState<Set<string>>(
    new Set()
  );
  const [ignoredOrphans, setIgnoredOrphans] = useState<Set<string>>(new Set());
  const [ignoredInstances, setIgnoredInstances] = useState<Set<string>>(
    new Set()
  );

  // Listen for messages from plugin backend
  useEffect(() => {
    on('RESULTS', (results: CoverageMetrics) => {
      setData(results);
      setLoading(false);
      setError(null);

      // Load ignored items from backend
      if (results.hardcodedValues) {
        setIgnoredComponents(
          new Set(results.hardcodedValues.ignoredComponents || [])
        );
        setIgnoredOrphans(
          new Set(results.hardcodedValues.ignoredOrphans || [])
        );
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
      if (!loading) {
        setLoading(true);
        setHasSelection(true);
      }
    });
  }, [loading]);

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
      return "Exceptional achievement (>95%)! You're at industry-leading adoption levels. Note: 100% adoption is neither realistic nor desirable.";
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
      const variableCoverage =
        hv.totalOpportunities > 0
          ? (backendTokenBound / hv.totalOpportunities) * 100
          : 0;

      const orphanRate =
        hv.totalOpportunities > 0
          ? (hv.totalHardcoded / hv.totalOpportunities) * 100
          : 0;

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
        filteredTotalInstances > 0
          ? (filteredLibraryInstances / filteredTotalInstances) * 100
          : 0;

      const filteredOverallScore =
        variableCoverage * 0.55 + filteredComponentCoverage * 0.45;

      const filteredBreakdown = data.libraryBreakdown
        .map((lib) => ({
          name: lib.name,
          count: lib.count,
          percentage:
            filteredTotalInstances > 0
              ? (lib.count / filteredTotalInstances) * 100
              : 0,
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
      const isComponentIgnored = ignoredComponents.has(
        detail.parentComponentId
      );
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
      const isComponentIgnored = ignoredComponents.has(
        detail.parentComponentId
      );
      const isInstanceIgnored = ignoredInstances.has(detail.parentInstanceId);

      // Only count if NOT ignored at any level
      if (!isComponentIgnored && !isInstanceIgnored) {
        filteredTokenBoundCount += detail.properties.length;
      }
    });

    const filteredTotalOpportunities =
      filteredTokenBoundCount + filteredTotalHardcoded;

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

    const filteredTotalInstances =
      filteredLibraryInstances + filteredLocalInstances;
    const filteredComponentCoverage =
      filteredTotalInstances > 0
        ? (filteredLibraryInstances / filteredTotalInstances) * 100
        : 0;

    // Recalculate library breakdown excluding ignored instances AND wrappers
    const filteredLibraryBreakdown = new Map<string, number>();
    filteredInstances.forEach((instance) => {
      // Exclude wrappers from breakdown counts
      const isWrapper =
        instance.librarySource.includes('Wrapper') ||
        instance.librarySource.includes('Local (built with DS)');
      if (!isWrapper) {
        const source = instance.librarySource;
        filteredLibraryBreakdown.set(
          source,
          (filteredLibraryBreakdown.get(source) || 0) + 1
        );
      }
    });

    const filteredBreakdown = Array.from(filteredLibraryBreakdown.entries())
      .map(([name, count]) => ({
        name,
        count,
        percentage:
          filteredTotalInstances > 0
            ? (count / filteredTotalInstances) * 100
            : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Foundation-First weighting: 55% token adoption, 45% component coverage
    // Rationale: Tokens drive 80% of consistency value (IBM, Atlassian research)
    const filteredOverallScore =
      filteredVariableCoverage * 0.55 + filteredComponentCoverage * 0.45;

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

  // Eye icon SVG (14x14 for better visibility)
  const eyeIconSVG = (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 4C4 4 1.5 6.5 1.5 7s2.5 3 5.5 3 5.5-1.5 5.5-3-2.5-3-5.5-3zm0 5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
        fill="currentColor"
      />
      <circle
        cx="7"
        cy="7"
        r="1"
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

    const colorMap: { [key: string]: string } = {
      'Spandex - Atomic Components': '#222',
      'Spandex - Design Components': '#444', // Dark gray variant
      'Spandex - Global Foundations': '#666', // Medium gray variant
      'Local (built with DS) - Wrapper': '#999', // Light gray for wrappers (excluded from count)
      'Local (built with DS)': '#999', // Light gray for wrappers (excluded from count)
      'Local (standalone)': '#bbb', // Lighter gray for standalone
      'Other Library (not mapped)': '#9b59b6',
      'Local Components': '#f39c12',
    };

    return Array.from(instancesByLibrary.entries()).map(
      ([librarySource, instances]) => {
        const color = colorMap[librarySource] || '#666';
        const isWrapper =
          librarySource.includes('Wrapper') ||
          librarySource.includes('Local (built with DS)');
        const isCollapsed = collapsedSections.has(librarySource);

        return (
          <div
            key={librarySource}
            style={{ marginBottom: '16px' }}
          >
            <div
              style={{
                padding: '8px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                borderBottom: !isCollapsed
                  ? '1px solid var(--figma-color-border)'
                  : 'none',
              }}
              onClick={() => handleToggleCollapse(librarySource)}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 600,
                    color: 'var(--figma-color-text)',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
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
                        paddingLeft: '20px',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                        fontSize: '10px',
                        opacity: instanceOpacity,
                        borderBottom: '1px solid var(--figma-color-border)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '4px',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontWeight: 600,
                              color: 'var(--figma-color-text)',
                              marginBottom: '2px',
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
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          {!isWrapper && (
                            <Checkbox
                              value={isIgnored}
                              onValueChange={() =>
                                handleToggleIgnoreInstance(instance.instanceId)
                              }
                            >
                              <Text style={{ fontSize: '9px' }}>Ignore</Text>
                            </Checkbox>
                          )}
                          <button
                            onClick={() =>
                              handleSelectNode(instance.instanceId)
                            }
                            title="View in canvas"
                            style={{
                              width: '20px',
                              height: '20px',
                              padding: '0',
                              background: 'transparent',
                              color: 'var(--text-secondary)',
                              border: '1px solid var(--border-color)',
                              borderRadius: '2px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition:
                                'background 0.15s ease, border-color 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                'var(--figma-color-bg-hover)';
                              e.currentTarget.style.borderColor =
                                'var(--text-secondary)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.borderColor =
                                'var(--border-color)';
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
      }
    );
  };

  // Render orphan details grouped by component
  const renderOrphanDetails = () => {
    if (!data || !data.hardcodedValues || !data.hardcodedValues.details)
      return null;

    // Group orphans by parent component
    const orphansByComponent = new Map<
      string,
      { name: string; id: string; orphans: OrphanDetail[] }
    >();

    data.hardcodedValues.details.forEach((detail) => {
      const compId = detail.parentComponentId;
      if (!orphansByComponent.has(compId)) {
        orphansByComponent.set(compId, {
          name: detail.parentComponentName,
          id: compId,
          orphans: [],
        });
      }
      orphansByComponent.get(compId)!.orphans.push(detail);
    });

    return Array.from(orphansByComponent.values()).map((component) => {
      const isComponentIgnored = ignoredComponents.has(component.id);
      const opacityStyle = isComponentIgnored ? 0.5 : 1;
      const isCollapsed = collapsedSections.has(`orphan-${component.id}`);

      return (
        <div
          key={component.id}
          style={{ marginBottom: '16px', opacity: opacityStyle }}
        >
          <div
            style={{
              padding: '8px 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              borderBottom: !isCollapsed
                ? '1px solid var(--figma-color-border)'
                : 'none',
            }}
            onClick={() => handleToggleCollapse(`orphan-${component.id}`)}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 600,
                  color: 'var(--figma-color-text)',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {isCollapsed ? <IconChevronRight16 /> : <IconChevronDown16 />}
                {component.name} {isComponentIgnored && '(Ignored)'}
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: 'var(--figma-color-text-secondary)',
                  marginTop: '2px',
                }}
              >
                {component.orphans.length} orphan
                {component.orphans.length > 1 ? 's' : ''}
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
                  width: '20px',
                  height: '20px',
                  padding: '0',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s ease, border-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    'var(--figma-color-bg-hover)';
                  e.currentTarget.style.borderColor = 'var(--text-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                {eyeIconSVG}
              </button>
            </div>
          </div>
          {!isCollapsed && (
            <div style={{ paddingTop: '8px' }}>
              {component.orphans.map((detail) => {
                const isOrphanIgnored = ignoredOrphans.has(detail.nodeId);
                const orphanOpacity = isOrphanIgnored ? 0.4 : 1;
                const color = categoryColors[detail.category] || '#666';

                return (
                  <div
                    key={detail.nodeId}
                    style={{
                      paddingLeft: '20px',
                      paddingTop: '8px',
                      paddingBottom: '8px',
                      fontSize: '10px',
                      opacity: orphanOpacity,
                      borderBottom: '1px solid var(--figma-color-border)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '4px',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            color: 'var(--figma-color-text)',
                            marginBottom: '2px',
                          }}
                        >
                          {detail.nodeName}
                        </div>
                        <div
                          style={{
                            color: 'var(--figma-color-text-secondary)',
                            fontSize: '9px',
                            marginBottom: '2px',
                          }}
                        >
                          <span
                            style={{
                              color: 'var(--figma-color-text-tertiary)',
                            }}
                          >
                            Type:
                          </span>{' '}
                          {detail.nodeType}
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
                            Hardcoded:
                          </span>{' '}
                          {detail.properties.map((prop, i) => (
                            <span key={i}>
                              <span style={{ color, fontWeight: 500 }}>
                                {prop}
                              </span>
                              {i < detail.properties.length - 1 && ', '}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Checkbox
                          value={isOrphanIgnored}
                          onValueChange={() =>
                            handleToggleIgnoreOrphan(detail.nodeId)
                          }
                        >
                          <Text style={{ fontSize: '9px' }}>Ignore</Text>
                        </Checkbox>
                        <button
                          onClick={() => handleSelectNode(detail.nodeId)}
                          title="View in canvas"
                          style={{
                            width: '20px',
                            height: '20px',
                            padding: '0',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition:
                              'background 0.15s ease, border-color 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              'var(--figma-color-bg-hover)';
                            e.currentTarget.style.borderColor =
                              'var(--text-secondary)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor =
                              'var(--border-color)';
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
  if (loading && hasSelection) {
    return (
      <Fragment>
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
        >
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
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '14px',
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
                width: '240px',
                height: '2px',
                background: 'var(--track-bg)',
                borderRadius: '4px',
              }}
            >
              <div
                style={{
                  width: progress.percent + '%',
                  height: '100%',
                  background: 'var(--progress-fill)',
                  borderRadius: '4px',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
            <VerticalSpace space="small" />
            <div
              style={{
                fontSize: '12px',
                color: 'var(--text-tertiary)',
                textAlign: 'center',
              }}
            >
              {Math.round(progress.percent)}%
            </div>
          </div>

          {/* Fixed button at bottom */}
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px 20px',
              background: 'var(--figma-color-bg)',
              zIndex: 100,
            }}
          >
            <button
              onClick={handleCancelAnalysis}
              style={{
                width: '100%',
                height: '44px',
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background 0.2s, border-color 0.2s',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Fragment>
    );
  }

  // Render error state
  if (error) {
    return (
      <Fragment>
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
        >
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
              <Banner
                icon="warning"
                variant="warning"
              >
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
              padding: '16px 20px',
              background: 'var(--figma-color-bg)',
              zIndex: 100,
            }}
          >
            <button
              onClick={handleAnalyze}
              disabled={!hasSelection}
              style={{
                width: '100%',
                height: '44px',
                background: hasSelection
                  ? 'var(--button-bg)'
                  : 'var(--button-disabled-bg)',
                color: hasSelection
                  ? 'var(--button-text)'
                  : 'var(--button-disabled-text)',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
                letterSpacing: '0.05em',
                cursor: hasSelection ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background 0.2s',
              }}
            >
              Analyze Selection
            </button>
          </div>
        </div>
      </Fragment>
    );
  }

  // Render empty selection state
  if (!data && !hasSelection) {
    return (
      <Fragment>
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
        >
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
            <div style={{ textAlign: 'center', maxWidth: '320px' }}>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                }}
              >
                No Selection
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-tertiary)',
                  lineHeight: '1.5',
                }}
              >
                Select frames, components, or sections on your canvas to analyze
                design system coverage
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
              padding: '16px 20px',
              background: 'var(--figma-color-bg)',
              zIndex: 100,
            }}
          >
            <button
              disabled
              style={{
                width: '100%',
                height: '44px',
                background: 'var(--button-disabled-bg)',
                color: 'var(--button-disabled-text)',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
                letterSpacing: '0.05em',
                cursor: 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              Analyze Selection
            </button>
          </div>
        </div>
      </Fragment>
    );
  }

  // Render results
  if (data && filtered) {
    // Render compact stats header for orphans tab
    const renderCompactStatsHeader = () => (
      <div
        style={{
          background: 'var(--figma-color-bg)',
          padding: '16px',
          borderRadius: '4px',
          marginBottom: '16px',
          border: '1px solid var(--figma-color-border)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {/* Overall Score */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: 'var(--figma-color-text)',
                lineHeight: '1',
              }}
            >
              {formatPercent(filtered.overallScore)}
            </div>
            <div
              style={{
                fontSize: '9px',
                color: 'var(--figma-color-text-secondary)',
                marginTop: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Overall
            </div>
          </div>

          {/* Component Coverage */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--figma-color-text)',
                lineHeight: '1',
              }}
            >
              {formatPercent(filtered.componentCoverage)}
            </div>
            <div
              style={{
                fontSize: '9px',
                color: 'var(--figma-color-text-secondary)',
                marginTop: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Components
            </div>
          </div>

          {/* Design Token Adoption */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--figma-color-text)',
                lineHeight: '1',
              }}
            >
              {formatPercent(filtered.variableCoverage)}
            </div>
            <div
              style={{
                fontSize: '9px',
                color: 'var(--figma-color-text-secondary)',
                marginTop: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Tokens
            </div>
          </div>

          {/* Orphan Rate */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--figma-color-text)',
                lineHeight: '1',
              }}
            >
              {formatPercent(filtered.orphanRate)}
            </div>
            <div
              style={{
                fontSize: '9px',
                color: 'var(--figma-color-text-secondary)',
                marginTop: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Orphan Rate
            </div>
          </div>
        </div>
      </div>
    );
    const overallFormula = `(Vars ${Math.round(
      filtered.variableCoverage
    )}% × 0.55) + (Comps ${Math.round(
      data.componentCoverage
    )}% × 0.45) = ${Math.round(filtered.overallScore)}%`;
    const benchmark = getBenchmark(filtered.overallScore);

    return (
      <Fragment>
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
        >
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
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                          textTransform: 'uppercase',
                        }}
                      >
                        Overall Adoption
                      </div>
                      <Tooltip
                        position="bottom"
                        content={`Foundation-First Formula (55/45 weighting):\n\nToken Adoption: ${formatPercent(
                          filtered.variableCoverage
                        )} × 0.55 = ${formatPercent(
                          filtered.variableCoverage * 0.55
                        )}\nComponent Coverage: ${formatPercent(
                          filtered.componentCoverage
                        )} × 0.45 = ${formatPercent(
                          filtered.componentCoverage * 0.45
                        )}\n\nOverall Adoption: ${formatPercent(
                          filtered.variableCoverage * 0.55
                        )} + ${formatPercent(
                          filtered.componentCoverage * 0.45
                        )} = ${formatPercent(
                          filtered.overallScore
                        )}\n\nWhy 55/45? Research from IBM, Atlassian, and Pinterest shows that foundational elements (tokens/variables) drive 80% of consistency value. Tokens are harder to adopt but more impactful than components.`}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      background: 'var(--card-bg)',
                      padding: '20px',
                      borderRadius: '4px',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '24px',
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        justifyContent: 'center',
                      }}
                    >
                      {/* Tokens Row */}
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '6px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                                fontWeight: '500',
                              }}
                            >
                              Tokens
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              fontWeight: '500',
                              fontFeatureSettings: '"tnum"',
                              color: 'var(--text-tertiary)',
                            }}
                          >
                            {formatPercent(filtered.variableCoverage)}
                          </div>
                        </div>
                        <div
                          style={{
                            height: '2px',
                            width: '100%',
                            background: 'var(--track-bg)',
                            borderRadius: '4px',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${filtered.variableCoverage}%`,
                              background: 'var(--progress-fill)',
                              borderRadius: '4px',
                              transition: 'width 0.3s',
                            }}
                          />
                        </div>
                      </div>

                      {/* Components Row */}
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '6px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                                fontWeight: '500',
                              }}
                            >
                              Components
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              fontWeight: '500',
                              fontFeatureSettings: '"tnum"',
                              color: 'var(--text-tertiary)',
                            }}
                          >
                            {formatPercent(filtered.componentCoverage)}
                          </div>
                        </div>
                        <div
                          style={{
                            height: '2px',
                            width: '100%',
                            background: 'var(--track-bg)',
                            borderRadius: '4px',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${filtered.componentCoverage}%`,
                              background: 'var(--progress-fill)',
                              borderRadius: '4px',
                              transition: 'width 0.3s',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ flexShrink: 0 }}>
                      <DonutChart
                        segments={[
                          {
                            value: filtered.overallScore,
                            color: 'var(--progress-fill)',
                          },
                          {
                            value: 100 - filtered.overallScore,
                            color: 'rgba(0, 0, 0, 0.06)',
                          },
                        ]}
                        centerValue={formatPercent(filtered.overallScore)}
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
                        )} + ${formatPercent(
                          filtered.componentCoverage * 0.45
                        )} = ${formatPercent(
                          filtered.overallScore
                        )}\n\nWhy 55/45? Research from IBM, Atlassian, and Pinterest shows that foundational elements (tokens/variables) drive 80% of consistency value. Tokens are harder to adopt but more impactful than components.`}
                      />
                    </div>
                  </div>
                </div>

                {/* Component Coverage Card */}
                <div style={{ marginTop: '32px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                          textTransform: 'uppercase',
                        }}
                      >
                        Component Coverage
                      </div>
                      <Tooltip
                        content={`Formula: Library Components ÷ Total Components\n\nLibrary Components: ${
                          filtered.libraryInstances
                        }\nLocal Components: ${
                          filtered.totalInstances - filtered.libraryInstances
                        }\nTotal: ${filtered.totalInstances}\n\nCalculation: ${
                          filtered.libraryInstances
                        } ÷ ${filtered.totalInstances} = ${formatPercent(
                          filtered.componentCoverage
                        )}\n\nNote: Wrapper components (local components built with DS) are excluded from this count because their nested DS components are already counted. This prevents double-counting.`}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-tertiary)',
                        fontWeight: '500',
                        fontFeatureSettings: '"tnum"',
                      }}
                    >
                      {filtered.libraryInstances} / {filtered.totalInstances}
                    </div>
                  </div>
                  <div
                    style={{
                      background: 'var(--card-bg)',
                      padding: '20px',
                      borderRadius: '4px',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '24px',
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        justifyContent: 'center',
                      }}
                    >
                      {/* DS Components Row */}
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '6px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                                fontWeight: '500',
                              }}
                            >
                              DS Components
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              fontWeight: '500',
                              fontFeatureSettings: '"tnum"',
                              color: 'var(--text-tertiary)',
                            }}
                          >
                            {filtered.libraryInstances}
                          </div>
                        </div>
                        <div
                          style={{
                            height: '2px',
                            width: '100%',
                            background: 'var(--track-bg)',
                            borderRadius: '4px',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${
                                filtered.totalInstances > 0
                                  ? (filtered.libraryInstances /
                                      filtered.totalInstances) *
                                    100
                                  : 0
                              }%`,
                              background: 'var(--progress-fill)',
                              borderRadius: '4px',
                              transition: 'width 0.3s',
                            }}
                          />
                        </div>
                      </div>

                      {/* Local Components Row */}
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '6px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                                fontWeight: '500',
                              }}
                            >
                              Local Components
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              fontWeight: '500',
                              fontFeatureSettings: '"tnum"',
                              color: 'var(--text-tertiary)',
                            }}
                          >
                            {filtered.totalInstances -
                              filtered.libraryInstances}
                          </div>
                        </div>
                        <div
                          style={{
                            height: '2px',
                            width: '100%',
                            background: 'var(--track-bg)',
                            borderRadius: '4px',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${
                                filtered.totalInstances > 0
                                  ? ((filtered.totalInstances -
                                      filtered.libraryInstances) /
                                      filtered.totalInstances) *
                                    100
                                  : 0
                              }%`,
                              background: 'var(--progress-fill)',
                              borderRadius: '4px',
                              transition: 'width 0.3s',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ flexShrink: 0 }}>
                      <DonutChart
                        segments={[
                          {
                            value: filtered.libraryInstances,
                            color: 'var(--progress-fill)',
                          },
                          {
                            value:
                              filtered.totalInstances -
                              filtered.libraryInstances,
                            color: 'rgba(0, 0, 0, 0.06)',
                          },
                        ]}
                        centerValue={formatPercent(filtered.componentCoverage)}
                        tooltipContent={`Formula: Library Components ÷ Total Components\n\nLibrary Components: ${
                          filtered.libraryInstances
                        }\nLocal Components: ${
                          filtered.totalInstances - filtered.libraryInstances
                        }\nTotal: ${filtered.totalInstances}\n\nCalculation: ${
                          filtered.libraryInstances
                        } ÷ ${filtered.totalInstances} = ${formatPercent(
                          filtered.componentCoverage
                        )}\n\nNote: Wrapper components (local components built with DS) are excluded from this count because their nested DS components are already counted. This prevents double-counting.`}
                      />
                    </div>
                  </div>
                </div>

                {/* Design Token Adoption Card */}
                <div style={{ marginTop: '32px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                          textTransform: 'uppercase',
                        }}
                      >
                        Design Token Adoption
                      </div>
                      <Tooltip
                        content={`Formula: Token-Bound Properties ÷ Total Properties\n\nToken-Bound Properties: ${
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
                      />
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-tertiary)',
                        fontWeight: '500',
                        fontFeatureSettings: '"tnum"',
                      }}
                    >
                      {filtered.tokenBoundCount} / {filtered.totalOpportunities}
                    </div>
                  </div>
                  <div
                    style={{
                      background: 'var(--card-bg)',
                      padding: '20px',
                      borderRadius: '4px',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '24px',
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        justifyContent: 'center',
                      }}
                    >
                      {/* Tokens Row */}
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '6px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                                fontWeight: '500',
                              }}
                            >
                              Tokens
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              fontWeight: '500',
                              fontFeatureSettings: '"tnum"',
                              color: 'var(--text-tertiary)',
                            }}
                          >
                            {filtered.tokenBoundCount}
                          </div>
                        </div>
                        <div
                          style={{
                            height: '2px',
                            width: '100%',
                            background: 'var(--track-bg)',
                            borderRadius: '4px',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${
                                filtered.totalOpportunities > 0
                                  ? (filtered.tokenBoundCount /
                                      filtered.totalOpportunities) *
                                    100
                                  : 0
                              }%`,
                              background: 'var(--progress-fill)',
                              borderRadius: '4px',
                              transition: 'width 0.3s',
                            }}
                          />
                        </div>
                      </div>

                      {/* Hardcoded Row */}
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '6px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                                fontWeight: '500',
                              }}
                            >
                              Hardcoded
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              fontWeight: '500',
                              fontFeatureSettings: '"tnum"',
                              color: 'var(--text-tertiary)',
                            }}
                          >
                            {filtered.totalOpportunities -
                              filtered.tokenBoundCount}
                          </div>
                        </div>
                        <div
                          style={{
                            height: '2px',
                            width: '100%',
                            background: 'var(--track-bg)',
                            borderRadius: '4px',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${
                                filtered.totalOpportunities > 0
                                  ? ((filtered.totalOpportunities -
                                      filtered.tokenBoundCount) /
                                      filtered.totalOpportunities) *
                                    100
                                  : 0
                              }%`,
                              background: 'var(--progress-fill)',
                              borderRadius: '4px',
                              transition: 'width 0.3s',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ flexShrink: 0 }}>
                      <DonutChart
                        segments={[
                          {
                            value: filtered.tokenBoundCount,
                            color: 'var(--progress-fill)',
                          },
                          {
                            value:
                              filtered.totalOpportunities -
                              filtered.tokenBoundCount,
                            color: 'rgba(0, 0, 0, 0.06)',
                          },
                        ]}
                        centerValue={formatPercent(filtered.variableCoverage)}
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
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Figma-style Tabs */}
              <div
                style={{
                  background: 'var(--tab-container-bg, #242424)',
                  padding: '0',
                  borderRadius: '4px',
                  marginTop: '32px',
                  display: 'flex',
                  gap: '0',
                  marginBottom: '24px',
                }}
              >
                {(['overview', 'components', 'tokens'] as const).map((tab) => {
                  const isActive = activeTab === tab;
                  const labels = {
                    overview: 'OVERVIEW',
                    components: 'COMPONENTS',
                    tokens: 'DESIGN TOKENS',
                  };

                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        background: isActive
                          ? 'var(--button-bg)'
                          : 'transparent',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '10px',
                        fontWeight: '400',
                        letterSpacing: '0.4px',
                        color: isActive
                          ? 'var(--button-text)'
                          : 'var(--tab-inactive-text)',
                        fontFamily: 'inherit',
                        outline: 'none',
                        transition: 'all 0.15s',
                        boxShadow: 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.opacity = '0.7';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.opacity = '1';
                        }
                      }}
                    >
                      {labels[tab]}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '16px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: 'var(--text-primary)',
                        textTransform: 'uppercase',
                        margin: 0,
                        lineHeight: 'normal',
                      }}
                    >
                      Summary
                    </p>
                  </div>

                  {/* Mini summary cards */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gridTemplateRows: '1fr 1fr',
                      gap: '12px',
                      height: '142px',
                    }}
                  >
                    <div
                      style={{
                        gridArea: '1 / 1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-tertiary)',
                          fontWeight: '400',
                          lineHeight: 'normal',
                          margin: 0,
                        }}
                      >
                        Components
                      </p>
                      <p
                        style={{
                          fontSize: '26px',
                          fontWeight: '700',
                          color: 'var(--text-primary)',
                          lineHeight: 'normal',
                          margin: 0,
                          fontFeatureSettings: '"tnum"',
                        }}
                      >
                        {filtered.totalInstances}
                      </p>
                    </div>

                    <div
                      style={{
                        gridArea: '1 / 2',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-tertiary)',
                          fontWeight: '400',
                          lineHeight: 'normal',
                          margin: 0,
                        }}
                      >
                        Design Tokens
                      </p>
                      <p
                        style={{
                          fontSize: '26px',
                          fontWeight: '700',
                          color: 'var(--text-primary)',
                          lineHeight: 'normal',
                          margin: 0,
                          fontFeatureSettings: '"tnum"',
                        }}
                      >
                        {filtered.totalOpportunities}
                      </p>
                    </div>

                    <div
                      style={{
                        gridArea: '2 / 1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-tertiary)',
                          fontWeight: '400',
                          lineHeight: 'normal',
                          margin: 0,
                        }}
                      >
                        Libraries
                      </p>
                      <p
                        style={{
                          fontSize: '26px',
                          fontWeight: '700',
                          color: 'var(--text-primary)',
                          lineHeight: 'normal',
                          margin: 0,
                          fontFeatureSettings: '"tnum"',
                        }}
                      >
                        {filtered.libraryBreakdown.length}
                      </p>
                    </div>

                    <div
                      style={{
                        gridArea: '2 / 2',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-tertiary)',
                          fontWeight: '400',
                          lineHeight: 'normal',
                          margin: 0,
                        }}
                      >
                        Orphans
                      </p>
                      <p
                        style={{
                          fontSize: '26px',
                          fontWeight: '700',
                          color: 'var(--text-primary)',
                          lineHeight: 'normal',
                          margin: 0,
                          fontFeatureSettings: '"tnum"',
                        }}
                      >
                        {filtered.orphanCount}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'components' && (
                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      marginBottom: '16px',
                    }}
                  >
                    Component Sources Overview
                  </div>

                  {/* Minimal bar charts */}
                  {filtered.libraryBreakdown &&
                    filtered.libraryBreakdown.length > 0 && (
                      <div style={{ marginBottom: '20px' }}>
                        {filtered.libraryBreakdown.map((lib, index) => {
                          return (
                            <div
                              key={lib.name}
                              style={{ marginBottom: '12px' }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  marginBottom: '6px',
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    color: 'var(--text-secondary)',
                                  }}
                                >
                                  {lib.name}
                                </span>
                                <span
                                  style={{
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    fontFeatureSettings: '"tnum"',
                                    color: 'var(--text-tertiary)',
                                  }}
                                >
                                  {lib.count}
                                </span>
                              </div>
                              <div
                                style={{
                                  height: '2px',
                                  width: '100%',
                                  background: 'var(--track-bg)',
                                  borderRadius: '4px',
                                }}
                              >
                                <div
                                  style={{
                                    height: '100%',
                                    width: lib.percentage + '%',
                                    background: 'var(--progress-fill)',
                                    borderRadius: '4px',
                                    transition: 'width 0.3s',
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  <VerticalSpace space="medium" />

                  {/* Component Details Header */}
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      marginBottom: '16px',
                    }}
                  >
                    Component Details
                  </div>

                  {renderComponentDetails()}
                </div>
              )}

              {activeTab === 'tokens' && (
                <div>
                  {/* Hardcoded Values Breakdown */}
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      marginBottom: '16px',
                    }}
                  >
                    Hardcoded by Type
                  </div>
                  {data.hardcodedValues &&
                  data.hardcodedValues.totalHardcoded > 0 ? (
                    <Fragment>
                      {[
                        { label: 'Colors', count: data.hardcodedValues.colors },
                        {
                          label: 'Typography',
                          count: data.hardcodedValues.typography,
                        },
                        {
                          label: 'Spacing',
                          count: data.hardcodedValues.spacing,
                        },
                        { label: 'Radius', count: data.hardcodedValues.radius },
                      ]
                        .filter((item) => item.count > 0)
                        .map((item, index) => {
                          const percentage =
                            data.hardcodedValues.totalHardcoded > 0
                              ? (item.count /
                                  data.hardcodedValues.totalHardcoded) *
                                100
                              : 0;

                          return (
                            <div
                              key={item.label}
                              style={{ marginBottom: '12px' }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  marginBottom: '6px',
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    color: 'var(--text-secondary)',
                                  }}
                                >
                                  {item.label}
                                </span>
                                <span
                                  style={{
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    fontFeatureSettings: '"tnum"',
                                    color: 'var(--text-tertiary)',
                                  }}
                                >
                                  {item.count}
                                </span>
                              </div>
                              <div
                                style={{
                                  height: '2px',
                                  width: '100%',
                                  background: 'var(--track-bg)',
                                  borderRadius: '4px',
                                }}
                              >
                                <div
                                  style={{
                                    height: '100%',
                                    width: percentage + '%',
                                    background: 'var(--progress-fill)',
                                    borderRadius: '4px',
                                    transition: 'width 0.3s',
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </Fragment>
                  ) : (
                    <Text
                      style={{
                        color: 'var(--figma-color-text-tertiary)',
                        fontSize: '11px',
                        marginBottom: '16px',
                      }}
                    >
                      No hardcoded values detected
                    </Text>
                  )}

                  <VerticalSpace space="medium" />

                  {/* Token Sources - Hidden for now */}
                  <div style={{ display: 'none' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                          textTransform: 'uppercase',
                        }}
                      >
                        Token Sources
                      </div>
                      {/* Orphan Rate Badge */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: 'var(--figma-color-bg)',
                          border: '1px solid var(--figma-color-border)',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: '600',
                            color: 'var(--figma-color-text-tertiary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          Orphan Rate
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            color: 'var(--figma-color-text)',
                          }}
                        >
                          {formatPercent(filtered.orphanRate)}
                        </span>
                      </div>
                    </div>
                    {data.variableBreakdown &&
                    data.variableBreakdown.length > 0 ? (
                      <div style={{ marginBottom: '20px' }}>
                        {data.variableBreakdown.map((lib, index) => {
                          return (
                            <div
                              key={lib.name}
                              style={{ marginBottom: '12px' }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  marginBottom: '6px',
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    color: 'var(--text-secondary)',
                                  }}
                                >
                                  {lib.name}
                                </span>
                                <span
                                  style={{
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    fontFeatureSettings: '"tnum"',
                                    color: 'var(--text-tertiary)',
                                  }}
                                >
                                  {lib.count}
                                </span>
                              </div>
                              <div
                                style={{
                                  height: '2px',
                                  width: '100%',
                                  background: 'var(--track-bg)',
                                  borderRadius: '4px',
                                }}
                              >
                                <div
                                  style={{
                                    height: '100%',
                                    width: lib.percentage + '%',
                                    background: 'var(--progress-fill)',
                                    borderRadius: '4px',
                                    transition: 'width 0.3s',
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <Text
                        style={{
                          color: 'var(--figma-color-text-tertiary)',
                          fontSize: '11px',
                        }}
                      >
                        No design tokens found
                      </Text>
                    )}

                    <VerticalSpace space="medium" />
                  </div>

                  {/* Orphan Details */}
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      marginBottom: '16px',
                    }}
                  >
                    Orphan Details by Component
                  </div>
                  {data.hardcodedValues.details &&
                  data.hardcodedValues.details.length > 0 ? (
                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                      {renderOrphanDetails()}
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: '32px',
                        textAlign: 'center',
                        background: 'var(--figma-color-bg)',
                        borderRadius: '4px',
                        border: '1px solid var(--figma-color-border)',
                      }}
                    >
                      <div style={{ fontSize: '40px', marginBottom: '12px' }}>
                        🎉
                      </div>
                      <Text
                        style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: 'var(--figma-color-text)',
                          marginBottom: '4px',
                        }}
                      >
                        No Orphans Found
                      </Text>
                      <Text
                        style={{
                          fontSize: '11px',
                          color: 'var(--figma-color-text-tertiary)',
                        }}
                      >
                        All properties are using design tokens
                      </Text>
                    </div>
                  )}
                </div>
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
                        background:
                          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                        {data.stats.libraryInstances +
                          data.stats.localInstances}
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
                        background:
                          'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
                              Weight Applied (55% of total score -
                              Foundation-First)
                            </div>
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: 'var(--figma-color-text)',
                              }}
                            >
                              {formatPercent(filtered.variableCoverage)} × 0.55
                              ={' '}
                              <span
                                style={{ color: '#f5576c', fontWeight: '700' }}
                              >
                                {formatPercent(
                                  filtered.variableCoverage * 0.55
                                )}
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
              padding: '16px 20px',
              background: 'var(--figma-color-bg)',
              zIndex: 100,
            }}
          >
            <button
              onClick={handleAnalyze}
              disabled={!hasSelection}
              style={{
                width: '100%',
                height: '44px',
                background: hasSelection
                  ? 'var(--button-bg)'
                  : 'var(--button-disabled-bg)',
                color: hasSelection
                  ? 'var(--button-text)'
                  : 'var(--button-disabled-text)',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
                letterSpacing: '0.05em',
                cursor: hasSelection ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background 0.2s',
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
                ? `Re-analyze ${selectionCount} ${
                    selectionCount === 1 ? 'item' : 'items'
                  }`
                : 'Analyze Selection'}
            </button>
          </div>
        </div>
      </Fragment>
    );
  }

  // Default render (when selection exists but not analyzed)
  return (
    <Fragment>
      <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
      <div
        style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
      >
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
          <div style={{ textAlign: 'center', maxWidth: '320px' }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '8px',
              }}
            >
              {selectionCount} {selectionCount === 1 ? 'item' : 'items'}{' '}
              selected
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
            padding: '16px 20px',
            background: 'var(--figma-color-bg)',
            zIndex: 100,
          }}
        >
          <button
            onClick={handleAnalyze}
            style={{
              width: '100%',
              height: '44px',
              background: 'var(--button-bg)',
              color: 'var(--button-text)',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.2s',
            }}
          >
            Analyze Selection
          </button>
        </div>
      </div>
    </Fragment>
  );
}

export default render(Plugin);
