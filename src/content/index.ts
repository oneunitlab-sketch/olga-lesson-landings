import { baseContent, type Content } from './landing';
import edits from './edits.json';

/** Записує значення за шляхом виду "hero.title" або "who.items.2". */
export function setPath(obj: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split('.');
  let cur: Record<string, unknown> = obj;
  for (const k of keys.slice(0, -1)) {
    if (cur[k] === null || typeof cur[k] !== 'object') return;
    cur = cur[k] as Record<string, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
}

/** Накладає правки «шлях → значення» на копію контенту. */
export function applyEdits(base: Content, overrides: Record<string, unknown>): Content {
  const out = structuredClone(base);
  for (const [path, value] of Object.entries(overrides)) setPath(out as unknown as Record<string, unknown>, path, value);
  return out;
}

/** Ця сторінка — версія 1 шаблону: кнопки ведуть у бота, форми немає. */
const env = import.meta.env.VITE_VARIANT;
/** v1 — повна сторінка; short — коротка; v3 — інший дизайн; v3dark — той самий дизайн у темних кольорах. Обирається при збірці (npm run build / build:short / build:v3 / build:v3dark). */
export const variant: 'v1' | 'v2' | 'short' | 'v3' | 'v3dark' = env === 'short' || env === 'v3' || env === 'v3dark' ? env : 'v1';

/** landing.ts — контент; edits.json — правки з режиму редагування на сторінці. */
export const content = applyEdits(baseContent, edits as Record<string, unknown>);
