import { REPORT } from '../lib/data';
import { PageHead } from '../components/dev';
import { RichText } from '../components/RichText';

export function Context() {
  const c = REPORT.context;
  const maxDriver = Math.max(...c.choiceDrivers.items.map((d) => d.v));
  const maxGrowth = Math.max(...c.growth.bars.map((b) => b.v));
  return (
    <>
      <PageHead kicker={c.kicker} title="Market Context" sub={c.sub} />

      <div className="section-title"><h2>What actually drives a project choice</h2></div>
      <div className="grid g2" style={{ marginBottom: 22, alignItems: 'stretch' }}>
        <div className="card">
          <div className="card-head"><span className="ttl">Weighted choice drivers</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {c.choiceDrivers.items.map((d) => (
              <div key={d.l} className="barh">
                <span style={{ width: 160, fontSize: 12.5 }}>{d.l}</span>
                {/* scaled so the largest driver fills ~88% of the track, as in the original */}
                <span className="track"><span className="fill" style={{ width: `${(d.v / maxDriver) * 88.4}%`, background: d.c }} /></span>
                <span className="mono num" style={{ width: 34, textAlign: 'right', fontWeight: 700, fontSize: 12.5 }}>{d.v}%</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11.5, color: 'var(--faint)', marginTop: 12 }}>{c.choiceDrivers.source}</p>
        </div>
        <div className="card" style={{ background: 'var(--side)', color: '#fff' }}>
          <div className="card-head"><span className="ttl on-dark">{c.brandEquity.title}</span></div>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,.85)' }}><RichText text={c.brandEquity.body} /></p>
          <div className="divider" style={{ background: 'rgba(255,255,255,.15)' }} />
          <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,.6)' }}>{c.brandEquity.footer}</p>
        </div>
      </div>

      <div className="section-title"><h2>The New Calculated Buyer</h2></div>
      <div className="grid g3" style={{ marginBottom: 22 }}>
        {c.buyerStages.map((s) => (
          <div key={s.t} className="card pad-sm">
            <div className="stat">
              <div className="v">{s.v}</div>
              <div className="l">{s.t} <span style={{ color: 'var(--faint)' }}>· {s.s}</span></div>
              <div className={`d ${s.trend}`}>{s.d}</div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8, lineHeight: 1.5 }}>{s.note}</p>
          </div>
        ))}
      </div>

      <div className="grid g2" style={{ marginBottom: 22 }}>
        <div className="card">
          <div className="card-head"><span className="ttl">Now.. The Effect</span></div>
          <div className="stat" style={{ marginBottom: 10 }}><div className="v" style={{ color: 'var(--crit)' }}>{c.effect.value}</div><div className="l">{c.effect.label}</div></div>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{c.effect.body}</p>
          <ul style={{ margin: '10px 0 0', paddingLeft: 18, fontSize: 13, color: 'var(--ink)', lineHeight: 1.7 }}>
            {c.effect.responses.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </div>
        <div className="card">
          <div className="card-head"><span className="ttl">Growth Rate, Year-on-Year</span></div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 120, paddingTop: 10 }}>
            {c.growth.bars.map((b) => (
              <div key={b.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                <span className="mono num" style={{ fontSize: 12, fontWeight: 700 }}>{b.v}%</span>
                <div style={{ width: '100%', borderRadius: '6px 6px 0 0', background: b.highlight ? 'var(--gold)' : 'var(--indigo)', height: (b.v / maxGrowth) * 86 }} />
                <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>{b.label}</span>
              </div>
            ))}
          </div>
          <div className="callout gold" style={{ marginTop: 12, fontSize: 12 }}>{c.growth.note}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-head"><span className="ttl">{c.commoditization.title}</span></div>
        <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--ink)' }}>{c.commoditization.body}</p>
      </div>
    </>
  );
}
