/* MEA Assistant — Owner Dashboard script.js */

document.addEventListener('DOMContentLoaded', () => {

  // ── Lucide icons ──
  lucide.createIcons();

  // ── Live clock ──
  const clockEl = document.getElementById('liveClock');
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${h}:${m}:${s}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // ── Date line ──
  const dateEl = document.getElementById('dateLine');
  if (dateEl) {
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = new Date().toLocaleDateString('en-US', opts);
  }

  // ── Greeting ──
  const greetEl = document.getElementById('greeting');
  if (greetEl) {
    const h = new Date().getHours();
    const part = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    greetEl.textContent = `${part}, Owner`;
  }

  // ── Last login ──
  const loginEl = document.getElementById('lastLogin');
  if (loginEl) {
    const d = new Date(Date.now() - 2 * 60 * 60 * 1000);
    loginEl.textContent = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' today';
  }

  // ── Stat counter animation ──
  document.querySelectorAll('.stat-value[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 900;
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });

  // ── Mobile drawer ──
  const menuBtn      = document.getElementById('menuBtn');
  const sidebar      = document.getElementById('sidebar');
  const overlay      = document.getElementById('drawerOverlay');

  function openDrawer() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  menuBtn?.addEventListener('click', openDrawer);
  overlay?.addEventListener('click', closeDrawer);

});
