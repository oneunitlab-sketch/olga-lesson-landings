import type { Content } from '../content/landing';
import { StepHeading, CtaRow, ed, edImg } from './ui';

const num = (i: number) => String(i + 1).padStart(2, '0');

export function InsideSection({ data }: { data: Content['inside'] }) {
  return (
    <section className="sec light" id={data.id}>
      <div className="wrap">
        <StepHeading lines={data.title} path="inside.title" />
        {data.scenes.map((s, i) => (
          // непарні сцени (1, 3, 5): картинки ліворуч, текст праворуч — як в оригіналі
          <div className={`scene${i % 2 === 0 ? ' media-first' : ''}`} key={i}>
            <div className="scene-txt">
              <div className="n">{num(i)}</div>
              <h3 {...ed(`inside.scenes.${i}.title`)}>{s.title}</h3>
              <ul>{s.bullets.map((b, j) => <li key={j} {...ed(`inside.scenes.${i}.bullets.${j}`)}>{b}</li>)}</ul>
            </div>
            <div className="scene-media">
              <div className={`stack ${s.layout}`} style={{ aspectRatio: s.ratio }}>
                {s.images.slice(0, 2).map((img, j) => (
                  <img key={j} className={`shot s${j + 1}`} src={img.src} alt={img.alt} loading="lazy" decoding="async"
                       {...edImg(`inside.scenes.${i}.images.${j}.src`)} />
                ))}
              </div>
            </div>
          </div>
        ))}
        <CtaRow cta={data.cta} path="inside.cta" style={{ marginTop: 'clamp(56px,7vw,96px)' }} />
      </div>
    </section>
  );
}
