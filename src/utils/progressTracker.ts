// Progress tracking utilities for analysis updates
import { emit } from '@create-figma-plugin/utilities';

// Cancellation flag for analysis (module scope)
let analysisCancelled = false;

/**
 * Set the analysis cancellation flag
 */
export function setAnalysisCancelled(cancelled: boolean): void {
  analysisCancelled = cancelled;
}

/**
 * Send progress update to UI with delay for rendering
 * Throws error if analysis has been cancelled
 */
export async function sendProgress(step: string, percent: number): Promise<void> {
  // Check if analysis was cancelled
  if (analysisCancelled) {
    throw new Error('Analysis cancelled by user');
  }

  emit('PROGRESS', { step, percent });

  // Delay to allow UI to render the update smoothly
  await new Promise((resolve) => setTimeout(resolve, 200));
}
