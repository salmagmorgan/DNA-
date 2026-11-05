/* ============================================================
   Data model for a Developers' DNA report.
   Every file in src/data/ is typed here — edit the JSON, not the code.
   ============================================================ */

export type AnatomyDimId = 'lb' | 'heart' | 'legs' | 'rb' | 'mouth' | 'muscles' | 'hands';
export type RegionId = string;

export interface Zone {
  id: string;
  name: string;
  /** Rectangle on the Credibility (x) × Premiumness (y) plane, 0–100. */
  band: { x: [number, number]; y: [number, number] };
  color: string;
  desc: string;
}

export interface AnatomyScore {
  /** Score out of 10. */
  s: number;
  /** Weighted points as displayed in the source report. */
  pt: number;
}

export interface Developer {
  id: string;
  name: string;
  full: string;
  /** Path under public/assets/ */
  logo: string;
  tagline: string;
  /** Zone id from zones.json (authoritative assignment from the report). Omit to place geometrically. */
  zone?: string;
  idx: { cred: number; prem: number; score: number };
  sales: {
    rank: number;
    /** EGP bn */
    value: number;
    cagr: number | null;
    awareness?: number;
    active?: number;
    delivered?: number;
    note?: string;
    sc?: Partial<Record<RegionId, number>>;
  };
  /** Archetype id from models.json, or null when the report leaves it unconfirmed. */
  archetype: string | null;
  strengths: string[];
  vulnerabilities: string[];
  human: { who?: string; success?: string };
  persona?: {
    img?: string;
    gender?: string;
    nationality?: string;
    age?: string;
    outfit?: string;
    lives?: string;
    title?: string;
    sub?: string;
    traits?: string[];
  };
  essence: { core: string; personality: string[]; values: string[] };
  comms: {
    positioning?: string[];
    messages: string[];
    ig?: string;
    fb?: string;
    quote?: string;
  };
  anatomy: Record<AnatomyDimId, AnatomyScore>;
  anatomyNote?: string;
  /** 0–5 per category (Market Blueprint). */
  capability: { res: number; com: number; hos: number };
  /** 0–5 per channel (Market Blueprint). */
  expression: { tv: number; bb: number; dig: number; cel: number; og: number; spn: number };
}

/** Developer with its zone resolved to the full Zone object. */
export interface ResolvedDeveloper extends Omit<Developer, 'zone'> {
  zone: Zone;
}

export interface Region {
  label: string;
  area: string;
  /** Survey sample size */
  n: number;
  leaders: { id: string; bn: number; note?: string }[];
  /** [developerId, totalAwareness%] */
  awareness: [string, number][];
  /** [developerId, topOfMind%, other%, spontaneous%] */
  awarenessSeg: [string, number, number, number][];
  /** [developerId, totalAwareness%, consideredBefore%, definitelyWantToPurchase%] */
  funnelStages: [string, number, number, number][];
  /** Funnel tiers (titles must match models.json funnelTiers[].t) */
  funnel: { t: string; ids: string[] }[];
  note: string;
}

export interface Finding {
  theme: string;
  headline: string;
  metric?: { label: string; value: string };
  evidence: string;
  why: string;
  implication: string;
  source: string;
  confidence: string;
}

export interface AnatomyDim {
  id: AnatomyDimId;
  label: string;
  sub: string;
  /** % weight; all seven should sum to 100 */
  weight: number;
  desc: string;
}

export interface Archetype { id: string; drive: string; desc: string }
export interface EssenceLayer { n: string; t: string; v: string }
export interface FunnelTier { t: string; n: string; width: number; color: string; bg: string; desc: string }

export interface Models {
  anatomyDims: AnatomyDim[];
  archetypes: Archetype[];
  essenceLayers: EssenceLayer[];
  funnelTiers: FunnelTier[];
}

export interface Note { cat: string; t: string; d: string }

export type RouteId =
  | 'overview' | 'objectives' | 'context' | 'map' | 'index'
  | 'explorer' | 'blueprint' | 'takeouts' | 'appendix' | 'compare';

interface Stat { v: string; l: string }
interface Titled { t: string; d: string }

export interface Report {
  meta: {
    title: string;
    edition: string;
    publisher: string;
    publisherTagline: string;
    seriesLabel: string;
    sourceCitation: string;
    footer: string;
    brandImages: { monogram: string; productLogo: string };
  };
  overview: {
    readme: string;
    kicker: string;
    title: string;
    sub: string;
    objective: { headline: string; body: string };
    methodology: { stats: Stat[]; body: string };
    thesis: { quote: string; body: string };
    modelTiles: { img: string; title: string; desc: string; go: RouteId }[];
    findingsShown: number;
  };
  objectives: {
    kicker: string;
    sub: string;
    whatItIs: string;
    pillars: (Titled & { n: string })[];
    impact: Titled[];
    models: (Titled & { go: RouteId })[];
    researchStats: Stat[];
    qualitative: string;
    quantitative: string;
    agenda: { n: string; t: string; s: string; go: RouteId }[];
  };
  context: {
    kicker: string;
    sub: string;
    choiceDrivers: { items: { l: string; v: number; c: string }[]; source: string };
    brandEquity: { title: string; body: string; footer: string };
    buyerStages: { t: string; s: string; v: string; d: string; trend: 'up' | 'down'; note: string }[];
    effect: { value: string; label: string; body: string; responses: string[] };
    growth: { bars: { label: string; v: number; highlight?: boolean }[]; note: string };
    commoditization: { title: string; body: string };
  };
  regional: {
    kicker: string;
    sub: string;
    defaultRegion: RegionId;
    awarenessIntro: string;
    compareIntro: string;
    compareReading: string;
  };
  index: { kicker: string; sub: string; sourceImage: string; sourceTitle: string; sourceNote: string };
  explorer: { kicker: string; sub: string };
  blueprint: { kicker: string; sub: string; source: string };
  takeouts: { kicker: string; sub: string; thesis: string; winners: string[]; others: string[]; questions: string[] };
  compare: { defaultSelection: string[]; maxSelection: number };
  appendix: {
    kicker: string;
    sub: string;
    defaultDeveloper: string;
    sources: {
      anatomy: { img: string; label: string };
      essence: { img: string; label: string };
      archetypes: { img: string };
    };
    livable: { band: string; regions: string }[];
    methodology: string;
  };
  notesFooter: string;
}
