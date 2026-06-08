/* Plainvest calculator pages — EN/PT language + AUD/USD/BRL currency with FX conversion.
   English is canonical; PT applied client-side. Monetary inputs/outputs convert at live
   indicative rates (fallback to recent static rates). Base values are held in AUD to avoid drift. */
(function () {
  /* ---------- language ---------- */
  var BASE = {
    "Create an account": "Criar uma conta",
    "Create an account →": "Criar uma conta →",
    "Related calculators": "Calculadoras relacionadas",
    "Frequently asked questions": "Perguntas frequentes",
    "Home": "Início", "Simulator": "Simulador", "Inflation": "Inflação",
    "Learn": "Aprender", "Plans": "Planos", "Contact": "Contato",
    "Plainvest is an educational platform — not financial advice. © Plainvest. Future clarity. Smarter decisions.":
      "A Plainvest é uma plataforma educacional — não é consultoria financeira. © Plainvest. Clareza para o futuro. Decisões mais inteligentes."
  };
  function getLang() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q === 'pt' || q === 'en') { try { localStorage.setItem('pv_lang', q); } catch (e) {} return q; }
    try { var s = localStorage.getItem('pv_lang'); if (s === 'pt' || s === 'en') return s; } catch (e) {}
    return 'en';
  }
  function norm(s) { return (s || '').replace(/\s+/g, ' ').trim(); }
  function applyPT() {
    var map = {}, k;
    for (k in BASE) map[k] = BASE[k];
    if (window.CALC_PT) for (k in window.CALC_PT) map[k] = window.CALC_PT[k];
    var sel = 'h1,h2,h3,h4,p,li,label,summary,a.btn,a.btn-ghost,a.head-cta,.eyebrow,.calc-sub,.rlabel,.note,.related a,.flinks a';
    document.querySelectorAll(sel).forEach(function (el) {
      var a = norm(el.textContent), b = norm(el.innerText || '');  /* textContent ignores CSS uppercase; innerText handles block spacing */
      var v = Object.prototype.hasOwnProperty.call(map, a) ? map[a]
            : (Object.prototype.hasOwnProperty.call(map, b) ? map[b] : null);
      if (v != null) el.innerHTML = v;
    });
    document.documentElement.lang = 'pt-BR';
  }

  /* ---------- currency + FX ---------- */
  var LOCALE = { AUD: 'en-AU', USD: 'en-US', BRL: 'pt-BR' };
  var SYM = { AUD: '$', USD: 'US$', BRL: 'R$' };
  var RATE = { AUD: 1, USD: 0.65, BRL: 3.55 };   /* fallback rates per 1 AUD */
  function getCcy() { try { var c = localStorage.getItem('pv_ccy'); if (LOCALE[c]) return c; } catch (e) {} return 'AUD'; }
  var curCcy = getCcy();
  window.pvFmt = function (n) {
    try { return new Intl.NumberFormat(LOCALE[curCcy] || 'en-AU', { style: 'currency', currency: curCcy, maximumFractionDigits: 0 }).format(n); }
    catch (e) { return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n); }
  };
  function moneyEls() { return document.querySelectorAll('[data-money]'); }
  function initBases() {
    moneyEls().forEach(function (el) {
      if (el.dataset.base == null || el.dataset.base === '') {
        var v = parseFloat(el.value); el.dataset.base = isNaN(v) ? '' : String(v); /* authored values are AUD */
      }
    });
  }
  function refreshMoney() {
    moneyEls().forEach(function (el) {
      var b = parseFloat(el.dataset.base);
      if (isNaN(b)) return;
      el.value = Math.round(b * RATE[curCcy] / 10) * 10;
    });
  }
  function updateLabels() {
    moneyEls().forEach(function (el) {
      if (!el.id) return;
      var lab = document.querySelector('label[for="' + el.id + '"]');
      if (lab) lab.innerHTML = lab.innerHTML.replace(/\((?:A\$|US\$|R\$|\$)\)/, '(' + SYM[curCcy] + ')');
    });
  }
  function applyCurrency() {
    refreshMoney();
    updateLabels();
    if (typeof window.pvRecalc === 'function') window.pvRecalc();
  }
  function wireMoneyInputs() {
    moneyEls().forEach(function (el) {
      el.addEventListener('input', function () {           /* user typed in current currency → store AUD base */
        var v = parseFloat(el.value);
        el.dataset.base = isNaN(v) ? '' : String(v / RATE[curCcy]);
      });
    });
  }
  function addNote(lang) {
    var sub = document.querySelector('.calc-sub');
    if (!sub || document.querySelector('.ccy-note')) return;
    var note = document.createElement('div');
    note.className = 'ccy-note';
    note.textContent = (lang === 'pt')
      ? 'Conversões de moeda usam taxas indicativas em tempo real.'
      : 'Currency conversions use live indicative rates.';
    sub.parentNode.insertBefore(note, sub.nextSibling);
  }

  function run() {
    var lang = getLang();
    window.pvLang = lang;          /* expose so each page's calc script can localize its dynamic output */
    if (lang === 'pt') applyPT();
    addNote(lang);
    initBases();
    wireMoneyInputs();

    var cs = document.querySelector('.ccy-select');
    if (cs) {
      cs.value = curCcy;
      cs.addEventListener('change', function () {
        if (!LOCALE[cs.value]) return;
        curCcy = cs.value;
        try { localStorage.setItem('pv_ccy', curCcy); } catch (e) {}
        applyCurrency();
      });
    }
    var ls = document.querySelector('.lang-select');
    if (ls) {
      ls.value = lang;
      ls.addEventListener('change', function () {
        var u = new URL(location.href);
        u.searchParams.set('lang', ls.value === 'pt' ? 'pt' : 'en');
        location.href = u.toString();
      });
    }

    applyCurrency();  /* render in stored currency (AUD = no change) */

    fetch('https://open.er-api.com/v6/latest/AUD')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.rates && d.rates.USD && d.rates.BRL) {
          RATE = { AUD: 1, USD: d.rates.USD, BRL: d.rates.BRL };
          applyCurrency();
        }
      })
      .catch(function () {});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
