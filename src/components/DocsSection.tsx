import type { Content } from '../content/landing';
import { StepHeading, ed, edImg } from './ui';

export function DocsSection({ data }: { data: Content['docs'] }) {
  return (
    <section className="sec docs-sec">
      <div className="wrap">
        <StepHeading lines={data.title} path="docs.title" />
        <p className="sec-sub" {...ed('docs.subtitle')}>{data.subtitle}</p>
        <div className="sheets">
          {data.items.map((d, i) => (
            <div className="sheet" key={i}>
              <img className="thumb" src={d.image.src} alt={d.image.alt} loading="lazy" decoding="async" {...edImg(`docs.items.${i}.image.src`)} />
              <span className="lbl" {...ed(`docs.items.${i}.label`)}>{d.label}</span>
              <h3 {...ed(`docs.items.${i}.title`)}>{d.title}</h3>
              <p {...ed(`docs.items.${i}.text`)}>{d.text}</p>
              <div className="ft" {...ed(`docs.items.${i}.format`)}>{d.format}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
