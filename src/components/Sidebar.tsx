import { REPORT, asset } from '../lib/data';
import { NAV } from '../lib/nav';
import { go } from '../lib/router';
import { toggleTheme } from '../lib/theme';
import type { RouteId } from '../lib/types';
import { useUi } from '../lib/ui';
import { Icon } from './Icon';
import { RichText } from './RichText';

export function Sidebar({ route, open, onNavigate }: { route: RouteId; open: boolean; onNavigate: () => void }) {
  const ui = useUi();
  const { meta } = REPORT;
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
  return (
    <aside id="sidebar" className={open ? 'open' : ''}>
      <div className="side-brand">
        <div className="side-brand-row">
          <img src={asset(meta.brandImages.monogram)} alt={meta.publisher} />
          <div className="wm">{meta.publisher}<span>{meta.publisherTagline}</span></div>
        </div>
        <div className="side-dna">
          <img src={asset(meta.brandImages.productLogo)} alt="" />
          <div className="tt">{meta.title}<span>{meta.edition}</span></div>
        </div>
      </div>
      <div className="side-search">
        <button onClick={ui.openSearch}>
          <Icon name="search" size={14} strokeWidth={2} /> Search developers, zones, data…<kbd style={{ whiteSpace: 'nowrap' }}>{isMac ? '⌘K' : 'Ctrl K'}</kbd>
        </button>
      </div>
      <nav id="sidenav">
        {NAV.map((g) => (
          <div key={g.grp} style={{ display: 'contents' }}>
            <div className="nav-grp-label">{g.grp}</div>
            {g.items.map((it) => (
              <button
                key={it.id}
                className={`nav-item${route === it.id ? ' active' : ''}`}
                onClick={() => { go(it.id); onNavigate(); }}
              >
                <Icon name={it.icon} />
                <span>{it.label}</span>
                {it.ct ? <span className="ct">{it.ct}</span> : null}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="side-foot">
        <div className="side-foot-row">
          <button className="sfbtn" onClick={ui.openNotes}><Icon name="notes" size={14} strokeWidth={2} />Notes</button>
          <button className="sfbtn" onClick={toggleTheme}><Icon name="sun" size={14} strokeWidth={2} />Theme</button>
        </div>
        <div className="side-meta mono"><RichText text={meta.footer} /></div>
      </div>
    </aside>
  );
}

export function Topbar({ crumb, onMenu }: { crumb: string; onMenu: () => void }) {
  return (
    <div id="topbar">
      <button className="tbtn icon-only" id="menuBtn" onClick={onMenu} aria-label="Menu"><Icon name="menu" size={16} strokeWidth={2} /></button>
      <button className="tbtn icon-only" title="Back to Executive Overview" onClick={() => go('overview')}><Icon name="home" size={15} strokeWidth={2} /></button>
      <div className="crumbs"><b>{crumb}</b></div>
      <div className="spacer" />
      <button className="tbtn" onClick={() => go('compare')}><Icon name="compare" size={14} strokeWidth={2} />Compare</button>
      <button className="tbtn icon-only" title="Print / Export PDF" onClick={() => window.print()}><Icon name="print" size={14} strokeWidth={2} /></button>
    </div>
  );
}
