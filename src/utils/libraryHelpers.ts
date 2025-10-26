/**
 * Utility functions for identifying library sources and component types
 */

import { LIBRARY_SOURCES } from '../content/constants';

/**
 * Checks if a component is a wrapper component
 * Wrappers are local components built with DS components
 * They are excluded from metrics to prevent double-counting
 */
export const isWrapperComponent = (librarySource: string): boolean => {
  return LIBRARY_SOURCES.WRAPPER_INDICATORS.some((indicator) => librarySource.includes(indicator));
};

/**
 * Checks if a component is from a design system library
 */
export const isLibraryComponent = (librarySource: string): boolean => {
  return LIBRARY_SOURCES.LIBRARY_INDICATORS.some((indicator) => librarySource.includes(indicator));
};

/**
 * Categorizes a component instance by source type
 */
export const categorizeComponentSource = (
  librarySource: string
): 'wrapper' | 'library' | 'local' => {
  if (isWrapperComponent(librarySource)) {
    return 'wrapper';
  }
  if (isLibraryComponent(librarySource)) {
    return 'library';
  }
  return 'local';
};
