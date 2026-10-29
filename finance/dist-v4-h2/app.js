// Спільна логіка трьох варіантів ленда лекції «Фінансовий порядок».
// Форма шле ті самі поля, що й оригінальний ленд, на той самий приймач (mgw.bz).
(function () {
  var START = Date.parse('2026-10-30T17:00:00Z'); // 30.10, 19:00 за Києвом (UTC+2)
  var LP = document.documentElement.getAttribute('data-lp') || '';
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  var q = new URLSearchParams(location.search);
  var utm = {};
  UTM_KEYS.forEach(function (k) { utm[k] = q.get(k) || ''; });
  // мітку варіанту додаємо тільки якщо в посиланні її немає — щоб бачити в CRM, з якого ленда заявка
  if (!utm.utm_content) utm.utm_content = 'lp-' + LP;

  /* ---------- таймер до старту ---------- */
  var timers = [].slice.call(document.querySelectorAll('[data-countdown]'));
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  function tick() {
    var d = Math.max(0, START - Date.now());
    var s = Math.floor(d / 1000);
    var parts = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
    timers.forEach(function (t) {
      if (d === 0) { t.classList.add('is-over'); return; }
      ['d', 'h', 'm', 's'].forEach(function (k) {
        var el = t.querySelector('[data-' + k + ']');
        if (el) el.textContent = pad(parts[k]);
      });
    });
    if (d === 0) document.documentElement.classList.add('lecture-started');
  }
  if (timers.length) { tick(); setInterval(tick, 1000); }

  /* нижня кнопка — тільки після першого екрана */
  var hero = document.querySelector('.hero');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      document.documentElement.classList.toggle('sticky-on', !en[0].isIntersecting);
    }).observe(hero);
  } else {
    document.documentElement.classList.add('sticky-on');
  }

  /* ---------- попап із формою ---------- */
  var dlg = document.getElementById('order');
  var form = dlg && dlg.querySelector('form');
  function open(e) {
    if (e) e.preventDefault();
    if (!dlg) return;
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    var first = form.querySelector('input[name="name"]');
    if (first && matchMedia('(hover:hover)').matches) setTimeout(function () { first.focus(); }, 60);
  }
  [].forEach.call(document.querySelectorAll('[data-order]'), function (b) { b.addEventListener('click', open); });
  if (dlg) {
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    [].forEach.call(dlg.querySelectorAll('[data-close]'), function (b) { b.addEventListener('click', function () { dlg.close(); }); });
  }

  if (!form) return;
  UTM_KEYS.forEach(function (k) {
    var i = form.querySelector('input[name="' + k + '"]');
    if (i) i.value = utm[k];
  });

  /* маска телефону: +38 (0XX) XXX-XX-XX */
  var phone = form.querySelector('input[name="phone"]');
  function digits(v) {
    var d = v.replace(/\D/g, '');
    if (d.indexOf('38') === 0) d = d.slice(2); // префікс «+38» з маски
    // вставили повний номер +380… поверх «+38 (0»
    if (d.length > 10) d = d.replace(/^0?380/, '0');
    d = d.replace(/^0+/, '0'); // набрали 0 поверх уже підставленого нуля
    if (d && d[0] !== '0') d = '0' + d;
    return d.slice(0, 10);
  }
  function fmt(d) {
    if (!d) return '';
    var r = '+38 (' + d.slice(0, 3);
    if (d.length >= 3) r += ') ' + d.slice(3, 6);
    if (d.length >= 6) r += '-' + d.slice(6, 8);
    if (d.length >= 8) r += '-' + d.slice(8, 10);
    return r;
  }
  phone.addEventListener('focus', function () { if (!phone.value) phone.value = '+38 (0'; });
  phone.addEventListener('blur', function () { if (digits(phone.value).length <= 1) phone.value = ''; });
  phone.addEventListener('input', function () { phone.value = fmt(digits(phone.value)); });

  var err = form.querySelector('.f-err');
  form.addEventListener('input', function () { if (err) err.hidden = true; });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.querySelector('input[name="name"]');
    var bad = '';
    if (name.value.trim().length < 2) bad = 'Вкажіть, будь ласка, ваше ім’я';
    else if (digits(phone.value).length !== 10) bad = 'Перевірте номер телефону — потрібно 10 цифр';
    if (err) { err.textContent = bad; err.hidden = !bad; }
    if (bad) return;
    var btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Будь ласка, очікуйте…';
    if (window.fbq) fbq('track', 'Lead', { content_name: 'lecture-finance' });
    // даємо пікселю пів секунди відправити подію, потім звичайний POST на приймач
    setTimeout(function () { HTMLFormElement.prototype.submit.call(form); }, 500);
  });
})();
