import { useEffect, useRef } from 'react';

/** Anything that looks clickable grows the ring. `data-cursor="Label"` shows a hint pill. */
const SELECTOR = [
  'a', 'button', 'input', 'summary', '.tile', '.nav-item', '.chip', '.pill', '.cmdk-item', '.clickable',
  '.devlogo', '.zrect', '.dmark', '.kpi', '[data-dev]', '[style*="cursor: pointer"]',
].join(',');

/** Lagging ring + dot cursor, fine pointers only (mouse / trackpad). */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia?.('(pointer:fine)').matches) return;
    const body = document.body;
    body.classList.add('custom-cursor');
    let rx = 0, ry = 0, tx = 0, ty = 0, raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX; ty = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${tx}px,${ty}px) translate(-50%,-50%)`;
      if (label.current) label.current.style.transform = `translate(${tx}px,${ty}px) translate(14px,14px)`;
    };
    const loop = () => {
      rx += (tx - rx) * 0.2; ry += (ty - ry) * 0.2;
      if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    const closest = (t: EventTarget | null) => (t instanceof Element ? t.closest(SELECTOR) : null);
    const onOver = (e: MouseEvent) => {
      const el = closest(e.target);
      if (!el) return;
      body.classList.add('cursor-hover');
      const hint = el.getAttribute('data-cursor');
      if (hint && label.current) { label.current.textContent = hint; body.classList.add('cursor-label-show'); }
    };
    const onOut = (e: MouseEvent) => {
      if (closest(e.target) && !closest(e.relatedTarget)) body.classList.remove('cursor-hover', 'cursor-label-show');
    };
    const hide = () => { [dot, ring].forEach((r) => r.current && (r.current.style.opacity = '0')); };
    const show = () => { [dot, ring].forEach((r) => r.current && (r.current.style.opacity = '')); };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.documentElement.addEventListener('mouseleave', hide);
    document.documentElement.addEventListener('mouseenter', show);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      body.classList.remove('custom-cursor', 'cursor-hover', 'cursor-label-show');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.documentElement.removeEventListener('mouseleave', hide);
      document.documentElement.removeEventListener('mouseenter', show);
    };
  }, []);

  return (
    <>
      <div id="cursor-ring" ref={ring} />
      <div id="cursor-dot" ref={dot} />
      <div id="cursor-label" ref={label} />
    </>
  );
}
