import { h } from 'preact';

interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  activeValue: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  activeValue,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div
      style={{
        background: 'var(--tab-container-bg, #242424)',
        padding: '0',
        borderRadius: '4px',
        marginTop: '32px',
        display: 'flex',
        gap: '0',
        marginBottom: '24px',
      }}
    >
      {options.map((option) => {
        const isActive = activeValue === option.value;

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            style={{
              flex: 1,
              padding: '10px 16px',
              background: isActive ? 'var(--button-bg)' : 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: '400',
              letterSpacing: '0.4px',
              color: isActive
                ? 'var(--button-text)'
                : 'var(--tab-inactive-text)',
              fontFamily: 'inherit',
              outline: 'none',
              transition: 'all 0.15s',
              boxShadow: 'none',
              opacity: 1,
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.opacity = '0.7';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
