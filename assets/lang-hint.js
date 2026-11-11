/* Suggerimento "cambia lingua" — una sola volta, alla prima visita.
   Compare solo se: il browser non è in italiano, nessuna lingua è già stata scelta, lo splash non è attivo.
   Testo in inglese e tedesco, con una freccia verso il selettore IT / EN / DE.
   Sparisce da solo, al tocco, allo scroll o appena si sceglie una lingua; poi non torna più (localStorage 'jb77-lang-hint'). */
(function () {
  var KEY = 'jb77-lang-hint';
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function write(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage non disponibile */ } }

  var primary = String((navigator.languages && navigator.languages[0]) || navigator.language || '').toLowerCase();
  if (primary.indexOf('it') === 0) return;
  if (read('jb77-lang') || read(KEY)) return;
  if (document.documentElement.classList.contains('splash-on')) return;

  var sw = document.querySelector('.lang-switcher');
  if (!sw) return;

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

  var tip = document.createElement('div');
  tip.className = 'lang-hint';
  tip.setAttribute('role', 'note');
  tip.innerHTML = '<b>Change language here ↑</b><span>Sprache hier ändern ↑</span>';

  function place() {
    var r = sw.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    tip.style.top = Math.round(r.bottom + 12) + 'px';
    tip.style.right = Math.max(8, Math.round(vw - r.right)) + 'px';
    tip.style.setProperty('--lh-arrow', Math.round(r.width / 2) + 'px');
  }

  var done = false, shown = false, timer = null;
  function hide() {
    if (done) return;
    done = true;
    window.removeEventListener('scroll', follow);
    window.removeEventListener('resize', place);
    if (io) io.disconnect();
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
    write(KEY, '1');
    document.body.appendChild(tip);
    place();
    requestAnimationFrame(function () { tip.classList.add('is-on'); });
    window.addEventListener('scroll', follow, { passive: true });
    window.addEventListener('resize', place);
    timer = setTimeout(hide, 9000);
  }

  // parte solo quando il selettore è davvero visibile (nel /menu è sotto l'intestazione a tutto schermo)
  var io = null, wait = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      var on = entries[0].isIntersecting;
      clearTimeout(wait);
      if (on && !shown) wait = setTimeout(show, 1200);
    }, { threshold: 1 });
    io.observe(sw);
  } else {
    wait = setTimeout(show, 1500);
  }

  tip.addEventListener('click', hide);
  sw.addEventListener('click', hide);
})();
