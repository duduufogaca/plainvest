/* Plainvest calculator pages — EN/PT language + AUD/USD/BRL currency.
   Compact dropdowns. English is canonical; PT applied client-side. Currency = display formatting only. */
(function () {
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
      var key = norm(el.innerText || el.textContent);
      if (Object.prototype.hasOwnProperty.call(map, key)) el.innerHTML = map[key];
    });
    document.documentElement.lang = 'pt-BR';
  }
  var CCY = { AUD: ['en-AU', 'AUD'], USD: ['en-US', 'USD'], BRL: ['pt-BR', 'BRL'] };
  function getCcy() { try { var c = localStorage.getItem('pv_ccy'); if (CCY[c]) return c; } catch (e) {} return 'AUD'; }
  var curCcy = getCcy();
  window.pvFmt = function (n) {
    var c = CCY[curCcy] || CCY.AUD;
    try { return new Intl.NumberFormat(c[0], { style: 'currency', currency: c[1], maximumFractionDigits: 0 }).format(n); }
    catch (e) { return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n); }
  };
  function run() {
    var lang = getLang();
    if (lang === 'pt') applyPT();
    var cs = document.querySelector('.ccy-select');
    if (cs) {
      cs.value = curCcy;
      cs.addEventListener('change', function () {
        if (!CCY[cs.value]) return;
        curCcy = cs.value;
        try { localStorage.setItem('pv_ccy', curCcy); } catch (e) {}
        if (typeof window.pvRecalc === 'function') window.pvRecalc();
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
    if (typeof window.pvRecalc === 'function') window.pvRecalc();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
