/* ============================================================
   Data loader — imports the JSON files in src/data/ and derives
   everything the views need (zones resolved, rankings, groups).
   ============================================================ */
import developersJson from '../data/developers.json';
import zonesJson from '../data/zones.json';
import regionsJson from '../data/regions.json';
import findingsJson from '../data/findings.json';
import modelsJson from '../data/models.json';
import notesJson from '../data/notes.json';
import reportJson from '../data/report.json';
import type {
  Developer, Finding, Models, Note, Region, RegionId, Report, ResolvedDeveloper, Zone,
} from './types';

export const ZONES = zonesJson as Zone[];
export const REGIONS = regionsJson as unknown as Record<RegionId, Region>;
export const FINDINGS = findingsJson as Finding[];
export const MODELS = modelsJson as Models;
export const NOTES = notesJson as Note[];
export const REPORT = reportJson as Report;
export const RAW_DEVELOPERS = developersJson as unknown as Developer[];

/** Geometric fallback: the smallest zone band containing the point. */
export function zoneForPoint(cred: number, prem: number, zones: Zone[] = ZONES): Zone {
  let best: Zone | null = null;
  let bestArea = Infinity;
  for (const z of zones) {
    const [x0, x1] = z.band.x;
    const [y0, y1] = z.band.y;
    if (cred >= x0 && cred <= x1 && prem >= y0 && prem <= y1) {
      const area = (x1 - x0) * (y1 - y0);
      if (area < bestArea) { bestArea = area; best = z; }
    }
  }
  return best ?? zones[zones.length - 1];
}

export function resolveDevelopers(devs: Developer[], zones: Zone[] = ZONES): ResolvedDeveloper[] {
  return devs.map((d) => ({
    ...d,
    zone: (d.zone && zones.find((z) => z.id === d.zone)) || zoneForPoint(d.idx.cred, d.idx.prem, zones),
  }));
}

export const DEVS: ResolvedDeveloper[] = resolveDevelopers(RAW_DEVELOPERS);

const DEV_MAP = new Map(DEVS.map((d) => [d.id, d]));
export const devById = (id: string | null | undefined): ResolvedDeveloper | undefined =>
  id ? DEV_MAP.get(id) : undefined;

export const zoneById = (id: string | null | undefined): Zone | undefined =>
  id ? ZONES.find((z) => z.id === id) : undefined;

export const devsInZone = (zoneId: string) => DEVS.filter((d) => d.zone.id === zoneId);

export const rankedByIndex = () => [...DEVS].sort((a, b) => b.idx.score - a.idx.score);

/** Total weighted anatomy score (sum of displayed weighted points). */
export function totalAnatomyScore(dev: Pick<Developer, 'anatomy'>): number {
  return Math.round(MODELS.anatomyDims.reduce((sum, d) => sum + dev.anatomy[d.id].pt, 0));
}

export const capabilityTotal = (d: Pick<Developer, 'capability'>) =>
  d.capability.res + d.capability.com + d.capability.hos;

export const expressionTotal = (d: Pick<Developer, 'expression'>) =>
  Object.values(d.expression).reduce((a, b) => a + b, 0);

/** "Ecosystem Builders" — full 5/5/5 across Residential, Commercial, Hospitality. */
export const ecosystemBuilders = () =>
  DEVS.filter((d) => d.capability.res === 5 && d.capability.com === 5 && d.capability.hos === 5);

export const findArchetype = (id: string | null) =>
  id ? MODELS.archetypes.find((a) => a.id === id) : undefined;

/** Resolve a path inside public/assets/ against the deployed base URL. */
export const asset = (p: string | undefined) => (p ? `${import.meta.env.BASE_URL}assets/${p}` : '');
