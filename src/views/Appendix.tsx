import { useState } from 'react';
import { DEVS, MODELS, REPORT, asset, devById } from '../lib/data';
import { useUi } from '../lib/ui';
import { PageHead } from '../components/dev';
import { RichText } from '../components/RichText';
import { AnatomyModel } from '../models/AnatomyModel';
import { EssenceModel } from '../models/EssenceModel';

const srcImg = { width: '100%', borderRadius: 12, border: '1px solid var(--line)' } as const;
const summary = { cursor: 'pointer', fontSize: 12, color: 'var(--muted)', padding: '6px 0' } as const;

export function Appendix() {
  const c = REPORT.appendix;
  const ui = useUi();
  const [devId, setDevId] = useState(devById(c.defaultDeveloper)?.id ?? DEVS[0].id);
  const dev = devById(devId)!;

  return (
    <>
      <PageHead kicker={c.kicker} title="Models & Appendix" sub={c.sub} />

      <div className="card" style={{ marginBottom: 22 }}>
        <div className="card-head"><span className="ttl">See It Applied — pick a developer</span></div>
        <div className="model-picker" role="listbox" aria-label="Developer">
          {DEVS.map((d) => (
            <div key={d.id} role="option" aria-selected={d.id === devId} className={`mp-chip${d.id === devId ? ' sel' : ''}`} onClick={() => setDevId(d.id)}>
              <img src={asset(d.logo)} alt="" /><span>{d.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section-title"><h2>Anatomy Model <span className="n">{MODELS.anatomyDims.length} dimensions, mapped to the body</span></h2></div>
      <div className="card" style={{ marginBottom: 10 }}>
        <AnatomyModel key={dev.id} dev={dev} />
      </div>
      <div className="grid g4" style={{ marginBottom: 10 }}>
        {MODELS.anatomyDims.map((d) => (
          <div key={d.id} className="card pad-sm">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b style={{ fontSize: 12 }}>{d.label}</b><span className="pill indigo" style={{ fontSize: 10 }}>{d.weight}%</span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, lineHeight: 1.45 }}>{d.desc}</p>
          </div>
        ))}
      </div>
      <details style={{ marginBottom: 10 }}>
        <summary style={summary}>{c.sources.anatomy.label}</summary>
        <img src={asset(c.sources.anatomy.img)} alt="" style={{ ...srcImg, marginTop: 8 }} />
      </details>

      <div className="divider" />
      <div className="section-title"><h2>Brand Essence Model <span className="n">{MODELS.essenceLayers.length} layers, fully expanded</span></h2></div>
      <div className="card" style={{ marginBottom: 10 }}>
        <EssenceModel key={dev.id} dev={dev} />
      </div>
      <details style={{ marginBottom: 10 }}>
        <summary style={summary}>{c.sources.essence.label}</summary>
        <img src={asset(c.sources.essence.img)} alt="" style={{ ...srcImg, marginTop: 8 }} />
      </details>

      <div className="divider" />
      <div className="section-title"><h2>Archetype Wheel <span className="n">{MODELS.archetypes.length} archetypes</span></h2></div>
      <div className="grid g2" style={{ marginBottom: 10, alignItems: 'flex-start' }}>
        <img src={asset(c.sources.archetypes.img)} alt="Archetype wheel" style={srcImg} />
        <div className="grid g2">
          {MODELS.archetypes.map((a) => (
            <div key={a.id} className="card pad-sm">
              <b style={{ fontSize: 13 }}>{a.id}</b>
              <div style={{ fontSize: 11, color: 'var(--indigo)', fontWeight: 700, margin: '2px 0 5px' }}>Drive: {a.drive}</div>
              <p style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.5 }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />
      <div className="section-title"><h2>Livable Projects by Size Band</h2></div>
      <div className="grid g4" style={{ marginBottom: 10 }}>
        {c.livable.map((l) => (
          <div key={l.band} className="card pad-sm">
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 5 }}>{l.band}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{l.regions}</div>
          </div>
        ))}
      </div>

      <div className="divider" />
      <div className="card">
        <div className="card-head"><span className="ttl">Methodology & Data Gaps</span></div>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 10 }}><RichText text={c.methodology} /></p>
        <button className="btn" onClick={ui.openNotes}>Open notes & data checks</button>
      </div>
    </>
  );
}
