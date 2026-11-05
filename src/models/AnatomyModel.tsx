/* Anatomy Model — 7 weighted execution dimensions mapped onto a human figure.
   Hover previews a dimension; click pins it (click again to unpin). */
import { useId, useState } from 'react';
import { MODELS, totalAnatomyScore } from '../lib/data';
import { scoreColor } from '../lib/color';
import type { AnatomyDimId, Developer } from '../lib/types';

type Dev = Pick<Developer, 'anatomy' | 'anatomyNote'>;

const BODY_POS: Record<AnatomyDimId, { x: number; y: number; leader: [number, number] }> = {
  lb: { x: 128, y: 32, leader: [-30, -14] },
  rb: { x: 172, y: 32, leader: [30, -14] },
  mouth: { x: 150, y: 58, leader: [0, 20] },
  heart: { x: 150, y: 138, leader: [-38, 0] },
  muscles: { x: 150, y: 195, leader: [-40, 6] },
  hands: { x: 252, y: 220, leader: [34, 10] },
  legs: { x: 148, y: 330, leader: [-36, 8] },
};

const TORSO = 'M104,96 Q150,86 196,96 L202,180 Q202,224 196,226 L104,226 Q98,224 98,180 Z';

function tierFor(s: number) {
  if (s >= 9) return { tier: 'Elite', color: 'var(--teal)' };
  if (s >= 7) return { tier: 'Strong', color: 'var(--indigo)' };
  if (s >= 4) return { tier: 'Developing', color: 'var(--gold)' };
  return { tier: 'Needs attention', color: 'var(--red)' };
}

export function AnatomyModel({ dev }: { dev: Dev }) {
  const [hover, setHover] = useState<AnatomyDimId | null>(null);
  const [pinned, setPinned] = useState<AnatomyDimId | null>(null);
  const active = pinned ?? hover;
  const gradId = useId().replace(/:/g, '') + 'bodyGrad';
  const total = totalAnatomyScore(dev);

  const bind = (id: AnatomyDimId) => ({
    onMouseEnter: () => setHover(id),
    onMouseLeave: () => setHover(null),
    onClick: () => setPinned((p) => (p === id ? null : id)),
  });

  const activeDim = active ? MODELS.anatomyDims.find((d) => d.id === active) : undefined;

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--faint)', fontWeight: 700 }}>Total weighted DNA score</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, maxWidth: 260, minWidth: 160 }}>
          <div className="track" style={{ height: 9, flex: 1 }}>
            <span className="fill" style={{ width: `${total}%`, background: 'linear-gradient(90deg,var(--lav),var(--navy))', transition: 'width .6s cubic-bezier(.2,.8,.3,1)' }} />
          </div>
          <span className="mono num" style={{ fontWeight: 800, fontSize: 15 }}>
            {total}<span style={{ fontSize: 10, color: 'var(--faint)', fontWeight: 600 }}>/100</span>
          </span>
        </div>
      </div>

      <div className="body-figure-card">
        <div>
          <svg viewBox="0 0 300 460" className="body-figure" style={{ width: '100%', maxWidth: 280, height: 'auto', display: 'block', margin: '0 auto' }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--surface-2)" />
                <stop offset="100%" stopColor="var(--line)" stopOpacity=".6" />
              </linearGradient>
            </defs>
            {/* legs */}
            <line x1="132" y1="220" x2="121" y2="416" stroke={`url(#${gradId})`} strokeWidth="27" strokeLinecap="round" />
            <line x1="168" y1="220" x2="179" y2="416" stroke={`url(#${gradId})`} strokeWidth="27" strokeLinecap="round" />
            <ellipse cx="119" cy="424" rx="16" ry="9" fill="var(--surface-2)" />
            <ellipse cx="181" cy="424" rx="16" ry="9" fill="var(--surface-2)" />
            {/* arms */}
            <line x1="110" y1="100" x2="50" y2="214" stroke={`url(#${gradId})`} strokeWidth="21" strokeLinecap="round" />
            <line x1="190" y1="100" x2="250" y2="214" stroke={`url(#${gradId})`} strokeWidth="21" strokeLinecap="round" />
            <circle cx="48" cy="222" r="12" fill="var(--surface-2)" />
            <circle cx="252" cy="222" r="12" fill="var(--surface-2)" />
            {/* torso, neck, head */}
            <path d={TORSO} fill={`url(#${gradId})`} />
            <rect x="139" y="60" width="22" height="28" rx="8" fill="var(--surface-2)" />
            <circle cx="150" cy="38" r="25" fill="var(--surface-2)" />
            <g stroke="var(--line)" strokeWidth="1.5" fill="none">
              <line x1="132" y1="220" x2="121" y2="416" /><line x1="168" y1="220" x2="179" y2="416" />
              <line x1="110" y1="100" x2="50" y2="214" /><line x1="190" y1="100" x2="250" y2="214" />
              <path d={TORSO} />
              <circle cx="150" cy="38" r="25" />
            </g>
            {MODELS.anatomyDims.map((dim) => {
              const p = BODY_POS[dim.id];
              const a = dev.anatomy[dim.id];
              const r = 8 + (a.s / 10) * 13;
              const color = scoreColor(a.s);
              const fsize = Math.max(7, Math.min(10.5, r * 0.62));
              const isActive = active === dim.id;
              return (
                <g key={dim.id} className={`body-marker${isActive ? ' active' : ''}`} {...bind(dim.id)}>
                  <line className={`body-leader${isActive ? ' active' : ''}`} x1={p.x} y1={p.y} x2={p.x + p.leader[0]} y2={p.y + p.leader[1]} strokeWidth="2" />
                  <circle className="ping" cx={p.x} cy={p.y} r={r} fill={color} />
                  <circle className="core" cx={p.x} cy={p.y} r={r} fill={color} stroke="#fff" strokeWidth="2" />
                  <text className="mval" x={p.x} y={p.y + 0.5} fontSize={fsize}>{a.s}</text>
                  <circle className="hit" cx={p.x} cy={p.y} r={r + 11} />
                </g>
              );
            })}
          </svg>
          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--faint)', marginTop: 6 }}>Tap a marker, or a row, to see its full definition</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {MODELS.anatomyDims.map((dim) => {
            const a = dev.anatomy[dim.id];
            const color = scoreColor(a.s);
            return (
              <div key={dim.id} className={`body-dim-row${active === dim.id ? ' hl' : ''}`} style={{ borderRadius: 9, padding: '8px 10px' }} {...bind(dim.id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4, gap: 8 }}>
                  <b style={{ fontSize: 12.5 }}>
                    <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: color, marginRight: 6 }} />
                    {dim.label} <span style={{ fontWeight: 400, color: 'var(--faint)' }}>— {dim.sub}</span>
                  </b>
                  <span className="mono num" style={{ fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{a.s}/10 · {a.pt}pt</span>
                </div>
                <div className="track" style={{ height: 7 }}>
                  <span className="fill" style={{ width: `${a.s * 10}%`, background: color, transition: 'width .5s cubic-bezier(.2,.8,.3,1)' }} />
                </div>
              </div>
            );
          })}
          {dev.anatomyNote && <div className="callout gold" style={{ marginTop: 4, fontSize: 11 }}>{dev.anatomyNote}</div>}
        </div>
      </div>

      <div className="model-spotlight" key={active ?? 'none'}>
        {activeDim ? (() => {
          const a = dev.anatomy[activeDim.id];
          const { tier, color } = tierFor(a.s);
          return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 18, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 240 }}>
                <div className="kicker" style={{ marginBottom: 6 }}>
                  {activeDim.label} <span style={{ color: 'var(--faint)', fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>— {activeDim.sub}</span>
                </div>
                <p style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--ink)' }}>{activeDim.desc}</p>
              </div>
              <div style={{ textAlign: 'right', flex: '0 0 auto' }}>
                <div className="stat">
                  <div className="v">{a.s}<span style={{ fontSize: 15, color: 'var(--faint)', fontWeight: 600 }}>/10</span></div>
                  <div className="l">{a.pt} of {activeDim.weight} possible pt · {activeDim.weight}% weight</div>
                </div>
                <span className="pill" style={{ background: `color-mix(in srgb, ${color} 16%, transparent)`, color, marginTop: 8 }}>{tier}</span>
              </div>
            </div>
          );
        })() : (
          <div className="spotlight-hint">Tap any marker or row above to see that dimension's full definition and this developer's score, in detail.</div>
        )}
      </div>
    </>
  );
}
