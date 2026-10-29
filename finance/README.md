# Ольга Гончаренко — ленди безкоштовної лекції «Фінансовий порядок»

Статичні ленди (HTML + CSS + JS, без збірки й без бекенду). Верстались під телефон, на десктопі — колонка по центру.

| Папка | Живий приклад | Що це |
|---|---|---|
| `dist-v4/` | https://olga-finance-v4.vercel.app | Основний довгий ленд, чорний |
| `dist-v4c/` | https://olga-finance-v4c.vercel.app | Перший екран — таблиця фінансів із замком |
| `dist-v4-light/` | https://olga-finance-v4-light.vercel.app | Той самий ленд, світла тема «шампань» |
| `dist-v4-h2/` | https://olga-finance-v4-h2.vercel.app | Заголовок «Ви — CEO чи найдорожчий працівник салону?» |
| `dist-s1/` | https://olga-finance-s1.vercel.app | Короткий: заголовок → відео → кнопка, «Куди зникають гроші салону?» |
| `dist-s2/` | https://olga-finance-s2.vercel.app | Короткий, заголовок «Ви — CEO…» |

Кожна `dist-*` — готовий сайт, шляхи відносні. Деплой на Vercel: **Root Directory = `finance/dist-…`**, Framework Preset = Other, Build і Install Command — вимкнути (Override, порожнє).

## Форма і аналітика
- Усі кнопки відкривають попап `#order` (`src/app.js`). Форма шле POST з полями `name`, `phone`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` на **`https://mgw.bz/olga-goncharenko`** — це приймач зі старого платного ленда. **Для безкоштовної лекції його треба замінити** на реєстрацію / бот / віджет SmartSender (`action` форми в `src/build.py`, змінна `MODAL`).
- `utm_content` автоматично = `lp-<варіант>` (якщо в посиланні його немає) — видно в CRM, з якого ленда заявка.
- Meta Pixel `692219193723921`: `PageView` при відкритті, `Lead` при відправці форми. Google Tag Manager `GTM-53KFVH2D`. Обидва — у `HEAD` в `src/build.py`.
- Таймер рахує до `START` у `src/app.js` (зараз 30.10, 19:00 за Києвом); після нуля зникає разом із нижньою кнопкою.

## Як змінювати
Джерела в `src/`, сайти генеруються скриптом:
```
cd finance/src
python3 build.py
```
Він збирає папки `olga-finance-*` поруч із `src/` (у тому числі платні варіанти v1–v3 і теми). Для цього репозиторію потрібні лише 6 перелічених — їх копіюють у відповідні `dist-*`.

| Що | Де |
|---|---|
| Основний ленд (структура, тексти) | `src/v4.html` |
| Короткий ленд | `src/short.html` |
| Перший екран «таблиця» (v4c) | `src/hero-c.html` |
| Варіанти заголовків (h1–h5, s1/s2) | `HEADLINES` у `src/build.py` |
| Попап форми, FAQ, футер, кейси учениць | `src/build.py` |
| Фірмовий стиль | `src/olga.css`, `src/app.css`; світла тема — `src/themes/light.css` |
| Логіка форми, маска телефону, таймер | `src/app.js` |
| Фото, аватари учениць, декор | `src/img/` |
| Розмите відео з замком | `src/video/locked.mp4` |

Шрифти — Google Fonts (Oswald, Montserrat, Marck Script) як заміна фірмових Bebas Neue Cyrillic / TT Firs Neue.
