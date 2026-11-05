import { Fragment, type ReactNode } from 'react';

/**
 * Renders report copy with a tiny, safe subset of Markdown:
 *   **bold**, *italic*, and line breaks. Everything else is plain text.
 */
export function RichText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {inline(line)}
        </Fragment>
      ))}
    </>
  );
}

function inline(s: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    out.push(m[1] != null ? <b key={m.index}>{m[1]}</b> : <em key={m.index}>{m[2]}</em>);
    last = re.lastIndex;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}
