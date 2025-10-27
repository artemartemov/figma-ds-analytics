import { h, Fragment } from 'preact';
import { Button, Text } from '../common';
import { OnboardingModal, HelpModal } from '../modals';
import { HELP_MODALS } from '../../content';
import { themeStyles } from '../../styles/theme';

interface LoadingStateProps {
  progress: {
    step: string;
    percent: number;
  };
  showOnboarding: boolean;
  showHelpModal: boolean;
  showHelpTooltip: boolean;
  onCancelAnalysis: () => void;
  onCloseOnboarding: () => void;
  onCloseHelpModal: () => void;
  onShowHelpModal: (content: any) => void;
  onShowHelpTooltip: (show: boolean) => void;
}

export function LoadingState({
  progress,
  showOnboarding,
  showHelpModal,
  showHelpTooltip,
  onCancelAnalysis,
  onCloseOnboarding,
  onCloseHelpModal,
  onShowHelpModal,
  onShowHelpTooltip,
}: LoadingStateProps) {
  return (
    <Fragment>
      <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Header with help button */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '12px',
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
          <div style={{ textAlign: 'left' }}>
            <Text
              variant="heading-subsection"
              as="div"
              style={{
                marginBottom: '16px',
              }}
            >
              {progress.step}
            </Text>
          </div>
          <div
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                flex: 1,
                height: '2px',
                background: 'var(--track-bg-card)',
                borderRadius: '0',
              }}
            >
              <div
                style={{
                  width: progress.percent + '%',
                  height: '100%',
                  background: 'var(--progress-fill)',
                  borderRadius: '0',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
            <Text
              as="div"
              style={{
                position: 'absolute',
                right: '0',
                fontSize: '12px',
                color: 'var(--text-tertiary)',
                textAlign: 'right',
                minWidth: '40px',
                paddingLeft: '12px',
                background: 'var(--figma-color-bg)',
              }}
            >
              {Math.round(progress.percent)}%
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
            padding: '16px 0 0 0',
            background: 'var(--figma-color-bg)',
            zIndex: 100,
          }}
        >
          <Button
            variant="secondary"
            size="xl"
            onClick={onCancelAnalysis}
            fullWidth
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '8px',
              paddingLeft: '20px',
              borderLeft: 0,
              borderRight: 0,
              borderBottom: 0,
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
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            CANCEL
          </Button>
        </div>
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal isOpen={showOnboarding} onClose={onCloseOnboarding} />

      {/* Help Modal */}
      <HelpModal isOpen={showHelpModal} onClose={onCloseHelpModal} />
    </Fragment>
  );
}
