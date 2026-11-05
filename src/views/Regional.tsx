/* Regional Scope — per-region awareness stack + selection funnel, with
   cross-chart developer highlighting, and a sortable all-region comparison. */
import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import { MODELS, REGIONS, REPORT, devById } from '../lib/data';
import { go } from '../lib/router';
import type { Region, RegionId } from '../lib/types';
import { DevLogo, PageHead } from '../components/dev';
import { Icon } from '../components/Icon';
import { RichText } from '../components/RichText';

const REGION_IDS = Object.keys(REGIONS) as RegionId[];
const HEALTHY_TIER = MODELS.funnelTiers[0].t;
const WEAK_TIER = MODELS.funnelTiers[MODELS.funnelTiers.length - 1].t;
const ACTIVE_BTN = { background: 'var(--indigo)', color: '#fff', borderColor: 'var(--indigo)' };

/** Shared selection behaviour: clicking a logo opens the profile; anything else toggles the highlight. */
function useSelection() {
  const [selected, setSelected] = useState<string | null>(null);
  const onDev = (id: string) => (e: MouseEvent) => {
    if ((e.target as Element).closest('.devlogo')) { go('explorer', id); return; }
    setSelected((s) => (s === id ? null : id));
  };
  const hl = (id: string) => (selected === id ? ' hl-connected' : '');
  return { selected, setSelected, onDev, hl };
}
type Sel = ReturnType<typeof useSelection>;

export function Regional({ param }: { param: string | null }) {
  const c = REPORT.regional;
  const region: RegionId = param && REGIONS[param] ? param : c.defaultRegion;
  const [mode, setMode] = useState<'single' | 'compare'>('single');
  const sel = useSelection();
  // Changing region or mode clears the cross-chart highlight.
  const { setSelected } = sel;
  useEffect(() => setSelected(null), [region, mode, setSelected]);

  return (
    <>
      <PageHead kicker={c.kicker} title="Regional Scope" sub={c.sub} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }} className="no-print">
        {REGION_IDS.map((r) => (
          <button
            key={r} className="tbtn" disabled={mode === 'compare'}
            style={mode === 'compare' ? { opacity: 0.5 } : r === region ? ACTIVE_BTN : undefined}
            onClick={() => go('map', r)}
          >
            {REGIONS[r].label}
          </button>
        ))}
        <button
          className="tbtn" style={{ marginLeft: 'auto', ...(mode === 'compare' ? ACTIVE_BTN : {}) }}
          onClick={() => setMode((m) => (m === 'compare' ? 'single' : 'compare'))}
        >
          <Icon name="compare" /> {mode === 'compare' ? 'Back to Single Region' : 'Compare Regions'}
        </button>
      </div>

      <div id="regionBody" className={sel.selected ? 'has-selection' : ''}>
        {mode === 'compare' ? <CompareRegions sel={sel} /> : <RegionDetail R={REGIONS[region]} sel={sel} />}
      </div>
    </>
  );
}

function RegionDetail({ R, sel }: { R: Region; sel: Sel }) {
  const d = sel.selected ? devById(sel.selected) : undefined;
  return (
    <>
      <div className="grid g3" style={{ marginBottom: 22 }}>
        <div className="card pad-sm">
          <div className="stat"><div className="v">{R.n.toLocaleString()}</div><div className="l">Survey respondents · {R.label}</div></div>
        </div>
        {R.leaders.slice(0, 2).map((l, i) => {
          const ld = devById(l.id);
          if (!ld) return null;
          return (
            <div key={`${l.id}-${i}`} className={`card pad-sm${sel.hl(l.id)}`} data-dev={l.id} style={{ cursor: 'pointer' }} onClick={sel.onDev(l.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <DevLogo id={l.id} size={26} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{ld.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--faint)' }}>{l.note || 'Regional sales leader'}</div>
                </div>
              </div>
              <div className="stat"><div className="v" style={{ fontSize: 20 }}>{l.bn} bn EGP</div><div className="l">Regional sales</div></div>
            </div>
          );
        })}
      </div>

      {d && (
        <div className="dev-select-bar">
          <span className="dsb-label">Connected across the charts below:</span>
          <DevLogo id={d.id} size={22} /><b>{d.name}</b>
          <button className="btn" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => go('explorer', d.id)}>View full profile →</button>
          <button className="dsb-clear" title="Clear selection" onClick={() => sel.setSelected(null)}>✕</button>
        </div>
      )}

      <AwarenessStack R={R} sel={sel} />
      <Funnel R={R} sel={sel} />
      <div className="callout">{R.note}</div>
    </>
  );
}

function AwarenessStack({ R, sel }: { R: Region; sel: Sel }) {
  const totalById = Object.fromEntries(R.awareness);
  return (
    <div className="card" style={{ marginBottom: 22 }}>
      <div className="card-head">
        <span className="ttl">Genetic Visibility — Developer Awareness, {R.label}</span>
        <span style={{ fontSize: 11, color: 'var(--faint)' }}>{R.label} customers · N={R.n}</span>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '-4px 0 16px' }}>{REPORT.regional.awarenessIntro}</p>
      <div className="aseg-legend">
        <span><i style={{ background: 'var(--gold)' }} />Top of Mind</span>
        <span><i style={{ background: '#c7c4d4' }} />Other</span>
        <span><i style={{ background: '#8a8898' }} />Spontaneous</span>
        <span style={{ color: 'var(--faint)' }}>— stacked to the Total (aided) ceiling at right · click a developer to connect it across the charts below</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {R.awarenessSeg.map(([id, tm, other, spon]) => {
          const d = devById(id);
          if (!d) return null;
          const total = totalById[id] ?? tm + other + spon;
          return (
            <div key={id} className={`awareness-row${sel.hl(id)}`} data-dev={id} onClick={sel.onDev(id)}>
              <DevLogo id={id} size={22} />
              <span style={{ width: 118, fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span>
              <span className="astack">
                <span className="aseg tm" style={{ width: `${tm}%` }} title={`Top of Mind ${tm}%`} />
                <span className="aseg other" style={{ width: `${other}%` }} title={`Other ${other}%`} />
                <span className="aseg spon" style={{ width: `${spon}%` }} title={`Spontaneous ${spon}%`} />
              </span>
              <span className="mono num" style={{ width: 34, textAlign: 'right', fontSize: 12, fontWeight: 700 }}>{total}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const STAGES = [
  { label: 'Total Awareness', icon: '📣' },
  { label: 'Considered Before', icon: '💜' },
  { label: 'Definitely Want To Purchase', icon: '💰' },
];

function Funnel({ R, sel }: { R: Region; sel: Sel }) {
  const healthyIds = R.funnel.find((f) => f.t === HEALTHY_TIER)?.ids ?? [];
  const weakIds = R.funnel.find((f) => f.t === WEAK_TIER)?.ids ?? [];
  const rows = R.funnelStages.filter(([id]) => devById(id));
  const healthiestNames = healthyIds.map((id) => devById(id)?.name).filter(Boolean).join(' & ');
  const colCls = (id: string) =>
    `funnel-col-head${healthyIds.includes(id) ? ' healthy' : ''}${weakIds.includes(id) ? ' weak' : ''}${sel.hl(id)}`;
  // Only tiers this region has, in the fixed 01→04 order so the bands always taper.
  const tiers = MODELS.funnelTiers
    .map((tier) => ({ ...tier, ids: R.funnel.find((f) => f.t === tier.t)?.ids }))
    .filter((t) => t.ids);

  return (
    <div className="card" style={{ marginBottom: 22 }}>
      <div className="card-head">
        <span className="ttl">Selection Funnel — Developers' Consideration In {R.label}</span>
        <span style={{ fontSize: 11, color: 'var(--faint)' }}>{R.label} customers · N={R.n}</span>
      </div>
      <div className="tbl-wrap" style={{ marginBottom: 12 }}>
        <table style={{ minWidth: Math.max(560, rows.length * 92) }}>
          <thead>
            <tr>
              <th style={{ minWidth: 170 }}>Selection Funnel</th>
              {rows.map(([id]) => (
                <th key={id} className={colCls(id)} data-dev={id} style={{ textAlign: 'center', cursor: 'pointer' }} onClick={sel.onDev(id)}>
                  {weakIds.includes(id) && <span className="funnel-warn" title="High awareness, weak funnel penetration">⚠️</span>}
                  <DevLogo id={id} size={20} />
                  <div style={{ fontSize: 10.5, fontWeight: 700, marginTop: 3, whiteSpace: 'nowrap' }}>{devById(id)!.name}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STAGES.map((sd, si) => (
              <tr key={sd.label}>
                <td style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)' }}>{sd.icon} {sd.label}</td>
                {rows.map((r) => {
                  const last = si === STAGES.length - 1;
                  return (
                    <td
                      key={r[0]} className={colCls(r[0])} data-dev={r[0]} onClick={sel.onDev(r[0])}
                      style={{ textAlign: 'center', cursor: 'pointer', fontFamily: 'var(--f-mono)', fontWeight: last ? 800 : 600, fontSize: last ? 13.5 : 12.5, color: last ? 'var(--indigo)' : 'var(--ink)' }}
                    >
                      {r[si + 1]}%
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {healthiestNames && (
        <p style={{ fontSize: 12, color: 'var(--faint)', textAlign: 'right' }}>
          ↓ <b style={{ color: 'var(--ink)' }}>{healthiestNames}</b> {healthyIds.length > 1 ? 'have' : 'has'} the healthiest funnel in {R.label}.
        </p>
      )}

      <div className="divider" style={{ margin: '20px 0' }} />

      <div className="funnel-wrap">
        {tiers.map((tier) => (
          <div key={tier.t} className="funnel-tier">
            <div className="funnel-band" style={{ width: `${tier.width}%`, background: tier.bg, borderColor: tier.color }}>
              <div className="funnel-band-head">
                <span className="funnel-num" style={{ background: tier.color }}>{tier.n}</span>
                <span className="funnel-ttl" style={{ color: tier.color }}>{tier.t}</span>
              </div>
              <p className="funnel-desc">{tier.desc}</p>
              <div className="funnel-chips">
                {tier.ids!.filter((id) => devById(id)).map((id) => (
                  <span key={id} className={`chip${sel.hl(id)}`} data-dev={id} style={{ cursor: 'pointer' }} onClick={sel.onDev(id)}>
                    <DevLogo id={id} size={18} />{devById(id)!.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type SortKey = 'avg' | 'name' | `aw_${string}` | `in_${string}`;
type Cell = { awareness: number; intent: number };

function CompareRegions({ sel }: { sel: Sel }) {
  const c = REPORT.regional;
  const [sortKey, setSortKey] = useState<SortKey>('avg');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const byId = useMemo(() => {
    const out: Record<string, Partial<Record<RegionId, Cell>>> = {};
    for (const rk of REGION_IDS) {
      const R = REGIONS[rk];
      const totalById = Object.fromEntries(R.awareness);
      for (const [id, aw, , intent] of R.funnelStages) {
        (out[id] ??= {})[rk] = { awareness: totalById[id] ?? aw, intent };
      }
    }
    return out;
  }, []);

  const ids = useMemo(() => {
    const avg = (id: string) => { const v = Object.values(byId[id]).map((x) => x!.awareness); return v.reduce((a, b) => a + b, 0) / v.length; };
    const val = (id: string): number => {
      if (sortKey.startsWith('aw_')) return byId[id][sortKey.slice(3)]?.awareness ?? -1;
      if (sortKey.startsWith('in_')) return byId[id][sortKey.slice(3)]?.intent ?? -1;
      return avg(id);
    };
    return Object.keys(byId).filter((id) => devById(id)).sort((a, b) => {
      if (sortKey === 'name') {
        const cmp = devById(a)!.name.localeCompare(devById(b)!.name);
        return sortDir === 'asc' ? cmp : -cmp;
      }
      return sortDir === 'asc' ? val(a) - val(b) : val(b) - val(a);
    });
  }, [byId, sortKey, sortDir]);

  const sortBy = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(k); setSortDir('desc'); }
  };
  const arrow = (k: SortKey) => (sortKey === k ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '');

  return (
    <>
      <div className="card" style={{ marginBottom: 22 }}>
        <div className="card-head">
          <span className="ttl">Region Comparison — Awareness &amp; Purchase Intent</span>
          <span style={{ fontSize: 11, color: 'var(--faint)' }}>{REGION_IDS.map((r) => REGIONS[r].label).join(' · ')}</span>
        </div>
        <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '-4px 0 16px' }}>{c.compareIntro}</p>
        <div className="tbl-wrap">
          <table style={{ minWidth: Math.max(760, REGION_IDS.length * 220 + 170) }}>
            <thead>
              <tr>
                <th rowSpan={2} style={{ minWidth: 170 }} className="sortable" onClick={() => sortBy('name')}>Developer{arrow('name')}</th>
                {REGION_IDS.map((rk) => <th key={rk} colSpan={2} style={{ textAlign: 'center' }}>{REGIONS[rk].label}</th>)}
              </tr>
              <tr>
                {REGION_IDS.flatMap((rk) => [
                  <th key={`aw_${rk}`} className="sortable" style={{ textAlign: 'center', fontSize: 10.5 }} onClick={() => sortBy(`aw_${rk}`)}>Awareness{arrow(`aw_${rk}`)}</th>,
                  <th key={`in_${rk}`} className="sortable" style={{ textAlign: 'center', fontSize: 10.5 }} onClick={() => sortBy(`in_${rk}`)}>Intent{arrow(`in_${rk}`)}</th>,
                ])}
              </tr>
            </thead>
            <tbody>
              {ids.map((id) => (
                <tr key={id} data-dev={id} className={sel.hl(id).trim()} onClick={sel.onDev(id)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 12.5, whiteSpace: 'nowrap' }}>
                      <DevLogo id={id} size={20} />{devById(id)!.name}
                    </div>
                  </td>
                  {REGION_IDS.map((rk) => {
                    const v = byId[id][rk];
                    if (!v) return <td key={rk} colSpan={2} style={{ textAlign: 'center' }} className="cmp-dash">—</td>;
                    return [
                      <td key={`${rk}a`} style={{ textAlign: 'center' }}>
                        <span className="cmp-bar-track"><span className="cmp-bar-fill" style={{ width: `${v.awareness}%` }} /></span>
                        <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', marginLeft: 5 }}>{v.awareness}%</span>
                      </td>,
                      <td key={`${rk}i`} style={{ textAlign: 'center', fontFamily: 'var(--f-mono)', fontWeight: 800, fontSize: 13, color: 'var(--indigo)' }}>{v.intent}%</td>,
                    ];
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="callout"><RichText text={c.compareReading} /></div>
    </>
  );
}
