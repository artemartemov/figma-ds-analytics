import { h, ComponentChildren } from 'preact';

// Use our custom StyleProps to avoid deprecation warnings
type StyleProps = {
  [key: string]: string | number | undefined;
};

type IconButtonSize = 'sm' | 'md' | 'lg';
type IconButtonVariant = 'default' | 'circular';

interface IconButtonProps {
  children: ComponentChildren;
  onClick?: (e: MouseEvent) => void;
  title?: string;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  disabled?: boolean;
  style?: StyleProps;
}

export function IconButton({
  children,
  onClick,
  title,
  size = 'md',
  variant = 'default',
  disabled = false,
  style,
}: IconButtonProps) {
  const sizeStyles: Record<IconButtonSize, StyleProps> = {
    sm: {
      width: '20px',
      height: '20px',
    },
    md: {
      width: '24px',
      height: '24px',
    },
    lg: {
      width: '28px',
      height: '28px',
    },
  };

  const variantStyles: Record<IconButtonVariant, StyleProps> = {
    default: {
      borderRadius: '2px',
      border: 'none',
    },
    circular: {
      borderRadius: '50%',
      border: '1px solid var(--figma-color-border)',
      fontSize: '14px',
      fontWeight: '600',
    },
  };

  const baseStyles: StyleProps = {
    padding: '0',
    background: disabled ? 'var(--button-disabled-bg)' : 'transparent',
    color: disabled
      ? 'var(--button-disabled-text)'
      : variant === 'circular'
        ? 'var(--figma-color-text-secondary)'
        : 'var(--text-secondary)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
  };

  const combinedStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style,
  };

  const handleMouseEnter = (e: MouseEvent) => {
    if (disabled) return;
    const target = e.currentTarget as HTMLButtonElement;

    if (variant === 'circular') {
      target.style.background = 'var(--figma-color-bg-hover)';
      target.style.borderColor = 'var(--figma-color-text-tertiary)';
    } else {
      target.style.background = 'var(--figma-color-bg-hover)';
    }
  };

  const handleMouseLeave = (e: MouseEvent) => {
    if (disabled) return;
    const target = e.currentTarget as HTMLButtonElement;

    if (variant === 'circular') {
      target.style.background = 'var(--figma-color-bg)';
      target.style.borderColor = 'var(--figma-color-border)';
    } else {
      target.style.background = 'transparent';
    }
  };

  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={combinedStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
}
