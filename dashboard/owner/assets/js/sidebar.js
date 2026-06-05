/**
 * MEA Assistant — Shared Sidebar
 * Auto-detects current page depth and sets correct relative paths.
 * Every page calls:  MEASidebar.init()
 */
const MEASidebar = (() => {

  // Resolve base path to /dashboard/owner/ root from any depth
  function getBase() {
    const path = window.location.pathname;
    // Count segments after /dashboard/owner/
    const match = path.match(/\/dashboard\/owner(\/[^/]+)?(\/[^/]+)?/);
    if (!match) return './';
    const depth = [match[1], match[2]].filter(Boolean).length;
    // If we are inside a subfolder, go up
    if (depth === 0) return './';      // at owner/index.html
    if (depth === 1) return '../';     // at owner/account/index.html
    return '../../';                   // deeper
  }

  // Nav items definition — single source of truth
  const NAV = [
    { id: 'dashboard', label: 'Dashboard',        icon: 'layout-dashboard', href: '' },
    { id: 'users',     label: 'Manajemen Users',  icon: 'users',            href: 'users/' },
    { id: 'account',   label: 'Account Center',   icon: 'briefcase',        href: 'account/' },
    { id: 'ai',        label: 'AI Center',         icon: 'cpu',              href: 'ai/' },
    { id: 'analytics', label: 'Analytics',         icon: 'bar-chart-2',      href: 'analytics/' },
  ];

  const NAV_BOTTOM = [
    { id: 'settings',  label: 'Settings',          icon: 'settings',         href: 'settings/' },
  ];

  // Detect which page is active from pathname
  function getActiveId() {
    const p = window.location.pathname;
    if (/\/users\/?/.test(p))     return 'users';
    if (/\/account\/?/.test(p))   return 'account';
    if (/\/ai\/?/.test(p))        return 'ai';
    if (/\/analytics\/?/.test(p)) return 'analytics';
    if (/\/settings\/?/.test(p))  return 'settings';
    return 'dashboard';
  }

  function renderNav(items, base, activeId) {
    return items.map(item => {
      const isActive = item.id === activeId;
      return `
        <li class="nav-item${isActive ? ' active' : ''}">
          <a href="${base}${item.href}"${isActive ? ' aria-current="page"' : ''}>
            <i data-lucide="${item.icon}"></i>
            <span>${item.label}</span>
          </a>
        </li>`;
    }).join('');
  }

  function buildHTML(base, activeId) {
    // Logo src — light theme
    const logoSrc = `${base}assets/img/logo.light.png`;
    const faviconSrc = `${base}assets/img/favicon.png`;

    return `
      <div class="sidebar-header">
        <a href="${base}" class="logo-wrap" aria-label="MEA Assistant Home">
          <div class="logo-img-wrap">
            <img src="${logoSrc}" alt="MEA Assistant Logo" class="mea-logo-img"
                 onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
            <!-- Fallback SVG if PNG not found -->
            <svg class="mea-logo-svg" viewBox="0 0 72 56" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:none">
              <defs>
                <linearGradient id="wL" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#FF1A1A"/><stop offset="100%" stop-color="#CC0000"/>
                </linearGradient>
                <linearGradient id="wLb" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#990000"/><stop offset="100%" stop-color="#5C0000"/>
                </linearGradient>
                <linearGradient id="wR" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#FF1A1A"/><stop offset="100%" stop-color="#CC0000"/>
                </linearGradient>
                <linearGradient id="wRb" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#990000"/><stop offset="100%" stop-color="#5C0000"/>
                </linearGradient>
              </defs>
              <polygon points="2,2 33,2 26,25 9,25" fill="url(#wL)"/>
              <polygon points="26,2 33,2 26,25" fill="#B80000" opacity="0.6"/>
              <polygon points="9,28 26,28 33,54 2,54" fill="url(#wLb)"/>
              <polygon points="26,28 33,28 33,54" fill="#7A0000" opacity="0.5"/>
              <polygon points="70,2 39,2 46,25 63,25" fill="url(#wR)"/>
              <polygon points="46,2 39,2 46,25" fill="#B80000" opacity="0.6"/>
              <polygon points="63,28 46,28 39,54 70,54" fill="url(#wRb)"/>
              <polygon points="46,28 39,28 39,54" fill="#7A0000" opacity="0.5"/>
            </svg>
            <div class="logo-glow"></div>
          </div>
          <div class="logo-text">
            <span class="logo-name">MEA</span>
            <span class="logo-sub">MEA Assistant</span>
          </div>
        </a>
      </div>

      <nav class="sidebar-nav" aria-label="Main navigation">
        <ul>${renderNav(NAV, base, activeId)}</ul>
      </nav>

      <div class="sidebar-footer">
        <nav aria-label="Settings navigation">
          <ul>${renderNav(NAV_BOTTOM, base, activeId)}</ul>
        </nav>
        <div class="sidebar-profile">
          <div class="profile-avatar">O</div>
          <div class="profile-info">
            <span class="profile-name">Owner</span>
            <span class="profile-role">Super Admin</span>
          </div>
          <button class="profile-logout" aria-label="Logout">
            <i data-lucide="log-out"></i>
          </button>
        </div>
      </div>
    `;
  }

  function injectFavicon(base) {
    // Set favicon dynamically
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = `${base}assets/img/favicon.png`;
  }

  function init() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const base     = getBase();
    const activeId = getActiveId();

    sidebar.innerHTML = buildHTML(base, activeId);
    injectFavicon(base);

    // Re-init Lucide after DOM injection
    if (window.lucide) lucide.createIcons();

    // Mobile drawer
    const menuBtn = document.getElementById('menuBtn');
    const overlay = document.getElementById('drawerOverlay');

    function openDrawer()  {
      sidebar.classList.add('open');
      if (overlay) overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeDrawer() {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    menuBtn?.addEventListener('click', openDrawer);
    overlay?.addEventListener('click', closeDrawer);
  }

  return { init };
})();
