/* ============================================
   MEA ASSISTANT — SHELL.JS
   Injects sidebar + mobile nav into empty page shells.
   Each shell calls: MEAShell.init(root, activePage)
   root = relative path back to dashboard/owner/ (e.g. '../../')
   activePage = 'users' | 'account' | 'ai' | 'analytics' | 'settings'
   ============================================ */

window.MEAShell = (function () {
  function buildSidebar(root, activePage, activeChild) {
    const nav = [
      {
        id: 'overview', label: 'Overview', href: `${root}index.html`,
        icon: `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`
      },
      {
        id: 'users', label: 'Users', href: `${root}users/index.html`,
        icon: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`
      },
      {
        id: 'account', label: 'Account',
        icon: `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
        children: [
          { id: 'gmail',  label: 'Gmail',  href: `${root}account/gmail/index.html`,  icon: `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>` },
          { id: 'drive',  label: 'Drive',  href: `${root}account/drive/index.html`,  icon: `<line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>` },
          { id: 'oauth',  label: 'OAuth',  href: `${root}account/oauth/index.html`,  icon: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>` },
          { id: 'logs',   label: 'Logs',   href: `${root}account/logs/index.html`,   icon: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>` },
        ]
      },
      {
        id: 'ai', label: 'AI',
        icon: `<rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>`,
        children: [
          { id: 'models',  label: 'Models',   href: `${root}ai/models/index.html`,  icon: `<path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>` },
          { id: 'apikeys', label: 'API Keys', href: `${root}ai/apikeys/index.html`, icon: `<circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6"/><path d="M15.5 7.5l3 3L22 7l-3-3"/>` },
          { id: 'usage',   label: 'Usage',    href: `${root}ai/usage/index.html`,   icon: `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>` },
        ]
      },
      {
        id: 'analytics', label: 'Analytics', href: `${root}analytics/index.html`,
        icon: `<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>`
      },
      {
        id: 'settings', label: 'Settings', href: `${root}settings/index.html`,
        icon: `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>`
      },
    ];

    const chevron = `<svg class="nav-item-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;

    function icon(paths) {
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
    }
    function childIcon(paths) {
      return `<svg class="nav-child-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
    }

    let html = '';
    nav.forEach((item, i) => {
      if (i === 2) html += '<div class="nav-divider"></div>';
      if (i === 5) html += '<div class="nav-divider"></div>';

      const isActive = item.id === activePage;

      if (item.children) {
        const hasActiveChild = item.children.some(c => c.id === activeChild);
        html += `
          <div class="nav-group">
            <div class="nav-item${isActive || hasActiveChild ? ' active' : ''}" data-group="${item.id}">
              <span class="nav-item-icon">${icon(item.icon)}</span>
              <span class="nav-item-label">${item.label}</span>
              ${chevron}
            </div>
            <div class="nav-children${hasActiveChild ? ' open' : ''}" id="group-${item.id}">
              ${item.children.map(c => `
                <div class="nav-child${c.id === activeChild ? ' active' : ''}" data-href="${c.href}" onclick="location.href='${c.href}'">
                  ${childIcon(c.icon)}${c.label}
                </div>`).join('')}
            </div>
          </div>`;
      } else {
        html += `
          <div class="nav-group">
            <div class="nav-item${isActive ? ' active' : ''}" data-href="${item.href}" onclick="location.href='${item.href}'">
              <span class="nav-item-icon">${icon(item.icon)}</span>
              <span class="nav-item-label">${item.label}</span>
            </div>
          </div>`;
      }
    });
    return html;
  }

  function logoSVG() {
    return `<svg class="mea-logo" viewBox="0 0 64 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="MEA">
      <defs>
        <linearGradient id="slg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e02020"/><stop offset="100%" stop-color="#9b1515"/></linearGradient>
        <linearGradient id="slg2" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e02020"/><stop offset="100%" stop-color="#9b1515"/></linearGradient>
      </defs>
      <polygon points="4,0 28,0 28,4 16,22 4,14" fill="url(#slg1)"/>
      <polygon points="4,14 16,22 4,28" fill="#9b1515" opacity="0.85"/>
      <polygon points="4,32 16,26 28,34 28,40 16,48 4,40" fill="#6b0f0f"/>
      <polygon points="4,28 16,22 16,26 4,32" fill="#c8181a" opacity="0.7"/>
      <polygon points="4,40 16,48 8,56 0,56" fill="#3d0a0a"/>
      <polygon points="60,0 36,0 36,4 48,22 60,14" fill="url(#slg2)"/>
      <polygon points="60,14 48,22 60,28" fill="#9b1515" opacity="0.85"/>
      <polygon points="60,32 48,26 36,34 36,40 48,48 60,40" fill="#6b0f0f"/>
      <polygon points="60,28 48,22 48,26 60,32" fill="#c8181a" opacity="0.7"/>
      <polygon points="60,40 48,48 56,56 64,56" fill="#3d0a0a"/>
      <polygon points="28,4 36,4 32,10" fill="rgba(255,255,255,0.15)"/>
      <polygon points="28,34 36,34 32,39" fill="rgba(255,255,255,0.08)"/>
    </svg>`;
  }

  function mobileNav(root, activePage) {
    const items = [
      { id:'overview', label:'Home', href:`${root}index.html`, icon:`<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>` },
      { id:'users',    label:'Users', href:`${root}users/index.html`, icon:`<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>` },
      { id:'account',  label:'Account', href:`${root}account/index.html`, icon:`<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>` },
      { id:'ai',       label:'AI', href:`${root}ai/index.html`, icon:`<rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/>` },
      { id:'settings', label:'Settings', href:`${root}settings/index.html`, icon:`<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>` },
    ];
    return items.map(item => `
      <div class="mobile-nav-item${item.id === activePage ? ' active' : ''}" data-href="${item.href}" onclick="location.href='${item.href}'">
        <svg class="mobile-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${item.icon}</svg>
        <span class="mobile-nav-label">${item.label}</span>
      </div>`).join('');
  }

  function init(root, activePage, activeChild, pageTitle) {
    root = root || '../../';

    // Inject sidebar
    const sidebarEl = document.getElementById('sidebar');
    if (sidebarEl) {
      sidebarEl.innerHTML = `
        <div class="sidebar-logo">
          <div class="logo-glow-wrap">${logoSVG()}</div>
          <span class="sidebar-logo-text">MEA</span>
          <button class="sidebar-toggle" id="sidebarToggle" title="Toggle sidebar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
        </div>
        <nav class="sidebar-nav">${buildSidebar(root, activePage, activeChild)}</nav>
        <div class="sidebar-footer">
          <div class="nav-item" style="cursor:default;">
            <span class="nav-item-icon"><span class="status-dot success"></span></span>
            <span class="nav-item-label" style="font-size:10px;color:var(--text-tertiary);">SYSTEM ONLINE</span>
          </div>
        </div>`;
    }

    // Inject mobile nav
    const mobileEl = document.querySelector('.mobile-nav-inner');
    if (mobileEl) mobileEl.innerHTML = mobileNav(root, activePage);

    // Load shared scripts
    const scripts = [`${root}assets/js/auth.js`, `${root}assets/js/sidebar.js`];
    scripts.forEach(src => {
      const s = document.createElement('script');
      s.src = src;
      document.body.appendChild(s);
    });
  }

  return { init };
})();
