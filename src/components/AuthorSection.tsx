import type { Content } from '../content/landing';
import { StepHeading, ed, edImg } from './ui';

export function AuthorSection({ data }: { data: Content['author'] }) {
  return (
    <section className="sec who-sec">
      <div className="wrap"><StepHeading lines={data.title} path="author.title" className="who-head" /></div>
      <div className="portrait" {...edImg('author.photo.src')}>
        <img src={data.photo.src} alt={data.photo.alt} loading="lazy" decoding="async" />
        <div className="wrap"><h2 className="who-title" {...ed('author.name')}>{data.name}</h2></div>
      </div>
      <div className="wrap">
        <ul className="stats">
          {data.stats.map((s, i) => (
            <li key={i}>
              <b {...ed(`author.stats.${i}.value`)}>{s.value}</b>
              <span {...ed(`author.stats.${i}.text`)}>{s.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
