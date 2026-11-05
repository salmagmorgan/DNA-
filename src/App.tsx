import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { REPORT } from './lib/data';
import { routeLabel } from './lib/nav';
import { useRoute } from './lib/router';
import type { RouteId } from './lib/types';
import { UiContext, type UiApi } from './lib/ui';
import { CommandPalette } from './components/CommandPalette';
import { CustomCursor } from './components/CustomCursor';
import { Drawer } from './components/Drawer';
import { NotesPanel } from './components/NotesPanel';
import { Sidebar, Topbar } from './components/Sidebar';
import { Appendix } from './views/Appendix';
import { Blueprint } from './views/Blueprint';
import { Compare } from './views/Compare';
import { Context } from './views/Context';
import { Explorer } from './views/Explorer';
import { Objectives } from './views/Objectives';
import { Overview } from './views/Overview';
import { PositioningIndex } from './views/PositioningIndex';
import { Regional } from './views/Regional';
import { Takeouts } from './views/Takeouts';

const VIEWS: Record<RouteId, (p: { param: string | null }) => ReactNode> = {
  overview: () => <Overview />,
  objectives: () => <Objectives />,
  context: () => <Context />,
  map: ({ param }) => <Regional param={param} />,
  index: ({ param }) => <PositioningIndex param={param} />,
  explorer: ({ param }) => <Explorer param={param} />,
  blueprint: () => <Blueprint />,
  takeouts: () => <Takeouts />,
  appendix: () => <Appendix />,
  compare: () => <Compare />,
};

export function App() {
  const { route, param } = useRoute();
  const [drawer, setDrawer] = useState<{ open: boolean; title: ReactNode; body: ReactNode }>({ open: false, title: '', body: null });
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeDrawer = useCallback(() => setDrawer((d) => ({ ...d, open: false })), []);
  const ui = useMemo<UiApi>(() => ({
    openDrawer: (title, body) => setDrawer({ open: true, title, body }),
    closeDrawer,
    openSearch: () => setSearchOpen(true),
    openNotes: () => setDrawer({ open: true, title: 'Report notes & data checks', body: <NotesPanel /> }),
  }), [closeDrawer]);

  // ⌘K / Ctrl+K opens search; Esc closes overlays.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true); }
      else if (e.key === 'Escape') { setSearchOpen(false); closeDrawer(); setMenuOpen(false); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeDrawer]);

  // Navigating closes the mobile menu and any open drawer.
  useEffect(() => { setMenuOpen(false); closeDrawer(); }, [route, param, closeDrawer]);

  useEffect(() => {
    document.title = `${routeLabel(route)} · ${REPORT.meta.title} — ${REPORT.meta.publisher}`;
  }, [route]);

  return (
    <UiContext.Provider value={ui}>
      <div id="bg-anim"><span className="b1" /><span className="b2" /><span className="b3" /><span className="b4" /></div>
      <div id="bg-skyline" aria-hidden="true" />
      <CustomCursor />
      <div id="app">
        <Sidebar route={route} open={menuOpen} onNavigate={() => setMenuOpen(false)} />
        <div id="main">
          <Topbar crumb={routeLabel(route)} onMenu={() => setMenuOpen((o) => !o)} />
          <main id="view" key={`${route}/${param ?? ''}`}>
            {VIEWS[route]({ param })}
          </main>
        </div>
      </div>
      {searchOpen && <CommandPalette onClose={() => setSearchOpen(false)} />}
      <Drawer open={drawer.open} title={drawer.title} onClose={closeDrawer}>{drawer.body}</Drawer>
    </UiContext.Provider>
  );
}
