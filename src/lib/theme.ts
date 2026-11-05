const KEY = 'dna-theme';

export function toggleTheme() {
  const root = document.documentElement;
  const cur = root.getAttribute('data-theme');
  const sysDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const next = cur === 'dark' ? 'light' : cur === 'light' ? 'dark' : sysDark ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem(KEY, next); } catch { /* storage unavailable */ }
}
