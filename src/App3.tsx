import { useEffect, useRef, useState } from 'react';
import { content, variant } from './content';
import { BOT_URL, WIDGET_ID, WIDGET_DOMAIN, type Cta } from './content/landing';
import { Rich } from './components/ui';
import { VideoPlayer } from './components/VideoPlayer';
import { WidgetModal } from './components/WidgetModal';

/**
 * Версія 3 — світлий «редакційний» дизайн у стилі Instagram-сторіз.
 * Тільки мобільна. Усі класи з префіксом v3-, стилі — src/styles/v3.css.
 */

const isExternal = (url: string) => /^(https?:)?\/\//.test(url) || url.startsWith('tg:') || url.startsWith('mailto:');

function V3Button({ cta, variant = 'solid' }: { cta: Cta; variant?: 'solid' | 'light' }) {
  const ext = isExternal(cta.url);
  return (
    <a
      className={`v3-btn${variant === 'light' ? ' v3-btn--light' : ''}`}
      href={cta.url}
      {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {cta.text}
    </a>
  );
}

function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <header className="v3-head">
      <span className="v3-kicker">{kicker}</span>
      <h2 className="v3-h2">{title}</h2>
    </header>
  );
}

export default function App3() {
  const heroRef = useRef<HTMLElement>(null);
  const finalRef = useRef<HTMLElement>(null);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    document.body.classList.add('v3-body');
    if (variant === 'v3dark') document.body.classList.add('v3-dark');
    document.title = content.seo.title;
    return () => document.body.classList.remove('v3-body', 'v3-dark');
  }, []);

  // нижня панель з кнопкою: після hero, але не поверх фінальної картки
  useEffect(() => {
    const onScroll = () => {
      const hero = heroRef.current;
      const fin = finalRef.current;
      if (!hero || !fin) return;
      const pastHero = hero.getBoundingClientRect().bottom < 0;
      const finalVisible = fin.getBoundingClientRect().top < window.innerHeight;
      setShowBar(pastHero && !finalVisible);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const { hero, author, faq } = content;
  const cases = content.docs.items.filter((c) => !c.title.trim().startsWith('['));
  const stats = author.stats.slice(0, 3);

  return (
    <div className="v3">
      {/* 1 · Верхня панель */}
      <div className="v3-top">
        <span className="v3-brand">{author.name}</span>
        <span className="v3-chip">Безкоштовний урок</span>
      </div>

      <main className="v3-main">
        {/* 2 · Hero з фото */}
        <section className="v3-hero" ref={heroRef}>
          <div className="v3-herovid">
            <VideoPlayer video={hero.video} />
            <div className="v3-stamp" aria-hidden="true">
              <b>х2–3</b>
              <span>за рік</span>
            </div>
          </div>

          <h1 className="v3-h1"><Rich text={hero.title} /></h1>
          <p className="v3-lede">{content.shortLede}</p>
          <V3Button cta={hero.cta} />
          <p className="v3-note">{content.ctaNote}</p>
        </section>

        {/* 4 · Що всередині */}
        <section className="v3-sec" id="inside">
          <SectionHead kicker="Урок" title="Що всередині" />
          <ol className="v3-points">
            {content.lessonPoints.map((p, i) => (
              <li key={p.title} className="v3-card v3-point">
                <span className="v3-num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="v3-h3">{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 5 · Для кого */}
        <section className="v3-sec">
          <SectionHead kicker="Для кого" title="Це для тебе, якщо…" />
          <ul className="v3-card v3-checks">
            {content.who.items.map((t, i) => (
              <li key={i}>
                <span className="v3-tick" aria-hidden="true">✓</span>
                <span><Rich text={t} /></span>
              </li>
            ))}
          </ul>
        </section>

        {/* 6 · Кейси — горизонтальна каруселька */}
        <section className="v3-sec">
          <SectionHead kicker="Кейси" title="Результати учениць" />
          <p className="v3-hint">Гортай вбік →</p>
          <div className="v3-carousel" role="list">
            {cases.map((c) => (
              <article key={c.title} className="v3-card v3-case" role="listitem">
                <span className="v3-pill">{c.format}</span>
                <h3 className="v3-h3">{c.title}</h3>
                <p>{c.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 7 · Автор */}
        <section className="v3-sec">
          <SectionHead kicker="Автор" title="Хто веде урок" />
          <div className="v3-card v3-author">
            <img className="v3-author-photo" src="images/olga/olga-portrait.webp" alt={author.name} width={530} height={817} loading="lazy" />
            <p className="v3-author-name">{author.name}</p>
            <ul className="v3-stats">
              {stats.map((s) => (
                <li key={s.value}>
                  <b>{s.value}</b>
                  <span>{s.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 8 · FAQ */}
        <section className="v3-sec">
          <SectionHead kicker="FAQ" title="Питання" />
          <div className="v3-faq">
            {faq.items.slice(0, 4).map((f) => (
              <details key={f.q} className="v3-card v3-qa">
                <summary>{f.q}<span className="v3-plus" aria-hidden="true" /></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 9 · Фінальна картка */}
        <section className="v3-final" id={content.final.id} ref={finalRef}>
          <p className="v3-final-title"><Rich text={content.manifest.line1} /></p>
          <p className="v3-final-text">{content.manifest.text}</p>
          <V3Button cta={content.final.cta} variant="light" />
        </section>

        <footer className="v3-foot">{content.footer}</footer>
      </main>

      {/* 10 · Нижня панель з кнопкою */}
      <div className={`v3-bar${showBar ? ' is-on' : ''}`} aria-hidden={!showBar}>
        <a className="v3-btn" href={hero.cta.url} tabIndex={showBar ? 0 : -1}
          {...(isExternal(hero.cta.url) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {hero.cta.text}
        </a>
      </div>

      <WidgetModal widgetId={WIDGET_ID} domain={WIDGET_DOMAIN} trigger={BOT_URL} lp={variant} />
    </div>
  );
}
