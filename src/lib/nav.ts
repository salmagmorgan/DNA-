import type { RouteId } from './types';
import type { IconName } from '../components/Icon';
import { DEVS } from './data';

export interface NavItem { id: RouteId; label: string; icon: IconName; ct?: number }

export const NAV: { grp: string; items: NavItem[] }[] = [
  {
    grp: 'Report',
    items: [
      { id: 'overview', label: 'Executive Overview', icon: 'home' },
      { id: 'objectives', label: 'Study Objectives', icon: 'objectives' },
      { id: 'context', label: 'Market Context', icon: 'context' },
      { id: 'map', label: 'Regional Scope', icon: 'map' },
      { id: 'index', label: 'Positioning Index', icon: 'target' },
      { id: 'explorer', label: 'Developer Explorer', icon: 'users', ct: DEVS.length },
      { id: 'blueprint', label: 'Market Blueprint', icon: 'grid' },
      { id: 'takeouts', label: 'Key Takeouts', icon: 'flag' },
      { id: 'appendix', label: 'Models & Appendix', icon: 'book' },
    ],
  },
];

export const routeLabel = (id: RouteId) =>
  NAV.flatMap((g) => g.items).find((i) => i.id === id)?.label ?? id.charAt(0).toUpperCase() + id.slice(1);
