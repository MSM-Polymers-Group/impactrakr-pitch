/* ============================================================
   ImpacTrakr logo-mark injector (v3)
   Injects the OFFICIAL client PNG (assets/logo-mark.png) inside
   every .logo-mark placeholder. Transparent background, 359x397
   source (portrait), rendered at whatever size the .logo-mark
   container defines in shared.css.

   Source of truth for the mark is the PNG file — the two SVGs
   in this folder (logo-mark.svg / logo-full.svg) are approximate
   vector references and NOT used by the site.

   Wordmark stays as HTML text next to the mark in the header,
   so it inherits Manrope from the site.
   ============================================================ */
(function () {
  var MARK = '<img src="assets/logo-mark.png" alt="" aria-hidden="true" />';

  function paint() {
    var marks = document.querySelectorAll('.logo-mark');
    for (var i = 0; i < marks.length; i++) {
      if (!marks[i].querySelector('img, svg')) {
        marks[i].innerHTML = MARK;
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', paint);
  } else {
    paint();
  }
})();
