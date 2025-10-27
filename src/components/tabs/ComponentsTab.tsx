import { h } from 'preact';
import { useState } from 'preact/hooks';
import { VerticalSpace, Textbox } from '@create-figma-plugin/ui';
import { Text } from '../common';
import { ComponentDetailsSection } from '../sections';
import type { ComponentInstanceDetail } from '../../types';

interface LibraryBreakdown {
  name: string;
  count: number;
  percentage: number;
}

interface ComponentsTabProps {
  libraryBreakdown: LibraryBreakdown[];
  componentDetails: ComponentInstanceDetail[];
  collapsedSections: Set<string>;
  ignoredInstances: Set<string>;
  ignoredLibraries: Set<string>;
  onToggleCollapse: (sectionName: string) => void;
  onToggleIgnoreLibrary: (librarySource: string, instanceIds: string[]) => void;
  onToggleIgnoreInstance: (instanceId: string) => void;
  onSelectNode: (nodeId: string) => void;
}

export function ComponentsTab({
  libraryBreakdown,
  componentDetails,
  collapsedSections,
  ignoredInstances,
  ignoredLibraries,
  onToggleCollapse,
  onToggleIgnoreLibrary,
  onToggleIgnoreInstance,
  onSelectNode,
}: ComponentsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter component details based on search query
  const filteredComponents = componentDetails.filter((instance) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      instance.instanceName.toLowerCase().includes(query) ||
      instance.componentName.toLowerCase().includes(query) ||
      instance.librarySource.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <Text
        variant="card-heading"
        as="div"
        style={{ marginBottom: 'var(--card-heading-margin-bottom)' }}
      >
        Component Sources Overview
      </Text>

      {/* Minimal bar charts */}
      {libraryBreakdown && libraryBreakdown.length > 0 && (
        <div style={{ marginBottom: 'var(--spacing-xxl)' }}>
          {libraryBreakdown.map((lib, _index) => {
            return (
              <div key={lib.name} style={{ marginBottom: 'var(--list-item-margin-bottom)' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--list-item-gap)',
                  }}
                >
                  <Text variant="label">{lib.name}</Text>
                  <Text variant="value">{lib.count}</Text>
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
                      width: lib.percentage + '%',
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
        </div>
      )}

      <VerticalSpace space="medium" />

      {/* Component Details Header */}
      <Text
        variant="card-heading"
        as="div"
        style={{ marginBottom: 'var(--card-heading-margin-bottom)' }}
      >
        Component Details
      </Text>

      {/* Search Filter */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <Textbox
          onInput={(e) => setSearchQuery(e.currentTarget.value)}
          placeholder="Search components..."
          value={searchQuery}
        />
        {searchQuery && (
          <Text
            variant="label"
            style={{
              marginTop: 'var(--spacing-xs)',
              color: 'var(--figma-color-text-secondary)',
              fontSize: '10px',
            }}
          >
            {filteredComponents.length} of {componentDetails.length} component
            {componentDetails.length === 1 ? '' : 's'}
          </Text>
        )}
      </div>

      <ComponentDetailsSection
        componentDetails={filteredComponents}
        collapsedSections={collapsedSections}
        ignoredInstances={ignoredInstances}
        ignoredLibraries={ignoredLibraries}
        onToggleCollapse={onToggleCollapse}
        onToggleIgnoreLibrary={onToggleIgnoreLibrary}
        onToggleIgnoreInstance={onToggleIgnoreInstance}
        onSelectNode={onSelectNode}
      />
    </div>
  );
}
