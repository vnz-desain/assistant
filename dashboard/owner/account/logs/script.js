/* ════════════════════════════════════════════════
   Logs Center — script.js
   owner/account/logs/script.js
   Architecture: Data Layer → UI Layer → Actions Layer
   Supabase integration: NOT YET — placeholder arrays only
════════════════════════════════════════════════ */

'use strict';

/* ════════════════════════════════════════════════
   DATA LAYER
   Replace with Supabase queries when integrating
════════════════════════════════════════════════ */
const LogsData = (() => {

  const summaryStats = [
    {
      id: 'total-events',
      label: 'Total Events',
      value: '48,291',
      trend: '+2.4k today',
      trendType: 'up',
      iconColor: 'blue',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    },
    {
      id: 'active-today',
      label: 'Active Today',
      value: '1,284',
      trend: '+183 this hour',
      trendType: 'up',
      iconColor: 'emerald',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    },
    {
      id: 'security-events',
      label: 'Security Events',
      value: '23',
      trend: '5 unresolved',
      trendType: 'down',
      iconColor: 'red',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    },
    {
      id: 'system-health',
      label: 'System Health',
      value: '99.9%',
      trend: 'Excellent',
      trendType: 'up',
      iconColor: 'violet',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    },
  ];

  const quickActions = [
    {
      id: 'refresh-logs',
      label: 'Refresh Logs',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>',
      variant: 'primary',
    },
    {
      id: 'export-logs',
      label: 'Export Logs',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
      variant: '',
    },
    {
      id: 'security-audit',
      label: 'Security Audit',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      variant: '',
    },
    {
      id: 'clear-filters',
      label: 'Clear Filters',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
      variant: '',
    },
  ];

  const eventOverview = [
    {
      id: 'user-events',
      name: 'User Events',
      count: '12,841',
      sub: '+284 today',
      iconColor: 'blue',
      status: 'active',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    },
    {
      id: 'gmail-events',
      name: 'Gmail Events',
      count: '9,302',
      sub: '+147 today',
      iconColor: 'rose',
      status: 'active',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    },
    {
      id: 'drive-events',
      name: 'Drive Events',
      count: '7,548',
      sub: '+93 today',
      iconColor: 'emerald',
      status: 'active',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>',
    },
    {
      id: 'oauth-events',
      name: 'OAuth Events',
      count: '4,217',
      sub: '+38 today',
      iconColor: 'violet',
      status: 'active',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>',
    },
    {
      id: 'api-events',
      name: 'API Events',
      count: '14,383',
      sub: '+722 today',
      iconColor: 'orange',
      status: 'active',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    },
  ];

  const logFilters = [
    { id: 'all',      label: 'All Events',      sub: 'Every log entry',        count: '48,291', iconColor: 'neutral', active: true,
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>' },
    { id: 'user',     label: 'User Events',     sub: 'Login, session, actions', count: '12,841', iconColor: 'blue',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
    { id: 'gmail',    label: 'Gmail Events',    sub: 'Sync, send, receive',    count: '9,302', iconColor: 'rose',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
    { id: 'drive',    label: 'Drive Events',    sub: 'Upload, backup, access', count: '7,548', iconColor: 'emerald',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>' },
    { id: 'oauth',    label: 'OAuth Events',    sub: 'Token, auth, permission', count: '4,217', iconColor: 'violet',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>' },
    { id: 'security', label: 'Security Events', sub: 'Alerts, violations',     count: '23',    iconColor: 'orange',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
  ];

  const systemHealth = [
    { id: 'server',   name: 'Server Status',        sub: 'All regions nominal',    status: 'healthy', badge: 'Healthy' },
    { id: 'gmail',    name: 'Gmail Integration',     sub: 'Last sync 2 min ago',    status: 'healthy', badge: 'Healthy' },
    { id: 'drive',    name: 'Drive Integration',     sub: 'Last sync 5 min ago',    status: 'healthy', badge: 'Healthy' },
    { id: 'oauth',    name: 'OAuth Services',        sub: 'Token rotation active',  status: 'healthy', badge: 'Healthy' },
    { id: 'telegram', name: 'Telegram Services',     sub: 'Rate limit threshold',   status: 'warning', badge: 'Warning' },
  ];

  const activityLogs = [
    { id: 'act-01', text: 'User login successful',            source: 'User Center',   time: 'Today, 10:42 AM', dotColor: 'blue',    badge: 'success', badgeText: 'Success',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>' },
    { id: 'act-02', text: 'Gmail account synchronized',       source: 'Gmail Center',  time: 'Today, 10:38 AM', dotColor: 'rose',    badge: 'success', badgeText: 'Success',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
    { id: 'act-03', text: 'Drive backup completed',           source: 'Drive Center',  time: 'Today, 10:31 AM', dotColor: 'emerald', badge: 'success', badgeText: 'Success',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>' },
    { id: 'act-04', text: 'OAuth token refreshed',            source: 'OAuth Center',  time: 'Today, 10:15 AM', dotColor: 'violet',  badge: 'info',    badgeText: 'Info',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>' },
    { id: 'act-05', text: 'Telegram notification sent',       source: 'Telegram Bot',  time: 'Today, 10:08 AM', dotColor: 'blue',    badge: 'success', badgeText: 'Success',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>' },
    { id: 'act-06', text: 'Security verification completed',  source: 'Security',      time: 'Today, 09:54 AM', dotColor: 'emerald', badge: 'success', badgeText: 'Success',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>' },
    { id: 'act-07', text: 'API request processed',            source: 'API Gateway',   time: 'Today, 09:47 AM', dotColor: 'orange',  badge: 'info',    badgeText: 'Info',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>' },
    { id: 'act-08', text: 'New device access detected',       source: 'Security',      time: 'Today, 09:33 AM', dotColor: 'indigo',  badge: 'warning', badgeText: 'Warning',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>' },
    { id: 'act-09', text: 'Drive file permissions updated',   source: 'Drive Center',  time: 'Today, 09:21 AM', dotColor: 'emerald', badge: 'info',    badgeText: 'Info',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>' },
    { id: 'act-10', text: 'Gmail label rules applied',        source: 'Gmail Center',  time: 'Today, 09:09 AM', dotColor: 'rose',    badge: 'success', badgeText: 'Success',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
  ];

  const securityEvents = [
    { id: 'sec-01', text: 'Failed Login Attempt',   time: 'Today, 09:12 AM', iconColor: 'rose',    severity: 'high',   severityText: 'High',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' },
    { id: 'sec-02', text: 'Permission Change',      time: 'Today, 08:47 AM', iconColor: 'orange',  severity: 'medium', severityText: 'Medium',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' },
    { id: 'sec-03', text: 'Token Refresh Override', time: 'Today, 08:22 AM', iconColor: 'orange',  severity: 'medium', severityText: 'Medium',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' },
    { id: 'sec-04', text: 'New Device Access',      time: 'Yesterday, 11:58 PM', iconColor: 'blue', severity: 'low',  severityText: 'Low',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' },
    { id: 'sec-05', text: 'Security Verification',  time: 'Yesterday, 09:41 AM', iconColor: 'emerald', severity: 'info', severityText: 'Resolved',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>' },
  ];

  const apiMetrics = [
    { label: 'Total Requests',  value: '14,383' },
    { label: 'Avg Response',    value: '142ms' },
    { label: 'Successful',      value: '14,201' },
    { label: 'Failed',          value: '182' },
  ];

  const apiBars = [
    { label: 'Successful Requests', pct: 98.7, color: 'emerald' },
    { label: 'Failed Requests',     pct: 1.3,  color: 'rose' },
    { label: 'Cached Responses',    pct: 72.4, color: 'blue' },
  ];

  const topModules = [
    { id: 'gmail',   name: 'Gmail Center',   sub: '9,302 events',  pct: 92, iconColor: 'blue',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
    { id: 'drive',   name: 'Drive Center',   sub: '7,548 events',  pct: 78, iconColor: 'emerald',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>' },
    { id: 'oauth',   name: 'OAuth Center',   sub: '4,217 events',  pct: 54, iconColor: 'violet',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>' },
    { id: 'account', name: 'Account Center', sub: '3,104 events',  pct: 41, iconColor: 'orange',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
    { id: 'users',   name: 'Users Center',   sub: '2,288 events',  pct: 29, iconColor: 'indigo',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>' },
  ];

  return {
    getSummaryStats:  () => summaryStats,
    getQuickActions:  () => quickActions,
    getEventOverview: () => eventOverview,
    getLogFilters:    () => logFilters,
    getSystemHealth:  () => systemHealth,
    getActivityLogs:  () => activityLogs,
    getSecurityEvents:() => securityEvents,
    getApiMetrics:    () => apiMetrics,
    getApiBars:       () => apiBars,
    getTopModules:    () => topModules,
  };
})();


/* ════════════════════════════════════════════════
   UI LAYER
════════════════════════════════════════════════ */
const LogsUI = (() => {

  /* ── Summary Stats ── */
  function renderSummary() {
    var grid = document.getElementById('summary-grid');
    if (!grid) return;
    grid.innerHTML = LogsData.getSummaryStats().map(function(s) {
      return '<div class="gc-stat-card" data-stat="' + s.id + '">' +
        '<div class="gc-stat-top">' +
          '<div class="gc-stat-icon gc-stat-icon--' + s.iconColor + '">' + s.icon + '</div>' +
          '<span class="gc-stat-trend gc-stat-trend--' + s.trendType + '">' + s.trend + '</span>' +
        '</div>' +
        '<div>' +
          '<div class="gc-stat-value">' + s.value + '</div>' +
          '<div class="gc-stat-label">' + s.label + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  /* ── Quick Actions ── */
  function renderActions() {
    var bar = document.getElementById('actions-bar');
    if (!bar) return;
    var html = '<span class="gc-actions-label">Quick Actions</span>';
    html += LogsData.getQuickActions().map(function(a) {
      var cls = 'gc-action-btn' + (a.variant === 'primary' ? ' gc-action-btn--primary' : '');
      return '<button class="' + cls + '" data-action="' + a.id + '">' + a.icon + a.label + '</button>';
    }).join('');
    bar.innerHTML = html;
  }

  /* ── Event Overview ── */
  function renderEventOverview() {
    var grid = document.getElementById('events-grid');
    if (!grid) return;
    grid.innerHTML = LogsData.getEventOverview().map(function(e) {
      return '<div class="lc-event-card" data-event="' + e.id + '">' +
        '<div class="lc-event-top">' +
          '<div class="lc-event-icon lc-event-icon--' + e.iconColor + '">' + e.icon + '</div>' +
          '<span class="lc-event-status lc-event-status--' + e.status + '"></span>' +
        '</div>' +
        '<div class="lc-event-info">' +
          '<div class="lc-event-count">' + e.count + '</div>' +
          '<div class="lc-event-name">' + e.name + '</div>' +
          '<div class="lc-event-sub">' + e.sub + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  /* ── Log Filters ── */
  function renderLogFilters() {
    var list = document.getElementById('filter-list');
    if (!list) return;
    list.innerHTML = LogsData.getLogFilters().map(function(f) {
      var activeCls = f.active ? ' lc-filter-item--active' : '';
      return '<div class="lc-filter-item' + activeCls + '" data-filter="' + f.id + '">' +
        '<div class="lc-filter-icon lc-filter-icon--' + f.iconColor + '">' + f.icon + '</div>' +
        '<div class="lc-filter-info">' +
          '<div class="lc-filter-label">' + f.label + '</div>' +
          '<div class="lc-filter-sub">' + f.sub + '</div>' +
        '</div>' +
        '<span class="lc-filter-count">' + f.count + '</span>' +
      '</div>';
    }).join('');
  }

  /* ── System Health ── */
  function renderSystemHealth() {
    var list = document.getElementById('health-list');
    if (!list) return;
    list.innerHTML = LogsData.getSystemHealth().map(function(item) {
      return '<div class="gc-sync-item" data-health="' + item.id + '">' +
        '<span class="gc-sync-indicator gc-sync-indicator--' + item.status + '"></span>' +
        '<div class="gc-sync-info">' +
          '<div class="gc-sync-name">' + item.name + '</div>' +
          '<div class="gc-sync-sub">' + item.sub + '</div>' +
        '</div>' +
        '<span class="gc-sync-badge gc-sync-badge--' + item.status + '">' + item.badge + '</span>' +
      '</div>';
    }).join('');

    var badge = document.getElementById('health-status-badge');
    if (badge) {
      var hasWarning = LogsData.getSystemHealth().some(function(h) { return h.status === 'warning'; });
      badge.textContent = hasWarning ? '1 Warning' : 'All Healthy';
    }
  }

  /* ── Activity Logs ── */
  function renderActivityLogs() {
    var list = document.getElementById('activity-list');
    if (!list) return;
    list.innerHTML = LogsData.getActivityLogs().map(function(item) {
      return '<div class="lc-act-item" data-log="' + item.id + '">' +
        '<div class="lc-act-dot lc-act-dot--' + item.dotColor + '">' + item.icon + '</div>' +
        '<div class="lc-act-info">' +
          '<div class="lc-act-text">' + item.text + '</div>' +
          '<div class="lc-act-meta">' +
            '<span class="lc-act-source">' + item.source + '</span>' +
            '<span class="lc-act-time">' + item.time + '</span>' +
          '</div>' +
        '</div>' +
        '<span class="lc-act-badge lc-act-badge--' + item.badge + '">' + item.badgeText + '</span>' +
      '</div>';
    }).join('');
  }

  /* ── Security Events ── */
  function renderSecurityEvents() {
    var list = document.getElementById('security-list');
    if (!list) return;
    list.innerHTML = LogsData.getSecurityEvents().map(function(s) {
      return '<div class="lc-sec-item" data-sec="' + s.id + '">' +
        '<div class="lc-sec-icon lc-sec-icon--' + s.iconColor + '">' + s.icon + '</div>' +
        '<div class="lc-sec-info">' +
          '<div class="lc-sec-text">' + s.text + '</div>' +
          '<div class="lc-sec-time">' + s.time + '</div>' +
        '</div>' +
        '<span class="lc-sec-badge lc-sec-badge--' + s.severity + '">' + s.severityText + '</span>' +
      '</div>';
    }).join('');

    var countEl = document.getElementById('security-count');
    if (countEl) countEl.textContent = LogsData.getSecurityEvents().length + ' Events';
  }

  /* ── API Activity ── */
  function renderApiActivity() {
    var body = document.getElementById('api-body');
    if (!body) return;

    var metricsHTML = LogsData.getApiMetrics().map(function(m) {
      return '<div class="lc-api-metric">' +
        '<div class="lc-api-metric-val">' + m.value + '</div>' +
        '<div class="lc-api-metric-label">' + m.label + '</div>' +
      '</div>';
    }).join('');

    var barsHTML = LogsData.getApiBars().map(function(b) {
      return '<div class="lc-api-bar-row">' +
        '<div class="lc-api-bar-header">' +
          '<span class="lc-api-bar-label">' + b.label + '</span>' +
          '<span class="lc-api-bar-pct">' + b.pct + '%</span>' +
        '</div>' +
        '<div class="lc-api-bar-track">' +
          '<div class="lc-api-bar-fill lc-api-bar-fill--' + b.color + '" style="width:' + b.pct + '%"></div>' +
        '</div>' +
      '</div>';
    }).join('');

    body.innerHTML =
      '<div class="lc-api-metrics">' + metricsHTML + '</div>' +
      '<div class="lc-api-bars">' + barsHTML + '</div>';
  }

  /* ── Top Active Modules ── */
  function renderTopModules() {
    var list = document.getElementById('modules-list');
    if (!list) return;
    list.innerHTML = LogsData.getTopModules().map(function(m, i) {
      return '<div class="lc-module-item" data-module="' + m.id + '">' +
        '<div class="lc-module-rank">' + (i + 1) + '</div>' +
        '<div class="lc-module-icon lc-module-icon--' + m.iconColor + '">' + m.icon + '</div>' +
        '<div class="lc-module-info">' +
          '<div class="lc-module-name">' + m.name + '</div>' +
          '<div class="lc-module-sub">' + m.sub + '</div>' +
        '</div>' +
        '<div class="lc-module-bar-wrap">' +
          '<div class="lc-module-bar-track">' +
            '<div class="lc-module-bar-fill lc-module-bar-fill--' + m.iconColor + '" style="width:' + m.pct + '%"></div>' +
          '</div>' +
          '<span class="lc-module-pct">' + m.pct + '%</span>' +
        '</div>' +
      '</div>';
    }).join('');
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
    var c = document.getElementById('liveClock');
    function tick() {
      var n = new Date();
      var p = function(v) { return String(v).padStart(2, '0'); };
      if (c) c.textContent = p(n.getHours()) + ':' + p(n.getMinutes()) + ':' + p(n.getSeconds());
    }
    tick();
    setInterval(tick, 1000);
  }

  function renderAll() {
    renderSidebar();
    renderSummary();
    renderActions();
    renderEventOverview();
    renderLogFilters();
    renderSystemHealth();
    renderActivityLogs();
    renderSecurityEvents();
    renderApiActivity();
    renderTopModules();
    startClock();
  }

  return { renderAll };
})();


/* ════════════════════════════════════════════════
   ACTIONS LAYER
════════════════════════════════════════════════ */
const LogsActions = (() => {

  function onActionClick(actionId) {
    var handlers = {
      'refresh-logs':   function() { console.log('[Logs] Refresh Logs'); },
      'export-logs':    function() { console.log('[Logs] Export Logs'); },
      'security-audit': function() { console.log('[Logs] Security Audit'); },
      'clear-filters':  function() {
        console.log('[Logs] Clear Filters');
        var items = document.querySelectorAll('.lc-filter-item');
        items.forEach(function(el) {
          el.classList.remove('lc-filter-item--active');
          if (el.dataset.filter === 'all') el.classList.add('lc-filter-item--active');
        });
      },
    };
    var fn = handlers[actionId];
    if (fn) fn();
  }

  function onFilterClick(filterId) {
    console.log('[Logs] Filter: ' + filterId);
    var items = document.querySelectorAll('.lc-filter-item');
    items.forEach(function(el) {
      el.classList.toggle('lc-filter-item--active', el.dataset.filter === filterId);
    });
    // TODO: Re-fetch filtered logs from Supabase
  }

  function onRefresh() {
    console.log('[Logs] Refresh all data');
    // TODO: re-fetch from Supabase
  }

  function bindAll() {
    // Quick action buttons
    var actionsBar = document.getElementById('actions-bar');
    if (actionsBar) {
      actionsBar.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-action]');
        if (btn) onActionClick(btn.dataset.action);
      });
    }

    // Filter items
    var filterList = document.getElementById('filter-list');
    if (filterList) {
      filterList.addEventListener('click', function(e) {
        var item = e.target.closest('[data-filter]');
        if (item) onFilterClick(item.dataset.filter);
      });
    }

    // Clear filters button
    var clearBtn = document.getElementById('btn-clear-filters');
    if (clearBtn) {
      clearBtn.addEventListener('click', function() { onFilterClick('all'); });
    }

    // Refresh header button
    var refreshBtn = document.getElementById('btn-refresh-header');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', onRefresh);
    }

    // View all events
    var viewEventsBtn = document.getElementById('btn-view-all-events');
    if (viewEventsBtn) {
      viewEventsBtn.addEventListener('click', function() { console.log('[Logs] View all events'); });
    }

    // View all activity
    var viewActivityBtn = document.getElementById('btn-view-all-activity');
    if (viewActivityBtn) {
      viewActivityBtn.addEventListener('click', function() { console.log('[Logs] View all activity'); });
    }
  }

  return { bindAll };
})();


/* ════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  LogsUI.renderAll();
  LogsActions.bindAll();
});
