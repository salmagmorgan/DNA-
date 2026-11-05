import type { Finding } from '../lib/types';

const label = { fontSize: 13, color: 'var(--muted)', marginBottom: 4, fontWeight: 700 } as const;
const para = { fontSize: 13.5, lineHeight: 1.6, marginBottom: 14 } as const;

export function FindingDetail({ finding: f }: { finding: Finding }) {
  return (
    <>
      <h3 style={{ fontSize: 18, marginBottom: 12, lineHeight: 1.4 }}>{f.headline}</h3>
      {f.metric && (
        <div className="card pad-sm" style={{ marginBottom: 14 }}>
          <div className="stat"><div className="v" style={{ fontSize: 22 }}>{f.metric.value}</div><div className="l">{f.metric.label}</div></div>
        </div>
      )}
      <div style={label}>Evidence</div>
      <p style={para}>{f.evidence}</p>
      <div style={label}>Why it's happening</div>
      <p style={para}>{f.why}</p>
      <div className="callout" style={{ marginBottom: 14 }}>{f.implication}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 11.5, color: 'var(--faint)' }}>
        <span>Source: {f.source}</span><span className="pill grey">{f.confidence}</span>
      </div>
    </>
  );
}
