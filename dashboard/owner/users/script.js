/* ════════════════════════════════════════════════
   Users Management Center — script.js
   dashboard/owner/users/script.js
════════════════════════════════════════════════ */

'use strict';

/* ── State ── */
const state = {
  users: [],
  filtered: [],
  filter: 'all',
  search: '',
  pendingAction: null,
};

/* ── DOM refs ── */
const DOM = {
  statTotal:    () => document.getElementById('statTotal'),
  statActive:   () => document.getElementById('statActive'),
  statPending:  () => document.getElementById('statPending'),
  statRejected: () => document.getElementById('statRejected'),
  usersBody:    () => document.getElementById('usersBody'),
  searchInput:  () => document.getElementById('searchInput'),
  searchClear:  () => document.getElementById('searchClear'),
  filterTabs:   () => document.getElementById('filterTabs'),
  loadingState: () => document.getElementById('loadingState'),
  emptyState:   () => document.getElementById('emptyState'),
  emptyDesc:    () => document.getElementById('emptyDesc'),
  tableFooter:  () => document.getElementById('tableFooter'),
  resultsCount: () => document.getElementById('resultsCount'),
  refreshBtn:   () => document.getElementById('refreshBtn'),
  toast:        () => document.getElementById('toast'),
  /* View modal */
  viewBackdrop: () => document.getElementById('viewModalBackdrop'),
  viewClose:    () => document.getElementById('viewModalClose'),
  viewBody:     () => document.getElementById('viewModalBody'),
  /* Role modal */
  roleBackdrop: () => document.getElementById('roleModalBackdrop'),
  roleClose:    () => document.getElementById('roleModalClose'),
  roleCancel:   () => document.getElementById('roleModalCancel'),
  roleConfirm:  () => document.getElementById('roleModalConfirm'),
  roleSub:      () => document.getElementById('roleModalSub'),
  /* Confirm modal */
  confirmBackdrop: () => document.getElementById('confirmModalBackdrop'),
  confirmClose:    () => document.getElementById('confirmModalClose'),
  confirmCancel:   () => document.getElementById('confirmCancel'),
  confirmOk:       () => document.getElementById('confirmOk'),
  confirmTitle:    () => document.getElementById('confirmTitle'),
  confirmMessage:  () => document.getElementById('confirmMessage'),
};

/* ════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  MEASidebar.init();
  initClock();
  bindEvents();
  loadUsers();
});

/* ── Live Clock ── */
function initClock() {
  const el = document.getElementById('liveClock');
  if (!el) return;
  const tick = () => {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  tick();
  setInterval(tick, 1000);
}

/* ── Bind Events ── */
function bindEvents() {
  /* Search */
  DOM.searchInput().addEventListener('input', (e) => {
    state.search = e.target.value.trim().toLowerCase();
    DOM.searchClear().style.display = state.search ? 'flex' : 'none';
    applyFilter();
  });
  DOM.searchClear().addEventListener('click', () => {
    DOM.searchInput().value = '';
    state.search = '';
    DOM.searchClear().style.display = 'none';
    applyFilter();
  });

  /* Filter tabs */
  DOM.filterTabs().addEventListener('click', (e) => {
    const tab = e.target.closest('.um-filter-tab');
    if (!tab) return;
    document.querySelectorAll('.um-filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    state.filter = tab.dataset.filter;
    applyFilter();
  });

  /* Refresh */
  DOM.refreshBtn().addEventListener('click', loadUsers);

  /* View modal */
  DOM.viewClose().addEventListener('click', () => closeModal('view'));
  DOM.viewBackdrop().addEventListener('click', (e) => {
    if (e.target === DOM.viewBackdrop()) closeModal('view');
  });

  /* Role modal */
  DOM.roleClose().addEventListener('click', () => closeModal('role'));
  DOM.roleCancel().addEventListener('click', () => closeModal('role'));
  DOM.roleBackdrop().addEventListener('click', (e) => {
    if (e.target === DOM.roleBackdrop()) closeModal('role');
  });
  DOM.roleConfirm().addEventListener('click', commitRoleChange);

  /* Confirm modal */
  DOM.confirmClose().addEventListener('click', () => closeModal('confirm'));
  DOM.confirmCancel().addEventListener('click', () => closeModal('confirm'));
  DOM.confirmBackdrop().addEventListener('click', (e) => {
    if (e.target === DOM.confirmBackdrop()) closeModal('confirm');
  });
  DOM.confirmOk().addEventListener('click', () => {
    if (typeof state.pendingAction === 'function') state.pendingAction();
    closeModal('confirm');
  });

  /* ESC key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal('view');
      closeModal('role');
      closeModal('confirm');
    }
  });
}

/* ════════════════════════════════════════════════
   DATA — SUPABASE
════════════════════════════════════════════════ */
async function loadUsers() {
  setLoading(true);
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, username, email, role, status, created_at, last_login')
      .order('created_at', { ascending: false });

    if (error) throw error;

    state.users = data || [];
    updateStats();
    applyFilter();
  } catch (err) {
    console.error('Failed to load users:', err);
    showToast('Failed to load users. Please try again.', 'error');
    setLoading(false);
    showEmpty('Failed to load users. Check your connection and try again.');
  }
}

/* ════════════════════════════════════════════════
   FILTERING
════════════════════════════════════════════════ */
function applyFilter() {
  let list = [...state.users];

  /* Status filter */
  if (state.filter !== 'all') {
    list = list.filter(u => u.status === state.filter);
  }

  /* Search */
  if (state.search) {
    list = list.filter(u => {
      const name  = (u.full_name || '').toLowerCase();
      const uname = (u.username  || '').toLowerCase();
      const email = (u.email     || '').toLowerCase();
      return name.includes(state.search) || uname.includes(state.search) || email.includes(state.search);
    });
  }

  state.filtered = list;
  renderTable();
}

/* ════════════════════════════════════════════════
   RENDER
════════════════════════════════════════════════ */
function renderTable() {
  setLoading(false);
  const tbody = DOM.usersBody();
  tbody.innerHTML = '';

  if (state.filtered.length === 0) {
    const msg = state.search
      ? `No users match "${state.search}".`
      : state.filter !== 'all'
        ? `No ${state.filter} users found.`
        : 'There are no registered users yet.';
    showEmpty(msg);
    DOM.tableFooter().style.display = 'none';
    return;
  }

  DOM.emptyState().style.display = 'none';
  DOM.tableFooter().style.display = 'flex';
  DOM.resultsCount().textContent = `${state.filtered.length} user${state.filtered.length !== 1 ? 's' : ''} shown`;

  state.filtered.forEach((user, idx) => {
    const tr = document.createElement('tr');
    tr.style.animationDelay = `${idx * 0.03}s`;
    tr.innerHTML = buildRow(user);
    tbody.appendChild(tr);
  });

  /* Bind row action buttons */
  tbody.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', handleAction);
  });

  lucide.createIcons();
}

function buildRow(u) {
  const initials   = getInitials(u.full_name);
  const avatarClass = `um-avatar--${u.role || 'member'}`;
  const roleBadge  = buildRoleBadge(u.role);
  const statusBadge = buildStatusBadge(u.status);
  const createdAt  = formatDate(u.created_at);
  const lastLogin  = u.last_login ? formatDate(u.last_login) : '<span class="um-date um-date--never">Never</span>';

  return `
    <td>
      <div class="um-user-cell">
        <div class="um-avatar ${avatarClass}">${initials}</div>
        <span class="um-full-name">${esc(u.full_name || '—')}</span>
      </div>
    </td>
    <td><span class="um-username">@${esc(u.username || '—')}</span></td>
    <td><span class="um-email">${esc(u.email || '—')}</span></td>
    <td>${roleBadge}</td>
    <td>${statusBadge}</td>
    <td><span class="um-date">${createdAt}</span></td>
    <td>${lastLogin}</td>
    <td>
      <div class="um-actions">
        <button class="um-action-btn" data-action="view" data-id="${u.id}" title="View details">
          <i data-lucide="eye"></i>
        </button>
        <button class="um-action-btn um-action-btn--approve" data-action="approve" data-id="${u.id}" title="Approve user">
          <i data-lucide="check"></i>
        </button>
        <button class="um-action-btn um-action-btn--reject" data-action="reject" data-id="${u.id}" title="Reject user">
          <i data-lucide="ban"></i>
        </button>
        <button class="um-action-btn um-action-btn--role" data-action="role" data-id="${u.id}" title="Change role">
          <i data-lucide="shield"></i>
        </button>
        <button class="um-action-btn um-action-btn--delete" data-action="delete" data-id="${u.id}" title="Delete user">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    </td>
  `;
}

function buildRoleBadge(role) {
  const r = role || 'member';
  const icons = { owner: 'crown', admin: 'shield-check', member: 'user' };
  return `<span class="um-role-badge um-role-badge--${r}"><i data-lucide="${icons[r] || 'user'}"></i>${esc(r)}</span>`;
}

function buildStatusBadge(status) {
  const s = status || 'pending';
  return `<span class="um-status-badge um-status-badge--${s}"><span class="um-status-dot"></span>${esc(s)}</span>`;
}

/* ════════════════════════════════════════════════
   ACTIONS
════════════════════════════════════════════════ */
function handleAction(e) {
  const btn    = e.currentTarget;
  const action = btn.dataset.action;
  const id     = btn.dataset.id;
  const user   = state.users.find(u => u.id === id);
  if (!user) return;

  switch (action) {
    case 'view':    openViewModal(user);   break;
    case 'approve': confirmApprove(user);  break;
    case 'reject':  confirmReject(user);   break;
    case 'role':    openRoleModal(user);   break;
    case 'delete':  confirmDelete(user);   break;
  }
}

/* Approve */
function confirmApprove(user) {
  if (user.status === 'active') {
    showToast(`${user.full_name} is already active.`, 'info');
    return;
  }
  openConfirmModal(
    'Approve User',
    'alert-triangle',
    `Set <strong>${esc(user.full_name)}</strong> status to <strong>active</strong>?`,
    async () => {
      await updateUserStatus(user.id, 'active');
    }
  );
}

/* Reject */
function confirmReject(user) {
  if (user.status === 'rejected') {
    showToast(`${user.full_name} is already rejected.`, 'info');
    return;
  }
  openConfirmModal(
    'Reject User',
    'alert-triangle',
    `Set <strong>${esc(user.full_name)}</strong> status to <strong>rejected</strong>? They will lose access.`,
    async () => {
      await updateUserStatus(user.id, 'rejected');
    }
  );
}

/* Delete */
function confirmDelete(user) {
  openConfirmModal(
    'Delete User',
    'trash-2',
    `Permanently delete <strong>${esc(user.full_name)}</strong>? This action cannot be undone.`,
    async () => {
      await deleteUser(user.id, user.full_name);
    }
  );
  DOM.confirmOk().classList.add('um-btn--danger');
}

/* Role modal */
function openRoleModal(user) {
  DOM.roleSub().textContent = `Changing role for ${user.full_name}.`;
  document.querySelectorAll('input[name="roleSelect"]').forEach(r => {
    r.checked = r.value === (user.role || 'member');
  });
  state.pendingRoleUser = user;
  DOM.roleBackdrop().style.display = 'flex';
  lucide.createIcons();
}

async function commitRoleChange() {
  const selected = document.querySelector('input[name="roleSelect"]:checked');
  if (!selected) return;
  const user = state.pendingRoleUser;
  if (!user) return;
  closeModal('role');
  await updateUserRole(user.id, selected.value, user.full_name);
}

/* View modal */
function openViewModal(user) {
  const avatarClass = `um-avatar--${user.role || 'member'}`;
  DOM.viewBody().innerHTML = `
    <div class="um-detail-user-header">
      <div class="um-avatar um-detail-avatar ${avatarClass}" style="width:48px;height:48px;font-size:18px;">
        ${getInitials(user.full_name)}
      </div>
      <div class="um-detail-user-meta">
        <div class="um-detail-user-name">${esc(user.full_name || '—')}</div>
        <div class="um-detail-user-email">${esc(user.email || '—')}</div>
      </div>
      <div style="display:flex;gap:6px;flex-shrink:0;">
        ${buildRoleBadge(user.role)}
        ${buildStatusBadge(user.status)}
      </div>
    </div>
    <div class="um-detail-grid">
      <div class="um-detail-item">
        <div class="um-detail-label">User ID</div>
        <div class="um-detail-value um-detail-value--mono">${esc(user.id)}</div>
      </div>
      <div class="um-detail-item">
        <div class="um-detail-label">Username</div>
        <div class="um-detail-value um-detail-value--mono">@${esc(user.username || '—')}</div>
      </div>
      <div class="um-detail-item um-detail-item--full">
        <div class="um-detail-label">Email</div>
        <div class="um-detail-value">${esc(user.email || '—')}</div>
      </div>
      <div class="um-detail-item">
        <div class="um-detail-label">Role</div>
        <div class="um-detail-value">${buildRoleBadge(user.role)}</div>
      </div>
      <div class="um-detail-item">
        <div class="um-detail-label">Status</div>
        <div class="um-detail-value">${buildStatusBadge(user.status)}</div>
      </div>
      <div class="um-detail-item">
        <div class="um-detail-label">Created At</div>
        <div class="um-detail-value">${formatDate(user.created_at)}</div>
      </div>
      <div class="um-detail-item">
        <div class="um-detail-label">Last Login</div>
        <div class="um-detail-value">${user.last_login ? formatDate(user.last_login) : 'Never'}</div>
      </div>
    </div>
  `;
  DOM.viewBackdrop().style.display = 'flex';
  lucide.createIcons();
}

/* ════════════════════════════════════════════════
   MEASupabase MUTATIONS
════════════════════════════════════════════════ */
async function updateUserStatus(id, status) {
  try {
    const { error } = await MEASupabase
      .from('users')
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    const user = state.users.find(u => u.id === id);
    if (user) user.status = status;
    updateStats();
    applyFilter();
    showToast(`User ${status === 'active' ? 'approved' : 'rejected'} successfully.`, 'success');
  } catch (err) {
    console.error('Status update failed:', err);
    showToast('Failed to update user status.', 'error');
  }
}

async function updateUserRole(id, role, name) {
  try {
    const { error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', id);

    if (error) throw error;

    const user = state.users.find(u => u.id === id);
    if (user) user.role = role;
    applyFilter();
    showToast(`Role updated to "${role}" for ${name}.`, 'success');
  } catch (err) {
    console.error('Role update failed:', err);
    showToast('Failed to update user role.', 'error');
  }
}

async function deleteUser(id, name) {
  try {
    const { error } = await MEASupabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;

    state.users = state.users.filter(u => u.id !== id);
    updateStats();
    applyFilter();
    showToast(`${name} has been deleted.`, 'success');
  } catch (err) {
    console.error('Delete failed:', err);
    showToast('Failed to delete user.', 'error');
  }
}

/* ════════════════════════════════════════════════
   STATISTICS
════════════════════════════════════════════════ */
function updateStats() {
  const all      = state.users.length;
  const active   = state.users.filter(u => u.status === 'active').length;
  const pending  = state.users.filter(u => u.status === 'pending').length;
  const rejected = state.users.filter(u => u.status === 'rejected').length;

  animateCount(DOM.statTotal(),    all);
  animateCount(DOM.statActive(),   active);
  animateCount(DOM.statPending(),  pending);
  animateCount(DOM.statRejected(), rejected);
}

function animateCount(el, target) {
  if (!el) return;
  const start    = parseInt(el.textContent) || 0;
  const duration = 400;
  const startTime = performance.now();
  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    el.textContent = Math.round(start + (target - start) * easeOut(progress));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

/* ════════════════════════════════════════════════
   UI HELPERS
════════════════════════════════════════════════ */
function setLoading(show) {
  DOM.loadingState().style.display = show ? 'flex' : 'none';
  if (show) {
    DOM.emptyState().style.display = 'none';
    DOM.usersBody().innerHTML = '';
    DOM.tableFooter().style.display = 'none';
  }
}

function showEmpty(msg) {
  DOM.emptyState().style.display = 'flex';
  DOM.emptyDesc().textContent = msg;
  DOM.loadingState().style.display = 'none';
  lucide.createIcons();
}

function openConfirmModal(title, icon, message, action) {
  DOM.confirmTitle().innerHTML = `<i data-lucide="${icon}"></i> ${title}`;
  DOM.confirmMessage().innerHTML = message;
  DOM.confirmOk().className = 'um-btn um-btn--danger';
  state.pendingAction = action;
  DOM.confirmBackdrop().style.display = 'flex';
  lucide.createIcons();
}

function closeModal(which) {
  const map = {
    view:    DOM.viewBackdrop,
    role:    DOM.roleBackdrop,
    confirm: DOM.confirmBackdrop,
  };
  const el = map[which]?.();
  if (el) el.style.display = 'none';
  if (which === 'confirm') state.pendingAction = null;
}

let toastTimer;
function showToast(msg, type = 'info') {
  const el = DOM.toast();
  el.textContent = msg;
  el.className = `um-toast um-toast--${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

/* ════════════════════════════════════════════════
   UTILITIES
════════════════════════════════════════════════ */
function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function esc(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
