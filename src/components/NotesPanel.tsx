import { NOTES, REPORT } from '../lib/data';
import { RichText } from './RichText';

/** Body of the "Report notes & data checks" drawer. Categories come from notes.json, in first-seen order. */
export function NotesPanel() {
  const groups = [...new Set(NOTES.map((n) => n.cat))];
  return (
    <>
      <div className={`grid g${Math.min(groups.length, 4)}`} style={{ marginBottom: 18 }}>
        {groups.map((g) => (
          <div key={g} className="card pad-sm" style={{ textAlign: 'center' }}>
            <div className="stat" style={{ alignItems: 'center' }}>
              <div className="v">{NOTES.filter((n) => n.cat === g).length}</div>
              <div className="l">{g}</div>
            </div>
          </div>
        ))}
      </div>
      {groups.map((g) => (
        <div key={g}>
          <div className="section-title"><h2 style={{ fontSize: 14 }}>{g}</h2></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
            {NOTES.filter((n) => n.cat === g).map((n) => (
              <div key={n.t} className="card pad-sm">
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{n.t}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>{n.d}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <p style={{ fontSize: 11.5, color: 'var(--faint)' }}><RichText text={REPORT.notesFooter} /></p>
    </>
  );
}
