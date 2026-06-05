/* ════════════════════════════════════════════════
   Gmail Center — script.js
   owner/account/gmail/script.js
   Architecture: Data Layer → UI Layer → Actions Layer
   Supabase integration: NOT YET — placeholder arrays only
════════════════════════════════════════════════ */

'use strict';

/* ════════════════════════════════════════════════
   DATA LAYER
   Replace with Supabase queries when integrating
════════════════════════════════════════════════ */
const GmailData = (() => {

  const summaryStats = [
    {
      id: 'connected-accounts',
      label: 'Connected Accounts',
      value: '12',
      trend: '+2 this month',
      trendType: 'up',
      iconColor: 'blue',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
               <circle cx="9" cy="7" r="4"/>
               <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
             </svg>`,
    },
    {
      id: 'unread-messages',
      label: 'Unread Messages',
      value: '248',
      trend: '18 new today',
      trendType: 'up',
      iconColor: 'red',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
               <polyline points="22,6 12,13 2,6"/>
             </svg>`,
    },
    {
      id: 'automation-rules',
      label: 'Automation Rules',
      value: '16',
      trend: '3 active now',
      trendType: 'neutral',
      iconColor: 'violet',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <circle cx="12" cy="12" r="3"/>
               <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>
             </svg>`,
    },
    {
      id: 'last-sync',
      label: 'Last Sync',
      value: '2m',
      trend: 'All synced',
      trendType: 'up',
      iconColor: 'emerald',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
               <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
             </svg>`,
    },
  ];

  const quickActions = [
    {
      id: 'add-account',
      label: 'Add Gmail Account',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
             </svg>`,
      variant: 'primary',
    },
    {
      id: 'sync-all',
      label: 'Sync All Accounts',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
               <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
             </svg>`,
      variant: '',
    },
    {
      id: 'generate-report',
      label: 'Generate Report',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
               <polyline points="14 2 14 8 20 8"/>
               <line x1="16" y1="13" x2="8" y2="13"/>
               <line x1="16" y1="17" x2="8" y2="17"/>
               <polyline points="10 9 9 9 8 9"/>
             </svg>`,
      variant: '',
    },
    {
      id: 'open-gmail',
      label: 'Open Gmail',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
               <polyline points="15 3 21 3 21 9"/>
               <line x1="10" y1="14" x2="21" y2="3"/>
             </svg>`,
      variant: '',
    },
  ];

  const connectedAccounts = [
    {
      id: 'acc-1',
      email: 'owner@mea.id',
      role: 'Primary Owner',
      status: 'active',
      avatarColor: '#2563eb',
      storageUsed: 15.2,
      storageTotal: 30,
      storageBarColor: 'blue',
      lastSync: '2 min ago',
    },
    {
      id: 'acc-2',
      email: 'admin@mea.id',
      role: 'Admin',
      status: 'active',
      avatarColor: '#6366f1',
      storageUsed: 8.7,
      storageTotal: 30,
      storageBarColor: 'indigo',
      lastSync: '5 min ago',
    },
    {
      id: 'acc-3',
      email: 'ops@mea.id',
      role: 'Operations',
      status: 'warning',
      avatarColor: '#8b5cf6',
      storageUsed: 22.1,
      storageTotal: 30,
      storageBarColor: 'violet',
      lastSync: '38 min ago',
    },
  ];

  const automationRules = [
    {
      id: 'auto-forward',
      name: 'Auto Forwarding',
      desc: 'Forward emails to Telegram',
      enabled: true,
      iconColor: 'blue',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 00-4-4H4"/>
             </svg>`,
    },
    {
      id: 'smart-labels',
      name: 'Smart Labels',
      desc: 'Auto-label by sender & keyword',
      enabled: true,
      iconColor: 'violet',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
               <line x1="7" y1="7" x2="7.01" y2="7"/>
             </svg>`,
    },
    {
      id: 'daily-summary',
      name: 'Daily Summary',
      desc: 'Send digest at 08:00 WIB',
      enabled: true,
      iconColor: 'emerald',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
               <line x1="16" y1="2" x2="16" y2="6"/>
               <line x1="8" y1="2" x2="8" y2="6"/>
               <line x1="3" y1="10" x2="21" y2="10"/>
             </svg>`,
    },
    {
      id: 'telegram-alerts',
      name: 'Telegram Alerts',
      desc: 'Push priority emails to bot',
      enabled: false,
      iconColor: 'orange',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/>
             </svg>`,
    },
  ];

  const syncStatus = [
    {
      id: 'google-api',
      name: 'Google API Status',
      sub: 'OAuth2 connection',
      status: 'healthy',
      value: null,
      badge: 'Healthy',
    },
    {
      id: 'last-sync',
      name: 'Last Sync',
      sub: 'Full inbox synchronization',
      status: 'healthy',
      value: '2 min ago',
      badge: null,
    },
    {
      id: 'successful-syncs',
      name: 'Successful Syncs',
      sub: 'Last 30 days',
      status: 'healthy',
      value: '1,284',
      badge: null,
    },
    {
      id: 'failed-syncs',
      name: 'Failed Syncs',
      sub: 'Last 30 days',
      status: 'warning',
      value: '3',
      badge: 'Warning',
    },
  ];

  const activityItems = [
    {
      id: 'act-1',
      text: 'Inbox synchronized',
      time: '2 min ago',
      dotColor: 'blue',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
               <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
             </svg>`,
    },
    {
      id: 'act-2',
      text: 'New forwarding rule created',
      time: '18 min ago',
      dotColor: 'violet',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <circle cx="12" cy="12" r="3"/>
               <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>
             </svg>`,
    },
    {
      id: 'act-3',
      text: 'Daily summary generated',
      time: '8 hr ago',
      dotColor: 'emerald',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
               <polyline points="14 2 14 8 20 8"/>
             </svg>`,
    },
    {
      id: 'act-4',
      text: 'Spam cleanup completed',
      time: '1 day ago',
      dotColor: 'orange',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <polyline points="3 6 5 6 21 6"/>
               <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
               <path d="M10 11v6M14 11v6"/>
             </svg>`,
    },
    {
      id: 'act-5',
      text: 'Security verification completed',
      time: '2 days ago',
      dotColor: 'indigo',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
             </svg>`,
    },
  ];

  const storageData = {
    usedGB: 46,
    totalGB: 90,
    breakdown: [
      { label: 'Primary', size: '15.2 GB', pct: 33, color: '#3b82f6', dotColor: '#3b82f6' },
      { label: 'Admin',   size: '8.7 GB',  pct: 19, color: '#6366f1', dotColor: '#6366f1' },
      { label: 'Ops',     size: '22.1 GB', pct: 48, color: '#8b5cf6', dotColor: '#8b5cf6' },
    ],
  };

  return {
    getSummaryStats:    () => summaryStats,
    getQuickActions:    () => quickActions,
    getConnectedAccounts: () => connectedAccounts,
    getAutomationRules: () => automationRules,
    getSyncStatus:      () => syncStatus,
    getActivityItems:   () => activityItems,
    getStorageData:     () => storageData,
  };
})();


/* ════════════════════════════════════════════════
   UI LAYER
════════════════════════════════════════════════ */
const GmailUI = (() => {

  /* ── Summary Cards ── */
  function renderSummary() {
    const grid = document.getElementById('summary-grid');
    if (!grid) return;
    grid.innerHTML = GmailData.getSummaryStats().map(s => `
      <div class="gc-stat-card" data-stat="${s.id}">
        <div class="gc-stat-top">
          <div class="gc-stat-icon gc-stat-icon--${s.iconColor}">${s.icon}</div>
          <span class="gc-stat-trend gc-stat-trend--${s.trendType}">${s.trend}</span>
        </div>
        <div>
          <div class="gc-stat-value">${s.value}</div>
          <div class="gc-stat-label">${s.label}</div>
        </div>
      </div>
    `).join('');
  }

  /* ── Quick Actions Bar ── */
  function renderActions() {
    const bar = document.getElementById('actions-bar');
    if (!bar) return;
    const btns = GmailData.getQuickActions().map(a => `
      <button class="gc-action-btn${a.variant ? ' gc-action-btn--' + a.variant : ''}" data-action="${a.id}">
        ${a.icon}
        <span>${a.label}</span>
      </button>
    `).join('');
    bar.innerHTML = `<span class="gc-actions-label">Quick Actions</span>${btns}`;
  }

  /* ── Connected Accounts ── */
  function renderAccounts() {
    const grid = document.getElementById('accounts-grid');
    if (!grid) return;
    grid.innerHTML = GmailData.getConnectedAccounts().map(acc => {
      const initials = acc.email.split('@')[0].slice(0, 2).toUpperCase();
      const pct = Math.round((acc.storageUsed / acc.storageTotal) * 100);
      return `
        <div class="gc-account-card" data-account="${acc.id}">
          <div class="gc-acct-top">
            <div class="gc-acct-avatar" style="background:${acc.avatarColor}">${initials}</div>
            <div class="gc-acct-info">
              <div class="gc-acct-email" title="${acc.email}">${acc.email}</div>
              <div class="gc-acct-role">${acc.role}</div>
            </div>
            <span class="gc-status-badge gc-status-badge--${acc.status}">
              <span class="gc-status-dot"></span>
              ${acc.status === 'active' ? 'Active' : 'Warning'}
            </span>
          </div>

          <div class="gc-acct-stats">
            <div class="gc-mini-bar-wrap">
              <div class="gc-mini-bar-row">
                <span class="gc-acct-stat-label">Storage</span>
                <span class="gc-acct-stat-val">${acc.storageUsed} GB / ${acc.storageTotal} GB</span>
              </div>
              <div class="gc-mini-bar-track">
                <div class="gc-mini-bar-fill gc-mini-bar-fill--${acc.storageBarColor}" style="width:${pct}%"></div>
              </div>
            </div>
            <div class="gc-acct-stat-row">
              <span class="gc-acct-stat-label">Last Sync</span>
              <span class="gc-acct-stat-val">${acc.lastSync}</span>
            </div>
          </div>

          <div class="gc-acct-footer">
            <button class="gc-manage-btn" data-account-manage="${acc.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>
              </svg>
              Manage Account
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  /* ── Automation Toggles ── */
  function renderAutomation() {
    const list = document.getElementById('automation-list');
    if (!list) return;
    const rules = GmailData.getAutomationRules();
    list.innerHTML = rules.map(r => `
      <div class="gc-toggle-item" data-rule="${r.id}">
        <div class="gc-toggle-icon gc-toggle-icon--${r.iconColor}">${r.icon}</div>
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

    // Update active count label
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
    list.innerHTML = GmailData.getSyncStatus().map(item => `
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
    tl.innerHTML = GmailData.getActivityItems().map(item => `
      <div class="gc-timeline-item">
        <div class="gc-timeline-dot gc-timeline-dot--${item.dotColor}">${item.icon}</div>
        <div class="gc-timeline-info">
          <div class="gc-timeline-text">${item.text}</div>
          <div class="gc-timeline-time">${item.time}</div>
        </div>
      </div>
    `).join('');
  }

  /* ── Storage Overview ── */
  function renderStorage() {
    const body = document.getElementById('storage-body');
    if (!body) return;
    const d = GmailData.getStorageData();
    const pct = Math.round((d.usedGB / d.totalGB) * 100);
    // SVG donut: circumference for r=28 ≈ 175.9
    const circ = 2 * Math.PI * 28;
    const offset = circ - (pct / 100) * circ;

    const bars = d.breakdown.map(b => `
      <div class="gc-storage-bar-item">
        <div class="gc-storage-bar-meta">
          <span class="gc-storage-bar-name">
            <span class="gc-storage-bar-dot" style="background:${b.dotColor}"></span>
            ${b.label}
          </span>
          <span class="gc-storage-bar-size">${b.size}</span>
        </div>
        <div class="gc-storage-bar-track">
          <div class="gc-storage-bar-prog" style="width:${b.pct}%; background:${b.color}"></div>
        </div>
      </div>
    `).join('');

    body.innerHTML = `
      <div class="gc-storage-donut-row">
        <svg class="gc-storage-donut" viewBox="0 0 80 80">
          <circle class="gc-storage-donut-ring" cx="40" cy="40" r="28"/>
          <circle class="gc-storage-donut-fill" cx="40" cy="40" r="28"
            style="stroke-dasharray:${circ.toFixed(1)};stroke-dashoffset:${offset.toFixed(1)}"
          />
        </svg>
        <div class="gc-storage-summary">
          <div class="gc-storage-pct">${pct}%</div>
          <div class="gc-storage-pct-label">${d.usedGB} GB used of ${d.totalGB} GB</div>
        </div>
      </div>
      <div class="gc-storage-bars">${bars}</div>
    `;
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
    renderAccounts();
    renderAutomation();
    renderSyncStatus();
    renderActivity();
    renderStorage();
  }

  return { renderAll, updateAutoCount };
})();


/* ════════════════════════════════════════════════
   ACTIONS LAYER
════════════════════════════════════════════════ */
const GmailActions = (() => {

  function onActionClick(actionId) {
    const handlers = {
      'add-account':     () => console.log('[Gmail] Add Gmail Account'),
      'sync-all':        () => {
        console.log('[Gmail] Sync All Accounts');
        // TODO: call Supabase function / Apps Script trigger
      },
      'generate-report': () => console.log('[Gmail] Generate Report'),
      'open-gmail':      () => window.open('https://mail.google.com', '_blank'),
    };
    const fn = handlers[actionId];
    if (fn) fn();
  }

  function onManageAccount(accountId) {
    console.log(`[Gmail] Manage account: ${accountId}`);
    // TODO: navigate to account detail page or open modal
  }

  function onToggleRule(ruleId, enabled) {
    console.log(`[Gmail] Toggle rule "${ruleId}": ${enabled}`);
    GmailUI.updateAutoCount();
    // TODO: update Supabase row for automation rule
  }

  function onRefresh() {
    console.log('[Gmail] Refresh requested');
    // TODO: re-fetch from Supabase
  }

  function bindAll() {
    // Quick action buttons
    document.getElementById('actions-bar')?.addEventListener('click', e => {
      const btn = e.target.closest('[data-action]');
      if (btn) onActionClick(btn.dataset.action);
    });

    // Add account (section header shortcut)
    document.getElementById('btn-add-account')?.addEventListener('click', () => onActionClick('add-account'));

    // Manage account buttons
    document.getElementById('accounts-grid')?.addEventListener('click', e => {
      const btn = e.target.closest('[data-account-manage]');
      if (btn) onManageAccount(btn.dataset.accountManage);
    });

    // Automation toggles
    document.getElementById('automation-list')?.addEventListener('change', e => {
      const input = e.target.closest('[data-toggle-rule]');
      if (input) onToggleRule(input.dataset.toggleRule, input.checked);
    });

    // Refresh header button
    document.getElementById('btn-refresh-header')?.addEventListener('click', onRefresh);

    // View all activity (placeholder)
    document.getElementById('btn-view-all-activity')?.addEventListener('click', () => {
      console.log('[Gmail] View all activity');
    });
  }

  return { bindAll };
})();


/* ════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  GmailUI.renderAll();
  GmailActions.bindAll();
});
