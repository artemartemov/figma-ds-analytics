import { h } from 'preact';
import { Text } from '../common';

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
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--card-heading-margin-bottom)',
        }}
      >
        <Text
          variant="card-heading"
          as="p"
          style={{
            margin: 0,
            lineHeight: 'normal',
          }}
        >
          Summary
        </Text>
      </div>

      {/* Mini summary cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 'var(--spacing-lg)',
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
          <Text
            variant="label"
            as="p"
            style={{
              fontWeight: 'var(--font-weight-normal)',
              lineHeight: 'normal',
              margin: 0,
            }}
          >
            Components
          </Text>
          <Text
            variant="metric-large"
            as="p"
            style={{
              lineHeight: 'normal',
              margin: 0,
            }}
          >
            {componentsCount}
          </Text>
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
          <Text
            variant="label"
            as="p"
            style={{
              fontWeight: 'var(--font-weight-normal)',
              lineHeight: 'normal',
              margin: 0,
            }}
          >
            Design Tokens
          </Text>
          <Text
            variant="metric-large"
            as="p"
            style={{
              lineHeight: 'normal',
              margin: 0,
            }}
          >
            {designTokensCount}
          </Text>
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
          <Text
            variant="label"
            as="p"
            style={{
              fontWeight: 'var(--font-weight-normal)',
              lineHeight: 'normal',
              margin: 0,
            }}
          >
            Libraries
          </Text>
          <Text
            variant="metric-large"
            as="p"
            style={{
              lineHeight: 'normal',
              margin: 0,
            }}
          >
            {librariesCount}
          </Text>
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
          <Text
            variant="label"
            as="p"
            style={{
              fontWeight: 'var(--font-weight-normal)',
              lineHeight: 'normal',
              margin: 0,
            }}
          >
            Orphans
          </Text>
          <Text
            variant="metric-large"
            as="p"
            style={{
              lineHeight: 'normal',
              margin: 0,
            }}
          >
            {orphansCount}
          </Text>
        </div>
      </div>
    </div>
  );
}
