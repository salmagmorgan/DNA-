const ICONS = {
  home: '<path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10"/>',
  context: '<path d="M3 3v18h18"/><path d="M7 14l4-5 3 3 5-7"/>',
  map: '<path d="M9 20l-5.5-2.2A1 1 0 013 16.9V5.1a1 1 0 011.4-.9L9 6m0 14l6-2m-6 2V6m6 12l5.5 2.2a1 1 0 001.4-.9V7.4a1 1 0 00-.6-.9L15 4m0 14V4m0 0L9 6"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  users: '<circle cx="9" cy="8" r="3.4"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><circle cx="17.5" cy="9" r="2.6"/><path d="M15.7 14.3c2.4.3 4.3 2.4 4.3 5.3"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/>',
  flag: '<path d="M5 3v18"/><path d="M5 4h12l-3 4 3 4H5"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14z"/><path d="M4 19.5A2.5 2.5 0 016.5 22H20"/>',
  compare: '<path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h4M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M9 3v18M15 3v18"/>',
  objectives: '<circle cx="11" cy="11" r="7"/><circle cx="11" cy="11" r="3"/><path d="M11 4v2.2M11 15.8V18M4 11h2.2M15.8 11H18"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  notes: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>',
  sun: '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',
  menu: '<path d="M3 12h18M3 6h18M3 18h18"/>',
  chevronsLeft: '<path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/>',
  print: '<path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z"/>',
} as const;

export type IconName = keyof typeof ICONS;

/** Inline stroke icon. Markup is a fixed internal string table, never user data. */
export function Icon({ name, size, strokeWidth = 1.8 }: { name: IconName; size?: number; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" width={size} height={size}
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  );
}
