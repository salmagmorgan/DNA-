/* Brand Essence Model — four concentric rings (Attributes → Values) around the Core Essence,
   with every layer's content shown in boxes around the donut. Hover/click highlights a layer. */
import { useState, type MouseEvent } from 'react';
import type { Developer } from '../lib/types';

type Dev = Pick<Developer, 'strengths' | 'human' | 'comms' | 'essence' | 'archetype' | 'tagline'>;
type Key = 'attributes' | 'benefits' | 'personality' | 'values' | 'core';

const RING_R = [156, 130, 104, 78];
const RING_SW = 16;
const CORE_R = 58;
const RING_COLORS = ['#b1a7da', '#4a49a7', '#2159b8', '#12805a'];
const RING_KEYS: Key[] = ['attributes', 'benefits', 'personality', 'values'];

export function EssenceModel({ dev }: { dev: Dev }) {
  const [hover, setHover] = useState<Key | null>(null);
  const [pinned, setPinned] = useState<Key | null>(null);
  const active = pinned ?? hover;

  const bind = (key: Key) => ({
    onMouseEnter: () => setHover(key),
    onMouseLeave: () => setHover(null),
    onClick: (e: MouseEvent) => { e.stopPropagation(); setPinned((p) => (p === key ? null : key)); },
  });

  const benefits = [
    dev.human.who ? `Serves: ${dev.human.who}` : null,
    dev.human.success ? `Success looks like: ${dev.human.success}` : null,
    ...(dev.comms?.messages ?? []),
  ];

  const box = (key: Key, color: string, title: string, items: (string | null)[]) => {
    const list = items.filter(Boolean) as string[];
    return (
      <div className={`essence-box clickable${active === key ? ' hi' : ''}`} style={{ borderTopColor: color }} {...bind(key)}>
        <div className="essence-box-head"><span className="dot" style={{ background: color }} />{title}</div>
        {list.length
          ? <ul className="essence-box-list">{list.map((i) => <li key={i}>{i}</li>)}</ul>
          : <p className="spotlight-hint" style={{ textAlign: 'left', padding: 0 }}>No data captured for this developer.</p>}
      </div>
    );
  };

  return (
    // clicking empty space clears the pin
    <div className="essence-info" onClick={() => setPinned(null)}>
      <div className="eb-attributes">{box('attributes', RING_COLORS[0], '01 · Attributes', dev.strengths ?? [])}</div>
      <div className="eb-benefits">{box('benefits', RING_COLORS[1], '02 · Functional & Emotional Benefits', benefits)}</div>
      <div className="eb-personality">
        {box('personality', RING_COLORS[2], '03 · Personality', dev.essence.personality ?? [])}
        {dev.archetype && <div style={{ marginTop: 8 }}><span className="pill gold">Archetype: {dev.archetype}</span></div>}
      </div>
      <div className="eb-values">{box('values', RING_COLORS[3], '04 · Values', dev.essence.values ?? [])}</div>

      <div className="eb-donut">
        <div className="donut-wrap" style={{ width: '100%', maxWidth: 320, margin: '0 auto' }}>
          <svg viewBox="0 0 360 360" style={{ width: '100%', height: 'auto', display: 'block' }}>
            {RING_KEYS.map((k, i) => (
              <circle key={k} className={`donut-ring${active === k ? ' hi' : ''}`} cx="180" cy="180" r={RING_R[i]} fill="none" stroke={RING_COLORS[i]} strokeWidth={RING_SW} />
            ))}
            <circle className={`donut-ring${active === 'core' ? ' hi' : ''}`} cx="180" cy="180" r={CORE_R} fill="var(--indigo)" stroke="#fff" strokeWidth="0" />
            {/* generous invisible hit-bands so hover/tap anywhere within a ring registers */}
            {RING_KEYS.map((k, i) => (
              <circle key={k} className="donut-hit" cx="180" cy="180" r={RING_R[i]} strokeWidth={RING_SW + 14} {...bind(k)} />
            ))}
            <circle className="donut-hit" cx="180" cy="180" r={CORE_R} fill="transparent" stroke="none" style={{ pointerEvents: 'all' }} {...bind('core')} />
          </svg>
          <div className="donut-center">
            <div className="dn-label">Core Essence</div>
            <div className="dn-core">{dev.essence.core}</div>
          </div>
        </div>
      </div>

      <div className={`eb-core essence-box clickable${active === 'core' ? ' hi' : ''}`} style={{ borderTopColor: 'var(--indigo)' }} {...bind('core')}>
        <div className="essence-box-head"><span className="dot" style={{ background: 'var(--indigo)' }} />05 · Core Essence</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--indigo)', lineHeight: 1.4 }}>{dev.essence.core}</div>
        {dev.tagline && <p style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--muted)', marginTop: 6 }}>"{dev.tagline}"</p>}
        {dev.comms?.quote && <div className="callout" style={{ marginTop: 10, fontSize: 12.5, fontStyle: 'italic' }}>"{dev.comms.quote}"</div>}
      </div>
    </div>
  );
}
