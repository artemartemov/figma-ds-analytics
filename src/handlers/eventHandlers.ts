// Event handlers registration for plugin UI communication
import { on, emit } from '@create-figma-plugin/utilities';
import {
  loadIgnoredComponents,
  saveIgnoredComponents,
  loadIgnoredOrphans,
  saveIgnoredOrphans,
  loadIgnoredInstances,
  saveIgnoredInstances,
  loadOnboardingStatus,
  saveOnboardingStatus,
} from '../utils/storage';
import type { CoverageMetrics } from '../types';

/**
 * Register analysis-related event handlers
 */
export function registerAnalysisHandlers(
  analyzeCoverage: () => Promise<CoverageMetrics>,
  setAnalysisCancelled: (cancelled: boolean) => void
): void {
  on('ANALYZE', async () => {
    try {
      // Reset cancellation flag when starting new analysis
      setAnalysisCancelled(false);
      const metrics = await analyzeCoverage();
      emit('RESULTS', metrics);
    } catch (error) {
      // Don't show error if user cancelled the analysis
      if (error instanceof Error && error.message === 'Analysis cancelled by user') {
        // Silently ignore cancellation
        return;
      }
      emit('ERROR', error instanceof Error ? error.message : 'Unknown error occurred');
    }
  });

  on('CANCEL_ANALYSIS', () => {
    // Set flag to stop ongoing analysis
    setAnalysisCancelled(true);
  });

  on('CANCEL', () => {
    figma.closePlugin();
  });
}

/**
 * Register node selection event handlers
 */
export function registerSelectionHandlers(): void {
  on('SELECT_NODE', (nodeId: string) => {
    try {
      const node = figma.getNodeById(nodeId);
      if (node && 'absoluteBoundingBox' in node) {
        figma.currentPage.selection = [node as SceneNode];
        figma.viewport.scrollAndZoomIntoView([node as SceneNode]);
      }
    } catch (error) {
      console.error('Failed to select node:', error);
    }
  });
}

/**
 * Register ignore/unignore event handlers for components, orphans, and instances
 */
export function registerIgnoreHandlers(): void {
  // Component ignore handlers
  on('IGNORE_COMPONENT', async (componentId: string) => {
    try {
      const ignoredComponents = await loadIgnoredComponents();
      ignoredComponents.add(componentId);
      await saveIgnoredComponents(ignoredComponents);
    } catch (error) {
      console.error('Failed to ignore component:', error);
    }
  });

  on('UNIGNORE_COMPONENT', async (componentId: string) => {
    try {
      const ignoredComponents = await loadIgnoredComponents();
      ignoredComponents.delete(componentId);
      await saveIgnoredComponents(ignoredComponents);
    } catch (error) {
      console.error('Failed to unignore component:', error);
    }
  });

  // Orphan ignore handlers
  on('IGNORE_ORPHAN', async (nodeId: string) => {
    try {
      const ignoredOrphans = await loadIgnoredOrphans();
      ignoredOrphans.add(nodeId);
      await saveIgnoredOrphans(ignoredOrphans);
    } catch (error) {
      console.error('Failed to ignore orphan:', error);
    }
  });

  on('UNIGNORE_ORPHAN', async (nodeId: string) => {
    try {
      const ignoredOrphans = await loadIgnoredOrphans();
      ignoredOrphans.delete(nodeId);
      await saveIgnoredOrphans(ignoredOrphans);
    } catch (error) {
      console.error('Failed to unignore orphan:', error);
    }
  });

  // Instance ignore handlers
  on('IGNORE_INSTANCE', async (instanceId: string) => {
    try {
      const ignoredInstances = await loadIgnoredInstances();
      ignoredInstances.add(instanceId);
      await saveIgnoredInstances(ignoredInstances);
    } catch (error) {
      console.error('Failed to ignore instance:', error);
    }
  });

  on('UNIGNORE_INSTANCE', async (instanceId: string) => {
    try {
      const ignoredInstances = await loadIgnoredInstances();
      ignoredInstances.delete(instanceId);
      await saveIgnoredInstances(ignoredInstances);
    } catch (error) {
      console.error('Failed to unignore instance:', error);
    }
  });
}

/**
 * Register onboarding-related event handlers
 */
export function registerOnboardingHandlers(): void {
  on('GET_ONBOARDING_STATUS', async () => {
    try {
      const hasSeenOnboarding = await loadOnboardingStatus();
      emit('ONBOARDING_STATUS', hasSeenOnboarding);
    } catch (error) {
      console.error('Failed to load onboarding status:', error);
      emit('ONBOARDING_STATUS', false);
    }
  });

  on('SET_ONBOARDING_SEEN', async () => {
    try {
      await saveOnboardingStatus(true);
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
    }
  });

  on('RESET_ONBOARDING', async () => {
    try {
      await saveOnboardingStatus(false);
      const hasSeenOnboarding = await loadOnboardingStatus();
      emit('ONBOARDING_STATUS', hasSeenOnboarding);
    } catch (error) {
      console.error('Failed to reset onboarding:', error);
    }
  });
}

/**
 * Send initial onboarding status after UI mounts
 */
export async function sendInitialOnboardingStatus(): Promise<void> {
  setTimeout(async () => {
    try {
      const hasSeenOnboarding = await loadOnboardingStatus();
      emit('ONBOARDING_STATUS', hasSeenOnboarding);
    } catch (error) {
      console.error('Failed to load onboarding status:', error);
      emit('ONBOARDING_STATUS', false);
    }
  }, 150);
}

/**
 * Auto-run analysis on plugin load if onboarding has been seen
 */
export async function autoRunAnalysisIfReady(
  analyzeCoverage: () => Promise<CoverageMetrics>
): Promise<void> {
  setTimeout(async () => {
    try {
      const hasSeenOnboarding = await loadOnboardingStatus();
      if (hasSeenOnboarding) {
        const metrics = await analyzeCoverage();
        emit('RESULTS', metrics);
      }
    } catch {
      // Silently fail on initial load if no selection
    }
  }, 200);
}
