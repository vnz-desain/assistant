/* MEA Assistant — Dashboard (owner/index.html) */

document.addEventListener('DOMContentLoaded', () => {

  // Sidebar init — injects HTML, sets active, wires drawer
  MEASidebar.init();

  // Live clock
  const clockEl = document.getElementById('liveClock');
  function updateClock() {
    const n = new Date();
    const pad = v => String(v).padStart(2, '0');
    clockEl.textContent = `${pad(n.getHours())}:${pad(n.getMinutes())}:${pad(n.getSeconds())}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Date line
  const dateEl = document.getElementById('dateLine');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  // Greeting
  const greetEl = document.getElementById('greeting');
  if (greetEl) {
    const h = new Date().getHours();
    const part = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    greetEl.textContent = `${part}, Owner`;
  }

  // Last login
  const loginEl = document.getElementById('lastLogin');
  if (loginEl) {
    const d = new Date(Date.now() - 2 * 60 * 60 * 1000);
    loginEl.textContent = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' today';
  }

  // Stat counter animation
  document.querySelectorAll('.stat-value[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const start  = performance.now();
    const dur    = 900;
    function step(now) {
      const t = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - t, 3); // ease-out-cubic
      el.textContent = Math.round(e * target).toLocaleString();
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });

});
