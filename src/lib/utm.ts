/** Мітки джерела з адреси сторінки: utm_*, fbclid, gclid, ttclid. */
export function utmParams(search = window.location.search): Record<string, string> {
  const out: Record<string, string> = {};
  new URLSearchParams(search).forEach((v, k) => {
    if (k.startsWith('utm_') || k === 'fbclid' || k === 'gclid' || k === 'ttclid') out[k] = v;
  });
  return out;
}
