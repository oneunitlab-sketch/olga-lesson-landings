import type { Content } from '../content/landing';
import { StepHeading, ed, edImg } from './ui';

const num = (i: number) => String(i + 1).padStart(2, '0');

export function QuestionsSection({ data }: { data: Content['questions'] }) {
  return (
    <section className="sec mech">
      <div className="wrap">
        {data.collage.length > 0 && (
          <div className="collage" aria-hidden="true">
            {data.collage.slice(0, 5).map((img, i) => (
              <img key={i} src={img.src} alt="" loading="lazy" decoding="async" {...edImg(`questions.collage.${i}.src`)} />
            ))}
          </div>
        )}
        <StepHeading lines={data.title} path="questions.title" />
        <ol className="qs">
          {data.items.map((q, i) => (
            <li key={i}>
              <span className="tab">{num(i)}</span>
              <h3 {...ed(`questions.items.${i}.title`)}>{q.title}</h3>
              <p {...ed(`questions.items.${i}.text`)}>{q.text}</p>
              {q.chips.length > 0 && (
                <ul className="six">
                  {q.chips.map((c, j) => <li key={j} {...ed(`questions.items.${i}.chips.${j}`)}>{c}</li>)}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
