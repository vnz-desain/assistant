/* ============================================================
   GMAIL CENTER — gmail_center.js
   Mirrors Drive Center JS patterns exactly.
   Call gmailInit() when the page becomes active.
============================================================ */

(function () {
  'use strict';

  /* ── Static mock data ── */
  const GMAIL_ACCOUNTS = [
    { id: 'gm1', initials: 'AJ', name: 'AJ', email: 'alex.johnson@gmail.com', active: true },
    { id: 'gm2', initials: 'WK', name: 'Work', email: 'alex.johnson@company.com', active: false },
  ];

  const GMAIL_FILES = [
    { sender: 'GitHub',         initials: 'GH', subject: '[ACTION REQUIRED] Review open PR #412',    category: 'updates',  catLabel: 'Updates',    date: 'Today, 14:30',    status: 'unread' },
    { sender: 'Notion',         initials: 'NO', subject: 'Your weekly workspace digest is ready',     category: 'promo',    catLabel: 'Promotions', date: 'Today, 11:02',    status: 'read' },
    { sender: 'Sarah Miller',   initials: 'SM', subject: 'Re: Q3 budget allocation — final review',   category: 'primary',  catLabel: 'Primary',    date: 'Today, 09:45',    status: 'starred' },
    { sender: 'Vercel',         initials: 'VC', subject: 'Deploy succeeded — dashboard-v2.4.1',       category: 'updates',  catLabel: 'Updates',    date: 'Yesterday',       status: 'read' },
    { sender: 'Google Alerts',  initials: 'GA', subject: 'Alert: "MEA Assistant" — 3 new results',   category: 'updates',  catLabel: 'Updates',    date: 'Yesterday',       status: 'read' },
    { sender: 'LinkedIn',       initials: 'LI', subject: '8 people viewed your profile this week',   category: 'social',   catLabel: 'Social',     date: 'Yesterday',       status: 'unread' },
    { sender: 'Figma',          initials: 'FG', subject: 'Design file "Dashboard v3" was updated',   category: 'forums',   catLabel: 'Forums',     date: 'Jun 02',          status: 'read' },
    { sender: 'AWS',            initials: 'AW', subject: 'Invoice #INV-2024-0602 available',         category: 'primary',  catLabel: 'Primary',    date: 'Jun 02',          status: 'read' },
  ];

  /* ── State ── */
  let gmailAccounts = GMAIL_ACCOUNTS.map(a => ({ ...a }));
  let activeGmailAccount = gmailAccounts.find(a => a.active);

  /* ── Render Account Cards ── */
  function renderGmailAccounts() {
    const container = document.getElementById('gmailAccountCards');
    if (!container) return;
    container.innerHTML = gmailAccounts.map(acc => `
      <div class="drive-account-card ${acc.active ? 'active' : ''}"
           onclick="gmailSelectAccount('${acc.id}')">
        <div class="drive-account-avatar">${acc.initials}</div>
        <div class="drive-account-info">
          <span class="drive-account-name">${acc.name}</span>
          <span class="drive-account-email">${acc.email}</span>
        </div>
      </div>
    `).join('');
  }

  /* ── Render Email Rows ── */
  function renderGmailEmails() {
    const container = document.getElementById('gmailEmailsList');
    if (!container) return;
    container.innerHTML = GMAIL_FILES.map(em => `
      <div class="gmail-email-row ${em.status === 'unread' ? 'unread' : ''}">
        <div class="gmail-sender-cell">
          <div class="gmail-sender-avatar">${em.initials}</div>
          <span class="gmail-email-sender">${em.sender}</span>
        </div>
        <span class="gmail-email-subject">${em.subject}</span>
        <span class="gmail-email-category gmail-cat-${em.category}">${em.catLabel}</span>
        <span class="gmail-email-date">${em.date}</span>
        <div class="gmail-email-status">
          <span class="gmail-status-pill gmail-status-pill--${em.status}">${em.status}</span>
        </div>
      </div>
    `).join('');
  }

  /* ── Public: Select Account ── */
  window.gmailSelectAccount = function (id) {
    gmailAccounts = gmailAccounts.map(a => ({ ...a, active: a.id === id }));
    activeGmailAccount = gmailAccounts.find(a => a.active);
    renderGmailAccounts();
    gmailTriggerSync();
  };

  /* ── Sync animation ── */
  function gmailTriggerSync() {
    const badge = document.getElementById('gmailSyncBadge');
    const label = document.getElementById('gmailSyncLabel');
    if (!badge || !label) return;

    badge.classList.add('syncing');
    label.textContent = 'Syncing…';

    setTimeout(() => {
      badge.classList.remove('syncing');
      label.textContent = 'Synced';
      const now = new Date();
      const t = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
      const el = document.getElementById('gmailLastSync');
      if (el) el.textContent = `Today, ${t}`;
    }, 1800);
  }

  /* ── Public: Refresh ── */
  window.gmailRefresh = function () {
    gmailTriggerSync();
  };

  /* ── Public: Force Sync ── */
  window.gmailForceSync = function () {
    const btn = document.querySelector('#page-gmail .drive-btn-primary');
    if (btn) {
      const original = btn.innerHTML;
      btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 0.8s linear infinite"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg> Syncing…`;
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
        gmailTriggerSync();
      }, 2000);
    }
  };

  /* ── Public: Add Account ── */
  window.gmailAddAccount = function () {
    /* Hook: open account connect flow */
    console.log('[GmailCenter] Add account triggered');
  };

  /* ── Public: Compose ── */
  window.gmailCompose = function () {
    console.log('[GmailCenter] Compose triggered');
  };

  /* ── Public: Search ── */
  window.gmailSearch = function () {
    console.log('[GmailCenter] Search triggered');
  };

  /* ── Public: Open Gmail ── */
  window.gmailOpen = function () {
    window.open('https://mail.google.com', '_blank', 'noopener');
  };

  /* ── Public: View All ── */
  window.gmailOpenAll = function () {
    window.open('https://mail.google.com', '_blank', 'noopener');
  };

  /* ── Init ── */
  window.gmailInit = function () {
    renderGmailAccounts();
    renderGmailEmails();
  };

  /* Auto-init if page is already in DOM */
  if (document.getElementById('page-gmail')) {
    window.gmailInit();
  }

})();

/* ── Spin keyframe (reuse if not already defined) ── */
if (!document.getElementById('gmail-keyframes')) {
  const s = document.createElement('style');
  s.id = 'gmail-keyframes';
  s.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(s);
}
