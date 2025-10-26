import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { HelpContent } from './HelpContent';
import { Button } from '../common';

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
          maxWidth: 'var(--modal-max-width-lg)',
          width: '100%',
          maxHeight: 'var(--modal-max-height)',
          overflowY: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-xxl)',
            paddingRight: 'var(--spacing-xxxl)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--letter-spacing-wide)',
          }}
        >
          Design System Coverage
        </div>

        {/* Content */}
        <HelpContent />

        {/* Get Started Button */}
        <Button onClick={onClose} fullWidth style={{ marginTop: 'var(--spacing-xxxl)' }}>
          Get Started
        </Button>

        {/* Close button */}
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
