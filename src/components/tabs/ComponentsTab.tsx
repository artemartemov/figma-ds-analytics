import { h, ComponentChild } from 'preact';
import { VerticalSpace } from '@create-figma-plugin/ui';

interface LibraryBreakdown {
  name: string;
  count: number;
  percentage: number;
}

interface ComponentsTabProps {
  libraryBreakdown: LibraryBreakdown[];
  renderComponentDetails: () => ComponentChild;
}

export function ComponentsTab({ libraryBreakdown, renderComponentDetails }: ComponentsTabProps) {
  return (
    <div>
      <div
        style={{
          fontSize: '12px',
          color: 'var(--text-primary)',
          fontWeight: '500',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}
      >
        Component Sources Overview
      </div>

      {/* Minimal bar charts */}
      {libraryBreakdown && libraryBreakdown.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          {libraryBreakdown.map((lib, index) => {
            return (
              <div key={lib.name} style={{ marginBottom: '12px' }}>
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
                    {lib.name}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      fontFeatureSettings: '"tnum"',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {lib.count}
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
                      width: lib.percentage + '%',
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
        </div>
      )}

      <VerticalSpace space="medium" />

      {/* Component Details Header */}
      <div
        style={{
          fontSize: '12px',
          color: 'var(--text-primary)',
          fontWeight: '500',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}
      >
        Component Details
      </div>

      {renderComponentDetails()}
    </div>
  );
}
