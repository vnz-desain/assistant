/* ============================================================
   ACCOUNT CENTER — account-center.js
   MEA Assistant Dashboard
============================================================ */

/* ── MOCK DATA ── */
const ACCT_DATA = {
  telegramConnected: false,
  telegramUsername: '',
  activeAccountId: null,
  viewMode: 'card', // 'card' | 'table'
  filterStatus: 'all',
  searchQuery: '',

  accounts: [
    {
      id: 'acc-01',
      name: 'Main Workspace',
      email: 'owner@meabusiness.com',
      initial: 'M',
      category: 'UTAMA',
      status: 'active',
      twoFA: true,
      recoveryEmail: 'backup@meabusiness.com',
      recoveryPhone: '+62 812 *** 4890',
      lastLogin: 'Today, 09:14',
      lastSync: 'Today, 14:32',
      oauth: 'Valid',
      totalGmail: '2.9 GB',
      totalDrive: '4.1 GB',
      storageUsed: '8.4 GB',
      connectedApps: 14,
      health: {
        status: 'ok',
        title: 'All Systems Operational',
        sub: 'No anomalies detected',
        checks: [
          { label: 'Login Activity', status: 'ok' },
          { label: 'Recovery Email', status: 'ok' },
          { label: '2FA Status', status: 'ok' },
          { label: 'OAuth Status', status: 'ok' }
        ]
      }
    },
    {
      id: 'acc-02',
      name: 'Business Drive',
      email: 'business@meabusiness.com',
      initial: 'B',
      category: 'BISNIS',
      status: 'active',
      twoFA: true,
      recoveryEmail: 'owner@meabusiness.com',
      recoveryPhone: 'Not set',
      lastLogin: 'Today, 11:45',
      lastSync: 'Today, 11:46',
      oauth: 'Valid',
      totalGmail: '1.2 GB',
      totalDrive: '6.8 GB',
      storageUsed: '8.0 GB',
      connectedApps: 7,
      health: {
        status: 'ok',
        title: 'All Systems Operational',
        sub: 'No anomalies detected',
        checks: [
          { label: 'Login Activity', status: 'ok' },
          { label: 'Recovery Email', status: 'ok' },
          { label: '2FA Status', status: 'ok' },
          { label: 'OAuth Status', status: 'ok' }
        ]
      }
    },
    {
      id: 'acc-03',
      name: 'Personal Account',
      email: 'personal@gmail.com',
      initial: 'P',
      category: 'PRIBADI',
      status: 'warning',
      twoFA: false,
      recoveryEmail: 'owner@meabusiness.com',
      recoveryPhone: '+62 821 *** 7700',
      lastLogin: '2 days ago',
      lastSync: '2 days ago',
      oauth: 'Expiring Soon',
      totalGmail: '4.3 GB',
      totalDrive: '2.1 GB',
      storageUsed: '6.4 GB',
      connectedApps: 3,
      health: {
        status: 'warn',
        title: 'Action Required',
        sub: '2FA disabled, OAuth expiring',
        checks: [
          { label: 'Login Activity', status: 'ok' },
          { label: 'Recovery Email', status: 'ok' },
          { label: '2FA Status', status: 'fail' },
          { label: 'OAuth Status', status: 'warn' }
        ]
      }
    },
    {
      id: 'acc-04',
      name: 'Backup Vault',
      email: 'backup@meabusiness.com',
      initial: 'V',
      category: 'BACKUP',
      status: 'active',
      twoFA: true,
      recoveryEmail: 'owner@meabusiness.com',
      recoveryPhone: '+62 812 *** 4890',
      lastLogin: '5 days ago',
      lastSync: '5 days ago',
      oauth: 'Valid',
      totalGmail: '0.4 GB',
      totalDrive: '1.8 GB',
      storageUsed: '2.2 GB',
      connectedApps: 2,
      health: {
        status: 'ok',
        title: 'All Systems Operational',
        sub: 'No anomalies detected',
        checks: [
          { label: 'Login Activity', status: 'ok' },
          { label: 'Recovery Email', status: 'ok' },
          { label: '2FA Status', status: 'ok' },
          { label: 'OAuth Status', status: 'ok' }
        ]
      }
    },
    {
      id: 'acc-05',
      name: 'Testing Env',
      email: 'testing@meabusiness.com',
      initial: 'T',
      category: 'TESTING',
      status: 'archived',
      twoFA: false,
      recoveryEmail: 'Not set',
      recoveryPhone: 'Not set',
      lastLogin: '30 days ago',
      lastSync: '30 days ago',
      oauth: 'Expired',
      totalGmail: '0.1 GB',
      totalDrive: '0.3 GB',
      storageUsed: '0.4 GB',
      connectedApps: 0,
      health: {
        status: 'err',
        title: 'Account Archived',
        sub: 'Inactive / decommissioned',
        checks: [
          { label: 'Login Activity', status: 'warn' },
          { label: 'Recovery Email', status: 'fail' },
          { label: '2FA Status', status: 'fail' },
          { label: 'OAuth Status', status: 'fail' }
        ]
      }
    }
  ],

  timeline: [
    { time: '14:32', event: 'Account Synced', account: 'owner@meabusiness.com', type: 'ok' },
    { time: '13:44', event: 'Recovery Email Updated', account: 'business@meabusiness.com', type: 'ok' },
    { time: '11:30', event: 'Gmail Connected', account: 'owner@meabusiness.com', type: 'ok' },
    { time: '09:14', event: 'Login Detected', account: 'owner@meabusiness.com', type: 'ok' },
    { time: 'Yesterday', event: 'OAuth Refreshed', account: 'business@meabusiness.com', type: 'ok' },
    { time: 'Yesterday', event: '2FA Warning Issued', account: 'personal@gmail.com', type: 'warn' },
    { time: '2 days ago', event: 'OAuth Expiry Notice', account: 'personal@gmail.com', type: 'warn' },
    { time: '5 days ago', event: 'Backup Vault Synced', account: 'backup@meabusiness.com', type: 'ok' }
  ]
};

/* ── INIT ── */
function acctInit() {
  acctRenderStats();
  acctRenderTelegram();
  acctRenderAccountStrip();
  acctRenderCardView();
  acctRenderTableView();
  acctRenderTimeline();
  acctUpdateCount();
}

/* ── STATS ── */
function acctRenderStats() {
  const a = ACCT_DATA.accounts;
  document.getElementById('statTotal').textContent = a.length;
  document.getElementById('statConnected').textContent = a.filter(x => x.status === 'active').length;
  document.getElementById('statWarning').textContent = a.filter(x => x.status === 'warning').length;
  document.getElementById('statArchived').textContent = a.filter(x => x.status === 'archived').length;
}

/* ── TELEGRAM ── */
function acctRenderTelegram() {
  const connected = ACCT_DATA.telegramConnected;
  const card = document.getElementById('acctTelegramCard');
  const orb  = document.getElementById('acctTgOrb');
  const title = document.getElementById('acctTgTitle');
  const sub   = document.getElementById('acctTgSub');
  const dot   = document.getElementById('acctTgDot');
  const statusText = document.getElementById('acctTgStatusText');
  const actions = document.getElementById('acctTgActions');

  if (connected) {
    card.classList.add('tg-connected');
    orb.classList.add('connected');
    title.textContent = 'Telegram Security Bot';
    sub.textContent = 'Telegram protection active. Notifikasi keamanan aktif.';
    dot.classList.add('connected');
    statusText.textContent = 'Connected' + (ACCT_DATA.telegramUsername ? ' — ' + ACCT_DATA.telegramUsername : '');
    statusText.classList.add('connected');
    actions.innerHTML = `
      <button class="acct-btn-ghost" onclick="acctTgReconnect()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
        Reconnect
      </button>
      <button class="acct-btn-ghost acct-btn-ghost--danger" onclick="acctTgDisconnect()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        Disconnect
      </button>
    `;
  } else {
    card.classList.remove('tg-connected');
    orb.classList.remove('connected');
    title.textContent = 'Telegram Security Bot';
    sub.textContent = 'Hubungkan Telegram untuk menerima notifikasi keamanan akun.';
    dot.classList.remove('connected');
    statusText.textContent = 'Not Connected';
    statusText.classList.remove('connected');
    actions.innerHTML = `
      <button class="acct-btn-primary" onclick="openTgModal()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.5 7.5a2.25 2.25 0 0 0 .126 4.073l3.9 1.205 2.306 6.54a.75.75 0 0 0 1.288.215l2.515-3.044 4.83 3.69a2.254 2.254 0 0 0 3.522-1.528l2.834-16.5a2.248 2.248 0 0 0-3.799-1.366z"/></svg>
        Connect Telegram
      </button>
    `;
  }
}

function openTgModal() {
  document.getElementById('acctTgModal').classList.add('open');
  document.getElementById('tgCodeInput').value = '';
  document.getElementById('tgUsernameInput').value = '';
  document.getElementById('tgFeedback').style.display = 'none';
  document.getElementById('tgFeedback').className = 'acct-modal-feedback';
}

function closeTgModal() {
  document.getElementById('acctTgModal').classList.remove('open');
}

function acctModalOverlayClick(e) {
  if (e.target.id === 'acctTgModal') closeTgModal();
}

function bindTelegramUser() {
  const code = document.getElementById('tgCodeInput').value.trim();
  const username = document.getElementById('tgUsernameInput').value.trim();
  const feedback = document.getElementById('tgFeedback');

  if (code.length < 4) {
    feedback.style.display = 'block';
    feedback.className = 'acct-modal-feedback err';
    feedback.textContent = 'Kode verifikasi tidak valid. Masukkan minimal 4 digit.';
    return;
  }

  // Simulate API call
  feedback.style.display = 'block';
  feedback.className = 'acct-modal-feedback';
  feedback.textContent = 'Menghubungkan...';

  setTimeout(() => {
    ACCT_DATA.telegramConnected = true;
    ACCT_DATA.telegramUsername = username || '@user';
    feedback.className = 'acct-modal-feedback ok';
    feedback.textContent = 'Berhasil terhubung. Telegram protection aktif.';
    setTimeout(() => {
      closeTgModal();
      acctRenderTelegram();
    }, 1200);
  }, 1000);
}

function acctTgReconnect() {
  ACCT_DATA.telegramConnected = false;
  acctRenderTelegram();
  setTimeout(openTgModal, 50);
}

function acctTgDisconnect() {
  ACCT_DATA.telegramConnected = false;
  ACCT_DATA.telegramUsername = '';
  acctRenderTelegram();
}

/* ── ACCOUNT SELECTOR STRIP ── */
function acctRenderAccountStrip() {
  const strip = document.getElementById('acctAccountStrip');
  strip.innerHTML = '';
  ACCT_DATA.accounts.forEach(acc => {
    const isActive = ACCT_DATA.activeAccountId === acc.id;
    const badge = acc.status === 'warning' ? 'WARN'
                : acc.status === 'archived' ? 'ARC'
                : acc.category;
    const badgeClass = acc.status === 'warning' ? 'acct-account-badge--warning'
                     : acc.status === 'archived' ? 'acct-account-badge--dim'
                     : 'acct-account-badge--ok';
    const card = document.createElement('div');
    card.className = 'acct-account-card' + (isActive ? ' active' : '') + (acc.status === 'archived' ? ' archived' : '');
    card.onclick = () => acctSelectAccount(acc.id);
    card.innerHTML = `
      <div class="acct-account-badge ${badgeClass}">${badge}</div>
      <div class="acct-account-avatar">${acc.initial}</div>
      <div class="acct-account-info">
        <span class="acct-account-name">${acc.name}</span>
        <span class="acct-account-email">${acc.email}</span>
      </div>
    `;
    strip.appendChild(card);
  });
}

/* ── SELECT ACCOUNT ── */
function acctSelectAccount(id) {
  if (ACCT_DATA.activeAccountId === id) {
    // Deselect
    ACCT_DATA.activeAccountId = null;
    document.getElementById('acctDetailRow').style.display = 'none';
    document.getElementById('acctActivitySection').style.display = 'none';
    document.getElementById('acctActionsSection').style.display = 'none';
  } else {
    ACCT_DATA.activeAccountId = id;
    const acc = ACCT_DATA.accounts.find(a => a.id === id);
    acctRenderHealth(acc);
    acctRenderDetail(acc);
    acctRenderActivity(acc);
    acctRenderActionsBar(acc);
    document.getElementById('acctDetailRow').style.display = 'grid';
    document.getElementById('acctActivitySection').style.display = 'block';
    document.getElementById('acctActionsSection').style.display = 'block';
    document.getElementById('acctActionsTarget').textContent = acc.email;
    // Scroll to detail
    setTimeout(() => {
      document.getElementById('acctDetailRow').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }
  acctRenderAccountStrip();
  acctRenderCardView();
  acctRenderTableView();
}

/* ── HEALTH ── */
function acctRenderHealth(acc) {
  const h = acc.health;
  const orb = document.getElementById('acctHealthOrb');
  orb.className = 'acct-health-orb acct-health-orb--' + h.status;
  document.getElementById('acctHealthTitle').textContent = h.title;
  document.getElementById('acctHealthSub').textContent = h.sub;

  const checks = document.getElementById('acctHealthChecks');
  checks.innerHTML = '';
  h.checks.forEach(c => {
    const div = document.createElement('div');
    div.className = 'acct-check-item' + (c.status === 'fail' ? ' fail' : c.status === 'warn' ? ' warn' : '');
    const icon = c.status === 'ok'
      ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
      : c.status === 'warn'
      ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>`
      : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    div.innerHTML = icon + `<span>${c.label}</span>`;
    checks.appendChild(div);
  });
}

/* ── DETAIL INSPECTOR ── */
function acctRenderDetail(acc) {
  const card = document.getElementById('acctDetailCard');
  const oauthClass = acc.oauth === 'Valid' ? 'acct-detail-val--ok'
                   : acc.oauth === 'Expiring Soon' ? 'acct-detail-val--warn'
                   : 'acct-detail-val acct-detail-val--dim';
  const twoFAClass = acc.twoFA ? 'acct-detail-val--ok' : 'acct-detail-val acct-detail-val--warn';

  card.innerHTML = `
    <div class="acct-detail-row">
      <span class="acct-detail-key">Email</span>
      <span class="acct-detail-val">${acc.email}</span>
    </div>
    <div class="acct-detail-row">
      <span class="acct-detail-key">Category</span>
      <span class="acct-detail-val"><span class="acct-detail-pill">${acc.category}</span></span>
    </div>
    <div class="acct-detail-row">
      <span class="acct-detail-key">2FA Status</span>
      <span class="acct-detail-val ${twoFAClass}">${acc.twoFA ? 'Enabled' : 'Disabled'}</span>
    </div>
    <div class="acct-detail-row">
      <span class="acct-detail-key">Recovery Email</span>
      <span class="acct-detail-val acct-detail-val--dim">${acc.recoveryEmail}</span>
    </div>
    <div class="acct-detail-row">
      <span class="acct-detail-key">Recovery Phone</span>
      <span class="acct-detail-val acct-detail-val--dim">${acc.recoveryPhone}</span>
    </div>
    <div class="acct-detail-row">
      <span class="acct-detail-key">Last Login</span>
      <span class="acct-detail-val">${acc.lastLogin}</span>
    </div>
    <div class="acct-detail-row">
      <span class="acct-detail-key">Last Sync</span>
      <span class="acct-detail-val">${acc.lastSync}</span>
    </div>
    <div class="acct-detail-row">
      <span class="acct-detail-key">OAuth Status</span>
      <span class="acct-detail-val ${oauthClass}">${acc.oauth}</span>
    </div>
  `;
}

/* ── ACTIVITY / STORAGE ── */
function acctRenderActivity(acc) {
  const grid = document.getElementById('acctActivityGrid');
  const items = [
    { dot: 'var(--red-bright)', label: 'Last Login',      val: acc.lastLogin,         sub: '' },
    { dot: 'var(--red-bright)', label: 'Last Sync',       val: acc.lastSync,          sub: '' },
    { dot: '#3a7bd5',           label: 'Total Gmail',     val: acc.totalGmail,        sub: 'storage' },
    { dot: '#34a853',           label: 'Drive Files',     val: acc.totalDrive,        sub: 'storage' },
    { dot: 'rgba(240,237,232,0.25)', label: 'Storage Used', val: acc.storageUsed,     sub: 'total' },
    { dot: '#fbbc04',           label: 'Connected Apps',  val: acc.connectedApps,     sub: 'apps' },
    { dot: acc.twoFA ? '#2ecc71' : '#e67e22', label: '2FA Security', val: acc.twoFA ? 'ON' : 'OFF', sub: '' },
  ];
  grid.innerHTML = items.map(i => `
    <div class="acct-activity-item">
      <span class="acct-activity-dot" style="background:${i.dot}"></span>
      <span class="acct-activity-label">${i.label}</span>
      <span class="acct-activity-val">${i.val}</span>
      ${i.sub ? `<span class="acct-activity-sub">${i.sub}</span>` : ''}
    </div>
  `).join('');
}

/* ── ACTIONS BAR ── */
function acctRenderActionsBar(acc) {
  // Already rendered statically in HTML, just update label
  document.getElementById('acctActionsTarget').textContent = acc.email;
}

/* ── CARD VIEW ── */
function acctRenderCardView() {
  const grid = document.getElementById('acctCardView');
  const filtered = acctGetFiltered();
  if (filtered.length === 0) {
    grid.innerHTML = '<div style="padding:2rem; font-family:var(--font-mono); font-size:0.62rem; color:var(--white-dim); letter-spacing:0.15em; text-transform:uppercase;">No accounts found.</div>';
    return;
  }
  grid.innerHTML = filtered.map(acc => {
    const isActive = ACCT_DATA.activeAccountId === acc.id;
    const dotClass = acc.status === 'active' ? 'ok' : acc.status === 'warning' ? 'warn' : 'archived';
    const statusLabel = acc.status === 'active' ? 'Active' : acc.status === 'warning' ? 'Warning' : 'Archived';
    return `
      <div class="acct-list-card ${isActive ? 'active' : ''}" onclick="acctSelectAccount('${acc.id}')">
        <div class="acct-list-card-top">
          <div class="acct-list-avatar">${acc.initial}</div>
          <div class="acct-list-meta">
            <span class="acct-list-name">${acc.name}</span>
            <span class="acct-list-email">${acc.email}</span>
          </div>
        </div>
        <div class="acct-list-status-row">
          <span class="acct-list-category">${acc.category}</span>
          <span class="acct-list-status-dot">
            <span class="acct-list-dot ${dotClass}"></span>
            ${statusLabel}
          </span>
        </div>
      </div>
    `;
  }).join('');
}

/* ── TABLE VIEW ── */
function acctRenderTableView() {
  const tbody = document.getElementById('acctTableBody');
  const filtered = acctGetFiltered();
  if (filtered.length === 0) {
    tbody.innerHTML = '<div style="padding:1.5rem 1.25rem; font-family:var(--font-mono); font-size:0.62rem; color:var(--white-dim); letter-spacing:0.15em; text-transform:uppercase;">No accounts found.</div>';
    return;
  }
  tbody.innerHTML = filtered.map(acc => {
    const isActive = ACCT_DATA.activeAccountId === acc.id;
    const dotClass = acc.status === 'active' ? 'ok' : acc.status === 'warning' ? 'warn' : 'archived';
    const statusLabel = acc.status === 'active' ? 'Active' : acc.status === 'warning' ? 'Warning' : 'Archived';
    return `
      <div class="acct-table-row ${isActive ? 'active' : ''}" onclick="acctSelectAccount('${acc.id}')">
        <div class="acct-table-name-cell">
          <div class="acct-table-avatar">${acc.initial}</div>
          <div style="display:flex;flex-direction:column;gap:0.1rem;min-width:0;">
            <span class="acct-table-name">${acc.name}</span>
            <span class="acct-table-email">${acc.email}</span>
          </div>
        </div>
        <span class="acct-table-cat">${acc.category}</span>
        <span class="acct-table-2fa ${acc.twoFA ? 'on' : 'off'}">${acc.twoFA ? 'On' : 'Off'}</span>
        <span class="acct-table-date">${acc.lastLogin}</span>
        <span class="acct-table-status">
          <span class="acct-list-dot ${dotClass}" style="width:6px;height:6px;border-radius:50%;flex-shrink:0;background:${dotClass === 'ok' ? '#2ecc71' : dotClass === 'warn' ? '#e67e22' : 'rgba(255,255,255,0.15)'}"></span>
          ${statusLabel}
        </span>
        <div style="display:flex;justify-content:flex-end;">
          <button class="acct-table-open" onclick="event.stopPropagation(); acctSelectAccount('${acc.id}')">Open</button>
        </div>
      </div>
    `;
  }).join('');
}

/* ── TIMELINE ── */
function acctRenderTimeline() {
  const tl = document.getElementById('acctTimeline');
  tl.innerHTML = ACCT_DATA.timeline.map(item => `
    <div class="acct-timeline-item">
      <div class="acct-timeline-spine">
        <div class="acct-timeline-node ${item.type}"></div>
        <div class="acct-timeline-line"></div>
      </div>
      <div class="acct-timeline-body">
        <span class="acct-timeline-event">${item.event}</span>
        <span class="acct-timeline-account">${item.account}</span>
        <span class="acct-timeline-time">${item.time}</span>
      </div>
    </div>
  `).join('');
}

/* ── FILTER & SEARCH ── */
function acctGetFiltered() {
  let list = ACCT_DATA.accounts;
  if (ACCT_DATA.filterStatus !== 'all') {
    list = list.filter(a => a.status === ACCT_DATA.filterStatus);
  }
  if (ACCT_DATA.searchQuery) {
    const q = ACCT_DATA.searchQuery.toLowerCase();
    list = list.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  }
  return list;
}

function acctFilter() {
  ACCT_DATA.searchQuery = document.getElementById('acctSearchInput').value;
  acctRenderCardView();
  acctRenderTableView();
  acctUpdateCount();
}

function acctSetFilter(status, btn) {
  ACCT_DATA.filterStatus = status;
  document.querySelectorAll('.acct-filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  acctRenderCardView();
  acctRenderTableView();
  acctUpdateCount();
}

function acctUpdateCount() {
  const count = acctGetFiltered().length;
  document.getElementById('acctCountBadge').textContent = count + ' account' + (count !== 1 ? 's' : '');
}

/* ── VIEW MODE TOGGLE ── */
function acctToggleView() {
  ACCT_DATA.viewMode = ACCT_DATA.viewMode === 'card' ? 'table' : 'card';
  const isCard = ACCT_DATA.viewMode === 'card';
  document.getElementById('acctCardView').style.display = isCard ? 'grid' : 'none';
  document.getElementById('acctTableView').style.display = isCard ? 'none' : 'block';
  document.getElementById('acctViewLabel').textContent = isCard ? 'Table' : 'Card';
  const icon = document.getElementById('acctViewIcon');
  if (isCard) {
    icon.innerHTML = '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>';
  } else {
    icon.innerHTML = '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>';
  }
}

/* ── ACTIONS ── */
function acctRefresh() {
  const badge = document.getElementById('acctSyncBadge');
  const label = document.getElementById('acctSyncLabel');
  badge.classList.add('warning');
  label.textContent = 'Refreshing...';
  setTimeout(() => {
    badge.classList.remove('warning');
    label.textContent = 'Vault Secure';
  }, 1800);
}

function acctSync() {
  if (!ACCT_DATA.activeAccountId) return;
  const acc = ACCT_DATA.accounts.find(a => a.id === ACCT_DATA.activeAccountId);
  acc.lastSync = 'Just now';
  if (ACCT_DATA.activeAccountId) acctRenderDetail(acc);
  acctRenderActivity(acc);
  acctRenderTimeline();
  // Add to timeline
  ACCT_DATA.timeline.unshift({ time: 'Just now', event: 'Manual Sync Triggered', account: acc.email, type: 'ok' });
  acctRenderTimeline();
}

function acctEdit() {
  if (!ACCT_DATA.activeAccountId) return;
  // Hook into project edit modal — placeholder
  console.log('[MEA] Edit account:', ACCT_DATA.activeAccountId);
}

function acctReauthorize() {
  if (!ACCT_DATA.activeAccountId) return;
  const acc = ACCT_DATA.accounts.find(a => a.id === ACCT_DATA.activeAccountId);
  acc.oauth = 'Valid';
  acc.health.checks.find(c => c.label === 'OAuth Status').status = 'ok';
  if (acc.health.status === 'warn') {
    const stillFailing = acc.health.checks.some(c => c.status === 'fail' || c.status === 'warn');
    if (!stillFailing) { acc.health.status = 'ok'; acc.health.title = 'All Systems Operational'; acc.health.sub = 'No anomalies detected'; }
  }
  acctRenderHealth(acc);
  acctRenderDetail(acc);
  ACCT_DATA.timeline.unshift({ time: 'Just now', event: 'OAuth Reauthorized', account: acc.email, type: 'ok' });
  acctRenderTimeline();
}

function acctArchive() {
  if (!ACCT_DATA.activeAccountId) return;
  const acc = ACCT_DATA.accounts.find(a => a.id === ACCT_DATA.activeAccountId);
  acc.status = 'archived';
  acctRenderStats();
  acctRenderAccountStrip();
  acctRenderCardView();
  acctRenderTableView();
  ACCT_DATA.timeline.unshift({ time: 'Just now', event: 'Account Archived', account: acc.email, type: 'warn' });
  acctRenderTimeline();
}

/* ── BOOT ── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', acctInit);
} else {
  acctInit();
}
