import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Content } from '../content/landing';
import { utmParams } from '../lib/utm';

type Lead = Content['lead'];
type Status = 'idle' | 'sending' | 'sent' | 'error';

/** +1 (XXX) XXX-XXXX з будь-якого введення */
function formatUsPhone(raw: string) {
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('1')) d = d.slice(1);
  d = d.slice(0, 10);
  if (!d) return '';
  let out = '+1 (' + d.slice(0, 3);
  if (d.length >= 3) out += ') ' + d.slice(3, 6);
  if (d.length >= 6) out += '-' + d.slice(6, 10);
  return out;
}
const phoneDigits = (v: string) => v.replace(/\D/g, '').replace(/^1/, '');

/**
 * Попап із формою заявки. Відкривається кліком по будь-якому посиланню на «#lead».
 * Заявка йде POST-запитом з JSON на content.lead.endpoint.
 */
export function LeadModal({ lead }: { lead: Lead }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [contact, setContact] = useState(lead.contactOptions[0]);
  const [telegram, setTelegram] = useState('');
  const [state, setState] = useState('');
  const [situation, setSituation] = useState(lead.situationOptions[0]);
  const [touched, setTouched] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  // будь-яка кнопка з href="#lead" відкриває форму
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (document.documentElement.classList.contains('editing')) return;
      const a = (e.target as HTMLElement).closest('a[href="#lead"]');
      if (!a) return;
      e.preventDefault();
      lastFocus.current = a as HTMLElement;
      setOpen(true);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Esc, блокування прокрутки, фокус у формі
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLInputElement>('input')?.focus());
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      lastFocus.current?.focus();
    };
  }, [open]);

  const isTelegram = contact === 'Telegram';
  const nameOk = name.trim().length >= 2;
  const phoneOk = phoneDigits(phone).length === 10;
  const stateOk = state.trim().length >= 2;
  const valid = nameOk && phoneOk && stateOk;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!valid || status === 'sending') return;
    if (!lead.endpoint) { setStatus('error'); return; }
    setStatus('sending');
    try {
      const r = await fetch(lead.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          contactMethod: contact,
          telegram: isTelegram ? telegram.trim() : '',
          state: state.trim(),
          situation,
          page: window.location.href,
          createdAt: new Date().toISOString(),
          ...utmParams(),
        }),
      });
      if (!r.ok) throw new Error(String(r.status));
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  if (!open) return null;

  return (
    <div className="lead-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className="lead-dialog" role="dialog" aria-modal="true" aria-labelledby="lead-title" ref={dialogRef}>
        <button type="button" className="lead-close" aria-label="Закрыть" onClick={() => setOpen(false)}>×</button>

        {status === 'sent' ? (
          <div className="lead-done">
            <div className="lead-check" aria-hidden="true">✓</div>
            <h2 id="lead-title" className="lead-title">{lead.successTitle}</h2>
            <p className="lead-sub">{lead.successText}</p>
            <button type="button" className="btn lead-submit" onClick={() => setOpen(false)}>Закрыть</button>
          </div>
        ) : (
          <form className="lead-form" onSubmit={submit} noValidate>
            <h2 id="lead-title" className="lead-title">{lead.title}</h2>
            <p className="lead-sub">{lead.subtitle}</p>

            <label className="lead-field">
              <span className="lead-label">{lead.nameLabel}</span>
              <input id="lead-name" type="text" autoComplete="name" placeholder={lead.namePlaceholder}
                     value={name} onChange={(e) => setName(e.target.value)} aria-invalid={touched && !nameOk} />
              {touched && !nameOk && <span className="lead-err">Укажи имя</span>}
            </label>

            <label className="lead-field">
              <span className="lead-label">{lead.phoneLabel}</span>
              <input id="lead-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+1 (___) ___-____"
                     value={phone} onChange={(e) => setPhone(formatUsPhone(e.target.value))} aria-invalid={touched && !phoneOk} />
              {touched && !phoneOk && <span className="lead-err">Нужен номер из 10 цифр</span>}
            </label>

            <fieldset className="lead-field">
              <legend className="lead-label">{lead.contactLabel}</legend>
              {lead.contactOptions.map((o) => (
                <label key={o} className="lead-radio">
                  <input type="radio" name="lead-contact" value={o} checked={contact === o} onChange={() => setContact(o)} />
                  <span>{o}</span>
                </label>
              ))}
            </fieldset>

            {isTelegram && (
              <label className="lead-field">
                <span className="lead-label">{lead.telegramLabel}</span>
                <input id="lead-telegram" type="text" autoComplete="off" placeholder={lead.telegramPlaceholder}
                       value={telegram} onChange={(e) => setTelegram(e.target.value)} />
              </label>
            )}

            <label className="lead-field">
              <span className="lead-label">{lead.stateLabel}</span>
              <input id="lead-state" type="text" autoComplete="address-level1" placeholder={lead.statePlaceholder}
                     value={state} onChange={(e) => setState(e.target.value)} aria-invalid={touched && !stateOk} />
              {touched && !stateOk && <span className="lead-err">Укажи штат</span>}
            </label>

            <fieldset className="lead-field">
              <legend className="lead-label">{lead.situationLabel}</legend>
              {lead.situationOptions.map((o) => (
                <label key={o} className="lead-radio">
                  <input type="radio" name="lead-situation" value={o} checked={situation === o} onChange={() => setSituation(o)} />
                  <span>{o}</span>
                </label>
              ))}
            </fieldset>

            {status === 'error' && (
              <p className="lead-error-box" role="alert">
                {lead.errorText}{' '}
                <a href={lead.fallbackUrl} target="_blank" rel="noopener noreferrer">Написать в Telegram →</a>
              </p>
            )}

            <button type="submit" className="btn lead-submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Отправляю…' : lead.submit}
            </button>
            <p className="lead-note">{lead.note}</p>
          </form>
        )}
      </div>
    </div>
  );
}
