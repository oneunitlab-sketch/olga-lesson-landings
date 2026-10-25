import { useEffect, useRef, useState } from 'react';
import { utmParams } from '../lib/utm';

const SS_SCRIPT = 'https://customer.smartsender.eu/js/client/lp.min.js?v2.0.0';

declare global {
  interface Window {
    ssContext?: { variables: Record<string, string>; scope: Record<string, string>; form: Record<string, string> };
  }
}

/**
 * Попап із віджетом SmartSender (точка входу у воронку, звʼязана з CRM).
 * Перехоплює клік по будь-якій кнопці з href={trigger} і показує віджет замість переходу в Telegram.
 * Якщо JS не спрацює — кнопка працює як раніше, тому посилання в розмітці лишаються без змін.
 *
 * Мітки джерела (utm_*, fbclid і те, з якого ленда прийшов клік) ідуть у віджет через ssContext.scope —
 * скрипт SmartSender кодує їх у ?context= і передає в CRM.
 */
export function WidgetModal({ widgetId, domain, trigger, lp }: { widgetId: string; domain: string; trigger: string; lp: string }) {
  const [open, setOpen] = useState(false);
  // віджет вантажиться при першому відкритті й далі лишається в DOM: скрипт ініціалізує контейнер один раз
  const [started, setStarted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      if (document.documentElement.classList.contains('editing')) return;
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a');
      if (!a || a.getAttribute('href') !== trigger) return;
      e.preventDefault();
      lastFocus.current = a;
      setStarted(true);
      setOpen(true);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [trigger]);

  // ssContext має стояти до скрипта, а контейнер — уже бути в DOM, тому вантажимо після першого рендера
  useEffect(() => {
    if (!started) return;
    const marks = utmParams();
    window.ssContext = { variables: {}, scope: { lp, ...marks, utm_source: marks.utm_source ?? lp }, form: {} };
    const s = document.createElement('script');
    s.src = SS_SCRIPT;
    s.async = true;
    document.body.appendChild(s);
    return () => { s.remove(); };
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
    <div className={`ss-overlay${open ? '' : ' is-off'}`} onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className="ss-dialog" role="dialog" aria-modal="true" aria-label="Отримати безкоштовний урок" ref={dialogRef}>
        <button type="button" className="ss-close" aria-label="Закрити" onClick={() => setOpen(false)}>×</button>
        <div className="ss-box">
          <p className="ss-loading">Завантажуємо форму…</p>
          <div id={widgetId} className="ss-landing" data-target={widgetId} data-domain={domain} />
        </div>
        <a className="ss-fallback" href={trigger} target="_blank" rel="noopener noreferrer">Не відкривається? Перейти в Telegram →</a>
      </div>
    </div>
  );
}
