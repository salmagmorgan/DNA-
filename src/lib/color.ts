export function lerpColor(a: string, b: string, t: number) {
  const ah = parseInt(a.slice(1), 16), bh = parseInt(b.slice(1), 16);
  const ar = (ah >> 16) & 255, ag = (ah >> 8) & 255, ab = ah & 255;
  const br = (bh >> 16) & 255, bg = (bh >> 8) & 255, bb = bh & 255;
  const r = Math.round(ar + (br - ar) * t), g = Math.round(ag + (bg - ag) * t), bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bl})`;
}

/** Anatomy score (0–10) → lavender → indigo → navy. */
export function scoreColor(s: number) {
  const t = s / 10;
  return t <= 0.5 ? lerpColor('#b1a7da', '#4a49a7', t / 0.5) : lerpColor('#4a49a7', '#2b2d6e', (t - 0.5) / 0.5);
}
