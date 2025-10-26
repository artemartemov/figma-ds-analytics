import { h, ComponentChildren } from 'preact';
import { CSSProperties } from 'preact/compat';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ComponentChildren;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: CSSProperties;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const baseStyles: CSSProperties = {
    border: 'none',
    borderRadius: 'var(--border-radius-sm)',
    fontWeight: 'var(--font-weight-semibold)',
    letterSpacing: 'var(--letter-spacing-normal)',
    textTransform: 'uppercase',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s',
    width: fullWidth ? '100%' : 'auto',
  };

  const sizeStyles: Record<ButtonSize, CSSProperties> = {
    sm: {
      height: '32px',
      padding: '0 var(--spacing-xl)',
      fontSize: 'var(--font-size-sm)',
    },
    md: {
      height: 'var(--button-height-md)',
      padding: '0 var(--spacing-xxl)',
      fontSize: 'var(--font-size-lg)',
    },
    lg: {
      height: '48px',
      padding: '0 var(--spacing-xxxl)',
      fontSize: 'var(--font-size-xl)',
    },
  };

  const variantStyles: Record<ButtonVariant, CSSProperties> = {
    primary: {
      background: disabled ? 'var(--button-disabled-bg)' : 'var(--button-bg)',
      color: disabled ? 'var(--button-disabled-text)' : 'var(--button-text)',
    },
    secondary: {
      background: 'transparent',
      border: `1px solid ${disabled ? 'var(--button-disabled-bg)' : 'var(--border-color)'}`,
      color: disabled ? 'var(--button-disabled-text)' : 'var(--text-primary)',
    },
    ghost: {
      background: 'transparent',
      color: disabled ? 'var(--button-disabled-text)' : 'var(--text-primary)',
    },
  };

  const combinedStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style,
  };

  return (
    <button onClick={onClick} disabled={disabled} style={combinedStyles}>
      {children}
    </button>
  );
}
