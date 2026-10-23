# Ольга Гончаренко — ленди безкоштовного уроку

Мобільні ленди (верстались тільки під телефон) для уроку
«Інструкція збільшення прибутку х2–3 за рік для будь-якого сервісного бізнесу».
Усі кнопки ведуть у Telegram-бот: `BOT_URL` у `src/content/landing.ts`.

| Варіант | Живий приклад | Готова збірка | Команда збірки |
|---|---|---|---|
| Короткий | https://olga-lesson-short.vercel.app | `dist-short/` | `npm run build:short` |
| Інший дизайн, світлий | https://olga-lesson-v3.vercel.app | `dist-v3/` | `npm run build:v3` |
| Інший дизайн, темний | https://olga-lesson-v3-dark.vercel.app | `dist-v3dark/` | `npm run build:v3dark` |

Папки `dist-*` — уже зібрані статичні сайти (HTML + JS + CSS + картинки + відео).
Їх можна просто залити на будь-який хостинг або в піддиректорію сайту — шляхи відносні.

## Стек
React 18 + Vite 5 + TypeScript, без бекенду. Варіант обирається змінною `VITE_VARIANT` під час збірки.

## Запуск
```
npm install
npm run dev:short    # http://localhost:5191
npm run dev:v3       # http://localhost:5192
npm run dev:v3dark   # http://localhost:5193
```

## Де що лежить
| Що | Де |
|---|---|
| Усі тексти, посилання, SEO | `src/content/landing.ts` |
| Посилання на бота (усі кнопки) | `landing.ts` → `BOT_URL` |
| Короткий варіант (розмітка / стилі) | `src/ShortApp.tsx` / `src/styles/short.css` |
| Інший дизайн, світлий і темний | `src/App3.tsx` / `src/styles/v3.css` (темна тема — блок `.v3-dark` у кінці файлу) |
| Кольори й шрифти короткого варіанту | `src/styles/tokens.css` |
| Відео-фрагмент уроку (20 с, без звуку, по колу) | `public/video/hero-highlights.mp4` |
| Фото Ольги | `public/images/olga/` |
| Слайди й кадри з уроку | `public/images/video/` |

Розмітка в текстах: `**жирне**`, `*акцент*`.

## Аналітика / пікселі
Не підключені. Додавати в `index.html` (спільний для всіх варіантів).
Кнопки — звичайні `<a href={BOT_URL} target="_blank">`, події кліку можна вішати на них.

`App.tsx` і `dist/` — повна версія (варіант 1, https://olga-lesson.vercel.app), у цю інтеграцію не входить.
