import type { CSSProperties } from 'react';
import type { Cta } from '../content/landing';

/**
 * Позначка для режиму редагування на сторінці: шлях до поля в content.
 * rich — поле з розміткою **жирне** / *акцент*.
 */
export const ed = (path: string, rich = false) =>
  ({ 'data-edit': path, ...(rich ? { 'data-rich': '' } : {}) }) as Record<string, string>;
export const edImg = (path: string) => ({ 'data-edit-img': path }) as Record<string, string>;

/** Текст з розміткою: **жирне**, *акцент*. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) return <b key={i}>{p.slice(2, -2)}</b>;
        if (p.length > 2 && p.startsWith('*') && p.endsWith('*')) return <em key={i}>{p.slice(1, -1)}</em>;
        return p;
      })}
    </>
  );
}

/** Заголовок секції «сходинкою»: кожен рядок зсунутий праворуч. */
export function StepHeading({ lines, path, className = '' }: { lines: string[]; path: string; className?: string }) {
  return (
    <h2 className={`step-head gold-head ${className}`.trim()}>
      {lines.map((l, i) => <span key={i} {...ed(`${path}.${i}`)}>{l}</span>)}
    </h2>
  );
}

const isExternal = (url: string) => /^(https?:)?\/\//.test(url) || url.startsWith('tg:') || url.startsWith('mailto:');

/**
 * Головна кнопка. Поведінка за URL:
 *   '#id'        → плавний скрол до блоку
 *   'https://…'  → нова вкладка (Telegram, форма, оплата)
 *   '/page'      → перехід на сторінку
 * path — шлях до {text, url} у content (для редагування на сторінці).
 */
export function Button({ cta, path, id }: { cta: Cta; path?: string; id?: string }) {
  const ext = isExternal(cta.url);
  return (
    <a
      className="btn"
      id={id}
      href={cta.url}
      {...(path ? { 'data-edit-url': `${path}.url` } : {})}
      {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <span {...(path ? ed(`${path}.text`) : {})}>{cta.text}</span>
    </a>
  );
}

export function CtaRow({ cta, path, style }: { cta: Cta; path: string; style?: CSSProperties }) {
  return (
    <div className="cta-row" style={style}>
      <Button cta={cta} path={path} />
    </div>
  );
}
