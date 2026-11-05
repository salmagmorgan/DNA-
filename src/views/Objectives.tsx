import { DEVS, REPORT } from '../lib/data';
import { go } from '../lib/router';
import { DevLogo, PageHead } from '../components/dev';

function PillarCard({ p }: { p: { n: string; t: string; d: string } }) {
  return (
    <div className="card pad-sm">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, marginBottom: 6 }}>
        <span className="mono" style={{ color: 'var(--faint)', fontSize: 12 }}>{p.n}</span>
        <b style={{ fontSize: 14 }}>{p.t}</b>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.55 }}>{p.d}</p>
    </div>
  );
}

export function Objectives() {
  const c = REPORT.objectives;
  const firstRow = Math.ceil(c.pillars.length / 2); // 5 pillars → 3 + 2
  return (
    <>
      <PageHead kicker={c.kicker} title="Study Objectives" sub={c.sub} />

      <div className="card grad" style={{ marginBottom: 22 }}>
        <div className="card-head"><span className="ttl on-dark">What {REPORT.meta.title} Is</span></div>
        <h3 style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.5 }}>{c.whatItIs}</h3>
      </div>

      <div className="section-title"><h2>{c.pillars.length} core pillars</h2></div>
      <div className="grid g3" style={{ marginBottom: 10 }}>
        {c.pillars.slice(0, firstRow).map((p) => <PillarCard key={p.n} p={p} />)}
      </div>
      <div className="grid g2" style={{ marginBottom: 22 }}>
        {c.pillars.slice(firstRow).map((p) => <PillarCard key={p.n} p={p} />)}
      </div>

      <div className="grid g2" style={{ marginBottom: 22, alignItems: 'flex-start' }}>
        <div className="card">
          <div className="card-head"><span className="ttl">How This Report Creates Impact</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {c.impact.map((i) => (
              <div key={i.t}>
                <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 2 }}>{i.t}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>{i.d}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-head"><span className="ttl">Three Models Used Throughout</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {c.models.map((m) => (
              <div key={m.t} className="tile" style={{ padding: '12px 14px' }} onClick={() => go(m.go)}>
                <b style={{ fontSize: 13 }}>{m.t}</b>
                <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{m.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-title"><h2>Research base</h2></div>
      <div className="grid g4" style={{ marginBottom: 22 }}>
        {c.researchStats.map((s) => (
          <div key={s.l} className="card pad-sm"><div className="stat"><div className="v">{s.v}</div><div className="l">{s.l}</div></div></div>
        ))}
      </div>
      <div className="grid g2" style={{ marginBottom: 22 }}>
        <div className="card pad-sm">
          <div className="card-head"><span className="ttl">Qualitative approach</span></div>
          <p style={{ fontSize: 13, lineHeight: 1.6 }}>{c.qualitative}</p>
        </div>
        <div className="card pad-sm">
          <div className="card-head"><span className="ttl">Quantitative approach</span></div>
          <p style={{ fontSize: 13, lineHeight: 1.6 }}>{c.quantitative}</p>
        </div>
      </div>

      <div className="section-title"><h2>Scope — {DEVS.length} developers</h2></div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 10, marginBottom: 22 }}>
        {DEVS.map((d) => (
          <div key={d.id} className="tile" style={{ textAlign: 'center', padding: '14px 8px' }} onClick={() => go('explorer', d.id)}>
            <DevLogo id={d.id} size={36} />
            <div style={{ fontSize: 11.5, fontWeight: 700, marginTop: 7, lineHeight: 1.3 }}>{d.name}</div>
          </div>
        ))}
      </div>

      <div className="section-title"><h2>Report agenda</h2></div>
      <div className="grid g2" style={{ marginBottom: 10 }}>
        {c.agenda.map((a) => (
          <div key={a.n} className="tile" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }} onClick={() => go(a.go)}>
            <span className="mono" style={{ color: 'var(--indigo)', fontWeight: 700, fontSize: 13 }}>{a.n}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{a.t}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{a.s}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
