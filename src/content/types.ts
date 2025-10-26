/**
 * Type definitions for content management
 */

export interface ModalContent {
  title: string;
  content: string;
}

export interface TooltipContent {
  label: string;
  description?: string;
}

export interface FormulaContent {
  title: string;
  formula: string;
  explanation: string;
  example?: string;
}

export interface UIMessage {
  text: string;
  variant?: 'info' | 'warning' | 'error' | 'success';
}

export interface IconDefinition {
  viewBox: string;
  path: string | string[];
  width?: number;
  height?: number;
}
