import type { Content } from '../content/landing';
import { StepHeading, ed } from './ui';

export function FaqSection({ data }: { data: Content['faq'] }) {
  return (
    <section className="sec faq">
      <div className="wrap">
        <StepHeading lines={data.title} path="faq.title" />
        <div className="faq-list">
          {data.items.map((f, i) => (
            <details key={i}>
              <summary><span {...ed(`faq.items.${i}.q`)}>{f.q}</span></summary>
              <p {...ed(`faq.items.${i}.a`)}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
