import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { baseContent } from './src/content/landing';

const root = dirname(fileURLToPath(import.meta.url));
const EDITS = join(root, 'src/content/edits.json');
const UPLOADS = join(root, 'public/uploads');

const readEdits = (): Record<string, unknown> => {
  try { return JSON.parse(readFileSync(EDITS, 'utf8')); } catch { return {}; }
};
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** SEO з content.seo (з урахуванням правок) → index.html */
const seoFromContent = (): Plugin => ({
  name: 'seo-from-content',
  transformIndexHtml(html) {
    const e = readEdits();
    const seo = {
      title: (e['seo.title'] as string) ?? baseContent.seo.title,
      description: (e['seo.description'] as string) ?? baseContent.seo.description,
      ogImage: (e['seo.ogImage'] as string) ?? baseContent.seo.ogImage,
    };
    return html
      .replace(/%SEO_TITLE%/g, esc(seo.title))
      .replace(/%SEO_DESCRIPTION%/g, esc(seo.description))
      .replace(/%SEO_OG_IMAGE%/g, esc(seo.ogImage));
  },
});

const readBody = (req: NodeJS.ReadableStream): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });

/** Режим редагування на сторінці: збереження правок і завантаження файлів (тільки dev-сервер). */
const inPageEditor = (): Plugin => ({
  name: 'in-page-editor',
  apply: 'serve',
  // правки → повне перезавантаження сторінки (режим і скрол відновлюються)
  handleHotUpdate({ file, server }) {
    if (file === EDITS) {
      server.ws.send({ type: 'full-reload' });
      return [];
    }
  },
  configureServer(server) {
    server.middlewares.use('/__edit', async (req, res) => {
      if (req.method !== 'POST') { res.statusCode = 405; return res.end(); }
      try {
        const { edits } = JSON.parse((await readBody(req)).toString('utf8'));
        const next = { ...readEdits(), ...edits };
        writeFileSync(EDITS, JSON.stringify(next, null, 2) + '\n');
        res.setHeader('Content-Type', 'application/json');
        res.end('{"ok":true}');
      } catch (err) {
        res.statusCode = 400;
        res.end(String(err));
      }
    });
    server.middlewares.use('/__upload', async (req, res) => {
      if (req.method !== 'POST') { res.statusCode = 405; return res.end(); }
      try {
        const raw = decodeURIComponent(String(req.headers['x-filename'] || 'file'));
        const safe = basename(raw).replace(/[^\w.-]+/g, '-').slice(-80);
        const name = `${Date.now()}-${safe}`;
        mkdirSync(UPLOADS, { recursive: true });
        writeFileSync(join(UPLOADS, name), await readBody(req));
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ url: `uploads/${name}` }));
      } catch (err) {
        res.statusCode = 400;
        res.end(String(err));
      }
    });
  },
});

export default defineConfig({
  plugins: [react(), seoFromContent(), inPageEditor()],
  server: { port: 5180 },
});
