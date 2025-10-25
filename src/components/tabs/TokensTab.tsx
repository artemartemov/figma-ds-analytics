import { h, Fragment, ComponentChild } from 'preact';
import { VerticalSpace, Text } from '@create-figma-plugin/ui';

interface HardcodedValues {
  colors: number;
  typography: number;
  spacing: number;
  radius: number;
  borders?: number;
  totalHardcoded: number;
}

interface TokensTabProps {
  hardcodedValues: HardcodedValues;
  hasOrphanDetails: boolean;
  renderOrphanDetails: () => ComponentChild;
}

export function TokensTab({
  hardcodedValues,
  hasOrphanDetails,
  renderOrphanDetails,
}: TokensTabProps) {
  return (
    <div>
      {/* Hardcoded Values Breakdown */}
      <div
        style={{
          fontSize: '12px',
          color: 'var(--text-primary)',
          fontWeight: '500',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}
      >
        Hardcoded by Type
      </div>
      {hardcodedValues && hardcodedValues.totalHardcoded > 0 ? (
        <Fragment>
          {[
            { label: 'Colors', count: hardcodedValues.colors },
            { label: 'Typography', count: hardcodedValues.typography },
            { label: 'Spacing', count: hardcodedValues.spacing },
            { label: 'Radius', count: hardcodedValues.radius },
          ]
            .filter((item) => item.count > 0)
            .map((item, index) => {
              const percentage =
                hardcodedValues.totalHardcoded > 0
                  ? (item.count / hardcodedValues.totalHardcoded) * 100
                  : 0;

              return (
                <div key={item.label} style={{ marginBottom: '12px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '6px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        fontFeatureSettings: '"tnum"',
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      {item.count}
                    </span>
                  </div>
                  <div
                    style={{
                      height: '2px',
                      width: '100%',
                      background: 'var(--track-bg-tab)',
                      borderRadius: '4px',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: percentage + '%',
                        background: 'var(--progress-fill)',
                        borderRadius: '4px',
                        transformOrigin: 'left',
                        animation: 'barGrow 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </Fragment>
      ) : (
        <Text
          style={{
            color: 'var(--figma-color-text-tertiary)',
            fontSize: '11px',
            marginBottom: '16px',
          }}
        >
          No hardcoded values detected
        </Text>
      )}

      <VerticalSpace space="medium" />

      {/* Orphan Details */}
      <div
        style={{
          fontSize: '12px',
          color: 'var(--text-primary)',
          fontWeight: '500',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}
      >
        Orphan Details by Component
      </div>
      {hasOrphanDetails ? (
        <div>{renderOrphanDetails()}</div>
      ) : (
        <div
          style={{
            padding: '32px',
            textAlign: 'center',
            background: 'var(--figma-color-bg)',
            borderRadius: '4px',
            border: '1px solid var(--figma-color-border)',
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎉</div>
          <Text
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--figma-color-text)',
              marginBottom: '4px',
            }}
          >
            No Orphans Found
          </Text>
          <Text
            style={{
              fontSize: '11px',
              color: 'var(--figma-color-text-tertiary)',
            }}
          >
            All properties are using design tokens
          </Text>
        </div>
      )}
    </div>
  );
}
