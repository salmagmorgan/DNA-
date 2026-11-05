import type { ReactNode } from 'react';

export function Drawer({ open, title, children, onClose }: {
  open: boolean; title: ReactNode; children: ReactNode; onClose: () => void;
}) {
  return (
    <>
      <div id="drawer-scrim" className={open ? 'show' : ''} onClick={onClose} />
      <aside id="drawer" className={open ? 'show' : ''} aria-hidden={!open} role="dialog" aria-label={typeof title === 'string' ? title : undefined}>
        <div className="dr-head">
          <h3>{title}</h3>
          <button className="dr-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="dr-body">{children}</div>
      </aside>
    </>
  );
}
