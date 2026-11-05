/* Positioning Index — Credibility × Premiumness plane with the 11 zone bands
   and every developer's logo marker (gently de-overlapped). */
import { useMemo } from 'react';
import { DEVS, ZONES, asset } from '../lib/data';
import { go } from '../lib/router';
import type { ResolvedDeveloper } from '../lib/types';

export const PLOT = { x0: 86, x1: 954, y0: 634, y1: 46 };
export const mapX = (cred: number) => PLOT.x0 + (cred / 100) * (PLOT.x1 - PLOT.x0);
export const mapY = (prem: number) => PLOT.y0 - (prem / 100) * (PLOT.y0 - PLOT.y1);

const R = 20;

export interface MarkerPos { id: string; x: number; y: number; ox: number; oy: number }

/** Relaxation pass: nudges near-coincident markers apart, capped at 30px from the true point. */
export function layoutMarkers(devs: Pick<ResolvedDeveloper, 'id' | 'idx'>[]): Record<string, MarkerPos> {
  const pos = devs.map((d) => {
    const x = mapX(d.idx.cred), y = mapY(d.idx.prem);
    return { id: d.id, x, y, ox: x, oy: y };
  });
  const minDist = R * 2 + 6;
  for (let iter = 0; iter < 60; iter++) {
    for (let i = 0; i < pos.length; i++) {
      for (let j = i + 1; j < pos.length; j++) {
        const a = pos[i], b = pos[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) {
          if (dist < 0.01) dist = 0.01;
          const push = (minDist - dist) / 2;
          const ux = dx / dist, uy = dy / dist;
          a.x -= ux * push * 0.5; a.y -= uy * push * 0.5;
          b.x += ux * push * 0.5; b.y += uy * push * 0.5;
        }
      }
    }
  }
  const maxD = 30;
  for (const p of pos) {
    const dx = p.x - p.ox, dy = p.y - p.oy;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d > maxD) { p.x = p.ox + (dx / d) * maxD; p.y = p.oy + (dy / d) * maxD; }
  }
  return Object.fromEntries(pos.map((p) => [p.id, p]));
}

export function Quadrant({ activeZone, onZoneClick }: { activeZone: string | null; onZoneClick: (id: string) => void }) {
  const posMap = useMemo(() => layoutMarkers(DEVS), []);
  const midY = (PLOT.y0 + PLOT.y1) / 2;

  return (
    <svg viewBox="0 0 1000 680" style={{ width: '100%', height: 'auto', fontFamily: 'var(--f-body)' }} role="img" aria-label="Positioning Index quadrant">
      <rect x="0" y="0" width="1000" height="680" fill="var(--surface)" />
      {ZONES.map((z) => {
        const x = mapX(z.band.x[0]), x2 = mapX(z.band.x[1]);
        const y = mapY(z.band.y[1]), y2 = mapY(z.band.y[0]);
        const w = x2 - x, h = y2 - y;
        const dim = !!activeZone && activeZone !== z.id;
        return (
          <g key={z.id} className="zrect" style={{ cursor: 'pointer' }} onClick={() => onZoneClick(z.id)}>
            <title>{z.name}</title>
            <rect x={x} y={y} width={w} height={h} fill={z.color} opacity={dim ? 0.035 : 0.1} stroke={z.color} strokeOpacity={dim ? 0.18 : 0.5} strokeWidth="1" />
            {w > 150 && h > 36 && (
              <text x={x + 8} y={y + 16} fontSize="10.5" fontWeight="700" fill={z.color} opacity={dim ? 0.45 : 0.92}>{z.name}</text>
            )}
          </g>
        );
      })}
      {[0, 20, 40, 60, 80, 100].map((v) => (
        <g key={v}>
          <line x1={mapX(v)} y1={PLOT.y0} x2={mapX(v)} y2={PLOT.y1} stroke="var(--line)" strokeDasharray={v === 0 ? '0' : '3,4'} />
          <line x1={PLOT.x0} y1={mapY(v)} x2={PLOT.x1} y2={mapY(v)} stroke="var(--line)" strokeDasharray={v === 0 ? '0' : '3,4'} />
          <text x={mapX(v)} y={PLOT.y0 + 18} textAnchor="middle" fontSize="9.5" fill="var(--faint)">{v}</text>
          <text x={PLOT.x0 - 10} y={mapY(v) + 3} textAnchor="end" fontSize="9.5" fill="var(--faint)">{v}</text>
        </g>
      ))}
      <line x1={PLOT.x0} y1={PLOT.y0} x2={PLOT.x1} y2={PLOT.y0} stroke="var(--faint)" strokeWidth="1.4" />
      <line x1={PLOT.x0} y1={PLOT.y0} x2={PLOT.x0} y2={PLOT.y1} stroke="var(--faint)" strokeWidth="1.4" />
      <text x={(PLOT.x0 + PLOT.x1) / 2} y="668" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--muted)">Credibility →</text>
      <text x="22" y={midY} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--muted)" transform={`rotate(-90 22 ${midY})`}>Premiumness →</text>
      {DEVS.map((d) => {
        const p = posMap[d.id];
        const moved = Math.hypot(p.x - p.ox, p.y - p.oy) > 7;
        const dim = !!activeZone && d.zone.id !== activeZone;
        return (
          <g key={d.id} className="dmark" style={{ cursor: 'pointer' }} opacity={dim ? 0.25 : 1} onClick={() => go('explorer', d.id)} data-cursor="View profile">
            <title>{`${d.name} — Credibility ${d.idx.cred} · Premiumness ${d.idx.prem}`}</title>
            {moved && (
              <>
                <line x1={p.ox} y1={p.oy} x2={p.x} y2={p.y} stroke={d.zone.color} strokeWidth="1" strokeOpacity="0.5" />
                <circle cx={p.ox} cy={p.oy} r="2.5" fill={d.zone.color} opacity="0.6" />
              </>
            )}
            <circle cx={p.x} cy={p.y} r={R + 3} fill="#fff" stroke={d.zone.color} strokeWidth="2" />
            <clipPath id={`clip-${d.id}`}><circle cx={p.x} cy={p.y} r={R} /></clipPath>
            <image href={asset(d.logo)} x={p.x - R} y={p.y - R} width={R * 2} height={R * 2} clipPath={`url(#clip-${d.id})`} preserveAspectRatio="xMidYMid meet" />
          </g>
        );
      })}
    </svg>
  );
}
