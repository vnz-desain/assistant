/* ============================================
   MEA ASSISTANT — UTILS.JS
   Clock, formatting, helpers
   ============================================ */

(function () {
  'use strict';

  /* ---- Live Clock ---- */
  function startClock() {
    const elTime    = document.getElementById('clock-time');
    const elSeconds = document.getElementById('clock-seconds');
    const elDate    = document.getElementById('clock-date');
    const elDay     = document.getElementById('clock-day');

    if (!elTime && !elDate) return;

    const days   = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

    function tick() {
      const now = new Date();
      const hh  = String(now.getHours()).padStart(2, '0');
      const mm  = String(now.getMinutes()).padStart(2, '0');
      const ss  = String(now.getSeconds()).padStart(2, '0');

      if (elTime)    elTime.textContent    = `${hh}:${mm}`;
      if (elSeconds) elSeconds.textContent = ss;
      if (elDay)     elDay.textContent     = days[now.getDay()];
      if (elDate)    elDate.textContent    =
        `${String(now.getDate()).padStart(2,'0')} ${months[now.getMonth()]} ${now.getFullYear()}`;
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ---- Last Login Format ---- */
  function formatRelativeTime(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  /* ---- Mock Stats (replace with real API) ---- */
  function loadOverviewStats() {
    const stats = {
      totalUsers:     142,
      activeUsers:    118,
      pendingUsers:   14,
      rejectedUsers:  10,
      connectedAccts: 3,
      gmailAccounts:  2,
      driveAccounts:  1,
      oauthStatus:    'active',
      activeModels:   4,
      apiKeys:        3,
      dailyRequests:  2841,
      monthlyRequests: 61200,
      telegramStatus: 'connected',
      telegramLastNotif: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    };

    // Inject stats
    inject('stat-total-users',      stats.totalUsers);
    inject('stat-active-users',     stats.activeUsers);
    inject('stat-pending-users',    stats.pendingUsers);
    inject('stat-rejected-users',   stats.rejectedUsers);
    inject('stat-connected-accts',  stats.connectedAccts);
    inject('stat-gmail-accounts',   stats.gmailAccounts);
    inject('stat-drive-accounts',   stats.driveAccounts);
    inject('stat-active-models',    stats.activeModels);
    inject('stat-api-keys',         stats.apiKeys);
    inject('stat-daily-req',        formatNumber(stats.dailyRequests));
    inject('stat-monthly-req',      formatNumber(stats.monthlyRequests));

    // Telegram
    const tgStatus = document.getElementById('telegram-status-value');
    if (tgStatus) {
      const connected = stats.telegramStatus === 'connected';
      tgStatus.innerHTML = connected
        ? `<span class="badge success">Connected</span>`
        : `<span class="badge error">Disconnected</span>`;
    }

    const tgLastNotif = document.getElementById('telegram-last-notif');
    if (tgLastNotif) {
      tgLastNotif.textContent = formatRelativeTime(stats.telegramLastNotif);
    }

    // Last login
    const lastLoginEl = document.getElementById('owner-last-login');
    if (lastLoginEl) {
      lastLoginEl.textContent = formatRelativeTime(new Date().toISOString());
    }
  }

  function inject(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function formatNumber(n) {
    if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
    if (n >= 1000)    return (n/1000).toFixed(1) + 'K';
    return String(n);
  }

  // Expose
  window.MEAUtils = { startClock, loadOverviewStats, formatRelativeTime };

  document.addEventListener('DOMContentLoaded', () => {
    startClock();
    if (document.body.dataset.page === 'overview') {
      loadOverviewStats();
    }
  });
})();
