/* ════════════════════════════════════════════════
   Drive Center — script.js
   owner/account/drive/script.js
   Architecture: Data Layer → UI Layer → Actions Layer
   Supabase integration: NOT YET — placeholder arrays only
════════════════════════════════════════════════ */

'use strict';

/* ════════════════════════════════════════════════
   DATA LAYER
   Replace with Supabase queries when integrating
════════════════════════════════════════════════ */
const DriveData = (() => {

  const summaryStats = [
    {
      id: 'connected-drives',
      label: 'Connected Drives',
      value: '12',
      trend: '+2 this month',
      trendType: 'up',
      icon: 'hard-drive',
      iconColor: 'blue',
    },
    {
      id: 'total-storage',
      label: 'Total Storage',
      value: '2.4 TB',
      trend: '1.6 TB used',
      trendType: 'neutral',
      icon: 'database',
      iconColor: 'indigo',
    },
    {
      id: 'files-managed',
      label: 'Files Managed',
      value: '84,312',
      trend: '+1,204 today',
      trendType: 'up',
      icon: 'files',
      iconColor: 'violet',
    },
    {
      id: 'last-sync',
      label: 'Last Sync',
      value: '2m',
      trend: 'All synced',
      trendType: 'up',
      icon: 'refresh-cw',
      iconColor: 'emerald',
    },
  ];

  const quickActions = [
    { id: 'add-drive',        label: 'Add Drive',          icon: 'plus',         variant: 'primary' },
    { id: 'sync-all',         label: 'Sync All Drives',    icon: 'refresh-cw',   variant: '' },
    { id: 'generate-report',  label: 'Generate Report',    icon: 'file-text',    variant: '' },
    { id: 'open-drive',       label: 'Open Google Drive',  icon: 'external-link',variant: '' },
  ];

  const connectedDrives = [
    {
      id: 'drv-1',
      email: 'owner@mea.id',
      role: 'Primary Owner',
      status: 'active',
      avatarColor: '#2563eb',
      storageUsed: 820,
      storageTotal: 1000,
      storageUnit: 'GB',
      storageBarColor: '#3b82f6',
      lastSync: '2 min ago',
    },
    {
      id: 'drv-2',
      email: 'admin@mea.id',
      role: 'Admin',
      status: 'active',
      avatarColor: '#6366f1',
      storageUsed: 430,
      storageTotal: 1000,
      storageUnit: 'GB',
      storageBarColor: '#6366f1',
      lastSync: '5 min ago',
    },
    {
      id: 'drv-3',
      email: 'ops@mea.id',
      role: 'Operations',
      status: 'warning',
      avatarColor: '#8b5cf6',
      storageUsed: 390,
      storageTotal: 400,
      storageUnit: 'GB',
      storageBarColor: '#8b5cf6',
      lastSync: '42 min ago',
    },
  ];

  const storageOverview = {
    usedTB: 1.64,
    totalTB: 2.4,
    breakdown: [
      { label: 'owner@mea.id', size: '820 GB', pct: 82, color: '#3b82f6', avatarColor: '#2563eb' },
      { label: 'admin@mea.id', size: '430 GB', pct: 43, color: '#6366f1', avatarColor: '#6366f1' },
      { label: 'ops@mea.id',   size: '390 GB', pct: 98, color: '#8b5cf6', avatarColor: '#8b5cf6' },
    ],
    meta: [
      { label: 'Used Storage',      value: '1.64 TB', dot: '#3b82f6' },
      { label: 'Remaining Storage', value: '0.76 TB', dot: '#e2e8f0' },
      { label: 'Total Storage',     value: '2.4 TB',  dot: '#94a3b8' },
    ],
  };

  const automationRules = [
    {
      id: 'auto-backup',
      name: 'Automatic Backup',
      desc: 'Daily backup at 02:00 WIB',
      enabled: true,
      icon: 'save',
      iconColor: 'blue',
    },
    {
      id: 'folder-monitoring',
      name: 'Folder Monitoring',
      desc: 'Watch shared folders for changes',
      enabled: true,
      icon: 'folder-open',
      iconColor: 'violet',
    },
    {
      id: 'telegram-alerts',
      name: 'Telegram Alerts',
      desc: 'Push storage alerts to bot',
      enabled: true,
      icon: 'send',
      iconColor: 'emerald',
    },
    {
      id: 'daily-reports',
      name: 'Daily Reports',
      desc: 'Send usage report at 08:00 WIB',
      enabled: false,
      icon: 'bar-chart-2',
      iconColor: 'orange',
    },
  ];

  const syncStatus = [
    {
      id: 'drive-api',
      name: 'Google Drive API Status',
      sub: 'OAuth2 connection',
      status: 'healthy',
      value: null,
      badge: 'Healthy',
    },
    {
      id: 'last-sync',
      name: 'Last Sync',
      sub: 'Full drive synchronization',
      status: 'healthy',
      value: '2 min ago',
      badge: null,
    },
    {
      id: 'successful-syncs',
      name: 'Successful Syncs',
      sub: 'Last 30 days',
      status: 'healthy',
      value: '2,841',
      badge: null,
    },
    {
      id: 'failed-syncs',
      name: 'Failed Syncs',
      sub: 'Last 30 days',
      status: 'warning',
      value: '2',
      badge: 'Warning',
    },
  ];

  const activityItems = [
    { id: 'act-1', text: 'Folder synchronized',           time: '2 min ago',  icon: 'refresh-cw',   dotColor: 'blue'   },
    { id: 'act-2', text: 'Backup completed',               time: '1 hr ago',   icon: 'save',          dotColor: 'emerald'},
    { id: 'act-3', text: 'Storage report generated',       time: '8 hr ago',   icon: 'file-text',     dotColor: 'violet' },
    { id: 'act-4', text: 'New shared folder detected',     time: '1 day ago',  icon: 'folder-plus',   dotColor: 'orange' },
    { id: 'act-5', text: 'Security verification completed',time: '2 days ago', icon: 'shield-check',  dotColor: 'indigo' },
  ];

  const topUsers = [
    { rank: 1, email: 'owner@mea.id', size: '820 GB', pct: 82, avatarColor: '#2563eb', barColor: '#3b82f6' },
    { rank: 2, email: 'admin@mea.id', size: '430 GB', pct: 43, avatarColor: '#6366f1', barColor: '#6366f1' },
    { rank: 3, email: 'ops@mea.id',   size: '390 GB', pct: 98, avatarColor: '#8b5cf6', barColor: '#8b5cf6' },
  ];

  return {
    getSummaryStats:    () => summaryStats,
    getQuickActions:    () => quickActions,
    getConnectedDrives: () => connectedDrives,
    getStorageOverview: () => storageOverview,
    getAutomationRules: () => automationRules,
    getSyncStatus:      () => syncStatus,
    getActivityItems:   () => activityItems,
    getTopUsers:        () => topUsers,
  };
})();


/* ════════════════════════════════════════════════
   UI LAYER
════════════════════════════════════════════════ */
const DriveUI = (() => {

  /* ── Summary Cards ── */
  function renderSummary() {
    const grid = document.getElementById('summary-grid');
    if (!grid) return;
    grid.innerHTML = DriveData.getSummaryStats().map(s => `
      <div class="stat-card" data-stat="${s.id}">
        <div class="stat-top">
          <div class="stat-icon stat-icon--${s.iconColor}">
            <i data-lucide="${s.icon}"></i>
          </div>
          <span class="stat-trend stat-trend--${s.trendType}">${s.trend}</span>
        </div>
        <div class="stat-value">${s.value}</div>
        <div class="stat-label">${s.label}</div>
      </div>
    `).join('');
    lucide.createIcons();
  }

  /* ── Quick Actions Bar ── */
  function renderActions() {
    const bar = document.getElementById('actions-bar');
    if (!bar) return;
    const btns = DriveData.getQuickActions().map(a => `
      <button class="gc-action-btn${a.variant ? ' gc-action-btn--' + a.variant : ''}" data-action="${a.id}">
        <i data-lucide="${a.icon}"></i>
        <span>${a.label}</span>
      </button>
    `).join('');
    bar.innerHTML = `<span class="gc-actions-label">Quick Actions</span>${btns}`;
    lucide.createIcons();
  }

  /* ── Connected Drives ── */
  function renderDrives() {
    const grid = document.getElementById('drives-grid');
    if (!grid) return;
    grid.innerHTML = DriveData.getConnectedDrives().map(drv => {
      const initials = drv.email.split('@')[0].slice(0, 2).toUpperCase();
      const pct = Math.round((drv.storageUsed / drv.storageTotal) * 100);
      return `
        <div class="gc-account-card" data-drive="${drv.id}">
          <div class="gc-acct-top">
            <div class="gc-acct-avatar" style="background:${drv.avatarColor}">${initials}</div>
            <div class="gc-acct-info">
              <div class="gc-acct-email" title="${drv.email}">${drv.email}</div>
              <div class="gc-acct-role">${drv.role}</div>
            </div>
            <span class="gc-status-badge gc-status-badge--${drv.status}">
              <span class="gc-status-dot"></span>
              ${drv.status === 'active' ? 'Active' : 'Warning'}
            </span>
          </div>

          <div class="gc-acct-stats">
            <div class="gc-mini-bar-wrap">
              <div class="gc-mini-bar-row">
                <span class="gc-acct-stat-label">Storage</span>
                <span class="gc-acct-stat-val">${drv.storageUsed} ${drv.storageUnit} / ${drv.storageTotal} ${drv.storageUnit}</span>
              </div>
              <div class="gc-mini-bar-track">
                <div class="gc-mini-bar-fill" style="width:${pct}%; background:${drv.storageBarColor}"></div>
              </div>
            </div>
            <div class="gc-acct-stat-row">
              <span class="gc-acct-stat-label">Last Sync</span>
              <span class="gc-acct-stat-val">${drv.lastSync}</span>
            </div>
          </div>

          <div class="gc-acct-footer">
            <button class="gc-manage-btn" data-drive-manage="${drv.id}">
              <i data-lucide="settings-2"></i>
              Manage Drive
            </button>
          </div>
        </div>
      `;
    }).join('');
    lucide.createIcons();
  }

  /* ── Storage Overview ── */
  function renderStorageOverview() {
    const body = document.getElementById('storage-overview-body');
    if (!body) return;
    const d = DriveData.getStorageOverview();
    const pct = Math.round((d.usedTB / d.totalTB) * 100);
    const circ = 2 * Math.PI * 54; // r=54
    const offset = circ - (pct / 100) * circ;

    const metaRows = d.meta.map(m => `
      <div class="dc-storage-meta-row">
        <span class="dc-storage-meta-label">
          <span class="dc-storage-meta-dot" style="background:${m.dot}"></span>
          ${m.label}
        </span>
        <span class="dc-storage-meta-val">${m.value}</span>
      </div>
    `).join('');

    const accountBars = d.breakdown.map(b => {
      const initials = b.label.split('@')[0].slice(0, 2).toUpperCase();
      return `
        <div class="dc-storage-account-row">
          <div class="dc-storage-account-meta">
            <div class="dc-storage-account-info">
              <div class="dc-storage-avatar" style="background:${b.avatarColor}">${initials}</div>
              <span class="dc-storage-account-email">${b.label}</span>
            </div>
            <span class="dc-storage-account-size">${b.size}</span>
          </div>
          <div class="dc-storage-bar-track">
            <div class="dc-storage-bar-prog" style="width:${b.pct}%; background:${b.color}"></div>
          </div>
        </div>
      `;
    }).join('');

    body.innerHTML = `
      <div class="dc-storage-overview">
        <div class="dc-storage-left">
          <div class="dc-donut-wrap">
            <svg viewBox="0 0 120 120">
              <circle class="dc-donut-ring" cx="60" cy="60" r="54"/>
              <circle class="dc-donut-fill" cx="60" cy="60" r="54"
                style="stroke-dasharray:${circ.toFixed(1)};stroke-dashoffset:${offset.toFixed(1)}"
              />
            </svg>
            <div class="dc-donut-label">
              <span class="dc-donut-pct">${pct}%</span>
              <span class="dc-donut-sub">Used</span>
            </div>
          </div>
          <div class="dc-storage-meta">${metaRows}</div>
        </div>
        <div class="dc-storage-right">${accountBars}</div>
      </div>
    `;
  }

  /* ── Automation Toggles ── */
  function renderAutomation() {
    const list = document.getElementById('automation-list');
    if (!list) return;
    list.innerHTML = DriveData.getAutomationRules().map(r => `
      <div class="gc-toggle-item" data-rule="${r.id}">
        <div class="gc-toggle-icon gc-toggle-icon--${r.iconColor}">
          <i data-lucide="${r.icon}"></i>
        </div>
        <div class="gc-toggle-info">
          <div class="gc-toggle-name">${r.name}</div>
          <div class="gc-toggle-desc">${r.desc}</div>
        </div>
        <label class="gc-switch" title="Toggle ${r.name}">
          <input type="checkbox" ${r.enabled ? 'checked' : ''} data-toggle-rule="${r.id}" />
          <span class="gc-switch-track"></span>
          <span class="gc-switch-thumb"></span>
        </label>
      </div>
    `).join('');
    lucide.createIcons();
    updateAutoCount();
  }

  function updateAutoCount() {
    const count = document.querySelectorAll('[data-toggle-rule]:checked').length;
    const el = document.getElementById('auto-active-count');
    if (el) el.textContent = `${count} Active`;
  }

  /* ── Sync Status ── */
  function renderSyncStatus() {
    const list = document.getElementById('sync-list');
    if (!list) return;
    list.innerHTML = DriveData.getSyncStatus().map(item => `
      <div class="gc-sync-item" data-sync="${item.id}">
        <span class="gc-sync-indicator gc-sync-indicator--${item.status}"></span>
        <div class="gc-sync-info">
          <div class="gc-sync-name">${item.name}</div>
          <div class="gc-sync-sub">${item.sub}</div>
        </div>
        ${item.badge
          ? `<span class="gc-sync-badge gc-sync-badge--${item.status}">${item.badge}</span>`
          : `<span class="gc-sync-val">${item.value}</span>`
        }
      </div>
    `).join('');
  }

  /* ── Activity Timeline ── */
  function renderActivity() {
    const tl = document.getElementById('activity-timeline');
    if (!tl) return;
    tl.innerHTML = DriveData.getActivityItems().map(item => `
      <div class="gc-timeline-item">
        <div class="gc-timeline-dot gc-timeline-dot--${item.dotColor}">
          <i data-lucide="${item.icon}"></i>
        </div>
        <div class="gc-timeline-info">
          <div class="gc-timeline-text">${item.text}</div>
          <div class="gc-timeline-time">${item.time}</div>
        </div>
      </div>
    `).join('');
    lucide.createIcons();
  }

  /* ── Top Storage Users ── */
  function renderTopUsers() {
    const body = document.getElementById('top-users-body');
    if (!body) return;
    body.innerHTML = `
      <div class="dc-top-users">
        ${DriveData.getTopUsers().map(u => {
          const initials = u.email.split('@')[0].slice(0, 2).toUpperCase();
          return `
            <div class="dc-top-user-item">
              <span class="dc-top-user-rank">#${u.rank}</span>
              <div class="dc-top-user-avatar" style="background:${u.avatarColor}">${initials}</div>
              <div class="dc-top-user-info">
                <div class="dc-top-user-email">${u.email}</div>
              </div>
              <div class="dc-top-user-bar-wrap">
                <div class="dc-top-user-bar-track">
                  <div class="dc-top-user-bar-fill" style="width:${u.pct}%; background:${u.barColor}"></div>
                </div>
                <div class="dc-top-user-size">${u.size}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  /* ── Live Clock ── */
  function startClock() {
    const el = document.getElementById('liveClock');
    if (!el) return;
    const tick = () => {
      el.textContent = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ── Sidebar ── */
  function renderSidebar() {
    if (typeof MEASidebar !== 'undefined') {
      MEASidebar.init();
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }

  function renderAll() {
    renderSidebar();
    renderSummary();
    renderActions();
    renderDrives();
    renderStorageOverview();
    renderAutomation();
    renderSyncStatus();
    renderActivity();
    renderTopUsers();
    startClock();
  }

  return { renderAll, updateAutoCount };
})();


/* ════════════════════════════════════════════════
   ACTIONS LAYER
════════════════════════════════════════════════ */
const DriveActions = (() => {

  function onActionClick(actionId) {
    const handlers = {
      'add-drive':       () => console.log('[Drive] Add Drive'),
      'sync-all':        () => {
        console.log('[Drive] Sync All Drives');
        // TODO: call Apps Script trigger / Supabase function
      },
      'generate-report': () => console.log('[Drive] Generate Report'),
      'open-drive':      () => window.open('https://drive.google.com', '_blank'),
    };
    const fn = handlers[actionId];
    if (fn) fn();
  }

  function onManageDrive(driveId) {
    console.log(`[Drive] Manage drive: ${driveId}`);
    // TODO: navigate to drive detail or open modal
  }

  function onToggleRule(ruleId, enabled) {
    console.log(`[Drive] Toggle rule "${ruleId}": ${enabled}`);
    DriveUI.updateAutoCount();
    // TODO: update Supabase row for automation rule
  }

  function onRefresh() {
    console.log('[Drive] Refresh requested');
    // TODO: re-fetch from Supabase
  }

  function bindAll() {
    // Quick actions
    document.getElementById('actions-bar')?.addEventListener('click', e => {
      const btn = e.target.closest('[data-action]');
      if (btn) onActionClick(btn.dataset.action);
    });

    // Add drive shortcut
    document.getElementById('btn-add-drive')?.addEventListener('click', () => onActionClick('add-drive'));

    // Manage drive buttons
    document.getElementById('drives-grid')?.addEventListener('click', e => {
      const btn = e.target.closest('[data-drive-manage]');
      if (btn) onManageDrive(btn.dataset.driveManage);
    });

    // Automation toggles
    document.getElementById('automation-list')?.addEventListener('change', e => {
      const input = e.target.closest('[data-toggle-rule]');
      if (input) onToggleRule(input.dataset.toggleRule, input.checked);
    });

    // Refresh
    document.getElementById('btn-refresh-header')?.addEventListener('click', onRefresh);

    // View all activity
    document.getElementById('btn-view-all-activity')?.addEventListener('click', () => {
      console.log('[Drive] View all activity');
    });
  }

  return { bindAll };
})();


/* ════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  DriveUI.renderAll();
  DriveActions.bindAll();
});
