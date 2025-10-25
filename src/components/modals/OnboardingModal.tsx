import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { HelpContent } from './HelpContent';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
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
          maxWidth: '480px',
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            fontSize: '13px',
            fontWeight: '700',
            color: 'var(--figma-color-text)',
            marginBottom: '20px',
            paddingRight: '24px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Design System Coverage
        </div>

        {/* Content */}
        <HelpContent />

        {/* Get Started Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            height: '40px',
            marginTop: '24px',
            background: 'var(--button-bg)',
            color: 'var(--button-text)',
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '600',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Get Started
        </button>

        {/* Close button */}
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
