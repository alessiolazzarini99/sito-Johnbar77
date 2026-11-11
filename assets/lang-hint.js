/* Lingua: rilevamento automatico + suggerimento "cambia lingua". Caricato da home, menu e catering.

   1. Rilevamento: alla prima visita (nessuna lingua scelta a mano) legge le lingue del browser, in ordine.
      La prima tra italiano, inglese, tedesco vince; se non c'è nessuna delle tre (es. francese) si usa l'inglese.
      Il rilevamento non viene salvato come "scelta": la scelta vera è solo un tocco su IT / EN / DE (localStorage 'jb77-lang').
   2. Suggerimento: chi ha il browser non in italiano vede, una sola volta, un fumetto in inglese e tedesco con la freccia verso
      il selettore. Parte quando il selettore è davvero visibile (nel /menu è sotto l'intestazione a tutto schermo).
      Sparisce dopo 9 s, al tocco, allo scroll che lo porta fuori schermo o appena si sceglie una lingua (localStorage 'jb77-lang-hint').
   Prove: ?lang=de|en|it forza la lingua (e la salva); ?hint mostra il suggerimento anche con il browser in italiano e senza salvarlo. */
(function () {
  var KEY = 'jb77-lang-hint', SUP = ['it', 'en', 'de'];
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function write(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage non disponibile */ } }
  function drop(k) { try { localStorage.removeItem(k); } catch (e) { /* storage non disponibile */ } }
  function pick(lang) {
    var b = document.querySelector('.lang-btn[data-lang="' + lang + '"]');
    if (b) b.click();
  }

  var sw = document.querySelector('.lang-switcher');
  if (!sw) return;

  var params = new URLSearchParams(location.search);
  var forced = (params.get('lang') || '').toLowerCase();
  var preview = params.has('hint');
  var saved = read('jb77-lang');

  // lingua del browser: la prima tra it / en / de nell'elenco; nessuna delle tre -> inglese; elenco vuoto -> italiano
  var langs = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || ''];
  var detected = langs.join('').trim() ? 'en' : 'it';
  for (var i = 0; i < langs.length; i++) {
    var c = String(langs[i]).toLowerCase().slice(0, 2);
    if (SUP.indexOf(c) > -1) { detected = c; break; }
  }

  var current = 'it';
  if (SUP.indexOf(forced) > -1) {
    pick(forced);                       // scelta esplicita: la salva la pagina
    current = forced;
  } else if (!saved && detected !== 'it') {
    pick(detected);                     // rilevamento: la pagina lo salva, ma non è una scelta dell'utente
    drop('jb77-lang');
    current = detected;
  } else if (saved && SUP.indexOf(saved) > -1) {
    current = saved;
  }

  // ── suggerimento ──
  if (!preview) {
    if (saved || SUP.indexOf(forced) > -1 || read(KEY)) return;
    if (detected === 'it') return;
  }
  if (document.documentElement.classList.contains('splash-on')) return;

  var css = document.createElement('style');
  css.textContent =
    '.lang-hint{position:fixed;z-index:2000;max-width:min(15rem,calc(100vw - 1rem));box-sizing:border-box;padding:.7rem .95rem;' +
    'background:#070934;border:1px solid #c9a96e;color:#fff;font:400 .72rem/1.45 Poppins,sans-serif;letter-spacing:.02em;text-align:left;' +
    'box-shadow:0 8px 24px rgba(0,0,0,.45);opacity:0;transform:translateY(-6px);transition:opacity .45s ease,transform .45s ease;cursor:pointer}' +
    '.lang-hint.is-on{opacity:1;transform:none}' +
    '.lang-hint b{display:block;color:#e8d5a8;font-weight:500}' +
    '.lang-hint span{display:block;color:rgba(255,255,255,.72)}' +
    '.lang-hint::before{content:"";position:absolute;top:-6px;right:var(--lh-arrow,1.4rem);width:10px;height:10px;margin-right:-5px;' +
    'background:#070934;border-left:1px solid #c9a96e;border-top:1px solid #c9a96e;transform:rotate(45deg)}' +
    '@media (prefers-reduced-motion:reduce){.lang-hint{transition:none}}';
  document.head.appendChild(css);

  var en = 'Change language here ↑', de = 'Sprache hier ändern ↑';
  var tip = document.createElement('div');
  tip.className = 'lang-hint';
  tip.setAttribute('role', 'note');
  tip.innerHTML = current === 'de' ? '<b>' + de + '</b><span>' + en + '</span>' : '<b>' + en + '</b><span>' + de + '</span>';

  function place() {
    var r = sw.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    tip.style.top = Math.round(r.bottom + 12) + 'px';
    tip.style.right = Math.max(8, Math.round(vw - r.right)) + 'px';
    tip.style.setProperty('--lh-arrow', Math.round(r.width / 2) + 'px');
  }

  var done = false, shown = false, timer = null, io = null, wait = null;
  function hide() {
    if (done) return;
    done = true;
    window.removeEventListener('scroll', follow);
    window.removeEventListener('resize', place);
    if (io) io.disconnect();
    clearTimeout(wait);
    clearTimeout(timer);
    tip.classList.remove('is-on');
    setTimeout(function () { if (tip.parentNode) tip.parentNode.removeChild(tip); }, 600);
  }
  // segue il selettore finché resta tutto visibile (nel /menu è nella barra che si aggancia in alto dopo l'intestazione)
  function follow() {
    var r = sw.getBoundingClientRect();
    if (r.top < 0 || r.bottom > window.innerHeight) { hide(); return; }
    place();
  }
  function show() {
    if (done || shown || !document.body) return;
    shown = true;
    if (!preview) write(KEY, '1');
    document.body.appendChild(tip);
    place();
    requestAnimationFrame(function () { tip.classList.add('is-on'); });
    window.addEventListener('scroll', follow, { passive: true });
    window.addEventListener('resize', place);
    timer = setTimeout(hide, 9000);
  }

  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      clearTimeout(wait);
      if (entries[0].isIntersecting && !shown) wait = setTimeout(show, 1200);
    }, { threshold: 1 });
    io.observe(sw);
  } else {
    wait = setTimeout(show, 1500);
  }

  tip.addEventListener('click', hide);
  sw.addEventListener('click', hide);
})();
