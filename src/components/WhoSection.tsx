import type { Content } from '../content/landing';
import { Rich, StepHeading, ed } from './ui';

const num = (i: number) => String(i + 1).padStart(2, '0');

export function WhoSection({ data }: { data: Content['who'] }) {
  return (
    <section className="sec who">
      <div className="wrap">
        <StepHeading lines={data.title} path="who.title" />
        <ol className="marks">
          {data.items.map((t, i) => (
            <li key={i}>
              <span className="n">{num(i)}</span>
              <p {...ed(`who.items.${i}`, true)}><Rich text={t} /></p>
            </li>
          ))}
        </ol>
        <p className="marks-end" {...ed('who.outro', true)}><Rich text={data.outro} /></p>
      </div>
    </section>
  );
}
