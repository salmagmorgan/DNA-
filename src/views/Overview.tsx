import { useState, type ReactNode } from 'react';
import { DEVS, FINDINGS, REPORT, ZONES, asset, devsInZone, rankedByIndex } from '../lib/data';
import { go } from '../lib/router';
import type { Finding, RouteId } from '../lib/types';
import { useUi } from '../lib/ui';
import { DevLogo, RankBar } from '../components/dev';
import { FindingDetail } from '../components/FindingDetail';
import { Icon } from '../components/Icon';
import { RichText } from '../components/RichText';

let readmeDismissed = false; // survives navigation within the session, like the original

function StatCard({ v, l, extra, to, param }: { v: ReactNode; l: string; extra?: ReactNode; to?: RouteId; param?: string }) {
  return (
    <div className={`card pad-sm kpi${to ? ' clickable' : ''}`} onClick={to ? () => go(to, param) : undefined}>
      {to && <span className="expand">+</span>}
      <div className="stat"><div className="v">{v}</div><div className="l">{l}</div>{extra}</div>
    </div>
  );
}

export function FindingTile({ f }: { f: Finding }) {
  const ui = useUi();
  return (
    <div className="tile" onClick={() => ui.openDrawer(f.theme, <FindingDetail finding={f} />)}>
      <span className="pill indigo" style={{ marginBottom: 10 }}>{f.theme}</span>
      <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.4, marginBottom: 8 }}>{f.headline}</div>
      {f.metric && (
        <div className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{f.metric.label}: <b style={{ color: 'var(--ink)' }}>{f.metric.value}</b></div>
      )}
    </div>
  );
}

export function Overview() {
  const c = REPORT.overview;
  const [showReadme, setShowReadme] = useState(!readmeDismissed);
  const top5 = rankedByIndex().slice(0, 5);
  // "Healthiest" and "weakest" zones = first and last in zones.json
  const bestZone = ZONES[0];
  const worstZone = ZONES[ZONES.length - 1];
  const best = devsInZone(bestZone.id);
  const worst = devsInZone(worstZone.id);

  return (
    <>
      {showReadme && (
        <div id="readme" className="no-print">
          <div className="ic"><Icon name="book" /></div>
          <div className="bd">
            <h4>Read me first</h4>
            <p><RichText text={c.readme} /></p>
          </div>
          <button className="x" aria-label="Dismiss" onClick={() => { readmeDismissed = true; setShowReadme(false); }}>✕</button>
        </div>
      )}

      <div className="kicker">{c.kicker}</div>
      <div className="page-head"><div><h1>{c.title}</h1><p className="sub">{c.sub}</p></div></div>

      <div className="card obj-intro" style={{ padding: 0, marginBottom: 18 }}>
        <div className="oi-goal">
          <div className="kicker" style={{ marginBottom: 2 }}>Study Objective</div>
          <h3 style={{ fontSize: 16.5, fontWeight: 700, lineHeight: 1.45 }}>{c.objective.headline}</h3>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{c.objective.body}</p>
          <div className="oi-pillars" style={{ marginTop: 4 }}>
            {REPORT.objectives.pillars.map((p) => <span key={p.n} className="pill indigo">{p.n} {p.t}</span>)}
          </div>
          <button className="btn primary" style={{ marginTop: 4, alignSelf: 'flex-start' }} onClick={() => go('objectives')}>
            <Icon name="objectives" /> See full methodology →
          </button>
        </div>
        <div className="oi-method">
          <div className="card-head" style={{ marginBottom: 0 }}><span className="ttl">Methodology at a glance</span></div>
          <div className="oi-stats">
            {c.methodology.stats.map((s) => <div key={s.l}><b>{s.v}</b><span>{s.l}</span></div>)}
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>{c.methodology.body}</p>
        </div>
      </div>

      <div className="grid g4" style={{ marginBottom: 18 }}>
        <StatCard v={DEVS.length} l="Developers profiled" to="explorer" />
        <StatCard v={ZONES.length} l="Brand Fitness zones" to="index" />
        <StatCard
          v={best.length} l={`In the ${bestZone.name} zone`} to="index" param={bestZone.id}
          extra={<div className="d" style={{ marginTop: 4, display: 'flex', gap: 5 }}>{best.map((d) => <DevLogo key={d.id} id={d.id} size={20} />)}</div>}
        />
        <StatCard
          v={worst.length} l={`In ${worstZone.name}`}
          to={worst.length === 1 ? 'explorer' : 'index'} param={worst.length === 1 ? worst[0].id : worstZone.id}
          extra={<div className="d down" style={{ marginTop: 4 }}>{worst.map((d) => d.name).join(', ')}</div>}
        />
      </div>

      <div className="grid g2" style={{ marginBottom: 18, alignItems: 'stretch' }}>
        <div className="card grad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-head"><span className="ttl on-dark">Core Thesis</span></div>
            <h3 style={{ fontSize: 19, lineHeight: 1.4, fontWeight: 600, marginBottom: 10 }}>{c.thesis.quote}</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.75)', lineHeight: 1.6 }}>{c.thesis.body}</p>
          </div>
          <button className="btn" style={{ background: '#fff', color: 'var(--navy)', marginTop: 16, alignSelf: 'flex-start' }} onClick={() => go('takeouts')}>See key takeouts →</button>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-head">
            <span className="ttl">Positioning Index — Top 5</span>
            <span className="pill indigo" style={{ cursor: 'pointer' }} onClick={() => go('index')}>Full index →</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, justifyContent: 'center' }}>
            {top5.map((d, i) => <RankBar key={d.id} rank={i + 1} id={d.id} value={d.idx.score} color={d.zone.color} nameWidth={112} />)}
          </div>
        </div>
      </div>

      <div className="section-title"><h2>Four models, one DNA</h2></div>
      <div className="grid g4" style={{ marginBottom: 22 }}>
        {c.modelTiles.map((m) => (
          <div key={m.title} className="tile" onClick={() => go(m.go)} style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 108, overflow: 'hidden', background: 'var(--surface-2)' }}>
              <img src={asset(m.img)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 4 }}>{m.title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{m.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-title"><h2>What the data says</h2></div>
      <div className="grid g3" style={{ marginBottom: 10 }}>
        {FINDINGS.slice(0, c.findingsShown).map((f) => <FindingTile key={f.headline} f={f} />)}
      </div>
    </>
  );
}
