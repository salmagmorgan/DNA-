import { FINDINGS, REPORT } from '../lib/data';
import { useUi } from '../lib/ui';
import { PageHead } from '../components/dev';
import { FindingDetail } from '../components/FindingDetail';

const list = { margin: 0, paddingLeft: 18, fontSize: 13.5, lineHeight: 1.9 } as const;

export function Takeouts() {
  const c = REPORT.takeouts;
  const ui = useUi();
  return (
    <>
      <PageHead kicker={c.kicker} title="Key Takeouts" sub={c.sub} />

      <div className="card grad" style={{ marginBottom: 22 }}>
        <div className="card-head"><span className="ttl on-dark">Core Thesis</span></div>
        <h3 style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.5 }}>{c.thesis}</h3>
      </div>

      <div className="grid g2" style={{ marginBottom: 24, alignItems: 'flex-start' }}>
        <div className="card">
          <div className="card-head"><span className="ttl">Winners</span></div>
          <ul style={list}>{c.winners.map((w) => <li key={w}>{w}</li>)}</ul>
        </div>
        <div className="card">
          <div className="card-head"><span className="ttl">Everyone Else</span></div>
          <ul style={list}>{c.others.map((w) => <li key={w}>{w}</li>)}</ul>
        </div>
      </div>

      <div className="section-title"><h2>All findings</h2></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {FINDINGS.map((f) => (
          <div key={f.headline} className="tile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}
            onClick={() => ui.openDrawer(f.theme, <FindingDetail finding={f} />)}>
            <div>
              <span className="pill indigo" style={{ marginBottom: 6 }}>{f.theme}</span>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{f.headline}</div>
            </div>
            <span style={{ color: 'var(--faint)' }}>→</span>
          </div>
        ))}
      </div>

      <div className="section-title"><h2>Evolution Questions</h2></div>
      <div className="grid g2">
        {c.questions.map((q, i) => (
          <div key={q} className="card pad-sm">
            <div style={{ display: 'flex', gap: 10 }}>
              <span className="mono" style={{ color: 'var(--indigo)', fontWeight: 700 }}>Q{i + 1}</span>
              <p style={{ fontSize: 13.5, lineHeight: 1.6 }}>{q}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
