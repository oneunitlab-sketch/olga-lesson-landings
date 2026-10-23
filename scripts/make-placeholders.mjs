// Генерує тимчасові картинки-заглушки з пропорціями оригіналу.
// Запуск: node scripts/make-placeholders.mjs  (перезапише SVG у public/images)
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images');
mkdirSync(out, { recursive: true });

const sizes = {
  'collage-1': [978, 680], 'collage-2': [1600, 369], 'collage-3': [1600, 1284],
  'collage-4': [1600, 1294], 'collage-5': [668, 1534],
  'scene-1a': [1600, 446], 'scene-1b': [1600, 652],
  'scene-2a': [764, 1600], 'scene-2b': [903, 1600],
  'scene-3a': [562, 870], 'scene-3b': [1600, 1294],
  'scene-4a': [1600, 1284], 'scene-4b': [1600, 887],
  'scene-5a': [1130, 494], 'scene-5b': [1600, 858],
  'scene-6a': [1600, 638], 'scene-6b': [1600, 689],
  'doc-1': [764, 1600], 'doc-2': [1600, 446], 'doc-3': [1600, 858],
  'doc-4': [1600, 638], 'doc-5': [1600, 1294], 'doc-6': [1600, 369],
};

// «документ»: шапка, рядки тексту — щоб заглушка читалась як скріншот
function doc(name, w, h) {
  const pad = Math.round(Math.min(w, h) * 0.06);
  const fs = Math.round(Math.max(28, Math.min(w, h) * 0.06));
  const rowH = Math.max(18, Math.round(h * 0.045));
  let rows = '';
  for (let y = pad * 2 + fs * 2, i = 0; y < h - pad; y += rowH * 1.9, i++) {
    const rw = (w - pad * 2) * (0.45 + ((i * 37) % 50) / 100);
    rows += `<rect x="${pad}" y="${y.toFixed(0)}" width="${rw.toFixed(0)}" height="${rowH}" rx="${(rowH / 3).toFixed(0)}" fill="#5C0A18"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<rect width="${w}" height="${h}" fill="#3A0510"/>
<rect width="${w}" height="${(pad + fs * 1.6).toFixed(0)}" fill="#4E0814"/>
<text x="${pad}" y="${pad + fs}" font-family="Inter, Arial, sans-serif" font-size="${fs}" font-weight="700" fill="#F2C9CF">${name}</text>
<text x="${w - pad}" y="${pad + fs}" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="${(fs * 0.7).toFixed(0)}" fill="#E8697D">${w}×${h}</text>
${rows}
</svg>`;
}

for (const [name, [w, h]] of Object.entries(sizes)) writeFileSync(join(out, `${name}.svg`), doc(name, w, h));

// портрет 3:4 — силует
writeFileSync(join(out, 'author.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600" viewBox="0 0 1200 1600">
<defs><radialGradient id="g" cx="50%" cy="30%" r="70%"><stop offset="0" stop-color="#6E0A1C"/><stop offset="1" stop-color="#2A020B"/></radialGradient></defs>
<rect width="1200" height="1600" fill="url(#g)"/>
<circle cx="600" cy="520" r="210" fill="#5C0A18"/>
<path d="M200 1600 C220 1080 400 900 600 900 C800 900 980 1080 1000 1600 Z" fill="#5C0A18"/>
<text x="600" y="1500" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="56" fill="#F3DDE0">author · 1200×1600</text>
</svg>`);

console.log(`✓ ${Object.keys(sizes).length + 1} заглушок у ${out}`);
