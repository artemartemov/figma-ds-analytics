import { h, Fragment } from 'preact';
import { Button, Text } from '../common';
import { OnboardingModal } from '../modals';
import { HELP_MODALS } from '../../content';
import { themeStyles } from '../../styles/theme';

interface EmptyStateProps {
  showOnboarding: boolean;
  showHelpTooltip: boolean;
  onCloseOnboarding: () => void;
  onShowHelpModal: (content: any) => void;
  onShowHelpTooltip: (show: boolean) => void;
}

export function EmptyState({
  showOnboarding,
  showHelpTooltip,
  onCloseOnboarding,
  onShowHelpModal,
  onShowHelpTooltip,
}: EmptyStateProps) {
  return (
    <Fragment>
      <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Header with help button */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 1000,
          }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onShowHelpModal(HELP_MODALS.MAIN);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--figma-color-text)';
              onShowHelpTooltip(true);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#9D9D9D';
              setTimeout(() => {
                onShowHelpTooltip(false);
              }, 100);
            }}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#9D9D9D',
              fontSize: '12px',
              fontFamily: 'var(--font-family-mono)',
              fontWeight: '300',
              cursor: 'pointer',
              padding: '4px',
              transition: 'color 0.2s',
              position: 'relative',
            }}
          >
            ?
            {showHelpTooltip && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '20px',
                  transform: 'translateY(-50%)',
                  background: 'var(--figma-color-bg-inverse)',
                  color: 'var(--figma-color-text-onbrand)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  zIndex: 10000,
                }}
              >
                Help
              </div>
            )}
          </button>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div style={{ textAlign: 'left', maxWidth: '320px' }}>
            <Text
              variant="heading-subsection"
              as="div"
              style={{
                marginBottom: '8px',
              }}
            >
              NO SELECTION
            </Text>
            <Text
              as="div"
              style={{
                fontSize: '12px',
                color: 'var(--text-tertiary)',
                lineHeight: '1.5',
              }}
            >
              Select frames, components, or sections on your canvas to analyze design system
              coverage
            </Text>
          </div>
        </div>

        {/* Fixed button at bottom */}
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '0',
            background: 'var(--figma-color-bg)',
            zIndex: 100,
          }}
        >
          <Button
            size="xl"
            disabled
            fullWidth
            style={{
              borderRadius: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '8px',
              paddingLeft: '20px',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3v18h18" />
              <path d="M18 17V9M13 17V5M8 17v-3" />
            </svg>
            ANALYZE SELECTION
          </Button>
        </div>
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal isOpen={showOnboarding} onClose={onCloseOnboarding} />
    </Fragment>
  );
}
