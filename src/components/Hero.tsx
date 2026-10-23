import type { Content } from '../content/landing';
import { Rich, CtaRow, ed } from './ui';
import { VideoPlayer } from './VideoPlayer';

export function Hero({ data }: { data: Content['hero'] }) {
  const last = data.ladder.length - 1;
  const ledeOnPlate = data.ledePlacement === 'plate';
  return (
    <header className="hero">
      <div className="blob a" />
      <div className="wrap hero-in">
        <p className={`badge${data.badge.ghost ? ' ghost' : ''}`}>
          {data.badge.icon && <span className="lock" aria-hidden="true">{data.badge.icon}</span>}
          <span {...ed('hero.badge.text')}>{data.badge.text}</span>
        </p>
        <h1>
          {data.titlePre && <span className="pre big" {...ed('hero.titlePre')}>{data.titlePre}</span>}
          <span {...ed('hero.title', true)}><Rich text={data.title} /></span>
        </h1>
        {!ledeOnPlate && <p className="lede" {...ed('hero.lede', true)}><Rich text={data.lede} /></p>}
        {data.ladder.length > 0 && (
          <div className="ladder">
            {data.ladder.map((step, i) => (
              <span key={i} className="ladder-step">
                <b className={i === last ? 'last' : undefined} {...ed(`hero.ladder.${i}`)}>{step}</b>
                {i < last && <i>→</i>}
              </span>
            ))}
          </div>
        )}
      </div>
      <VideoPlayer video={data.video} path="hero.video" />
      {/* підзаголовок на плашці, що наїжджає на відео знизу (як у варіанті 3 референсу) */}
      {ledeOnPlate && <p className="lede-plate" {...ed('hero.lede', true)}><Rich text={data.lede} /></p>}
      <div className="wrap hero-foot">
        <CtaRow cta={data.cta} path="hero.cta" />
      </div>
    </header>
  );
}
