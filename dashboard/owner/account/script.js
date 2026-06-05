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

   /* ── Account Center Data ── */
if (window.AccountData) {
  AccountData.load();
}

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


document.addEventListener('mea:account-data-ready', function () {

  const totalAccounts =
      AccountData.gmailAccounts.length +
      AccountData.driveAccounts.length;

  const oauthCount =
      AccountData.oauthServices.length;

  const gmailExists =
      AccountData.gmailAccounts.length > 0;

  const lastSync =
      gmailExists &&
      AccountData.gmailAccounts[0].last_sync
      ? new Date(AccountData.gmailAccounts[0].last_sync).toLocaleString()
      : '--';

  const connectedAccountsEl =
      document.getElementById('connectedAccounts');

  const googleServicesEl =
      document.getElementById('googleServices');

  const oauthCountEl =
      document.getElementById('oauthCount');

  const lastSyncEl =
      document.getElementById('lastSync');

  if (connectedAccountsEl)
      connectedAccountsEl.textContent = totalAccounts;

  if (googleServicesEl)
      googleServicesEl.textContent = 2;

  if (oauthCountEl)
      oauthCountEl.textContent = oauthCount;

  if (lastSyncEl)
      lastSyncEl.textContent = lastSync;

});
