import { h } from 'preact';
import { useEffect } from 'preact/hooks';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export function Modal({ isOpen, onClose, title, content }: ModalProps) {
  if (!isOpen) return null;

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Parse and format content with styling
  const formatContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Check if line is all caps (this is a label)
      if (
        line === line.toUpperCase() &&
        line.trim() !== '' &&
        line.length < 80 &&
        /^[A-Z\s\(\)\-\/]+$/.test(line)
      ) {
        return (
          <div
            key={index}
            style={{
              marginTop: index === 0 ? '0' : '12px',
              marginBottom: '6px',
              fontSize: '10px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          >
            <span
              style={{
                color: 'var(--text-secondary)',
                fontWeight: '500',
                letterSpacing: '0.05em',
              }}
            >
              {line}
            </span>
          </div>
        );
      }

      // Check if line is a calculation (contains ×, ÷, or =)
      if (line.includes('×') || line.includes('÷') || line.includes('=')) {
        return (
          <div
            key={index}
            style={{
              marginBottom: '4px',
              color: 'var(--text-primary)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {line}
          </div>
        );
      }

      // Empty lines
      if (line.trim() === '') {
        return (
          <div
            key={index}
            style={{ height: '8px' }}
          />
        );
      }

      // Check if line is a number (primary color)
      if (/^\d+$/.test(line.trim())) {
        return (
          <div
            key={index}
            style={{
              marginBottom: '4px',
              color: 'var(--text-primary)',
              fontSize: '10px',
              whiteSpace: 'nowrap',
            }}
          >
            {line}
          </div>
        );
      }

      // Regular text - default to wrapping and primary color
      return (
        <div
          key={index}
          style={{
            marginBottom: '4px',
            color: 'var(--text-primary)',
            fontSize: '10px',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            lineHeight: '1.5',
          }}
        >
          {line}
        </div>
      );
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--figma-color-bg)',
          borderRadius: '0',
          padding: '24px',
          maxWidth: '400px',
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '16px',
            paddingRight: '24px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: '12px',
            lineHeight: '1.6',
          }}
        >
          {formatContent(content)}
        </div>

        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            border: 'none',
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
