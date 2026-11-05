import { useEffect, useMemo, useRef, useState } from 'react';
import { DEVS, FINDINGS, ZONES, asset } from '../lib/data';
import { NAV } from '../lib/nav';
import { go } from '../lib/router';
import { useUi } from '../lib/ui';
import { Icon } from './Icon';
import { FindingDetail } from './FindingDetail';

interface Item { ty: string; t: string; s?: string; logo?: string; run: () => void }

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const ui = useUi();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const index = useMemo<Item[]>(() => [
    ...NAV.flatMap((g) => g.items).map((it) => ({ ty: 'Section', t: it.label, run: () => go(it.id) })),
    ...DEVS.map((d) => ({ ty: 'Developer', t: d.name, s: d.zone.name, logo: d.logo, run: () => go('explorer', d.id) })),
    ...ZONES.map((z) => ({ ty: 'Zone', t: z.name, s: 'Positioning Index zone', run: () => go('index', z.id) })),
    ...FINDINGS.map((f) => ({ ty: 'Finding', t: f.headline, s: f.theme, run: () => ui.openDrawer(f.theme, <FindingDetail finding={f} />) })),
    { ty: 'Action', t: 'Report notes & data checks', run: ui.openNotes },
    { ty: 'Action', t: 'Compare developers', run: () => go('compare') },
  ], [ui]);

  // Filter, then group by type; `flat` is the visual order used for keyboard navigation.
  const { groups, flat } = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const filtered = !ql ? index.slice(0, 40) : index.filter((i) => `${i.t} ${i.s ?? ''}`.toLowerCase().includes(ql));
    const byType = new Map<string, Item[]>();
    filtered.forEach((i) => byType.set(i.ty, [...(byType.get(i.ty) ?? []), i]));
    return { groups: [...byType.entries()], flat: [...byType.values()].flat() };
  }, [q, index]);

  useEffect(() => setSel(0), [q]);
  useEffect(() => {
    listRef.current?.querySelector('.cmdk-item.sel')?.scrollIntoView({ block: 'nearest' });
  }, [sel]);

  const choose = (item: Item | undefined) => { if (!item) return; onClose(); item.run(); };

  let n = -1;
  return (
    <div className="cmdk-wrap" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="cmdk" role="dialog" aria-label="Search">
        <div className="cmdk-in">
          <Icon name="search" size={17} strokeWidth={2} />
          <input
            autoFocus value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search developers, zones, sections…" autoComplete="off"
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, flat.length - 1)); }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
              else if (e.key === 'Enter') { e.preventDefault(); choose(flat[sel]); }
              else if (e.key === 'Escape') onClose();
            }}
          />
        </div>
        <div className="cmdk-list" ref={listRef}>
          {flat.length === 0 && (
            <div style={{ padding: 30, textAlign: 'center', color: 'var(--faint)', fontSize: 13 }}>No matches</div>
          )}
          {groups.map(([ty, items]) => (
            <div key={ty}>
              <div className="cmdk-grp">{ty}</div>
              {items.map((i) => {
                n += 1;
                const idx = n;
                return (
                  <div key={`${ty}-${i.t}`} className={`cmdk-item${idx === sel ? ' sel' : ''}`} onClick={() => choose(i)} onMouseMove={() => setSel(idx)}>
                    {i.logo ? <img src={asset(i.logo)} alt="" /> : <span className="mono-av" style={{ display: 'inline-block' }} />}
                    <span className="main">{i.t}{i.s && <span className="s">{i.s}</span>}</span>
                    <span className="ty">{i.ty}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="cmdk-foot">
          <span><kbd>↑↓</kbd> navigate</span><span><kbd>↵</kbd> select</span><span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
