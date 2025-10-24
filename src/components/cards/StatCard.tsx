import { h } from 'preact';
import { Tooltip, DonutChart } from '../common';

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
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: 'var(--text-primary)',
              fontWeight: '500',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </div>
          <Tooltip position="bottom" content={tooltipContent} />
        </div>
      </div>

      {/* Card content */}
      <div
        style={{
          background: 'var(--card-bg)',
          padding: '20px',
          borderRadius: '4px',
          border: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        {/* Progress bars */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
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
                marginBottom: '6px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    fontWeight: '500',
                  }}
                >
                  {tokensLabel}
                </span>
              </div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  fontFeatureSettings: '"tnum"',
                  color: 'var(--text-tertiary)',
                }}
              >
                {formatPercent(tokensValue)}
              </div>
            </div>
            <div
              style={{
                height: '2px',
                width: '100%',
                background: 'var(--track-bg-card)',
                borderRadius: '4px',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${tokensValue}%`,
                  background: 'var(--progress-fill)',
                  borderRadius: '4px',
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
                marginBottom: '6px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    fontWeight: '500',
                  }}
                >
                  {componentsLabel}
                </span>
              </div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  fontFeatureSettings: '"tnum"',
                  color: 'var(--text-tertiary)',
                }}
              >
                {formatPercent(componentsValue)}
              </div>
            </div>
            <div
              style={{
                height: '2px',
                width: '100%',
                background: 'var(--track-bg-card)',
                borderRadius: '4px',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${componentsValue}%`,
                  background: 'var(--progress-fill)',
                  borderRadius: '4px',
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
