/* =============================================================
   ImpacTrakr — shared front-end (lang toggle + chapter nav)
   Used by index.html, process.html, methodology.html, market.html
   ============================================================= */

(function () {
  // ---------- Language toggle (persisted) ----------
  const html = document.documentElement;
  const langButtons = document.querySelectorAll('.lang-toggle button');

  function setLang(lang) {
    html.setAttribute('data-app-lang', lang);
    html.setAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en');
    langButtons.forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    try { localStorage.setItem('impactrakr-lang', lang); } catch (e) {}
    // dispatch event so pages can re-render dynamic content if needed
    document.dispatchEvent(new CustomEvent('impactrakr:lang', { detail: { lang: lang } }));
  }

  let savedLang = null;
  try { savedLang = localStorage.getItem('impactrakr-lang'); } catch (e) {}
  setLang(savedLang || 'pt');

  langButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { setLang(btn.dataset.lang); });
  });

  // ---------- Chapter nav (active state based on body[data-page]) ----------
  // Each page sets <body data-page="visao|processo|metodologia|mercado">
  // and the nav-tab with matching data-target gets `active`.
  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll('.nav-tab').forEach(function (t) {
      t.classList.toggle('active', t.dataset.target === page);
    });
  }
})();
