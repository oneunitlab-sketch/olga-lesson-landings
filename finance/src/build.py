"""Збирає три варіанти ленда лекції «Фінансовий порядок» зі спільних шматків.

Шаблони: olga-finance-shared/v1.html, v2.html, v3.html → olga-finance-v1/index.html тощо.
Запуск: python3 olga-finance-shared/build.py
"""
import pathlib
import shutil

ROOT = pathlib.Path(__file__).resolve().parent
OUT = ROOT.parent

HEAD = """<link rel="icon" href="img/favicon.svg" type="image/svg+xml">
<!-- Google Tag Manager (той самий контейнер, що на оригінальному ленді) -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-53KFVH2D');</script>
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '692219193723921');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=692219193723921&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->"""

TIMER = ('<div class="timer" data-countdown aria-label="До кінця акції">'
         '<div class="u"><b data-d>00</b><small>днів</small></div><i>:</i>'
         '<div class="u"><b data-h>00</b><small>год</small></div><i>:</i>'
         '<div class="u"><b data-m>00</b><small>хв</small></div><i>:</i>'
         '<div class="u"><b data-s>00</b><small>сек</small></div></div>')

MODAL = """<dialog class="order" id="order" aria-labelledby="order-t">
  <div class="order-in">
    <button class="x" type="button" data-close aria-label="Закрити">×</button>
    <h3 id="order-t">Бронювання місця</h3>
    <p class="when">Лекція «Фінансовий порядок» · Ольга Гончаренко</p>
    <div class="price"><b>379 грн</b><s>2000 грн</s></div>
    {{TIMER}}
    <form action="https://mgw.bz/olga-goncharenko" method="post" novalidate>
      <label>Ваше ім’я<input type="text" name="name" autocomplete="given-name" placeholder="Ваше ім’я" required></label>
      <label>Телефон<input type="tel" name="phone" inputmode="tel" autocomplete="tel" placeholder="+38 (000) 000-00-00" required></label>
      <input type="hidden" name="utm_source"><input type="hidden" name="utm_medium"><input type="hidden" name="utm_campaign"><input type="hidden" name="utm_term"><input type="hidden" name="utm_content">
      <p class="f-err" role="alert" hidden></p>
      <button class="btn wide" type="submit">Перейти до оплати</button>
    </form>
    <p class="gift-line">🎁 + подарунок при оплаті сьогодні: розбір стратегії росту салону «Zmina»</p>
    <p class="note">Оплата карткою Visa / Mastercard на захищеній сторінці. Після оплати отримаєте доступ до закритого Telegram-каналу лекції. Ваші дані конфіденційні та потрібні лише для зв’язку з менеджером.</p>
  </div>
</dialog>""".replace('{{TIMER}}', TIMER)

FOOTER = """<footer class="foot">
  <p><b>Техпідтримка:</b> <a href="mailto:info.goncharenkoo@gmail.com">info.goncharenkoo@gmail.com</a></p>
  <p>65059 Україна, Одеська обл., м. Одеса, Люстдорфська дорога, 52</p>
  <p><a href="https://docs.google.com/document/d/1c2uTeGv-R1-mEwE0ATmOFJX7v--sv085p8x0TMqUFkY/edit?usp=sharing" target="_blank" rel="noopener">Політика конфіденційності</a> · <a href="https://docs.google.com/document/d/1vBvJbn3PtDNR4g0B_FI8pD4bjuF981UL9b78jvgkB04/edit?usp=sharing" target="_blank" rel="noopener">Договір публічної оферти</a></p>
  <p>© olga-goncharenko.com.ua</p>
</footer>"""

# Результати учениць — з оригінального ленда, без змін у цифрах
CASES = [
    ('yulia', 'Юля', '29 років · Київ', '3 → 14 майстрів', 'Делегувала більшість задач', '15% → 35%', '750 000 ₴', '+400 000 ₴'),
    ('oleksii', 'Олексій', '36 років · Київ', '4 → 12 майстрів', 'Керує бізнесом віддалено', '20% → 45%', '660 000 ₴', '+460 000 ₴'),
    ('olena', 'Олена', 'перукар-колорист · Київ', '6 → 10 майстрів', 'Повністю вийшла з роботи майстра', '−5% → 30%', '450 000 ₴', '+290 000 ₴'),
    ('mariana', 'Мар’яна', 'Львів', '2 → 8 майстрів + SMM', 'Вийшла з ролі майстра', '12% → 32%', '320 000 ₴', '+150 000 ₴'),
    ('tania', 'Таня', '28 років · Черкаси', '1 → 4 майстри', 'Структурувала процеси', '5% → 28%', '185 230 ₴', '+115 230 ₴'),
    ('halyna', 'Галина', 'Львів', '5 → 12 майстрів', 'Делегувала бізнес-процеси', '18% → 33%', '485 000 ₴', '+85 000 ₴'),
    ('anastasia', 'Анастасія', '31 рік · Миколаїв', '7 → 12 майстрів', '7 днів на тиждень → 2 рази', '15% → 35%', '660 000 ₴', '+210 000 ₴'),
]


def cases_html(only=None, lazy=True):
    out = []
    rows = CASES if only is None else [c for s in only for c in CASES if c[0] == s]
    for slug, name, meta, team, busy, rent, res, plus in rows:
        out.append(f"""<article class="case">
  <header><img src="img/st-{slug}.webp" alt="" width="56" height="56"{' loading="lazy"' if lazy else ''}><div><h4>{name}</h4><p>{meta}</p></div></header>
  <dl>
    <div><dt>Команда</dt><dd>{team}</dd></div>
    <div><dt>Зайнятість</dt><dd>{busy}</dd></div>
    <div><dt>Рентабельність</dt><dd class="rent">{rent}</dd></div>
    <div class="res"><dt>Дохід</dt><dd>{res} <span>{plus}</span></dd></div>
  </dl>
</article>""")
    return '\n'.join(out)


FAQ = """<details><summary>Як отримати доступ до лекції?</summary><p>Посилання на вхід отримаєте одразу після оплати — це закритий Telegram-канал лекції.</p></details>
<details><summary>Скільки триває лекція?</summary><p>Приблизно 90 хвилин концентрованої, структурованої інформації без «води».</p></details>
<details><summary>Чи буде запис?</summary><p>Так, запис буде доступний 7 днів.</p></details>"""

TOP = ['olena', 'oleksii', 'anastasia']
REST = [c[0] for c in CASES if c[0] not in TOP]

PAY = '''<div class="pay-logos" role="img" aria-label="Підтримка платежів Visa і Mastercard"><span class="pl-t">Підтримка<br>платежів</span><svg class="pl-mc" viewBox="0 0 52 34" aria-hidden="true"><circle cx="17" cy="17" r="15" fill="#eb001b"/><circle cx="35" cy="17" r="15" fill="#f79e1b"/><path d="M26 5a15 15 0 0 1 0 24a15 15 0 0 1 0-24z" fill="#ff5f00"/></svg><span class="pl-visa">VISA</span></div>'''

MODAL_FREE = (MODAL
    .replace('<h3 id="order-t">Бронювання місця</h3>', '<h3 id="order-t">Безкоштовний доступ</h3>')
    .replace('<div class="price"><b>379 грн</b><s>2000 грн</s></div>', '<div class="free"><b>Безкоштовно</b><span>лекція + шаблон таблиці фінансів</span></div>')
    .replace('<button class="btn wide" type="submit">Перейти до оплати</button>', '<button class="btn wide" type="submit">Отримати доступ</button>')
    .replace('🎁 + подарунок при оплаті сьогодні: розбір стратегії росту салону «Zmina»', '🎁 + бонус: розбір стратегії росту салону «Zmina»')
    .replace('Оплата карткою Visa / Mastercard на захищеній сторінці. Після оплати отримаєте доступ до закритого Telegram-каналу лекції.', 'Посилання на лекцію отримаєте одразу після реєстрації.')
    .replace('aria-label="До кінця акції"', 'aria-label="Безкоштовний доступ закриється через"'))
assert '379' not in MODAL_FREE and 'оплат' not in MODAL_FREE.lower(), 'у безкоштовній формі лишилась оплата'
FAQ_FREE = FAQ.replace('Посилання на вхід отримаєте одразу після оплати — це закритий Telegram-канал лекції.', 'Залиште ім’я й телефон — посилання на вхід отримаєте одразу, це закритий Telegram-канал лекції.')

PARTS = {'{{MODAL_FREE}}': MODAL_FREE, '{{FAQ_FREE}}': FAQ_FREE, '{{PAY}}': PAY, '{{CASES_TOP}}': cases_html(TOP), '{{CASES_REST}}': cases_html(REST, lazy=False), '{{HEAD}}': HEAD, '{{TIMER}}': TIMER, '{{MODAL}}': MODAL, '{{FOOTER}}': FOOTER, '{{CASES}}': cases_html(), '{{FAQ}}': FAQ}

for v in ('v1', 'v2', 'v3', 'v4'):
    tpl = ROOT / f'{v}.html'
    if not tpl.exists():
        continue
    html = tpl.read_text()
    for k, val in PARTS.items():
        html = html.replace(k, val)
    assert '{{' not in html, v
    dst = OUT / f'olga-finance-{v}'
    dst.mkdir(exist_ok=True)
    (dst / 'index.html').write_text(html)
    shutil.copy(ROOT / 'app.js', dst / 'app.js')
    shutil.copy(ROOT / 'app.css', dst / 'app.css')
    shutil.copy(ROOT / 'olga.css', dst / 'olga.css')
    shutil.copytree(ROOT / 'img', dst / 'img', dirs_exist_ok=True)
    shutil.copytree(ROOT / 'video', dst / 'video', dirs_exist_ok=True)
    print('built', dst.name)


# Варіанти v4 з іншими першими екранами: блок між <!--HERO--> і <!--/HERO--> замінюється на hero-*.html
base = (OUT / 'olga-finance-v4' / 'index.html').read_text()
for v, hero in (('v4a', 'hero-a.html'), ('v4b', 'hero-b.html'), ('v4c', 'hero-c.html')):
    hp = ROOT / hero
    if not hp.exists():
        continue
    a, b = base.index('<!--HERO-->'), base.index('<!--/HERO-->') + len('<!--/HERO-->')
    html = base[:a] + hp.read_text() + base[b:]
    html = html.replace('data-lp="v4"', f'data-lp="{v}"', 1)
    for k, val in PARTS.items():
        html = html.replace(k, val)
    dst = OUT / f'olga-finance-{v}'
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(OUT / 'olga-finance-v4', dst, ignore=shutil.ignore_patterns('.vercel'))
    (dst / 'index.html').write_text(html)
    print('built', dst.name)


# Дизайн-варіації основного ленда (v4): та сама сторінка + файл теми поверх
THEMES = ('light', 'wine', 'emerald')
for t in THEMES:
    html = (OUT / 'olga-finance-v4' / 'index.html').read_text()
    html = html.replace('data-lp="v4"', f'data-lp="v4-{t}"', 1)
    html = html.replace('</head>', '<link rel="stylesheet" href="theme.css">\n</head>', 1)
    dst = OUT / f'olga-finance-v4-{t}'
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(OUT / 'olga-finance-v4', dst, ignore=shutil.ignore_patterns('.vercel'))
    (dst / 'index.html').write_text(html)
    shutil.copy(ROOT / 'themes' / f'{t}.css', dst / 'theme.css')
    print('built', dst.name)


# Варіанти заголовка/підзаголовка першого екрана v4 (решта сторінки — без змін)
TITLE_OLD = """    <span class="script">Фінансовий</span>
    <h1 class="h c">порядок<br>у салоні</h1>
    <span class="tagline">Безкоштовна лекція для власниць салонів</span>
    <p class="lead">Як перестати працювати більше за своїх майстрів за менші гроші — і почати щомісяця забирати чистий прибуток.</p>"""
TAG = '<span class="tagline">Безкоштовна лекція для власниць салонів</span>'
HEADLINES = {
    # біль: втрата грошей
    'h1': ('Куди зникають', 'гроші<br><span class="g">салону?</span>', 'min(15vw,66px)',
           ('Працюєте більше за своїх майстрів, а на рахунку знову нуль',
            'Покажу, <b>де витікає прибуток</b> і як його повернути')),
    # ідентичність власниці
    'h2': ('Ви — CEO', 'чи найдорожчий<br><span class="g">працівник салону?</span>', 'min(10.6vw,46px)',
           ('Гасите пожежі й тягнете все на собі — для команди ви «мама»',
            'Система, з якою салон «Zmina» став <b>активом на 3+ млн грн/міс</b>')),
    # результат
    'h3': ('Чистий', 'прибуток<br><span class="g">щомісяця</span>', 'min(15vw,66px)',
           ('Бачите оборот, але не знаєте, скільки насправді заробляєте',
            'Таблиця, де <b>чистий прибуток видно за 15 хвилин</b> на день')),
    # цифра
    'h4': ('Мінус', '50 000 грн<br><span class="g">щомісяця</span>', 'min(14.5vw,64px)',
           ('5 фінансових пасток щомісяця з’їдають прибуток салону',
            'Покажу, <b>як закрити кожну</b>, — на прикладі салону з обігом 3+ млн/міс')),
    # мрія
    'h5': ('Салон,', 'який платить<br><span class="g">вам</span>', 'min(14vw,62px)',
           ('Докладаєте з власної кишені на оренду й закупівлі',
            'Фінансова система, де <b>прибуток бачите ви</b>, а не лише майстри')),
}
for v, (script, h1, size, lead) in HEADLINES.items():
    html = (OUT / 'olga-finance-v4' / 'index.html').read_text()
    assert TITLE_OLD in html, 'v4 title block changed'
    new = (f'    <span class="script" style="white-space:nowrap;font-size:min(13.5vw,60px);margin-bottom:2px">{script}</span>\n'
           f'    <h1 class="h c" style="font-size:{size}">{h1}</h1>\n'
           f'    {TAG}\n'
           f'    <div class="lead2"><p class="no"><i>✕</i><span>{lead[0]}</span></p><p class="yes"><i>✓</i><span>{lead[1]}</span></p></div>')
    html = html.replace(TITLE_OLD, new).replace('data-lp="v4"', f'data-lp="v4-{v}"', 1)
    dst = OUT / f'olga-finance-v4-{v}'
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(OUT / 'olga-finance-v4', dst, ignore=shutil.ignore_patterns('.vercel'))
    (dst / 'index.html').write_text(html)
    print('built', dst.name)


# Короткий ленд (заголовок → підзаголовок → закрите відео → кнопка) з меседжами H1 і H2
for v, key in (('s1', 'h1'), ('s2', 'h2')):
    script, h1, size, (no, yes) = HEADLINES[key]
    html = (ROOT / 'short.html').read_text()
    mini = '\n'.join(
        f'<article class="mc"><header><img src="img/st-{c[0]}.webp" alt="" width="46" height="46" loading="lazy"><div><b>{c[1]}</b><span>{c[2]}</span></div></header>'
        f'<div class="rent"><small>Рентабельність</small><strong>{c[5]}</strong></div>'
        f'<div class="row2"><span>{c[3]}</span><b>{c[7]}</b></div></article>'
        for c in [x for s_ in ('olena', 'oleksii', 'anastasia', 'yulia', 'mariana', 'tania') for x in CASES if x[0] == s_])
    html_pre = None
    for k, val in {'{{S_LP}}': v, '{{S_SCRIPT}}': script, '{{S_H1}}': h1, '{{S_SIZE}}': size, '{{S_NO}}': no, '{{S_YES}}': yes, '{{CASES_MINI}}': mini}.items():
        html = html.replace(k, val)
    for k, val in PARTS.items():
        html = html.replace(k, val)
    assert '{{' not in html, v
    dst = OUT / f'olga-finance-{v}'
    dst.mkdir(exist_ok=True)
    (dst / 'index.html').write_text(html)
    for f in ('app.js', 'app.css', 'olga.css'):
        shutil.copy(ROOT / f, dst / f)
    shutil.copytree(ROOT / 'img', dst / 'img', dirs_exist_ok=True)
    shutil.copytree(ROOT / 'video', dst / 'video', dirs_exist_ok=True)
    print('built', dst.name)
