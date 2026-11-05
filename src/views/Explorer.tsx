import { DEVS, REPORT, asset, devById, findArchetype } from '../lib/data';
import { go } from '../lib/router';
import type { ResolvedDeveloper } from '../lib/types';
import { DevLogo, PageHead, ZonePill } from '../components/dev';
import { AnatomyModel } from '../models/AnatomyModel';
import { EssenceModel } from '../models/EssenceModel';

const list = { margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.8 } as const;
const ink = { color: 'var(--ink)' } as const;

export function Explorer({ param }: { param: string | null }) {
  const c = REPORT.explorer;
  const active = devById(param);
  return (
    <>
      <PageHead kicker={c.kicker} title="Developer Explorer" sub={c.sub} />
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 10, marginBottom: 24 }}>
        {DEVS.map((d) => (
          <div
            key={d.id} className="tile" data-cursor="View profile" onClick={() => go('explorer', d.id)}
            style={{ textAlign: 'center', padding: '16px 10px', ...(active?.id === d.id ? { borderColor: 'var(--indigo)', boxShadow: '0 0 0 2px var(--indigo-soft)' } : {}) }}
          >
            <DevLogo id={d.id} size={44} />
            <div style={{ fontSize: 12, fontWeight: 700, marginTop: 9, lineHeight: 1.3 }}>{d.name}</div>
            <div style={{ marginTop: 6 }}><ZonePill zone={d.zone} /></div>
          </div>
        ))}
      </div>
      {active
        ? <DeveloperProfile key={active.id} d={active} />
        : <div className="card empty-card">Select a developer above to see their full profile.</div>}
    </>
  );
}

function DeveloperProfile({ d }: { d: ResolvedDeveloper }) {
  const arch = findArchetype(d.archetype);
  return (
    <div className="view-enter">
      <div className="card" style={{ marginBottom: 18, background: 'linear-gradient(135deg,var(--surface),var(--surface-2))' }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <DevLogo id={d.id} size={72} />
          <div style={{ flex: 1, minWidth: 220 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>{d.full}</h2>
            {d.tagline && <p style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', marginTop: 3 }}>"{d.tagline}"</p>}
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <ZonePill zone={d.zone} />
              <span className="pill grey">Sales rank #{d.sales.rank}</span>
              {arch ? <span className="pill indigo">{arch.id} archetype</span> : <span className="pill grey">Archetype unconfirmed</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <div className="stat" style={{ textAlign: 'right' }}><div className="v">{d.idx.score}</div><div className="l">Index score</div></div>
          </div>
        </div>
      </div>

      <div className="grid g4" style={{ marginBottom: 18 }}>
        <div className="card pad-sm" title={d.sales.note}>
          <div className="stat"><div className="v">{d.sales.value}<span style={{ fontSize: 14 }}>bn</span></div><div className="l">EGP sales value{d.sales.note ? ' *' : ''}</div></div>
        </div>
        <div className="card pad-sm"><div className="stat"><div className="v">{d.idx.cred}</div><div className="l">Credibility score</div></div></div>
        <div className="card pad-sm"><div className="stat"><div className="v">{d.idx.prem}</div><div className="l">Premiumness score</div></div></div>
        <div className="card pad-sm"><div className="stat"><div className="v">{d.sales.cagr != null ? `${d.sales.cagr}%` : '—'}</div><div className="l">Sales CAGR</div></div></div>
      </div>
      {d.sales.note && <p style={{ fontSize: 11.5, color: 'var(--faint)', margin: '-8px 0 18px' }}>* {d.sales.note}</p>}

      <div className="grid g2" style={{ marginBottom: 18, alignItems: 'flex-start' }}>
        <div className="card">
          <div className="card-head"><span className="ttl">Strengths</span></div>
          <ul style={list}>{d.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
        <div className="card">
          <div className="card-head"><span className="ttl">Vulnerabilities</span></div>
          <ul style={list}>{d.vulnerabilities.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      </div>

      {d.persona && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="card-head"><span className="ttl">The Human They Serve — Persona</span></div>
          <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
            {d.persona.img && (
              <img src={asset(d.persona.img)} alt={d.persona.title || `${d.name} persona`} style={{ width: 152, height: 186, objectFit: 'cover', borderRadius: 12, border: '1px solid var(--line)', flex: '0 0 auto' }} />
            )}
            <div style={{ flex: 1, minWidth: 220 }}>
              {d.human.who && <p style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 4 }}>{d.human.who}</p>}
              {d.human.success && <p style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>Success looks like: {d.human.success}</p>}
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--indigo)' }}>{d.persona.title}</div>
              {d.persona.sub && <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 9 }}>{d.persona.sub}</div>}
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8 }}>
                {d.persona.age && <div><b style={ink}>Age:</b> {d.persona.age}</div>}
                {d.persona.nationality && <div><b style={ink}>Nationality:</b> {d.persona.nationality}</div>}
                {d.persona.lives && <div><b style={ink}>Lives:</b> {d.persona.lives}</div>}
                {d.persona.outfit && <div><b style={ink}>Style:</b> {d.persona.outfit}</div>}
              </div>
              {d.persona.traits && (
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 10 }}>
                  {d.persona.traits.map((t) => <span key={t} className="pill grey">{t}</span>)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-head"><span className="ttl">Communication</span></div>
        {d.comms.positioning && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
            {d.comms.positioning.map((t) => <span key={t} className="pill gold">{t}</span>)}
          </div>
        )}
        <ul style={{ ...list, marginBottom: 12 }}>{d.comms.messages.map((m) => <li key={m}>{m}</li>)}</ul>
        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--muted)' }}>
          {d.comms.ig && <span><b style={ink}>{d.comms.ig}</b> Instagram</span>}
          {d.comms.fb && <span><b style={ink}>{d.comms.fb}</b> Facebook</span>}
        </div>
        {d.comms.quote && <div className="callout" style={{ marginTop: 12, fontStyle: 'italic' }}>"{d.comms.quote}"</div>}
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-head"><span className="ttl">Brand Essence Model <span style={{ fontWeight: 400, color: 'var(--faint)' }}>— fully expanded</span></span></div>
        <EssenceModel dev={d} />
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-head"><span className="ttl">Anatomy Model <span style={{ fontWeight: 400, color: 'var(--faint)' }}>— mapped to the body, /10 weighted pt</span></span></div>
        <AnatomyModel dev={d} />
      </div>
    </div>
  );
}
