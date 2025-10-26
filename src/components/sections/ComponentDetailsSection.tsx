import { h, Fragment } from 'preact';
import { IconChevronDown16, IconChevronRight16 } from '@create-figma-plugin/ui';
import { Checkbox, IconButton } from '../common';
import { eyeIcon } from '../../icons';
import { TOOLTIP_TEXT } from '../../content';
import type { ComponentInstanceDetail } from '../../types';

interface ComponentDetailsSectionProps {
  componentDetails: ComponentInstanceDetail[];
  collapsedSections: Set<string>;
  ignoredInstances: Set<string>;
  ignoredLibraries: Set<string>;
  onToggleCollapse: (sectionName: string) => void;
  onToggleIgnoreLibrary: (librarySource: string, instanceIds: string[]) => void;
  onToggleIgnoreInstance: (instanceId: string) => void;
  onSelectNode: (nodeId: string) => void;
}

export function ComponentDetailsSection({
  componentDetails,
  collapsedSections,
  ignoredInstances,
  ignoredLibraries,
  onToggleCollapse,
  onToggleIgnoreLibrary,
  onToggleIgnoreInstance,
  onSelectNode,
}: ComponentDetailsSectionProps) {
  if (!componentDetails || componentDetails.length === 0) return null;

  // Group instances by library source
  const instancesByLibrary = new Map<string, ComponentInstanceDetail[]>();

  componentDetails.forEach((instance) => {
    const source = instance.librarySource;
    if (!instancesByLibrary.has(source)) {
      instancesByLibrary.set(source, []);
    }
    instancesByLibrary.get(source)!.push(instance);
  });

  return (
    <Fragment>
      {Array.from(instancesByLibrary.entries()).map(([librarySource, instances]) => {
        const isWrapper =
          librarySource.includes('Wrapper') || librarySource.includes('Local (built with DS)');
        const isCollapsed = collapsedSections.has(librarySource);

        const instanceIds = instances.map((i) => i.instanceId);
        // Check if library is ignored OR if all instances are manually ignored
        const allInstancesIgnored =
          !isWrapper &&
          instanceIds.length > 0 &&
          instanceIds.every((id) => ignoredInstances.has(id));
        const isLibraryIgnored = ignoredLibraries.has(librarySource) || allInstancesIgnored;

        return (
          <div key={librarySource} style={{ marginBottom: '16px' }}>
            <div
              style={{
                padding: '8px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                borderBottom: !isCollapsed ? '1px solid var(--figma-color-border)' : 'none',
              }}
            >
              <div
                style={{
                  flex: 1,
                  cursor: 'pointer',
                  opacity: isLibraryIgnored ? 0.5 : 1,
                  minWidth: 0,
                }}
                onClick={() => onToggleCollapse(librarySource)}
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
                    textDecoration: isLibraryIgnored ? 'line-through' : 'none',
                  }}
                >
                  {isCollapsed ? <IconChevronRight16 /> : <IconChevronDown16 />}
                  {librarySource}
                  {isWrapper && (
                    <span
                      style={{
                        fontSize: '9px',
                        color: 'var(--figma-color-text-tertiary)',
                        fontWeight: 400,
                        textTransform: 'lowercase',
                      }}
                    >
                      (excluded from metrics)
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    color: 'var(--figma-color-text-secondary)',
                    marginTop: '2px',
                  }}
                >
                  {instances.length} instance{instances.length > 1 ? 's' : ''}
                </div>
              </div>
              {!isWrapper && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexShrink: 0,
                  }}
                >
                  <Checkbox
                    checked={isLibraryIgnored}
                    onChange={() => onToggleIgnoreLibrary(librarySource, instanceIds)}
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
                      onToggleIgnoreLibrary(librarySource, instanceIds);
                    }}
                  >
                    Ignore All
                  </span>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <div style={{ paddingTop: '8px' }}>
                {instances.map((instance) => {
                  const isIgnored = ignoredInstances.has(instance.instanceId);
                  const instanceOpacity = isIgnored ? 0.4 : 1;

                  return (
                    <div
                      key={instance.instanceId}
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
                        {!isWrapper && (
                          <Checkbox
                            checked={isIgnored}
                            onChange={() => onToggleIgnoreInstance(instance.instanceId)}
                          />
                        )}
                        <div style={{ flex: 1, opacity: instanceOpacity }}>
                          <div
                            style={{
                              fontWeight: 600,
                              color: 'var(--figma-color-text)',
                              marginBottom: '2px',
                              textDecoration: isIgnored ? 'line-through' : 'none',
                            }}
                          >
                            {instance.instanceName}
                          </div>
                          <div
                            style={{
                              color: 'var(--figma-color-text-secondary)',
                              fontSize: '9px',
                            }}
                          >
                            <span
                              style={{
                                color: 'var(--figma-color-text-tertiary)',
                              }}
                            >
                              Component:
                            </span>{' '}
                            {instance.componentName}
                          </div>
                        </div>
                        <IconButton
                          size="sm"
                          onClick={() => onSelectNode(instance.instanceId)}
                          title={TOOLTIP_TEXT.VIEW_IN_CANVAS}
                        >
                          {eyeIcon}
                        </IconButton>
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
