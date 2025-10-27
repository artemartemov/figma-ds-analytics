import { h, Fragment } from 'preact';
import { Banner } from '@create-figma-plugin/ui';
import { Button } from '../common';
import { OnboardingModal, HelpModal } from '../modals';
import { HELP_MODALS } from '../../content';
import { themeStyles } from '../../styles/theme';

interface ErrorStateProps {
  error: string;
  hasSelection: boolean;
  showOnboarding: boolean;
  showHelpModal: boolean;
  showHelpTooltip: boolean;
  onAnalyze: () => void;
  onCloseOnboarding: () => void;
  onCloseHelpModal: () => void;
  onShowHelpModal: (content: any) => void;
  onShowHelpTooltip: (show: boolean) => void;
}

export function ErrorState({
  error,
  hasSelection,
  showOnboarding,
  showHelpModal,
  showHelpTooltip,
  onAnalyze,
  onCloseOnboarding,
  onCloseHelpModal,
  onShowHelpModal,
  onShowHelpTooltip,
}: ErrorStateProps) {
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
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div style={{ width: '100%', maxWidth: '320px' }}>
            <Banner icon="warning" variant="warning">
              {error}
            </Banner>
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
            onClick={onAnalyze}
            disabled={!hasSelection}
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

      {/* Help Modal */}
      <HelpModal isOpen={showHelpModal} onClose={onCloseHelpModal} />
    </Fragment>
  );
}
