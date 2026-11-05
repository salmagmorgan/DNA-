/* Data integrity checks — run `npm test` after editing anything in src/data/.
   These catch the mistakes that would otherwise only show up as a blank card or a crash. */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  DEVS, FINDINGS, MODELS, NOTES, RAW_DEVELOPERS, REGIONS, REPORT, ZONES,
  ecosystemBuilders, rankedByIndex, totalAnatomyScore, zoneForPoint,
} from '../src/lib/data';
import { ROUTES } from '../src/lib/router';

const publicAsset = (p: string) => resolve(__dirname, '../public/assets', p);
const devIds = new Set(RAW_DEVELOPERS.map((d) => d.id));
const zoneIds = new Set(ZONES.map((z) => z.id));

describe('developers.json', () => {
  it('has unique ids', () => {
    expect(devIds.size).toBe(RAW_DEVELOPERS.length);
  });

  it.each(RAW_DEVELOPERS.map((d) => [d.id, d] as const))('%s is complete and consistent', (_id, d) => {
    if (d.zone) expect(zoneIds, `unknown zone "${d.zone}"`).toContain(d.zone);
    for (const k of ['cred', 'prem', 'score'] as const) {
      expect(d.idx[k]).toBeGreaterThanOrEqual(0);
      expect(d.idx[k]).toBeLessThanOrEqual(100);
    }
    for (const dim of MODELS.anatomyDims) {
      const a = d.anatomy[dim.id];
      expect(a, `missing anatomy dimension "${dim.id}"`).toBeDefined();
      expect(a.s).toBeGreaterThanOrEqual(0);
      expect(a.s).toBeLessThanOrEqual(10);
    }
    if (d.archetype) expect(MODELS.archetypes.map((a) => a.id)).toContain(d.archetype);
    for (const v of [...Object.values(d.capability), ...Object.values(d.expression)]) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(5);
    }
    expect(d.strengths.length).toBeGreaterThan(0);
    expect(d.vulnerabilities.length).toBeGreaterThan(0);
    expect(d.comms.messages.length).toBeGreaterThan(0);
    expect(existsSync(publicAsset(d.logo)), `missing logo ${d.logo}`).toBe(true);
    if (d.persona?.img) expect(existsSync(publicAsset(d.persona.img)), `missing persona ${d.persona.img}`).toBe(true);
  });
});

describe('models.json', () => {
  it('anatomy weights sum to 100%', () => {
    expect(MODELS.anatomyDims.reduce((s, d) => s + d.weight, 0)).toBe(100);
  });
});

describe('regions.json', () => {
  const tierTitles = new Set(MODELS.funnelTiers.map((t) => t.t));
  it.each(Object.entries(REGIONS))('%s references only known developers and funnel tiers', (_k, R) => {
    const ids = [
      ...R.leaders.map((l) => l.id), ...R.awareness.map((a) => a[0]),
      ...R.awarenessSeg.map((a) => a[0]), ...R.funnelStages.map((a) => a[0]), ...R.funnel.flatMap((f) => f.ids),
    ];
    for (const id of ids) expect(devIds, `unknown developer "${id}"`).toContain(id);
    for (const f of R.funnel) expect(tierTitles, `unknown funnel tier "${f.t}"`).toContain(f.t);
    expect(R.n).toBeGreaterThan(0);
  });
  it('default region exists', () => {
    expect(REGIONS[REPORT.regional.defaultRegion]).toBeDefined();
  });
});

describe('report.json', () => {
  it('only links to real routes', () => {
    const gos = [...REPORT.overview.modelTiles, ...REPORT.objectives.models, ...REPORT.objectives.agenda].map((x) => x.go);
    for (const g of gos) expect(ROUTES).toContain(g);
  });
  it('references existing images', () => {
    const imgs = [
      REPORT.meta.brandImages.monogram, REPORT.meta.brandImages.productLogo, REPORT.index.sourceImage,
      ...REPORT.overview.modelTiles.map((m) => m.img),
      REPORT.appendix.sources.anatomy.img, REPORT.appendix.sources.essence.img, REPORT.appendix.sources.archetypes.img,
    ];
    for (const p of imgs) expect(existsSync(publicAsset(p)), `missing ${p}`).toBe(true);
  });
  it('defaults point at real developers', () => {
    for (const id of [...REPORT.compare.defaultSelection, REPORT.appendix.defaultDeveloper]) expect(devIds).toContain(id);
  });
  it('has findings and notes', () => {
    expect(FINDINGS.length).toBeGreaterThan(0);
    expect(NOTES.length).toBeGreaterThan(0);
  });
});

describe('derived values (regression vs. the 2026 report)', () => {
  it('places every developer in its stated zone', () => {
    const zoneOf = Object.fromEntries(DEVS.map((d) => [d.id, d.zone.id]));
    expect(zoneOf.emaar).toBe('luxury-icons');
    expect(zoneOf.tmg).toBe('delivery-masters');
    expect(zoneOf.ahlysabbour).toBe('critical-risk');
  });
  it('identifies the 4 ecosystem builders', () => {
    expect(ecosystemBuilders().map((d) => d.id).sort()).toEqual(['emaar', 'marakez', 'sodic', 'tmg']);
  });
  it('ranks Emaar first on the index', () => {
    expect(rankedByIndex()[0].id).toBe('emaar');
  });
  it('sums anatomy weighted points', () => {
    expect(totalAnatomyScore(DEVS.find((d) => d.id === 'tmg')!)).toBe(89);
  });
  it('falls back to geometric zone lookup', () => {
    expect(zoneForPoint(99, 99).id).toBe('luxury-icons');
    expect(zoneForPoint(10, 10).id).toBe('critical-risk');
  });
});
