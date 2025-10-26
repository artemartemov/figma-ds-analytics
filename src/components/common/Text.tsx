import { h, ComponentChildren } from 'preact';
import { CSSProperties } from 'preact/compat';

type TextVariant =
  | 'body'
  | 'body-sm'
  | 'heading-section'
  | 'heading-subsection'
  | 'card-heading'
  | 'label'
  | 'value'
  | 'metric-large'
  | 'code';

interface TextProps {
  variant?: TextVariant;
  children: ComponentChildren;
  style?: CSSProperties;
  as?: 'p' | 'span' | 'div' | 'label';
}

const variantStyles: Record<TextVariant, CSSProperties> = {
  body: {
    fontSize: 'var(--type-body-font-size)',
    lineHeight: 'var(--type-body-line-height)',
    color: 'var(--text-primary)',
  },
  'body-sm': {
    fontSize: 'var(--font-size-sm)',
    lineHeight: 'var(--line-height-normal)',
    color: 'var(--text-primary)',
  },
  'heading-section': {
    fontSize: 'var(--type-heading-section-font-size)',
    fontWeight: 'var(--type-heading-section-font-weight)',
    letterSpacing: 'var(--type-heading-section-letter-spacing)',
    textTransform: 'var(--type-heading-section-text-transform)' as any,
    color: 'var(--text-primary)',
  },
  'heading-subsection': {
    fontSize: 'var(--type-heading-subsection-font-size)',
    fontWeight: 'var(--type-heading-subsection-font-weight)',
    color: 'var(--text-primary)',
  },
  'card-heading': {
    fontSize: 'var(--card-heading-font-size)',
    fontWeight: 'var(--card-heading-font-weight)',
    textTransform: 'var(--card-heading-text-transform)' as any,
    color: 'var(--text-primary)',
  },
  label: {
    fontSize: 'var(--section-label-font-size)',
    fontWeight: 'var(--section-label-font-weight)',
    color: 'var(--section-label-color)',
  },
  value: {
    fontSize: 'var(--section-value-font-size)',
    fontWeight: 'var(--section-value-font-weight)',
    color: 'var(--section-value-color)',
    fontFeatureSettings: '"tnum"',
  },
  'metric-large': {
    fontSize: 'var(--metric-large-font-size)',
    fontWeight: 'var(--metric-large-font-weight)',
    color: 'var(--metric-large-color)',
    fontFeatureSettings: '"tnum"',
  },
  code: {
    fontFamily: 'var(--type-code-font-family)',
    fontSize: 'var(--type-code-font-size)',
    color: 'var(--text-secondary)',
  },
};

export function Text({ variant = 'body', children, style, as = 'span' }: TextProps) {
  const Component = as;
  const combinedStyle = {
    ...variantStyles[variant],
    ...style,
  };

  return <Component style={combinedStyle}>{children}</Component>;
}
