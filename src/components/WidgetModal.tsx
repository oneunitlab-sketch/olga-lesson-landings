import { useEffect, useRef, useState } from 'react';
import { utmParams } from '../lib/utm';

const SS_HOST = 'customer.smartsender.eu';
const SS_SCRIPT = `https://${SS_HOST}/js/client/lp.min.js?v2.0.0`;
/** Сторінка віджета — те саме, що в попапі, але окремим документом: запасний шлях, якщо попап не відкрився. */
const widgetPage = (id: string, domain: string) => `https://${domain}.${SS_HOST}/lp/${id}`;

declare global {
  interface Window {
    ssContext?: { variables: Record<string, string>; scope: Record<string, string>; form: Record<string, string> };
  }
}

/** Прогріває зʼєднання з SmartSender, щоб скрипт і сам віджет не починали з DNS та TLS. */
function preconnect(domain: string) {
  for (const href of [`https://${SS_HOST}`, `https://${domain}.${SS_HOST}`]) {
    if (document.querySelector(`link[rel="preconnect"][href="${href}"]`)) continue;
    const l = document.createElement('link');
    l.rel = 'preconnect';
    l.href = href;
    l.crossOrigin = '';
    document.head.appendChild(l);
  }
}

/**
 * Попап із віджетом SmartSender (точка входу у воронку, звʼязана з CRM).
 * Перехоплює клік по будь-якій кнопці з href={trigger} і показує віджет замість переходу в Telegram.
 * Посилання в розмітці лишаються без змін, тому ctrl/cmd-клік працює як раніше.
 *
 * Віджет (це iframe зі своїм SPA) вантажиться довго, тому починаємо завантаження заздалегідь —
 * на простої після відкриття сторінки, а не на кліку. Попап уже в DOM і лише прихований:
 * розмонтувати його не можна, інакше скрипт довантажував би віджет щоразу наново.
 *
 * Мітки джерела (utm_*, fbclid і з якого ленда клік) ідуть через ssContext.scope —
 * скрипт SmartSender кодує їх у ?context= і передає в CRM.
 */
export function WidgetModal({ widgetId, domain, trigger, lp }: { widgetId: string; domain: string; trigger: string; lp: string }) {
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  // прогрів: зʼєднання одразу, завантаження — щойно головний контент перестане боротися за мережу
  useEffect(() => {
    preconnect(domain);
    const start = () => setStarted(true);
    const idle = window.requestIdleCallback;
    if (idle) {
      const id = idle(start, { timeout: 2500 });
      return () => window.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(start, 1200);
    return () => clearTimeout(t);
  }, [domain]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      if (document.documentElement.classList.contains('editing')) return;
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a');
      if (!a || a.getAttribute('href') !== trigger) return;
      e.preventDefault();
      lastFocus.current = a;
      setStarted(true); // якщо клік стався раніше за прогрів
      setOpen(true);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [trigger]);

  // ssContext має стояти до скрипта, а контейнер — уже бути в DOM, тому вставляємо скрипт після рендера
  useEffect(() => {
    if (!started) return;
    const marks = utmParams();
    window.ssContext = { variables: {}, scope: { lp, ...marks, utm_source: marks.utm_source ?? lp }, form: {} };
    if (document.querySelector(`script[src="${SS_SCRIPT}"]`)) return;
    const s = document.createElement('script');
    s.src = SS_SCRIPT;
    s.async = true;
    document.body.appendChild(s);
  }, [started, lp]);

  // Esc, блокування прокрутки сторінки, повернення фокуса
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus());
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      lastFocus.current?.focus();
    };
  }, [open]);

  if (!started) return null;

  return (
    <div className={`ss-overlay${open ? '' : ' is-off'}`} aria-hidden={!open}
         onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className="ss-dialog" role="dialog" aria-modal="true" aria-label="Отримати безкоштовний урок" ref={dialogRef}>
        <button type="button" className="ss-close" aria-label="Закрити" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>×</button>
        <div className="ss-box">
          <p className="ss-loading">Завантажуємо форму…</p>
          <div id={widgetId} className="ss-landing" data-target={widgetId} data-domain={domain} />
        </div>
        <a className="ss-fallback" href={widgetPage(widgetId, domain)} target="_blank" rel="noopener noreferrer"
           tabIndex={open ? 0 : -1}>Не відкривається? Відкрити форму окремо →</a>
      </div>
    </div>
  );
}
