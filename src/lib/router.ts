/* Tiny hash router: #/explorer/tmg → { route:'explorer', param:'tmg' }.
   Hash routing keeps deep links shareable on any static host with no server config. */
import { useEffect, useState } from 'react';
import type { RouteId } from './types';

export interface RouteState { route: RouteId; param: string | null }

export const ROUTES: RouteId[] = [
  'overview', 'objectives', 'context', 'map', 'index', 'explorer', 'blueprint', 'takeouts', 'appendix', 'compare',
];

export function parseHash(hash: string): RouteState {
  const [r, p] = hash.replace(/^#\/?/, '').split('/');
  const route = (ROUTES as string[]).includes(r) ? (r as RouteId) : 'overview';
  return { route, param: p ? decodeURIComponent(p) : null };
}

export function hrefFor(route: RouteId, param?: string | null) {
  return `#/${route}${param ? `/${encodeURIComponent(param)}` : ''}`;
}

export function go(route: RouteId, param?: string | null) {
  const next = hrefFor(route, param);
  if (window.location.hash === next) window.scrollTo(0, 0);
  else window.location.hash = next;
}

export function useRoute(): RouteState {
  const [state, setState] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => { setState(parseHash(window.location.hash)); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return state;
}
