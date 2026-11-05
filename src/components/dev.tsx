/* Developer logo / chip / zone pill primitives used across every view. */
import type { CSSProperties, MouseEvent } from 'react';
import { asset, devById } from '../lib/data';
import { go } from '../lib/router';
import type { Zone } from '../lib/types';

export function DevLogo({ id, size = 28, style }: { id: string; size?: number; style?: CSSProperties }) {
  const d = devById(id);
  if (!d) return null;
  return (
    <img
      className="devlogo" src={asset(d.logo)} alt={d.name} title={d.name}
      style={{ width: size, height: size, ...style }}
    />
  );
}

interface DevChipProps {
  id: string;
  lg?: boolean;
  full?: boolean;
  /** false → static chip; default navigates to the developer's profile */
  link?: boolean;
  onClick?: (e: MouseEvent) => void;
  className?: string;
  logoSize?: number;
}

export function DevChip({ id, lg, full, link = true, onClick, className, logoSize }: DevChipProps) {
  const d = devById(id);
  if (!d) return null;
  const handler = onClick ?? (link ? () => go('explorer', d.id) : undefined);
  return (
    <span
      className={`${lg ? 'chip lg' : 'chip'}${className ? ' ' + className : ''}`}
      onClick={handler}
      style={handler ? { cursor: 'pointer' } : undefined}
      data-dev={id}
    >
      <DevLogo id={d.id} size={logoSize ?? (lg ? 28 : 20)} />
      {full ? d.full : d.name}
    </span>
  );
}

export function ZonePill({ zone }: { zone: Zone }) {
  return (
    <span className="zonechip" style={{ background: zone.color + '1c', color: zone.color }}>
      <svg viewBox="0 0 8 8" width="7" height="7"><circle cx="4" cy="4" r="4" fill={zone.color} /></svg>
      {zone.name}
    </span>
  );
}

export function PageHead({ kicker, title, sub }: { kicker: string; title: string; sub: string }) {
  return (
    <>
      <div className="kicker">{kicker}</div>
      <div className="page-head">
        <div>
          <h1>{title}</h1>
          <p className="sub">{sub}</p>
        </div>
      </div>
    </>
  );
}

/** Horizontal ranked bar used by Overview "Top 5" and the Positioning Index list. */
export function RankBar({ rank, id, value, color, nameWidth }: {
  rank: number; id: string; value: number; color: string; nameWidth: number;
}) {
  const d = devById(id);
  if (!d) return null;
  return (
    <div className="barh clickable" onClick={() => go('explorer', id)}>
      <span className="mono" style={{ width: 16, color: 'var(--faint)', fontSize: 11 }}>{rank}</span>
      <DevLogo id={id} size={24} />
      <span style={{ width: nameWidth, fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span>
      <span className="track"><span className="fill" style={{ width: `${value}%`, background: color }} /></span>
      <span className="mono num" style={{ width: 30, textAlign: 'right', fontWeight: 700, fontSize: 12.5 }}>{value}</span>
    </div>
  );
}
