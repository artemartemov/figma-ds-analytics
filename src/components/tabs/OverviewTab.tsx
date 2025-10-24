import { h } from 'preact';

interface OverviewTabProps {
  componentsCount: number;
  designTokensCount: number;
  librariesCount: number;
  orphansCount: number;
}

export function OverviewTab({
  componentsCount,
  designTokensCount,
  librariesCount,
  orphansCount,
}: OverviewTabProps) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px',
        }}
      >
        <p
          style={{
            fontSize: '12px',
            fontWeight: '500',
            color: 'var(--text-primary)',
            textTransform: 'uppercase',
            margin: 0,
            lineHeight: 'normal',
          }}
        >
          Summary
        </p>
      </div>

      {/* Mini summary cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '12px',
          height: '142px',
        }}
      >
        <div
          style={{
            gridArea: '1 / 1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            whiteSpace: 'nowrap',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-tertiary)',
              fontWeight: '400',
              lineHeight: 'normal',
              margin: 0,
            }}
          >
            Components
          </p>
          <p
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              lineHeight: 'normal',
              margin: 0,
              fontFeatureSettings: '"tnum"',
            }}
          >
            {componentsCount}
          </p>
        </div>

        <div
          style={{
            gridArea: '1 / 2',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            whiteSpace: 'nowrap',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-tertiary)',
              fontWeight: '400',
              lineHeight: 'normal',
              margin: 0,
            }}
          >
            Design Tokens
          </p>
          <p
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              lineHeight: 'normal',
              margin: 0,
              fontFeatureSettings: '"tnum"',
            }}
          >
            {designTokensCount}
          </p>
        </div>

        <div
          style={{
            gridArea: '2 / 1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            whiteSpace: 'nowrap',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-tertiary)',
              fontWeight: '400',
              lineHeight: 'normal',
              margin: 0,
            }}
          >
            Libraries
          </p>
          <p
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              lineHeight: 'normal',
              margin: 0,
              fontFeatureSettings: '"tnum"',
            }}
          >
            {librariesCount}
          </p>
        </div>

        <div
          style={{
            gridArea: '2 / 2',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            whiteSpace: 'nowrap',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-tertiary)',
              fontWeight: '400',
              lineHeight: 'normal',
              margin: 0,
            }}
          >
            Orphans
          </p>
          <p
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              lineHeight: 'normal',
              margin: 0,
              fontFeatureSettings: '"tnum"',
            }}
          >
            {orphansCount}
          </p>
        </div>
      </div>
    </div>
  );
}
