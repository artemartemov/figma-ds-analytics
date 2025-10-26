import { h, ComponentChildren } from 'preact';

// Define our own StyleProps to avoid deprecated JSXInternal.CSSProperties
// This mirrors the structure but without the deprecation warning
type StyleProps = {
  [key: string]: string | number | undefined;
};

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ComponentChildren;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProps;
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
  const getHoverBackground = () => {
    if (disabled) return undefined;
    if (variant === 'primary') return 'var(--button-bg-hover)';
    if (variant === 'secondary') return 'var(--alpha-black-10)';
    return undefined;
  };
  const baseStyles: StyleProps = {
    border: 'none',
    borderRadius: 'var(--border-radius-sm)',
    fontWeight: 'var(--font-weight-normal)',
    letterSpacing: 'var(--letter-spacing-normal)',
    textTransform: 'uppercase',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s',
    width: fullWidth ? '100%' : 'auto',
  };

  const sizeStyles: Record<ButtonSize, StyleProps> = {
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
      fontSize: 'var(--font-size-lg)',
    },
    xl: {
      height: '52px',
      padding: '0 var(--spacing-xxxxl)',
      fontSize: 'var(--font-size-lg)',
    },
  };

  const variantStyles: Record<ButtonVariant, StyleProps> = {
    primary: {
      background: disabled ? 'var(--button-disabled-bg)' : 'var(--button-bg)',
      color: disabled ? 'var(--button-disabled-text)' : 'var(--button-text)',
    },
    secondary: {
      background: 'transparent',
      border: `1px solid ${disabled ? 'var(--button-disabled-bg)' : 'var(--border-color)'}`,
      color: disabled ? 'var(--button-disabled-text)' : 'var(--text-primary)',
      borderRadius: 0,
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

  const handleMouseEnter = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLButtonElement;
    if (!disabled && variant === 'primary') {
      target.style.background = getHoverBackground() || '';
    } else if (!disabled && variant === 'secondary') {
      target.style.background = getHoverBackground() || '';
    } else if (!disabled && variant === 'ghost') {
      target.style.opacity = '0.7';
    }
  };

  const handleMouseLeave = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLButtonElement;
    if (!disabled && variant === 'primary') {
      target.style.background = 'var(--button-bg)';
    } else if (!disabled && variant === 'secondary') {
      target.style.background = 'transparent';
    } else if (!disabled && variant === 'ghost') {
      target.style.opacity = '1';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={combinedStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
}
