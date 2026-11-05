import { useState, type ReactNode } from 'react';
import { DEVS, MODELS, REPORT, devById } from '../lib/data';
import type { ResolvedDeveloper } from '../lib/types';
import { DevLogo, PageHead } from '../components/dev';

// Kept at module level so the selection survives navigating away and back.
let lastSelection: string[] = REPORT.compare.defaultSelection;

const ROWS: [string, (d: ResolvedDeveloper) => ReactNode][] = [
  ['Zone', (d) => <span className="zonechip" style={{ background: d.zone.color + '1c', color: d.zone.color }}>{d.zone.name}</span>],
  ['Index score', (d) => <b>{d.idx.score}</b>],
  ['Credibility', (d) => d.idx.cred],
  ['Premiumness', (d) => d.idx.prem],
  ['Sales rank', (d) => `#${d.sales.rank}`],
  ['Sales value (bn EGP)', (d) => d.sales.value],
  ['Sales CAGR', (d) => (d.sales.cagr != null ? `${d.sales.cagr}%` : '—')],
  ['Archetype', (d) => d.archetype || 'Unconfirmed'],
  ['Core essence', (d) => d.essence.core],
  ['Top strength', (d) => d.strengths[0]],
  ['Top vulnerability', (d) => d.vulnerabilities[0]],
];

export function Compare() {
  const max = REPORT.compare.maxSelection;
  const [sel, setSel] = useState<string[]>(lastSelection);
  const toggle = (id: string) => {
    const next = sel.includes(id) ? sel.filter((x) => x !== id) : sel.length < max ? [...sel, id] : sel;
    lastSelection = next;
    setSel(next);
  };
  const devs = sel.map((id) => devById(id)).filter(Boolean) as ResolvedDeveloper[];

  return (
    <>
      <PageHead kicker="Cross-developer comparison" title="Compare Developers" sub={`Select up to ${max} developers to compare index scores, positioning, and brand DNA side by side.`} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }} className="no-print">
        {DEVS.map((d) => {
          const on = sel.includes(d.id);
          return (
            <button key={d.id} className="chip" aria-pressed={on} onClick={() => toggle(d.id)}
              style={on ? { background: 'var(--indigo)', color: '#fff', borderColor: 'var(--indigo)' } : undefined}>
              <DevLogo id={d.id} size={20} />{d.name}
            </button>
          );
        })}
      </div>

      {devs.length < 2 ? (
        <div className="card empty-card">Pick 2–{max} developers above to compare.</div>
      ) : (
        <>
          <div className="tbl-wrap"><table>
            <thead>
              <tr><th>Metric</th>{devs.map((d) => <th key={d.id}><DevLogo id={d.id} size={22} /> {d.name}</th>)}</tr>
            </thead>
            <tbody>
              {ROWS.map(([label, fn]) => (
                <tr key={label}>
                  <td style={{ fontWeight: 700, color: 'var(--muted)', width: 160 }}>{label}</td>
                  {devs.map((d) => <td key={d.id}>{fn(d)}</td>)}
                </tr>
              ))}
            </tbody>
          </table></div>
          <div className={`grid g${devs.length}`} style={{ marginTop: 18 }}>
            {devs.map((d) => (
              <div key={d.id} className="card pad-sm">
                <div style={{ fontWeight: 700, fontSize: 12.5, marginBottom: 8 }}>{d.name} — Anatomy</div>
                {MODELS.anatomyDims.map((dim) => {
                  const a = d.anatomy[dim.id];
                  return (
                    <div key={dim.id} className="barh" style={{ marginBottom: 5 }}>
                      <span style={{ width: 70, fontSize: 10.5 }}>{dim.label}</span>
                      <span className="track"><span className="fill" style={{ width: `${a.s * 10}%`, background: 'var(--indigo)' }} /></span>
                      <span className="mono num" style={{ width: 24, fontSize: 10, textAlign: 'right' }}>{a.s}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
