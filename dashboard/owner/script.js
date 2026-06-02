/**
 * MEA ASSISTANT V2 — OWNER DASHBOARD SCRIPT
 * ─────────────────────────────────────────────────────────
 * Deps: ../../assets/theme/config.js
 */

"use strict";

/* ── Session guard ──────────────────────────────────────── */
function getSession() {
  try { return JSON.parse(localStorage.getItem(CONFIG.SESSION_KEY)); }
  catch { return null; }
}

const session = getSession();
if (!session || !session.role) {
  window.location.replace(CONFIG.PATHS.LOGIN);
}
if (session.role !== CONFIG.ROLES.OWNER) {
  window.location.replace(CONFIG.PATHS.DASHBOARD[session.role] || CONFIG.PATHS.DASHBOARD.member);
}

/* ── State ──────────────────────────────────────────────── */
let allUsers   = [];
let activeFilter = "all";
let searchQuery  = "";

/* ── DOM refs ───────────────────────────────────────────── */
const topbarName    = document.getElementById("topbarName");
const tableLoading  = document.getElementById("tableLoading");
const userTable     = document.getElementById("userTable");
const tableBody     = document.getElementById("userTableBody");
const tableEmpty    = document.getElementById("tableEmpty");
const dashAlert     = document.getElementById("dashAlert");

/* ── Init ───────────────────────────────────────────────── */
topbarName.textContent = session.username || "—";
fetchUsers();

/* ── Alert helper ───────────────────────────────────────── */
function showAlert(msg, type = "error") {
  dashAlert.textContent = msg;
  dashAlert.className   = "dash-alert" + (type === "success" ? " success" : "");
  dashAlert.hidden      = false;
  setTimeout(() => { dashAlert.hidden = true; }, 4000);
}

/* ── API caller ─────────────────────────────────────────── */
async function apiFetch(payload) {
  const formData = new URLSearchParams();

  Object.keys(payload).forEach(key => {
    formData.append(key, payload[key]);
  });

  formData.append("sessionUserId", session.userId);

  const res = await fetch(CONFIG.API_URL, {
    method: "POST",
    body: formData
  });

  return await res.json();
}
/* ── Fetch users ────────────────────────────────────────── */
async function fetchUsers() {
  tableLoading.hidden = false;
  userTable.hidden    = true;
  tableEmpty.hidden   = true;

  try {
    const data = await apiFetch({ action: "getUsers" }); 
    console.log(data);
    if (!data.success) throw new Error(data.message);
    allUsers = data.users || [];
    updateStats();
    renderTable();
  } catch (err) {
    console.error(err);
    showAlert("Gagal memuat data: " + err.message);
    tableLoading.hidden = true;
  }
}

/* ── Stats ──────────────────────────────────────────────── */
function updateStats() {
  document.getElementById("statTotal").textContent    = allUsers.length;
  document.getElementById("statPending").textContent  = allUsers.filter(u => u.Status === "pending").length;
  document.getElementById("statApproved").textContent = allUsers.filter(u => u.Status === "approved").length;
  document.getElementById("statOwner").textContent    = allUsers.filter(u => u.Role === "owner").length;
}

/* ── Render ─────────────────────────────────────────────── */
function renderTable() {
  tableLoading.hidden = true;

  let filtered = allUsers;

  if (activeFilter !== "all") {
    filtered = filtered.filter(u =>
      u.Status.toLowerCase() === activeFilter
    );
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(u =>
      (u.FullName || "").toLowerCase().includes(q) ||
      (u.Username  || "").toLowerCase().includes(q) ||
      (u.Email     || "").toLowerCase().includes(q)
    );
  }

  if (!filtered.length) {
    userTable.hidden = true;
    tableEmpty.hidden = false;
    return;
  }

  tableEmpty.hidden = true;
  userTable.hidden  = false;
  tableBody.innerHTML = filtered.map(user => buildRow(user)).join("");
  attachRowListeners();
}

function buildRow(u) {
  const role   = (u.Role   || "member").toLowerCase();
  const status = (u.Status || "pending").toLowerCase();
  const date   = u.CreatedAt
    ? new Date(u.CreatedAt).toLocaleDateString("id-ID", { day:"2-digit", month:"short", year:"numeric" })
    : "—";

  const isOwner    = role === "owner";
  const isSelf     = u.ID === session.userId;
  const canApprove = status === "pending" || status === "rejected";
  const canReject  = status === "approved" || status === "pending";

  return `
<tr data-id="${u.ID}">
  <td class="td-user">
    <div class="td-name">${esc(u.FullName || "—")}</div>
    <div class="td-username">@${esc(u.Username || "—")}</div>
  </td>
  <td class="td-email">${esc(u.Email || "—")}</td>
  <td><span class="role-badge ${role}">${role.toUpperCase()}</span></td>
  <td>
    <span class="status-badge ${status}">
      <span class="status-dot"></span>
      ${status.toUpperCase()}
    </span>
  </td>
  <td class="td-date">${date}</td>
  <td>
    <div class="td-actions">
      ${canApprove && !isSelf ? `<button class="btn-action approve" data-action="approve" data-id="${u.ID}">APPROVE</button>` : ""}
      ${canReject  && !isSelf ? `<button class="btn-action reject"  data-action="reject"  data-id="${u.ID}">REJECT</button>`  : ""}
      ${isSelf ? `<span style="font-family:var(--f-mono);font-size:0.5rem;color:var(--clr-grey)">KAMU</span>` : ""}
    </div>
  </td>
</tr>`;
}

function esc(str) {
  return String(str)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;");
}

/* ── Row action listeners ───────────────────────────────── */
function attachRowListeners() {
  tableBody.querySelectorAll(".btn-action").forEach(btn => {
    btn.addEventListener("click", handleAction);
  });
}

async function handleAction(e) {
  const btn    = e.currentTarget;
  const action = btn.dataset.action;
  const userId = btn.dataset.id;

  if (action === "role") {
    openRoleModal(userId, btn.dataset.name, btn.dataset.role);
    return;
  }

  if (!confirm(`Yakin ingin ${action === "approve" ? "menyetujui" : "menolak"} user ini?`)) return;

  btn.disabled = true;
  try {
    const data = await apiFetch({
      action    : action === "approve" ? "approveUser" : "rejectUser",
      targetId  : userId,
    });
    if (!data.success) throw new Error(data.message);
    showAlert(action === "approve" ? "User berhasil disetujui." : "User berhasil ditolak.", "success");
    await fetchUsers();
  } catch (err) {
    showAlert("Gagal: " + err.message);
    btn.disabled = false;
  }
}

/* ── Filters ────────────────────────────────────────────── */
document.getElementById("filterTabs").addEventListener("click", function(e) {
  const tab = e.target.closest(".filter-tab");
  if (!tab) return;
  document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
  tab.classList.add("active");
  activeFilter = tab.dataset.filter;
  renderTable();
});

document.getElementById("searchInput").addEventListener("input", function() {
  searchQuery = this.value.trim();
  renderTable();
});

/* ── Refresh ────────────────────────────────────────────── */
document.getElementById("refreshBtn").addEventListener("click", fetchUsers);

/* ── Logout ─────────────────────────────────────────────── */
document.getElementById("logoutBtn").addEventListener("click", function() {
  localStorage.removeItem(CONFIG.SESSION_KEY);
  window.location.replace(CONFIG.PATHS.LOGIN);
});
