import { content, variant } from './content';
import { BOT_URL, WIDGET_ID, WIDGET_DOMAIN } from './content/landing';
import { Button, Rich } from './components/ui';
import { VideoPlayer } from './components/VideoPlayer';
import { StickyCta } from './components/StickyCta';
import { WidgetModal } from './components/WidgetModal';

/** Коротка мобільна версія: hero → 4 теми уроку → що всередині (каруселька карток) → автор → фінальна кнопка. */
export default function ShortApp() {
  const { hero, lessonPoints, inside, author, manifest, final, shortLede, ctaNote } = content;
  const stats = author.stats.slice(0, 3);
  const pad = (n: number) => String(n + 1).padStart(2, '0');

  return (
    <div className="short">
      <main className="s-wrap">
        {/* 1 · HERO */}
        <section className="s-hero">
          <span className="badge s-badge">{hero.badge.text}</span>
          <h1 className="s-h1"><Rich text={hero.title} /></h1>
          <p className="s-lede">{shortLede}</p>
          <VideoPlayer video={hero.video} />
          <div className="s-cta">
            <Button cta={hero.cta} />
            <p className="s-note">{ctaNote}</p>
          </div>
        </section>

        {/* 2 · УСЕРЕДИНІ УРОКУ */}
        <section className="s-sec" id="inside">
          <h2 className="s-h2">Про що урок</h2>
          <ol className="s-points">
            {lessonPoints.map((p, i) => (
              <li key={p.title} className="s-point">
                <span className="s-num">{pad(i)}</span>
                <div>
                  <h3 className="s-point-title">{p.title}</h3>
                  <p className="s-point-text">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 3 · ЩО ВСЕРЕДИНІ — слайди з уроку, гортаються вбік */}
        <section className="s-sec">
          <h2 className="s-h2">Що всередині</h2>
          <p className="s-hint">Гортай вбік →</p>
          <div className="s-scenes">
            {inside.scenes.map((sc) => (
              <article key={sc.title} className="s-scene">
                <div className="s-scene-body">
                  <h3 className="s-scene-title">{sc.title}</h3>
                  <ul className="s-scene-list">
                    {sc.bullets.map((b) => <li key={b}><Rich text={b} /></li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 4 · АВТОР */}
        <section className="s-sec s-author">
          <div className="s-author-head">
            <img className="s-author-photo" src="images/olga/olga-blazer.webp" alt={author.name} width={658} height={756} loading="lazy" />
            <div className="s-author-cap">
              <p className="s-author-kicker">Авторка уроку</p>
              <p className="s-author-name">{author.name}</p>
            </div>
          </div>
          <ul className="s-stats">
            {stats.map((s) => (
              <li key={s.value}>
                <b className="s-stat-value">{s.value}</b>
                <span className="s-stat-text">{s.text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 5 · ФІНАЛ */}
        <section className="s-sec s-final" id={final.id}>
          <h2 className="s-final-title"><Rich text={manifest.line2} /></h2>
          <div className="s-cta">
            <Button cta={final.cta} />
            <p className="s-note">{ctaNote}</p>
          </div>
        </section>
      </main>

      <StickyCta cta={hero.cta} showAfter={500} targetId={final.id} />
      <WidgetModal widgetId={WIDGET_ID} domain={WIDGET_DOMAIN} trigger={BOT_URL} lp={variant} />
    </div>
  );
}
