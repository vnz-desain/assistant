/* ============================================================
   DRIVE CENTER — page-drive
============================================================ */

// ── Mock data (replace with real API calls) ──────────────────
const DRIVE_ACCOUNTS = [
  { id: 'acc1', initials: 'ME', name: 'MEA Primary', email: 'mea@gmail.com', active: true },
  { id: 'acc2', initials: 'WS', name: 'Workspace',   email: 'evan@workspace.com', active: false },
];

const DRIVE_RECENT_FILES = [
  { name: 'MEA_BrandKit_v3.pdf',      type: 'pdf',   size: '4.2 MB', modified: '2 hours ago',  url: '#' },
  { name: 'Assistant_Config.json',    type: 'doc',   size: '18 KB',  modified: 'Yesterday',     url: '#' },
  { name: 'Revenue_Q2_2026.xlsx',     type: 'sheet', size: '1.1 MB', modified: '2 days ago',    url: '#' },
  { name: 'hero-bg-final.webp',       type: 'img',   size: '287 KB', modified: '3 days ago',    url: '#' },
  { name: 'project-assets.zip',       type: 'zip',   size: '82 MB',  modified: '5 days ago',    url: '#' },
  { name: 'Client_Brief_Jun26.pdf',   type: 'pdf',   size: '620 KB', modified: '1 week ago',    url: '#' },
];

const FILE_ICONS = {
  pdf: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>`,
  doc: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  sheet:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>`,
  img: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  zip: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
  vid: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
};

// ── Init ─────────────────────────────────────────────────────
function driveInit() {
  driveRenderAccounts();
  driveRenderFiles();
}

// ── Render Account Cards ──────────────────────────────────────
function driveRenderAccounts() {
  const container = document.getElementById('driveAccountCards');
  if (!container) return;
  container.innerHTML = DRIVE_ACCOUNTS.map(acc => `
    <div class="drive-account-card ${acc.active ? 'active' : ''}"
         onclick="driveSelectAccount('${acc.id}')">
      <div class="drive-account-avatar">${acc.initials}</div>
      <div class="drive-account-info">
        <span class="drive-account-name">${acc.name}</span>
        <span class="drive-account-email">${acc.email}</span>
      </div>
    </div>
  `).join('');
}

// ── Select Account ────────────────────────────────────────────
function driveSelectAccount(id) {
  DRIVE_ACCOUNTS.forEach(a => a.active = (a.id === id));
  driveRenderAccounts();
  // Hook: reload storage data for selected account here
}

// ── Add Account placeholder ───────────────────────────────────
function driveAddAccount() {
  // Hook: trigger OAuth flow
  console.log('[Drive] Add account triggered');
}

// ── Render Recent Files ───────────────────────────────────────
function driveRenderFiles() {
  const list = document.getElementById('driveFilesList');
  if (!list) return;
  list.innerHTML = DRIVE_RECENT_FILES.map(f => `
    <div class="drive-file-row">
      <div class="drive-file-name-cell">
        <div class="drive-file-icon drive-type-${f.type}">
          ${FILE_ICONS[f.type] || FILE_ICONS.doc}
        </div>
        <span class="drive-file-name" title="${f.name}">${f.name}</span>
      </div>
      <span class="drive-file-type drive-type-${f.type}">${f.type.toUpperCase()}</span>
      <span class="drive-file-size">${f.size}</span>
      <span class="drive-file-date">${f.modified}</span>
      <div class="drive-file-action">
        <button class="drive-file-open" onclick="driveOpenFile('${f.url}')">Open</button>
      </div>
    </div>
  `).join('');
}

// ── Open file ────────────────────────────────────────────────
function driveOpenFile(url) {
  if (url && url !== '#') window.open(url, '_blank', 'noopener');
}

// ── View All ─────────────────────────────────────────────────
function driveOpenAll() {
  window.open('https://drive.google.com', '_blank', 'noopener');
}

// ── Refresh ──────────────────────────────────────────────────
function driveRefresh() {
  const badge = document.getElementById('driveSyncBadge');
  const label = document.getElementById('driveSyncLabel');
  if (!badge || !label) return;

  badge.classList.add('syncing');
  label.textContent = 'Syncing...';

  setTimeout(() => {
    badge.classList.remove('syncing');
    label.textContent = 'Synced';
    // Hook: re-fetch storage stats here
  }, 2000);
}

// ── Force Sync ───────────────────────────────────────────────
function driveForceSync() {
  driveRefresh();
  const last = document.getElementById('driveLastSync');
  if (last) {
    const now = new Date();
    last.textContent = `Today, ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  }
}

// ── Call driveInit() when page-drive becomes active ───────────
// Hook into your existing switchPage() function, e.g.:
//
// function switchPage(pageId) {
//   ...existing logic...
//   if (pageId === 'drive') driveInit();
// }
//
// Or call once on DOMContentLoaded if the page is always present:
// document.addEventListener('DOMContentLoaded', driveInit);