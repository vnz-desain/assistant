/* MEA Assistant — Dashboard (owner/index.html)
   Modified: counter animation waits for mea:stats-ready event
   from dashboard-stats.js. Falls back to original data-count
   values if the event never fires (e.g. offline / no DB). */

document.addEventListener('DOMContentLoaded', () => {

  // Sidebar init — injects HTML, sets active, wires drawer
  MEASidebar.init();

  // ── Live clock ──────────────────────────────────────────
  const clockEl = document.getElementById('liveClock');
  function updateClock() {
    const n = new Date();
    const pad = v => String(v).padStart(2, '0');
    clockEl.textContent =
      `${pad(n.getHours())}:${pad(n.getMinutes())}:${pad(n.getSeconds())}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // ── Date line ───────────────────────────────────────────
  const dateEl = document.getElementById('dateLine');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  }

  // ── Greeting ────────────────────────────────────────────
  const greetEl = document.getElementById('greeting');
  if (greetEl) {
    const h    = new Date().getHours();
    const part = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    greetEl.textContent = `${part}, Owner`;
  }

  // ── Last login ──────────────────────────────────────────
  const loginEl = document.getElementById('lastLogin');
  if (loginEl) {
    const d = new Date(Date.now() - 2 * 60 * 60 * 1000);
    loginEl.textContent =
      d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' today';
  }

  // ── Stat counter animation ──────────────────────────────
  // Defined once; called either immediately (fallback) or after
  // live data lands via the mea:stats-ready event.
  function runCounterAnimation() {
    document.querySelectorAll('.stat-value[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;

      const start = performance.now();
      const dur   = 900;

      function step(now) {
        const t = Math.min((now - start) / dur, 1);
        const e = 1 - Math.pow(1 - t, 3); // ease-out-cubic
        el.textContent = Math.round(e * target).toLocaleString();
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  // Wait up to 4 s for Supabase data; then fall back to
  // whatever data-count values are already in the HTML.
  let animated = false;

  function animateOnce() {
    if (animated) return;
    animated = true;
    runCounterAnimation();
  }

  document.addEventListener('mea:stats-ready', animateOnce, { once: true });

  // Fallback timer — ensures animation always runs
  setTimeout(animateOnce, 4000);

});
