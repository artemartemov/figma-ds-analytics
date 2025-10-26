import { h } from 'preact';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
}

export function Checkbox({ checked, onChange }: CheckboxProps) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      style={{
        width: '14px',
        height: '14px',
        minWidth: '14px',
        minHeight: '14px',
        borderRadius: '3px',
        background: checked ? 'var(--color-black)' : 'var(--color-gray-200)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {checked && (
        <svg
          width="10"
          height="8"
          viewBox="0 0 10 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 4L3.5 6.5L9 1"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
