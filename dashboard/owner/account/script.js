/* ════════════════════════════════════════════════
   Account Center — script.js
   Depth 1: owner/account/script.js
════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Sidebar ── */
  MEASidebar.init();

  /* ── Live Clock ── */
  var clock = document.getElementById('liveClock');
  function pad(v) { return String(v).padStart(2, '0'); }
  function tick() {
    if (!clock) return;
    var n = new Date();
    clock.textContent = pad(n.getHours()) + ':' + pad(n.getMinutes()) + ':' + pad(n.getSeconds());
  }
  tick();
  setInterval(tick, 1000);

  /* ── Lucide icons (after sidebar inject) ── */
  lucide.createIcons();

  /* ── Score bar entrance animation ── */
  var scoreBar = document.querySelector('.ac-score-bar');
  if (scoreBar) {
    scoreBar.style.width = '0%';
    requestAnimationFrame(function () {
      setTimeout(function () {
        scoreBar.style.width = scoreBar.style.getPropertyValue('--score') || '98%';
      }, 200);
    });
  }

});
