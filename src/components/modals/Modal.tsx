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
              marginTop: index === 0 ? '0' : 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-xs)',
              fontSize: 'var(--font-size-sm)',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          >
            <span
              style={{
                color: 'var(--text-secondary)',
                fontWeight: 'var(--font-weight-medium)',
                letterSpacing: 'var(--letter-spacing-normal)',
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
              marginBottom: 'var(--spacing-xxs)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-family-mono)',
              fontSize: 'var(--font-size-sm)',
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
        return <div key={index} style={{ height: 'var(--spacing-sm)' }} />;
      }

      // Check if line is a number (primary color)
      if (/^\d+$/.test(line.trim())) {
        return (
          <div
            key={index}
            style={{
              marginBottom: 'var(--spacing-xxs)',
              color: 'var(--text-primary)',
              fontSize: 'var(--font-size-sm)',
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
            marginBottom: 'var(--spacing-xxs)',
            color: 'var(--text-primary)',
            fontSize: 'var(--font-size-sm)',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            lineHeight: 'var(--line-height-tight)',
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
        background: 'var(--modal-overlay-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 'var(--z-modal)',
        padding: 'var(--spacing-xxl)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--figma-color-bg)',
          borderRadius: 'var(--border-radius-none)',
          padding: 'var(--spacing-xxxl)',
          maxWidth: 'var(--modal-max-width-sm)',
          width: '100%',
          maxHeight: 'var(--modal-max-height)',
          overflowY: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            fontSize: 'var(--font-size-xxl)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-xl)',
            paddingRight: 'var(--spacing-xxxl)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--letter-spacing-normal)',
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: 'var(--font-size-lg)',
            lineHeight: 'var(--line-height-normal)',
          }}
        >
          {formatContent(content)}
        </div>

        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 'var(--spacing-xxl)',
            right: 'var(--spacing-xxl)',
            width: 'var(--icon-size)',
            height: 'var(--icon-size)',
            borderRadius: 'var(--border-radius-full)',
            border: 'none',
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontWeight: 'var(--font-weight-semibold)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-xxxl)',
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
