/* Marks a Premium guide as "read" in localStorage when its page loads, so the member
   hub/profile progress (which reads localStorage 'pv_read_guides') reflects opened guides. */
(function () {
  var MAP = {
    '00-premium-member-start-here.html': 'welcome',
    '01-investment-paths-guide.html': 'guides',
    '02-dca-method-guide.html': 'dca',
    '03-exchange-and-platform-setup-checklist.html': 'exchange',
    '04-crypto-and-self-custody-guide.html': 'crypto',
    '05-bitcoin-research-section.html': 'bitcoin',
    '06-books-and-reading-path.html': 'books',
    '07-chart-reading-and-research-tools.html': 'tools',
    '08-crypto-cycle-lessons.html': 'cycles',
    '09-zoom-call-preparation.html': 'zoom',
    '10-research-sources.html': 'references',
    '11-australian-tax-cgt-basics.html': 'tax',
    '12-superannuation-basics.html': 'super',
    '13-australian-platform-comparison.html': 'platforms',
    '14-glossary-60-key-terms.html': 'glossary',
    '15-first-trade-walkthrough.html': 'firsttrade',
    '16-inflation-and-purchasing-power.html': 'inflation',
    '17-market-sentiment-fear-and-greed.html': 'sentiment',
    '18-dont-panic-sell.html': 'panicsell'
  };
  try {
    var fname = (location.pathname.split('/').pop() || '').toLowerCase();
    var key = MAP[fname];
    if (!key) return;
    var raw = localStorage.getItem('pv_read_guides');
    var arr = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(arr)) arr = [];
    if (arr.indexOf(key) < 0) { arr.push(key); localStorage.setItem('pv_read_guides', JSON.stringify(arr)); }
  } catch (e) {}
})();
