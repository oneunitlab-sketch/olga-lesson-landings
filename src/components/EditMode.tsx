import { useEffect, useState } from 'react';

/**
 * Режим редагування прямо на сторінці (тільки npm run dev).
 * Текст: клік і друкуйте. Картинка/відео: клік → вибір файлу. Кнопка: «🔗» → посилання.
 * Правки зберігаються в src/content/edits.json, файли — в public/uploads.
 */

async function saveEdits(edits: Record<string, unknown>) {
  const r = await fetch('/__edit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ edits }),
  });
  if (!r.ok) throw new Error(await r.text());
}

async function upload(file: File): Promise<string> {
  const r = await fetch('/__upload', {
    method: 'POST',
    headers: { 'x-filename': encodeURIComponent(file.name) },
    body: file,
  });
  if (!r.ok) throw new Error(await r.text());
  return (await r.json()).url;
}

/** HTML редагованого елемента → текст з розміткою **жирне** / *акцент*. */
function serialize(el: HTMLElement, rich: boolean): string {
  const clean = (s: string) => s.replace(/\s+/g, ' ');
  // textContent, не innerText: innerText повертає текст з CSS uppercase
  if (!rich) return clean(el.textContent ?? '').trim();
  let out = '';
  el.childNodes.forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE) out += n.textContent ?? '';
    else if (n instanceof HTMLElement) {
      const t = n.textContent ?? '';
      if (n.tagName === 'B' || n.tagName === 'STRONG') out += `**${t}**`;
      else if (n.tagName === 'EM' || n.tagName === 'I') out += `*${t}*`;
      else out += t;
    }
  });
  return clean(out).trim();
}

function pickFile(accept: string): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.click();
  });
}

const store = {
  get: (k: string) => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { sessionStorage.setItem(k, v); } catch { /* приватний режим */ } },
};

export function EditMode() {
  const [on, setOn] = useState(() => store.get('editMode') === '1');
  const [status, setStatus] = useState('');

  // після збереження сторінка перезавантажується — повертаємо режим і позицію скролу
  useEffect(() => {
    const y = Number(store.get('editScroll'));
    if (y) requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior }));
    const save = () => store.set('editScroll', String(window.scrollY));
    window.addEventListener('beforeunload', save);
    return () => window.removeEventListener('beforeunload', save);
  }, []);

  useEffect(() => {
    store.set('editMode', on ? '1' : '0');
  }, [on]);

  useEffect(() => {
    document.documentElement.classList.toggle('editing', on);
    if (!on) {
      document.querySelectorAll<HTMLElement>('[data-edit]').forEach((el) => el.removeAttribute('contenteditable'));
      document.querySelectorAll('.url-chip').forEach((c) => c.remove());
      return;
    }

    const flash = (s: string) => {
      setStatus(s);
      window.setTimeout(() => setStatus(''), 1800);
    };
    const commit = async (edits: Record<string, unknown>) => {
      try {
        setStatus('Зберігаю…');
        await saveEdits(edits);
        flash('✓ Збережено');
      } catch (e) {
        setStatus('Помилка збереження: ' + (e as Error).message);
      }
    };

    // текстові поля + чипи посилань (повторно — після кожного перерендеру)
    const arm = () => {
      document.querySelectorAll<HTMLElement>('[data-edit]').forEach((el) => {
        if (el.dataset.armed) return;
        el.dataset.armed = '1';
        el.contentEditable = 'true';
        el.spellcheck = false;
        el.dataset.orig = serialize(el, el.hasAttribute('data-rich'));
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') { e.preventDefault(); el.blur(); }
        });
        el.addEventListener('blur', () => {
          if (!document.documentElement.classList.contains('editing')) return;
          const value = serialize(el, el.hasAttribute('data-rich'));
          if (value === el.dataset.orig) return;
          el.dataset.orig = value;
          commit({ [el.dataset.edit!]: value });
        });
      });
      document.querySelectorAll<HTMLElement>('[data-edit-url]').forEach((a) => {
        if (a.querySelector('.url-chip')) return;
        const chip = document.createElement('span');
        chip.className = 'url-chip';
        chip.contentEditable = 'false';
        chip.textContent = '🔗 посилання';
        chip.title = a.getAttribute('href') ?? '';
        chip.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const url = window.prompt('Посилання кнопки (#access — скрол до блоку, https://… — сайт/Telegram):', a.getAttribute('href') ?? '');
          if (url !== null && url.trim()) commit({ [a.dataset.editUrl!]: url.trim() });
        });
        a.appendChild(chip);
      });
    };
    arm();
    const mo = new MutationObserver(() => arm());
    mo.observe(document.body, { childList: true, subtree: true });

    // кліки: не переходимо за посиланнями, не згортаємо FAQ; картинки/відео — заміна файлу
    const onClick = async (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('.edit-bar')) return;
      if (t.closest('a') || t.closest('summary')) e.preventDefault();

      const vid = t.closest<HTMLElement>('[data-edit-video]');
      const img = t.closest<HTMLElement>('[data-edit-img]');
      if (vid && !t.closest('[data-edit]')) {
        const f = await pickFile('video/*');
        if (!f) return;
        setStatus('Завантажую відео…');
        const url = await upload(f);
        commit({ [vid.dataset.editVideo + '.src']: url, [vid.dataset.editVideo + '.poster']: '' });
      } else if (img && !t.closest('[data-edit]')) {
        const f = await pickFile('image/*');
        if (!f) return;
        setStatus('Завантажую картинку…');
        const url = await upload(f);
        commit({ [img.dataset.editImg!]: url });
      }
    };
    document.addEventListener('click', onClick, true);
    document.querySelectorAll('details').forEach((d) => (d.open = true));

    return () => {
      mo.disconnect();
      document.removeEventListener('click', onClick, true);
      document.querySelectorAll<HTMLElement>('[data-armed]').forEach((el) => {
        delete el.dataset.armed;
        el.removeAttribute('contenteditable');
      });
    };
  }, [on]);

  return (
    <div className="edit-bar">
      {on && (
        <div className="edit-hint">
          Клік по тексту — друкуйте (Enter — зберегти). Клік по картинці/відео — замінити файл.
          «🔗» на кнопці — змінити посилання. <b>**жирне**</b>, <b>*акцент*</b> — розмітка в тексті.
        </div>
      )}
      {status && <div className="edit-status">{status}</div>}
      <button type="button" onClick={() => setOn((v) => !v)}>
        {on ? '✓ Готово' : '✎ Редагувати сторінку'}
      </button>
    </div>
  );
}
