'use client';

import React, { useEffect, useState } from 'react';

export type SyllabusView = 'graph' | 'list';

const STORAGE_KEY = 'syllabusView';
const DEFAULT_VIEW: SyllabusView = 'graph';

const isView = (value: unknown): value is SyllabusView =>
  value === 'graph' || value === 'list';

interface Props {
  theme: 'marketer' | 'terminal';
  graph: React.ReactNode;
  list: React.ReactNode;
}

/**
 * Graph/list switch for the syllabus.
 *
 * Both views stay mounted and the inactive one is hidden with CSS rather than
 * unmounted, for two reasons: the prerendered HTML always contains the full
 * reading list whichever view is showing, so crawlers and no-JS readers are
 * never served only the graph; and switching back does not reload 22 covers.
 * The hidden view is marked `inert` and `aria-hidden` so assistive technology
 * is offered exactly one copy of the syllabus, not two.
 */
export default function SyllabusViewSwitch({ theme, graph, list }: Props) {
  const [view, setView] = useState<SyllabusView>(DEFAULT_VIEW);

  // The URL wins over the stored preference, so a shared ?view=list link opens
  // in the view it promises.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('view');
    if (isView(fromUrl)) {
      setView(fromUrl);
      return;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (isView(stored)) setView(stored);
    } catch {
      // Private browsing and blocked storage both land here; the default holds.
    }
  }, []);

  const choose = (next: SyllabusView) => {
    setView(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Preference simply will not persist; the view still switches.
    }
    const url = new URL(window.location.href);
    if (next === DEFAULT_VIEW) {
      url.searchParams.delete('view');
    } else {
      url.searchParams.set('view', next);
    }
    window.history.replaceState(null, '', url);
  };

  const marketer = theme === 'marketer';
  const activeStyle = marketer
    ? { background: '#0052CC', color: '#FFFFFF', borderColor: '#0052CC' }
    : { background: '#8b0000', color: '#f5f5dc', borderColor: '#8b0000' };
  const idleStyle = marketer
    ? { background: '#FFFFFF', color: '#6B778C', borderColor: '#C1C7D0' }
    : { background: '#f0f0e0', color: '#666666', borderColor: '#b8b8a8' };

  return (
    <div>
      <div
        className="mb-5 inline-flex rounded-md border p-0.5"
        style={{ borderColor: marketer ? '#C1C7D0' : '#b8b8a8' }}
        role="group"
        aria-label="Choose how to browse the syllabus"
      >
        {(['graph', 'list'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => choose(option)}
            aria-pressed={view === option}
            className="rounded px-3 py-1.5 text-sm font-medium capitalize transition-colors"
            style={view === option ? activeStyle : idleStyle}
          >
            {option === 'graph' ? 'Graph view' : 'List view'}
          </button>
        ))}
      </div>

      <div
        className={view === 'graph' ? undefined : 'hidden'}
        aria-hidden={view === 'graph' ? undefined : true}
        inert={view === 'graph' ? undefined : true}
      >
        {graph}
      </div>
      <div
        className={view === 'list' ? undefined : 'hidden'}
        aria-hidden={view === 'list' ? undefined : true}
        inert={view === 'list' ? undefined : true}
      >
        {list}
      </div>
    </div>
  );
}
