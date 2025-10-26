import { h, ComponentChildren } from 'preact';
import { CSSProperties } from 'preact/compat';

interface LinkProps {
  href?: string;
  onClick?: () => void;
  children: ComponentChildren;
  external?: boolean;
  style?: CSSProperties;
}

export function Link({ href, onClick, children, external = false, style }: LinkProps) {
  const baseStyles: CSSProperties = {
    color: 'var(--text-primary)',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: 'inherit',
    fontWeight: 'inherit',
    transition: 'opacity 0.15s',
  };

  const combinedStyles = {
    ...baseStyles,
    ...style,
  };

  const handleClick = (e: Event) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={combinedStyles}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '0.7';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1';
      }}
    >
      {children}
    </a>
  );
}
