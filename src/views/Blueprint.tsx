import { DEVS, REPORT, capabilityTotal, ecosystemBuilders, expressionTotal } from '../lib/data';
import type { Developer } from '../lib/types';
import { DevChip, PageHead } from '../components/dev';

function ScoreCell({ v }: { v: number }) {
  const bg = v === 0 ? 'var(--surface-2)' : v <= 2 ? 'var(--red-soft)' : v <= 3 ? 'var(--gold-soft)' : 'var(--good-bg)';
  const fg = v === 0 ? 'var(--faint)' : v <= 2 ? 'var(--crit)' : v <= 3 ? 'var(--dev)' : 'var(--good)';
  return (
    <td style={{ textAlign: 'center' }}>
      <span className="mono" style={{ display: 'inline-flex', width: 26, height: 26, borderRadius: 7, background: bg, color: fg, alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>{v}</span>
    </td>
  );
}

const CAP_COLS: [keyof Developer['capability'], string][] = [['res', 'Residential'], ['com', 'Commercial'], ['hos', 'Hospitality']];
const EXPR_COLS: [keyof Developer['expression'], string][] = [
  ['tv', 'TV'], ['bb', 'Billboards'], ['dig', 'Digital'], ['cel', 'Celebrities'], ['og', 'On-ground'], ['spn', 'Sponsorships'],
];

export function Blueprint() {
  const c = REPORT.blueprint;
  const eco = ecosystemBuilders();
  const ecoIds = new Set(eco.map((d) => d.id));
  // stable sorts: ties keep developers.json order
  const capRows = [...DEVS].sort((a, b) => capabilityTotal(b) - capabilityTotal(a));
  const exprRows = [...DEVS].sort((a, b) => expressionTotal(b) - expressionTotal(a));

  return (
    <>
      <PageHead kicker={c.kicker} title="Market Blueprint" sub={c.sub} />

      <div className="callout" style={{ marginBottom: 22 }}>
        Only <b>{eco.length} of {DEVS.length}</b> developers score a full 5/5/5 across Residential, Commercial and Hospitality — {eco.map((d) => d.name).join(', ')} are this report's "Ecosystem Builders."
      </div>

      <div className="card" style={{ marginBottom: 22 }}>
        <div className="card-head"><span className="ttl">Capability Matrix (0–5)</span></div>
        <div className="tbl-wrap"><table>
          <thead><tr><th>Developer</th>{CAP_COLS.map(([, l]) => <th key={l} style={{ textAlign: 'center' }}>{l}</th>)}<th>Status</th></tr></thead>
          <tbody>
            {capRows.map((d) => (
              <tr key={d.id}>
                <td><DevChip id={d.id} /></td>
                {CAP_COLS.map(([k]) => <ScoreCell key={k} v={d.capability[k]} />)}
                <td>{ecoIds.has(d.id) ? <span className="pill indigo">Ecosystem Builder</span> : <span className="pill grey">Specialist</span>}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>

      <div className="card">
        <div className="card-head"><span className="ttl">Expression Volume Score (0–5 per channel)</span></div>
        <div className="tbl-wrap"><table>
          <thead><tr><th>Developer</th>{EXPR_COLS.map(([, l]) => <th key={l} style={{ textAlign: 'center' }}>{l}</th>)}<th style={{ textAlign: 'center' }}>Total</th></tr></thead>
          <tbody>
            {exprRows.map((d) => (
              <tr key={d.id}>
                <td><DevChip id={d.id} /></td>
                {EXPR_COLS.map(([k]) => <ScoreCell key={k} v={d.expression[k]} />)}
                <td className="mono num" style={{ textAlign: 'center', fontWeight: 700 }}>{expressionTotal(d)}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
        <p style={{ fontSize: 11.5, color: 'var(--faint)', marginTop: 10 }}>{c.source}</p>
      </div>
    </>
  );
}
