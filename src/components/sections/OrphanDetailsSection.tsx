import { h, Fragment } from 'preact';
import { IconChevronDown16, IconChevronRight16 } from '@create-figma-plugin/ui';
import { Checkbox } from '../common';
import { eyeIcon } from '../../icons';
import { isOrphanIgnoredEverywhere, isOrphanIgnoredInComponent } from '../../utils/orphanHelpers';
import type { OrphanDetail } from '../../types';

interface OrphanDetailsSectionProps {
  orphanDetails: OrphanDetail[];
  collapsedSections: Set<string>;
  ignoredOrphans: Set<string>;
  categoryColors: { [key: string]: string };
  onToggleCollapse: (sectionName: string) => void;
  onToggleIgnoreOrphanEverywhere: (orphanNodeId: string, componentIds: string[]) => void;
  onToggleIgnoreOrphanInComponent: (orphanNodeId: string, componentId: string) => void;
  onSelectNode: (nodeId: string) => void;
}

export function OrphanDetailsSection({
  orphanDetails,
  collapsedSections,
  ignoredOrphans,
  categoryColors,
  onToggleCollapse,
  onToggleIgnoreOrphanEverywhere,
  onToggleIgnoreOrphanInComponent,
  onSelectNode,
}: OrphanDetailsSectionProps) {
  if (!orphanDetails || orphanDetails.length === 0) return null;

  // Group by unique orphan nodeId, tracking which components contain each orphan
  const orphanGroups = new Map<
    string,
    {
      orphan: OrphanDetail;
      components: Array<{ id: string; name: string }>;
    }
  >();

  orphanDetails.forEach((detail) => {
    if (!orphanGroups.has(detail.nodeId)) {
      orphanGroups.set(detail.nodeId, {
        orphan: detail,
        components: [],
      });
    }
    const group = orphanGroups.get(detail.nodeId)!;
    // Only add component if not already in the list
    if (!group.components.some((c) => c.id === detail.parentComponentId)) {
      group.components.push({
        id: detail.parentComponentId,
        name: detail.parentComponentName,
      });
    }
  });

  return (
    <Fragment>
      {Array.from(orphanGroups.values()).map((group) => {
        const componentIds = group.components.map((c) => c.id);
        const isIgnoredEverywhere = isOrphanIgnoredEverywhere(
          group.orphan.nodeId,
          componentIds,
          ignoredOrphans
        );
        const orphanOpacity = isIgnoredEverywhere ? 0.4 : 1;
        const isCollapsed = collapsedSections.has(`orphan-${group.orphan.nodeId}`);
        const color = categoryColors[group.orphan.category] || '#666';

        return (
          <div key={group.orphan.nodeId} style={{ marginBottom: '16px' }}>
            {/* Orphan header with "Ignore All" checkbox */}
            <div
              style={{
                padding: '8px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderBottom: !isCollapsed ? '1px solid var(--figma-color-border)' : 'none',
              }}
            >
              <div
                style={{
                  flex: 1,
                  cursor: 'pointer',
                  opacity: orphanOpacity,
                  minWidth: 0,
                }}
                onClick={() => onToggleCollapse(`orphan-${group.orphan.nodeId}`)}
              >
                <div
                  style={{
                    fontWeight: 600,
                    color: 'var(--figma-color-text)',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    textTransform: 'uppercase',
                    textDecoration: isIgnoredEverywhere ? 'line-through' : 'none',
                    overflow: 'hidden',
                  }}
                >
                  {isCollapsed ? <IconChevronRight16 /> : <IconChevronDown16 />}
                  <span
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {group.orphan.nodeName}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    color: 'var(--figma-color-text-secondary)',
                    marginTop: '2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span
                    style={{
                      textTransform: 'uppercase',
                      fontSize: '9px',
                      color: 'var(--figma-color-text-tertiary)',
                    }}
                  >
                    TYPE:
                  </span>{' '}
                  <span style={{ textTransform: 'capitalize' }}>
                    {group.orphan.nodeType.toLowerCase()}
                  </span>
                  {' • '}
                  <span
                    style={{
                      textTransform: 'uppercase',
                      fontSize: '9px',
                      color: 'var(--figma-color-text-tertiary)',
                    }}
                  >
                    HARDCODED:
                  </span>{' '}
                  {group.orphan.properties.map((prop, i) => (
                    <span key={i}>
                      <span style={{ color, fontWeight: 500 }}>{prop}</span>
                      {i < group.orphan.properties.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexShrink: 0,
                }}
              >
                <Checkbox
                  checked={isIgnoredEverywhere}
                  onChange={() => onToggleIgnoreOrphanEverywhere(group.orphan.nodeId, componentIds)}
                />
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: '500',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleIgnoreOrphanEverywhere(group.orphan.nodeId, componentIds);
                  }}
                >
                  Ignore All
                </span>
              </div>
            </div>

            {/* Expanded: Show each component as a selectable child */}
            {!isCollapsed && (
              <div style={{ paddingTop: '8px' }}>
                {group.components.map((comp) => {
                  const isIgnoredInThisComponent = isOrphanIgnoredInComponent(
                    group.orphan.nodeId,
                    comp.id,
                    ignoredOrphans
                  );
                  const componentOpacity = isIgnoredInThisComponent ? 0.4 : 1;

                  return (
                    <div
                      key={comp.id}
                      style={{
                        paddingLeft: '0px',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                        fontSize: '10px',
                        borderBottom: '1px solid var(--figma-color-border)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '4px',
                        }}
                      >
                        <Checkbox
                          checked={isIgnoredInThisComponent}
                          onChange={() =>
                            onToggleIgnoreOrphanInComponent(group.orphan.nodeId, comp.id)
                          }
                        />
                        <div style={{ flex: 1, opacity: componentOpacity }}>
                          <div
                            style={{
                              fontWeight: 600,
                              color: 'var(--figma-color-text)',
                              marginBottom: '2px',
                              textDecoration: isIgnoredInThisComponent ? 'line-through' : 'none',
                            }}
                          >
                            {comp.name}
                          </div>
                          <div
                            style={{
                              fontSize: '9px',
                              color: 'var(--figma-color-text-secondary)',
                            }}
                          >
                            <span
                              style={{
                                color: 'var(--figma-color-text-tertiary)',
                              }}
                            >
                              Component variant
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => onSelectNode(group.orphan.nodeId)}
                          title="View in canvas"
                          style={{
                            width: '20px',
                            height: '20px',
                            padding: '0',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            border: 'none',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--figma-color-bg-hover)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          {eyeIcon}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </Fragment>
  );
}
