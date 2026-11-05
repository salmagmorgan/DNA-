import { useState } from 'react';
import { REPORT, ZONES, asset, devsInZone, rankedByIndex, zoneById } from '../lib/data';
import { DevLogo, PageHead, RankBar, ZonePill } from '../components/dev';
import { Quadrant } from '../models/Quadrant';

export function PositioningIndex({ param }: { param: string | null }) {
  const c = REPORT.index;
  const [activeZone, setActiveZone] = useState<string | null>(zoneById(param)?.id ?? null);
  const toggle = (id: string) => setActiveZone((z) => (z === id ? null : id));
  const ranked = rankedByIndex();

  return (
    <>
      <PageHead kicker={c.kicker} title="Positioning Index" sub={c.sub} />

      <div className="card" style={{ marginBottom: 22, padding: '18px 20px 8px' }}>
        <div className="card-head">
          <span className="ttl">Interactive Quadrant{activeZone && <> · <span style={{ color: zoneById(activeZone)!.color }}>{zoneById(activeZone)!.name}</span></>}</span>
          <button className="tbtn" onClick={() => setActiveZone(null)}>Reset view</button>
        </div>
        <Quadrant activeZone={activeZone} onZoneClick={toggle} />
      </div>

      <div className="grid g2" style={{ marginBottom: 22, alignItems: 'flex-start' }}>
        <div className="card">
          <div className="card-head"><span className="ttl">Ranked Index</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {ranked.map((d, i) => <RankBar key={d.id} rank={i + 1} id={d.id} value={d.idx.score} color={d.zone.color} nameWidth={128} />)}
          </div>
        </div>
        <div className="card">
          <div className="card-head"><span className="ttl">The {ZONES.length} Zones</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 380, overflowY: 'auto' }}>
            {ZONES.map((z) => {
              const members = devsInZone(z.id);
              return (
                <div
                  key={z.id} className="tile"
                  style={{ padding: '10px 12px', ...(activeZone === z.id ? { borderColor: z.color, boxShadow: `0 0 0 2px ${z.color}33` } : {}) }}
                  onClick={() => { toggle(z.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <ZonePill zone={z} />
                    <span style={{ fontSize: 11, color: 'var(--faint)' }}>{members.length} dev{members.length === 1 ? '' : 's'}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{z.desc}</p>
                  {members.length > 0 && (
                    <div style={{ display: 'flex', gap: 5, marginTop: 8 }}>{members.map((d) => <DevLogo key={d.id} id={d.id} size={20} />)}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head"><span className="ttl">{c.sourceTitle}</span></div>
        <img src={asset(c.sourceImage)} alt={c.sourceTitle} style={{ width: '100%', borderRadius: 10, border: '1px solid var(--line)' }} />
        <p style={{ fontSize: 11.5, color: 'var(--faint)', marginTop: 10 }}>{c.sourceNote}</p>
      </div>
    </>
  );
}
