import { h, Fragment } from 'preact';
import { VerticalSpace } from '@create-figma-plugin/ui';
import { Text } from '../common';
import { OrphanDetailsSection } from '../sections';
import type { OrphanDetail } from '../../types';

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
  orphanDetails: OrphanDetail[];
  collapsedSections: Set<string>;
  ignoredOrphans: Set<string>;
  categoryColors: { [key: string]: string };
  onToggleCollapse: (sectionName: string) => void;
  onToggleIgnoreOrphanEverywhere: (orphanNodeId: string, componentIds: string[]) => void;
  onToggleIgnoreOrphanInComponent: (orphanNodeId: string, componentId: string) => void;
  onSelectNode: (nodeId: string) => void;
}

export function TokensTab({
  hardcodedValues,
  orphanDetails,
  collapsedSections,
  ignoredOrphans,
  categoryColors,
  onToggleCollapse,
  onToggleIgnoreOrphanEverywhere,
  onToggleIgnoreOrphanInComponent,
  onSelectNode,
}: TokensTabProps) {
  return (
    <div>
      {/* Hardcoded Values Breakdown */}
      <Text
        variant="card-heading"
        as="div"
        style={{ marginBottom: 'var(--card-heading-margin-bottom)' }}
      >
        Hardcoded by Type
      </Text>
      {hardcodedValues && hardcodedValues.totalHardcoded > 0 ? (
        <Fragment>
          {[
            { label: 'Colors', count: hardcodedValues.colors },
            { label: 'Typography', count: hardcodedValues.typography },
            { label: 'Spacing', count: hardcodedValues.spacing },
            { label: 'Radius', count: hardcodedValues.radius },
          ]
            .filter((item) => item.count > 0)
            .map((item, _index) => {
              const percentage =
                hardcodedValues.totalHardcoded > 0
                  ? (item.count / hardcodedValues.totalHardcoded) * 100
                  : 0;

              return (
                <div key={item.label} style={{ marginBottom: 'var(--list-item-margin-bottom)' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 'var(--list-item-gap)',
                    }}
                  >
                    <Text variant="label">{item.label}</Text>
                    <Text variant="value">{item.count}</Text>
                  </div>
                  <div
                    style={{
                      height: 'var(--progress-bar-height)',
                      width: '100%',
                      background: 'var(--track-bg-tab)',
                      borderRadius: 'var(--progress-bar-border-radius)',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: percentage + '%',
                        background: 'var(--progress-fill)',
                        borderRadius: 'var(--progress-bar-border-radius)',
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
            color: 'var(--text-tertiary)',
            fontSize: 'var(--font-size-md)',
            marginBottom: 'var(--spacing-xl)',
          }}
        >
          No hardcoded values detected
        </Text>
      )}

      <VerticalSpace space="medium" />

      {/* Orphan Details */}
      <Text
        variant="card-heading"
        as="div"
        style={{ marginBottom: 'var(--card-heading-margin-bottom)' }}
      >
        Orphan Details by Component
      </Text>
      {orphanDetails && orphanDetails.length > 0 ? (
        <div>
          <OrphanDetailsSection
            orphanDetails={orphanDetails}
            collapsedSections={collapsedSections}
            ignoredOrphans={ignoredOrphans}
            categoryColors={categoryColors}
            onToggleCollapse={onToggleCollapse}
            onToggleIgnoreOrphanEverywhere={onToggleIgnoreOrphanEverywhere}
            onToggleIgnoreOrphanInComponent={onToggleIgnoreOrphanInComponent}
            onSelectNode={onSelectNode}
          />
        </div>
      ) : (
        <div
          style={{
            padding: 'var(--spacing-xxxxl)',
            textAlign: 'center',
            background: 'var(--figma-color-bg)',
            borderRadius: 'var(--border-radius-sm)',
            border: '1px solid var(--figma-color-border)',
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: 'var(--spacing-lg)' }}>🎉</div>
          <Text
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-xxs)',
            }}
          >
            No Orphans Found
          </Text>
          <Text
            style={{
              fontSize: 'var(--font-size-md)',
              color: 'var(--text-tertiary)',
            }}
          >
            All properties are using design tokens
          </Text>
        </div>
      )}
    </div>
  );
}
