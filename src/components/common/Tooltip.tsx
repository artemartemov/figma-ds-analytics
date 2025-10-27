import { h } from 'preact';
import { useState } from 'preact/hooks';

interface TooltipProps {
  content: string;
  dark?: boolean;
  position?: 'right' | 'bottom';
}

export function Tooltip({ content, dark = false, position = 'right' }: TooltipProps) {
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
          background: dark ? 'var(--alpha-white-20)' : 'var(--color-gray-150)',
          color: dark ? 'var(--alpha-white-90)' : 'var(--color-gray-700)',
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
            background: 'var(--alpha-black-90)',
            color: 'var(--color-gray-50)',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '11px',
            whiteSpace: 'pre-line',
            zIndex: 1000,
            minWidth: '250px',
            maxWidth: '320px',
            lineHeight: '1.6',
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
              background: 'var(--alpha-black-90)',
            }}
          />
        </div>
      )}
    </div>
  );
}
