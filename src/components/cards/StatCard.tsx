import { h } from 'preact';
import { Tooltip, DonutChart, Text } from '../common';

interface StatCardProps {
  title: string;
  tooltipContent: string;
  tokensLabel: string;
  tokensValue: number;
  componentsLabel: string;
  componentsValue: number;
  donutValue: number;
  donutLabel?: string;
  onDonutClick?: () => void;
}

export function StatCard({
  title,
  tooltipContent,
  tokensLabel,
  tokensValue,
  componentsLabel,
  componentsValue,
  donutValue,
  donutLabel,
  onDonutClick,
}: StatCardProps) {
  const formatPercent = (value: number) => `${Math.round(value)}%`;

  return (
    <div>
      {/* Title with tooltip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--card-heading-margin-bottom)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
          }}
        >
          <Text variant="card-heading">{title}</Text>
          <Tooltip position="bottom" content={tooltipContent} />
        </div>
      </div>

      {/* Card content */}
      <div
        style={{
          background: 'var(--card-bg)',
          padding: 'var(--card-padding)',
          borderRadius: 'var(--card-border-radius)',
          border: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--card-gap)',
        }}
      >
        {/* Progress bars */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--progress-bar-gap)',
            justifyContent: 'center',
          }}
        >
          {/* First bar (Tokens) */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--section-label-margin-bottom)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                }}
              >
                <Text variant="label">{tokensLabel}</Text>
              </div>
              <Text variant="value">{formatPercent(tokensValue)}</Text>
            </div>
            <div
              style={{
                height: 'var(--progress-bar-height)',
                width: '100%',
                background: 'var(--track-bg-card)',
                borderRadius: 'var(--progress-bar-border-radius)',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${tokensValue}%`,
                  background: 'var(--progress-fill)',
                  borderRadius: 'var(--progress-bar-border-radius)',
                  transformOrigin: 'left',
                  animation: 'barGrow 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                }}
              />
            </div>
          </div>

          {/* Second bar (Components) */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--section-label-margin-bottom)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                }}
              >
                <Text variant="label">{componentsLabel}</Text>
              </div>
              <Text variant="value">{formatPercent(componentsValue)}</Text>
            </div>
            <div
              style={{
                height: 'var(--progress-bar-height)',
                width: '100%',
                background: 'var(--track-bg-card)',
                borderRadius: 'var(--progress-bar-border-radius)',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${componentsValue}%`,
                  background: 'var(--progress-fill)',
                  borderRadius: 'var(--progress-bar-border-radius)',
                  transformOrigin: 'left',
                  animation: 'barGrow 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                  animationDelay: '0.1s',
                }}
              />
            </div>
          </div>
        </div>

        {/* Donut chart */}
        <div style={{ flexShrink: 0 }}>
          <DonutChart
            segments={[
              {
                value: donutValue,
                color: 'var(--progress-fill)',
              },
              {
                value: 100 - donutValue,
                color: 'var(--track-bg-card)',
              },
            ]}
            centerValue={formatPercent(donutValue)}
            centerLabel={donutLabel}
            onClick={onDonutClick}
          />
        </div>
      </div>
    </div>
  );
}
