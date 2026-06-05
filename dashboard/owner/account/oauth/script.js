/* ════════════════════════════════════════════════
   OAuth Center — script.js
   owner/account/oauth/script.js
   Architecture: Data Layer → UI Layer → Actions Layer
   Supabase integration: NOT YET — placeholder arrays only
════════════════════════════════════════════════ */

'use strict';

/* ════════════════════════════════════════════════
   DATA LAYER
   Replace with Supabase queries when integrating
════════════════════════════════════════════════ */
const OAuthData = (() => {

  const summaryStats = [
    {
      id: 'active-tokens',
      label: 'Active Tokens',
      value: '9',
      trend: '+1 this week',
      trendType: 'up',
      iconColor: 'blue',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
             </svg>`,
    },
    {
      id: 'connected-services',
      label: 'Connected Services',
      value: '12',
      trend: '+2 this month',
      trendType: 'up',
      iconColor: 'violet',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
               <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
             </svg>`,
    },
    {
      id: 'security-score',
      label: 'Security Score',
      value: '98%',
      trend: 'Excellent',
      trendType: 'up',
      iconColor: 'emerald',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
             </svg>`,
    },
    {
      id: 'last-verification',
      label: 'Last Verification',
      value: 'Today',
      trend: 'All verified',
      trendType: 'neutral',
      iconColor: 'red',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M9 12l2 2 4-4"/>
               <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.39 0 4.56.92 6.17 2.42"/>
             </svg>`,
    },
  ];

  const quickActions = [
    {
      id: 'generate-token',
      label: 'Generate Token',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
             </svg>`,
      variant: 'primary',
    },
    {
      id: 'verify-access',
      label: 'Verify Access',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
             </svg>`,
      variant: '',
    },
    {
      id: 'security-scan',
      label: 'Security Scan',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
             </svg>`,
      variant: '',
    },
    {
      id: 'view-permissions',
      label: 'View Permissions',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
               <path d="M7 11V7a5 5 0 0110 0v4"/>
             </svg>`,
      variant: '',
    },
  ];

  const connectedServices = [
    {
      id: 'gmail-api',
      name: 'Gmail API',
      since: 'Connected Jan 12, 2024',
      status: 'active',
      iconColor: 'blue',
      lastVerified: 'Today, 09:41',
      scopeCount: '8 scopes',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
               <polyline points="22,6 12,13 2,6"/>
             </svg>`,
    },
    {
      id: 'drive-api',
      name: 'Google Drive API',
      since: 'Connected Jan 12, 2024',
      status: 'active',
      iconColor: 'emerald',
      lastVerified: 'Today, 09:41',
      scopeCount: '6 scopes',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
             </svg>`,
    },
    {
      id: 'sheets-api',
      name: 'Google Sheets API',
      since: 'Connected Feb 3, 2024',
      status: 'active',
      iconColor: 'violet',
      lastVerified: 'Today, 08:15',
      scopeCount: '4 scopes',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <rect x="3" y="3" width="18" height="18" rx="2"/>
               <path d="M3 9h18M3 15h18M9 3v18"/>
             </svg>`,
    },
    {
      id: 'telegram-api',
      name: 'Telegram Bot API',
      since: 'Connected Mar 7, 2024',
      status: 'warning',
      iconColor: 'orange',
      lastVerified: '2 days ago',
      scopeCount: '3 scopes',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/>
             </svg>`,
    },
  ];

  const tokens = [
    {
      id: 'gmail-token',
      name: 'MEA-GMAIL-TOKEN',
      type: 'OAuth2 Bearer',
      status: 'active',
      expiry: 'Expires Jan 12, 2025',
      iconColor: 'blue',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
             </svg>`,
    },
    {
      id: 'drive-token',
      name: 'MEA-DRIVE-TOKEN',
      type: 'OAuth2 Bearer',
      status: 'active',
      expiry: 'Expires Jan 12, 2025',
      iconColor: 'emerald',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
             </svg>`,
    },
    {
      id: 'telegram-token',
      name: 'MEA-TELEGRAM-TOKEN',
      type: 'Bot Token',
      status: 'expiring',
      expiry: 'Expires in 3 days',
      iconColor: 'orange',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
             </svg>`,
    },
    {
      id: 'sheets-token',
      name: 'MEA-SHEETS-TOKEN',
      type: 'Service Account',
      status: 'active',
      expiry: 'No expiry',
      iconColor: 'violet',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
             </svg>`,
    },
  ];

  const securityMetrics = [
    { label: 'Active Sessions',      value: '3' },
    { label: 'Verified Services',    value: '11' },
    { label: 'Failed Auths',         value: '2' },
    { label: 'Revoked Tokens',       value: '1' },
  ];

  const permissions = [
    {
      id: 'gmail-access',
      name: 'Gmail Access',
      scope: '8 scopes granted',
      status: 'granted',
      lastUpdated: 'Today',
      iconColor: 'blue',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
               <polyline points="22,6 12,13 2,6"/>
             </svg>`,
    },
    {
      id: 'drive-access',
      name: 'Drive Access',
      scope: '6 scopes granted',
      status: 'granted',
      lastUpdated: 'Today',
      iconColor: 'emerald',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
             </svg>`,
    },
    {
      id: 'sheets-access',
      name: 'Sheets Access',
      scope: '4 scopes granted',
      status: 'granted',
      lastUpdated: 'Feb 3, 2024',
      iconColor: 'violet',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <rect x="3" y="3" width="18" height="18" rx="2"/>
               <path d="M3 9h18M3 15h18M9 3v18"/>
             </svg>`,
    },
    {
      id: 'telegram-access',
      name: 'Telegram Access',
      scope: '3 scopes — limited',
      status: 'limited',
      lastUpdated: '2 days ago',
      iconColor: 'orange',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/>
             </svg>`,
    },
  ];

  const securityAlerts = [
    {
      id: 'alert-1',
      text: 'Token expiring in 3 days',
      time: '1 hour ago',
      iconColor: 'warning',
      badge: 'Expiring',
      badgeType: 'warning',
    },
    {
      id: 'alert-2',
      text: 'New device authorization detected',
      time: '3 hours ago',
      iconColor: 'blue',
      badge: 'Info',
      badgeType: 'info',
    },
    {
      id: 'alert-3',
      text: 'Permission update detected on Telegram',
      time: 'Yesterday',
      iconColor: 'violet',
      badge: 'Update',
      badgeType: 'neutral',
    },
    {
      id: 'alert-4',
      text: 'Failed authentication attempt blocked',
      time: '2 days ago',
      iconColor: 'red',
      badge: 'Blocked',
      badgeType: 'danger',
    },
  ];

  const activityItems = [
    {
      id: 'act-1',
      text: 'MEA-GMAIL-TOKEN generated',
      time: '2 hours ago',
      dotColor: 'blue',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
             </svg>`,
    },
    {
      id: 'act-2',
      text: 'Gmail API access verified',
      time: 'Today, 09:41',
      dotColor: 'emerald',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
             </svg>`,
    },
    {
      id: 'act-3',
      text: 'Drive permission scope updated',
      time: 'Today, 08:15',
      dotColor: 'violet',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
               <path d="M7 11V7a5 5 0 0110 0v4"/>
             </svg>`,
    },
    {
      id: 'act-4',
      text: 'Security scan completed — no issues',
      time: 'Yesterday',
      dotColor: 'emerald',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
             </svg>`,
    },
    {
      id: 'act-5',
      text: 'Telegram integration re-verified',
      time: '2 days ago',
      dotColor: 'orange',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/>
             </svg>`,
    },
  ];

  const integrationStatus = [
    {
      id: 'gmail-int',
      name: 'Gmail API',
      sub: 'OAuth2 — all scopes active',
      status: 'healthy',
      badge: 'Healthy',
    },
    {
      id: 'drive-int',
      name: 'Google Drive API',
      sub: 'Service account connected',
      status: 'healthy',
      badge: 'Healthy',
    },
    {
      id: 'sheets-int',
      name: 'Google Sheets API',
      sub: 'Read/write access granted',
      status: 'healthy',
      badge: 'Healthy',
    },
    {
      id: 'telegram-int',
      name: 'Telegram Bot API',
      sub: 'Token expiring — action needed',
      status: 'warning',
      badge: 'Warning',
    },
  ];

  return {
    getSummaryStats:      () => summaryStats,
    getQuickActions:      () => quickActions,
    getConnectedServices: () => connectedServices,
    getTokens:            () => tokens,
    getSecurityMetrics:   () => securityMetrics,
    getPermissions:       () => permissions,
    getSecurityAlerts:    () => securityAlerts,
    getActivityItems:     () => activityItems,
    getIntegrationStatus: () => integrationStatus,
  };
})();


/* ════════════════════════════════════════════════
   UI LAYER
════════════════════════════════════════════════ */
const OAuthUI = (() => {

  /* ── Summary Stats ── */
  function renderSummary() {
    const grid = document.getElementById('summary-grid');
    if (!grid) return;
    grid.innerHTML = OAuthData.getSummaryStats().map(s => `
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

  /* ── Quick Actions ── */
  function renderActions() {
    const bar = document.getElementById('actions-bar');
    if (!bar) return;
    bar.innerHTML = `
      <span class="gc-actions-label">Quick Actions</span>
      ${OAuthData.getQuickActions().map(a => `
        <button class="gc-action-btn${a.variant === 'primary' ? ' gc-action-btn--primary' : ''}"
                data-action="${a.id}">
          ${a.icon}
          ${a.label}
        </button>
      `).join('')}
    `;
  }

  /* ── Connected Services ── */
  function renderServices() {
    const grid = document.getElementById('services-grid');
    if (!grid) return;
    grid.innerHTML = OAuthData.getConnectedServices().map(svc => `
      <div class="oc-service-card" data-service="${svc.id}">
        <div class="oc-svc-top">
          <div class="oc-svc-icon-wrap oc-svc-icon-wrap--${svc.iconColor}">${svc.icon}</div>
          <div class="oc-svc-info">
            <div class="oc-svc-name">${svc.name}</div>
            <div class="oc-svc-since">${svc.since}</div>
          </div>
        </div>

        <span class="gc-status-badge gc-status-badge--${svc.status}">
          <span class="gc-status-dot"></span>
          ${svc.status === 'active' ? 'Active' : 'Warning'}
        </span>

        <div class="oc-svc-meta">
          <div class="oc-svc-meta-row">
            <span class="oc-svc-meta-label">Last Verified</span>
            <span class="oc-svc-meta-val">${svc.lastVerified}</span>
          </div>
          <div class="oc-svc-meta-row">
            <span class="oc-svc-meta-label">Scopes</span>
            <span class="oc-svc-meta-val">${svc.scopeCount}</span>
          </div>
        </div>

        <div class="oc-svc-footer">
          <button class="gc-manage-btn" data-service-manage="${svc.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>
            </svg>
            Manage Access
          </button>
        </div>
      </div>
    `).join('');
  }

  /* ── Token List ── */
  function renderTokens() {
    const list = document.getElementById('token-list');
    if (!list) return;
    const tokens = OAuthData.getTokens();
    list.innerHTML = tokens.map(t => `
      <div class="oc-token-item" data-token="${t.id}">
        <div class="oc-token-icon oc-token-icon--${t.iconColor}">${t.icon}</div>
        <div class="oc-token-info">
          <div class="oc-token-name">${t.name}</div>
          <div class="oc-token-type">${t.type}</div>
          <div class="oc-token-actions">
            <button class="oc-token-btn" data-token-refresh="${t.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
              </svg>
              Refresh
            </button>
            <button class="oc-token-btn oc-token-btn--danger" data-token-revoke="${t.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Revoke
            </button>
          </div>
        </div>
        <div class="oc-token-right">
          <span class="oc-token-badge oc-token-badge--${t.status}">
            ${t.status.charAt(0).toUpperCase() + t.status.slice(1)}
          </span>
          <span class="oc-token-exp">${t.expiry}</span>
        </div>
      </div>
    `).join('');

    updateTokenCount();
  }

  function updateTokenCount() {
    const active = OAuthData.getTokens().filter(t => t.status === 'active').length;
    const el = document.getElementById('token-active-count');
    if (el) el.textContent = `${active} Active`;
  }

  /* ── Security Overview ── */
  function renderSecurity() {
    const body = document.getElementById('security-body');
    if (!body) return;
    const score = 98;
    const circ  = 2 * Math.PI * 28;
    const offset = circ - (score / 100) * circ;

    const metricsHTML = OAuthData.getSecurityMetrics().map(m => `
      <div class="oc-sec-metric">
        <div class="oc-sec-metric-val">${m.value}</div>
        <div class="oc-sec-metric-label">${m.label}</div>
      </div>
    `).join('');

    body.innerHTML = `
      <div class="oc-score-row">
        <svg class="oc-score-ring" viewBox="0 0 80 80">
          <circle class="oc-score-ring-bg" cx="40" cy="40" r="28"/>
          <circle class="oc-score-ring-fill" cx="40" cy="40" r="28"
            style="stroke-dasharray:${circ.toFixed(1)};stroke-dashoffset:${offset.toFixed(1)}"
          />
        </svg>
        <div class="oc-score-summary">
          <div class="oc-score-val">${score}%</div>
          <div class="oc-score-label">Security Score — Excellent</div>
        </div>
      </div>
      <div class="oc-security-metrics">${metricsHTML}</div>
    `;
  }

  /* ── Permissions ── */
  function renderPermissions() {
    const list = document.getElementById('perm-list');
    if (!list) return;
    list.innerHTML = OAuthData.getPermissions().map(p => `
      <div class="oc-perm-item" data-perm="${p.id}">
        <div class="oc-perm-icon oc-perm-icon--${p.iconColor}">${p.icon}</div>
        <div class="oc-perm-info">
          <div class="oc-perm-name">${p.name}</div>
          <div class="oc-perm-scope">${p.scope}</div>
        </div>
        <div class="oc-perm-right">
          <span class="oc-perm-badge oc-perm-badge--${p.status}">
            ${p.status.charAt(0).toUpperCase() + p.status.slice(1)}
          </span>
          <span class="oc-perm-updated">${p.lastUpdated}</span>
        </div>
      </div>
    `).join('');
  }

  /* ── Security Alerts ── */
  function renderAlerts() {
    const list = document.getElementById('alerts-list');
    if (!list) return;
    const iconMap = {
      warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>`,
      red:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>`,
      blue:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>`,
      violet:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>`,
    };

    list.innerHTML = OAuthData.getSecurityAlerts().map(a => `
      <div class="oc-alert-item" data-alert="${a.id}">
        <div class="oc-alert-icon oc-alert-icon--${a.iconColor}">
          ${iconMap[a.iconColor] || iconMap.blue}
        </div>
        <div class="oc-alert-info">
          <div class="oc-alert-text">${a.text}</div>
          <div class="oc-alert-time">${a.time}</div>
        </div>
        <span class="oc-alert-badge oc-alert-badge--${a.badgeType}">${a.badge}</span>
      </div>
    `).join('');

    const countEl = document.getElementById('alerts-count');
    if (countEl) countEl.textContent = `${OAuthData.getSecurityAlerts().length} Alerts`;
  }

  /* ── Activity Timeline ── */
  function renderActivity() {
    const tl = document.getElementById('activity-timeline');
    if (!tl) return;
    tl.innerHTML = OAuthData.getActivityItems().map(item => `
      <div class="gc-timeline-item">
        <div class="gc-timeline-dot gc-timeline-dot--${item.dotColor}">${item.icon}</div>
        <div class="gc-timeline-info">
          <div class="gc-timeline-text">${item.text}</div>
          <div class="gc-timeline-time">${item.time}</div>
        </div>
      </div>
    `).join('');
  }

  /* ── Integration Status ── */
  function renderIntegration() {
    const list = document.getElementById('integration-list');
    if (!list) return;
    list.innerHTML = OAuthData.getIntegrationStatus().map(item => `
      <div class="gc-sync-item" data-integration="${item.id}">
        <span class="gc-sync-indicator gc-sync-indicator--${item.status}"></span>
        <div class="gc-sync-info">
          <div class="gc-sync-name">${item.name}</div>
          <div class="gc-sync-sub">${item.sub}</div>
        </div>
        <span class="gc-sync-badge gc-sync-badge--${item.status}">${item.badge}</span>
      </div>
    `).join('');
  }

  /* ── Sidebar ── */
  function renderSidebar() {
    if (typeof MEASidebar !== 'undefined') {
      MEASidebar.init();
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }

  /* ── Live Clock ── */
  function startClock() {
    const c = document.getElementById('liveClock');
    function tick() {
      const n = new Date();
      const p = v => String(v).padStart(2, '0');
      if (c) c.textContent = p(n.getHours()) + ':' + p(n.getMinutes()) + ':' + p(n.getSeconds());
    }
    tick();
    setInterval(tick, 1000);
  }

  function renderAll() {
    renderSidebar();
    renderSummary();
    renderActions();
    renderServices();
    renderTokens();
    renderSecurity();
    renderPermissions();
    renderAlerts();
    renderActivity();
    renderIntegration();
    startClock();
  }

  return { renderAll, updateTokenCount };
})();


/* ════════════════════════════════════════════════
   ACTIONS LAYER
════════════════════════════════════════════════ */
const OAuthActions = (() => {

  function onActionClick(actionId) {
    const handlers = {
      'generate-token':    () => console.log('[OAuth] Generate Token'),
      'verify-access':     () => console.log('[OAuth] Verify Access'),
      'security-scan':     () => console.log('[OAuth] Security Scan — running'),
      'view-permissions':  () => console.log('[OAuth] View Permissions'),
    };
    const fn = handlers[actionId];
    if (fn) fn();
  }

  function onManageService(serviceId) {
    console.log(`[OAuth] Manage service: ${serviceId}`);
    // TODO: open service detail modal or navigate to detail page
  }

  function onTokenRefresh(tokenId) {
    console.log(`[OAuth] Refresh token: ${tokenId}`);
    // TODO: call Supabase function to rotate token
  }

  function onTokenRevoke(tokenId) {
    console.log(`[OAuth] Revoke token: ${tokenId}`);
    // TODO: confirm then call Supabase to revoke
  }

  function onRefresh() {
    console.log('[OAuth] Refresh all data');
    // TODO: re-fetch from Supabase
  }

  function bindAll() {
    // Quick action buttons
    document.getElementById('actions-bar')?.addEventListener('click', e => {
      const btn = e.target.closest('[data-action]');
      if (btn) onActionClick(btn.dataset.action);
    });

    // Add service button
    document.getElementById('btn-add-service')?.addEventListener('click', () => {
      console.log('[OAuth] Add Service');
    });

    // Manage service buttons
    document.getElementById('services-grid')?.addEventListener('click', e => {
      const btn = e.target.closest('[data-service-manage]');
      if (btn) onManageService(btn.dataset.serviceManage);
    });

    // Token refresh buttons
    document.getElementById('token-list')?.addEventListener('click', e => {
      const refreshBtn = e.target.closest('[data-token-refresh]');
      const revokeBtn  = e.target.closest('[data-token-revoke]');
      if (refreshBtn) onTokenRefresh(refreshBtn.dataset.tokenRefresh);
      if (revokeBtn)  onTokenRevoke(revokeBtn.dataset.tokenRevoke);
    });

    // Refresh header button
    document.getElementById('btn-refresh-header')?.addEventListener('click', onRefresh);

    // View all activity
    document.getElementById('btn-view-all-activity')?.addEventListener('click', () => {
      console.log('[OAuth] View all activity');
    });

    // View all permissions
    document.getElementById('btn-view-all-perms')?.addEventListener('click', () => {
      console.log('[OAuth] View all permissions');
    });
  }

  return { bindAll };
})();


/* ════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  OAuthUI.renderAll();
  OAuthActions.bindAll();
});
