/* ============================================================
   ImpacTrakr logo-mark injector
   Continuous Loop — 2 lobes (dark + sage), transparent background.
   Brand sheet Stefano · 2026-06-22.
   ============================================================ */
(function () {
  var SVG = [
    '<svg viewBox="0 0 100 52" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">',
      // Lobe esquerdo — verde escuro (#1F3A2E)
      '<path d="M 50 26 C 50 6, 14 6, 8 26 C 14 46, 50 46, 50 26 Z"',
        ' fill="none" stroke="#1F3A2E" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />',
      // Lobe direito — verde sage (#7D8F6F)
      '<path d="M 50 26 C 50 6, 86 6, 92 26 C 86 46, 50 46, 50 26 Z"',
        ' fill="none" stroke="#7D8F6F" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />',
    '</svg>'
  ].join('');

  function paint() {
    var marks = document.querySelectorAll('.logo-mark');
    for (var i = 0; i < marks.length; i++) {
      if (!marks[i].querySelector('svg')) {
        marks[i].innerHTML = SVG;
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', paint);
  } else {
    paint();
  }
})();
